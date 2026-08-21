import { resolveGithubOAuthWebhookTenantLink } from '../../github/webhooks/oauth-tenant-link';
import { resolveSlackOAuthWebhookTenantLink } from '../../slack/webhooks/oauth-tenant-link';
import type { CorsairPlugin } from '../core';
import { mergeOAuthProviderData } from '../oauth/index';
import { resolveOAuthWebhookTenantLink } from '../webhooks/resolve-oauth-tenant-link';

// Exercises the exact merge processOAuthCallback runs before resolving the
// tenant link: token body wins, callback query params fill gaps.
function mergeProviderData(
	callbackParams: Record<string, string>,
	tokens: Record<string, unknown>,
) {
	return mergeOAuthProviderData(tokens, callbackParams);
}

const githubPlugin = {
	id: 'github',
	oauthWebhookTenantLinkResolver: resolveGithubOAuthWebhookTenantLink,
} as unknown as CorsairPlugin;

const slackPlugin = {
	id: 'slack',
	oauthWebhookTenantLinkResolver: resolveSlackOAuthWebhookTenantLink,
} as unknown as CorsairPlugin;

describe('OAuth callback param propagation to tenant-link resolution', () => {
	it('resolves github installation_id present only in callback params', async () => {
		const providerData = mergeProviderData(
			{ installation_id: '123' },
			{ access_token: 'gho_x' },
		);
		const link = await resolveOAuthWebhookTenantLink(
			[githubPlugin],
			'github',
			providerData,
		);
		expect(link).toEqual({ linkType: 'installation_id', externalId: '123' });
	});

	it('leaves slack (team.id in token body) unchanged', async () => {
		const providerData = mergeProviderData(
			{},
			{ access_token: 'xoxb', team: { id: 'T123' } },
		);
		const link = await resolveOAuthWebhookTenantLink(
			[slackPlugin],
			'slack',
			providerData,
		);
		expect(link).toEqual({ linkType: 'team_id', externalId: 'T123' });
	});

	it('token body wins over a colliding callback param', async () => {
		const providerData = mergeProviderData(
			{ installation_id: 'from-query' },
			{ access_token: 'gho_x', installation_id: 'from-body' },
		);
		const link = await resolveOAuthWebhookTenantLink(
			[githubPlugin],
			'github',
			providerData,
		);
		expect(link).toEqual({
			linkType: 'installation_id',
			externalId: 'from-body',
		});
	});
});
