import { ApiError } from 'corsair/http';
import {
	BESTBUY_API_BASE,
	BestBuyAPIError,
	makeBestBuyRequest,
} from './client';

let captured: { url: string } | undefined;

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
});
