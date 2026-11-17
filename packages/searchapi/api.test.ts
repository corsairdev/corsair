import type { SearchApiContext } from './context';
import { getAccount } from './endpoints/read';

const apiKey = process.env.SEARCHAPI_API_KEY;
if (!apiKey) {
	console.warn('SEARCHAPI_API_KEY is not set. Skipping live SearchAPI calls.');
}
const live = apiKey ? it : it.skip;

live('reads the account', async () => {
	const result = await getAccount({ key: apiKey } as SearchApiContext, {});
	expect(result.account.id).toBe('account');
});
