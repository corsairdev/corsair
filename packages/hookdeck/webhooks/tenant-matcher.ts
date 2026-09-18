import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchHookdeckTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const data = asRecord(body.data);
	const externalId = firstString([
		body.tenant_external_id,
		body.tenant_id,
		body.team_id,
		body.account_id,
		body.organization_id,
		data?.tenant_external_id,
		data?.tenant_id,
		data?.team_id,
		data?.account_id,
		data?.organization_id,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
