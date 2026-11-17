import type { SerplyContext } from './context';
import { pageFetch, productSearch, webSearch } from './endpoints/more';
import { searchImages } from './endpoints/search';

const apiKey = process.env.SERPLY_API_KEY;
if (!apiKey) {
	console.warn('SERPLY_API_KEY is not set. Skipping live Serply calls.');
}
const live = apiKey ? it : it.skip;

live('searches images', async () => {
	const result = await searchImages({ key: apiKey } as SerplyContext, {
		q: 'bicycle',
		num: 1,
	});
	expect(Array.isArray(result.images)).toBe(true);
});

// unknown: the endpoints read only `key`; event logging needs no db.
const ctx = {
	key: apiKey,
	$getAccountId: async () => 'live',
	// unknown: a fake with only what the endpoints read.
} as unknown as SerplyContext;

live('searches Google, products and fetches a page', async () => {
	expect(
		(await webSearch(ctx, { q: 'corsair dev', num: 3 })).results.length,
	).toBeGreaterThan(0);
	expect(
		Array.isArray(
			(await productSearch(ctx, { q: 'mechanical keyboard' })).products,
		),
	).toBe(true);
	const page = await pageFetch(ctx, {
		url: 'https://serply.io/',
		response_type: 'markdown',
	});
	expect(page.data.length).toBeGreaterThan(0);
});
