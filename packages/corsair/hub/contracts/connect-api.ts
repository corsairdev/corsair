import type {
	HubConnectSessionResult,
	HubOAuthMode,
	HubPermissionSessionResult,
} from '../types';

// Mirrors hub/packages/api/src/connect/http.ts connectPluginSchema + request body.
export type ConnectAuthKind = 'oauth' | 'api_key' | 'bot_token';

export type ConnectPluginManifestEntry = {
	plugin: string;
	providerName: string;
	authKind: ConnectAuthKind;
	credentialFields?: string[];
	alreadyConfigured?: boolean;
	oauthMode?: HubOAuthMode;
	oauthUrl?: string;
	state?: string;
};

export type CreateConnectSessionRequestBody = {
	tenantId: string;
	deliveryUrl: string;
	source?: 'client' | 'server';
	plugins: ConnectPluginManifestEntry[];
};

export type CreatePermissionSessionRequestBody = {
	permissionId: string;
	permissionToken: string;
	plugin: string;
	endpoint: string;
	args: unknown;
	tenantId: string;
	deliveryUrl: string;
	expiresAt: string;
};

export type HubOAuthRefreshResponse = {
	access_token: string;
	refresh_token?: string;
	expires_in?: number;
	scope?: string;
};

type HubApiErrorBody = {
	error?: string;
	message?: string;
};

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0;
}

export function parseConnectSessionResponse(
	payload: unknown,
): HubConnectSessionResult {
	if (!payload || typeof payload !== 'object') {
		throw new Error('Hub API returned an empty connect session');
	}

	const session = payload as Record<string, unknown>;

	if (
		!isNonEmptyString(session.connectUrl) ||
		!isNonEmptyString(session.token) ||
		!isNonEmptyString(session.projectId)
	) {
		throw new Error(
			'Hub API returned an incomplete connect session (expected connectUrl, token, and projectId)',
		);
	}

	const result: HubConnectSessionResult = {
		connectUrl: session.connectUrl,
		token: session.token,
		projectId: session.projectId,
	};

	if (isNonEmptyString(session.expiresAt)) {
		result.expiresAt = session.expiresAt;
	}

	return result;
}

export function parsePermissionSessionResponse(
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

export function parseOAuthRefreshResponse(
	payload: unknown,
): HubOAuthRefreshResponse {
	if (!payload || typeof payload !== 'object') {
		throw new Error('Hub token refresh returned an empty response');
	}

	const record = payload as Record<string, unknown>;
	if (!isNonEmptyString(record.access_token)) {
		throw new Error('Hub token refresh returned no access_token');
	}

	return {
		access_token: record.access_token,
		refresh_token: isNonEmptyString(record.refresh_token)
			? record.refresh_token
			: undefined,
		expires_in:
			typeof record.expires_in === 'number' ? record.expires_in : undefined,
		scope: isNonEmptyString(record.scope) ? record.scope : undefined,
	};
}

export function parseHubApiErrorBody(payload: unknown): string | null {
	if (!payload || typeof payload !== 'object') {
		return null;
	}

	const body = payload as HubApiErrorBody;
	return body.error ?? body.message ?? null;
}
