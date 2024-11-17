// src/utils/networkUtils.js

// Utility to measure network latency by sending a request to a known endpoint
export const measureNetworkLatency = async (rpcUrl) => {
  const startTime = Date.now();
  
  try {
    const response = await fetch(rpcUrl);
    if (response.ok) {
      const endTime = Date.now();
      return endTime - startTime; // Latency in milliseconds
    }
  } catch (error) {
    console.error("Network error:", error);
    return null; // Return null if error occurs
  }
};

// Retry function for API calls (for transactions or smart contract interactions)
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left.`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay);
    } else {
      console.error("Max retries reached:", error);
      throw error; // Throw the error after max retries
    }
  }
};

// Check for API rate limiting (you may need to adjust for specific Tron RPC API rate limits)
export const isRateLimited = (response) => {
  // Assuming rate limit response has a status code of 429 (Too many requests)
  return response && response.status === 429;
};
