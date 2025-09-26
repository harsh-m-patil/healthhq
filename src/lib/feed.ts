import { extract } from "@extractus/feed-extractor";

export async function getFeed(url: string) {
  try {
    const data = await extract(url);
    return data.entries;
  } catch (error) {
    console.error("Error fetching feed");
    return null;
  }
}
