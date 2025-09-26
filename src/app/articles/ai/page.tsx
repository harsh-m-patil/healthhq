import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redis } from "@/lib/article";
import type { Article } from "@/lib/types";
import { aiRewrite } from "@/lib/ai";
import { Streamdown } from "streamdown";

type SearchParams = Promise<{ url: string }>;
export default async function ArticlePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { url } = await searchParams;

  if (!url) {
    return <div>No URL provided</div>;
  }

  const [article, summary] = await Promise.all([
    redis.get(`${url}:article`) as unknown as Article,
    redis.get(`${url}:summary`) as unknown as string,
  ]);

  let rewrite: string;

  if (!article?.content) {
    rewrite = `# Article unavailable 
    But you can still read the orignal article [here](${url}) 
    `;
  } else {
    rewrite = await aiRewrite({ content: article?.content });
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto my-12 border px-4 py-2">
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
          <TabsContent value="ai">
            <Streamdown>{`
              ## TLDR
              ${summary}  
                
              ## Rewrite
              ${rewrite}
              `}</Streamdown>
          </TabsContent>
          <TabsContent value="og">
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized by us
              dangerouslySetInnerHTML={{
                __html: article?.content ?? "<p>No article found</p>",
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
