import type { CorsairDatabase } from '../db/kysely/database';
import type { CorsairSingleTenantClient, CorsairTenantWrapper } from './client';
import type { CorsairIntegration, CorsairPlugin } from './plugins';
export declare const CORSAIR_INTERNAL: unique symbol;
export type CorsairInternalConfig = {
    plugins: readonly CorsairPlugin[];
    database: CorsairDatabase | undefined;
    kek: string;
    multiTenancy: boolean;
    approval?: {
        timeout: string;
        onTimeout: 'deny' | 'approve';
    };
};
/**
 * Creates a Corsair integration with multi-tenancy enabled.
 * Returns a wrapper with a `withTenant()` method to scope operations to specific tenants,
 * and a `keys` property for integration-level key management.
 * @param config - Configuration with plugins, database, and multiTenancy: true
 * @returns A tenant wrapper with `withTenant(tenantId)` method and integration-level `keys`
 */
export declare function createCorsair<const Plugins extends readonly CorsairPlugin[]>(config: CorsairIntegration<Plugins> & {
    multiTenancy: true;
}): CorsairTenantWrapper<Plugins>;
/**
 * Creates a Corsair integration without multi-tenancy.
 * Returns a direct client instance with both plugin APIs and integration-level keys.
 * @param config - Configuration with plugins and optional database
 * @returns A Corsair client instance with plugin APIs and integration-level `keys`
 */
export declare function createCorsair<const Plugins extends readonly CorsairPlugin[]>(config: CorsairIntegration<Plugins> & {
    multiTenancy?: false | undefined;
}): CorsairSingleTenantClient<Plugins>;
export type { AccountFieldNames, AccountKeyManagerFor, BaseAuthFieldConfig, BaseKeyManager, IntegrationFieldNames, IntegrationKeyManagerFor, OAuth2IntegrationCredentials, PluginAuthConfig, } from './auth';
export { BASE_AUTH_FIELDS, createAccountKeyManager, createIntegrationKeyManager, decryptConfig, decryptDEK, decryptWithDEK, encryptConfig, encryptDEK, encryptWithDEK, generateDEK, initializeAccountDEK, initializeIntegrationDEK, reEncryptConfig, } from './auth';
export type { CorsairClient, CorsairSingleTenantClient, CorsairTenantWrapper, } from './client';
export type { AllProviders, AuthTypes, BaseProviders, PickAuth } from './constants';
export type { BindEndpoints, BoundEndpointFn, BoundEndpointTree, CorsairContext, CorsairEndpoint, EndpointPathsOf, EndpointTree, } from './endpoints';
export type { CorsairErrorHandler, ErrorContext, ErrorHandler, ErrorHandlerAndMatchFunction, ErrorMatcher, RetryStrategies, RetryStrategy, } from './errors';
export type { CorsairInspectMethods, EndpointSchemaResult } from './inspect';
export type { CorsairPermissionsNamespace, EnforcePermissionOptions, EnforcePermissionResult, } from './permissions';
export type { BeforeHookResult, CorsairIntegration, CorsairKeyBuilder, CorsairKeyBuilderBase, CorsairPlugin, OAuthConfig, CorsairPluginContext, EndpointHooks, EndpointMetaEntry, EndpointRiskLevel, KeyBuilderContext, PermissionMode, PermissionPolicy, PluginEndpointMeta, PluginPermissionsConfig, RequiredPluginEndpointMeta, RequiredPluginEndpointSchemas, RequiredPluginWebhookSchemas, WebhookHooks, } from './plugins';
export type { Bivariant, UnionToIntersection } from './utils';
export { logEvent, logEventFromContext } from '../plugins/utils/events';
export type { EventLoggingContext } from '../plugins/utils/events';
export type { BindWebhooks, BoundWebhook, BoundWebhookTree, CorsairWebhook, CorsairWebhookHandler, CorsairWebhookMatcher, RawWebhookRequest, WebhookPathsOf, WebhookRequest, WebhookResponse, WebhookTree, } from './webhooks';
//# sourceMappingURL=index.d.ts.map