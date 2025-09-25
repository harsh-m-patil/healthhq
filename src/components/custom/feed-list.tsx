import type { FeedEntry } from "@extractus/feed-extractor";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedList({
  feed,
  isPending,
}: {
  feed: FeedEntry[] | null | undefined;
  isPending: boolean;
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
      {feed?.map((item) => {
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
          </Card>
        );
      })}
    </>
  );
}
