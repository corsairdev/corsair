/**
 * Base operation utilities for plugin operations
 * Provides helpers for common operation patterns including DB hooks and error handling
 */

import type {
	BaseDatabaseContext,
	BasePluginContext,
	BasePluginResponse,
} from './types';

/**
 * Operation parameters that include config, client, and context
 */
export interface BaseOperationParams<
	TConfig,
	TClient,
	TContext extends BasePluginContext,
> {
	config: TConfig;
	client: TClient;
	ctx: TContext;
}

/**
 * Database hook options for operations
 */
export interface DatabaseHookOptions {
	/**
	 * Table name to save data to
	 */
	tableName: string;
	/**
	 * Transform function to convert API response to database record
	 */
	transform?: (data: unknown) => Record<string, unknown>;
	/**
	 * Whether to ignore database errors (default: true)
	 */
	ignoreErrors?: boolean;
}

/**
 * Execute a database hook after an operation
 * Saves data to the database if the table exists
 */
export async function executeDatabaseHook(
	ctx: BasePluginContext,
	options: DatabaseHookOptions,
	data: unknown,
): Promise<void> {
	const { tableName, transform, ignoreErrors = true } = options;

	const dbTable = ctx.db[tableName as keyof typeof ctx.db];
	if (!dbTable || typeof dbTable.insert !== 'function') {
		return;
	}

	try {
		const record = transform ? transform(data) : (data as Record<string, unknown>);
		await dbTable.insert(record);
	} catch (dbError) {
		if (!ignoreErrors) {
			throw dbError;
		}
		// Log but don't fail the operation if DB insert fails
		console.warn(`Failed to save to database table "${tableName}":`, dbError);
	}
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
	error: unknown,
	defaultMessage = 'Unknown error occurred',
): BasePluginResponse {
	return {
		success: false,
		error: error instanceof Error ? error.message : defaultMessage,
	};
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T extends Record<string, unknown>>(
	data: T,
): BasePluginResponse<T> {
	return {
		success: true,
		data,
	};
}

/**
 * Wrap an operation with standard error handling and optional DB hooks
 */
export async function wrapOperation<
	TConfig,
	TClient,
	TContext extends BasePluginContext,
	TResult extends Record<string, unknown>,
>(
	params: BaseOperationParams<TConfig, TClient, TContext>,
	operation: (
		params: BaseOperationParams<TConfig, TClient, TContext>,
	) => Promise<TResult>,
	dbHook?: DatabaseHookOptions,
): Promise<BasePluginResponse<TResult>> {
	try {
		const result = await operation(params);

		// Execute database hook if provided
		if (dbHook) {
			await executeDatabaseHook(params.ctx, dbHook, result);
		}

		return createSuccessResponse<TResult>(result);
	} catch (error) {
		return createErrorResponse(error) as BasePluginResponse<TResult>;
	}
}

/**
 * Validate that required credentials are present in config
 */
export function validateCredentials(
	config: Record<string, unknown>,
	requiredFields: string[],
	pluginName: string,
): { valid: boolean; error?: string } {
	for (const field of requiredFields) {
		if (!config[field]) {
			return {
				valid: false,
				error: `${pluginName} ${field} not configured. Please add ${field} to corsair.config.ts plugins.${pluginName}.${field}`,
			};
		}
	}
	return { valid: true };
}

/**
 * Base operation result type
 */
export type BaseOperationResult<T extends Record<string, unknown>> =
	BasePluginResponse<T>;

