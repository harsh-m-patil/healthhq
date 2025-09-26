"use server";

import type { FeedEntry } from "@extractus/feed-extractor";
import z from "zod";
import { aiSummary } from "./ai";
import { getArticle, redis } from "./article";
import { getFeed } from "./feed";

const feedSchema = z.object({
  url: z.url(),
});

type FeedFormData = z.infer<typeof feedSchema>;

export interface ActionResponse {
  success: boolean;
  message: string;
  url?: string;
  results?: {
    article: string | null | undefined;
    summary: string | null | undefined;
  }[];
  errors?: {
    [K in keyof FeedFormData]?: string[];
  };
  feed: FeedEntry[] | null | undefined;
}

export async function getFeedAction(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const rawData: FeedFormData = {
      url: formData.get("url") as string,
    };

    const validatedData = feedSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation failed",
        feed: null,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const feed = await getFeed(validatedData.data.url);

    if (!feed || feed.length === 0) {
      return {
        success: true,
        feed: [],
        results: [],
        message: "No entries found in feed",
      };
    }

    const results = await Promise.all(
      feed.map(async (entry) => {
        if (!entry.link) return { article: null, summary: null };

        try {
          const cacheKey = `${entry.link}:summary`;
          const cachedSummary: string | null = await redis.get(cacheKey);

          if (cachedSummary) {
            return { article: null, summary: cachedSummary };
          }

          const article = await getArticle({ url: entry.link });

          let summary: string | null = null;
          if (article?.content) {
            summary = await aiSummary({ content: article.content });
          }

          if (!summary || summary.trim() === "") {
            summary = `**Fallback**:\n${article?.excerpt ?? "No excerpt available"}`;
          }

          // cache asynchronously, no need to block response
          void redis.set(cacheKey, summary, { ex: 60 * 60 * 24 });

          return { article: article?.content, summary };
        } catch (err) {
          console.error(`Error processing entry: ${entry.link}`, err);
          return {
            article: null,
            summary: "**Error summarizing this article**",
          };
        }
      }),
    );

    return {
      success: true,
      feed,
      message: "Feed processed successfully",
      results,
    };
  } catch (error) {
    console.error("Error in getFeedAction:", error);
    return {
      success: false,
      feed: null,
      message: "An unexpected error occurred",
    };
  }
}
