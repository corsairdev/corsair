import { ExcelAPIError, makeExcelRequest } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	fetchCount: number;
};

let captured: Captured | undefined;
let fetchCount = 0;

function installFetch(
	impl: (url: string | URL | Request, init?: RequestInit) => Promise<object>,
) {
	// The stub only implements the Response fields these tests read, so a
	// full Response is not practical.
	global.fetch = impl as unknown as typeof global.fetch;
}

function mockFetch(response: {
	status?: number;
	// Success and error fixtures are different JSON values, so a stricter
	// body type is not practical.
	body?: unknown;
	retryAfter?: string;
	contentType?: string;
}) {
	fetchCount = 0;
	installFetch(async (url, init) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		}
		fetchCount += 1;
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			fetchCount,
		};
		const status = response.status ?? 200;
		const payload = response.body ?? {};
		const responseHeaders = new Headers({
			'Content-Type': response.contentType ?? 'application/json',
		});
		if (response.retryAfter) {
			responseHeaders.set('Retry-After', response.retryAfter);
		}
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: responseHeaders,
			json: async () => payload,
			text: async () =>
				typeof payload === 'string' ? payload : JSON.stringify(payload),
		};
	});
}

describe('excel client', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('sends a bearer token and the workbook session header', async () => {
		mockFetch({ body: { value: [] } });
		await makeExcelRequest(
			'/me/drive/items/item-1/workbook/worksheets',
			'x_key_test',
			{
				headers: { 'workbook-session-id': 'sess-1' },
			},
		);
		expect(captured?.url).toBe(
			'https://graph.microsoft.com/v1.0/me/drive/items/item-1/workbook/worksheets',
		);
		expect(captured?.headers.authorization).toBe('Bearer x_key_test');
		expect(captured?.headers['workbook-session-id']).toBe('sess-1');
		expect(captured?.headers['x-api-key']).toBeUndefined();
	});

	it('makes exactly one fetch on 429 and keeps Retry-After', async () => {
		mockFetch({
			status: 429,
			retryAfter: '10',
			body: {
				error: {
					code: 'TooManyRequests',
					message: 'Please retry again later.',
				},
			},
		});
		await expect(
			makeExcelRequest(
				'/me/drive/items/item-1/workbook/worksheets',
				'x_key_test',
			),
		).rejects.toMatchObject({
			name: 'ExcelAPIError',
			status: 429,
			code: 'TooManyRequests',
			retryAfter: 10_000,
		});
		expect(fetchCount).toBe(1);
	});

	it('reads Graph error codes when error is an object', async () => {
		mockFetch({
			status: 404,
			body: {
				error: {
					code: 'ItemNotFound',
					message: 'The resource could not be found.',
					innerError: { code: 'itemNotFound' },
				},
			},
		});
		try {
			await makeExcelRequest(
				'/me/drive/items/missing/workbook/worksheets',
				'x_key_test',
			);
			throw new Error('expected the request to fail');
		} catch (error) {
			expect(error).toBeInstanceOf(ExcelAPIError);
			if (!(error instanceof ExcelAPIError)) {
				throw error;
			}
			expect(error.status).toBe(404);
			expect(error.code).toBe('ItemNotFound');
			expect(error.innerCode).toBe('itemNotFound');
			expect(error.message).not.toContain('[object Object]');
		}
	});

	it('does not retry a 504 inside the transport', async () => {
		mockFetch({
			status: 504,
			body: { error: { code: 'GatewayTimeout', message: 'timeout' } },
		});
		await expect(
			makeExcelRequest(
				'/me/drive/items/item-1/workbook/createSession',
				'x_key_test',
				{
					method: 'POST',
					body: { persistChanges: true },
				},
			),
		).rejects.toMatchObject({ status: 504 });
		expect(fetchCount).toBe(1);
	});
});
