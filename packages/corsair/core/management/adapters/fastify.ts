import { errorResponse, ManagementApiError } from '../errors';
import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';
import type { NodeLikeRequest } from './node-request';
import {
	discardRequestBody,
	nodeRequestToFetchRequest,
	writeFetchResponseToNode,
} from './node-request';

// ─────────────────────────────────────────────────────────────────────────────
// Fastify adapter.
//
//   import Fastify from 'fastify';
//   import {
//     registerCorsairRawBodyParser,
//     toFastifyHandler,
//   } from 'corsair';
//   const app = Fastify();
//   // REQUIRED: keep the original bytes reachable. Fastify's built-in JSON
//   // parser consumes request.raw BEFORE any handler runs, and re-serializing
//   // its parsed object is lossy — Hub's HMAC check would reject deliveries
//   // with "Invalid tunnel signature".
//   registerCorsairRawBodyParser(app);
//   app.all('/api/corsair/*', toFastifyHandler(corsair, { basePath: '/api/corsair' }));
//   app.all('/api/corsair', toFastifyHandler(corsair, { basePath: '/api/corsair' }));
//
// The adapter prefers `request.rawBody` (verbatim bytes stashed by the parser
// above or by fastify-raw-body) over the parsed `request.body`. The helper
// keeps normal JSON semantics everywhere else: other routes still receive a
// parsed object, so registering it never changes host behavior outside this
// mount. Response is sent through `reply.raw` (the underlying ServerResponse)
// after reply.hijack(), so Fastify never re-encodes the payload.
//
// Structural types only — no `fastify` peer dep.
// ─────────────────────────────────────────────────────────────────────────────

type FastifyLikeRequest = {
	raw: NodeLikeRequest;
	method?: string;
	url?: string;
	headers: Record<string, string | string[] | undefined>;
	protocol?: string;
	/**
	 * Populated by Fastify's content-type parser before the handler runs: with
	 * {@link registerCorsairRawBodyParser} or the default parser it is an
	 * already-parsed value.
	 */
	body?: unknown;
	/**
	 * Verbatim request bytes. Set by {@link registerCorsairRawBodyParser} and
	 * raw-body capture plugins such as fastify-raw-body; preferred over `body`
	 * because Hub's HMAC runs over the exact bytes on the wire.
	 */
	rawBody?: unknown;
};

type FastifyLikeRawReply = {
	statusCode?: number;
	setHeader: (name: string, value: string | string[]) => void;
	end: (body?: string | Buffer) => void;
	/** ServerResponse.headersSent — no further writes are legal once true. */
	headersSent?: boolean;
};

type FastifyLikeReply = {
	raw: FastifyLikeRawReply;
	hijack?: () => void;
};

export type FastifyHandler = (
	request: FastifyLikeRequest,
	reply: FastifyLikeReply,
) => Promise<void>;

function firstHeader(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const v = headers[name];
	return Array.isArray(v) ? v[0] : v;
}

// Fires when a JSON body existed on the wire but neither request.body nor
// request.rawBody was exposed to us AND the underlying stream was fully
// consumed — i.e. a parser ate the bytes and dropped them where we can't reach
// them. Left alone this surfaces as a cryptic "Invalid tunnel signature";
// failing fast turns it into a one-line configuration fix.
function assertReadableJsonBody(request: FastifyLikeRequest): void {
	const method = (request.method ?? 'GET').toUpperCase();
	if (method === 'GET' || method === 'HEAD') return;
	if (request.body !== undefined || request.rawBody !== undefined) return;

	const contentType = firstHeader(request.headers, 'content-type');
	if (!contentType || !contentType.includes('application/json')) return;

	// Stream still has bytes? The bridge will drain it verbatim — nothing is
	// wrong. (Covers parser-less mounts and genuinely empty bodies alike.)
	if (request.raw.readableEnded !== true && request.raw.complete !== true) {
		return;
	}

	throw new Error(
		'corsair: Fastify consumed this JSON body before the corsair adapter could read it. ' +
			'Call registerCorsairRawBodyParser(app) before listen() so the original bytes ' +
			'reach the adapter verbatim (Hub signs deliveries over the exact bytes it sent).',
	);
}

/**
 * Registers JSON parsing on a Fastify instance so signed Hub deliveries reach
 * {@link toFastifyHandler} byte-for-byte. Call once per instance, before
 * `listen()`:
 *
 *   const app = Fastify();
 *   registerCorsairRawBodyParser(app);
 *
 * Fastify content-type parsers are instance-wide (there is no route-scoped
 * registration), so this REPLACES the built-in application/json parser — but
 * it preserves normal JSON semantics everywhere else: every non-corsair route
 * keeps receiving a parsed object in `request.body` exactly as before, while
 * the untouched wire bytes ride along on `request.rawBody` for this adapter.
 * Charset-suffixed content types match too.
 *
 * If the host already customized the parser, skip this helper and expose the
 * original bytes yourself as `request.rawBody` (fastify-raw-body does exactly
 * this); the adapter prefers them over any parsed value.
 */
export function registerCorsairRawBodyParser(app: {
	addContentTypeParser: (
		contentType: string,
		opts: { parseAs: 'buffer' },
		parser: (
			req: { rawBody?: unknown },
			body: Buffer,
			done: (err: Error | null, body?: unknown) => void,
		) => void,
	) => unknown;
}): void {
	app.addContentTypeParser(
		'application/json',
		{ parseAs: 'buffer' },
		(req, body, done) => {
			// Verbatim bytes ride alongside for the corsair bridge; every OTHER
			// route keeps receiving a parsed object, unchanged from built-in
			// behavior. Invalid JSON mirrors the built-in rejection: attaching
			// statusCode makes Fastify answer 400 instead of a 500.
			req.rawBody = body;
			try {
				done(null, JSON.parse(body.toString('utf8')));
			} catch {
				done(
					Object.assign(new Error('Invalid JSON body'), {
						statusCode: 400,
					}),
				);
			}
		},
	);
}

/**
 * Creates a Fastify route handler that forwards requests to the shared
 * management handler over the node bridge, body byte-verbatim. Mount it on
 * every path shape you serve (bare base path + catch-all), and register
 * {@link registerCorsairRawBodyParser} first — see the module header for why.
 */
export function toFastifyHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): FastifyHandler {
	const handler = managementHandler(corsair, opts);
	return async (request, reply) => {
		assertReadableJsonBody(request);

		// A fresh bridge object rather than mutating request.raw: the
		// IncomingMessage is live framework state other hooks may still read,
		// and spreading it would lose Symbol.asyncIterator, which lives on the
		// Readable prototype.
		const nodeReq: NodeLikeRequest = {
			method: request.method ?? request.raw.method,
			url: request.url ?? request.raw.url,
			headers: request.headers,
			protocol: request.protocol,
			body: request.body,
			rawBody: request.rawBody,
			resume: request.raw.resume?.bind(request.raw),
			[Symbol.asyncIterator]: request.raw[Symbol.asyncIterator]?.bind(
				request.raw,
			),
		};

		try {
			const fetchRes = await handler(
				await nodeRequestToFetchRequest(nodeReq, {
					maxBodyBytes: opts?.maxBodyBytes,
				}),
			);
			// Take over the response so Fastify doesn't try to serialize it, then
			// reuse the shared writer — reply.raw satisfies NodeLikeResponse,
			// keeping ONE response-writing seam across express/node/nuxt/fastify.
			reply.hijack?.();
			await writeFetchResponseToNode(reply.raw, fetchRes);
		} catch (err) {
			// Bridge-stage errors (413 payload_too_large, …) get corsair's JSON
			// contract instead of Fastify's default envelope; anything else is
			// rethrown so Fastify's own error handling/logging still runs.
			if (
				err instanceof ManagementApiError &&
				reply.raw.headersSent !== true &&
				reply.hijack
			) {
				reply.hijack();
				await writeFetchResponseToNode(reply.raw, errorResponse(err));
				discardRequestBody(nodeReq);
				return;
			}
			discardRequestBody(nodeReq);
			throw err;
		}
	};
}
