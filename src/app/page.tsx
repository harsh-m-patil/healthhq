"use client";
import { Rss } from "lucide-react";
import { useActionState, useState } from "react";
import { FeedList } from "@/components/custom/feed-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getFeedAction } from "@/lib/actions";

const PAGE_LENGTH = 4;

export default function Page() {
  const [state, action, isPending] = useActionState(getFeedAction, null);
  const [page, setPage] = useState(1);
  const length = state?.feed?.length ?? 0;
  const pages = Math.ceil(length / PAGE_LENGTH);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4 p-4 mt-6">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="from-primary/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Cut Through the Medical Jargon
        </h1>
      </div>
      <form action={action} className="flex gap-4 justify-between items-center">
        <div className="w-full">
          <Input
            id="url"
            name="url"
            placeholder="Enter RSS feed URL"
            type="url"
            required
            className={state?.errors?.url ? "border-red-500 w-full" : "w-full"}
          />
          {state?.errors?.url && (
            <p className="text-red-500">{state.errors.url[0]}</p>
          )}
        </div>
        <Button
          className="flex items-center gap-2"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "loading..." : "Get Feed"}
          <Rss className="size-4" />
        </Button>
      </form>
      <FeedList
        feed={state?.feed}
        isPending={isPending}
        page={page}
        pageLength={PAGE_LENGTH}
        results={state?.results}
      />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={page === 1 || pages === 0}
              className={
                page === 1 || pages === 0
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          {new Array(pages).fill(null).map((_, i) => (
            <PaginationItem
              onClick={() => setPage(i + 1)}
              // biome-ignore lint/suspicious/noArrayIndexKey: Low risk here as items do not change
              key={i}
            >
              <PaginationLink isActive={page === i + 1}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
              aria-disabled={page === pages || pages === 0}
              className={
                page === pages || pages === 0
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
