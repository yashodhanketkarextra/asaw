import { config } from "dotenv";
import { googleApi } from "../lib/limter.js";

config();

/**
 * Searches google for query
 *
 * @param {string} query
 */
export async function searchGoogle(query) {
  const queryJSON = JSON.stringify({
    q: query,
    gl: "in",
  });

  const { data } = await googleApi.post(
    "https://google.serper.dev/search",
    queryJSON,
    {
      maxBodyLength: Infinity,
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  return data.organic
    .filter((r) => !r.link.includes("beyondcharts.com"))
    .slice(0, 2);
}
