import {
	dropSealedAccountData,
	reencryptSealedAccountData,
} from '../../db/data-at-rest';
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
// DEKs this kek cannot open
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A stored DEK was wrapped under another kek (one retired by a key change), so
 * nothing this instance holds opens it, nor the credentials and rows under it.
 * Reads fail with this; a credential write replaces the DEK instead.
 */
export class UnreadableDekError extends Error {
	constructor(owner: string, app: string) {
		super(
			`The stored key for ${owner} was sealed under a key this instance no longer has, so its credentials can't be read. Reconnect ${app} to replace them.`,
		);
		this.name = 'UnreadableDekError';
	}
}

// What AES-GCM throws when the auth tag fails, i.e. the wrong kek.
const WRONG_KEY = 'Unsupported state or unable to authenticate data';

/**
 * The DEK, or null when this kek is not the one that wrapped it. Only a failed
 * auth tag under a non-empty kek counts: a missing kek or a malformed value
 * still throws, so a misconfigured instance never replaces a good DEK.
 */
async function openDekOrNull(
	wrapped: string,
	kek: string,
): Promise<string | null> {
	try {
		return await decryptDEK(wrapped, kek);
	} catch (err) {
		// By message, not instanceof: crypto's errors come from Node's own realm,
		// which a test VM's Error doesn't match.
		const message = (err as { message?: unknown } | null)?.message;
		if (kek && message === WRONG_KEY) return null;
		throw err;
	}
}

async function openDek(
	wrapped: string,
	kek: string,
	owner: string,
	app: string,
): Promise<string> {
	const dek = await openDekOrNull(wrapped, kek);
	if (dek === null) throw new UnreadableDekError(owner, app);
	return dek;
}

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

		cachedDek = await openDek(
			integration.dek,
			kek,
			`integration "${integrationName}"`,
			integrationName,
		);
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
		let dek: string;
		// Set when the stored DEK can't be opened: the write starts over under a
		// new one, since nothing under the old one is readable.
		let replacementDek: string | undefined;
		try {
			dek = await getDecryptedDek();
		} catch (err) {
			if (!(err instanceof UnreadableDekError)) throw err;
			console.warn(
				`[corsair] Integration "${integrationName}" has a DEK this kek can't open; replacing it and its config.`,
			);
			dek = generateDEK();
			replacementDek = await encryptDEK(dek, kek);
		}
		let currentConfig: Record<string, string> = {};
		if (!replacementDek) {
			try {
				currentConfig = await getDecryptedConfig();
			} catch (err) {
				console.error(
					`[corsair] Failed to decrypt config for integration "${integrationName}", starting fresh:`,
					err,
				);
			}
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
		await ctx.updateIntegration({
			config: encryptedConfig,
			...(replacementDek ? { dek: replacementDek } : {}),
		});
		if (replacementDek) cachedDek = dek;
	};

	// Build the key manager
	const manager = {
		get_dek: getDecryptedDek,

		issue_new_dek: async () => {
			const integration = await ctx.getIntegration();
			const newDek = generateDEK();

			// If there's an existing DEK this kek opens, re-encrypt config;
			// otherwise start fresh
			let newConfig: Record<string, string> = {};
			const oldDek = integration.dek
				? await openDekOrNull(integration.dek, kek)
				: null;
			if (oldDek) {
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

	// Not cached across calls: the /call route keeps one manager per (instance,
	// tenant) alive for the whole process, and a tenant's token is rewritten
	// out-of-band on reconnect / Hub delivery. A cached row served a revoked token.

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

				return {
					id: account.id,
					config: parseConfig(account.config),
					dek: account.dek ?? null,
				};
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
		},
	};

	// DEK cache keyed to its encrypted source: since the row is re-read each call,
	// a DEK rotated out-of-band must re-decrypt, not reuse a stale key.
	let cachedDek: string | null = null;
	let cachedDekSource: string | null = null;
	let cachedIntegrationDek: string | null = null;

	const accountLabel = `account (tenant: "${tenantId}", integration: "${integrationName}")`;

	// A DEK this kek can't open leaves the account's config and sealed rows
	// unreadable for good. The replacement drops those rows and writes the new
	// DEK with its config in one transaction, so reads work again right after.
	const replaceUnreadableDek = async (
		accountId: string,
		config: Record<string, string>,
	): Promise<string> => {
		console.warn(
			`[corsair] ${accountLabel} has a DEK this kek can't open; replacing it, its config and its sealed rows.`,
		);
		const newDek = generateDEK();
		const encryptedNewDek = await encryptDEK(newDek, kek);
		await database.db.transaction().execute(async (trx) => {
			await dropSealedAccountData(trx, accountId);
			await trx
				.updateTable('corsair_accounts')
				.set({
					config: encryptConfig(config, newDek),
					dek: encryptedNewDek,
					updated_at: new Date(),
				})
				.where('id', '=', accountId)
				.execute();
		});
		cachedDek = newDek;
		cachedDekSource = encryptedNewDek;
		return newDek;
	};

	const getDecryptedDek = async (): Promise<string> => {
		const account = await ctx.getAccount();
		if (!account.dek) {
			throw new Error(
				`No DEK found for account (tenant: "${tenantId}", integration: "${integrationName}"). Initialize the account first.`,
			);
		}

		if (cachedDek && cachedDekSource === account.dek) return cachedDek;

		cachedDek = await openDek(account.dek, kek, accountLabel, integrationName);
		cachedDekSource = account.dek;
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

		cachedIntegrationDek = await openDek(
			integration.dek,
			kek,
			`integration "${integrationName}"`,
			integrationName,
		);
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

	// Serialize config writes — same lost-update hazard as the integration
	// manager above (this is what silently dropped Outlook's refreshed token
	// when its keyBuilder persisted via Promise.all).
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
		// Read the row ONCE and derive both the DEK and the current config from that
		// same snapshot. Reading them via two separate getAccount() calls lets a DEK
		// rotation land between them, so we'd re-encrypt with a DEK that no longer
		// matches the row — the next read then fails to decrypt and the catch below
		// discards the config. One read keeps DEK and config consistent.
		const account = await ctx.getAccount();
		if (!account.dek) {
			throw new Error(
				`No DEK found for account (tenant: "${tenantId}", integration: "${integrationName}"). Initialize the account first.`,
			);
		}
		const dek = await openDekOrNull(account.dek, kek);
		let currentConfig: Record<string, string> = {};
		if (dek) {
			try {
				const config = account.config as Record<string, string>;
				currentConfig =
					!config || Object.keys(config).length === 0
						? {}
						: decryptConfig(config, dek);
			} catch (err) {
				console.error(
					`[corsair] Failed to decrypt config for ${accountLabel}, starting fresh:`,
					err,
				);
			}
		}

		const newConfig = { ...currentConfig };
		for (const [key, value] of Object.entries(updates)) {
			if (value === null) {
				delete newConfig[key];
			} else {
				newConfig[key] = value;
			}
		}

		if (!dek) {
			await replaceUnreadableDek(account.id, newConfig);
			return;
		}
		const encryptedConfig = encryptConfig(newConfig, dek);
		await ctx.updateAccount({ config: encryptedConfig });
	};

	// Build the key manager
	const manager: Record<string, unknown> = {
		get_dek: getDecryptedDek,

		issue_new_dek: async () => {
			const account = await ctx.getAccount();
			let oldDek: string | null = null;
			if (account.dek) {
				oldDek = await openDekOrNull(account.dek, kek);
				if (!oldDek) return replaceUnreadableDek(account.id, {});
			}
			const newDek = generateDEK();

			// If there's an existing DEK, re-encrypt config and sealed rows; otherwise start fresh
			let newConfig: Record<string, string> = {};
			if (oldDek) {
				const config = account.config as Record<string, string>;
				if (config && Object.keys(config).length > 0) {
					newConfig = reEncryptConfig(config, oldDek, newDek);
				}
			}

			const encryptedNewDek = await encryptDEK(newDek, kek);

			if (oldDek) {
				const previousDek = oldDek;
				await database.db.transaction().execute(async (trx) => {
					await reencryptSealedAccountData(
						trx,
						account.id,
						previousDek,
						newDek,
					);
					await trx
						.updateTable('corsair_accounts')
						.set({
							config: newConfig,
							dek: encryptedNewDek,
							updated_at: new Date(),
						})
						.where('id', '=', account.id)
						.execute();
				});
			} else {
				await ctx.updateAccount({
					config: newConfig,
					dek: encryptedNewDek,
				});
			}

			cachedDek = newDek;
			cachedDekSource = encryptedNewDek;
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
