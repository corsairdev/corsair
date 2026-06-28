import type {
	HubConnectSessionResult,
	HubOAuthMode,
	HubPermissionSessionResult,
} from '../types';

// Mirrors hub/packages/api/src/connect/http.ts connectPluginSchema + request body.
// Hub generates OAuth state server-side; the SDK must not send state.
export type ConnectAuthKind = 'oauth' | 'api_key' | 'bot_token';

export type ConnectPluginManifestEntry = {
	plugin: string;
	providerName: string;
	authKind: ConnectAuthKind;
	credentialFields?: string[];
	alreadyConfigured?: boolean;
	oauthMode?: HubOAuthMode;
	oauthUrl?: string;
	setupError?: string;
};

export type HubProjectConnection = {
	tenantId: string;
	plugin: string;
	status: 'pending' | 'connected' | 'failed';
	authKind: ConnectAuthKind;
	connectedAt: string | null;
	expiresAt: string | null;
};

export type ConnectAuthFieldStatus = {
	name: string;
	level: 'integration' | 'account';
	required: boolean;
	configured: boolean;
};

export type ConnectAuthStatusLevel =
	| 'ready'
	| 'partial'
	| 'not_started'
	| 'missing_integration';

export type ConnectStatusPluginEntry = {
	plugin: string;
	providerName: string;
	authKind: ConnectAuthKind;
	status: ConnectAuthStatusLevel;
	connected: boolean;
	fields: ConnectAuthFieldStatus[];
	missingRequiredFields: string[];
};

export type ConnectStatusResponse = {
	tenantId: string;
	plugins: ConnectStatusPluginEntry[];
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

// Mirrors hub/packages/api/src/managed/oauth-tokens.ts ManagedOAuthTokenPayload.
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

function isHubConnectionStatus(
	value: unknown,
): value is HubProjectConnection['status'] {
	return (
		value === 'pending' || value === 'connected' || value === 'failed'
	);
}

function isConnectAuthKindValue(value: unknown): value is ConnectAuthKind {
	return value === 'oauth' || value === 'api_key' || value === 'bot_token';
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

export function parseProjectConnectionsResponse(
	payload: unknown,
): HubProjectConnection[] {
	if (!Array.isArray(payload)) {
		throw new Error(
			'Hub API returned an invalid connections response (expected array)',
		);
	}

	const connections: HubProjectConnection[] = [];
	for (const item of payload) {
		if (!item || typeof item !== 'object') continue;
		const record = item as Record<string, unknown>;
		if (
			!isNonEmptyString(record.tenantId) ||
			!isNonEmptyString(record.plugin) ||
			!isHubConnectionStatus(record.status) ||
			!isConnectAuthKindValue(record.authKind)
		) {
			continue;
		}

		connections.push({
			tenantId: record.tenantId,
			plugin: record.plugin,
			status: record.status,
			authKind: record.authKind,
			connectedAt: isNonEmptyString(record.connectedAt)
				? record.connectedAt
				: null,
			expiresAt: isNonEmptyString(record.expiresAt) ? record.expiresAt : null,
		});
	}

	return connections;
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

// Validates the JSON body from hub POST /oauth/refresh before the SDK persists
// tokens locally. Hub error responses use { error, error_description } instead of
// token fields — we propagate that message rather than a generic missing-token error.
// Also coerces expires_in when the hub serializes it as a string.
export function parseOAuthRefreshResponse(
	payload: unknown,
): HubOAuthRefreshResponse {
	if (!payload || typeof payload !== 'object') {
		throw new Error('Hub token refresh returned an empty response');
	}

	const record = payload as Record<string, unknown>;
	if (isNonEmptyString(record.access_token)) {
		return {
			access_token: record.access_token,
			refresh_token: isNonEmptyString(record.refresh_token)
				? record.refresh_token
				: undefined,
			expires_in: (() => {
				if (typeof record.expires_in === 'number') {
					return record.expires_in;
				}
				if (
					typeof record.expires_in === 'string' &&
					record.expires_in.trim().length > 0
				) {
					const parsed = Number(record.expires_in);
					return Number.isFinite(parsed) ? parsed : undefined;
				}
				return undefined;
			})(),
			scope: isNonEmptyString(record.scope) ? record.scope : undefined,
		};
	}

	throw new Error(
		isNonEmptyString(record.error)
			? isNonEmptyString(record.error_description)
				? record.error_description
				: record.error
			: 'Hub token refresh returned no access_token',
	);
}

function parseStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}
	return value.filter((entry): entry is string => typeof entry === 'string');
}

function parseConnectAuthFieldStatuses(
	value: unknown,
): ConnectAuthFieldStatus[] {
	if (!Array.isArray(value)) {
		return [];
	}

	const fields: ConnectAuthFieldStatus[] = [];
	for (const item of value) {
		if (!item || typeof item !== 'object') continue;
		const fieldRecord = item as Record<string, unknown>;
		if (!isNonEmptyString(fieldRecord.name)) continue;

		fields.push({
			name: fieldRecord.name,
			level:
				fieldRecord.level === 'integration' || fieldRecord.level === 'account'
					? fieldRecord.level
					: 'account',
			required: fieldRecord.required === true,
			configured: fieldRecord.configured === true,
		});
	}

	return fields;
}

function parseConnectAuthStatusLevel(
	value: unknown,
	connected: boolean,
	fields: ConnectAuthFieldStatus[],
	missingRequiredFields: string[],
): ConnectAuthStatusLevel {
	if (
		value === 'ready' ||
		value === 'partial' ||
		value === 'not_started' ||
		value === 'missing_integration'
	) {
		return value;
	}

	if (connected) {
		return 'ready';
	}

	const missingIntegration = fields.some(
		(field) =>
			field.level === 'integration' && field.required && !field.configured,
	);
	if (missingIntegration) {
		return 'missing_integration';
	}

	if (
		fields.some(
			(field) =>
				field.level === 'account' && field.required && field.configured,
		)
	) {
		return 'partial';
	}

	if (missingRequiredFields.length > 0) {
		return 'not_started';
	}

	return 'not_started';
}

export function parseConnectStatusResponse(
	payload: unknown,
): ConnectStatusResponse {
	if (!payload || typeof payload !== 'object') {
		throw new Error('Connect status response was empty');
	}

	const record = payload as Record<string, unknown>;
	if (!isNonEmptyString(record.tenantId) || !Array.isArray(record.plugins)) {
		throw new Error(
			'Connect status response was incomplete (expected tenantId and plugins)',
		);
	}

	const plugins: ConnectStatusPluginEntry[] = [];
	for (const item of record.plugins) {
		if (!item || typeof item !== 'object') continue;
		const pluginRecord = item as Record<string, unknown>;
		if (
			!isNonEmptyString(pluginRecord.plugin) ||
			typeof pluginRecord.connected !== 'boolean'
		) {
			continue;
		}

		const authKind =
			pluginRecord.authKind === 'oauth' ||
			pluginRecord.authKind === 'api_key' ||
			pluginRecord.authKind === 'bot_token'
				? pluginRecord.authKind
				: 'api_key';

		const fields = parseConnectAuthFieldStatuses(pluginRecord.fields);
		const missingRequiredFields = parseStringArray(
			pluginRecord.missingRequiredFields,
		);
		const status = parseConnectAuthStatusLevel(
			pluginRecord.status,
			pluginRecord.connected,
			fields,
			missingRequiredFields,
		);

		plugins.push({
			plugin: pluginRecord.plugin,
			providerName: isNonEmptyString(pluginRecord.providerName)
				? pluginRecord.providerName
				: pluginRecord.plugin,
			authKind,
			status,
			connected: pluginRecord.connected,
			fields,
			missingRequiredFields,
		});
	}

	return {
		tenantId: record.tenantId,
		plugins,
	};
}

export function parseHubApiErrorBody(payload: unknown): string | null {
	if (!payload || typeof payload !== 'object') {
		return null;
	}

	const body = payload as HubApiErrorBody;
	return body.error ?? body.message ?? null;
}
