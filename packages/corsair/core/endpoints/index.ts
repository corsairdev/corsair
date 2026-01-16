import type { CorsairDbAdapter } from '../../adapters/types';

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
	[key: string]: BoundEndpointFn<any, any> | BoundEndpointTree;
};

/**
 * The base context object passed to every plugin endpoint/hook.
 * @template Endpoints - The type of bound endpoints available in the context
 */
export type CorsairContext<
	Endpoints extends BoundEndpointTree = BoundEndpointTree,
> = {
	/** The configured Corsair DB adapter (if provided to `createCorsair`) */
	database?: CorsairDbAdapter;
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
