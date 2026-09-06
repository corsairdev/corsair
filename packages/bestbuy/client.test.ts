import { ApiError } from 'corsair/http';
import {
	BESTBUY_API_BASE,
	BestBuyAPIError,
	makeBestBuyRequest,
	resetBestBuyLimiterForTests,
} from './client';

let captured: { url: string } | undefined;

beforeEach(() => {
	resetBestBuyLimiterForTests();
});

afterEach(() => {
	jest.restoreAllMocks();
});

function mockFetch(payload: object, status = 200) {
	captured = undefined;
	jest.spyOn(global, 'fetch').mockImplementation((input) => {
		captured = { url: String(input) };
		return Promise.resolve(
			new Response(JSON.stringify(payload), {
				status,
				statusText: status < 400 ? 'OK' : 'Error',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': status === 429 ? '2' : '',
				},
			}),
		);
	});
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
		mockFetch({ errorCode: '429', errorMessage: 'slow down' }, 429);
		try {
			await makeBestBuyRequest('products', 'demo-key');
			throw new Error('expected failure');
		} catch (error) {
			expect(error).toBeInstanceOf(BestBuyAPIError);
			if (!(error instanceof BestBuyAPIError)) return;
			expect(error.status).toBe(429);
			expect(error.cause).toBeInstanceOf(ApiError);
		}
	});

	it('spaces six concurrent calls so at most five fetch in one second', async () => {
		const times: number[] = [];
		jest.spyOn(global, 'fetch').mockImplementation(() => {
			times.push(Date.now());
			return Promise.resolve(
				new Response(JSON.stringify({ products: [] }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
		});

		await Promise.all(
			[0, 1, 2, 3, 4, 5].map(() => makeBestBuyRequest('products', 'demo-key')),
		);

		expect(times).toHaveLength(6);
		const first = times[0] ?? 0;
		expect(
			times.filter((time) => time - first < 1000).length,
		).toBeLessThanOrEqual(5);
	});
});
