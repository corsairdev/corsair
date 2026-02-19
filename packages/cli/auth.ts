import * as p from '@clack/prompts';
import type {
	AuthTypes,
	CorsairInternalConfig,
	CorsairPlugin,
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
		hint: 'keys.setApiKey()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'setApiKey',
	},
	{
		value: 'set-webhook-sig',
		label: 'Set Webhook Signature',
		hint: 'keys.setWebhookSignature()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'setWebhookSignature',
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
		method: 'issueNewDEK',
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
		method: 'issueNewDEK',
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
		hint: 'keys.setBotToken()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'setBotToken',
	},
	{
		value: 'set-webhook-sig',
		label: 'Set Webhook Signature',
		hint: 'keys.setWebhookSignature()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'setWebhookSignature',
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
		method: 'issueNewDEK',
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
		method: 'issueNewDEK',
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
		hint: 'keys.setClientId()',
		level: 'integration',
		type: 'set',
		inputType: 'password',
		method: 'setClientId',
	},
	{
		value: 'set-client-secret',
		label: 'Set Client Secret',
		hint: 'keys.setClientSecret()',
		level: 'integration',
		type: 'set',
		inputType: 'password',
		method: 'setClientSecret',
	},
	{
		value: 'set-redirect-url',
		label: 'Set Redirect URL',
		hint: 'keys.setRedirectUrl()',
		level: 'integration',
		type: 'set',
		inputType: 'text',
		method: 'setRedirectUrl',
	},
	{
		value: 'set-access-token',
		label: 'Set Access Token',
		hint: 'keys.setAccessToken()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'setAccessToken',
	},
	{
		value: 'set-refresh-token',
		label: 'Set Refresh Token',
		hint: 'keys.setRefreshToken()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'setRefreshToken',
	},
	{
		value: 'set-webhook-sig',
		label: 'Set Webhook Signature',
		hint: 'keys.setWebhookSignature()',
		level: 'account',
		type: 'set',
		inputType: 'password',
		method: 'setWebhookSignature',
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
		method: 'issueNewDEK',
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
		method: 'issueNewDEK',
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

function getActionsForAuthType(authType: AuthTypes | undefined): ActionDef[] {
	switch (authType) {
		case 'api_key':
			return API_KEY_ACTIONS;
		case 'bot_token':
			return BOT_TOKEN_ACTIONS;
		case 'oauth_2':
			return OAUTH2_ACTIONS;
		default:
			return NO_AUTH_ACTIONS;
	}
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

function handleCancel(): never {
	p.cancel('Operation cancelled.');
	process.exit(0);
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
): Promise<ActionDef> {
	const actions = getActionsForAuthType(authType);

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
			const km = createAccountKeyManager({
				authType,
				integrationName: pluginId,
				tenantId,
				kek,
				database,
			});
			const fn = (
				km as unknown as Record<string, (...args: unknown[]) => Promise<void>>
			)[action.method!]!;
			await fn(value);
		} else if (action.level === 'integration') {
			const km = createIntegrationKeyManager({
				authType,
				integrationName: pluginId,
				kek,
				database,
			});
			const fn = (
				km as unknown as Record<string, (...args: unknown[]) => Promise<void>>
			)[action.method!]!;
			await fn(value);
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
			const km = createAccountKeyManager({
				authType,
				integrationName: pluginId,
				tenantId,
				kek,
				database,
			});
			const fn = (
				km as unknown as Record<string, (...args: unknown[]) => Promise<void>>
			)[action.method!]!;
			await fn();
		} else if (action.level === 'integration') {
			const km = createIntegrationKeyManager({
				authType,
				integrationName: pluginId,
				kek,
				database,
			});
			const fn = (
				km as unknown as Record<string, (...args: unknown[]) => Promise<void>>
			)[action.method!]!;
			await fn();
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
): Promise<void> {
	const spin = p.spinner();
	spin.start('Fetching credentials...');

	try {
		const lines: string[] = [];

		if (authType === 'oauth_2') {
			// Integration-level credentials
			const integrationKm = createIntegrationKeyManager({
				authType: 'oauth_2',
				integrationName: pluginId,
				kek,
				database,
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

			// Account-level credentials
			const accountKm = createAccountKeyManager({
				authType: 'oauth_2',
				integrationName: pluginId,
				tenantId,
				kek,
				database,
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
		} else if (authType === 'bot_token') {
			const accountKm = createAccountKeyManager({
				authType: 'bot_token',
				integrationName: pluginId,
				tenantId,
				kek,
				database,
			});

			const botToken = await accountKm.get_bot_token();
			const webhookSig = await accountKm.get_webhook_signature();

			lines.push(`Bot Token: ${botToken ? maskValue(botToken) : '(not set)'}`);
			lines.push(
				`Webhook Signature: ${webhookSig ? maskValue(webhookSig) : '(not set)'}`,
			);
		} else if (authType === 'api_key') {
			const accountKm = createAccountKeyManager({
				authType: 'api_key',
				integrationName: pluginId,
				tenantId,
				kek,
				database,
			});

			const apiKey = await accountKm.get_api_key();
			const webhookSig = await accountKm.get_webhook_signature();

			lines.push(`API Key: ${apiKey ? maskValue(apiKey) : '(not set)'}`);
			lines.push(
				`Webhook Signature: ${webhookSig ? maskValue(webhookSig) : '(not set)'}`,
			);
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
		await executeGetCredentials(database, pluginId, kek, authType, tenantId);
		return;
	}

	if (!authType) {
		p.log.warn('No auth type configured for this plugin.');
		return;
	}

	if (action.type === 'set') {
		await executeSetAction(action, database, pluginId, kek, authType, tenantId);
	} else if (action.type === 'confirm') {
		await executeConfirmAction(
			action,
			database,
			pluginId,
			kek,
			authType,
			tenantId,
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
	const action = await selectAction(authType);
	await executeAction(action, database, plugin.id, kek, authType, tenantId);

	p.outro('Done!');
}
