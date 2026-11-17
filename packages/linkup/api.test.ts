import { getCredits } from './endpoints/read';

console.warn('Skipping the live Linkup credits call in unit tests.');

const live = it.skip;

live('reads credits when a key is present', async () => {
	const key = process.env.LINKUP_API_KEY;
	if (!key) return;
	const result = await getCredits({ key } as never, {});
	expect(result.credit.id).toBe('balance');
});
