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
			const normalized = [null, undefined, ''].includes(value as null)
				? null
				: (value as string);
			await updateConfig({ [field]: normalized });
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

	// Serialize config writes: each setter does a read-merge-write of the whole
	// encrypted blob, so parallel setters (e.g. Promise.all([set_a, set_b]))
	// read the same base and the last write silently drops the other's field.
	// Per-instance serialization only — writers in other instances/processes
	// can still race; row-level merge or optimistic locking is the full fix.
	let configWriteChain: Promise<void> = Promise.resolve();
	const updateConfig = (
		updates: Record<string, string | null>,
	): Promise<void> => {
		const run = configWriteChain.then(() => doUpdateConfig(updates));
		configWriteChain = run.catch(() => {});
		return run;
	};

	const doUpdateConfig = async (
		updates: Record<string, string | null>,
	): Promise<void> => {
		const dek = await getDecryptedDek();
		let currentConfig: Record<string, string>;
		try {
			currentConfig = await getDecryptedConfig();
		} catch (err) {
			console.error(
				`[corsair] Failed to decrypt config for integration "${integrationName}", starting fresh:`,
				err,
			);
			currentConfig = {};
		}

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
	ensureProvisioned?: () => Promise<void>;
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
		ensureProvisioned,
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

		let provisionAttempted = false;

		while (true) {
			const integration = await database.db
				.selectFrom('corsair_integrations')
				.selectAll()
				.where('name', '=', integrationName)
				.executeTakeFirst();

			if (!integration) {
				if (!provisionAttempted && ensureProvisioned) {
					provisionAttempted = true;
					await ensureProvisioned();
					continue;
				}

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
		}
	};

	const ctx: AccountKeyContext = {
		kek,
		integrationName,
		tenantId,

		getIntegration,

		getAccount: async () => {
			if (cachedAccount) return cachedAccount;

			let provisionAttempted = false;

			while (true) {
				const integration = await getIntegration();

				const account = await database.db
					.selectFrom('corsair_accounts')
					.selectAll()
					.where('tenant_id', '=', tenantId)
					.where('integration_id', '=', integration.id)
					.executeTakeFirst();

				if (!account) {
					if (!provisionAttempted && ensureProvisioned) {
						provisionAttempted = true;
						await ensureProvisioned();
						continue;
					}

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
			}
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

	// Serialize config writes on this manager instance (same lost-update hazard
	// that dropped Outlook's refreshed token under Promise.all). Cross-manager
	// races use optimistic CAS on the opaque encrypted config blob below.
	let configWriteChain: Promise<void> = Promise.resolve();
	const updateConfig = (
		updates: Record<string, string | null>,
	): Promise<void> => {
		const run = configWriteChain.then(() => doUpdateConfig(updates));
		configWriteChain = run.catch(() => {});
		return run;
	};

	type AccountConfigRow = {
		id: string;
		config: unknown;
		dek: string | null | undefined;
	};

	const loadFreshAccountConfig = async (): Promise<{
		row: AccountConfigRow;
		dek: string;
		currentConfig: Record<string, string>;
	}> => {
		cachedAccount = null;
		cachedDek = null;

		const account = await ctx.getAccount();
		const row = await database.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('id', '=', account.id)
			.executeTakeFirstOrThrow();

		if (!row.dek) {
			throw new Error(
				`No DEK found for account (tenant: "${tenantId}", integration: "${integrationName}"). Initialize the account first.`,
			);
		}

		const dek = await decryptDEK(row.dek, kek);
		const rawConfig = parseConfig(row.config) as Record<string, string>;
		let currentConfig: Record<string, string>;
		try {
			currentConfig =
				!rawConfig || Object.keys(rawConfig).length === 0
					? {}
					: decryptConfig(rawConfig, dek);
		} catch (err) {
			console.error(
				`[corsair] Failed to decrypt config for account (tenant: "${tenantId}", integration: "${integrationName}"):`,
				err,
			);
			// Never CAS-write from a failed decrypt — that would wipe real secrets.
			throw err;
		}

		return { row, dek, currentConfig };
	};

	const casWriteAccountConfig = async (
		row: AccountConfigRow,
		encryptedConfig: Record<string, string>,
		encryptedDek?: string,
	): Promise<boolean> => {
		let query = database.db
			.updateTable('corsair_accounts')
			.set({
				config: encryptedConfig,
				...(encryptedDek !== undefined ? { dek: encryptedDek } : {}),
				updated_at: new Date(),
			})
			.where('id', '=', row.id)
			.where('config', '=', row.config as any);

		// DEK rotation also locks on the prior dek so a concurrent config write
		// (or another rotator) forces a clean re-read instead of a blind overwrite.
		if (encryptedDek !== undefined) {
			query =
				row.dek == null
					? query.where('dek', 'is', null)
					: query.where('dek', '=', row.dek);
		}

		const result = await query.executeTakeFirst();

		cachedAccount = null;
		cachedDek = null;

		return result.numUpdatedRows !== undefined && result.numUpdatedRows > 0n;
	};

	const doUpdateConfig = async (
		updates: Record<string, string | null>,
	): Promise<void> => {
		for (let attempt = 0; attempt < 5; attempt++) {
			const { row, dek, currentConfig } = await loadFreshAccountConfig();

			const newConfig = { ...currentConfig };
			for (const [key, value] of Object.entries(updates)) {
				if (value === null) {
					delete newConfig[key];
				} else {
					newConfig[key] = value;
				}
			}

			const encryptedConfig = encryptConfig(newConfig, dek);
			if (await casWriteAccountConfig(row, encryptedConfig)) {
				return;
			}
		}

		throw new Error(
			`Failed to update account config atomically (tenant: "${tenantId}", integration: "${integrationName}")`,
		);
	};

	const setWebhookSignatureIfAbsent = (
		value: string,
	): Promise<{ created: boolean }> => {
		// Trim only for emptiness — store the exact value handlers echo/compare.
		if (!value.trim()) {
			return Promise.reject(new Error('Webhook signature cannot be empty'));
		}
		const normalized = value;

		// Share the write chain with set_* on this manager. Cross-manager races
		// reuse the same optimistic config CAS as doUpdateConfig.
		const run = configWriteChain.then(async () => {
			for (let attempt = 0; attempt < 5; attempt++) {
				const { row, dek, currentConfig } = await loadFreshAccountConfig();

				const existing = currentConfig.webhook_signature;
				if (existing) {
					if (existing !== normalized) {
						throw new Error('Webhook signature already configured');
					}
					return { created: false };
				}

				const encryptedConfig = encryptConfig(
					{ ...currentConfig, webhook_signature: normalized },
					dek,
				);

				if (await casWriteAccountConfig(row, encryptedConfig)) {
					return { created: true };
				}
			}

			throw new Error('Failed to set webhook signature atomically');
		});

		configWriteChain = run.then(
			() => undefined,
			() => undefined,
		);
		return run;
	};

	const issueNewDek = (): Promise<string> => {
		const run = configWriteChain.then(async () => {
			for (let attempt = 0; attempt < 5; attempt++) {
				cachedAccount = null;
				cachedDek = null;

				const account = await ctx.getAccount();
				const row = await database.db
					.selectFrom('corsair_accounts')
					.selectAll()
					.where('id', '=', account.id)
					.executeTakeFirstOrThrow();

				const newDek = generateDEK();
				const config = parseConfig(row.config) as Record<string, string>;
				const hasConfig = !!config && Object.keys(config).length > 0;
				let newConfig: Record<string, string> = {};

				if (row.dek) {
					if (hasConfig) {
						const oldDek = await decryptDEK(row.dek, kek);
						newConfig = reEncryptConfig(config, oldDek, newDek);
					}
				} else if (hasConfig) {
					// Config without a DEK is unreadable — refuse rather than wipe it.
					throw new Error(
						`Account has encrypted config but no DEK (tenant: "${tenantId}", integration: "${integrationName}"). Recover the DEK before rotating.`,
					);
				}

				const encryptedNewDek = await encryptDEK(newDek, kek);
				if (await casWriteAccountConfig(row, newConfig, encryptedNewDek)) {
					cachedDek = newDek;
					return newDek;
				}
			}

			throw new Error(
				`Failed to rotate account DEK atomically (tenant: "${tenantId}", integration: "${integrationName}")`,
			);
		});

		configWriteChain = run.then(
			() => undefined,
			() => undefined,
		);
		return run;
	};

	// Build the key manager
	const manager: Record<string, unknown> = {
		get_dek: getDecryptedDek,

		issue_new_dek: issueNewDek,

		set_webhook_signature_if_absent: setWebhookSignatureIfAbsent,

		// Auto-generated field accessors
		...createFieldAccessors(getDecryptedConfig, updateConfig, allFields),
	};

	// Add OAuth2-specific get_integration_credentials method
	if (authType === 'oauth_2') {
		manager.get_integration_credentials =
			async (): Promise<OAuth2IntegrationCredentials> => {
				const config = await getDecryptedIntegrationConfig();

				return {
					// Pass extension integration fields through (e.g. gmail's
					// topic_id/pubsub_audience) — subscribe capabilities read them.
					...config,
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
