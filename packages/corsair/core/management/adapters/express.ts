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
// Express adapter.
//
// Mount as middleware — no body parser required:
//
//   import express from 'express';
//   import { toExpressHandler } from 'corsair';
//   import { corsair } from './lib/corsair';
//   const app = express();
//   app.use('/api/corsair', toExpressHandler(corsair));
//
// The shared node-request bridge keeps the body byte-verbatim (see there).
// With no parser it drains the raw stream; with express.text()/raw() it passes
// the value through.
//
//  express.json() BEFORE this handler breaks Hub signatures. A global
// `app.use(express.json())` parses the body into a JS object; the original
// bytes are gone (Node streams can't be rewound), so re-serialization is lossy
// and HMAC verification fails with "Invalid tunnel signature" — often only for
// some payloads (whitespace, escaped unicode, big numbers), which makes it a
// nightmare to debug. Fixes, in order of preference (same guidance Stripe and
// Svix give their Express users):
//
//   1. Scope a raw parser to the corsair route only:
//        app.post('/api/corsair', express.raw({ type: 'application/json' }),
//          toExpressHandler(corsair));
//      then register the global parser AFTER the route.
//   2. Or capture the original bytes app-wide:
//        app.use(express.json({
//          verify: (req, _res, buf) => { req.rawBody = buf; },
//        }));
//      The bridge prefers `req.rawBody` verbatim (NestJS `rawBody: true`
//      follows the same convention).
//
//  Do NOT key anything off req._body — body-parser 2.x / Express 5 removed it.
// ─────────────────────────────────────────────────────────────────────────────

type ExpressLikeRequest = NodeLikeRequest & {
	originalUrl: string;
	url: string;
};

type ExpressLikeResponse = {
	status: (code: number) => ExpressLikeResponse;
	setHeader: (name: string, value: string | string[]) => void;
	send: (body: string | Buffer) => void;
	/** ServerResponse.headersSent — set once the response head is flushed. */
	headersSent?: boolean;
};

type ExpressLikeNext = (err?: unknown) => void;

export type ExpressHandler = (
	req: ExpressLikeRequest,
	res: ExpressLikeResponse,
	next: ExpressLikeNext,
) => Promise<void>;

/**
 * Creates an Express middleware that forwards requests to the shared
 * management handler over the node bridge, body byte-verbatim. See the module
 * header before mounting it behind express.json().
 */
export function toExpressHandler(
	// `unknown` matches the managementHandler signature — see the justification
	// there. The handler only reads the CORSAIR_INTERNAL symbol, so the public
	// client shape isn't needed at this seam.
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): ExpressHandler {
	const handler = managementHandler(corsair, opts);
	return async (req, res, next) => {
		try {
			const fetchRes = await handler(
				await nodeRequestToFetchRequest(req, {
					maxBodyBytes: opts?.maxBodyBytes,
					bodyStallTimeoutMs: opts?.bodyStallTimeoutMs,
				}),
			);
			await writeFetchResponseToNode(res, fetchRes);
		} catch (err) {
			// Errors thrown by the bridge itself (e.g. 413 payload_too_large)
			// carry their own HTTP semantics — answer directly instead of relying
			// on the host's default error handler flattening them to text/html.
			if (err instanceof ManagementApiError && res.headersSent !== true) {
				await writeFetchResponseToNode(res, errorResponse(err));
				// The 413 may have aborted mid-upload: discard whatever bytes are
				// still in flight so the socket closes cleanly.
				discardRequestBody(req);
				return;
			}
			// Mirror the Fastify adapter's rethrow path: a non-ManagementApiError
			// may also have aborted mid-drain, so discard the in-flight bytes
			// before handing the stream back to Express.
			discardRequestBody(req);
			next(err);
		}
	};
}
