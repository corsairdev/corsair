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
	ApiKeyAccountKeyManager,
	BaseKeyManager,
	IntegrationKeyContext,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Integration-Level API Key Manager
// For api_key auth, there are no integration-level secrets, only DEK ops
// ─────────────────────────────────────────────────────────────────────────────

export function createApiKeyIntegrationKeyManager(
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

			// For api_key, integration config is empty, just update DEK
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
// Account-Level API Key Manager
// ─────────────────────────────────────────────────────────────────────────────

export function createApiKeyAccountKeyManager(
	ctx: AccountKeyContext,
): ApiKeyAccountKeyManager {
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

		getApiKey: async () => {
			const config = await getDecryptedConfig();
			return config.api_key || null;
		},

		setApiKey: async (apiKey: string) => {
			await updateConfig({ api_key: apiKey });
		},

		getWebhookSignature: async () => {
			const config = await getDecryptedConfig();
			return config.webhook_signature ?? null;
		},

		setWebhookSignature: async (webhookSignature: string | null) => {
			await updateConfig({ webhook_signature: webhookSignature });
		},
	};
}
