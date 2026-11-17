import { createCorsair } from 'corsair/core';
import { NasdaqEndpointOutputSchemas as Outputs } from './endpoints/types';
import { nasdaq } from './index';

/**
 * Live smoke test: one call per wrapped route, every answer parsed through its
 * output schema before an assertion touches it.
 *
 * Uses NDAQ/RTAT10, the free retail-activity table, so a trial key is enough.
 * Skipped unless NASDAQ_API_KEY is set, and the skip is logged so it cannot
 * read as a pass.
 */
const apiKey = process.env.NASDAQ_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('NASDAQ_API_KEY is not set: live tests skipped');
}

describeIfKey('Nasdaq Data Link live API', () => {
	const corsair = createCorsair({ plugins: [nasdaq({ key: apiKey })] });

	it('reads table metadata through the output schema', async () => {
		const parsed = Outputs.tablesMetadata.parse(
			await corsair.nasdaq.api.tables.metadata({ table: 'NDAQ/RTAT10' }),
		);

		expect(parsed.datatable_code).toBe('RTAT10');
		expect(parsed.vendor_code).toBe('NDAQ');
		expect(parsed.columns.length).toBeGreaterThan(0);
		// Filters is what a caller needs before building a query.
		expect(Array.isArray(parsed.filters)).toBe(true);
	}, 30_000);

	it('reads rows through the output schema', async () => {
		const parsed = Outputs.tablesRows.parse(
			await corsair.nasdaq.api.tables.rows({
				table: 'NDAQ/RTAT10',
				per_page: 2,
			}),
		);

		expect(parsed.rows).toHaveLength(2);
		expect(parsed.columns.length).toBeGreaterThan(0);
		// Each row must be as wide as the column list, or the zip is wrong.
		for (const row of parsed.rows) {
			expect(row).toHaveLength(parsed.columns.length);
		}
	}, 30_000);

	it('pages with the cursor from the first response', async () => {
		const first = Outputs.tablesRows.parse(
			await corsair.nasdaq.api.tables.rows({
				table: 'NDAQ/RTAT10',
				per_page: 1,
			}),
		);

		// A one-row page on a table with thousands of rows always has more.
		const cursor = first.next_cursor_id;
		expect(typeof cursor).toBe('string');
		if (!cursor) throw new Error('expected a cursor from the first page');

		const second = Outputs.tablesRows.parse(
			await corsair.nasdaq.api.tables.rows({
				table: 'NDAQ/RTAT10',
				per_page: 1,
				cursor_id: cursor,
			}),
		);
		expect(second.rows).toHaveLength(1);
		// The second page is a different row, not the same one repeated.
		expect(second.rows[0]).not.toEqual(first.rows[0]);
	}, 30_000);

	it('queues a bulk export through the output schema', async () => {
		const parsed = Outputs.tablesExport.parse(
			await corsair.nasdaq.api.tables.export({ table: 'NDAQ/RTAT10' }),
		);

		// creating or fresh, lowercase as sent; the link only appears once the
		// file exists.
		expect(['fresh', 'creating', 'regenerating']).toContain(parsed.status);
	}, 30_000);
});
