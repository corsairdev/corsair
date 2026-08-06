import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// PostHog webhook destinations can include project metadata when configured.
// The default flat capture schema has no guaranteed tenant field.
// See https://posthog.com/docs/cdp/destinations/customizing-destinations
export function matchPostHogTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const project = asRecord(body.project);
	const projectId = firstString([project?.id]);
	if (projectId) {
		return { linkType: 'project_id', externalId: projectId };
	}

	const properties = asRecord(body.properties);
	const teamId = firstString([
		properties?.team_id,
		properties?.$team_id,
		properties?.$project_id,
	]);
	if (teamId) {
		return { linkType: 'project_id', externalId: teamId };
	}

	return null;
}
