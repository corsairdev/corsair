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

describe('Schema.getTable', () => {
	it('returns columns without sample when includeSample is false', async () => {
		globalThis.fetch = scriptedFetch([
			'{"engine":"MergeTree","totalRows":"100"}',
			'{"name":"id","type":"UInt64","position":"1"}\n{"name":"name","type":"String","position":"2"}',
		]);

		const result = await Schema.getTable(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ database: 'analytics', table: 'events' },
		);

		const parsed = ClickhouseEndpointOutputSchemas.getTableSchema.parse(result);
		expect(parsed.database).toBe('analytics');
		expect(parsed.table).toBe('events');
		expect(parsed.engine).toBe('MergeTree');
		expect(parsed.totalRows).toBe('100');
		expect(parsed.columns).toEqual([
			{ name: 'id', type: 'UInt64', position: '1' },
			{ name: 'name', type: 'String', position: '2' },
		]);
		expect(parsed.sampleRows).toBeUndefined();
	});

	it('appends a sample query when includeSample is true', async () => {
		const fetchSpy = scriptedFetch([
			'{"engine":"MergeTree","totalRows":"2"}',
			'{"name":"id","type":"UInt64","position":"1"}',
			'{"id":"1"}\n{"id":"2"}',
		]);
		globalThis.fetch = fetchSpy;

		const result = await Schema.getTable(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{ database: 'analytics', table: 'events', includeSample: true },
		);

		const parsed = ClickhouseEndpointOutputSchemas.getTableSchema.parse(result);
		expect(parsed.sampleRows).toEqual([{ id: '1' }, { id: '2' }]);
	});

	it('rejects unsafe table identifiers', async () => {
		await expect(
			Schema.getTable(
				makeCtx({
					baseUrl: 'https://ch.example.com',
					key: 'Basic AAA=',
				}) as never,
				{ database: 'analytics', table: 'events--' },
			),
		).rejects.toThrow(/Invalid table/);
	});
});
