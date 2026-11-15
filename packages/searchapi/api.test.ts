import type { SearchApiContext } from './context';
import { getAccount } from './endpoints/read';

console.warn('Skipping the live SearchAPI account call in unit tests.');

const live = it.skip;

live('reads the account', async () => {
	const result = await getAccount(
		{ key: process.env.SEARCHAPI_API_KEY } as SearchApiContext,
		{},
	);
	expect(result.account.id).toBe('account');
});
