import { taxjar } from './index';

/**
 * Live smoke test against the real API. It runs only when TAXJAR_API_KEY is
 * set, and it only reads (categories, a rate, summary rates): nothing is
 * created, so nothing reaches TaxJar's reports or filings.
 */
const API_KEY = process.env.TAXJAR_API_KEY;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn('Skipping the live TaxJar tests; TAXJAR_API_KEY is not set');
}

const describeIfKey = API_KEY ? describe : describe.skip;

describeIfKey('TaxJar live API (reads only)', () => {
	const plugin = taxjar({ key: API_KEY });
	const ctx = { key: API_KEY ?? '', options: plugin.options } as never;

	it('lists the product tax categories', async () => {
		const result = await plugin.endpoints!.categories.list(ctx, {} as never);
		expect(result).toBeDefined();
	});

	it('reads the rate for a ZIP code', async () => {
		const result = await plugin.endpoints!.rates.get(ctx, {
			zip: '90002',
			country: 'US',
		} as never);
		expect(result).toBeDefined();
	});

	it('lists summary rates', async () => {
		const result = await plugin.endpoints!.summaryRates.list(ctx, {} as never);
		expect(result).toBeDefined();
	});
});
