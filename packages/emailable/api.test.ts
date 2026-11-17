import { getAccount } from './endpoints/read';

console.warn('Skipping the live Emailable account call in unit tests.');

const live = it.skip;

live('reads the account when a key is present', async () => {
	const key = process.env.EMAILABLE_API_KEY;
	if (!key) return;
	const result = await getAccount({ key } as never, {});
	expect(result.account.id).toBe('account');
});
