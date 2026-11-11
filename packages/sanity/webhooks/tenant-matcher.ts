import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { isValidProjectId } from '../client';
import { headerValue, SANITY_WEBHOOK_HEADERS } from './types';

/**
 * Every Sanity delivery names its project in the `sanity-project-id` header, and
 * each account stores the project it connected as `project_id`, so a delivery
 * routes to the account that owns that project. Two accounts on one project
 * can't be told apart by this alone: give each a webhook with `?tenantId=`.
 */
export function matchSanityTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const projectId = headerValue(
		request.headers,
		SANITY_WEBHOOK_HEADERS.projectId,
	)?.trim();
	if (!projectId || !isValidProjectId(projectId)) return null;
	return { linkType: 'project_id', externalId: projectId };
}
