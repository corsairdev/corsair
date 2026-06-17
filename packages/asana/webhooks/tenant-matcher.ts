import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import {
	asRecord,
	getHeader,
	readBodyRecord,
	toExternalId,
} from 'corsair/core';

function workspaceGidFromEvents(events: unknown[]): string | undefined {
	for (const event of events) {
		const eventRecord = asRecord(event);
		if (!eventRecord) continue;

		const resource = asRecord(eventRecord.resource);
		if (resource?.resource_type === 'workspace') {
			const workspaceGid = toExternalId(resource.gid);
			if (workspaceGid) return workspaceGid;
		}

		const parent = asRecord(eventRecord.parent);
		if (parent?.resource_type === 'workspace') {
			const workspaceGid = toExternalId(parent.gid);
			if (workspaceGid) return workspaceGid;
		}
	}

	return undefined;
}

// Asana handshake (X-Hook-Secret) and heartbeat deliveries (empty events) carry no tenant id.
// Workspace-scoped events include resource.resource_type === 'workspace'.
// See https://developers.asana.com/docs/webhooks-guide
export function matchAsanaTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	if (getHeader(request.headers, 'x-hook-secret')) return null;

	const body = readBodyRecord(request);
	if (!body) return null;

	const events = body.events;
	if (!Array.isArray(events) || events.length === 0) return null;

	const workspaceGid = workspaceGidFromEvents(events);
	if (!workspaceGid) return null;

	return { linkType: 'workspace_gid', externalId: workspaceGid };
}
