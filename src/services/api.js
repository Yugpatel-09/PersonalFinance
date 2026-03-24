import axios from 'axios';

const BASE_URL = 'https://v6.exchangerate-api.com/v6';
// Free tier API key — replace with your own from exchangerate-api.com
const API_KEY = 'YOUR_API_KEY_HERE';

const client = axios.create({ baseURL: BASE_URL, timeout: 8000 });

export async function fetchExchangeRates(baseCurrency = 'USD') {
  try {
    const { data } = await client.get(`/${API_KEY}/latest/${baseCurrency}`);
    return data;
  } catch {
    // Return fallback rates so the app still works without a key
    return {
      conversion_rates: {
        USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.1, JPY: 149.5,
        CAD: 1.36, AUD: 1.53, CHF: 0.88, CNY: 7.19, BRL: 4.97,
      },
    };
  }
}
