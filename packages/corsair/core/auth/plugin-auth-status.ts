import type { CorsairInternalConfig } from '..';
import type { AuthTypes } from '../constants';
import type { CorsairPlugin } from '../plugins';
import { getCallableProperty } from '../utils/callable';
import { getPluginAuthType } from '../utils/plugin-auth';
import {
	createAccountKeyManager,
	createIntegrationKeyManager,
} from './key-manager';
import type { BaseKeyManager, PluginAuthConfig } from './types';
import { BASE_AUTH_FIELDS } from './types';

export type AuthFieldLevel = 'integration' | 'account';

export type AuthFieldStatus = {
	name: string;
	level: AuthFieldLevel;
	required: boolean;
	configured: boolean;
};

export type PluginAuthStatusLevel =
	| 'ready'
	| 'partial'
	| 'not_started'
	| 'missing_integration';

export type PluginAuthStatus = {
	plugin: string;
	authType: AuthTypes;
	status: PluginAuthStatusLevel;
	connected: boolean;
	fields: AuthFieldStatus[];
	missingRequiredFields: string[];
};

const OPTIONAL_AUTH_FIELDS = new Set([
	'webhook_signature',
	'expires_at',
	'scope',
	'redirect_url',
]);

export function isOptionalAuthField(field: string): boolean {
	return OPTIONAL_AUTH_FIELDS.has(field);
}

function isRequiredIntegrationField(
	authType: AuthTypes,
	field: string,
): boolean {
	if (isOptionalAuthField(field)) {
		return false;
	}
	if (authType === 'oauth_2') {
		return field === 'client_id' || field === 'client_secret';
	}
	return true;
}

function isRequiredAccountField(field: string): boolean {
	return !isOptionalAuthField(field);
}

// Core account fields that mean "connected" for connection-status APIs.
// Plugin-specific extras (team_id, installation_id, …) can still be missing.
function getConnectionCredentialFields(
	authType: AuthTypes,
): readonly string[] {
	switch (authType) {
		case 'oauth_2':
		case 'managed':
			return ['access_token', 'refresh_token'];
		case 'api_key':
			return ['api_key'];
		case 'bot_token':
			return ['bot_token'];
	}
}

function isAuthTypeConnected(
	authType: AuthTypes,
	fields: AuthFieldStatus[],
): boolean {
	const connectionFields = getConnectionCredentialFields(authType);
	return connectionFields.every((fieldName) => {
		const field = fields.find(
			(entry) => entry.level === 'account' && entry.name === fieldName,
		);
		return field?.configured ?? false;
	});
}

async function readFieldConfigured(
	keyManager: BaseKeyManager | undefined,
	field: string,
): Promise<boolean> {
	if (!keyManager) {
		return false;
	}

	const getter = getCallableProperty(keyManager, `get_${field}`);
	if (!getter) {
		return false;
	}

	try {
		const result = await getter();
		return typeof result === 'string' && result.length > 0;
	} catch {
		return false;
	}
}

function getIntegrationFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): readonly string[] {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	const extraFields = authConfig?.[authType]?.integration ?? [];
	return [...BASE_AUTH_FIELDS[authType].integration, ...extraFields];
}

function getAccountFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): readonly string[] {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	const extraFields = authConfig?.[authType]?.account ?? [];
	return [...BASE_AUTH_FIELDS[authType].account, ...extraFields];
}

function derivePluginAuthStatus(
	pluginId: string,
	authType: AuthTypes,
	fields: AuthFieldStatus[],
): PluginAuthStatus {
	const missingRequiredFields = fields
		.filter((field) => field.required && !field.configured)
		.map((field) => field.name);
	const missingIntegrationFields = fields
		.filter(
			(field) =>
				field.level === 'integration' && field.required && !field.configured,
		)
		.map((field) => field.name);
	const configuredAccountRequired = fields.filter(
		(field) => field.level === 'account' && field.required && field.configured,
	);

	let status: PluginAuthStatusLevel;
	if (missingIntegrationFields.length > 0) {
		status = 'missing_integration';
	} else if (missingRequiredFields.length === 0) {
		status = 'ready';
	} else if (configuredAccountRequired.length > 0) {
		status = 'partial';
	} else {
		status = 'not_started';
	}

	return {
		plugin: pluginId,
		authType,
		status,
		connected: isAuthTypeConnected(authType, fields),
		fields,
		missingRequiredFields,
	};
}

export async function getPluginAuthStatus(
	internal: CorsairInternalConfig,
	plugin: CorsairPlugin,
	tenantId: string,
): Promise<PluginAuthStatus | null> {
	const authType = getPluginAuthType(plugin);
	if (!authType || !internal.database || !internal.kek) {
		return null;
	}

	const effectiveTenantId = tenantId.trim() || 'default';
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	const extraIntegrationFields = authConfig?.[authType]?.integration ?? [];
	const extraAccountFields = authConfig?.[authType]?.account ?? [];

	const integrationKeyManager = createIntegrationKeyManager({
		authType,
		integrationName: plugin.id,
		kek: internal.kek,
		database: internal.database,
		extraIntegrationFields,
	});

	const accountKeyManager = createAccountKeyManager({
		authType,
		integrationName: plugin.id,
		tenantId: effectiveTenantId,
		kek: internal.kek,
		database: internal.database,
		extraAccountFields,
	});

	const integrationFields = getIntegrationFields(plugin, authType);
	const accountFields = getAccountFields(plugin, authType);
	const fields: AuthFieldStatus[] = [];

	for (const field of integrationFields) {
		fields.push({
			name: field,
			level: 'integration',
			required: isRequiredIntegrationField(authType, field),
			configured: await readFieldConfigured(integrationKeyManager, field),
		});
	}

	for (const field of accountFields) {
		fields.push({
			name: field,
			level: 'account',
			required: isRequiredAccountField(field),
			configured: await readFieldConfigured(accountKeyManager, field),
		});
	}

	return derivePluginAuthStatus(plugin.id, authType, fields);
}

export async function getPluginAuthStatusForTenant(
	internal: CorsairInternalConfig,
	tenantId: string,
	options: { pluginIds?: string[] } = {},
): Promise<PluginAuthStatus[]> {
	const effectiveTenantId = tenantId.trim() || 'default';
	const pluginIdFilter = options.pluginIds?.length
		? new Set(options.pluginIds)
		: null;
	const results: PluginAuthStatus[] = [];

	for (const plugin of internal.plugins) {
		if (pluginIdFilter && !pluginIdFilter.has(plugin.id)) {
			continue;
		}
		const status = await getPluginAuthStatus(
			internal,
			plugin,
			effectiveTenantId,
		);
		if (status) {
			results.push(status);
		}
	}

	return results;
}

export function mapPluginAuthStatusToConnectionState(
	status: PluginAuthStatus,
): 'connected' | 'missing_credentials' | 'not_connected' {
	if (status.connected) {
		return 'connected';
	}
	if (status.status === 'missing_integration') {
		return 'missing_credentials';
	}
	return 'not_connected';
}
