import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NasdaqPluginOptions } from './index';
import { nasdaq, nasdaqEndpointsNested } from './index';
import {
	dailyLimit,
	expiredCursor,
	gatewayBlockPage,
	missingKey,
	tableExportBuilding,
	tableExportFresh,
	tableMetadata,
	tableRows,
	tableRowsLastPage,
	unknownKey,
} from './test-fixtures';

function makeContext(key = 'test-key') {
	return {
		key,
		authType: 'api_key' as const,
		options: {} as NasdaqPluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: {},
		_http: {},
	};
}

// unknown: each operation has its own input and output, and every call site
// passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

const endpoints = nasdaqEndpointsNested;

/** Runs one endpoint and returns the response and the request that made it. */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentType = 'application/json' } = {},
): Promise<{ result: unknown; url: string }> {
	const original = globalThis.fetch;
	let url = '';
	globalThis.fetch = (async (called: string) => {
		url = called;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext() as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url };
	} finally {
		globalThis.fetch = original;
	}
}

describe('tables.rows', () => {
	it('reads rows and lifts them out of the datatable envelope', async () => {
		const { result, url } = await capture(
			endpoints.tables.rows,
			{ table: 'NDAQ/RTAT10', per_page: 2 },
			tableRows,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/api/v3/datatables/NDAQ/RTAT10.json');
		expect(parsed.searchParams.get('qopts.per_page')).toBe('2');
		expect(parsed.searchParams.get('api_key')).toBe('test-key');
		const rows = asRecord(result);
		expect(rows?.rows).toEqual(tableRows.datatable.data);
		expect(rows?.columns).toHaveLength(4);
	});

	it('keeps the row order that columns describe, rather than mapping to objects', async () => {
		const { result } = await capture(
			endpoints.tables.rows,
			{ table: 'NDAQ/RTAT10' },
			tableRows,
		);

		const rows = asRecord(result)?.rows;
		expect(Array.isArray(rows)).toBe(true);
		// The first cell of the first row is the date, matching columns[0].
		expect(Array.isArray(rows) ? rows[0]?.[0] : undefined).toBe('2021-11-01');
		expect(Array.isArray(rows) ? rows[0]?.[1] : undefined).toBe('TSLA');
	});

	it('passes the cursor back verbatim', async () => {
		const cursor = tableRows.meta.next_cursor_id;
		const { url } = await capture(
			endpoints.tables.rows,
			{ table: 'NDAQ/RTAT10', cursor_id: cursor },
			tableRows,
		);

		expect(new URL(url).searchParams.get('qopts.cursor_id')).toBe(cursor);
	});

	it('reports no cursor on the last page', async () => {
		const { result } = await capture(
			endpoints.tables.rows,
			{ table: 'NDAQ/RTAT10' },
			tableRowsLastPage,
		);

		expect(asRecord(result)?.next_cursor_id).toBeNull();
	});

	it('rejects a cursor that is not a string instead of reading it as the last page', async () => {
		await expect(
			capture(
				endpoints.tables.rows,
				{ table: 'NDAQ/RTAT10' },
				{ ...tableRows, meta: { next_cursor_id: 123 } },
			),
		).rejects.toThrow();
	});

	it('sends filters with their operator suffixes intact', async () => {
		const { url } = await capture(
			endpoints.tables.rows,
			{
				table: 'NDAQ/RTAT10',
				filters: { 'date.gte': '2024-01-01', ticker: 'AAPL,MSFT' },
			},
			tableRows,
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('date.gte')).toBe('2024-01-01');
		expect(parsed.searchParams.get('ticker')).toBe('AAPL,MSFT');
	});

	it('sends only the requested columns', async () => {
		const { url } = await capture(
			endpoints.tables.rows,
			{ table: 'NDAQ/RTAT10', columns: ['date', 'ticker'] },
			tableRows,
		);

		expect(new URL(url).searchParams.get('qopts.columns')).toBe('date,ticker');
	});

	it('keeps the slash in a vendor/table code', async () => {
		const { url } = await capture(
			endpoints.tables.rows,
			{ table: 'MER/F1' },
			tableRows,
		);

		// An encoded slash is a different route, and Nasdaq answers 404 for it.
		expect(new URL(url).pathname).toBe('/api/v3/datatables/MER/F1.json');
	});

	it('rejects a table code without a vendor', async () => {
		await expect(
			endpoints.tables.rows(makeContext() as never, { table: 'RTAT10' }),
		).rejects.toThrow(/vendor/);
	});

	it('rejects a per_page above the documented maximum', async () => {
		await expect(
			endpoints.tables.rows(makeContext() as never, {
				table: 'NDAQ/RTAT10',
				per_page: 10_001,
			}),
		).rejects.toThrow();
	});

	it('fails loudly when a row is not a flat array', async () => {
		await expect(
			capture(
				endpoints.tables.rows,
				{ table: 'NDAQ/RTAT10' },
				{
					datatable: {
						columns: [{ name: 'date', type: 'Date' }],
						data: [{ date: '2021-11-01' }],
					},
				},
			),
		).rejects.toThrow(/not a flat array/);
	});
});

describe('tables.metadata', () => {
	it('lifts the datatable block out and lists the filterable columns', async () => {
		const { result, url } = await capture(
			endpoints.tables.metadata,
			{ table: 'NDAQ/RTAT10' },
			tableMetadata,
		);

		expect(new URL(url).pathname).toBe(
			'/api/v3/datatables/NDAQ/RTAT10/metadata.json',
		);
		const meta = asRecord(result);
		expect(meta?.name).toContain('Retail Trading Activity Tracker');
		expect(meta?.filters).toEqual(['date', 'ticker', 'activity', 'sentiment']);
		expect(meta?.premium).toBe(false);
	});

	it('keeps the refresh status', async () => {
		const { result } = await capture(
			endpoints.tables.metadata,
			{ table: 'NDAQ/RTAT10' },
			tableMetadata,
		);

		const status = asRecord(asRecord(result)?.status);
		expect(status?.status).toBe('ON TIME');
		expect(status?.update_frequency).toBe('CONTINUOUS');
	});
});

describe('tables.export', () => {
	it('sends qopts.export and reads the file block', async () => {
		const { result, url } = await capture(
			endpoints.tables.export,
			{ table: 'NDAQ/RTAT10' },
			tableExportFresh,
		);

		expect(new URL(url).searchParams.get('qopts.export')).toBe('true');
		const exportResult = asRecord(result);
		expect(exportResult?.status).toBe('Fresh');
		expect(asRecord(exportResult?.file)?.link).toContain('NDAQ_RTAT10');
	});

	it('reports Creating with no link on the first poll', async () => {
		const { result } = await capture(
			endpoints.tables.export,
			{ table: 'NDAQ/RTAT10' },
			tableExportBuilding,
		);

		const exportResult = asRecord(result);
		expect(exportResult?.status).toBe('Creating');
		expect(asRecord(exportResult?.file)?.link).toBeFalsy();
	});

	it('passes filters into the export request', async () => {
		const { url } = await capture(
			endpoints.tables.export,
			{ table: 'NDAQ/RTAT10', filters: { 'date.gte': '2024-01-01' } },
			tableExportFresh,
		);

		expect(new URL(url).searchParams.get('date.gte')).toBe('2024-01-01');
	});
});

describe('nasdaq error reporting', () => {
	it('names the key as the problem on QEAx01', async () => {
		await expect(
			capture(endpoints.tables.rows, { table: 'NDAQ/RTAT10' }, unknownKey, {
				status: 400,
			}),
		).rejects.toThrow(/QEAx01/);
	});

	it('reports an expired cursor by its own code', async () => {
		await expect(
			capture(
				endpoints.tables.rows,
				{ table: 'NDAQ/RTAT10', cursor_id: 'stale' },
				expiredCursor,
				{ status: 400 },
			),
		).rejects.toThrow(/QESx06/);
	});

	it('reports a missing key by its own code', async () => {
		await expect(
			capture(endpoints.tables.rows, { table: 'NDAQ/RTAT10' }, missingKey, {
				status: 403,
			}),
		).rejects.toThrow(/QEPx04/);
	});

	it('reports the daily cap by its own code', async () => {
		await expect(
			capture(endpoints.tables.rows, { table: 'NDAQ/RTAT10' }, dailyLimit, {
				status: 429,
			}),
		).rejects.toThrow(/QEAx06/);
	});

	it('calls a 403 with no JSON a gateway block, not an auth failure', async () => {
		const error = await capture(
			endpoints.tables.rows,
			{ table: 'MER/F1' },
			gatewayBlockPage,
			{
				status: 403,
				contentType: 'text/html',
			},
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('gateway');
		expect(String(error)).toContain('403');
	});

	it('removes the key Nasdaq echoes back, from the message and the body', async () => {
		// Nasdaq echoes the submitted key inside quandl_error.message, which is
		// how a leaked key reaches a log line.
		const echoed = {
			quandl_error: {
				code: 'QEAx01',
				message:
					'We could not recognize your API key: test-key. Please check your API key.',
			},
		};
		const error = await capture(
			endpoints.tables.rows,
			{ table: 'NDAQ/RTAT10' },
			echoed,
			{
				status: 400,
			},
		).catch((caught: unknown) => caught);

		expect(String(error)).not.toContain('test-key');
		expect(String(error)).toContain('[REDACTED]');
		// The body is sanitized too, because core does not redact ApiError.body.
		expect(JSON.stringify(asRecord(error)?.body)).not.toContain('test-key');
	});
});

describe('nasdaq plugin definition', () => {
	it('registers as nasdaq with api_key auth and no webhooks', () => {
		const plugin = nasdaq();
		expect(plugin.id).toBe('nasdaq');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the three Tables API operations', () => {
		const nested = Object.entries(plugin().endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'tables.export',
			'tables.metadata',
			'tables.rows',
		]);
	});

	it('marks every operation a read, because nothing here writes', () => {
		const meta = nasdaq().endpointMeta ?? {};
		for (const entry of Object.values(meta)) {
			expect(entry.riskLevel).toBe('read');
		}
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = nasdaq();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve('stored') },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve(undefined) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('is creatable through createCorsair', () => {
		const corsair = createCorsair({ plugins: [nasdaq({ key: 'k' })] });
		expect(corsair.nasdaq).toBeDefined();
	});
});

function plugin() {
	return nasdaq();
}
