import { ApiError } from 'corsair/http';
import { GODIAL_API_BASE, makeGoDialRequest } from './client';

describe('GoDial client', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('uses the documented host and query-token authentication', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"ok":true}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);

		await makeGoDialRequest('/meta/api/externals/lists/list', {
			method: 'GET',
			apiKey: 'secret token',
		});

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const requestUrl = new URL(String(fetchSpy.mock.calls[0]?.[0]));
		expect(requestUrl.origin).toBe(GODIAL_API_BASE);
		expect(requestUrl.pathname).toBe('/meta/api/externals/lists/list');
		expect(requestUrl.searchParams.get('access_token')).toBe('secret token');
		const headers = new Headers(fetchSpy.mock.calls[0]?.[1]?.headers);
		expect(headers.has('authorization')).toBe(false);
	});

	it('retries a 429 through the shared transport, honouring Retry-After', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response('{"error":"busy"}', {
					status: 429,
					headers: {
						'content-type': 'application/json',
						'Retry-After': '0',
					},
				}),
			)
			.mockResolvedValueOnce(
				new Response('[]', {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
			);

		await expect(
			makeGoDialRequest('/meta/api/externals/lists/list', {
				method: 'GET',
				apiKey: 'secret-token',
			}),
		).resolves.toEqual([]);
		expect(fetchSpy).toHaveBeenCalledTimes(2);
	});

	it("reports GoDial's 500 for a bad token as a 401 without the token", async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(
					'{"error":{"statusCode":500,"message":"Cannot read properties of undefined (reading \'companyId\')","name":"TypeError"}}',
					{ status: 500, headers: { 'content-type': 'application/json' } },
				),
			);

		// unknown because the shared transport's rejection value has no static type until narrowed.
		const error = await makeGoDialRequest('/meta/api/externals/lists/list', {
			method: 'GET',
			apiKey: 'secret-token',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.status).toBe(401);
			expect(error.message).toContain('access token');
			expect(JSON.stringify(error)).not.toContain('secret-token');
		}
	});

	it('keeps contact details out of transport errors', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(
					'{"error":{"statusCode":422,"message":"Contact +15555550123 already exists for ada@example.test"}}',
					{ status: 422, headers: { 'content-type': 'application/json' } },
				),
			);

		// unknown because the shared transport's rejection value has no static type until narrowed.
		const error = await makeGoDialRequest('/meta/api/externals/contact/add', {
			method: 'POST',
			apiKey: 'secret-token',
			body: {
				listId: 'list-1',
				phone: '+15555550123',
				email: 'ada@example.test',
				name: 'Ada Lovelace',
			},
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.status).toBe(422);
			const serialized = `${error.message} ${JSON.stringify(error.body)} ${JSON.stringify(error.request)}`;
			expect(serialized).not.toContain('+15555550123');
			expect(serialized).not.toContain('ada@example.test');
			expect(serialized).not.toContain('Ada Lovelace');
			expect(serialized).not.toContain('secret-token');
		}
	});

	it('redacts a two-letter name as a whole word only', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(
					'{"error":{"statusCode":422,"message":"Contact Al is invalid"}}',
					{ status: 422, headers: { 'content-type': 'application/json' } },
				),
			);

		// unknown because the shared transport's rejection value has no static type until narrowed.
		const error = await makeGoDialRequest('/meta/api/externals/contact/add', {
			method: 'POST',
			apiKey: 'secret-token',
			body: { listId: 'list-1', phone: '+15555550123', name: 'Al' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		const serialized = `${error.message} ${JSON.stringify(error.body)}`;
		expect(serialized).not.toMatch(/\bAl\b/);
		expect(JSON.stringify(error.body)).toContain(
			'Contact [REDACTED] is invalid',
		);
	});

	it('redacts the query token from transport errors', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"error":"denied"}', {
				status: 401,
				headers: { 'content-type': 'application/json' },
			}),
		);

		// unknown because Jest's rejection value has no static type until narrowed.
		const error = await makeGoDialRequest('/meta/api/externals/lists/list', {
			method: 'GET',
			apiKey: 'secret-token',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.url).not.toContain('secret-token');
			expect(error.request.query?.access_token).toBe('[REDACTED]');
		}
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});
