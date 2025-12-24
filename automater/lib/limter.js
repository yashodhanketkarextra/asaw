import axios from "axios";
import rateLimit from "axios-rate-limit";

/**
 * Rate limter helper
 *
 * @param {{rpm: number, maxConcurrent?: number}} options
 *
 */
function createLimiter({ rpm, maxConcurrent = 1 }) {
  return rateLimit(axios.create(), {
    maxRequests: maxConcurrent,
    perMilliseconds: Math.ceil(60000 / rpm),
  });
}

const laravelApi = createLimiter({ rpm: 120 });
const googleApi = createLimiter({ rpm: 60 });
const scrapeApi = createLimiter({ rpm: 30 });
const geminiApi = createLimiter({ rpm: 2 });

export { laravelApi, googleApi, scrapeApi, geminiApi };
