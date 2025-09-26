import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const model = google("gemini-2.5-flash");

export async function aiHelper(options: { prompt: string; system: string }) {
  try {
    // NOTE: retries up to 2 times by default
    const response = await generateText({
      system: options.system,
      model,
      messages: [{ role: "user", content: options.prompt.slice(0, 5000) }],
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "";
  }
}

export async function aiSummary(options: { content: string }) {
  const systemPrompt = `You are a helpful summarization assistant that summarizes
  complex health articles into simple concise summaries and also extracts 3 key takeaways.
  Use a markdown table format for the key takeaways with two columns: "Key Takeaway" and "Explanation".
    `;

  const prompt = `
  <article>
  ${options.content}
  </article>
  `;

  return aiHelper({ prompt, system: systemPrompt });
}

export async function aiRewrite(options: { content: string }) {
  const systemPrompt = ` You are a helper assistant that rewrites complex medical field
  related articles and rewrites them in simple language so that normal folks can understand
  it.

  Try to explain in detail.
  Use markdown to properly format the rewrite and to make sure it is easy to understand.
  Use markdown heading tags to clearly define the text heirarchy.
  `;

  const prompt = `
    <article>
    ${options.content}
    </article>
  `;

  return aiHelper({ prompt, system: systemPrompt });
}
