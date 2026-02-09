import type { CorsairDatabase } from '../../db/kysely/database';
import type { AuthTypes } from '../constants';
import { encryptDEK, generateDEK } from './encryption';
import {
	createApiKeyAccountKeyManager,
	createApiKeyIntegrationKeyManager,
	createBotTokenAccountKeyManager,
	createBotTokenIntegrationKeyManager,
	createOAuth2AccountKeyManager,
	createOAuth2IntegrationKeyManager,
} from './methods';
import type {
	AccountKeyContext,
	AccountKeyManagerFor,
	IntegrationKeyContext,
	IntegrationKeyManagerFor,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Integration Key Manager Factory
// ─────────────────────────────────────────────────────────────────────────────

export type IntegrationKeyManagerOptions<T extends AuthTypes> = {
	authType: T;
	integrationName: string;
	kek: string;
	database: CorsairDatabase;
};

/**
 * Creates an integration-level key manager for the given auth type.
 * The returned manager has methods based on the auth type:
 * - oauth_2: getClientId, setClientId, getClientSecret, setClientSecret, etc.
 * - bot_token: only getDEK, issueNewDEK
 * - api_key: only getDEK, issueNewDEK
 */
export function createIntegrationKeyManager<T extends AuthTypes>(
	options: IntegrationKeyManagerOptions<T>,
): IntegrationKeyManagerFor<T> {
	const { authType, integrationName, kek, database } = options;

	// Create cached integration lookup
	let cachedIntegration: {
		id: string;
		config: Record<string, unknown>;
		dek: string | null;
	} | null = null;

	const ctx: IntegrationKeyContext = {
		kek,
		integrationName,

		getIntegration: async () => {
			if (cachedIntegration) return cachedIntegration;

			const integration = await database.db
				.selectFrom('corsair_integrations')
				.selectAll()
				.where('name', '=', integrationName)
				.executeTakeFirst();

			if (!integration) {
				throw new Error(
					`Integration "${integrationName}" not found. Make sure to create the integration first.`,
				);
			}

			cachedIntegration = {
				id: integration.id,
				config: (integration.config ?? {}) as Record<string, unknown>,
				dek: integration.dek ?? null,
			};

			return cachedIntegration;
		},

		updateIntegration: async (data) => {
			const integration = await ctx.getIntegration();
			await database.db
				.updateTable('corsair_integrations')
				.set({
					...(data.config !== undefined ? { config: data.config } : {}),
					...(data.dek !== undefined ? { dek: data.dek } : {}),
					updated_at: new Date(),
				})
				.where('id', '=', integration.id)
				.execute();

			// Invalidate cache
			cachedIntegration = null;
		},
	};

	// Create the appropriate manager based on auth type
	switch (authType) {
		case 'oauth_2':
			return createOAuth2IntegrationKeyManager(
				ctx,
			) as IntegrationKeyManagerFor<T>;
		case 'bot_token':
			return createBotTokenIntegrationKeyManager(
				ctx,
			) as IntegrationKeyManagerFor<T>;
		case 'api_key':
			return createApiKeyIntegrationKeyManager(
				ctx,
			) as IntegrationKeyManagerFor<T>;
		default:
			throw new Error(`Unknown auth type: ${authType}`);
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Account Key Manager Factory
// ─────────────────────────────────────────────────────────────────────────────

export type AccountKeyManagerOptions<T extends AuthTypes> = {
	authType: T;
	integrationName: string;
	tenantId: string;
	kek: string;
	database: CorsairDatabase;
};

/**
 * Creates an account-level key manager for the given auth type.
 * The returned manager has methods based on the auth type:
 * - oauth_2: getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, etc.
 * - bot_token: getBotToken, setBotToken
 * - api_key: getApiKey, setApiKey
 */
export function createAccountKeyManager<T extends AuthTypes>(
	options: AccountKeyManagerOptions<T>,
): AccountKeyManagerFor<T> {
	const { authType, integrationName, tenantId, kek, database } = options;

	// Cache for account lookup
	let cachedAccount: {
		id: string;
		config: Record<string, unknown>;
		dek: string | null;
	} | null = null;

	// Cache for integration lookup
	let cachedIntegration: {
		id: string;
		config: Record<string, unknown>;
		dek: string | null;
	} | null = null;

	const getIntegration = async () => {
		if (cachedIntegration) return cachedIntegration;

		const integration = await database.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.where('name', '=', integrationName)
			.executeTakeFirst();

		if (!integration) {
			throw new Error(
				`Integration "${integrationName}" not found. Make sure to create the integration first.`,
			);
		}

		cachedIntegration = {
			id: integration.id,
			config: (integration.config ?? {}) as Record<string, unknown>,
			dek: integration.dek ?? null,
		};

		return cachedIntegration;
	};

	const ctx: AccountKeyContext = {
		kek,
		integrationName,
		tenantId,

		getIntegration,

		getAccount: async () => {
			if (cachedAccount) return cachedAccount;

			const integration = await getIntegration();

			const account = await database.db
				.selectFrom('corsair_accounts')
				.selectAll()
				.where('tenant_id', '=', tenantId)
				.where('integration_id', '=', integration.id)
				.executeTakeFirst();

			if (!account) {
				throw new Error(
					`Account not found for tenant "${tenantId}" and integration "${integrationName}". Make sure to create the account first.`,
				);
			}

			cachedAccount = {
				id: account.id,
				config: (account.config ?? {}) as Record<string, unknown>,
				dek: account.dek ?? null,
			};

			return cachedAccount;
		},

		updateAccount: async (data) => {
			const account = await ctx.getAccount();
			await database.db
				.updateTable('corsair_accounts')
				.set({
					...(data.config !== undefined ? { config: data.config } : {}),
					...(data.dek !== undefined ? { dek: data.dek } : {}),
					updated_at: new Date(),
				})
				.where('id', '=', account.id)
				.execute();

			// Invalidate cache
			cachedAccount = null;
		},
	};

	// Create the appropriate manager based on auth type
	switch (authType) {
		case 'oauth_2':
			return createOAuth2AccountKeyManager(ctx) as AccountKeyManagerFor<T>;
		case 'bot_token':
			return createBotTokenAccountKeyManager(ctx) as AccountKeyManagerFor<T>;
		case 'api_key':
			return createApiKeyAccountKeyManager(ctx) as AccountKeyManagerFor<T>;
		default:
			throw new Error(`Unknown auth type: ${authType}`);
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Initialization Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initializes an integration with a new DEK.
 * Call this when creating a new integration or when setting up encryption for the first time.
 */
export async function initializeIntegrationDEK(
	database: CorsairDatabase,
	integrationName: string,
	kek: string,
): Promise<string> {
	const integration = await database.db
		.selectFrom('corsair_integrations')
		.selectAll()
		.where('name', '=', integrationName)
		.executeTakeFirst();

	if (!integration) {
		throw new Error(`Integration "${integrationName}" not found.`);
	}

	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, kek);

	await database.db
		.updateTable('corsair_integrations')
		.set({
			dek: encryptedDek,
			updated_at: new Date(),
		})
		.where('id', '=', integration.id)
		.execute();

	return dek;
}

/**
 * Initializes an account with a new DEK.
 * Call this when creating a new account or when setting up encryption for the first time.
 */
export async function initializeAccountDEK(
	database: CorsairDatabase,
	integrationName: string,
	tenantId: string,
	kek: string,
): Promise<string> {
	const integration = await database.db
		.selectFrom('corsair_integrations')
		.selectAll()
		.where('name', '=', integrationName)
		.executeTakeFirst();

	if (!integration) {
		throw new Error(`Integration "${integrationName}" not found.`);
	}

	const account = await database.db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('tenant_id', '=', tenantId)
		.where('integration_id', '=', integration.id)
		.executeTakeFirst();

	if (!account) {
		throw new Error(
			`Account not found for tenant "${tenantId}" and integration "${integrationName}".`,
		);
	}

	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, kek);

	await database.db
		.updateTable('corsair_accounts')
		.set({
			dek: encryptedDek,
			updated_at: new Date(),
		})
		.where('id', '=', account.id)
		.execute();

	return dek;
}
