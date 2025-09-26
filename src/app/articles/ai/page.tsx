import { Article } from "@/components/custom/article";

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

  return (
    <div>
      <div className="max-w-6xl mx-auto my-12 border px-4 py-2">
        <Article url={url} />
      </div>
    </div>
  );
}
