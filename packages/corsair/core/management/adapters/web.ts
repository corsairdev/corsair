import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';
import type { NodeLikeRequest } from './node-request';
import {
	nodeRequestToFetchRequest,
	writeFetchResponseToNode,
} from './node-request';

// ─────────────────────────────────────────────────────────────────────────────
// Web-standard framework adapters.
//
// SvelteKit, Remix, Astro, and TanStack Start all hand their route handlers a
// native Web `Request` and read back a Web `Response` — so each adapter is a
// thin wrapper that pulls `request` out of the framework's args and returns the
// method map that framework expects. The body is never touched, so it stays
// byte-verbatim for Hub's signature check.
//
// Nuxt/Nitro (h3) is the exception: its event wraps a Node request, so that
// adapter routes through the shared node-request bridge.
//
// Structural types only — no `@sveltejs/kit`, `@remix-run/*`, `astro`, `h3`, or
// `@tanstack/*` peer deps.
// ─────────────────────────────────────────────────────────────────────────────

type FetchHandler = (req: Request) => Promise<Response>;

// ── SvelteKit ────────────────────────────────────────────────────────────────
// export const { GET, POST } = toSvelteKitHandler(corsair, { basePath });

type SvelteKitEvent = { request: Request };
type SvelteKitRouteHandler = (event: SvelteKitEvent) => Promise<Response>;

export function toSvelteKitHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): { GET: SvelteKitRouteHandler; POST: SvelteKitRouteHandler } {
	const handler = managementHandler(corsair, opts);
	const route: SvelteKitRouteHandler = (event) => handler(event.request);
	return { GET: route, POST: route };
}

// ── Remix / React Router ──────────────────────────────────────────────────────
// export const { loader, action } = toRemixHandler(corsair, { basePath });

type RemixArgs = { request: Request };
type RemixRouteHandler = (args: RemixArgs) => Promise<Response>;

export function toRemixHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): { loader: RemixRouteHandler; action: RemixRouteHandler } {
	const handler = managementHandler(corsair, opts);
	const route: RemixRouteHandler = (args) => handler(args.request);
	return { loader: route, action: route };
}

// ── Astro ─────────────────────────────────────────────────────────────────────
// export const { GET, POST } = toAstroHandler(corsair, { basePath });

type AstroContext = { request: Request };
type AstroRouteHandler = (ctx: AstroContext) => Promise<Response>;

export function toAstroHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): { GET: AstroRouteHandler; POST: AstroRouteHandler } {
	const handler = managementHandler(corsair, opts);
	const route: AstroRouteHandler = (ctx) => handler(ctx.request);
	return { GET: route, POST: route };
}

// ── TanStack Start ────────────────────────────────────────────────────────────
// createServerFileRoute().methods(toTanStackHandler(corsair, { basePath }))
// TanStack server routes call { request } => Response, one fn per method.

type TanStackArgs = { request: Request };
type TanStackRouteHandler = (args: TanStackArgs) => Promise<Response>;

export function toTanStackHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): { GET: TanStackRouteHandler; POST: TanStackRouteHandler } {
	const handler = managementHandler(corsair, opts);
	const route: TanStackRouteHandler = (args) => handler(args.request);
	return { GET: route, POST: route };
}

// ── Nuxt / Nitro (h3) ─────────────────────────────────────────────────────────
// export default toNuxtHandler(corsair, { basePath });
// h3 hands the handler an H3Event; its Node request/response live under
// event.node, so we bridge through the shared node adapter to keep the body raw.

type H3Event = {
	node: { req: NodeLikeRequest; res: NodeLikeResponseLike };
};
type NodeLikeResponseLike = {
	statusCode?: number;
	setHeader: (name: string, value: string) => void;
	end: (body?: string | Buffer) => void;
};
type NuxtEventHandler = (event: H3Event) => Promise<void>;

export function toNuxtHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): NuxtEventHandler {
	const handler = managementHandler(corsair, opts);
	return async (event) => {
		const fetchRes = await handler(
			await nodeRequestToFetchRequest(event.node.req),
		);
		await writeFetchResponseToNode(event.node.res, fetchRes);
	};
}

// ── Generic Web / Workers / Bun / Deno ────────────────────────────────────────
// A named alias for callers who just want (Request) => Promise<Response>.
// This IS managementHandler; exported under a friendlier name for fetch runtimes.

export function toWebHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): FetchHandler {
	return managementHandler(corsair, opts);
}
