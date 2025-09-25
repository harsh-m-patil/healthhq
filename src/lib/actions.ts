"use server";

import z from "zod";
import { getFeed } from "./feed";
import { FeedEntry } from "@extractus/feed-extractor";

const feedSchema = z.object({
  url: z.url(),
});

type feedFormData = z.infer<typeof feedSchema>;

export interface ActionResponse {
  success: boolean;
  message: string;
  url?: string;
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

    return {
      success: true,
      feed,
      message: "Feed URL is valid",
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
