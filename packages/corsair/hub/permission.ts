import { hubApiPost } from './client/http';
import { parsePermissionSessionResponse } from './contracts/connect-api';
import type {
	HubConfig,
	HubPermissionSessionInput,
	HubPermissionSessionResult,
} from './types';

export async function createHubPermissionSession(
	hub: HubConfig,
	input: HubPermissionSessionInput,
): Promise<HubPermissionSessionResult> {
	return hubApiPost({
		hub,
		path: '/permission/sessions',
		notFoundMessage:
			'Hub REST API not found at /permission/sessions. Check HUB_API_URL and ensure the Hub API is deployed.',
		body: {
			permissionId: input.permissionId,
			permissionToken: input.permissionToken,
			plugin: input.plugin,
			endpoint: input.endpoint,
			args: input.args,
			tenantId: input.tenantId,
			deliveryUrl: hub.deliveryUrl,
			expiresAt: input.expiresAt,
		},
		parseResponse: parsePermissionSessionResponse,
	});
}

export function formatHubApprovalMessage(approvalUrl: string): string {
	return `Approval required. Visit ${approvalUrl} to approve or deny, then tell the agent to retry this action.`;
}
