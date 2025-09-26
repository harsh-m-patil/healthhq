import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingArticle() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-9/12" />
        <Skeleton className="h-4 w-8/12" />
      </div>
    </>
  );
}
