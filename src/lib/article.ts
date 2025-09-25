import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import DOMPurify from "dompurify";

export async function getArticle(options: { url: string }) {
  try {
    const response = await fetch(options.url, {
      next: { revalidate: 60 * 60 * 24 },
    })

    const html = await response.text();
    const { document } = parseHTML(html);
    [...document.getElementsByTagName("img")].forEach((link) => {
      link.src = new URL(link.src, options.url).href;
    });
    [...document.getElementsByTagName("a")].forEach((link) => {
      link.href = new URL(link.href, options.url).href;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener nofollow");
    });

    let reader: Readability | null = null;

    try {
      reader = new Readability(document);
    } catch (error) {
      console.error("Readability error", (error as Error).message, options.url);
    }

    const article = reader?.parse();
    if (article?.content) {
      const { window } = parseHTML("");
      const purify = DOMPurify(window);
      const cleanArticle = purify.sanitize(article.content);
      article.content = cleanArticle;
    }


    return article;
  } catch (error) {
    return null;
  }
}
