import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchWebvizioTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const payload = asRecord(body.payload) ?? asRecord(body.data) ?? body;
	const eventName =
		firstString([body.event, body.type, body.event_type, payload.event]) || '';

	const isProjectEvent = eventName.startsWith('project.') || !eventName;

	const projectUuid = firstString([
		payload.project_uuid,
		payload.projectUuid,
		body.project_uuid,
		body.projectUuid,
		isProjectEvent ? payload.uuid : undefined,
		isProjectEvent ? body.uuid : undefined,
	]);
	if (projectUuid) {
		return { linkType: 'project_uuid', externalId: projectUuid };
	}

	const projectId = firstString([
		payload.project_id,
		payload.projectId,
		body.project_id,
		body.projectId,
		isProjectEvent ? payload.id : undefined,
		isProjectEvent ? body.id : undefined,
	]);
	if (projectId) {
		return { linkType: 'project_id', externalId: projectId };
	}

	const accountId = firstString([
		payload.account_id,
		payload.accountId,
		payload.user_id,
		payload.userId,
		body.account_id,
		body.userId,
	]);
	if (accountId) {
		return { linkType: 'account_id', externalId: accountId };
	}

	return null;
}
