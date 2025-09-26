import type { FeedEntry } from "@extractus/feed-extractor";
import Link from "next/link";
import { Streamdown } from "streamdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription className="pr-10">
                {item.description}
              </CardDescription>
              <CardAction>
                <div className="flex flex-col justify-end gap-4 items-end">
                  <Button variant="outline">
                    <Link
                      // biome-ignore lint/style/noNonNullAssertion: we know this exists
                      href={item.link!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read Original
                    </Link>
                  </Button>
                  <Button variant="secondary">
                    <Link
                      href={{
                        pathname: "/articles/ai",
                        query: { url: item.link },
                      }}
                    >
                      Read AI Rewrite
                    </Link>
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                className="outline px-4 rounded-md"
              >
                <AccordionItem value="item-1">
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
