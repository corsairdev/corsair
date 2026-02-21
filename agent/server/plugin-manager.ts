import { corsair } from './corsair';
import { corsairAccounts, corsairIntegrations, db } from './db';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type AuthType = 'api_key' | 'bot_token' | 'oauth_2' | 'unknown';

export interface PluginField {
	field: string;
	label: string;
	description: string;
	/** Where this value is stored: account-level or integration-level (shared across all accounts) */
	level: 'account' | 'integration';
	required: boolean;
}

export interface PluginFieldStatus extends PluginField {
	isSet: boolean;
}

export interface PluginStatus {
	name: string;
	authType: AuthType;
	fields: PluginFieldStatus[];
	/** true when all required fields are set */
	isReady: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fast DB-based plugin discovery (used for pre-run context injection)
// ─────────────────────────────────────────────────────────────────────────────

export interface PluginDbInfo {
	/** Plugin name as stored in corsair_integrations.name (e.g. "slack") */
	name: string;
	/**
	 * Whether at least one account row exists for this integration.
	 * An account row means the user has at least started setting up credentials.
	 */
	hasAccount: boolean;
}

/**
 * Fast DB query — no decryption, no API calls.
 * Returns all plugins registered with Corsair and whether each has an account.
 */
export async function getConfiguredPluginsFromDb() {
	const [integrations, accounts] = await Promise.all([
		db
			.select({ id: corsairIntegrations.id, name: corsairIntegrations.name })
			.from(corsairIntegrations),
		db
			.select({ integrationId: corsairAccounts.integrationId })
			.from(corsairAccounts),
	]);

	const accountIntegrationIds = new Set(accounts.map((a) => a.integrationId));

	return integrations.map((i) => ({
		name: i.name,
		hasAccount: accountIntegrationIds.has(i.id),
	}));
}

// ─────────────────────────────────────────────────────────────────────────────
// Field definitions per auth type
// ─────────────────────────────────────────────────────────────────────────────

const FIELDS_BY_AUTH_TYPE = {
	api_key: [
		{
			field: 'api_key',
			label: 'API Key',
			description: 'The API key used to authenticate requests to this service.',
			level: 'account',
			required: true,
		},
		{
			field: 'webhook_signature',
			label: 'Webhook Signing Secret',
			description:
				'Used to verify the authenticity of incoming webhook payloads. Required if you want to use webhooks.',
			level: 'account',
			required: false,
		},
	],
	bot_token: [
		{
			field: 'bot_token',
			label: 'Bot Token',
			description: 'The bot token used to authenticate as a bot user.',
			level: 'account',
			required: true,
		},
		{
			field: 'webhook_signature',
			label: 'Webhook Signing Secret',
			description:
				'Used to verify the authenticity of incoming webhook payloads. Required if you want to use webhooks.',
			level: 'account',
			required: false,
		},
	],
	oauth_2: [
		{
			field: 'client_id',
			label: 'OAuth2 Client ID',
			description:
				'The client ID from your OAuth2 application. Shared across all accounts.',
			level: 'integration',
			required: true,
		},
		{
			field: 'client_secret',
			label: 'OAuth2 Client Secret',
			description:
				'The client secret from your OAuth2 application. Shared across all accounts.',
			level: 'integration',
			required: true,
		},
		{
			field: 'access_token',
			label: 'Access Token',
			description: 'The OAuth2 access token for the user account.',
			level: 'account',
			required: true,
		},
		{
			field: 'refresh_token',
			label: 'Refresh Token',
			description:
				'The OAuth2 refresh token used to obtain new access tokens automatically.',
			level: 'account',
			required: false,
		},
		{
			field: 'webhook_signature',
			label: 'Webhook Signing Secret',
			description:
				'Used to verify the authenticity of incoming webhook payloads. Required if you want to use webhooks.',
			level: 'account',
			required: false,
		},
	],
	unknown: [],
} satisfies Record<AuthType, PluginField[]>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth type detection (by inspecting available key-manager methods)
// ─────────────────────────────────────────────────────────────────────────────

function detectAuthType(pluginKeys: Record<string, unknown>) {
	if (typeof pluginKeys.get_api_key === 'function') return 'api_key';
	if (typeof pluginKeys.get_bot_token === 'function') return 'bot_token';
	if (typeof pluginKeys.get_access_token === 'function') return 'oauth_2';
	return 'unknown';
}

// ─────────────────────────────────────────────────────────────────────────────
// In-process plugin name list (from the live corsair object)
// ─────────────────────────────────────────────────────────────────────────────

export function getConfiguredPluginNames() {
	return Object.keys(corsair).filter((k) => k !== 'keys');
}

// ─────────────────────────────────────────────────────────────────────────────
// Field-level credential status
// Called by check_environment when the agent needs to debug a failure.
// Reads encrypted field values via the key-manager — no live API calls.
// ─────────────────────────────────────────────────────────────────────────────

async function readFieldValue(
	pluginName: string,
	fieldDef: PluginField,
	pluginKeys: Record<string, unknown>,
) {
	try {
		if (fieldDef.level === 'integration') {
			const integrationKeys = (
				corsair.keys as Record<string, Record<string, unknown>>
			)[pluginName];
			if (!integrationKeys) return false;
			const getter = integrationKeys[`get_${fieldDef.field}`];
			if (typeof getter !== 'function') return false;
			const val = await (getter as () => Promise<string | null>)();
			return val !== null && val !== undefined && val !== '';
		} else {
			const getter = pluginKeys[`get_${fieldDef.field}`];
			if (typeof getter !== 'function') return false;
			const val = await (getter as () => Promise<string | null>)();
			return val !== null && val !== undefined && val !== '';
		}
	} catch {
		return false;
	}
}

export async function getPluginStatus(pluginName: string) {
	const configuredNames = getConfiguredPluginNames();
	if (!configuredNames.includes(pluginName)) return null;

	const corsairAny = corsair as unknown as Record<
		string,
		{ keys: Record<string, unknown> }
	>;
	const plugin = corsairAny[pluginName];
	if (!plugin?.keys) return null;

	const authType = detectAuthType(plugin.keys);
	const fieldDefs = FIELDS_BY_AUTH_TYPE[authType];

	const fields: PluginFieldStatus[] = await Promise.all(
		fieldDefs.map(async (fieldDef) => {
			const isSet = await readFieldValue(pluginName, fieldDef, plugin.keys);
			return { ...fieldDef, isSet };
		}),
	);

	const isReady = fields.filter((f) => f.required).every((f) => f.isSet);

	return { name: pluginName, authType, fields, isReady };
}

export async function getAllPluginsStatus() {
	const names = getConfiguredPluginNames();
	const statuses = await Promise.all(names.map((n) => getPluginStatus(n)));
	return statuses.filter((s): s is PluginStatus => s !== null);
}

// ─────────────────────────────────────────────────────────────────────────────
// Setting fields (called by the setup page API route)
// ─────────────────────────────────────────────────────────────────────────────

export async function setPluginField(
	pluginName: string,
	field: string,
	value: string,
	level: 'account' | 'integration',
): Promise<{ success: boolean; error?: string }> {
	try {
		const corsairAny = corsair as unknown as Record<
			string,
			{ keys: Record<string, unknown> }
		>;
		const plugin = corsairAny[pluginName];
		if (!plugin?.keys) {
			return { success: false, error: `Plugin "${pluginName}" not found` };
		}

		if (level === 'integration') {
			const integrationKeys = (
				corsair.keys as Record<string, Record<string, unknown>>
			)[pluginName];
			if (!integrationKeys) {
				return {
					success: false,
					error: `No integration keys found for "${pluginName}"`,
				};
			}
			const setter = integrationKeys[`set_${field}`];
			if (typeof setter !== 'function') {
				return {
					success: false,
					error: `Cannot set integration field "${field}" on plugin "${pluginName}"`,
				};
			}
			await (setter as (v: string) => Promise<void>)(value);
		} else {
			const setter = plugin.keys[`set_${field}`];
			if (typeof setter !== 'function') {
				return {
					success: false,
					error: `Cannot set field "${field}" on plugin "${pluginName}"`,
				};
			}
			await (setter as (v: string) => Promise<void>)(value);
		}

		return { success: true };
	} catch (e) {
		return {
			success: false,
			error: e instanceof Error ? e.message : String(e),
		};
	}
}
