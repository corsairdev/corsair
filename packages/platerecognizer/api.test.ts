import type { PlateRecognizerContext } from './context';
import { getStatistics } from './endpoints/statistics';

const apiKey = process.env.PLATERECOGNIZER_API_KEY;
if (!apiKey) {
	console.warn(
		'PLATERECOGNIZER_API_KEY is not set. Skipping live Plate Recognizer calls.',
	);
}

const live = apiKey ? it : it.skip;

live('reads usage statistics', async () => {
	const result = await getStatistics(
		{ key: apiKey } as PlateRecognizerContext,
		{},
	);
	expect(result.usage === undefined || typeof result.usage === 'object').toBe(
		true,
	);
});
