import type { SerplyContext } from './context';
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
