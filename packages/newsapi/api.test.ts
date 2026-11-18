import type { NewsApiContext } from './context';
import { listSources } from './endpoints/read';

const apiKey = process.env.NEWSAPI_API_KEY;
if (!apiKey) {
	console.warn('NEWSAPI_API_KEY is not set. Skipping live NewsAPI calls.');
}
const live = apiKey ? it : it.skip;

live('lists sources', async () => {
	const result = await listSources({ key: apiKey } as NewsApiContext, {});
	expect(Array.isArray(result.sources)).toBe(true);
});
