import type { GlobalpingContext } from './context';
import { getHealth } from './endpoints/read';

console.warn('Skipping the live Globalping health call in unit tests.');

const live = it.skip;

live('reads health', async () => {
	const result = await getHealth({} as GlobalpingContext, {});
	expect(result.health.status.length).toBeGreaterThan(0);
});
