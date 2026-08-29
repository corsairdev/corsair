import { Query } from '../endpoints';
import { ClickhouseEndpointOutputSchemas } from '../endpoints/types';

const originalFetch = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = originalFetch;
	jest.restoreAllMocks();
});

function mockFetchOnce(
	body: string,
	init?: { status?: number; statusText?: string },
) {
	const status = init?.status ?? 200;
	const statusText = init?.statusText ?? 'OK';
	globalThis.fetch = jest.fn(async () => ({
		ok: status >= 200 && status < 300,
		status,
		statusText,
		text: async () => body,
	})) as unknown as typeof fetch;
}

function makeCtx(opts: { baseUrl: string; key: string }) {
	return {
		key: opts.key,
		options: { authType: 'api_key' as const, baseUrl: opts.baseUrl },
		$getAccountId: async () => null,
		db: undefined,
	};
}

describe('Query.execute (ClickHouse plugin)', () => {
	type FetchCall = [unknown, RequestInit | undefined];

	it('POSTs SQL to the configured base URL with the Basic auth header', async () => {
		const fetchSpy = jest.fn<
			Promise<{
				ok: boolean;
				status: number;
				statusText: string;
				text: () => Promise<string>;
			}>,
			FetchCall
		>(async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			text: async () =>
				'{"name":"events","count":1}\n{"name":"users","count":2}',
		}));
		globalThis.fetch = fetchSpy as unknown as typeof fetch;

		const result = await Query.execute(
			makeCtx({
				baseUrl: 'https://ch.example.com:8443/',
				key: 'Basic dXNlcjpwYXNz',
			}) as never,
			{ sql: 'SELECT name, count() FROM system.tables GROUP BY name' },
		);

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const [url, init] = fetchSpy.mock.calls[0] as FetchCall;
		expect(String(url)).toBe('https://ch.example.com:8443/');
		expect(init?.method).toBe('POST');
		expect((init?.headers as Record<string, string>).Authorization).toBe(
			'Basic dXNlcjpwYXNz',
		);
		expect(
			(init?.headers as Record<string, string>)['X-ClickHouse-Format'],
		).toBe('JSONEachRow');
		expect(init?.body).not.toContain('FORMAT JSONEachRow');

		const parsed = ClickhouseEndpointOutputSchemas.executeQuery.parse(result);
		expect(parsed.rowCount).toBe(2);
		expect(parsed.rows[0]).toEqual({ name: 'events', count: 1 });
		expect(parsed.rows[1]).toEqual({ name: 'users', count: 2 });
	});

	it('appends LIMIT only when the user-supplied SQL has none', async () => {
		mockFetchOnce('{"x":1}');

		await Query.execute(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ sql: 'SELECT 1 AS x', limit: 10 },
		);

		const call = (globalThis.fetch as jest.Mock).mock.calls[0] as FetchCall;
		expect(call[1]?.body).toContain('\nLIMIT 10');
	});

	it('does not double-append LIMIT when SQL already has one', async () => {
		mockFetchOnce('{"x":1}');

		await Query.execute(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ sql: 'SELECT 1 AS x LIMIT 5', limit: 10 },
		);

		const call = (globalThis.fetch as jest.Mock).mock.calls[0] as FetchCall;
		expect(call[1]?.body).not.toContain('LIMIT 10');
		expect(call[1]?.body).toContain('LIMIT 5');
	});

	it('appends LIMIT when a LIMIT-like phrase appears only in a line comment', async () => {
		mockFetchOnce('{"x":1}');

		await Query.execute(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ sql: 'SELECT 1 AS x -- LIMIT 100', limit: 10 },
		);

		const call = (globalThis.fetch as jest.Mock).mock.calls[0] as FetchCall;
		expect(String(call[1]?.body)).toBe('SELECT 1 AS x -- LIMIT 100\nLIMIT 10');
	});

	it('appends LIMIT when a LIMIT-like phrase appears only in a block comment', async () => {
		mockFetchOnce('{"x":1}');

		await Query.execute(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ sql: 'SELECT 1 AS x /* LIMIT 100 */', limit: 10 },
		);

		const call = (globalThis.fetch as jest.Mock).mock.calls[0] as FetchCall;
		expect(call[1]?.body).toContain('LIMIT 10');
	});

	it('appends LIMIT when a LIMIT-like phrase appears only in a string literal', async () => {
		mockFetchOnce('{"x":1}');

		await Query.execute(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ sql: "SELECT 'LIMIT 100' AS note", limit: 10 },
		);

		const call = (globalThis.fetch as jest.Mock).mock.calls[0] as FetchCall;
		expect(call[1]?.body).toContain('LIMIT 10');
	});

	it('appends LIMIT when a LIMIT-like phrase appears only in a backtick-quoted identifier', async () => {
		mockFetchOnce('{"x":1}');

		await Query.execute(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ sql: 'SELECT 1 AS `LIMIT 100`', limit: 10 },
		);

		const call = (globalThis.fetch as jest.Mock).mock.calls[0] as FetchCall;
		expect(call[1]?.body).toContain('LIMIT 10');
	});

	it('returns an empty row set when ClickHouse replies with an empty body', async () => {
		mockFetchOnce('');

		const result = await Query.execute(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ sql: 'SELECT 1 WHERE 0' },
		);

		const parsed = ClickhouseEndpointOutputSchemas.executeQuery.parse(result);
		expect(parsed.rowCount).toBe(0);
		expect(parsed.rows).toEqual([]);
	});

	it('throws ClickhouseAPIError when ClickHouse returns a non-2xx response', async () => {
		mockFetchOnce('Code: 60. DB::Exception: Table not found', {
			status: 404,
			statusText: 'Not Found',
		});

		await expect(
			Query.execute(
				makeCtx({
					baseUrl: 'https://ch.example.com',
					key: 'Basic AAA=',
				}) as never,
				{ sql: 'SELECT * FROM missing' },
			),
		).rejects.toThrow(/DB::Exception/);
	});

	it('throws when neither ctx.options.baseUrl nor tenant_external_id is set', async () => {
		const ctx = {
			key: 'Basic AAA=',
			options: { authType: 'api_key' as const },
			$getAccountId: async () => null,
			keys: { get_tenant_external_id: async () => null },
		};

		await expect(
			Query.execute(ctx as never, { sql: 'SELECT 1' }),
		).rejects.toThrow(/baseUrl/);
	});

	it('falls back to ctx.keys.get_tenant_external_id when ctx.options.baseUrl is missing', async () => {
		mockFetchOnce('{"x":1}');

		const ctx = {
			key: 'Basic AAA=',
			options: { authType: 'api_key' as const },
			$getAccountId: async () => null,
			keys: {
				get_tenant_external_id: async () =>
					'https://tenant-ch.example.com:8443',
			},
		};

		const result = await Query.execute(ctx as never, { sql: 'SELECT 1 AS x' });

		const call = (globalThis.fetch as jest.Mock).mock.calls[0] as FetchCall;
		expect(String(call[0])).toBe('https://tenant-ch.example.com:8443/');
		expect(result.rows).toEqual([{ x: 1 }]);
	});
});
