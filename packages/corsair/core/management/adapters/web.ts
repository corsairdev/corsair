import { errorResponse, ManagementApiError } from '../errors';
import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';
import type { NodeLikeRequest, NodeLikeResponse } from './node-request';
import {
	discardRequestBody,
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

// SvelteKit, Remix, Astro, and TanStack handlers all receive the same shape —
// one shared factory keeps the four wrappers from drifting apart.
type WebRouteArgs = { request: Request };
type WebRouteHandler = (args: WebRouteArgs) => Promise<Response>;

function webRouteHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): WebRouteHandler {
	const handler = managementHandler(corsair, opts);
	return (args) => handler(args.request);
}

// ── SvelteKit ────────────────────────────────────────────────────────────────
// export const { GET, POST, OPTIONS } = toSvelteKitHandler(corsair, { basePath });
// OPTIONS serves the hub browser-delivery CORS preflight (204 + ACAO).

export function toSvelteKitHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): {
	GET: WebRouteHandler;
	POST: WebRouteHandler;
	OPTIONS: WebRouteHandler;
} {
	const route = webRouteHandler(corsair, opts);
	return { GET: route, POST: route, OPTIONS: route };
}

// ── Remix / React Router ──────────────────────────────────────────────────────
// export const { loader, action } = toRemixHandler(corsair, { basePath });
//
// ⚠️ Resource routes expose only loader/action, so the OPTIONS CORS preflight
// has no routable slot here — Remix answers it with 405. Browser-delivery
// mounts that need preflight should use Next/Hono/SvelteKit instead; plain
// server-to-server deliveries are unaffected.

export function toRemixHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): { loader: WebRouteHandler; action: WebRouteHandler } {
	const route = webRouteHandler(corsair, opts);
	return { loader: route, action: route };
}

// ── Astro ─────────────────────────────────────────────────────────────────────
// export const { GET, POST, OPTIONS } = toAstroHandler(corsair, { basePath });
// OPTIONS serves the hub browser-delivery CORS preflight (204 + ACAO).

export function toAstroHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): {
	GET: WebRouteHandler;
	POST: WebRouteHandler;
	OPTIONS: WebRouteHandler;
} {
	const route = webRouteHandler(corsair, opts);
	return { GET: route, POST: route, OPTIONS: route };
}

// ── TanStack Start ────────────────────────────────────────────────────────────
// createServerFileRoute().methods(toTanStackHandler(corsair, { basePath }))
// TanStack server routes call { request } => Response, one fn per method.

export function toTanStackHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): {
	GET: WebRouteHandler;
	POST: WebRouteHandler;
	OPTIONS: WebRouteHandler;
} {
	const route = webRouteHandler(corsair, opts);
	return { GET: route, POST: route, OPTIONS: route };
}

// ── Nuxt / Nitro (h3) ─────────────────────────────────────────────────────────
// export default toNuxtHandler(corsair, { basePath });
// h3 hands the handler an H3Event; its Node request/response live under
// event.node, so we bridge through the shared node adapter to keep the body raw.
//
// ⚠️ Mount corsair EARLY. If earlier middleware consumed the body via h3's
// readBody(event)/readRawBody(event), the underlying stream is already drained
// — this adapter recovers the cached bytes from the event automatically, but a
// mount placed after exotic custom parsers has nothing left to read.

type H3Event = {
	node: { req: NodeLikeRequest; res: NodeLikeResponse };
	/**
	 * h3 caches bodies consumed by earlier middleware on the EVENT, not on
	 * node.req: `_rawBody` holds the untouched text from readRawBody, `_body`
	 * the parsed value from readBody. Without consulting these, any prior
	 * consumer leaves the bridge draining an exhausted stream — an empty body
	 * that fails Hub's signature check with "Invalid tunnel signature".
	 */
	_rawBody?: unknown;
	_body?: unknown;
};
type NuxtEventHandler = (event: H3Event) => Promise<void>;

/**
 * Creates an h3/Nitro event handler that bridges the wrapped Node request to
 * the shared management handler, body byte-verbatim.
 */
export function toNuxtHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): NuxtEventHandler {
	const handler = managementHandler(corsair, opts);
	return async (event) => {
		// A fresh bridge object rather than mutating event.node.req (live
		// framework state), mirroring the Fastify adapter. Host-captured bytes
		// win over h3's cache; both beat re-draining an exhausted stream.
		const nodeReq: NodeLikeRequest = {
			method: event.node.req.method,
			url: event.node.req.url,
			headers: event.node.req.headers,
			protocol: event.node.req.protocol,
			body: event._body,
			rawBody: event.node.req.rawBody ?? event._rawBody,
			resume: event.node.req.resume?.bind(event.node.req),
			[Symbol.asyncIterator]: event.node.req[Symbol.asyncIterator]?.bind(
				event.node.req,
			),
		};

		try {
			const fetchRes = await handler(
				await nodeRequestToFetchRequest(nodeReq, {
					maxBodyBytes: opts?.maxBodyBytes,
				}),
			);
			await writeFetchResponseToNode(event.node.res, fetchRes);
		} catch (err) {
			// Bridge-stage errors (413 payload_too_large, …) get corsair's JSON
			// contract instead of h3's default HTML 500; anything else is
			// rethrown so Nitro's own error handling still runs.
			if (
				err instanceof ManagementApiError &&
				event.node.res.headersSent !== true
			) {
				await writeFetchResponseToNode(event.node.res, errorResponse(err));
				return;
			}
			discardRequestBody(nodeReq);
			throw err;
		}
	};
}

// ── Generic Web / Workers / Bun / Deno ────────────────────────────────────────
// A named alias for callers who just want (Request) => Promise<Response>.
// This IS managementHandler; exported under a friendlier name for fetch runtimes.

/**
 * Creates a generic fetch-style handler `(Request) => Promise<Response>` for
 * runtimes that speak the Web Request/Response API natively.
 */
export function toWebHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): FetchHandler {
	return managementHandler(corsair, opts);
}
