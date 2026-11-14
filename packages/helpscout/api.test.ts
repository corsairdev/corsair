import { getValidHelpScoutAccessToken } from './client';
import type { HelpScoutContext } from './index';
import { helpscout } from './index';

// A Help Scout app's id and secret (My Apps > Create App); the test gets a
// 2-day token through the client-credentials grant.
const clientId = process.env.HELPSCOUT_CLIENT_ID;
const clientSecret = process.env.HELPSCOUT_CLIENT_SECRET;
const hasCredentials = Boolean(clientId && clientSecret);

const describeLive = hasCredentials ? describe : describe.skip;

if (!hasCredentials) {
	console.log(
		'HELPSCOUT_CLIENT_ID / HELPSCOUT_CLIENT_SECRET not set. Skipping live Help Scout smoke tests.',
	);
}

function buildCtx(token: string): HelpScoutContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: token,
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
			get_access_token: () => Promise.resolve(token),
			set_access_token: () => Promise.resolve(),
			get_refresh_token: () => Promise.resolve(null),
			set_refresh_token: () => Promise.resolve(),
			get_expires_at: () => Promise.resolve(null),
			set_expires_at: () => Promise.resolve(),
			get_scope: () => Promise.resolve(null),
			set_scope: () => Promise.resolve(),
			get_integration_credentials: () =>
				Promise.resolve({
					client_id: clientId ?? null,
					client_secret: clientSecret ?? null,
					redirect_url: null,
				}),
		},
		db: {},
	};
}

describeLive('Help Scout Live API smoke tests (read-only)', () => {
	let ctx: HelpScoutContext;
	const plugin = helpscout();

	beforeAll(async () => {
		const token = await getValidHelpScoutAccessToken({
			clientId,
			clientSecret,
		});
		ctx = buildCtx(token.accessToken);
	});

	it('lists mailboxes successfully', async () => {
		const result = await plugin.endpoints!.mailboxes.list(ctx, { page: 1 });
		expect(Array.isArray(result._embedded.mailboxes)).toBe(true);
	});

	it('lists tags successfully', async () => {
		const result = await plugin.endpoints!.tags.list(ctx, { page: 1 });
		expect(Array.isArray(result._embedded.tags)).toBe(true);
	});
});
