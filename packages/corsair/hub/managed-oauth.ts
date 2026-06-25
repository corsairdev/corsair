import { createAccountKeyManager } from '../core';
import {
	getCorsairInternal,
	requireCorsairPlugin,
} from '../core/utils/corsair-instance';
import { resolveOAuthWebhookTenantLink } from '../webhooks/resolve-oauth-tenant-link';
import { setWebhookTenantLink } from '../webhooks/tenant-links';
import { ensureCorsairProvisionedForTenant } from './internal/provision';

export type ManagedOAuthDeliveryErrorCode =
	| 'invalid_corsair_instance'
	| 'no_database'
	| 'plugin_not_found'
	| 'no_access_token';

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
	} = options;

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

	const accountKm = createAccountKeyManager({
		authType: 'managed',
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

	try {
		const tenantLink = await resolveOAuthWebhookTenantLink(
			internal.plugins,
			pluginId,
			{
				access_token: accessToken,
				refresh_token: refreshToken,
				scope,
			},
		);
		if (tenantLink) {
			try {
				const extraAccountFields = plugin.authConfig?.managed?.account ?? [];
				await setWebhookTenantLink({
					database: internal.database,
					kek: internal.kek,
					pluginId,
					tenantId,
					link: tenantLink,
					authType: 'managed',
					extraAccountFields,
				});
			} catch (error) {
				console.warn(
					`[corsair:managed-oauth] Failed to persist webhook tenant link for '${pluginId}' tenant '${tenantId}':`,
					error,
				);
			}
		}
	} catch (error) {
		console.warn(
			`[corsair:managed-oauth] Failed to resolve webhook tenant link for '${pluginId}' tenant '${tenantId}':`,
			error,
		);
	}

	return { plugin: pluginId, tenantId };
}
