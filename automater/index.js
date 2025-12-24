import { config } from "dotenv";
import { laravelApi } from "./lib/limter.js";
import { rewriteArticle } from "./provider/geminiProvider.js";
import { searchGoogle } from "./provider/googleProvider.js";
import { articleScrapper, publishArticle } from "./provider/articleProvider.js";

config();

export const API_URL = process.env.API_URL;

/**
 * @returns {Promise<Blog>}
 */
async function getLatest() {
  if (!API_URL) throw new Error("API_URL is not defined");
  const { data } = await laravelApi.get(`${API_URL}articles`);
  return data.data[0];
}

(async () => {
  const original = await getLatest();
  const results = await searchGoogle(original.title);

  /** @type {RefArticle[]} */
  const refs = [];
  for (const r of results) {
    refs.push({
      ...(await articleScrapper(r.link)),
      link: r.link,
    });
  }

  const rewritten = await rewriteArticle(original, refs);
  await publishArticle(original, rewritten, refs);

  console.log("Done");
})();
