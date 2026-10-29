import { Query } from '../endpoints';
import { ClickhouseEndpointOutputSchemas } from '../endpoints/types';

const originalFetch = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = originalFetch;
	jest.restoreAllMocks();
});

type FetchCall = [unknown, RequestInit | undefined];

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

describe('Query.listDatabases', () => {
	it('issues SELECT against system.databases and maps rows', async () => {
		mockFetchResponse(
			'{"name":"default","engine":"Atomic"}\n{"name":"system","engine":"System"}',
		);

		const result = await Query.listDatabases(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{},
		);

		const parsed = ClickhouseEndpointOutputSchemas.listDatabases.parse(result);
		expect(parsed.databases).toEqual([
			{ name: 'default', engine: 'Atomic' },
			{ name: 'system', engine: 'System' },
		]);
	});

	it('returns an empty array when no databases exist', async () => {
		mockFetchResponse('');

		const result = await Query.listDatabases(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{},
		);

		const parsed = ClickhouseEndpointOutputSchemas.listDatabases.parse(result);
		expect(parsed.databases).toEqual([]);
	});

	it('throws ClickhouseAPIError on a non-2xx response', async () => {
		mockFetchResponse('Code: 32. DB::Exception: Access denied', {
			status: 403,
			statusText: 'Forbidden',
		});

		await expect(
			Query.listDatabases(
				makeCtx({
					baseUrl: 'https://ch.example.com',
					key: 'Basic AAA=',
				}) as never,
				{},
			),
		).rejects.toThrow(/Access denied/);
	});

	it('throws when ctx.options.baseUrl is missing', async () => {
		await expect(
			Query.listDatabases(makeCtx({ key: 'Basic AAA=' }) as never, {}),
		).rejects.toThrow();
	});
});
