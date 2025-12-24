import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { laravelApi, scrapeApi } from "../lib/limter.js";
import { config } from "dotenv";

config();

const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL is not defined");

/**
 * @param {string} html
 * @returns {string}
 */
function clearHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, "");
}

/**
 * @param {string} url
 *
 * @returns {Promise<RefArticle>}
 */
export async function articleScrapper(url) {
  const html = await scrapeApi.get(url).then((r) => clearHtml(r.data));
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.title || !article.textContent) {
    throw new Error("Article is not valid");
  }

  return {
    title: article.title,
    content: article.textContent,
  };
}

/**
 * @param {Blog} article
 * @param {string} content
 * @param {RefArticle[]} refs
 */
export async function publishArticle(article, content, refs) {
  /** @type {Blog} */
  const rewrittenArticle = {
    title: article.title,
    content:
      content +
      `
<hr>
<h3>References</h3>
<ul>
${refs.map((r) => `<li><a href="${article.original_url}">${r.title}</a></li>`).join("\n")}
</ul>
`,
    original_url: article.original_url,
    version: "rewritten",
    parent_article_id: article.id,
  };

  await laravelApi.post(API_URL + "articles", rewrittenArticle);
}
