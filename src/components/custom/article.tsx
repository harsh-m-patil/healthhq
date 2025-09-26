import Link from "next/link";
import { Suspense } from "react";
import { AiArticle } from "@/components/custom/ai-article";
import LoadingArticle from "@/components/custom/article-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redis } from "@/lib/article";
import type { Article as ArticleType } from "@/lib/types";

export async function Article({ url }: { url: string }) {
  return (
    <Tabs defaultValue="ai" className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="ai">AI Rewrite</TabsTrigger>
          <TabsTrigger value="og">Orignal</TabsTrigger>
        </TabsList>
        <Button variant="outline">
          <Link href={url} target="_blank" rel="noopener noreferrer">
            Orignal Link
          </Link>
        </Button>
      </div>
      <Suspense fallback={<LoadingArticle />}>
        <ArticleTab url={url} />
      </Suspense>
    </Tabs>
  );
}

async function ArticleTab({ url }: { url: string }) {
  const article = (await redis.get(`${url}:article`)) as ArticleType;
  return (
    <>
      <TabsContent value="ai">
        <Suspense fallback={<LoadingArticle />}>
          <AiArticle content={article?.content} url={url} />
        </Suspense>
      </TabsContent>
      <TabsContent value="og">
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized by us
          dangerouslySetInnerHTML={{
            __html: article?.content ?? "<p>No article found</p>",
          }}
        />
      </TabsContent>
    </>
  );
}
