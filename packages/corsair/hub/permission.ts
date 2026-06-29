import { hubApiPost } from './client/http';
import { inferHubEnvironmentSlug } from './config';
import { parsePermissionSessionResponse } from './contracts/connect-api';
import { resolveHubDeliveryUrl } from './resolve-delivery-url';
import type {
	HubConfig,
	HubPermissionSessionInput,
	HubPermissionSessionResult,
} from './types';

export async function createHubPermissionSession(
	hub: HubConfig,
	input: HubPermissionSessionInput,
): Promise<HubPermissionSessionResult> {
	const environmentSlug = inferHubEnvironmentSlug(hub.projectApiKey);

	const body: Record<string, unknown> = {
		permissionId: input.permissionId,
		permissionToken: input.permissionToken,
		plugin: input.plugin,
		endpoint: input.endpoint,
		args: input.args,
		tenantId: input.tenantId,
		expiresAt: input.expiresAt,
	};

	if (environmentSlug === 'development') {
		body.deliveryUrl = resolveHubDeliveryUrl({ deliveryUrl: input.deliveryUrl });
	}

	return hubApiPost({
		hub,
		path: '/permission/sessions',
		notFoundMessage:
			'Hub REST API not found at /permission/sessions. Check HUB_API_URL and ensure the Hub API is deployed.',
		body,
		parseResponse: parsePermissionSessionResponse,
	});
}

export function formatHubApprovalMessage(approvalUrl: string): string {
	return `Approval required. Visit ${approvalUrl} to approve or deny, then tell the agent to retry this action.`;
}
