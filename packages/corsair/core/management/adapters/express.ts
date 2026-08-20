import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';

// ─────────────────────────────────────────────────────────────────────────────
// Express adapter.
//
// Mount as middleware:
//
//   import express from 'express';
//   import { toExpressHandler } from 'corsair';
//   import { corsair } from './lib/corsair';
//   const app = express();
//   app.use('/api/corsair', toExpressHandler(corsair));
//
// Express's `req.url` is path-only. `req.body` is whatever the upstream body
// parser produced (or `undefined` if none is mounted). We reconstruct a fetch
// Request, dispatch to the vanilla handler, then stream the Response back onto
// Express's `res`.
//
// Body integrity matters: Hub signs its delivery POSTs with an HMAC over the
// EXACT bytes it sent (see hub/signing/envelope.ts). So the adapter must pass
// those bytes through verbatim. It handles, in order of preference:
//   1. no parser  → `req.body` is undefined → we drain the raw stream ourselves
//      (works with zero configuration, the recommended setup).
//   2. `express.text({ type: '*/*' })` → `req.body` is the verbatim string.
//   3. `express.raw({ type: '*/*' })`  → `req.body` is the verbatim Buffer.
//   4. `express.json()` (lossy) → `req.body` is a parsed object; we re-serialize
//      via JSON.stringify. Kept for backward-compat, but re-serialization can
//      break signature verification, so it's the last resort.
//
// Types are declared structurally so we don't carry an `@types/express`
// peer dep on the corsair package.
// ─────────────────────────────────────────────────────────────────────────────

type ExpressLikeRequest = {
	method: string;
	originalUrl: string;
	url: string;
	headers: Record<string, string | string[] | undefined>;
	body?: unknown;
	protocol?: string;
	get?: (name: string) => string | undefined;
	// Node's IncomingMessage is an async-iterable stream of Buffer chunks. Present
	// when no body parser consumed it. Typed loosely to avoid a node types dep.
	[Symbol.asyncIterator]?: () => AsyncIterator<unknown>;
};

type ExpressLikeResponse = {
	status: (code: number) => ExpressLikeResponse;
	setHeader: (name: string, value: string) => void;
	send: (body: string | Buffer) => void;
};

type ExpressLikeNext = (err?: unknown) => void;

export type ExpressHandler = (
	req: ExpressLikeRequest,
	res: ExpressLikeResponse,
	next: ExpressLikeNext,
) => Promise<void>;

// Drains an un-parsed Node request stream into a single Buffer of the raw bytes.
async function drainRawBody(req: ExpressLikeRequest): Promise<Buffer> {
	const chunks: Buffer[] = [];
	for await (const chunk of req as AsyncIterable<unknown>) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
	}
	return Buffer.concat(chunks);
}

// Resolves the request body to bytes/string suitable for a fetch Request,
// preferring verbatim pass-through over any re-serialization. Returns undefined
// when there is no body to send.
async function resolveBody(
	req: ExpressLikeRequest,
): Promise<BodyInit | undefined> {
	if (req.method === 'GET' || req.method === 'HEAD') return undefined;

	// A parser already consumed the stream.
	if (req.body !== undefined) {
		// Verbatim: express.text() → string, express.raw() → Buffer.
		if (typeof req.body === 'string') return req.body;
		if (Buffer.isBuffer(req.body)) return new Uint8Array(req.body);
		// express.json() gave a parsed object — re-serialize (lossy; breaks HMAC).
		return JSON.stringify(req.body);
	}

	// No parser mounted: drain the raw stream ourselves and pass the bytes
	// through verbatim. This is the zero-config path and preserves signatures.
	if (typeof req[Symbol.asyncIterator] !== 'function') return undefined;
	const buf = await drainRawBody(req);
	return buf.length > 0 ? new Uint8Array(buf) : undefined;
}

async function buildFetchRequest(req: ExpressLikeRequest): Promise<Request> {
	const host = req.get?.('host') ?? 'localhost';
	const proto = req.protocol ?? 'http';
	const path = req.originalUrl ?? req.url;
	const url = `${proto}://${host}${path}`;

	const headers = new Headers();
	for (const [k, v] of Object.entries(req.headers)) {
		if (v == null) continue;
		if (Array.isArray(v)) for (const vv of v) headers.append(k, vv);
		else headers.set(k, v);
	}

	const init: RequestInit = { method: req.method, headers };
	const body = await resolveBody(req);
	if (body !== undefined) {
		init.body = body;
		if (!headers.has('content-type')) {
			headers.set('content-type', 'application/json');
		}
	}
	return new Request(url, init);
}

async function writeResponse(
	res: ExpressLikeResponse,
	fetchRes: Response,
): Promise<void> {
	res.status(fetchRes.status);
	fetchRes.headers.forEach((value, key) => res.setHeader(key, value));
	const buf = Buffer.from(await fetchRes.arrayBuffer());
	res.send(buf);
}

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
			const fetchRes = await handler(await buildFetchRequest(req));
			await writeResponse(res, fetchRes);
		} catch (err) {
			next(err);
		}
	};
}
