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
 * @param boundTree - The output tree to populate with bound endpoints (for internal use)
 * @param apiTree - The output tree to populate with API endpoints (for external use)
 */
export function bindEndpointsRecursively(
	endpoints: Record<string, unknown>,
	hooks: Record<string, unknown> | undefined,
	ctx: Record<string, unknown>,
	boundTree: Record<string, unknown>,
	apiTree: Record<string, unknown>,
): void {
	for (const [key, value] of Object.entries(endpoints)) {
		const nodeHooks = hooks?.[key] as Record<string, unknown> | undefined;

		if (isEndpoint(value)) {
			// It's an endpoint function - bind it with context and hooks
			const endpointHooks = nodeHooks as
				| { before?: Function; after?: Function }
				| undefined;

			const boundFn = (...args: unknown[]) => {
				const call = () => value(ctx, ...args);

				if (!endpointHooks?.before && !endpointHooks?.after) {
					return call();
				}

				return (async () => {
					await endpointHooks.before?.(ctx, ...args);
					const res = await call();
					await endpointHooks.after?.(ctx, res);
					return res;
				})();
			};

			boundTree[key] = boundFn;
			apiTree[key] = boundFn;
		} else if (value && typeof value === 'object') {
			// It's a nested object - recurse into it
			const nestedBoundTree: Record<string, unknown> = {};
			const nestedApiTree: Record<string, unknown> = {};

			bindEndpointsRecursively(
				value as Record<string, unknown>,
				nodeHooks as Record<string, unknown> | undefined,
				ctx,
				nestedBoundTree,
				nestedApiTree,
			);

			boundTree[key] = nestedBoundTree;
			apiTree[key] = nestedApiTree;
		}
	}
}
