import articles from "./output/articles.json" with { type: "json" };
import { laravelApi } from "./lib/limter.js";

const api = "http://localhost:8000/api/articles";

(async () => {
  for (const article of articles) {
    try {
      await laravelApi.post(api, article);
      console.log("Inserted:", article.title);
    } catch (err) {
      console.error(err.message);
    }
  }
})();
