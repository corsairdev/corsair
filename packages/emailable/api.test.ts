import type { EmailableContext } from './context';
import { getAccount, verifyEmail } from './endpoints/read';

// The test key returns sample results and spends no credits.
const key = process.env.EMAILABLE_API_KEY;
const testKey = process.env.EMAILABLE_TEST_API_KEY;
const live = key && testKey ? it : it.skip;
if (!key || !testKey) {
	console.warn(
		'Skipping live Emailable tests: EMAILABLE_API_KEY or EMAILABLE_TEST_API_KEY is not set.',
	);
}

live('reads the account credits', async () => {
	const result = await getAccount({ key } as EmailableContext, {});
	expect(typeof result.account.availableCredits).toBe('number');
});

live('verifies a test address with the test key', async () => {
	const result = await verifyEmail({ key: testKey } as EmailableContext, {
		email: 'deliverable@example.com',
	});
	expect(result.verification?.state).toBe('deliverable');
});
