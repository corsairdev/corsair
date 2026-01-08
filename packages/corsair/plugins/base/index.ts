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

// Export client utilities (BaseAPIError may be used by plugins for error handling)
export { BaseAPIError } from './client';

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

