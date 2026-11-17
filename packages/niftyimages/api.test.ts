import { createCorsair } from 'corsair/core';
import { NiftyimagesEndpointOutputSchemas as Outputs } from './endpoints/types';
import { niftyimages } from './index';

/**
 * Live smoke test. Read-only: nothing here sends an image or changes a widget.
 *
 * Every answer goes through its output schema before an assertion touches it.
 * Skipped unless NIFTYIMAGES_API_KEY is set, and the skip is logged so it cannot
 * read as a pass.
 */
const apiKey = process.env.NIFTYIMAGES_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('NIFTYIMAGES_API_KEY is not set: live tests skipped');
}

describeIfKey('NiftyImages live API', () => {
	const corsair = createCorsair({ plugins: [niftyimages({ key: apiKey })] });

	it('lists widgets through the output schema', async () => {
		const parsed = Outputs.widgetsList.parse(
			await corsair.niftyimages.api.widgets.list({}),
		);

		expect(Array.isArray(parsed.widgets)).toBe(true);
		for (const widget of parsed.widgets) {
			expect(typeof widget.WidgetKey).toBe('string');
			expect(typeof widget.Name).toBe('string');
		}
	}, 30_000);

	it('reads widget stats through the output schema', async () => {
		const parsed = Outputs.widgetsStats.parse(
			await corsair.niftyimages.api.widgets.stats({}),
		);

		expect(Array.isArray(parsed.stats)).toBe(true);
		for (const row of parsed.stats) {
			// Counts are numbers, and a silent widget reports zeroes.
			expect(
				typeof row.Impressions === 'number' || row.Impressions == null,
			).toBe(true);
		}
	}, 30_000);

	it('reads users for the first widget when one exists', async () => {
		const { widgets } = Outputs.widgetsList.parse(
			await corsair.niftyimages.api.widgets.list({}),
		);
		const widgetKey = widgets[0]?.WidgetKey;
		// An account with no widgets has nothing to read here.
		if (!widgetKey) return;

		const parsed = Outputs.widgetsUsers.parse(
			await corsair.niftyimages.api.widgets.users({ widgetKey }),
		);
		expect(Array.isArray(parsed.users)).toBe(true);
	}, 30_000);

	it('reads images for the first widget when one exists', async () => {
		const { widgets } = Outputs.widgetsList.parse(
			await corsair.niftyimages.api.widgets.list({}),
		);
		const widgetKey = widgets[0]?.WidgetKey;
		if (!widgetKey) return;

		const parsed = Outputs.widgetImages.parse(
			await corsair.niftyimages.api.widgets.images({ widgetKey }),
		);
		expect(Array.isArray(parsed.images)).toBe(true);
	}, 30_000);
});
