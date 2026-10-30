import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchSlackbotTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	if (body.type === 'url_verification') return null;

	const authorization = Array.isArray(body.authorizations)
		? asRecord(body.authorizations[0])
		: undefined;

	if (
		body.is_enterprise_install === true ||
		authorization?.is_enterprise_install === true
	) {
		const enterpriseId = firstString([
			body.enterprise_id,
			authorization?.enterprise_id,
		]);
		if (enterpriseId) {
			return { linkType: 'enterprise_id', externalId: enterpriseId };
		}
	}

	const teamId = firstString([
		body.team_id,
		asRecord(body.event)?.team,
		authorization?.team_id,
	]);

	if (!teamId) return null;

	return { linkType: 'team_id', externalId: teamId };
}
