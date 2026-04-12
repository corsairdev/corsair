import type { CorsairDatabase } from '../../db/database';

// ─────────────────────────────────────────────────────────────────────────────
// Utility Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bivariance hack for function types to ensure proper type inference.
 * @template Args - The function arguments
 * @template R - The function return type
 */
type Bivariant<Args extends unknown[], R> = {
	bivarianceHack(...args: Args): R;
}['bivarianceHack'];

// ─────────────────────────────────────────────────────────────────────────────
// Core Context & Endpoint Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A bound endpoint function - the user-facing API after context is applied.
 * @template Args - The arguments the endpoint accepts
 * @template Res - The response type the endpoint returns
 */
export type BoundEndpointFn<Args = unknown, Res = unknown> = (
	args: Args,
) => Promise<Res>;

/**
 * A tree of bound endpoints (context already applied).
 * This is what the end user interacts with after client initialization.
 */
export type BoundEndpointTree = {
	[key: string]: BoundEndpointFn | BoundEndpointTree;
};

/**
 * The base context object passed to every plugin endpoint/hook.
 * @template Endpoints - The type of bound endpoints available in the context
 */
export type CorsairContext<
	Endpoints extends BoundEndpointTree = BoundEndpointTree,
> = {
	/** The configured Corsair DB adapter (if provided to `createCorsair`) */
	database?: CorsairDatabase;
	/** All bound endpoints for this plugin, allowing endpoints to call each other */
	endpoints: Endpoints;
};

/**
 * An endpoint function definition that takes context + args and returns a promise.
 * @template Ctx - The context type passed to the endpoint
 * @template Args - The arguments the endpoint accepts
 * @template Res - The response type the endpoint returns
 */
export type CorsairEndpoint<
	Ctx extends CorsairContext = CorsairContext,
	Args = unknown,
	Res = unknown,
> = Bivariant<[ctx: Ctx, args: Args], Promise<Res>>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A tree of endpoints that can be nested arbitrarily deep.
 * Supports both flat and nested organization like tRPC routers.
 *
 * @example
 * ```ts
 * // Flat structure
 * endpoints: {
 *   channelsGet: async (ctx, args) => { ... },
 *   channelsList: async (ctx, args) => { ... },
 * }
 *
 * // Nested structure (tRPC-style)
 * endpoints: {
 *   channels: {
 *     get: async (ctx, args) => { ... },
 *     list: async (ctx, args) => { ... },
 *   },
 *   users: {
 *     get: async (ctx, args) => { ... },
 *   },
 * }
 * ```
 */
export type EndpointTree = {
	[key: string]: CorsairEndpoint<any, any, any> | EndpointTree;
};

/**
 * Recursively transforms endpoint definitions to their bound (context-free) signatures.
 * Handles both flat and nested endpoint structures.
 * @template T - The endpoint tree to bind
 */
export type BindEndpoints<T extends EndpointTree> = {
	[K in keyof T]: T[K] extends CorsairEndpoint<any, infer A, infer R>
		? (args: A) => Promise<R>
		: T[K] extends EndpointTree
			? BindEndpoints<T[K]>
			: never;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Path Types (for Permission System)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derives all dot-notation endpoint paths from an EndpointTree as a string literal union.
 * Used to provide compile-time validation for permission overrides and endpoint metadata keys.
 * Passing an invalid path to any config that accepts EndpointPathsOf<T> is a type error.
 *
 * Design note: The constraint on `T` is intentionally loosened to `object` (not `EndpointTree`)
 * on the recursive call because `as const` endpoint trees have specific readonly literal keys —
 * `{ readonly issues: { readonly list: fn } }` — which do NOT satisfy `EndpointTree`'s string
 * index signature (`{ [key: string]: ... }`), even though the values are valid endpoints.
 * If we recurse with `T extends EndpointTree`, TypeScript widens the subtypes and loses the
 * literal keys we need. The outer-facing `PluginEndpointMeta<T extends EndpointTree>` and
 * `PluginPermissionsConfig<T extends EndpointTree>` still enforce the EndpointTree constraint
 * at the call site.
 *
 * Similarly, `T[K] extends Record<string, unknown>` fails for named-property objects without an
 * index signature (a plain `{ list: fn }` does not satisfy `{ [key: string]: unknown }`), so we
 * use `extends object` instead, which all non-primitive values satisfy.
 *
 * @example
 * Given: `{ issues: { list: Endpoint, create: Endpoint }, repos: { list: Endpoint } }`
 * Result: `'issues.list' | 'issues.create' | 'repos.list'`
 *
 * @template T - The endpoint tree to extract paths from (unconstrained to allow recursion through as-const types)
 * @template Prefix - Internal accumulator for the current path prefix (do not supply manually)
 */
export type EndpointPathsOf<T, Prefix extends string = ''> = {
	[K in keyof T & string]: T[K] extends (...args: any[]) => any
		? // Leaf: it's an endpoint function — emit the full dot-notation path
			Prefix extends ''
			? K
			: `${Prefix}.${K}`
		: T[K] extends object
			? // Non-leaf: it's a nested subtree — recurse with the accumulated prefix
				EndpointPathsOf<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>
			: never;
}[keyof T & string];
