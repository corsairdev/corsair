/**
 * Live smoke tests against the Directory API. They run only when
 * GOOGLE_ADMIN_ACCESS_TOKEN is set (CI has none, so they skip).
 *
 * A token is not enough on its own: the account behind it must be a super
 * administrator of a Google Workspace account, which is what makes every
 * read here meaningful. GOOGLE_ADMIN_DOMAIN narrows the user list to one
 * domain; without it the list asks for `my_customer`.
 *
 * Read-only, and one call: the Directory API allows 2,400 queries per minute
 * per user by default, and one users.list is enough to prove auth, the
 * response envelope and the output schema together.
 */
import { GoogleAdminEndpointOutputSchemas } from './endpoints/types';
import { list as usersList } from './endpoints/users';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = process.env.GOOGLE_ADMIN_ACCESS_TOKEN?.trim();
const DOMAIN = process.env.GOOGLE_ADMIN_DOMAIN?.trim();
const describeLive = TOKEN ? describe : describe.skip;

if (!TOKEN) {
	console.warn(
		'[googleadmin] skipping live tests: GOOGLE_ADMIN_ACCESS_TOKEN is not set',
	);
}

// unknown: the endpoints read only `key` from the context, which is the one
// thing this suite supplies; there is no database or key manager here.
const ctx = { key: TOKEN ?? '' } as unknown as Parameters<typeof usersList>[0];

describeLive('googleadmin live API', () => {
	jest.setTimeout(60_000);

	it('users.list returns a parseable page for the account', async () => {
		// A small page: the point is that auth, the envelope and the schema
		// agree, not that every user comes back.
		const page = await usersList(ctx, {
			...(DOMAIN ? { domain: DOMAIN } : { customer: 'my_customer' }),
			maxResults: 10,
			projection: 'basic',
		});

		// The endpoint parses with the output schema before returning, so this
		// passing already proves the shape. The assertions check the fields a
		// caller relies on.
		expect(Array.isArray(page.users)).toBe(true);
		for (const user of page.users ?? []) {
			expect(typeof user.id).toBe('string');
			expect(typeof user.primaryEmail).toBe('string');
		}
		expect(page.nextPageToken ?? undefined).not.toBe('');

		// The endpoint parsed this with the schema before returning; parsing again
		// pins the contract a caller actually receives.
		expect(
			GoogleAdminEndpointOutputSchemas.usersList.safeParse(page).success,
		).toBe(true);
	});
});
