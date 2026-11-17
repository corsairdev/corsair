import type { TripadvisorContentApiContext } from './context';
import { searchLocations } from './endpoints/read';

console.warn('Skipping the live Tripadvisor search in unit tests.');

const live = it.skip;

live('searches locations', async () => {
	const result = await searchLocations(
		{ key: process.env.TRIPADVISOR_API_KEY } as TripadvisorContentApiContext,
		{ searchQuery: 'london' },
	);
	expect(Array.isArray(result.locations)).toBe(true);
});
