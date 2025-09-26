import type { FeedEntry } from "@extractus/feed-extractor";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Streamdown } from "streamdown";

export function FeedList({
  feed,
  isPending,
  page,
  pageLength,
  results,
}: {
  feed: FeedEntry[] | null | undefined;
  isPending: boolean;
  page: number;
  pageLength: number;
  results?: {
    article: string | null | undefined;
    summary: string | null | undefined;
  }[];
}) {
  if (isPending) {
    return (
      <>
        {Array.from({ length: 8 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Low risk here as items do not change
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-[400px] bg-primary/20" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-full bg-primary/20" />
              </CardDescription>
              <CardAction>
                <Skeleton className="h-4 w-[100px] bg-primary/20" />
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col gap-4 p-4 mt-12">
        <p className="text-center text-lg">No feed available</p>
      </div>
    );
  }

  return (
    <>
      {feed?.slice(page - 1, page + pageLength - 1).map((item, i) => {
        return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <CardAction>
                <Link
                  href={item.link ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-sm text-primary"
                >
                  Article
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Article</AccordionTrigger>
                  <AccordionContent>
                    {results ? (
                      <div
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: html is sanitized using DOMPurify
                        dangerouslySetInnerHTML={{
                          __html: results[i].article as string,
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Summary</AccordionTrigger>
                  <AccordionContent>
                    {results ? (
                      <Streamdown>{results[i].summary}</Streamdown>
                    ) : (
                      ""
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
