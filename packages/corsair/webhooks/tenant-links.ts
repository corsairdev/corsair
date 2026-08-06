import {
	decryptConfig,
	decryptDEK,
	decryptWithDEK,
	encryptConfig,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import type { AuthTypes } from '../core/constants';
import type { WebhookTenantMatch } from '../core/webhooks';
import type { CorsairAccount } from '../db';
import type { CorsairDatabase } from '../db/kysely/database';

const parseConfig = (config: unknown): Record<string, unknown> => {
	if (!config) return {};
	if (typeof config === 'string') {
		try {
			return JSON.parse(config) as Record<string, unknown>;
		} catch {
			return {};
		}
	}
	return config as Record<string, unknown>;
};

export type WebhookTenantLink = WebhookTenantMatch;

type ResolvedAccount = {
	integrationId: string;
	accountId: string;
};

async function resolveAccountForTenant(options: {
	database: CorsairDatabase;
	pluginId: string;
	tenantId: string;
}): Promise<ResolvedAccount> {
	const integration = await options.database.db
		.selectFrom('corsair_integrations')
		.selectAll()
		.where('name', '=', options.pluginId)
		.executeTakeFirst();

	if (!integration) {
		throw new Error(
			`Integration '${options.pluginId}' not found. Run setupCorsair before registering webhook tenant links.`,
		);
	}

	const account = await options.database.db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('tenant_id', '=', options.tenantId)
		.where('integration_id', '=', integration.id)
		.executeTakeFirst();

	if (!account) {
		throw new Error(
			`Account not found for tenant '${options.tenantId}' and integration '${options.pluginId}'.`,
		);
	}

	return {
		integrationId: integration.id,
		accountId: account.id,
	};
}

async function writeEncryptedAccountLinkField(options: {
	database: CorsairDatabase;
	kek: string;
	accountId: string;
	link: WebhookTenantLink;
}): Promise<void> {
	const account = await options.database.db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('id', '=', options.accountId)
		.executeTakeFirst();

	if (!account?.dek) {
		throw new Error(`Account '${options.accountId}' has no DEK.`);
	}

	const dek = await decryptDEK(account.dek, options.kek);
	const storedConfig = parseConfig(account.config) as Record<string, string>;
	let decryptedConfig: Record<string, string> = {};

	if (Object.keys(storedConfig).length > 0) {
		decryptedConfig = decryptConfig(storedConfig, dek);
	}

	decryptedConfig[options.link.linkType] = options.link.externalId;
	const encryptedConfig = encryptConfig(decryptedConfig, dek);

	await options.database.db
		.updateTable('corsair_accounts')
		.set({
			config: encryptedConfig,
			updated_at: new Date(),
		})
		.where('id', '=', account.id)
		.execute();
}

export async function setWebhookTenantLink(options: {
	database: CorsairDatabase;
	kek: string;
	pluginId: string;
	tenantId: string;
	link: WebhookTenantLink;
	authType?: AuthTypes;
	extraAccountFields?: readonly string[];
}): Promise<void> {
	const {
		database,
		kek,
		pluginId,
		tenantId,
		link,
		authType,
		extraAccountFields = [],
	} = options;

	const { accountId } = await resolveAccountForTenant({
		database,
		pluginId,
		tenantId,
	});

	let wroteViaKeyManager = false;

	if (authType) {
		const accountKeyManager = createAccountKeyManager({
			authType,
			integrationName: pluginId,
			tenantId,
			kek,
			database,
			extraAccountFields,
		});
		const setterName = `set_${link.linkType}`;
		const setter = (accountKeyManager as Record<string, unknown>)[setterName];
		if (typeof setter === 'function') {
			await (setter as (value: string) => Promise<void>)(link.externalId);
			wroteViaKeyManager = true;
		}
	}

	if (!wroteViaKeyManager) {
		await writeEncryptedAccountLinkField({
			database,
			kek,
			accountId,
			link,
		});
	}
}

export type ResolveAccountFromWebhookLinkInput = {
	database: CorsairDatabase;
	kek: string;
	pluginId: string;
	linkType: string;
	externalId: string;
};

/**
 * Resolves the matching corsair_accounts row for a webhook tenant link.
 *
 * Runs one SQL query scoped to the plugin, then decrypts only the requested
 * link field per account using the account DEK and KEK.
 */
export async function resolveAccountFromWebhookLink(
	options: ResolveAccountFromWebhookLinkInput,
): Promise<CorsairAccount | null> {
	const { database, kek, pluginId, linkType, externalId } = options;

	const accounts = await database.db
		.selectFrom('corsair_accounts as accounts')
		.innerJoin(
			'corsair_integrations as integrations',
			'integrations.id',
			'accounts.integration_id',
		)
		.selectAll('accounts')
		.where('integrations.name', '=', pluginId)
		.execute();

	for (const account of accounts) {
		if (!account.dek) continue;

		try {
			const dek = await decryptDEK(account.dek, kek);
			const storedConfig = parseConfig(account.config) as Record<
				string,
				string
			>;
			const encryptedValue = storedConfig[linkType];
			if (!encryptedValue) continue;

			const decryptedValue = decryptWithDEK(encryptedValue, dek);
			if (decryptedValue === externalId) {
				return account;
			}
		} catch {
			continue;
		}
	}

	return null;
}

export async function resolveTenantIdFromWebhookLink(options: {
	database: CorsairDatabase;
	kek: string;
	pluginId: string;
	linkType: string;
	externalId: string;
}): Promise<string | null> {
	const account = await resolveAccountFromWebhookLink(options);
	return account?.tenant_id ?? null;
}

export async function resolveTenantFromWebhookLink(options: {
	database: CorsairDatabase;
	kek: string;
	pluginId: string;
	match: WebhookTenantMatch;
}): Promise<string | null> {
	return resolveTenantIdFromWebhookLink({
		database: options.database,
		kek: options.kek,
		pluginId: options.pluginId,
		linkType: options.match.linkType,
		externalId: options.match.externalId,
	});
}
