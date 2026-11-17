import type { StormglassContext } from './context';
import { listStations } from './endpoints/read';

console.warn('Skipping the live Stormglass stations call in unit tests.');

const live = it.skip;

live('lists stations', async () => {
	const result = await listStations(
		{ key: process.env.STORMGLASS_API_KEY } as StormglassContext,
		{},
	);
	expect(Array.isArray(result.stations)).toBe(true);
});
