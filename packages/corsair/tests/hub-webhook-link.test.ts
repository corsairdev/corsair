import { buildWebhookLinkReport } from '../hub/report-connection-status';

describe('buildWebhookLinkReport', () => {
	it('carries the webhookLink and marks the connection ready/connected/verified', () => {
		const report = buildWebhookLinkReport({
			plugin: 'gmail',
			tenantId: 'user_1',
			link: { linkType: 'email_address', externalId: 'u@example.com' },
		});

		expect(report).toEqual({
			tenantId: 'user_1',
			plugin: 'gmail',
			authType: 'oauth_2',
			status: 'ready',
			connected: true,
			verified: true,
			webhookLink: { linkType: 'email_address', externalId: 'u@example.com' },
		});
	});

	it('lets the caller override authType (e.g. subscription-time MS links)', () => {
		const report = buildWebhookLinkReport({
			plugin: 'outlook',
			tenantId: 'user_2',
			link: { linkType: 'subscription_id', externalId: 'sub-1' },
			authType: 'oauth_2',
		});

		expect(report.webhookLink).toEqual({
			linkType: 'subscription_id',
			externalId: 'sub-1',
		});
		expect(report.plugin).toBe('outlook');
	});
});
