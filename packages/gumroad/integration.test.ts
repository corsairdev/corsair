import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { GumroadAPIError } from './client';
import { gumroad } from './index';
import { errorBody, product, purchase, sale } from './test-fixtures';

async function createClient(options: Parameters<typeof gumroad>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'gumroad', 'default');
	const corsair = createCorsair({
		plugins: [gumroad(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Gumroad plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.gumroad.keys.issue_new_dek();
			await expect(corsair.gumroad.api.products.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.gumroad.keys.issue_new_dek();
			await corsair.gumroad.keys.set_api_key('gr-stored-key');
			respond({ success: true, products: [product] });

			await corsair.gumroad.api.products.list({});

			const call = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(call[0]).toBe('https://api.gumroad.com/v2/products');
			expect(new Headers(call[1].headers).get('authorization')).toBe(
				'Bearer gr-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns parsed sales and does not retry a 401', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			respond({ success: true, sales: [sale] });
			const result = await corsair.gumroad.api.sales.list({
				after: '2020-09-03',
			});
			expect(result.sales[0]?.id).toBe('B28UKN-dvxYabdavG97Y-Q==');

			respond(errorBody('You did not provide a valid access token.'), 401);
			const error = await corsair.gumroad.api.sales
				.list({ after: '2020-09-03' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(GumroadAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 after Retry-After and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			respond(errorBody('Too many requests'), 429, { 'Retry-After': '1' });
			respond({ success: true, sales: [] });

			const result = await corsair.gumroad.api.sales.list({});

			expect(result.sales).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('verifies a license through the bound api with a form body', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			respond({ success: true, uses: 3, purchase });

			const result = await corsair.gumroad.api.licenses.verify({
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: 'A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD',
				increment_uses_count: 'false',
			});

			expect(result.uses).toBe(3);
			expect(result.purchase.email).toBe('customer@example.com');
			const call = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(call[0]).toBe('https://api.gumroad.com/v2/licenses/verify');
			expect(call[1].method).toBe('POST');
			expect(new Headers(call[1].headers).get('content-type')).toBe(
				'application/x-www-form-urlencoded',
			);
			expect(call[1].body).toBe(
				'product_id=32-nPAicqbLj8B_WswVlMw%3D%3D&license_key=A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD&increment_uses_count=false',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on the POST licenses.verify call', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			respond(errorBody('Something went wrong'), 500);

			await expect(
				corsair.gumroad.api.licenses.verify({
					product_id: '32-nPAicqbLj8B_WswVlMw==',
					license_key: 'A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
