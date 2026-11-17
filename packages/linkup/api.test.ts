import type { LinkupContext } from './context';
import { getCredits } from './endpoints/read';

// Only the free credits call: every other Linkup call is billed.
const key = process.env.LINKUP_API_KEY;
const live = key ? it : it.skip;
if (!key) {
	console.warn('Skipping live Linkup tests: LINKUP_API_KEY is not set.');
}

live('reads the credit balance', async () => {
	const result = await getCredits({ key } as LinkupContext, {});
	expect(typeof result.credit.balance).toBe('number');
});
