import type { ZodTypeAny } from 'zod';
import type { CorsairDatabase } from '../../db/kysely/database';
import type { CorsairPluginSchema, PluginEntityClients } from '../../db/orm';
import type { AccountKeyManagerFor, IntegrationKeyManagerFor, PluginAuthConfig } from '../auth/types';
import type { AuthTypes } from '../constants';
import type { BindEndpoints, EndpointTree } from '../endpoints';
import type { CorsairErrorHandler } from '../errors';
import type { CorsairInspectMethods } from '../inspect';
import type { CorsairPermissionsNamespace } from '../permissions';
import type { CorsairPlugin } from '../plugins';
import type { BindWebhooks, RawWebhookRequest, WebhookTree } from '../webhooks';
/**
 * Extracts typed entity clients from a plugin schema.
 * Each entity type becomes a `PluginEntityClient<DataSchema>`.
 * Entities are nested under `db` to separate them from API endpoints.
 */
export type InferPluginEntities<Schema extends CorsairPluginSchema<Record<string, ZodTypeAny>> | undefined> = Schema extends CorsairPluginSchema<infer Entities> ? {
    db: PluginEntityClients<Entities>;
} : {};
/**
 * Utility type that converts a union to an intersection type.
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
/**
 * Extracts the authType from plugin options.
 * @template Options - The plugin options type
 * @template DefaultAuthType - Optional default auth type to use when authType is optional or not present
 *
 * Priority:
 * 1. If authType is a specific single AuthType (not a union), use that
 * 2. If DefaultAuthType parameter is provided, use that as the fallback
 * 3. Otherwise use the non-nullable union from authType
 * 4. If authType is not in Options at all, fall back to DefaultAuthType
 */
export type ExtractAuthType<Options, DefaultAuthType extends AuthTypes | undefined = undefined> = 'authType' extends keyof Options ? Options['authType'] extends AuthTypes ? Options['authType'] : DefaultAuthType extends AuthTypes ? DefaultAuthType : NonNullable<Options['authType']> extends AuthTypes ? NonNullable<Options['authType']> : never : DefaultAuthType extends AuthTypes ? DefaultAuthType : never;
/**
 * Extracts Options type from plugin's options property.
 */
type InferPluginOptions<P> = P extends {
    options?: infer O;
} ? O : never;
/**
 * Extracts DefaultAuthType from plugin's __defaultAuthType property.
 * Uses NonNullable<D> because the __defaultAuthType property is optional,
 * which causes TypeScript to infer D as `AuthType | undefined`.
 */
type InferDefaultAuthType<P> = P extends {
    __defaultAuthType?: infer D;
} ? NonNullable<D> extends AuthTypes ? NonNullable<D> : undefined : undefined;
/**
 * Extracts the AuthConfig from a plugin's authConfig property.
 */
type InferAuthConfig<P> = P extends {
    authConfig?: infer C;
} ? C extends PluginAuthConfig ? C : undefined : undefined;
/**
 * Infers the complete namespace for a single plugin, including API endpoints,
 * database entities, webhooks, and account-level keys.
 */
type InferPluginNamespace<P extends CorsairPlugin> = P extends CorsairPlugin<infer Id, infer Schema, infer Endpoints, infer Webhooks> ? {
    [K in Id]: (Endpoints extends EndpointTree ? {
        api: BindEndpoints<Endpoints>;
    } : {}) & InferPluginEntities<Schema> & (Webhooks extends WebhookTree ? {
        webhooks: BindWebhooks<Webhooks>;
        /**
         * Synchronously checks if an incoming webhook request is intended for this plugin.
         * Only present if the plugin defines a `pluginWebhookMatcher`.
         * Use this as a first-level filter before checking individual webhook matchers.
         */
        pluginWebhookMatcher?: (request: RawWebhookRequest) => boolean;
    } : {}) & (ExtractAuthType<InferPluginOptions<P>, InferDefaultAuthType<P>> extends AuthTypes ? {
        keys: AccountKeyManagerFor<ExtractAuthType<InferPluginOptions<P>, InferDefaultAuthType<P>>, InferAuthConfig<P>>;
    } : {});
} : never;
/**
 * Infers the integration-level key manager for a single plugin.
 */
type InferIntegrationKeys<P extends CorsairPlugin> = P extends CorsairPlugin<infer Id> ? ExtractAuthType<InferPluginOptions<P>, InferDefaultAuthType<P>> extends AuthTypes ? {
    [K in Id]: IntegrationKeyManagerFor<ExtractAuthType<InferPluginOptions<P>, InferDefaultAuthType<P>>, InferAuthConfig<P>>;
} : never : never;
/**
 * Combines all integration-level keys into a single interface.
 */
type InferAllIntegrationKeys<Plugins extends readonly CorsairPlugin[]> = UnionToIntersection<InferIntegrationKeys<Plugins[number]>>;
/**
 * Combines all plugin namespaces into a single client interface.
 */
type InferPluginNamespaces<Plugins extends readonly CorsairPlugin[]> = UnionToIntersection<InferPluginNamespace<Plugins[number]>>;
/**
 * The main Corsair client type that provides access to all plugin APIs, entities, webhooks, and keys.
 * Also includes list_operations() and get_schema() for agent-facing endpoint discovery.
 */
export type CorsairClient<Plugins extends readonly CorsairPlugin[]> = InferPluginNamespaces<Plugins> & CorsairInspectMethods;
/**
 * Multi-tenant wrapper that provides a `withTenant` method to scope operations to a specific tenant.
 * Also includes integration-level `keys` for managing shared secrets (OAuth2 client credentials, etc.)
 * Inspect methods (list_operations / get_schema) are available at the root — no need to call withTenant().
 */
export type CorsairTenantWrapper<Plugins extends readonly CorsairPlugin[]> = {
    withTenant: (tenantId: string) => CorsairClient<Plugins>;
    /**
     * Integration-level key managers for each plugin.
     * Used to manage secrets shared across all tenants (e.g., OAuth2 client_id, client_secret).
     */
    keys: InferAllIntegrationKeys<Plugins>;
    /**
     * Permission management namespace. Use this to query and transition permission records.
     * Available at the root regardless of multi-tenancy setting.
     */
    permissions: CorsairPermissionsNamespace;
} & CorsairInspectMethods;
/**
 * Single-tenant client that includes both plugin APIs and integration-level keys.
 */
export type CorsairSingleTenantClient<Plugins extends readonly CorsairPlugin[]> = CorsairClient<Plugins> & {
    /**
     * Integration-level key managers for each plugin.
     * Used to manage secrets shared across all tenants (e.g., OAuth2 client_id, client_secret).
     */
    keys: InferAllIntegrationKeys<Plugins>;
    /**
     * Permission management namespace. Use this to query and transition permission records.
     * Available at the root regardless of multi-tenancy setting.
     */
    permissions: CorsairPermissionsNamespace;
};
export type BuildCorsairClientOptions = {
    database: CorsairDatabase | undefined;
    tenantId: string | undefined;
    kek: string | undefined;
    rootErrorHandlers?: CorsairErrorHandler;
    /** Approval timeout from createCorsair({ approval: ... }). Forwarded to the permission guard. */
    approvalConfig?: {
        timeout: string;
        onTimeout: 'deny' | 'approve';
    };
};
/**
 * Builds a Corsair client instance with all plugin APIs, entities, webhooks, and account-level keys bound.
 * @param plugins - Array of plugin definitions to include in the client
 * @param options - Client build options including database, tenantId, and kek
 * @returns A fully configured Corsair client with account-level keys
 */
export declare function buildCorsairClient<const Plugins extends readonly CorsairPlugin[]>(plugins: Plugins, options: BuildCorsairClientOptions): CorsairClient<Plugins>;
/**
 * Builds integration-level key managers for all plugins.
 * These manage secrets shared across all tenants (OAuth2 client credentials, etc.)
 * @param plugins - Array of plugin definitions
 * @param database - Database adapter for storage
 * @param kek - Key Encryption Key for envelope encryption
 * @returns An object with key managers for each plugin
 */
export declare function buildIntegrationKeys<const Plugins extends readonly CorsairPlugin[]>(plugins: Plugins, database: CorsairDatabase, kek: string): InferAllIntegrationKeys<Plugins>;
export {};
//# sourceMappingURL=index.d.ts.map