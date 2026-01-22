import type { CorsairErrorHandler } from '../errors';
import { handleCorsairError } from '../errors/handler';
import type { EndpointHooks } from '../plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks if a value is an endpoint/function (has function signature).
 * @param value - The value to check
 * @returns True if the value is a function
 */
export function isEndpoint(value: unknown): value is Function {
	return typeof value === 'function';
}

/**
 * Recursively binds endpoints in a tree structure with context and hooks.
 * Handles both flat (key -> fn) and nested (key -> { key -> fn }) structures.
 * @param endpoints - The endpoint tree to bind
 * @param hooks - Optional hooks to apply to endpoint handlers
 * @param ctx - The context to bind to endpoint handlers
 * @param tree - The output tree to populate with bound endpoints
 * @param pluginId - The ID of the plugin for error context
 * @param errorHandler - The error handler for this plugin
 * @param currentPath - The current path for tracking nested endpoint operations
 */
export function bindEndpointsRecursively({
	endpoints,
	hooks,
	ctx,
	tree,
	pluginId,
	errorHandlers,
	currentPath = [],
}: {
	endpoints: Record<string, unknown>;
	hooks: Record<string, unknown> | undefined;
	ctx: Record<string, unknown>;
	tree: Record<string, unknown>;
	pluginId: string;
	errorHandlers: CorsairErrorHandler;
	currentPath: string[];
}): void {
	for (const [key, value] of Object.entries(endpoints)) {
		// we have to retype this now because it's nested webhooks
		const nodeHooks = hooks?.[key] as Record<string, unknown> | undefined;

		if (isEndpoint(value)) {
			// it's an endpoint function - bind it with context and hooks
			const endpointHooks = nodeHooks as EndpointHooks | undefined;

			const operationPath = [...currentPath, key].join('.');

			const boundFn = (args: unknown) => {
				const call = async (
					attemptNumber: number,
					callCtx: Record<string, unknown>,
					callArgs: unknown,
				) => {
					try {
						return await value(callCtx, callArgs);
					} catch (error) {
						if (error instanceof Error) {
							const retryStrategy = await handleCorsairError(
								error,
								pluginId,
								operationPath,
								typeof callArgs === 'object' && callArgs !== null
									? (callArgs as Record<string, unknown>)
									: { args: callArgs },
								errorHandlers,
							);

							if (attemptNumber < (retryStrategy.maxRetries || 0)) {
								const newAttempt = attemptNumber + 1;

								console.log(
									`Retrying (${newAttempt} / ${retryStrategy.maxRetries})...`,
								);

								let delayMs: number;
								switch (retryStrategy.retryStrategy) {
									case 'exponential_backoff':
										delayMs = Math.pow(2, newAttempt - 1) * 1000;
										break;
									case 'exponential_backoff_jitter':
										const baseDelay = Math.pow(2, newAttempt - 1) * 1000;
										const jitter = (Math.random() - 0.5) * 1000; // ±0.5s
										delayMs = Math.max(0, baseDelay + jitter);
										break;
									case 'linear_1s':
										delayMs = 1000;
										break;
									case 'linear_2s':
										delayMs = 2000;
										break;
									case 'linear_3s':
										delayMs = 3000;
										break;
									case 'linear_4s':
										delayMs = 4000;
										break;
									default:
										break;
								}

								await new Promise((resolve) => setTimeout(resolve, delayMs));
								await call(newAttempt, callCtx, callArgs);

								console.log(
									`[corsair:${pluginId}:${operationPath}] Retry strategy:`,
									retryStrategy,
								);
							}
						}
						throw error;
					}
				};

				if (!endpointHooks?.before && !endpointHooks?.after) {
					return call(0, ctx, args);
				}

				return (async () => {
					const { ctx: updatedCtx, args: updatedArgs } = endpointHooks.before
						? await endpointHooks.before(ctx, args)
						: { ctx, args };
					const res = await call(0, updatedCtx, updatedArgs);
					await endpointHooks.after?.(updatedCtx, res);
					return res;
				})();
			};

			tree[key] = boundFn;
		} else if (value && typeof value === 'object') {
			// it's a nested object - recurse into it
			const nestedTree: Record<string, unknown> = {};

			bindEndpointsRecursively({
				endpoints: value as Record<string, unknown>,
				hooks: nodeHooks as Record<string, unknown> | undefined,
				ctx,
				tree: nestedTree,
				pluginId,
				errorHandlers,
				currentPath: [...currentPath, key],
			});

			tree[key] = nestedTree;
		}
	}
}
