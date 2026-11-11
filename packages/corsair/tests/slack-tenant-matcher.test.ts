import { matchSlackTenantWebhook } from '../../slack/webhooks/tenant-matcher';

function req(body: unknown) {
	return { headers: {}, body };
}

describe('matchSlackTenantWebhook', () => {
	it('emits the user-scoped link first from authorizations[0].user_id', () => {
		const matches = matchSlackTenantWebhook(
			req({
				team_id: 'T1',
				authorizations: [{ team_id: 'T1', user_id: 'U9' }],
				event: { type: 'message', user: 'U9' },
			}),
		);
		expect(matches).toEqual([
			{ linkType: 'slack_user', externalId: 'T1:U9' },
			{ linkType: 'team_id', externalId: 'T1' },
		]);
	});

	it('ignores event.user and returns only the workspace link without authorizations', () => {
		const matches = matchSlackTenantWebhook(
			req({ team_id: 'T1', event: { type: 'message', user: 'U5' } }),
		);
		expect(matches).toEqual([{ linkType: 'team_id', externalId: 'T1' }]);
	});

	it('returns no match for url_verification handshakes', () => {
		const matches = matchSlackTenantWebhook(
			req({ type: 'url_verification', challenge: 'c' }),
		);
		expect(matches).toEqual([]);
	});
});
