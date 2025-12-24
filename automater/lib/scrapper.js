import * as cheerio from "cheerio";
import { API, BASE_URL } from "./api";

const api = new API();

/**
 * Returns last page url
 *
 * @returns Promise<string[]>
 */
async function getPageLinks() {
  if (!BASE_URL) throw new Error("BASE_URL is not defined. Check .env file");

  const { data } = await api.fetchPages(BASE_URL);
  const $ = cheerio.load(data);

  let lastPage = 1;
  const pageLinks = [];

  $('[class="page-numbers"]').each((_, el) => {
    const num = parseInt($(el).text().trim(), 10);
    if (!isNaN(num)) {
      lastPage = Math.max(lastPage, num);
    }
  });

  pageLinks.push(BASE_URL);
  for (let i = 1; i <= lastPage; i++) {
    pageLinks.push(`${BASE_URL}page/${i}/`);
  }

  return pageLinks;
}

/**
 * Returns 5 article links
 *
 * @param {string[]} pageLinks
 * @param {number} limit
 *
 * @return {Promise<string[]>}
 */
async function getArticleLinks(pageLinks, limit) {
  const articleLinks = [];
  while (pageLinks.length > 0 && articleLinks.length < limit) {
    let curr = pageLinks.pop();
    if (curr === undefined) throw new Error("Error while fetching page");

    const { data } = await api.fetchPages(curr);
    const $ = cheerio.load(data);

    $(".entry-title a")
      .get()
      .reverse()
      .forEach((el) => {
        const href = $(el).attr("href");
        if (href && articleLinks.length < limit) {
          articleLinks.push(href);
        }
      });
  }

  return articleLinks;
}

/**
 * @param {string} url
 *
 * @returns {Promise<Blog>}
 */
async function getArticleData(url) {
  const { data } = await api.fetchArticles(url);
  const $ = cheerio.load(data);
  const title = $("h1").first().text().trim();
  const content = $(".e-con-inner").html();

  return {
    title: title,
    content: content,
    original_url: url,
    version: "original",
  };
}

/**
 * Returns array of articles
 *
 * @returns {Promise<Blog[]>}
 */
async function getArticles() {
  const pageLinks = await getPageLinks();
  const articleLinks = await getArticleLinks(pageLinks, 5);
  const articles = await Promise.all(
    articleLinks.map((url) => {
      const data = getArticleData(url);
      return data;
    }),
  );

  return articles;
}

/**
 * Store array locally
 */
export async function storeArticles() {
  await getArticles().then(api.storeArticles).catch(console.error);
}
