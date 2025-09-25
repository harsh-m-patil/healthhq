"use client";
import { useActionState } from "react";
import { FeedList } from "@/components/custom/feed-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFeedAction } from "@/lib/actions";

export default function Page() {
  const [state, action, isPending] = useActionState(getFeedAction, null);

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
        <Button type="submit" disabled={isPending}>
          {isPending ? "loading..." : "Get Feed"}
        </Button>
      </form>
      <FeedList feed={state?.feed} isPending={isPending} />
    </div>
  );
}
