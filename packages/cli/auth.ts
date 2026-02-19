import * as p from '@clack/prompts';
import type {
	AuthTypes,
	CorsairInternalConfig,
	CorsairPlugin,
	PluginAuthConfig,
} from 'corsair/core';
import {
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createIntegrationKeyManager,
	encryptDEK,
	generateDEK,
} from 'corsair/core';
import type { CorsairDatabase } from 'corsair/db';
import { createCorsairOrm } from 'corsair/orm';
import { getCorsairInstance } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Action Definitions
// ─────────────────────────────────────────────────────────────────────────────

type ActionDef = {
	value: string;
	label: string;
	hint?: string;
	description?: string;
	level: 'account' | 'integration' | 'none';
	type: 'set' | 'confirm' | 'display';
	inputType?: 'password' | 'text';
	method?: string;
};

const API_KEY_ACTIONS: ActionDef[] = [
	{
		value: 'set-api-key',
		label: 'Set API Key',
		hint: 'keys.set_api_key()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'set_api_key',
	},
	{
		value: 'set-webhook-sig',
		label: 'Set Webhook Signature',
		hint: 'keys.set_webhook_signature()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'set_webhook_signature',
	},
	{
		value: 'get-credentials',
		label: 'Get Credentials',
		hint: 'Display current credentials',
		level: 'account',
		type: 'display',
	},
	{
		value: 'issue-dek-account',
		label: 'Issue New DEK (account level)',
		hint: "For this tenant's integration",
		description:
			"Issues a new Data Encryption Key (DEK) for this specific tenant's integration with the plugin.\n\n" +
			'Example: Issues a new DEK for the "default" tenant\'s integration with Slack.\n\n' +
			'This will re-encrypt all account-level credentials (API keys, tokens, etc.) for this tenant only.',
		level: 'account',
		type: 'confirm',
		method: 'issue_new_dek',
	},
	{
		value: 'issue-dek-integration',
		label: 'Issue New DEK (integration level)',
		hint: 'For the entire integration',
		description:
			'Issues a new Data Encryption Key (DEK) at the integration level (affects all tenants).\n\n' +
			'This is typically only needed for OAuth integrations where you have integration-level\n' +
			'credentials like Client ID and Client Secret that are shared across all tenants.\n\n' +
			'This will re-encrypt all integration-level credentials for this plugin.',
		level: 'integration',
		type: 'confirm',
		method: 'issue_new_dek',
	},
	{
		value: 'view-status',
		label: 'View Status',
		hint: 'Show DB row status',
		level: 'none',
		type: 'display',
	},
];

const BOT_TOKEN_ACTIONS: ActionDef[] = [
	{
		value: 'set-bot-token',
		label: 'Set Bot Token',
		hint: 'keys.set_bot_token()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'set_bot_token',
	},
	{
		value: 'set-webhook-sig',
		label: 'Set Webhook Signature',
		hint: 'keys.set_webhook_signature()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'set_webhook_signature',
	},
	{
		value: 'get-credentials',
		label: 'Get Credentials',
		hint: 'Display current credentials',
		level: 'account',
		type: 'display',
	},
	{
		value: 'issue-dek-account',
		label: 'Issue New DEK (account level)',
		hint: "For this tenant's integration",
		description:
			"Issues a new Data Encryption Key (DEK) for this specific tenant's integration with the plugin.\n\n" +
			'Example: Issues a new DEK for the "default" tenant\'s integration with Slack.\n\n' +
			'This will re-encrypt all account-level credentials (API keys, tokens, etc.) for this tenant only.',
		level: 'account',
		type: 'confirm',
		method: 'issue_new_dek',
	},
	{
		value: 'issue-dek-integration',
		label: 'Issue New DEK (integration level)',
		hint: 'For the entire integration',
		description:
			'Issues a new Data Encryption Key (DEK) at the integration level (affects all tenants).\n\n' +
			'This is typically only needed for OAuth integrations where you have integration-level\n' +
			'credentials like Client ID and Client Secret that are shared across all tenants.\n\n' +
			'This will re-encrypt all integration-level credentials for this plugin.',
		level: 'integration',
		type: 'confirm',
		method: 'issue_new_dek',
	},
	{
		value: 'view-status',
		label: 'View Status',
		hint: 'Show DB row status',
		level: 'none',
		type: 'display',
	},
];

const OAUTH2_ACTIONS: ActionDef[] = [
	{
		value: 'set-client-id',
		label: 'Set Client ID',
		hint: 'keys.set_client_id()',
		level: 'integration',
		type: 'set',
		inputType: 'password',
		method: 'set_client_id',
	},
	{
		value: 'set-client-secret',
		label: 'Set Client Secret',
		hint: 'keys.set_client_secret()',
		level: 'integration',
		type: 'set',
		inputType: 'password',
		method: 'set_client_secret',
	},
	{
		value: 'set-redirect-url',
		label: 'Set Redirect URL',
		hint: 'keys.set_redirect_url()',
		level: 'integration',
		type: 'set',
		inputType: 'text',
		method: 'set_redirect_url',
	},
	{
		value: 'set-access-token',
		label: 'Set Access Token',
		hint: 'keys.set_access_token()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'set_access_token',
	},
	{
		value: 'set-refresh-token',
		label: 'Set Refresh Token',
		hint: 'keys.set_refresh_token()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'set_refresh_token',
	},
	{
		value: 'set-webhook-sig',
		label: 'Set Webhook Signature',
		hint: 'keys.set_webhook_signature()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'set_webhook_signature',
	},
	{
		value: 'get-credentials',
		label: 'Get Credentials',
		hint: 'Display current credentials',
		level: 'account',
		type: 'display',
	},
	{
		value: 'issue-dek-account',
		label: 'Issue New DEK (account level)',
		hint: "For this tenant's integration",
		description:
			"Issues a new Data Encryption Key (DEK) for this specific tenant's integration with the plugin.\n\n" +
			'Example: Issues a new DEK for the "default" tenant\'s integration with Slack.\n\n' +
			'This will re-encrypt all account-level credentials (API keys, tokens, etc.) for this tenant only.',
		level: 'account',
		type: 'confirm',
		method: 'issue_new_dek',
	},
	{
		value: 'issue-dek-integration',
		label: 'Issue New DEK (integration level)',
		hint: 'For the entire integration',
		description:
			'Issues a new Data Encryption Key (DEK) at the integration level (affects all tenants).\n\n' +
			'This is typically only needed for OAuth integrations where you have integration-level\n' +
			'credentials like Client ID and Client Secret that are shared across all tenants.\n\n' +
			'This will re-encrypt all integration-level credentials for this plugin.',
		level: 'integration',
		type: 'confirm',
		method: 'issue_new_dek',
	},
	{
		value: 'view-status',
		label: 'View Status',
		hint: 'Show DB row status',
		level: 'none',
		type: 'display',
	},
];

const NO_AUTH_ACTIONS: ActionDef[] = [
	{
		value: 'view-status',
		label: 'View Status',
		hint: 'Show DB row status',
		level: 'none',
		type: 'display',
	},
];

function getActionsForAuthType(
	authType: AuthTypes | undefined,
	plugin?: CorsairPlugin,
): ActionDef[] {
	let baseActions: ActionDef[];
	switch (authType) {
		case 'api_key':
			baseActions = API_KEY_ACTIONS;
			break;
		case 'bot_token':
			baseActions = BOT_TOKEN_ACTIONS;
			break;
		case 'oauth_2':
			baseActions = OAUTH2_ACTIONS;
			break;
		default:
			return NO_AUTH_ACTIONS;
	}

	// If plugin is provided, add custom field actions
	if (plugin && authType) {
		const customIntegrationFields = getCustomIntegrationFields(
			plugin,
			authType,
		);
		const customAccountFields = getCustomAccountFields(plugin, authType);

		const customActions: ActionDef[] = [];

		// Add custom integration-level field actions
		if (customIntegrationFields.length > 0) {
			customActions.push(
				...generateCustomFieldActions(customIntegrationFields, 'integration'),
			);
		}

		// Add custom account-level field actions
		if (customAccountFields.length > 0) {
			customActions.push(
				...generateCustomFieldActions(customAccountFields, 'account'),
			);
		}

		// Insert custom actions before the "view-status" action
		const viewStatusIndex = baseActions.findIndex(
			(a) => a.value === 'view-status',
		);
		if (viewStatusIndex >= 0) {
			baseActions.splice(viewStatusIndex, 0, ...customActions);
		} else {
			baseActions.push(...customActions);
		}
	}

	return baseActions;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function maskValue(value: string, mask = false): string {
	if (!mask) {
		return value;
	}
	if (value.length <= 9) return '***';
	return `${value.slice(0, 6)}...${value.slice(-3)}`;
}

function getAuthTypeLabel(authType: AuthTypes | undefined): string {
	switch (authType) {
		case 'api_key':
			return 'api_key';
		case 'bot_token':
			return 'bot_token';
		case 'oauth_2':
			return 'oauth_2';
		default:
			return 'no auth';
	}
}

function getAuthType(plugin: CorsairPlugin): AuthTypes | undefined {
	return (plugin.options as Record<string, unknown> | undefined)?.authType as
		| AuthTypes
		| undefined;
}

/**
 * Extracts custom integration-level fields from plugin authConfig for a given auth type.
 */
function getCustomIntegrationFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): readonly string[] {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	if (!authConfig || !authType) return [];
	const configForAuthType = authConfig[authType];
	if (!configForAuthType) return [];
	return configForAuthType.integration ?? [];
}

/**
 * Extracts custom account-level fields from plugin authConfig for a given auth type.
 */
function getCustomAccountFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): readonly string[] {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	if (!authConfig || !authType) return [];
	const configForAuthType = authConfig[authType];
	if (!configForAuthType) return [];
	return configForAuthType.account ?? [];
}

/**
 * Converts a field name to a method name (e.g., "topic_id" -> "set_topic_id" or "get_topic_id").
 */
function fieldToMethodName(field: string, prefix: 'get' | 'set'): string {
	// Convert snake_case to method name
	return `${prefix}_${field}`;
}

/**
 * Converts a field name to a human-readable label (e.g., "topic_id" -> "Topic ID").
 */
function fieldToLabel(field: string): string {
	// Convert snake_case to Title Case
	return field
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Generates actions for custom fields at a given level.
 */
function generateCustomFieldActions(
	fields: readonly string[],
	level: 'account' | 'integration',
): ActionDef[] {
	const actions: ActionDef[] = [];
	for (const field of fields) {
		// Add set action
		actions.push({
			value: `set-${field}`,
			label: `Set ${fieldToLabel(field)}`,
			hint: `keys.${fieldToMethodName(field, 'set')}()`,
			level,
			type: 'set',
			inputType: 'text',
			method: fieldToMethodName(field, 'set'),
		});
		// Add get action
		actions.push({
			value: `get-${field}`,
			label: `Get ${fieldToLabel(field)}`,
			hint: `keys.${fieldToMethodName(field, 'get')}()`,
			level,
			type: 'display',
			method: fieldToMethodName(field, 'get'),
		});
	}
	return actions;
}

function handleCancel(): never {
	p.cancel('Operation cancelled.');
	process.exit(0);
}

/**
 * Calls a method by name on a key manager, throwing if the method doesn't exist.
 *
 * Key managers are plain objects with dynamically-generated methods (via `createFieldAccessors`),
 * so this helper provides a safe wrapper around runtime dynamic dispatch, keeping the
 * type-assertion in a single place.
 */
async function callKeyManagerMethod(
	km: object,
	method: string,
	...args: unknown[]
): Promise<unknown> {
	const fn = (km as Record<string, unknown>)[method];
	if (typeof fn !== 'function') {
		throw new Error(`Method "${method}" not found on key manager`);
	}
	return (fn as (...a: unknown[]) => Promise<unknown>)(...args);
}

/**
 * Calls a method by name on a key manager if it exists, returning `null` otherwise.
 * Useful for optional/custom field lookups where the method may not be present.
 */
async function tryCallKeyManagerMethod(
	km: object,
	method: string,
	...args: unknown[]
): Promise<unknown> {
	const fn = (km as Record<string, unknown>)[method];
	if (typeof fn !== 'function') return null;
	return (fn as (...a: unknown[]) => Promise<unknown>)(...args);
}

// ─────────────────────────────────────────────────────────────────────────────
// Core Flow Functions
// ─────────────────────────────────────────────────────────────────────────────

async function extractInternalConfig(
	cwd: string,
): Promise<CorsairInternalConfig> {
	const instance = await getCorsairInstance({ cwd, shouldThrowOnError: true });

	const internal = (instance as Record<string | symbol, unknown>)[
		CORSAIR_INTERNAL
	] as CorsairInternalConfig | undefined;

	if (!internal) {
		throw new Error(
			'Could not read internal config from Corsair instance. Make sure you are using the latest version of corsair.',
		);
	}

	return internal;
}

async function selectPlugin(
	plugins: readonly CorsairPlugin[],
): Promise<CorsairPlugin> {
	const result = await p.select({
		message: 'Select a plugin:',
		options: plugins.map((plugin) => ({
			value: plugin.id,
			label: plugin.id,
			hint: `auth: ${getAuthTypeLabel(getAuthType(plugin))}`,
		})),
	});

	if (p.isCancel(result)) handleCancel();

	return plugins.find((pl) => pl.id === result)!;
}

async function ensureIntegrationInitialized(
	database: CorsairDatabase,
	pluginId: string,
	kek: string,
): Promise<{ id: string; dek: string | null; config: unknown }> {
	const orm = createCorsairOrm(database);
	const existing = await orm.integrations.findByName(pluginId);
	if (existing) {
		return {
			id: existing.id,
			dek: existing.dek ?? null,
			config: existing.config,
		};
	}

	// Plugin not initialized — ask to create
	const shouldInit = await p.confirm({
		message: `Plugin '${pluginId}' is not initialized. Initialize now?`,
	});

	if (p.isCancel(shouldInit) || !shouldInit) handleCancel();

	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, kek);

	const row = await orm.integrations.create({
		name: pluginId,
		config: {},
		dek: encryptedDek,
	});

	p.log.success(`Initialized plugin '${pluginId}' with a new DEK.`);

	return { id: row.id, dek: encryptedDek, config: {} };
}

async function selectTenant(
	database: CorsairDatabase,
	integrationId: string,
	multiTenancy: boolean,
): Promise<string> {
	// Find existing accounts for this integration
	const orm = createCorsairOrm(database);
	const accounts = await orm.accounts.findMany({
		where: { integration_id: integrationId },
	});

	if (!multiTenancy && accounts.length === 0) {
		// Auto-create 'default' tenant for single-tenant setups
		const shouldCreate = await p.confirm({
			message: "No accounts found. Create a 'default' account for this plugin?",
		});

		if (p.isCancel(shouldCreate) || !shouldCreate) handleCancel();

		return 'default';
	}

	// Build options from existing accounts
	const options: { value: string; label: string; hint?: string }[] =
		accounts.map((account) => {
			const config = (account.config ?? {}) as Record<string, unknown>;
			const configKeys = Object.keys(config);
			const hint =
				configKeys.length > 0
					? `configured: ${configKeys.join(', ')}`
					: 'no credentials set';
			return {
				value: account.tenant_id,
				label: account.tenant_id,
				hint,
			};
		});

	// Add "create new tenant" option
	options.push({
		value: '__new_tenant__',
		label: '+ Create new tenant',
		hint: 'Add a new tenant account',
	});

	const result = await p.select({
		message: 'Select a tenant:',
		options,
	});

	if (p.isCancel(result)) handleCancel();

	if (result === '__new_tenant__') {
		const tenantId = await p.text({
			message: 'Enter tenant ID:',
			placeholder: 'tenant_abc',
			validate: (value) => {
				if (!value || value.trim().length === 0) return 'Tenant ID is required';
			},
		});

		if (p.isCancel(tenantId)) handleCancel();

		return tenantId as string;
	}

	return result as string;
}

async function ensureAccountExists(
	database: CorsairDatabase,
	integrationId: string,
	tenantId: string,
	kek: string,
): Promise<void> {
	const orm = createCorsairOrm(database);
	const existing = await orm.accounts.findOne({
		tenant_id: tenantId,
		integration_id: integrationId,
	});

	if (existing) return;

	// Create the account with a new DEK
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, kek);

	await orm.accounts.create({
		tenant_id: tenantId,
		integration_id: integrationId,
		config: {},
		dek: encryptedDek,
	});

	p.log.success(`Created account for tenant '${tenantId}' with a new DEK.`);
}

async function selectAction(
	authType: AuthTypes | undefined,
	plugin?: CorsairPlugin,
): Promise<ActionDef> {
	const actions = getActionsForAuthType(authType, plugin);

	const result = await p.select({
		message: 'What would you like to do?',
		options: actions.map((action) => ({
			value: action.value,
			label: action.label,
			hint: action.hint,
		})),
	});

	if (p.isCancel(result)) handleCancel();

	return actions.find((a) => a.value === result)!;
}

// ─────────────────────────────────────────────────────────────────────────────
// Action Execution
// ─────────────────────────────────────────────────────────────────────────────

async function executeSetAction(
	action: ActionDef,
	database: CorsairDatabase,
	pluginId: string,
	kek: string,
	authType: AuthTypes,
	tenantId: string,
	plugin?: CorsairPlugin,
): Promise<void> {
	let value: string | symbol;

	if (action.inputType === 'password') {
		value = await p.password({
			message: `Enter ${action.label.replace('Set ', '')}:`,
			mask: '*',
		});
	} else {
		value = await p.text({
			message: `Enter ${action.label.replace('Set ', '')}:`,
		});
	}

	if (p.isCancel(value)) handleCancel();

	const spin = p.spinner();
	spin.start('Saving...');

	try {
		if (action.level === 'account') {
			const extraAccountFields = plugin
				? getCustomAccountFields(plugin, authType)
				: [];
			const km = createAccountKeyManager({
				authType,
				integrationName: pluginId,
				tenantId,
				kek,
				database,
				extraAccountFields,
			});
			await callKeyManagerMethod(km, action.method!, value);
		} else if (action.level === 'integration') {
			const extraIntegrationFields = plugin
				? getCustomIntegrationFields(plugin, authType)
				: [];
			const km = createIntegrationKeyManager({
				authType,
				integrationName: pluginId,
				kek,
				database,
				extraIntegrationFields,
			});
			await callKeyManagerMethod(km, action.method!, value);
		}

		spin.stop('Saved.');

		const scope =
			action.level === 'account'
				? `corsair.withTenant('${tenantId}').${pluginId}.keys.${action.method}('...')`
				: `corsair.keys.${pluginId}.${action.method}('...')`;

		p.note(`Equivalent to:\n  ${scope}`, 'Done');
	} catch (error) {
		spin.stop('Failed.');
		p.log.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

async function executeConfirmAction(
	action: ActionDef,
	database: CorsairDatabase,
	pluginId: string,
	kek: string,
	authType: AuthTypes,
	tenantId: string,
	plugin?: CorsairPlugin,
): Promise<void> {
	// Show detailed description for DEK actions
	if (
		action.description &&
		(action.value === 'issue-dek-account' ||
			action.value === 'issue-dek-integration')
	) {
		p.note(action.description, 'What this does');
	}

	const shouldProceed = await p.confirm({
		message: `Are you sure you want to ${action.label.toLowerCase()}? This will re-encrypt all associated secrets.`,
	});

	if (p.isCancel(shouldProceed) || !shouldProceed) {
		p.log.info('Cancelled.');
		return;
	}

	const spin = p.spinner();
	spin.start('Processing...');

	try {
		if (action.level === 'account') {
			const extraAccountFields = plugin
				? getCustomAccountFields(plugin, authType)
				: [];
			const km = createAccountKeyManager({
				authType,
				integrationName: pluginId,
				tenantId,
				kek,
				database,
				extraAccountFields,
			});
			await callKeyManagerMethod(km, action.method!);
		} else if (action.level === 'integration') {
			const extraIntegrationFields = plugin
				? getCustomIntegrationFields(plugin, authType)
				: [];
			const km = createIntegrationKeyManager({
				authType,
				integrationName: pluginId,
				kek,
				database,
				extraIntegrationFields,
			});
			await callKeyManagerMethod(km, action.method!);
		}

		spin.stop('Done.');

		const scope =
			action.level === 'account'
				? `corsair.withTenant('${tenantId}').${pluginId}.keys.${action.method}()`
				: `corsair.keys.${pluginId}.${action.method}()`;

		p.note(`Equivalent to:\n  ${scope}`, 'Done');
	} catch (error) {
		spin.stop('Failed.');
		p.log.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

async function executeGetCredentials(
	database: CorsairDatabase,
	pluginId: string,
	kek: string,
	authType: AuthTypes,
	tenantId: string,
	plugin?: CorsairPlugin,
): Promise<void> {
	const spin = p.spinner();
	spin.start('Fetching credentials...');

	try {
		const lines: string[] = [];

		if (authType === 'oauth_2') {
			// Integration-level credentials
			const extraIntegrationFields = plugin
				? getCustomIntegrationFields(plugin, authType)
				: [];
			const integrationKm = createIntegrationKeyManager({
				authType: 'oauth_2',
				integrationName: pluginId,
				kek,
				database,
				extraIntegrationFields,
			});

			const clientId = await integrationKm.get_client_id();
			const clientSecret = await integrationKm.get_client_secret();
			const redirectUrl = await integrationKm.get_redirect_url();

			lines.push('[Integration]');
			lines.push(
				`  Client ID: ${clientId ? maskValue(clientId) : '(not set)'}`,
			);
			lines.push(
				`  Client Secret: ${clientSecret ? maskValue(clientSecret) : '(not set)'}`,
			);
			lines.push(
				`  Redirect URL: ${redirectUrl ? maskValue(redirectUrl) : '(not set)'}`,
			);

			// Display custom integration fields
			for (const field of extraIntegrationFields) {
				const getMethod = fieldToMethodName(field, 'get');
				const value = (await tryCallKeyManagerMethod(
					integrationKm,
					getMethod,
				)) as string | null;
				lines.push(
					`  ${fieldToLabel(field)}: ${value ? maskValue(value) : '(not set)'}`,
				);
			}

			// Account-level credentials
			const extraAccountFields = plugin
				? getCustomAccountFields(plugin, authType)
				: [];
			const accountKm = createAccountKeyManager({
				authType: 'oauth_2',
				integrationName: pluginId,
				tenantId,
				kek,
				database,
				extraAccountFields,
			});

			const accessToken = await accountKm.get_access_token();
			const refreshToken = await accountKm.get_refresh_token();
			const webhookSig = await accountKm.get_webhook_signature();

			lines.push('[Account]');
			lines.push(
				`  Access Token: ${accessToken ? maskValue(accessToken) : '(not set)'}`,
			);
			lines.push(
				`  Refresh Token: ${refreshToken ? maskValue(refreshToken) : '(not set)'}`,
			);
			lines.push(
				`  Webhook Signature: ${webhookSig ? maskValue(webhookSig) : '(not set)'}`,
			);

			// Display custom account fields
			for (const field of extraAccountFields) {
				const getMethod = fieldToMethodName(field, 'get');
				const value = (await tryCallKeyManagerMethod(accountKm, getMethod)) as
					| string
					| null;
				lines.push(
					`  ${fieldToLabel(field)}: ${value ? maskValue(value) : '(not set)'}`,
				);
			}
		} else if (authType === 'bot_token') {
			const extraAccountFields = plugin
				? getCustomAccountFields(plugin, authType)
				: [];
			const accountKm = createAccountKeyManager({
				authType: 'bot_token',
				integrationName: pluginId,
				tenantId,
				kek,
				database,
				extraAccountFields,
			});

			const botToken = await accountKm.get_bot_token();
			const webhookSig = await accountKm.get_webhook_signature();

			lines.push(`Bot Token: ${botToken ? maskValue(botToken) : '(not set)'}`);
			lines.push(
				`Webhook Signature: ${webhookSig ? maskValue(webhookSig) : '(not set)'}`,
			);

			// Display custom account fields
			for (const field of extraAccountFields) {
				const getMethod = fieldToMethodName(field, 'get');
				const value = (await tryCallKeyManagerMethod(accountKm, getMethod)) as
					| string
					| null;
				lines.push(
					`${fieldToLabel(field)}: ${value ? maskValue(value) : '(not set)'}`,
				);
			}
		} else if (authType === 'api_key') {
			const extraAccountFields = plugin
				? getCustomAccountFields(plugin, authType)
				: [];
			const accountKm = createAccountKeyManager({
				authType: 'api_key',
				integrationName: pluginId,
				tenantId,
				kek,
				database,
				extraAccountFields,
			});

			const apiKey = await accountKm.get_api_key();
			const webhookSig = await accountKm.get_webhook_signature();

			lines.push(`API Key: ${apiKey ? maskValue(apiKey) : '(not set)'}`);
			lines.push(
				`Webhook Signature: ${webhookSig ? maskValue(webhookSig) : '(not set)'}`,
			);

			// Display custom account fields
			for (const field of extraAccountFields) {
				const getMethod = fieldToMethodName(field, 'get');
				const value = (await tryCallKeyManagerMethod(accountKm, getMethod)) as
					| string
					| null;
				lines.push(
					`${fieldToLabel(field)}: ${value ? maskValue(value) : '(not set)'}`,
				);
			}
		}

		spin.stop('Credentials retrieved.');
		p.note(lines.join('\n'), `Credentials for ${pluginId} / ${tenantId}`);
	} catch (error) {
		spin.stop('Failed.');
		p.log.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

async function viewStatus(
	database: CorsairDatabase,
	pluginId: string,
): Promise<void> {
	const spin = p.spinner();
	spin.start('Querying database...');

	try {
		const orm = createCorsairOrm(database);
		const integration = await orm.integrations.findByName(pluginId);

		if (!integration) {
			spin.stop('Done.');
			p.log.warn(`No integration found for '${pluginId}'.`);
			return;
		}

		const accounts = await orm.accounts.findMany({
			where: { integration_id: integration.id },
		});

		spin.stop('Done.');

		const lines: string[] = [];
		lines.push(`[Integration: ${pluginId}]`);
		lines.push(`  ID: ${integration.id}`);
		lines.push(`  DEK: ${integration.dek ? 'set' : 'not set'}`);
		const integrationConfig = (integration.config ?? {}) as Record<
			string,
			unknown
		>;
		const configKeys = Object.keys(integrationConfig);
		lines.push(
			`  Config keys: ${configKeys.length > 0 ? configKeys.join(', ') : '(empty)'}`,
		);
		lines.push(`  Updated: ${integration.updated_at}`);

		if (accounts.length > 0) {
			lines.push('');
			lines.push(`[Accounts: ${accounts.length}]`);
			for (const account of accounts) {
				const accountConfig = (account.config ?? {}) as Record<string, unknown>;
				const accConfigKeys = Object.keys(accountConfig);
				lines.push(`  - tenant: ${account.tenant_id}`);
				lines.push(`    DEK: ${account.dek ? 'set' : 'not set'}`);
				lines.push(
					`    Config keys: ${accConfigKeys.length > 0 ? accConfigKeys.join(', ') : '(empty)'}`,
				);
			}
		} else {
			lines.push('');
			lines.push('[Accounts: none]');
		}

		p.note(lines.join('\n'), `Status: ${pluginId}`);
	} catch (error) {
		spin.stop('Failed.');
		p.log.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

async function executeAction(
	action: ActionDef,
	database: CorsairDatabase,
	pluginId: string,
	kek: string,
	authType: AuthTypes | undefined,
	tenantId: string,
	plugin?: CorsairPlugin,
): Promise<void> {
	if (action.value === 'view-status') {
		await viewStatus(database, pluginId);
		return;
	}

	if (action.value === 'get-credentials') {
		if (!authType) {
			p.log.warn('No auth type configured for this plugin.');
			return;
		}
		await executeGetCredentials(
			database,
			pluginId,
			kek,
			authType,
			tenantId,
			plugin,
		);
		return;
	}

	// Handle custom field get actions
	if (action.type === 'display' && action.method?.startsWith('get_')) {
		if (!authType) {
			p.log.warn('No auth type configured for this plugin.');
			return;
		}

		const spin = p.spinner();
		spin.start('Fetching value...');

		try {
			let value: string | null = null;
			if (action.level === 'account') {
				const extraAccountFields = plugin
					? getCustomAccountFields(plugin, authType)
					: [];
				const km = createAccountKeyManager({
					authType,
					integrationName: pluginId,
					tenantId,
					kek,
					database,
					extraAccountFields,
				});
				value = (await tryCallKeyManagerMethod(km, action.method!)) as
					| string
					| null;
			} else if (action.level === 'integration') {
				const extraIntegrationFields = plugin
					? getCustomIntegrationFields(plugin, authType)
					: [];
				const km = createIntegrationKeyManager({
					authType,
					integrationName: pluginId,
					kek,
					database,
					extraIntegrationFields,
				});
				value = (await tryCallKeyManagerMethod(km, action.method!)) as
					| string
					| null;
			}

			spin.stop('Value retrieved.');
			const displayValue = value ? maskValue(value) : '(not set)';
			p.note(
				`${fieldToLabel(action.method.replace('get_', ''))}: ${displayValue}`,
				'Value',
			);
		} catch (error) {
			spin.stop('Failed.');
			p.log.error(
				`Error: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
		return;
	}

	if (!authType) {
		p.log.warn('No auth type configured for this plugin.');
		return;
	}

	if (action.type === 'set') {
		await executeSetAction(
			action,
			database,
			pluginId,
			kek,
			authType,
			tenantId,
			plugin,
		);
	} else if (action.type === 'confirm') {
		await executeConfirmAction(
			action,
			database,
			pluginId,
			kek,
			authType,
			tenantId,
			plugin,
		);
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry Point
// ─────────────────────────────────────────────────────────────────────────────

export async function runAuth({ cwd }: { cwd: string }): Promise<void> {
	p.intro('Corsair Auth');

	// 1. Load instance
	const spin = p.spinner();
	spin.start('Loading corsair instance...');

	let internal: CorsairInternalConfig;
	try {
		internal = await extractInternalConfig(cwd);
	} catch (error) {
		spin.stop('Failed to load.');
		p.log.error(error instanceof Error ? error.message : String(error));
		p.outro('');
		process.exit(1);
	}

	const { plugins, database, kek, multiTenancy } = internal;

	if (!database) {
		spin.stop('Failed.');
		p.log.error(
			'No database adapter configured. The auth command requires a database to store credentials.',
		);
		p.outro('');
		process.exit(1);
	}

	spin.stop(
		`Loaded. Found ${plugins.length} plugin${plugins.length === 1 ? '' : 's'}.`,
	);

	// 2. Select plugin
	const plugin = await selectPlugin(plugins);
	const authType = getAuthType(plugin);

	// 3. Ensure integration is initialized
	const integration = await ensureIntegrationInitialized(
		database,
		plugin.id,
		kek,
	);

	// 4. Select tenant
	const tenantId = await selectTenant(database, integration.id, multiTenancy);

	// 5. Ensure account exists
	await ensureAccountExists(database, integration.id, tenantId, kek);

	// 6. Select and execute action
	const action = await selectAction(authType, plugin);
	await executeAction(
		action,
		database,
		plugin.id,
		kek,
		authType,
		tenantId,
		plugin,
	);

	p.outro('Done!');
}
