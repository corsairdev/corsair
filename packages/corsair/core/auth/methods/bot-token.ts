import {
	decryptConfig,
	decryptDEK,
	encryptConfig,
	encryptDEK,
	generateDEK,
	reEncryptConfig,
} from '../encryption';
import type {
	AccountKeyContext,
	BaseKeyManager,
	BotTokenAccountKeyManager,
	IntegrationKeyContext,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Integration-Level Bot Token Key Manager
// For bot_token auth, there are no integration-level secrets, only DEK ops
// ─────────────────────────────────────────────────────────────────────────────

export function createBotTokenIntegrationKeyManager(
	ctx: IntegrationKeyContext,
): BaseKeyManager {
	let cachedDek: string | null = null;

	const getDecryptedDek = async (): Promise<string> => {
		if (cachedDek) return cachedDek;

		const integration = await ctx.getIntegration();
		if (!integration.dek) {
			throw new Error(
				`No DEK found for integration "${ctx.integrationName}". Initialize the integration first.`,
			);
		}

		cachedDek = await decryptDEK(integration.dek, ctx.kek);
		return cachedDek;
	};

	return {
		getDEK: getDecryptedDek,

		issueNewDEK: async () => {
			const newDek = generateDEK();
			const encryptedNewDek = await encryptDEK(newDek, ctx.kek);

			// For bot_token, integration config is empty, just update DEK
			await ctx.updateIntegration({
				config: {},
				dek: encryptedNewDek,
			});

			cachedDek = newDek;
			return newDek;
		},
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Account-Level Bot Token Key Manager
// ─────────────────────────────────────────────────────────────────────────────

export function createBotTokenAccountKeyManager(
	ctx: AccountKeyContext,
): BotTokenAccountKeyManager {
	let cachedDek: string | null = null;

	const getDecryptedDek = async (): Promise<string> => {
		if (cachedDek) return cachedDek;

		const account = await ctx.getAccount();
		if (!account.dek) {
			throw new Error(
				`No DEK found for account (tenant: "${ctx.tenantId}", integration: "${ctx.integrationName}"). Initialize the account first.`,
			);
		}

		cachedDek = await decryptDEK(account.dek, ctx.kek);
		return cachedDek;
	};

	const getDecryptedConfig = async () => {
		const account = await ctx.getAccount();
		const dek = await getDecryptedDek();
		const config = account.config as Record<string, string>;

		if (!config || Object.keys(config).length === 0) {
			return {};
		}

		return decryptConfig(config, dek);
	};

	const updateConfig = async (updates: Record<string, string | null>) => {
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

	return {
		getDEK: getDecryptedDek,

		issueNewDEK: async () => {
			const account = await ctx.getAccount();
			const newDek = generateDEK();

			// If there's an existing DEK, re-encrypt config; otherwise start fresh
			let newConfig: Record<string, string> = {};
			if (account.dek) {
				const oldDek = await decryptDEK(account.dek, ctx.kek);
				const config = account.config as Record<string, string>;
				if (config && Object.keys(config).length > 0) {
					newConfig = reEncryptConfig(config, oldDek, newDek);
				}
			}

			const encryptedNewDek = await encryptDEK(newDek, ctx.kek);

			await ctx.updateAccount({
				config: newConfig,
				dek: encryptedNewDek,
			});

			cachedDek = newDek;
			return newDek;
		},

		getBotToken: async () => {
			const config = await getDecryptedConfig();
			if (!config.bot_token) {
				throw new Error(
					`bot_token not found for account (tenant: "${ctx.tenantId}", integration: "${ctx.integrationName}")`,
				);
			}
			return config.bot_token;
		},

		setBotToken: async (botToken: string) => {
			await updateConfig({ bot_token: botToken });
		},
	};
}
