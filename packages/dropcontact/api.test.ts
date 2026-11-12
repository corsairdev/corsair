import { DropcontactAPIError, makeDropcontactRequest } from './client';

/**
 * Live smoke tests against the real API. Gated on `DROPCONTACT_API_KEY`.
 *
 * Every call here is read-only and costs no credits: `account.credits` and the
 * webhook read. Enrichment is deliberately not exercised, because it spends a
 * credit per contact and enqueues a batch that cannot be cancelled, and a test
 * suite should not do that on someone's account.
 *
 * CI ignores this file by name (`api.test.ts`), so it only runs through
 * `pnpm --filter @corsair-dev/dropcontact test:live`.
 */
const API_KEY = process.env.DROPCONTACT_API_KEY;

const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped run must not read as a green one.
	console.warn(
		'DROPCONTACT_API_KEY is not set, so the Dropcontact live smoke tests are skipped. Create a key at https://app.dropcontact.com/api and export it to run them.',
	);
}

// unknown: the raw client returns untyped JSON; each test narrows what it reads.
async function get(path: string) {
	return makeDropcontactRequest(API_KEY as string, { method: 'GET', path });
}

describeIfKey('Dropcontact live API', () => {
	it('reports the credit balance', async () => {
		const raw = (await get('/v1/account/credits')) as { credits: number };

		expect(typeof raw.credits).toBe('number');
		expect(raw.credits).toBeGreaterThanOrEqual(0);
	});

	it('reports the accounts default webhook callback URL', async () => {
		// Null when none is configured is a valid answer, so only the type is pinned.
		const raw = (await get('/v1/enrich/webhook')) as {
			success?: boolean;
			callback_url?: string | null;
		};

		expect(raw.success).not.toBe(false);
		expect(
			raw.callback_url === null || typeof raw.callback_url === 'string',
		).toBe(true);
	});

	it('answers 401 with its own envelope for a bad key', async () => {
		// The one failure path that can be exercised without touching the account.
		const failure = await makeDropcontactRequest('definitely-not-a-key', {
			method: 'GET',
			path: '/v1/account/credits',
		}).catch(
			// unknown: a rejection can be any value until the assertion narrows it.
			(caught: unknown) => caught,
		);

		expect(failure).toBeInstanceOf(DropcontactAPIError);
		expect((failure as DropcontactAPIError).status).toBe(401);
		expect((failure as DropcontactAPIError).reason).toBeTruthy();
	});
});
