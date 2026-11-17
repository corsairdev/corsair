import { templated } from './index';

/**
 * Live smoke test against the real API. It runs only when TEMPLATED_API_KEY is
 * set, and it only reads: no render is created, so no credit is spent.
 */
const API_KEY = process.env.TEMPLATED_API_KEY;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		'Skipping the live Templated tests; TEMPLATED_API_KEY is not set',
	);
}

const describeIfKey = API_KEY ? describe : describe.skip;

describeIfKey('Templated live API (reads only)', () => {
	const plugin = templated({ key: API_KEY });
	const ctx = { key: API_KEY ?? '', options: plugin.options } as never;

	it('reads the account', async () => {
		const account = await plugin.endpoints!.account.get(ctx, {} as never);
		expect(account).toBeDefined();
	});

	it('lists templates', async () => {
		const templates = await plugin.endpoints!.templates.list(ctx, {} as never);
		expect(Array.isArray(templates)).toBe(true);
	});

	it('lists the gallery fonts', async () => {
		const fonts = await plugin.endpoints!.galleryFonts.list(ctx, {} as never);
		expect(Array.isArray(fonts)).toBe(true);
	});
});
