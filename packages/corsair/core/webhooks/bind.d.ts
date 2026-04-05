import type { CorsairKeyBuilderBase } from '../plugins';
/**
 * Checks if a value is a webhook object with match and handler properties.
 * @param value - The value to check
 * @returns True if the value is a webhook object
 */
export declare function isWebhook(value: unknown): value is {
    match: Function;
    handler: Function;
};
/**
 * Recursively binds webhooks in a tree structure with context and hooks.
 * Handles both flat (key -> webhook) and nested (key -> { key -> webhook }) structures.
 * Each webhook is an object with { match, handler }.
 * @param webhooks - The webhook tree to bind
 * @param hooks - Optional hooks to apply to webhook handlers
 * @param ctx - The context to bind to webhook handlers
 * @param webhooksTree - The output tree to populate with bound webhooks
 */
export declare function bindWebhooksRecursively({ webhooks, hooks, ctx, webhooksTree, keyBuilder, }: {
    webhooks: Record<string, unknown>;
    hooks: Record<string, unknown> | undefined;
    ctx: Record<string, unknown>;
    webhooksTree: Record<string, unknown>;
    keyBuilder?: CorsairKeyBuilderBase;
}): void;
//# sourceMappingURL=bind.d.ts.map