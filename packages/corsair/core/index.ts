import type { CorsairClient, CorsairTenantWrapper } from './client';
import { buildCorsairClient } from './client';
import type { CorsairIntegration, CorsairPlugin } from './plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Main Corsair Factory Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a Corsair integration with multi-tenancy enabled.
 * Returns a wrapper with a `withTenant()` method to scope operations to specific tenants.
 * @param config - Configuration with plugins, database, and multiTenancy: true
 * @returns A tenant wrapper with `withTenant(tenantId)` method
 */
export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins> & { multiTenancy: true },
): CorsairTenantWrapper<Plugins>;

/**
 * Creates a Corsair integration without multi-tenancy.
 * Returns a direct client instance.
 * @param config - Configuration with plugins and optional database
 * @returns A Corsair client instance
 */
export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins> & { multiTenancy?: false | undefined },
): CorsairClient<Plugins>;

/**
 * Main factory function that creates a Corsair integration.
 * Can return either a direct client or a multi-tenant wrapper depending on configuration.
 * @param config - Configuration object with plugins, database, and optional multi-tenancy
 * @returns Either a direct client or a tenant wrapper
 */
export function createCorsair<const Plugins extends readonly CorsairPlugin[]>(
	config: CorsairIntegration<Plugins>,
): CorsairClient<Plugins> | CorsairTenantWrapper<Plugins> {
	if (config.multiTenancy) {
		return {
			withTenant: (tenantId: string) => {
				if (!tenantId) {
					throw new Error(
						'corsair.withTenant(tenantId): tenantId must be a non-empty string',
					);
				}
				return buildCorsairClient(config.plugins, config.database, tenantId);
			},
		};
	}

	return buildCorsairClient(config.plugins, config.database, undefined);
}

// ─────────────────────────────────────────────────────────────────────────────
// Re-exports
// ─────────────────────────────────────────────────────────────────────────────

// Core types
export type { CorsairClient, CorsairTenantWrapper } from './client';
// Constants
export type { AllProviders, AuthTypes, BaseProviders } from './constants';

// Endpoint types
export type {
	BindEndpoints,
	BoundEndpointFn,
	BoundEndpointTree,
	CorsairContext,
	CorsairEndpoint,
	EndpointTree,
} from './endpoints';
// Plugin types
export type {
	CorsairIntegration,
	CorsairPlugin,
	CorsairPluginContext,
} from './plugins';

// Utility types
export type { Bivariant, UnionToIntersection } from './utils';
// Webhook types
export type {
	BindWebhooks,
	BoundWebhook,
	BoundWebhookTree,
	CorsairWebhook,
	CorsairWebhookHandler,
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
	WebhookResponse,
	WebhookTree,
} from './webhooks';
