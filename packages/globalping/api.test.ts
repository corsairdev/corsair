import type { GlobalpingContext } from './context';
import { getHealth, getLimits } from './endpoints/read';

// Globalping answers these without a key, so the live suite is opt-in:
// set GLOBALPING_LIVE=1 (and GLOBALPING_API_KEY to test the token path).
const apiKey = process.env.GLOBALPING_API_KEY;
const enabled = process.env.GLOBALPING_LIVE === '1' || Boolean(apiKey);
if (!enabled) {
	console.warn(
		'GLOBALPING_LIVE and GLOBALPING_API_KEY are not set. Skipping live Globalping calls.',
	);
}
const live = enabled ? it : it.skip;

function context(): GlobalpingContext {
	return { key: apiKey } as unknown as GlobalpingContext;
}

live('reads health', async () => {
	const result = await getHealth(context(), {});
	expect(result.health.status.length).toBeGreaterThan(0);
});

live('reads the create rate limit', async () => {
	const result = await getLimits(context(), {});
	expect(typeof result.limit.limit).toBe('number');
});
