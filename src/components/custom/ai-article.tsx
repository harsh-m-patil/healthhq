import { Streamdown } from "streamdown";
import { aiRewrite } from "@/lib/ai";
import { redis } from "@/lib/article";

export async function AiArticle({
  url,
  content,
}: {
  url: string;
  content: string | null | undefined;
}) {
  if (!content) {
    return null;
  }

  let rewrite = "";
  const cachedArticle: string | null = await redis.get(`${url}:ai-article`);
  if (cachedArticle) {
    rewrite = cachedArticle;
  } else {
    rewrite = await aiRewrite({ content });
    redis.set(`${url}:ai-article`, rewrite, { ex: Infinity });
  }
  return <Streamdown>{rewrite}</Streamdown>;
}
