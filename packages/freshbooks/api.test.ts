import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { FreshBooksEndpointOutputSchemas as Outputs } from './endpoints/types';
import { freshbooks } from './index';

/**
 * Live smoke against the real API, gated on an access token. CI skips this
 * file. The token is an OAuth 2 access token created through the caller's own
 * FreshBooks app (https://www.freshbooks.com/api/authentication); it expires
 * after 12 hours. FRESHBOOKS_ACCOUNT_ID is the accountId from users.me
 * (business_memberships[].business.account_id); the accounting family needs
 * it, so the accounting probe is skipped with a warning when only the token
 * is set. Every call is a read.
 */
const TOKEN = process.env.FRESHBOOKS_API_KEY;
const ACCOUNT_ID = process.env.FRESHBOOKS_ACCOUNT_ID;

const hasKey = Boolean(TOKEN);
const hasAccountId = Boolean(ACCOUNT_ID);

const describeLive = hasKey ? describe : describe.skip;

beforeAll(() => {
	if (hasKey && !hasAccountId) {
		console.warn(
			'FRESHBOOKS_API_KEY is set but FRESHBOOKS_ACCOUNT_ID is not: the accounting clients.list probe will be skipped, which is not a green run.',
		);
	}
});

describeLive('freshbooks live smoke', () => {
	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'freshbooks', 'default');
		const corsair = createCorsair({
			plugins: [freshbooks({ key: TOKEN })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	it('reads the authenticated identity with its ids', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const raw = await corsair.freshbooks.api.users.me({});

			const parsed = Outputs.usersMe.parse(raw);
			console.log(
				`users.me: email=${parsed.email} accountId=${parsed.accountId} businessId=${parsed.businessId}`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	const describeAccounting = hasAccountId ? it : it.skip;

	describeAccounting('reads one page of clients', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const raw = await corsair.freshbooks.api.clients.list({
				accountId: ACCOUNT_ID as string,
				page: 1,
				per_page: 1,
			});

			const parsed = Outputs.clientsList.parse(raw);
			console.log(`clients.list: total=${parsed.total}`);
		} finally {
			testDb.cleanup();
		}
	});
});
