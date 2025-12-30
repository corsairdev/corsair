/**
 * Base plugin system for Corsair
 * Provides common types, utilities, and abstractions for building plugins
 */

// Export all base types
export type {
	BaseDefaultSchema,
	BasePluginConfig,
	BasePluginContext,
	BasePluginCredentials,
	BasePluginResponse,
	BaseSchemaOverride,
	BaseDatabaseContext,
	ResolvedSchema,
	SchemaOverrideValue,
} from './types';

// Export schema utilities
export { createDatabaseContext, resolveSchema } from './schema';

// Export client utilities
export { BaseAPIError, createBaseHTTPClient, createBaseGraphQLClient } from './client';
export type {
	BaseAPIClient,
	BaseHTTPConfig,
	RequestOptions,
} from './client';

// Export operation utilities
export {
	createErrorResponse,
	createSuccessResponse,
	executeDatabaseHook,
	validateCredentials,
	wrapOperation,
	type BaseOperationParams,
	type BaseOperationResult,
	type DatabaseHookOptions,
} from './operations';

// Export webhook utilities
export {
	BaseWebhookHandler,
	SignatureVerifiers,
	type BaseEventHandler,
	type BaseHandleWebhookResult,
	type BaseWebhookHandlerConfig,
	type BaseWebhookHandlerOptions,
	type BaseWebhookHeaders,
	type EventNameExtractor,
	type PayloadParser,
	type SignatureVerifier,
} from './webhooks';

// Import utilities needed for factory function
import { createDatabaseContext, resolveSchema } from './schema';
import type {
	BaseDefaultSchema,
	BasePluginConfig,
	BaseSchemaOverride,
	BaseDatabaseContext,
	ResolvedSchema,
} from './types';

/**
 * Base plugin factory configuration
 * This provides a common structure for plugin initialization
 */
export interface BasePluginFactoryConfig<
	TConfig,
	TDefaultSchema extends BaseDefaultSchema,
	TSchemaOverride extends BaseSchemaOverride<TDefaultSchema>,
	TClient,
> {
	/**
	 * Plugin configuration
	 */
	config: TConfig & BasePluginConfig<TSchemaOverride>;
	/**
	 * Default schema for the plugin
	 */
	defaultSchema: TDefaultSchema;
	/**
	 * Database instance
	 */
	db: unknown;
	/**
	 * Client factory function
	 */
	createClient: (config: TConfig) => TClient;
}

/**
 * Base plugin factory result
 */
export interface BasePluginFactoryResult<
	TClient,
	TDatabaseContext,
	TOperations extends Record<string, (...args: unknown[]) => Promise<unknown>>,
> {
	/**
	 * API client instance
	 */
	client: TClient;
	/**
	 * Database context
	 */
	db: TDatabaseContext;
	/**
	 * Plugin operations
	 */
	operations: TOperations;
}

/**
 * Initialize a plugin with unified flow
 * This is the main entry point for plugin initialization
 * It handles schema resolution, database context creation, and client initialization
 */
export function initializePlugin<
	TConfig extends BasePluginConfig<TSchemaOverride>,
	TDefaultSchema extends BaseDefaultSchema,
	TSchemaOverride extends BaseSchemaOverride<TDefaultSchema>,
	TClient,
>(
	config: TConfig,
	defaultSchema: TDefaultSchema,
	db: unknown,
	createClient: (config: TConfig) => TClient,
): {
	config: TConfig;
	client: TClient;
	db: BaseDatabaseContext<ResolvedSchema<TDefaultSchema, TSchemaOverride>>;
	ctx: {
		db: BaseDatabaseContext<ResolvedSchema<TDefaultSchema, TSchemaOverride>>;
		userId?: string;
	};
} {
	// Resolve schema
	const resolvedSchema = resolveSchema(defaultSchema, config.schema);

	// Create database context
	const dbContext = createDatabaseContext(
		resolvedSchema,
		db,
	) as BaseDatabaseContext<ResolvedSchema<TDefaultSchema, TSchemaOverride>>;

	// Create client
	const client = createClient(config);

	// Return initialized plugin structure
	return {
		config,
		client,
		db: dbContext,
		ctx: {
			db: dbContext,
			userId: undefined,
		},
	};
}

/**
 * Create a base plugin instance
 * This is a helper function that standardizes plugin initialization
 * @deprecated Use initializePlugin instead for a more unified flow
 */
export function createBasePlugin<
	TConfig,
	TDefaultSchema extends BaseDefaultSchema,
	TSchemaOverride extends BaseSchemaOverride<TDefaultSchema>,
	TClient,
	TDatabaseContext,
	TOperations extends Record<string, (...args: unknown[]) => Promise<unknown>>,
>(
	factoryConfig: BasePluginFactoryConfig<
		TConfig,
		TDefaultSchema,
		TSchemaOverride,
		TClient
	>,
	createOperations: (params: {
		config: TConfig;
		client: TClient;
		db: TDatabaseContext;
	}) => TOperations,
): BasePluginFactoryResult<TClient, TDatabaseContext, TOperations> {
	// Resolve schema
	const resolvedSchema = resolveSchema(
		factoryConfig.defaultSchema,
		factoryConfig.config.schema,
	);

	// Create database context
	const db = createDatabaseContext(
		resolvedSchema,
		factoryConfig.db,
	) as TDatabaseContext;

	// Create client
	const client = factoryConfig.createClient(factoryConfig.config);

	// Create operations
	const operations = createOperations({
		config: factoryConfig.config,
		client,
		db,
	});

	return {
		client,
		db,
		operations,
	};
}

