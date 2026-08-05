import { slack } from './index';

// The scopes the SDK requests must stay in sync with the Bot Token Scopes
// configured on the Slack app (api.slack.com -> OAuth & Permissions). A scope
// requested here but not configured there fails connect with invalid_scope;
// a scope configured there but not requested here is never granted.
const EXPECTED_BOT_SCOPES = [
	'channels:read',
	'channels:history',
	'channels:join',
	'channels:manage',
	'groups:read',
	'groups:history',
	'groups:write',
	'im:read',
	'im:history',
	'im:write',
	'mpim:read',
	'mpim:history',
	'mpim:write',
	'chat:write',
	'chat:write.public',
	'reactions:read',
	'reactions:write',
	'files:read',
	'files:write',
	'users:read',
	'users:read.email',
];

describe('Slack OAuth scopes', () => {
	it('requests exactly the configured bot-token scope set', () => {
		const scopes = slack({}).oauthConfig?.scopes ?? [];
		expect([...scopes].sort()).toEqual([...EXPECTED_BOT_SCOPES].sort());
	});

	it('requests users:read.email so member emails resolve', () => {
		// Slack only returns profile.email from users.list/users.info when the
		// token carries users:read.email in addition to users:read.
		const scopes = slack({}).oauthConfig?.scopes ?? [];
		expect(scopes).toContain('users:read');
		expect(scopes).toContain('users:read.email');
	});
});
