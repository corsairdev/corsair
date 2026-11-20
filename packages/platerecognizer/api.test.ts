import type { PlateRecognizerContext } from './context';
import { readPlate } from './endpoints/reader';
import { getStatistics } from './endpoints/statistics';

const apiKey = process.env.PLATERECOGNIZER_API_KEY;
if (!apiKey) {
	console.warn(
		'PLATERECOGNIZER_API_KEY is not set. Skipping live Plate Recognizer calls.',
	);
}

const live = apiKey ? it : it.skip;
const ctx = { key: apiKey } as PlateRecognizerContext;

live('reads usage statistics', async () => {
	const result = await getStatistics(ctx, {});
	expect(typeof result.total_calls).toBe('number');
});

live('reads the plate in the demo image by URL', async () => {
	const result = await readPlate(ctx, {
		uploadUrl: 'https://app.platerecognizer.com/static/demo.jpg',
	});
	expect(result.results.length).toBeGreaterThan(0);
});
