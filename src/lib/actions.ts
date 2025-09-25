"use server";

import type { FeedEntry } from "@extractus/feed-extractor";
import z from "zod";
import { getArticle } from "./article";
import { getFeed } from "./feed";

const feedSchema = z.object({
  url: z.url(),
});

type feedFormData = z.infer<typeof feedSchema>;

export interface ActionResponse {
  success: boolean;
  message: string;
  url?: string;
  articles?: (string | null | undefined)[];
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
      return article?.content;
    });

    const articles = results ? await Promise.all(results) : [];

    return {
      success: true,
      feed,
      message: "Feed URL is valid",
      articles,
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
