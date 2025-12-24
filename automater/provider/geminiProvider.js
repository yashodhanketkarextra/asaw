import { GoogleGenAI as Gemini } from "@google/genai";
import { config } from "dotenv";

config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const gemini = new Gemini({ apiKey: geminiApiKey });

/**
 * Rewrites article
 *
 * @param {Blog} article
 * @param {RefArticle[]} refs
 *
 * @returns {Promise<string>}
 */
export async function rewriteArticle(article, refs) {
  const prompt = `
You are a professional SEO content editor.

TASK:
Rewrite the original article so it is:
- Fully rephrased (no plagiarism)
- Well structured with headings
- Clear and professional
- Similar in tone and formatting to the reference articles
- Factually consistent with the original

DO NOT copy sentences from references.

Original:
${article.content}

References:
${refs.map((r) => r.content).join("\n\n")}

OUTPUT REQUIREMENTS:
- Use HTML formatting
- Use <h2>, <h3>, <p>, <ul> where appropriate
- Do NOT include references section
`;

  const res = await gemini.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      maxOutputTokens: 4096,
    },
  });

  if (!res.text) {
    throw new Error("Failed to generate content");
  }

  return res.text
    .replace(/```html|```/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .trim();
}
