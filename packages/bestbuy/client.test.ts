import { ApiError } from 'corsair/http';
import {
	BESTBUY_API_BASE,
	BestBuyAPIError,
	makeBestBuyRequest,
} from './client';

let captured: { url: string } | undefined;
const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown) => {
		captured = { url: String(url) };
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Retry-After': status === 429 ? '2' : '',
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('makeBestBuyRequest', () => {
	it('uses the official v1 host and apiKey query param', async () => {
		mockFetch({ products: [] });
		await makeBestBuyRequest('products', 'demo-key');
		expect(captured?.url.startsWith(`${BESTBUY_API_BASE}/products`)).toBe(true);
		expect(captured?.url).toContain('apiKey=demo-key');
		expect(captured?.url).toContain('format=json');
	});

	it('rejects a blank key before calling the network', async () => {
		await expect(makeBestBuyRequest('products', '  ')).rejects.toThrow(
			BestBuyAPIError,
		);
	});

	it('preserves 429 status and Retry-After on wrap', async () => {
		mockFetch({ error: 'slow down' }, 429);
		try {
			await makeBestBuyRequest('products', 'demo-key');
			throw new Error('expected failure');
		} catch (error) {
			expect(error).toBeInstanceOf(BestBuyAPIError);
			expect((error as BestBuyAPIError).status).toBe(429);
			expect((error as BestBuyAPIError).cause).toBeInstanceOf(ApiError);
		}
	});
});
