import type { RecallaiContext } from './index';

const testContext = {
	key: 'recall-key',
	options: {},
	$getAccountId: async () => 'test-account',
} satisfies Pick<RecallaiContext, 'key' | 'options' | '$getAccountId'>;

// Endpoint unit tests only exercise key, options, and account lookup. The core
// context also requires database entity helpers and bound endpoints that these
// handlers do not access.
export const recallaiTestContext = testContext as RecallaiContext;
