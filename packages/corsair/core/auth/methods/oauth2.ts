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
	IntegrationKeyContext,
	OAuth2AccountKeyManager,
	OAuth2IntegrationCredentials,
	OAuth2IntegrationKeyManager,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Integration-Level OAuth2 Key Manager
// ─────────────────────────────────────────────────────────────────────────────

export function createOAuth2IntegrationKeyManager(
	ctx: IntegrationKeyContext,
): OAuth2IntegrationKeyManager {
	// Cache for decrypted DEK
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

	const getDecryptedConfig = async () => {
		const integration = await ctx.getIntegration();
		const dek = await getDecryptedDek();
		const config = integration.config as Record<string, string>;

		if (!config || Object.keys(config).length === 0) {
			return {};
		}

		return decryptConfig(config, dek);
	};

	const updateConfig = async (updates: Record<string, string | null>) => {
		const dek = await getDecryptedDek();
		const currentConfig = await getDecryptedConfig();

		// Apply updates (null removes the key)
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

	return {
		getDEK: getDecryptedDek,

		issueNewDEK: async () => {
			const integration = await ctx.getIntegration();
			const newDek = generateDEK();

			// If there's an existing DEK, re-encrypt config; otherwise start fresh
			let newConfig: Record<string, string> = {};
			if (integration.dek) {
				const oldDek = await decryptDEK(integration.dek, ctx.kek);
				const config = integration.config as Record<string, string>;
				if (config && Object.keys(config).length > 0) {
					newConfig = reEncryptConfig(config, oldDek, newDek);
				}
			}

			// Encrypt new DEK with KEK
			const encryptedNewDek = await encryptDEK(newDek, ctx.kek);

			await ctx.updateIntegration({
				config: newConfig,
				dek: encryptedNewDek,
			});

			// Update cache
			cachedDek = newDek;
			return newDek;
		},

		getClientId: async () => {
			const config = await getDecryptedConfig();
			return config.client_id || null;
		},

		setClientId: async (clientId: string) => {
			await updateConfig({ client_id: clientId });
		},

		getClientSecret: async () => {
			const config = await getDecryptedConfig();
			return config.client_secret || null;
		},

		setClientSecret: async (clientSecret: string) => {
			await updateConfig({ client_secret: clientSecret });
		},

		getRedirectUrl: async () => {
			const config = await getDecryptedConfig();
			return config.redirect_url ?? null;
		},

		setRedirectUrl: async (redirectUrl: string | null) => {
			await updateConfig({ redirect_url: redirectUrl });
		},
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Account-Level OAuth2 Key Manager
// ─────────────────────────────────────────────────────────────────────────────

export function createOAuth2AccountKeyManager(
	ctx: AccountKeyContext,
): OAuth2AccountKeyManager {
	let cachedDek: string | null = null;
	let cachedIntegrationDek: string | null = null;

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

	const getDecryptedIntegrationDek = async (): Promise<string> => {
		if (cachedIntegrationDek) return cachedIntegrationDek;

		const integration = await ctx.getIntegration();
		if (!integration.dek) {
			throw new Error(
				`No DEK found for integration "${ctx.integrationName}". Initialize the integration first.`,
			);
		}

		cachedIntegrationDek = await decryptDEK(integration.dek, ctx.kek);
		return cachedIntegrationDek;
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

	const getDecryptedIntegrationConfig = async () => {
		const integration = await ctx.getIntegration();
		const dek = await getDecryptedIntegrationDek();
		const config = integration.config as Record<string, string>;

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

		getAccessToken: async () => {
			const config = await getDecryptedConfig();

			return config.access_token || null;
		},

		setAccessToken: async (accessToken: string) => {
			await updateConfig({ access_token: accessToken });
		},

		getRefreshToken: async () => {
			const config = await getDecryptedConfig();
			return config.refresh_token || null;
		},

		setRefreshToken: async (refreshToken: string) => {
			await updateConfig({ refresh_token: refreshToken });
		},

		getExpiresAt: async () => {
			const config = await getDecryptedConfig();
			return config.expires_at ? Number(config.expires_at) : null;
		},

		setExpiresAt: async (expiresAt: number | null) => {
			await updateConfig({
				expires_at: expiresAt !== null ? String(expiresAt) : null,
			});
		},

		getScope: async () => {
			const config = await getDecryptedConfig();
			return config.scope ?? null;
		},

		setScope: async (scope: string | null) => {
			await updateConfig({ scope });
		},

		getIntegrationCredentials:
			async (): Promise<OAuth2IntegrationCredentials> => {
				const config = await getDecryptedIntegrationConfig();

				return {
					clientId: config.client_id || null,
					clientSecret: config.client_secret || null,
					redirectUrl: config.redirect_url ?? null,
				};
			},
	};
}
