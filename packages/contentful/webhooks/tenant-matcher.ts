import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, readBodyRecord } from 'corsair/core';

export function matchContentfulTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const sys = asRecord(body.sys);
	if (!sys) return null;

	const space = asRecord(sys.space);
	if (!space) return null;

	const spaceSys = asRecord(space.sys);
	if (!spaceSys) return null;

	const spaceId = typeof spaceSys.id === 'string' ? spaceSys.id : undefined;

	if (!spaceId) return null;

	return { linkType: 'account_id', externalId: spaceId };
}
