import type { StormglassContext } from './context';
import { getElevation } from './endpoints/read';

// The free plan allows 10 requests a day, so the live suite makes one call.
const key = process.env.STORMGLASS_API_KEY;
const live = key ? it : it.skip;
if (!key) {
	console.warn(
		'Skipping live Stormglass tests: STORMGLASS_API_KEY is not set.',
	);
}

live('reads elevation for one point', async () => {
	const result = await getElevation({ key } as StormglassContext, {
		lat: 58.7984,
		lng: 17.8081,
	});
	expect(typeof result.point.elevation).toBe('number');
	expect(typeof result.quota.dailyQuota).toBe('number');
});
