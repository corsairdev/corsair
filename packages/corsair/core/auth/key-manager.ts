import type { CorsairDatabase } from '../../db/kysely/database';
import type { AuthTypes } from '../constants';
import {
	decryptConfig,
	decryptDEK,
	encryptConfig,
	encryptDEK,
	generateDEK,
	reEncryptConfig,
} from './encryption';
import type {
	AccountKeyContext,
	AccountKeyManagerFor,
	IntegrationKeyContext,
	IntegrationKeyManagerFor,
	OAuth2IntegrationCredentials,
} from './types';
import { BASE_AUTH_FIELDS } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Field Accessor Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates getter and setter functions for a list of field names.
 * Each field gets a `get_<field>` and `set_<field>` method that
 * reads/writes from encrypted config storage.
 */
function createFieldAccessors(
	getDecryptedConfig: () => Promise<Record<string, string>>,
	updateConfig: (updates: Record<string, string | null>) => Promise<void>,
	fields: readonly string[],
): Record<string, (...args: unknown[]) => Promise<unknown>> {
	const accessors: Record<string, (...args: unknown[]) => Promise<unknown>> =
		{};

	for (const field of fields) {
		accessors[`get_${field}`] = async () => {
			const config = await getDecryptedConfig();
			return config[field] ?? null;
		};

		accessors[`set_${field}`] = async (value: unknown) => {
			await updateConfig({ [field]: value as string | null });
		};
	}

	return accessors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Config Parsing
// ─────────────────────────────────────────────────────────────────────────────

const parseConfig = (config: unknown): Record<string, unknown> => {
	if (!config) return {};
	if (typeof config === 'string') {
		try {
			return JSON.parse(config);
		} catch {
			return {};
		}
	}
	return config as Record<string, unknown>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Integration Key Manager Factory
// ─────────────────────────────────────────────────────────────────────────────

export type IntegrationKeyManagerOptions<T extends AuthTypes> = {
	authType: T;
	integrationName: string;
	kek: string;
	database: CorsairDatabase;
	/** Extra integration-level fields from plugin authConfig */
	extraIntegrationFields?: readonly string[];
};

/**
 * Creates an integration-level key manager for the given auth type.
 * The returned manager has auto-generated getters/setters for all fields
 * (base fields for the auth type + any extra fields from plugin authConfig).
 */
export function createIntegrationKeyManager<T extends AuthTypes>(
	options: IntegrationKeyManagerOptions<T>,
): IntegrationKeyManagerFor<T> {
	const {
		authType,
		integrationName,
		kek,
		database,
		extraIntegrationFields = [],
	} = options;

	// Merge base + extra fields
	const allFields = [
		...BASE_AUTH_FIELDS[authType].integration,
		...extraIntegrationFields,
	];

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
				config: parseConfig(integration.config),
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

	// DEK cache
	let cachedDek: string | null = null;

	const getDecryptedDek = async (): Promise<string> => {
		if (cachedDek) return cachedDek;

		const integration = await ctx.getIntegration();
		if (!integration.dek) {
			throw new Error(
				`No DEK found for integration "${integrationName}". Initialize the integration first.`,
			);
		}

		cachedDek = await decryptDEK(integration.dek, kek);
		return cachedDek;
	};

	const getDecryptedConfig = async (): Promise<Record<string, string>> => {
		const integration = await ctx.getIntegration();
		const dek = await getDecryptedDek();
		const config = integration.config as Record<string, string>;

		if (!config || Object.keys(config).length === 0) {
			return {};
		}

		return decryptConfig(config, dek);
	};

	const updateConfig = async (
		updates: Record<string, string | null>,
	): Promise<void> => {
		const dek = await getDecryptedDek();
		const currentConfig = await getDecryptedConfig();

		const newConfig = { ...currentConfig };
		for (const [key, value] of Object.entries(updates)) {
			if (value === null) {
				delete newConfig[key];
			} else {
				newConfig[key] = value;
			}
		}

		const encryptedConfig = encryptConfig(newConfig, dek);
		await ctx.updateIntegration({ config: encryptedConfig });
	};

	// Build the key manager
	const manager = {
		get_dek: getDecryptedDek,

		issue_new_dek: async () => {
			const integration = await ctx.getIntegration();
			const newDek = generateDEK();

			// If there's an existing DEK, re-encrypt config; otherwise start fresh
			let newConfig: Record<string, string> = {};
			if (integration.dek) {
				const oldDek = await decryptDEK(integration.dek, kek);
				const config = integration.config as Record<string, string>;
				if (config && Object.keys(config).length > 0) {
					newConfig = reEncryptConfig(config, oldDek, newDek);
				}
			}

			const encryptedNewDek = await encryptDEK(newDek, kek);

			await ctx.updateIntegration({
				config: newConfig,
				dek: encryptedNewDek,
			});

			cachedDek = newDek;
			return newDek;
		},

		// Auto-generated field accessors
		...createFieldAccessors(getDecryptedConfig, updateConfig, allFields),
	};

	return manager as IntegrationKeyManagerFor<T>;
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
	/** Extra account-level fields from plugin authConfig */
	extraAccountFields?: readonly string[];
};

/**
 * Creates an account-level key manager for the given auth type.
 * The returned manager has auto-generated getters/setters for all fields
 * (base fields for the auth type + any extra fields from plugin authConfig).
 * OAuth2 account managers also include `get_integration_credentials`.
 */
export function createAccountKeyManager<T extends AuthTypes>(
	options: AccountKeyManagerOptions<T>,
): AccountKeyManagerFor<T> {
	const {
		authType,
		integrationName,
		tenantId,
		kek,
		database,
		extraAccountFields = [],
	} = options;

	// Merge base + extra fields
	const allFields = [
		...BASE_AUTH_FIELDS[authType].account,
		...extraAccountFields,
	];

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
			config: parseConfig(integration.config),
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
				config: parseConfig(account.config),
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

	// DEK caches
	let cachedDek: string | null = null;
	let cachedIntegrationDek: string | null = null;

	const getDecryptedDek = async (): Promise<string> => {
		if (cachedDek) return cachedDek;

		const account = await ctx.getAccount();
		if (!account.dek) {
			throw new Error(
				`No DEK found for account (tenant: "${tenantId}", integration: "${integrationName}"). Initialize the account first.`,
			);
		}

		cachedDek = await decryptDEK(account.dek, kek);
		return cachedDek;
	};

	const getDecryptedIntegrationDek = async (): Promise<string> => {
		if (cachedIntegrationDek) return cachedIntegrationDek;

		const integration = await ctx.getIntegration();
		if (!integration.dek) {
			throw new Error(
				`No DEK found for integration "${integrationName}". Initialize the integration first.`,
			);
		}

		cachedIntegrationDek = await decryptDEK(integration.dek, kek);
		return cachedIntegrationDek;
	};

	const getDecryptedConfig = async (): Promise<Record<string, string>> => {
		const account = await ctx.getAccount();
		const dek = await getDecryptedDek();
		const config = account.config as Record<string, string>;

		if (!config || Object.keys(config).length === 0) {
			return {};
		}

		return decryptConfig(config, dek);
	};

	const getDecryptedIntegrationConfig = async (): Promise<
		Record<string, string>
	> => {
		const integration = await ctx.getIntegration();
		const dek = await getDecryptedIntegrationDek();
		const config = integration.config as Record<string, string>;

		if (!config || Object.keys(config).length === 0) {
			return {};
		}

		return decryptConfig(config, dek);
	};

	const updateConfig = async (
		updates: Record<string, string | null>,
	): Promise<void> => {
		const dek = await getDecryptedDek();
		const currentConfig = await getDecryptedConfig();

		const newConfig = { ...currentConfig };
		for (const [key, value] of Object.entries(updates)) {
			if (value === null) {
				delete newConfig[key];
			} else {
				newConfig[key] = value;
			}
		}

		const encryptedConfig = encryptConfig(newConfig, dek);
		await ctx.updateAccount({ config: encryptedConfig });
	};

	// Build the key manager
	const manager: Record<string, unknown> = {
		get_dek: getDecryptedDek,

		issue_new_dek: async () => {
			const account = await ctx.getAccount();
			const newDek = generateDEK();

			// If there's an existing DEK, re-encrypt config; otherwise start fresh
			let newConfig: Record<string, string> = {};
			if (account.dek) {
				const oldDek = await decryptDEK(account.dek, kek);
				const config = account.config as Record<string, string>;
				if (config && Object.keys(config).length > 0) {
					newConfig = reEncryptConfig(config, oldDek, newDek);
				}
			}

			const encryptedNewDek = await encryptDEK(newDek, kek);

			await ctx.updateAccount({
				config: newConfig,
				dek: encryptedNewDek,
			});

			cachedDek = newDek;
			return newDek;
		},

		// Auto-generated field accessors
		...createFieldAccessors(getDecryptedConfig, updateConfig, allFields),
	};

	// Add OAuth2-specific get_integration_credentials method
	if (authType === 'oauth_2') {
		manager.get_integration_credentials =
			async (): Promise<OAuth2IntegrationCredentials> => {
				const config = await getDecryptedIntegrationConfig();

				return {
					client_id: config.client_id || null,
					client_secret: config.client_secret || null,
					redirect_url: config.redirect_url ?? null,
				};
			};
	}

	return manager as AccountKeyManagerFor<T>;
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
