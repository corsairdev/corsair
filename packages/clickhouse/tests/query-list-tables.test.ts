import { Query } from '../endpoints';
import { ClickhouseEndpointOutputSchemas } from '../endpoints/types';

const originalFetch = globalThis.fetch;

type FetchCall = [unknown, RequestInit | undefined];

afterEach(() => {
	globalThis.fetch = originalFetch;
	jest.restoreAllMocks();
});

function mockFetchResponse(
	body: string,
	init?: { status?: number; statusText?: string },
) {
	const status = init?.status ?? 200;
	const statusText = init?.statusText ?? 'OK';
	globalThis.fetch = jest.fn(
		async () =>
			({
				ok: status >= 200 && status < 300,
				status,
				statusText,
				text: async () => body,
			}) as unknown as Response,
	) as unknown as typeof fetch;
}

function makeCtx(opts: { baseUrl?: string; key: string }) {
	return {
		key: opts.key,
		options: { authType: 'api_key' as const, baseUrl: opts.baseUrl },
		$getAccountId: async () => null,
		db: undefined,
	};
}

describe('Query.listTables', () => {
	it('sends database as a URL query parameter and parses engine + size', async () => {
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
				'{"name":"events","engine":"MergeTree","totalRows":"1000","totalBytes":"65536"}',
		}));
		globalThis.fetch = fetchSpy as unknown as typeof fetch;

		const result = await Query.listTables(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ database: 'analytics' },
		);

		const [url, init] = fetchSpy.mock.calls[0] as FetchCall;
		const parsedUrl = new URL(url as string);
		// listTables uses `{database:String}` as a placeholder, so the
		// value travels with the required `param_` prefix.
		expect(parsedUrl.searchParams.get('param_database')).toBe('analytics');
		expect(parsedUrl.searchParams.get('param_limit')).toBe('1000');
		expect(parsedUrl.searchParams.get('param_offset')).toBe('0');
		expect(parsedUrl.searchParams.get('database')).toBeNull();
		expect(init?.method).toBe('POST');

		const bodyText = String(init?.body ?? '');
		expect(bodyText).toContain('system.tables');
		expect(bodyText).toContain('{database:String}');

		const parsed = ClickhouseEndpointOutputSchemas.listTables.parse(result);
		expect(parsed.database).toBe('analytics');
		expect(parsed.tables).toEqual([
			{
				name: 'events',
				engine: 'MergeTree',
				totalRows: '1000',
				totalBytes: '65536',
			},
		]);
		expect(parsed.count).toBe(1);
	});

	it('accepts JSON null for Nullable(UInt64) total_rows / total_bytes', async () => {
		mockFetchResponse(
			'{"name":"dashboards","engine":"SystemDashboards","totalRows":null,"totalBytes":null}',
		);

		const result = await Query.listTables(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ database: 'system' },
		);

		expect(result.tables[0]).toEqual({
			name: 'dashboards',
			engine: 'SystemDashboards',
			totalRows: null,
			totalBytes: null,
		});
	});

	it('honors caller-supplied limit and offset', async () => {
		mockFetchResponse('{"name":"a","engine":"Log"}');

		await Query.listTables(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ database: 'analytics', limit: 25, offset: 100 },
		);

		const call = (globalThis.fetch as jest.Mock).mock.calls[0] as FetchCall;
		const parsedUrl = new URL(call[0] as string);
		expect(parsedUrl.searchParams.get('param_limit')).toBe('25');
		expect(parsedUrl.searchParams.get('param_offset')).toBe('100');
	});

	it('rejects identifiers that are not safe (no injection)', async () => {
		await expect(
			Query.listTables(
				makeCtx({
					baseUrl: 'https://ch.example.com',
					key: 'Basic AAA=',
				}) as never,
				{ database: 'a"; DROP TABLE x; --' },
			),
		).rejects.toThrow(/Invalid database/);
	});
});
