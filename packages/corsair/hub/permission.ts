import type { HubConfig } from './types';

export type HubPermissionSessionInput = {
	permissionId: string;
	permissionToken: string;
	plugin: string;
	endpoint: string;
	args: unknown;
	tenantId: string;
	expiresAt: string;
};

export type HubPermissionSessionResult = {
	approvalUrl: string;
	token: string;
	projectId: string;
	expiresAt: string;
};

type HubCreateSessionErrorResponse = {
	error?: string;
	message?: string;
};

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0;
}

function parseHubPermissionSessionPayload(
	payload: unknown,
): HubPermissionSessionResult {
	if (!payload || typeof payload !== 'object') {
		throw new Error('Hub API returned an empty permission session');
	}

	const session = payload as Record<string, unknown>;

	if (
		!isNonEmptyString(session.approvalUrl) ||
		!isNonEmptyString(session.token) ||
		!isNonEmptyString(session.projectId) ||
		!isNonEmptyString(session.expiresAt)
	) {
		throw new Error(
			'Hub API returned an incomplete permission session (expected approvalUrl, token, projectId, and expiresAt)',
		);
	}

	return {
		approvalUrl: session.approvalUrl,
		token: session.token,
		projectId: session.projectId,
		expiresAt: session.expiresAt,
	};
}

function parseHubSessionError(payload: unknown, status: number): string {
	if (status === 404) {
		return 'Hub REST API not found at /permission/sessions. Check HUB_API_URL and ensure the Hub API is deployed.';
	}

	if (payload && typeof payload === 'object') {
		const direct = payload as HubCreateSessionErrorResponse;
		if (direct.error) return direct.error;
		if (direct.message) return direct.message;
	}

	return `Hub API returned HTTP ${status}`;
}

async function readHubJsonResponse(response: Response): Promise<unknown> {
	const contentType = response.headers.get('content-type') ?? '';
	const bodyText = await response.text();

	if (!bodyText) {
		return null;
	}

	if (
		!contentType.includes('application/json') &&
		bodyText.trimStart().startsWith('<')
	) {
		throw new Error(
			`Hub API returned HTML instead of JSON (HTTP ${response.status}). Check HUB_API_URL and deploy the latest hub API.`,
		);
	}

	try {
		return JSON.parse(bodyText) as unknown;
	} catch {
		throw new Error(`Hub API returned invalid JSON (HTTP ${response.status})`);
	}
}

export async function createHubPermissionSession(
	hub: HubConfig,
	input: HubPermissionSessionInput,
): Promise<HubPermissionSessionResult> {
	const apiUrl = hub.apiUrl.replace(/\/$/, '');

	const response = await fetch(`${apiUrl}/permission/sessions`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${hub.projectApiKey}`,
		},
		body: JSON.stringify({
			permissionId: input.permissionId,
			permissionToken: input.permissionToken,
			plugin: input.plugin,
			endpoint: input.endpoint,
			args: input.args,
			tenantId: input.tenantId,
			deliveryUrl: hub.deliveryUrl,
			expiresAt: input.expiresAt,
		}),
	});

	const responsePayload = await readHubJsonResponse(response);

	if (!response.ok) {
		throw new Error(parseHubSessionError(responsePayload, response.status));
	}

	return parseHubPermissionSessionPayload(responsePayload);
}

export function formatHubApprovalMessage(approvalUrl: string): string {
	return `Approval required. Visit ${approvalUrl} to approve or deny, then tell the agent to retry this action.`;
}
