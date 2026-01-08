/**
 * Base types for all Corsair plugins
 * These types provide a foundation for consistent plugin implementations
 */

/**
 * Common credential patterns used across plugins
 */
export type BasePluginCredentials =
	| { type: 'token'; token: string }
	| { type: 'apiKey'; apiKey: string }
	| {
			type: 'oauth';
			accessToken: string;
			refreshToken?: string;
			userId?: string;
	  }
	| { type: 'custom'; [key: string]: unknown };

/**
 * Standardized response format for all plugin operations
 */
export type BasePluginResponse<T extends Record<string, unknown> = Record<string, unknown>> = {
	success: boolean;
	data?: T;
	error?: string;
};

/**
 * Generic database context type for plugin operations
 * Provides typed database access based on the resolved schema
 */
export type BaseDatabaseContext<TSchema extends Record<string, Record<string, string | boolean | number>>> = {
	[K in keyof TSchema]: TSchema[K] extends never
		? never
		: {
				insert: (data: Record<string, unknown>) => Promise<unknown>;
				select: () => Promise<Array<Record<string, unknown>>>;
				update: (data: Record<string, unknown>) => Promise<unknown>;
				delete: () => Promise<unknown>;
			};
};

/**
 * Plugin operation context
 * Includes database access and optional user identification
 */
export type BasePluginContext<
	TSchema extends Record<string, Record<string, string | boolean | number>> = Record<
		string,
		Record<string, string | boolean | number>
	>,
> = {
	db: BaseDatabaseContext<TSchema>;
	userId?: string;
};

/**
 * Base plugin configuration structure
 * Plugins should extend this with their specific config fields
 */
export type BasePluginConfig<
	TSchemaOverride extends Record<string, unknown> = Record<string, unknown>,
> = {
	/**
	 * Schema override configuration
	 * Allows customization of database schema per table
	 */
	schema?: TSchemaOverride;
};

/**
 * Base schema structure
 * Each plugin defines a default schema with table definitions
 */
export type BaseDefaultSchema = Record<
	string,
	Record<string, 'string' | 'boolean' | 'number'>
>;

/**
 * Schema override value type
 * - `true`: Use the default schema for this table
 * - `false`: Skip creating this table
 * - Function: Customize the schema based on the default schema
 */
export type SchemaOverrideValue<
	TTableName extends string,
	TDefaultSchema extends BaseDefaultSchema,
> =
	| boolean
	| ((dbSchema: TDefaultSchema) => Record<string, string | boolean | number>);

/**
 * Schema override configuration
 * Allows users to override the default schema per table
 */
export type BaseSchemaOverride<TDefaultSchema extends BaseDefaultSchema> = {
	[K in keyof TDefaultSchema]?: SchemaOverrideValue<string & K, TDefaultSchema>;
};

/**
 * Resolved schema after applying overrides
 */
export type ResolvedSchema<
	TDefaultSchema extends BaseDefaultSchema,
	TOverride extends BaseSchemaOverride<TDefaultSchema>,
> = {
	[K in keyof TDefaultSchema]: TOverride[K] extends false
		? never
		: TOverride[K] extends true
			? TDefaultSchema[K]
			: TOverride[K] extends (schema: TDefaultSchema) => infer R
				? R extends Record<string, string | boolean | number>
					? R
					: TDefaultSchema[K]
				: TDefaultSchema[K];
};

