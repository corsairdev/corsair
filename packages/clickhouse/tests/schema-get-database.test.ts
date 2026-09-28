import { Schema } from '../endpoints';
import { ClickhouseEndpointOutputSchemas } from '../endpoints/types';

const originalFetch = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = originalFetch;
	jest.restoreAllMocks();
});

function scriptedFetch(responses: string[]) {
	let i = 0;
	return jest.fn(
		async () =>
			({
				ok: true,
				status: 200,
				statusText: 'OK',
				text: async () => responses[i++] ?? '',
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

describe('Schema.getDatabase', () => {
	it('returns just tables when includeColumns is false', async () => {
		globalThis.fetch = scriptedFetch([
			'{"name":"events","engine":"MergeTree","totalRows":"100","totalBytes":"1024"}',
		]);

		const result = await Schema.getDatabase(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ database: 'analytics' },
		);

		const parsed =
			ClickhouseEndpointOutputSchemas.getDatabaseSchema.parse(result);
		expect(parsed.database).toBe('analytics');
		expect(parsed.tables).toEqual([
			{
				name: 'events',
				engine: 'MergeTree',
				totalRows: '100',
				totalBytes: '1024',
			},
		]);
		expect(parsed.tables[0]?.columns).toBeUndefined();
	});

	it('fetches column metadata when includeColumns is true', async () => {
		globalThis.fetch = scriptedFetch([
			'{"name":"events","engine":"MergeTree","totalRows":"100","totalBytes":"1024"}\n{"name":"users","engine":"MergeTree","totalRows":"5","totalBytes":"512"}',
			'{"name":"id","type":"UInt64","position":"1"}\n{"name":"ts","type":"DateTime","position":"2"}',
			'{"name":"id","type":"UInt64","position":"1"}',
		]);

		const result = await Schema.getDatabase(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ database: 'analytics', includeColumns: true },
		);

		const parsed =
			ClickhouseEndpointOutputSchemas.getDatabaseSchema.parse(result);
		expect(parsed.tables).toHaveLength(2);
		expect(parsed.tables[0]?.columns).toEqual([
			{ name: 'id', type: 'UInt64', position: '1' },
			{ name: 'ts', type: 'DateTime', position: '2' },
		]);
		expect(parsed.tables[1]?.columns).toEqual([
			{ name: 'id', type: 'UInt64', position: '1' },
		]);
	});

	it('rejects unsafe database identifiers', async () => {
		await expect(
			Schema.getDatabase(
				makeCtx({
					baseUrl: 'https://ch.example.com',
					key: 'Basic AAA=',
				}) as never,
				{ database: 'name with space' },
			),
		).rejects.toThrow(/Invalid database/);
	});
});
