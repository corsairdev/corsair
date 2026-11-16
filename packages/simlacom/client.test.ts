import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, ApiResult, OpenAPIConfig } from 'corsair/http';
import { ApiError } from 'corsair/http';
import {
	makeSimlaComRequest,
	normalizeSimlaComSubdomain,
	sanitizeSimlaComApiError,
	simlaComQuery,
} from './client';
import { getSimlaComOperation } from './endpoints/types';

const jsonResponse = (body: object, status = 200): Response =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	});

describe('Simla.com transport', () => {
	afterEach(() => jest.restoreAllMocks());

	it('uses the tenant host and X-API-KEY header without putting credentials in the URL', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ success: true, versions: ['5'] }));
		const operation = getSimlaComOperation('api.apiVersions.get');

		await makeSimlaComRequest(operation, 'private-key', 'north-shop', {});

		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(String(url)).toBe('https://north-shop.simla.com/api/api-versions');
		expect(new Headers(init?.headers).get('X-API-KEY')).toBe('private-key');
		expect(new Headers(init?.headers).has('Authorization')).toBe(false);
		expect(String(url)).not.toContain('private-key');
	});

	it('sends POST form fields as URL-encoded scalars with nested values serialized as JSON', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ success: true, id: 21 }));
		const operation = getSimlaComOperation('cost.create.post');

		await makeSimlaComRequest(operation, 'key', 'demo', {
			query: { site: 'main' },
			body: { site: 'main', cost: { externalId: 'ref-1', amount: 25 } },
		});

		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(String(url)).toContain('https://demo.simla.com/api/v5/costs/create');
		expect(init?.method).toBe('POST');
		expect(new Headers(init?.headers).get('Content-Type')).toContain(
			'application/x-www-form-urlencoded',
		);
		const form = new URLSearchParams(String(init?.body));
		expect(form.get('site')).toBe('main');
		expect(form.get('cost')).toBe(
			JSON.stringify({ externalId: 'ref-1', amount: 25 }),
		);
	});

	it('uploads binary data from base64 and returns binary downloads as base64', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({ success: true, file: { id: 1 } }))
			.mockResolvedValueOnce(
				new Response(new Uint8Array([0x41, 0x42]), {
					headers: { 'content-type': 'application/pdf' },
				}),
			);
		const upload = getSimlaComOperation('files.upload.post');
		const download = getSimlaComOperation('files.byIdDownload.get');

		await makeSimlaComRequest(upload, 'key', 'demo', { body: 'AQID' });
		const downloaded = await makeSimlaComRequest(download, 'key', 'demo', {
			path: { id: 7 },
		});

		const uploadCall = fetchMock.mock.calls[0];
		const uploadBody = uploadCall?.[1]?.body;
		expect(uploadBody).toBeInstanceOf(Uint8Array);
		if (uploadBody instanceof Uint8Array) {
			expect(Array.from(uploadBody)).toEqual([1, 2, 3]);
		}
		expect(downloaded).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'QUI=',
		});
	});

	it('honors Retry-After for binary 429 responses and replays only the rate-limited attempt', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response('rate limited', {
					status: 429,
					headers: { 'retry-after': '0' },
				}),
			)
			.mockResolvedValueOnce(jsonResponse({ success: true, file: { id: 2 } }));
		const upload = getSimlaComOperation('files.upload.post');

		await makeSimlaComRequest(upload, 'key', 'demo', { body: 'QQ==' });

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('cancels a binary stream as soon as it exceeds the client size limit', async () => {
		let cancelled = false;
		const oversizedChunk = new Uint8Array(20 * 1024 * 1024 + 1);
		const response = new Response(
			new ReadableStream<Uint8Array>({
				start(controller) {
					controller.enqueue(oversizedChunk);
				},
				cancel() {
					cancelled = true;
				},
			}),
			{ headers: { 'content-type': 'application/pdf' } },
		);
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(response);
		const download = getSimlaComOperation('files.byIdDownload.get');

		await expect(
			makeSimlaComRequest(download, 'key', 'demo', { path: { id: 17 } }),
		).rejects.toThrow('20 MiB client limit');
		expect(cancelled).toBe(true);
	});

	it('redacts provider errors while retaining the HTTP status for retry handlers', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				jsonResponse({ message: 'reader@sample.invalid private details' }, 400),
			);
		const operation = getSimlaComOperation('customers.getByExternalid.get');
		// `unknown` is necessary because a rejected request can contain any runtime value.
		const error = await makeSimlaComRequest(operation, 'key', 'demo', {
			path: { externalId: 'private-customer-id' },
			query: { 'filter[email]': 'reader@sample.invalid' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.message).not.toContain('reader@sample.invalid');
			expect(error.stack).toContain('catchErrorCodes');
			expect(error.body).toEqual({ success: false });
			expect(error.request.query).toBeUndefined();
			expect(error.request.path).toBeUndefined();
			expect(error.url).not.toContain('private-customer-id');
		}
	});

	it('redacts a core ApiError in place and preserves its original stack and retry metadata', () => {
		const request: ApiRequestOptions = {
			method: 'GET',
			url: 'customers/{externalId}',
			path: { externalId: 'private-customer-id' },
			query: { email: 'reader@sample.invalid' },
			body: 'customer data',
		};
		const result: ApiResult = {
			url: 'https://demo.simla.com/api/v5/customers/private-customer-id',
			ok: false,
			status: 429,
			statusText: 'private provider detail',
			body: { message: 'reader@sample.invalid' },
		};
		const original = new ApiError(
			request,
			result,
			'provider detail reader@sample.invalid',
			{ retryAfter: 500 },
		);
		const originalFrames = original.stack?.split('\n').slice(1).join('\n');

		const sanitized = sanitizeSimlaComApiError(original);

		expect(sanitized).toBe(original);
		expect(sanitized.status).toBe(429);
		expect(sanitized.retryAfter).toBe(500);
		expect(sanitized.message).not.toContain('reader@sample.invalid');
		expect(sanitized.url).not.toContain('private-customer-id');
		expect(sanitized.request.path).toBeUndefined();
		expect(sanitized.request.query).toBeUndefined();
		expect(sanitized.request.body).toBeUndefined();
		expect(sanitized.stack?.split('\n').slice(1).join('\n')).toBe(
			originalFrames,
		);
	});

	it('fails without an API key and rejects unsafe instance subdomains before network I/O', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		const operation = getSimlaComOperation('api.apiVersions.get');

		await expect(
			makeSimlaComRequest(operation, '', 'demo', {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		for (const host of [
			'invalid.subdomain',
			'acme.simla.com.attacker.example',
			'https://attacker.example/acme.simla.com',
			'http://acme.simla.com',
		]) {
			await expect(
				makeSimlaComRequest(operation, 'key', host, {}),
			).rejects.toThrow('subdomain is missing or invalid');
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts the account URL or host a person pastes into the connect form', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ success: true, versions: ['5.0'] }));
		const operation = getSimlaComOperation('api.apiVersions.get');

		for (const value of [
			'https://North-Shop.simla.com/',
			'north-shop.simla.com',
			' north-shop ',
		]) {
			await makeSimlaComRequest(operation, 'key', value, {});
		}

		expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual(
			Array(3).fill('https://north-shop.simla.com/api/api-versions'),
		);
		expect(normalizeSimlaComSubdomain('acme')).toBe('acme');
	});

	it('sends list query parameters with the [] suffix PHP needs', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ success: true, orders: [] }));
		const operation = getSimlaComOperation('orders.statuses.get');

		await makeSimlaComRequest(operation, 'key', 'demo', {
			query: { ids: ['1', '2'], 'externalIds[]': ['a'] },
		});

		const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(url.searchParams.getAll('ids[]')).toEqual(['1', '2']);
		expect(url.searchParams.getAll('externalIds[]')).toEqual(['a']);
		expect(url.searchParams.has('ids')).toBe(false);
		expect(
			simlaComQuery({
				filter: { managerIds: [3, 4], name: 'x' },
				'filter[ids][]': [5],
			}),
		).toEqual({
			'filter[managerIds][]': [3, 4],
			'filter[name]': 'x',
			'filter[ids][]': [5],
		});
	});

	it("keeps Simla.com's errorMsg and field errors so a caller can fix the request", async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			jsonResponse(
				{
					success: false,
					errorMsg: 'Telephony not enabled',
					errors: { 'customer[email]': 'This value is not valid.' },
					customer: { email: 'reader@sample.invalid' },
				},
				400,
			),
		);
		const operation = getSimlaComOperation('telephony.calls.get');
		// `unknown` is necessary because a rejected request can contain any runtime value.
		const error = await makeSimlaComRequest(operation, 'key', 'demo', {
			query: { 'filter[phone]': '+12025550123' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.status).toBe(400);
			expect(error.message).toBe(
				'Simla.com request failed with HTTP 400: Telephony not enabled',
			);
			expect(error.body).toEqual({
				success: false,
				errorMsg: 'Telephony not enabled',
				errors: { 'customer[email]': 'This value is not valid.' },
			});
			expect(JSON.stringify(error.body)).not.toContain('reader@');
			expect(error.url).not.toContain('2025550123');
		}
	});

	it('captures Retry-After with the real shared transport', async () => {
		const actualHttp: typeof import('corsair/http') =
			jest.requireActual('corsair/http');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				headers: { 'retry-after': '4' },
			}),
		);
		const config: OpenAPIConfig = {
			BASE: 'https://demo.simla.com/api/v5',
			VERSION: '5',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: { 'X-API-KEY': 'key' },
		};
		// `unknown` accounts for arbitrary rejection values from the shared transport.
		const error = await actualHttp
			.request(
				config,
				{ method: 'GET', url: 'orders' },
				{
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 0,
						backoffMultiplier: 1,
						headerNames: { retryAfter: 'retry-after' },
					},
				},
			)
			.catch((caught: unknown) => caught);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) expect(error.retryAfter).toBe(4000);
	});
});
