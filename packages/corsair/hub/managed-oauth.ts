import { createAccountKeyManager } from '../core';
import { AccountSelectionError, upsertAccount } from '../core/account-lookup';
import {
	getCorsairInternal,
	requireCorsairPlugin,
} from '../core/utils/corsair-instance';
import { subscribeAndReport } from '../oauth/subscribe-report';
import { resolveOAuthWebhookTenantLink } from '../webhooks/resolve-oauth-tenant-link';
import { setWebhookTenantLink } from '../webhooks/tenant-links';
import { ensureCorsairProvisionedForTenant } from './internal/provision';
import {
	registerHubWebhookTenantLink,
	reportPluginConnectionStatus,
} from './report-connection-status';

export type ManagedOAuthDeliveryErrorCode =
	| 'invalid_corsair_instance'
	| 'no_database'
	| 'plugin_not_found'
	| 'no_access_token'
	| AccountSelectionError['code'];

export class ManagedOAuthDeliveryError extends Error {
	readonly code: ManagedOAuthDeliveryErrorCode;

	constructor(code: ManagedOAuthDeliveryErrorCode, message: string) {
		super(message);
		this.name = 'ManagedOAuthDeliveryError';
		this.code = code;
	}
}

export type ProcessManagedOAuthDeliveryOptions = {
	plugin: string;
	tenantId: string;
	accessToken: string;
	refreshToken?: string;
	expiresIn?: number;
	scope?: string;
	authType?: 'managed' | 'oauth_2';
	// Provider token-body identity (Slack team, Notion workspace_id, …) the Hub
	// forwards so the tenant-link resolver can read it. Absent = API-call class.
	providerData?: Record<string, unknown>;
	// Provider account identity; absent = the tenant's default account.
	account?: { id: string; label?: string };
};

export type ProcessManagedOAuthDeliveryResult = {
	plugin: string;
	tenantId: string;
};

// Stores managed OAuth tokens delivered from the hub after a successful connect.
export async function processManagedOAuthDelivery(
	corsair: unknown,
	options: ProcessManagedOAuthDeliveryOptions,
): Promise<ProcessManagedOAuthDeliveryResult> {
	const {
		plugin: pluginId,
		tenantId,
		accessToken,
		refreshToken,
		expiresIn,
		scope,
		authType = 'managed',
		providerData,
	} = options;
	// Delivery payloads are untyped at runtime; a blank id means no account.
	const account =
		typeof options.account?.id === 'string' && options.account.id.trim()
			? options.account
			: undefined;

	if (!accessToken.trim()) {
		throw new ManagedOAuthDeliveryError(
			'no_access_token',
			'Managed OAuth delivery missing access_token',
		);
	}

	const internal = getCorsairInternal(
		corsair,
		() =>
			new ManagedOAuthDeliveryError(
				'invalid_corsair_instance',
				'Invalid corsair instance',
			),
	);

	if (!internal.database) {
		throw new ManagedOAuthDeliveryError(
			'no_database',
			'No database configured on corsair instance',
		);
	}

	const plugin = requireCorsairPlugin(
		internal,
		pluginId,
		(message) => new ManagedOAuthDeliveryError('plugin_not_found', message),
	);

	await ensureCorsairProvisionedForTenant(corsair, tenantId);

	let accountId: string | undefined;
	if (account) {
		try {
			({ accountId } = await upsertAccount({
				database: internal.database,
				kek: internal.kek,
				integrationName: pluginId,
				tenantId,
				identity: account,
				allowMany: internal.multiAccount,
			}));
		} catch (error) {
			if (error instanceof AccountSelectionError) {
				throw new ManagedOAuthDeliveryError(error.code, error.message);
			}
			throw error;
		}
	}

	const accountKm = createAccountKeyManager({
		account: accountId ? { ref: accountId } : undefined,
		authType,
		integrationName: pluginId,
		tenantId,
		kek: internal.kek,
		database: internal.database,
	});

	await accountKm.set_access_token(accessToken);
	if (refreshToken) {
		await accountKm.set_refresh_token(refreshToken);
	}
	if (expiresIn) {
		await accountKm.set_expires_at(
			String(Math.floor(Date.now() / 1000) + expiresIn),
		);
	}
	if (scope) {
		await accountKm.set_scope(scope);
	}

	// Ack the stored token to Hub so the grid and list_connections flip to
	// connected. The webhook-link block below only adds inbound routing —
	// connection status must not depend on it.
	await reportPluginConnectionStatus(corsair, {
		plugin,
		tenantId,
	}).catch(() => {});

	try {
		const tenantLink = await resolveOAuthWebhookTenantLink(
			internal.plugins,
			pluginId,
			{
				access_token: accessToken,
				refresh_token: refreshToken,
				scope,
				...providerData,
			},
		);
		if (tenantLink) {
			try {
				const extraAccountFields = plugin.authConfig?.[authType]?.account ?? [];
				await setWebhookTenantLink({
					database: internal.database,
					kek: internal.kek,
					pluginId,
					tenantId,
					link: tenantLink,
					authType,
					extraAccountFields,
					accountId,
				});
			} catch (error) {
				console.warn(
					`[corsair:managed-oauth] Failed to persist webhook tenant link for '${pluginId}' tenant '${tenantId}':`,
					error,
				);
			}

			// Hub mode: forward the identity so Hub can route inbound webhooks.
			// Fire-and-forget: never block the OAuth delivery on Hub availability.
			if (internal.hub) {
				void registerHubWebhookTenantLink(internal.hub, {
					plugin: pluginId,
					tenantId,
					link: tenantLink,
					authType,
				});
			}
		}
	} catch (error) {
		console.warn(
			`[corsair:managed-oauth] Failed to resolve webhook tenant link for '${pluginId}' tenant '${tenantId}':`,
			error,
		);
	}

	try {
		const link = await subscribeAndReport(corsair, plugin, tenantId, accountKm);
		// Renewal stores the link it gets back; so must connect, or this
		// account's events can't find it until the first renewal.
		if (link) {
			await setWebhookTenantLink({
				database: internal.database,
				kek: internal.kek,
				pluginId,
				tenantId,
				link,
				authType,
				extraAccountFields: plugin.authConfig?.[authType]?.account ?? [],
				accountId,
			});
		}
	} catch (error) {
		console.warn(
			`[corsair:managed-oauth] subscribe failed for '${pluginId}' tenant '${tenantId}':`,
			error,
		);
	}

	return { plugin: pluginId, tenantId };
}
