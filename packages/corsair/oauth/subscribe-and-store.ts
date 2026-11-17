import type { CorsairInternalConfig, CorsairPlugin } from '../core';
import type { AuthTypes } from '../core/constants';
import { setWebhookTenantLink } from '../webhooks/tenant-links';
import { subscribeAndReport } from './subscribe-report';

/**
 * Arms the provider subscription, then stores the link it returns on the
 * account. Providers mint a new link on every subscribe and webhooks bind by
 * the stored one, so connect must store it too, or a new account's events
 * can't find it until the first renewal. Throws are the caller's.
 */
export async function subscribeAndStoreLink(input: {
	corsair: unknown;
	internal: CorsairInternalConfig;
	plugin: CorsairPlugin;
	tenantId: string;
	keys: unknown;
	authType: AuthTypes;
	accountId?: string;
	subscribe?: typeof subscribeAndReport;
}): Promise<void> {
	const { internal, plugin, authType } = input;
	const doSubscribe = input.subscribe ?? subscribeAndReport;
	const link = await doSubscribe(
		input.corsair,
		plugin,
		input.tenantId,
		input.keys,
	);
	if (!link || !internal.database) return;
	await setWebhookTenantLink({
		database: internal.database,
		kek: internal.kek,
		pluginId: plugin.id,
		tenantId: input.tenantId,
		link,
		authType,
		extraAccountFields: [...(plugin.authConfig?.[authType]?.account ?? [])],
		...(input.accountId && { accountId: input.accountId }),
	});
}
