export type Article =
  | {
    title: string | null | undefined;
    content: string | null | undefined;
    textContent: string | null | undefined;
    length: number | null | undefined;
    excerpt: string | null | undefined;
    byline: string | null | undefined;
    dir: string | null | undefined;
    siteName: string | null | undefined;
    lang: string | null | undefined;
    publishedTime: string | null | undefined;
  }
  | null
  | undefined;
