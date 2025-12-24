import { config } from "dotenv";
import { writeFileSync } from "node:fs";
import { laravelApi as api } from "./limter.js";

config();

export const BASE_URL = process.env.BASE_URL;

// TODO: Add specific outputs to methods
export class API {
  /**
   * @param {string} url
   */
  async fetchPages(url) {
    return await api.get(url);
  }

  /**
   * @param {string} url
   */
  async fetchArticles(url) {
    return api.get(url);
  }

  /**
   * @param {Blog[]} articles
   */
  async storeArticles(articles) {
    const data = JSON.stringify(articles, null, 2);
    writeFileSync("./output/articles.json", data, "utf8");
  }
}
