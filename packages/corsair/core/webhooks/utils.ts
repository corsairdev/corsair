import type { BoundWebhook } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks if a value is a webhook object with match and handler properties.
 * @param value - The value to check
 * @returns True if the value is a webhook object
 */
export function isWebhook(
	value: unknown,
): value is { match: Function; handler: Function } {
	return (
		value !== null &&
		typeof value === 'object' &&
		'match' in value &&
		'handler' in value &&
		typeof (value as Record<string, unknown>).match === 'function' &&
		typeof (value as Record<string, unknown>).handler === 'function'
	);
}

/**
 * Recursively binds webhooks in a tree structure with context and hooks.
 * Handles both flat (key -> webhook) and nested (key -> { key -> webhook }) structures.
 * Each webhook is an object with { match, handler }.
 * @param webhooks - The webhook tree to bind
 * @param hooks - Optional hooks to apply to webhook handlers
 * @param ctx - The context to bind to webhook handlers
 * @param webhooksTree - The output tree to populate with bound webhooks
 */
export function bindWebhooksRecursively(
	webhooks: Record<string, unknown>,
	hooks: Record<string, unknown> | undefined,
	ctx: Record<string, unknown>,
	webhooksTree: Record<string, unknown>,
): void {
	for (const [key, value] of Object.entries(webhooks)) {
		const nodeHooks = hooks?.[key] as Record<string, unknown> | undefined;

		if (isWebhook(value)) {
			// It's a webhook object with match and handler - bind the handler with context
			const webhookHooks = nodeHooks as
				| { before?: Function; after?: Function }
				| undefined;

			const boundHandler = (...args: unknown[]) => {
				const call = () => value.handler(ctx, ...args);

				if (!webhookHooks?.before && !webhookHooks?.after) {
					return call();
				}

				return (async () => {
					await webhookHooks.before?.(ctx, ...args);
					const res = await call();
					await webhookHooks.after?.(ctx, res);
					return res;
				})();
			};

			// Return the bound webhook with both match and bound handler
			webhooksTree[key] = {
				match: value.match,
				handler: boundHandler,
			} as BoundWebhook;
		} else if (value && typeof value === 'object') {
			// It's a nested object - recurse into it
			const nestedWebhooksTree: Record<string, unknown> = {};

			bindWebhooksRecursively(
				value as Record<string, unknown>,
				nodeHooks as Record<string, unknown> | undefined,
				ctx,
				nestedWebhooksTree,
			);

			webhooksTree[key] = nestedWebhooksTree;
		}
	}
}
