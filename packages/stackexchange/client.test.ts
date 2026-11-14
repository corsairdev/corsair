import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig, RateLimitConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { makeStackExchangeRequest, STACKEXCHANGE_API_BASE } from './client';
import { StackExchangeResponseSchema } from './endpoints/types';

const wrappedResponse = () =>
	new Response(
		JSON.stringify({ items: [], has_more: false, quota_remaining: 9999 }),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		},
	);

describe('Stack Exchange HTTP client', () => {
	afterEach(() => jest.restoreAllMocks());

	it('uses v2.3 and allows anonymous public reads', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(wrappedResponse());
		await makeStackExchangeRequest(
			'networkRead',
			'sites',
			undefined,
			'api_key',
			{},
		);
		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the Stack Exchange request');
		const [input, init] = call;
		expect(String(input)).toBe(`${STACKEXCHANGE_API_BASE}/sites`);
		expect(new Headers(init?.headers).get('authorization')).toBeNull();
		expect(new Headers(init?.headers).get('accept-encoding')).toBe(
			'gzip, deflate',
		);
	});

	it('sends an API key as a bearer credential and encodes path/query values', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(wrappedResponse());
		await makeStackExchangeRequest(
			'siteRead',
			'answers-by-ids',
			'app-key',
			'api_key',
			{
				site: 'stackoverflow',
				pathParams: { ids: '12;13' },
				parameters: { pagesize: 2 },
			},
		);
		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the Stack Exchange request');
		const [input, init] = call;
		expect(String(input)).toBe(
			`${STACKEXCHANGE_API_BASE}/answers/12%3B13?pagesize=2&site=stackoverflow`,
		);
		expect(new Headers(init?.headers).get('authorization')).toBe(
			'Bearer app-key',
		);
	});

	it('sends OAuth writes as form-urlencoded POST requests', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(wrappedResponse());
		await makeStackExchangeRequest(
			'siteWrite',
			'create-question',
			'user-token',
			'oauth_2',
			{
				site: 'stackoverflow',
				parameters: { title: 'A title', body: 'A body', tags: 'api;testing' },
			},
		);
		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the Stack Exchange request');
		const [input, init] = call;
		expect(String(input)).toBe(`${STACKEXCHANGE_API_BASE}/questions/add`);
		expect(init?.method).toBe('POST');
		expect(new Headers(init?.headers).get('content-type')).toContain(
			'application/x-www-form-urlencoded',
		);
		expect(String(init?.body)).toContain('title=A+title');
		expect(String(init?.body)).toContain('site=stackoverflow');
		expect(new Headers(init?.headers).get('authorization')).toBe(
			'Bearer user-token',
		);
	});

	it('rejects user-context routes when only an API key is configured', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeStackExchangeRequest('siteRead', 'events', 'app-key', 'api_key', {
				site: 'stackoverflow',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects method overrides not documented for the selected route', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeStackExchangeRequest('networkRead', 'sites', undefined, 'api_key', {
				method: 'POST',
			}),
		).rejects.toThrow('does not accept POST');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires all route path tokens and rejects extra values', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeStackExchangeRequest(
				'siteRead',
				'answers-by-ids',
				undefined,
				'api_key',
				{
					site: 'stackoverflow',
				},
			),
		).rejects.toThrow('Path parameters must match');
		await expect(
			makeStackExchangeRequest('networkRead', 'sites', undefined, 'api_key', {
				pathParams: { id: 1 },
			}),
		).rejects.toThrow('Path parameters must match');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('enforces anonymous paging and the documented 100-ID vector cap', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeStackExchangeRequest('networkRead', 'sites', undefined, 'api_key', {
				parameters: { page: 26 },
			}),
		).rejects.toThrow('pages above 25');
		await expect(
			makeStackExchangeRequest(
				'siteRead',
				'answers-by-ids',
				undefined,
				'api_key',
				{
					site: 'stackoverflow',
					pathParams: {
						ids: Array.from({ length: 101 }, (_, index) =>
							String(index + 1),
						).join(';'),
					},
				},
			),
		).rejects.toThrow('cannot exceed 100');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('uses Fetch transparent decompression for gzip responses', async () => {
		const server = createServer((_request, response) => {
			response.writeHead(200, {
				'Content-Type': 'application/json',
				'Content-Encoding': 'gzip',
			});
			response.end(
				gzipSync(JSON.stringify({ items: [], has_more: false, page: 1 })),
			);
		});
		await new Promise<void>((resolve) =>
			server.listen(0, '127.0.0.1', resolve),
		);
		const address = server.address();
		if (!address || typeof address === 'string')
			throw new Error('Expected a local test server');
		const config: OpenAPIConfig = {
			BASE: `http://127.0.0.1:${address.port}`,
			VERSION: '2.3',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: { 'Accept-Encoding': 'gzip, deflate' },
		};
		try {
			// Fetch returns decompressed JSON bytes; the core transport parses them.
			const response: unknown = await request(config, {
				method: 'GET',
				url: '/questions',
			});
			expect(StackExchangeResponseSchema.parse(response)).toMatchObject({
				items: [],
				has_more: false,
				page: 1,
			});
		} finally {
			await new Promise<void>((resolve, reject) =>
				server.close((error) => (error ? reject(error) : resolve())),
			);
		}
	});

	it('extracts Retry-After in milliseconds through the shared transport', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({ error_id: 502, error_name: 'throttle_violation' }),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				},
			),
		);
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		};
		const config: OpenAPIConfig = {
			BASE: STACKEXCHANGE_API_BASE,
			VERSION: '2.3',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		};
		await expect(
			request(
				config,
				{ method: 'GET', url: '/questions' },
				{ rateLimitConfig },
			),
		).rejects.toMatchObject({ status: 429, retryAfter: 4000 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
