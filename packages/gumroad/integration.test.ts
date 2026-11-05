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

	it('calls token-free operations without an Authorization header', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.gumroad.keys.issue_new_dek();
			respond({ success: true, uses: 0, purchase });

			await corsair.gumroad.api.licenses.verify({
				product_id: 'prod',
				license_key: 'key',
			});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('authorization')).toBeNull();
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
			// unknown: the rejection is whatever bind throws; it is narrowed
			// by the instanceof assertion below.
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

	it('updates a product through the bound api with a PUT form body', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			respond({ success: true, product });

			await corsair.gumroad.api.products.update({
				id: 'A-m3CDDC5dlrSdKZp0RFhA==',
				name: 'Pencil Icon PSD v2',
				max_purchase_count: 100,
			});

			const call = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(call[0]).toBe(
				'https://api.gumroad.com/v2/products/A-m3CDDC5dlrSdKZp0RFhA%3D%3D',
			);
			expect(call[1].method).toBe('PUT');
			expect(call[1].body).toBe(
				'name=Pencil%20Icon%20PSD%20v2&max_purchase_count=100',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on the PUT products.update call', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			respond(errorBody('Something went wrong'), 500);

			await expect(
				corsair.gumroad.api.products.update({
					id: 'A-m3CDDC5dlrSdKZp0RFhA==',
					name: 'v2',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('publishes profile custom HTML as JSON through the bound api', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			respond({
				success: true,
				custom_html: '<main><h1>My profile</h1></main>',
				previous_custom_html: null,
				profile_url: 'https://sailorjohn.gumroad.com',
				sanitization_report: {
					removed_tags: [],
					removed_attributes: [],
					total_removed: 0,
					truncated: false,
				},
			});

			await corsair.gumroad.api.user.customHtmlUpdate({
				custom_html: '<main><h1>My profile</h1></main>',
			});

			const call = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(call[0]).toBe('https://api.gumroad.com/v2/user/custom_html');
			expect(call[1].method).toBe('PUT');
			expect(new Headers(call[1].headers).get('content-type')).toBe(
				'application/json',
			);
			expect(call[1].body).toBe(
				'{"custom_html":"<main><h1>My profile</h1></main>"}',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads a public profile from the apex host path form', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			respond({
				api_version: 1,
				id: 'G_-mnBf9b1j9A7a4ub4nFQ==',
				username: 'sahil',
			});

			await corsair.gumroad.api.public.profile({ username: 'sahil' });

			const call = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(call[0]).toBe('https://gumroad.com/sahil.json');
		} finally {
			testDb.cleanup();
		}
	});

	it('downloads a tax form PDF through the bound api', async () => {
		const { corsair, testDb } = await createClient({ key: 'gr-test-key' });
		try {
			const pdf = Buffer.from('%PDF-1.4 fake');
			fetchMock.mockResolvedValueOnce(
				new Response(new Uint8Array(pdf), {
					status: 200,
					headers: {
						'Content-Type': 'application/pdf',
						'Content-Disposition': 'attachment; filename="1099-K-2025.pdf"',
					},
				}),
			);

			const file = await corsair.gumroad.api.taxForms.download({
				year: '2025',
				tax_form_type: 'us_1099_k',
			});

			expect(file.contentBase64).toBe(pdf.toString('base64'));
			expect(file.contentType).toBe('application/pdf');
			const call = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(call[0]).toBe(
				'https://api.gumroad.com/v2/tax_forms/2025/us_1099_k/download',
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
