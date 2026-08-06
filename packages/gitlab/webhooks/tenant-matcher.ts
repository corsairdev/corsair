import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// GitLab project and group webhooks include project_id / project.id on the payload.
// See https://docs.gitlab.com/user/project/integrations/webhook_events/
export function matchGitlabTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const project = asRecord(body.project);
	const group = asRecord(body.group);

	const projectId = firstString([body.project_id, project?.id]);
	if (projectId) {
		return { linkType: 'project_id', externalId: projectId };
	}

	const groupId = firstString([body.group_id, group?.id]);
	if (groupId) {
		return { linkType: 'group_id', externalId: groupId };
	}

	return null;
}
