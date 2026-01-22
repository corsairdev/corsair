import type { WebhookHooks } from '../plugins';

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
export function bindWebhooksRecursively({
	webhooks,
	hooks,
	ctx,
	webhooksTree,
}: {
	webhooks: Record<string, unknown>;
	hooks: Record<string, unknown> | undefined;
	ctx: Record<string, unknown>;
	webhooksTree: Record<string, unknown>;
}): void {
	for (const [key, value] of Object.entries(webhooks)) {
		// we have to retype this now because it's nested webhooks
		const nodeHooks = hooks?.[key] as Record<string, unknown> | undefined;

		if (isWebhook(value)) {
			// it's a webhook object with match and handler - bind the handler with context
			const webhookHooks = nodeHooks as WebhookHooks | undefined;

			const boundHandler = (request: unknown) => {
				const call = (callCtx: Record<string, unknown>, callRequest: unknown) =>
					value.handler(callCtx, callRequest);

				if (!webhookHooks?.before && !webhookHooks?.after) {
					return call(ctx, request);
				}

				return (async () => {
					const { ctx: updatedCtx, args: updatedRequest } = webhookHooks.before
						? await webhookHooks.before(ctx, request)
						: { ctx, args: request };
					const res = await call(updatedCtx, updatedRequest);
					await webhookHooks.after?.(updatedCtx, res);
					return res;
				})();
			};

			// return the bound webhook with both match and bound handler
			webhooksTree[key] = {
				match: value.match,
				handler: boundHandler,
			};
		} else if (value && typeof value === 'object') {
			// it's a nested object - recurse into it
			const nestedWebhooksTree: Record<string, unknown> = {};

			bindWebhooksRecursively({
				webhooks: value as Record<string, unknown>,
				hooks: nodeHooks as Record<string, unknown> | undefined,
				ctx,
				webhooksTree: nestedWebhooksTree,
			});

			webhooksTree[key] = nestedWebhooksTree;
		}
	}
}
