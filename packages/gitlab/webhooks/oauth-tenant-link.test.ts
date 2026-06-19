import { resolveGitlabOAuthWebhookTenantLink } from './oauth-tenant-link';

describe('resolveGitlabOAuthWebhookTenantLink', () => {
	it('returns null so project_id or group_id is set at webhook registration', () => {
		expect(
			resolveGitlabOAuthWebhookTenantLink({
				access_token: 'token',
			}),
		).toBeNull();
	});
});
