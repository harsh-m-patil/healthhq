"use server";

import type { FeedEntry } from "@extractus/feed-extractor";
import z from "zod";
import { aiSummary } from "./ai";
import { getArticle, redis } from "./article";
import { getFeed } from "./feed";

const feedSchema = z.object({
  url: z.url(),
});

type feedFormData = z.infer<typeof feedSchema>;

export interface ActionResponse {
  success: boolean;
  message: string;
  url?: string;
  results?: {
    article: string | null | undefined;
    summary: string | null | undefined;
  }[];
  errors?: {
    [K in keyof feedFormData]?: string[];
  };
  feed: FeedEntry[] | null | undefined;
}

export async function getFeedAction(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const rawData: feedFormData = {
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
    const results = feed?.map(async (entry) => {
      // biome-ignore lint/style/noNonNullAssertion: We know it exists
      const article = await getArticle({ url: entry.link! });
      let summary: string;

      const cacheKey = `${entry.link}:summary`;
      const cachedSummary: string | null = await redis.get(cacheKey);
      if (cachedSummary) {
        return { article: article?.content, summary: cachedSummary };
      } else {
        console.log("No cached summary, generating new one...");
        summary = article?.content
          ? await aiSummary({ content: article.content })
          : `**Fallback**:  
          ${article?.excerpt}`;
        redis.set(cacheKey, summary, { ex: 60 * 60 * 24 });
      }
      return { article: article?.content, summary };
    });

    const finalResults = results ? await Promise.all(results) : [];

    return {
      success: true,
      feed,
      message: "Feed URL is valid",
      results: finalResults,
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
