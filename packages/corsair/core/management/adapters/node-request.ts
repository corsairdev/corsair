// ─────────────────────────────────────────────────────────────────────────────
// Shared Node → fetch Request bridge.
//
// Express, raw node:http, and Fastify all speak Node's IncomingMessage rather
// than the Fetch API. This module turns one into a Web `Request` while keeping
// the body BYTE-VERBATIM — Hub signs delivery POSTs with an HMAC over the exact
// bytes it sent (hub/signing/envelope.ts), so any re-serialization or dropped
// body flips the check to "Invalid tunnel signature".
//
// Types are structural so corsair carries no `@types/express` / `fastify` /
// `node:http` peer deps.
// ─────────────────────────────────────────────────────────────────────────────

import {
	bodyTooLargeError,
	resolveBodyStallTimeoutMs,
	resolveMaxBodyBytes,
	withBodyStallTimeout,
} from '../body-limit';

export type NodeLikeRequest = {
	method?: string;
	url?: string;
	originalUrl?: string;
	headers: Record<string, string | string[] | undefined>;
	body?: unknown;
	/**
	 * Host-captured raw request bytes — the ecosystem convention for webhook
	 * signature verification (NestJS `rawBody: true`, discord-interactions,
	 * `express.json({ verify })` captures, `fastify-raw-body`). Preferred
	 * verbatim over every other source, including a parsed body.
	 */
	rawBody?: unknown;
	protocol?: string;
	get?: (name: string) => string | undefined;
	/** IncomingMessage.resume — used to discard an aborted upload's remainder. */
	resume?: () => void;
	/**
	 * IncomingMessage consumption probes: true once the stream has been read to
	 * completion by SOMEONE — the Fastify guard uses this to tell "parser ate
	 * the bytes" apart from "stream still drainable".
	 */
	readableEnded?: boolean;
	complete?: boolean;
	// IncomingMessage is an async-iterable of Buffer chunks when no parser ran.
	[Symbol.asyncIterator]?: () => AsyncIterator<unknown>;
};

export type NodeLikeResponse = {
	status?: (code: number) => unknown;
	statusCode?: number;
	setHeader: (name: string, value: string | string[]) => void;
	end?: (body?: string | Buffer) => void;
	send?: (body: string | Buffer) => void;
	/** ServerResponse.headersSent — callers must not write headers after the stream opened. */
	headersSent?: boolean;
};

export type NodeRequestBridgeOptions = {
	/**
	 * Upper bound applied to EVERY body this bridge forwards — drained raw
	 * streams and host-captured buffers alike (registerCorsairRawBodyParser,
	 * express.raw(), NestJS rawBody). Defaults to DEFAULT_MAX_BODY_BYTES.
	 */
	maxBodyBytes?: number;
	/**
	 * Max idle gap between chunks while draining a raw stream. Hosts without
	 * their own request deadline (Fastify ships `requestTimeout: 0`) would
	 * otherwise let a trickling sub-cap upload pin the connection forever.
	 * Between-chunks like nginx client_body_timeout; 0 disables; defaults to
	 * DEFAULT_BODY_STALL_TIMEOUT_MS.
	 */
	bodyStallTimeoutMs?: number;
};

function headerValue(req: NodeLikeRequest, name: string): string | undefined {
	if (req.get) return req.get(name);
	const v = req.headers[name] ?? req.headers[name.toLowerCase()];
	return Array.isArray(v) ? v[0] : v;
}

// The fetch globals resolve differently per build context: downstream package
// builds pull them from @types/node, which has no global `BodyInit` NAME even
// though `Request` itself exists there. Deriving the body union structurally
// from the Request constructor compiles everywhere the adapter does.
type FetchRequestBody = Exclude<
	NonNullable<ConstructorParameters<typeof Request>[1]>['body'],
	undefined
>;

// The DOM lib types `BodyInit` without a bare Uint8Array member even though
// every fetch implementation accepts one — undici's Request honors the VIEW's
// byteOffset/byteLength (verified against its body-mimicking code), so the
// view itself passes through safely. Assert BodyInit at this single seam
// instead of paying a full-body copy per request.
function bufToBody(view: Uint8Array): FetchRequestBody {
	return view as unknown as FetchRequestBody;
}

// IncomingMessage yields Buffers; strings appear once a text mode was
// negotiated on the stream (setEncoding by a host parser).
function chunkToBuffer(chunk: unknown): Buffer {
	// Fast path: stream chunks are already Buffers — Buffer.from(uint8array)
	// would copy every chunk of every request for nothing.
	if (Buffer.isBuffer(chunk)) return chunk;
	if (chunk instanceof Uint8Array) return Buffer.from(chunk);
	if (typeof chunk === 'string') return Buffer.from(chunk, 'utf8');
	throw new TypeError(
		`corsair adapter: unsupported stream chunk type ${typeof chunk}`,
	);
}

// Drains an un-parsed Node request stream into a single Buffer of the raw
// bytes. Refuses to buffer more than maxBytes — without this cap any client
// that can open the mount path could accumulate unbounded memory before
// routing or signature checks run (the framework parsers we bypass normally
// enforce exactly this limit). Each chunk wait is also raced against the
// stall watchdog: size alone doesn't bound a sender that trickles forever
// just under the cap on hosts with no request deadline of their own.
async function drainRawBody(
	iterate: () => AsyncIterator<unknown>,
	maxBytes: number,
	stallTimeoutMs: number,
): Promise<Buffer> {
	const chunks: Buffer[] = [];
	let total = 0;
	const iterator = iterate();
	try {
		let result = await withBodyStallTimeout(
			() => iterator.next(),
			stallTimeoutMs,
		);
		while (result.done !== true) {
			const chunk = chunkToBuffer(result.value);
			total += chunk.byteLength;
			if (total > maxBytes) throw bodyTooLargeError(maxBytes);
			chunks.push(chunk);
			result = await withBodyStallTimeout(
				() => iterator.next(),
				stallTimeoutMs,
			);
		}
		return Buffer.concat(chunks);
	} catch (err) {
		// Signal early termination so the underlying stream is destroyed rather
		// than left paused mid-upload (the adapters' discardRequestBody covers
		// the response side; this covers the stream side). Fire-and-forget:
		// awaiting return() could hang on exactly the hostile streams this
		// cleanup exists for. The sync guard keeps a misbehaving source's
		// return() from masking the real error with a 500.
		try {
			void Promise.resolve(iterator.return?.()).catch(() => {});
		} catch {
			// Cleanup is hygiene here, not control flow — err below is the answer.
		}
		throw err;
	}
}

// Emitted once per process: a parsed-object body can only be forwarded by
// re-serializing it, which silently breaks Hub's byte-exact HMAC signatures.
let warnedLossyReencode = false;
function warnLossyReencode(): void {
	if (warnedLossyReencode) return;
	warnedLossyReencode = true;
	console.warn(
		'[corsair] A JSON body parser consumed this request before the corsair adapter.',
		'Re-serializing the parsed object is lossy and will likely fail Hub signature',
		'verification ("Invalid tunnel signature"). Fix on the corsair route only:',
		"Express → mount express.raw({ type: 'application/json' }) before the handler,",
		'or capture raw bytes via express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }).',
		'Fastify → call registerCorsairRawBodyParser(app) before listen().',
	);
}

// Resolves the request body to bytes/string for a fetch Request, preferring
// verbatim pass-through over re-serialization. Returns undefined when empty.
async function resolveBody(
	req: NodeLikeRequest,
	opts: NodeRequestBridgeOptions,
): Promise<FetchRequestBody | undefined> {
	const method = (req.method ?? 'GET').toUpperCase();
	if (method === 'GET' || method === 'HEAD') return undefined;
	const maxBytes = resolveMaxBodyBytes(opts.maxBodyBytes);
	const stallTimeoutMs = resolveBodyStallTimeoutMs(opts.bodyStallTimeoutMs);

	let resolved: string | Uint8Array | undefined;

	// Host-captured raw bytes beat everything: verbatim even when a parser ran.
	if (typeof req.rawBody === 'string') {
		resolved = req.rawBody;
	} else if (req.rawBody instanceof Uint8Array) {
		resolved = req.rawBody;
	} else if (req.body !== undefined && req.body !== null) {
		// A parser already consumed the stream.
		if (typeof req.body === 'string') {
			resolved = req.body; // express.text()
		} else if (req.body instanceof Uint8Array) {
			// express.raw() / Fastify buffer parser → Buffer (Uint8Array subclass).
			resolved = req.body;
		} else {
			// A parsed object (e.g. express.json()) — re-serialize (lossy; breaks
			// HMAC). The warn tells the operator how to get the raw bytes instead.
			warnLossyReencode();
			resolved = JSON.stringify(req.body);
		}
	} else {
		// No parser mounted: drain the raw stream ourselves, bytes verbatim.
		const iterate = req[Symbol.asyncIterator];
		if (typeof iterate !== 'function') return undefined;
		const buf = await drainRawBody(iterate.bind(req), maxBytes, stallTimeoutMs);
		if (buf.length > 0) resolved = buf;
	}

	if (resolved === undefined) return undefined;

	// The cap applies no matter WHO buffered the bytes: a host capture that ran
	// first must not become a size-bypass around the documented limit.
	const size =
		typeof resolved === 'string'
			? Buffer.byteLength(resolved, 'utf8')
			: resolved.byteLength;
	if (size > maxBytes) throw bodyTooLargeError(maxBytes);

	return typeof resolved === 'string' ? resolved : bufToBody(resolved);
}

/**
 * Best-effort cleanup after answering an error while request bytes are still
 * in flight (e.g. a 413 thrown mid-drain): resume the stream into flowing mode
 * so the remainder is discarded and the socket can close cleanly — an abandoned
 * paused stream otherwise keeps buffering past the cap, poisons keep-alive
 * connection reuse, and stalls server.close() for the full keep-alive window.
 */
export function discardRequestBody(req: NodeLikeRequest): void {
	req.resume?.();
}

/** Builds a Web `Request` from a Node IncomingMessage-like object, body verbatim. */
export async function nodeRequestToFetchRequest(
	req: NodeLikeRequest,
	opts: NodeRequestBridgeOptions = {},
): Promise<Request> {
	const host = headerValue(req, 'host') ?? 'localhost';
	const proto = req.protocol ?? 'http';
	const path = req.originalUrl ?? req.url ?? '/';
	const url = `${proto}://${host}${path}`;

	const headers = new Headers();
	for (const [k, v] of Object.entries(req.headers)) {
		if (v == null) continue;
		// Hop-by-hop headers describe the TCP connection, not the payload.
		// content-length is excluded too: undici derives it from the attached
		// body, which can differ in length from the original bytes when a host
		// parser forced the lossy re-serialization path.
		if (HOP_BY_HOP_HEADERS.has(k.toLowerCase())) continue;
		if (Array.isArray(v)) for (const vv of v) headers.append(k, vv);
		else headers.set(k, v);
	}

	const init: RequestInit = {
		method: (req.method ?? 'GET').toUpperCase(),
		headers,
	};
	const body = await resolveBody(req, opts);
	if (body !== undefined) {
		init.body = body;
		if (!headers.has('content-type')) {
			headers.set('content-type', 'application/json');
		}
	}
	return new Request(url, init);
}

/** Writes a Web `Response` back onto a Node ServerResponse / Express res. */
export async function writeFetchResponseToNode(
	res: NodeLikeResponse,
	fetchRes: Response,
): Promise<void> {
	if (typeof res.status === 'function') res.status(fetchRes.status);
	else res.statusCode = fetchRes.status;
	// Multiple set-cookie values must land in ONE setHeader call — repeating
	// the call replaces the previous cookie instead of appending.
	const setCookies = fetchRes.headers.getSetCookie();
	fetchRes.headers.forEach((value, key) => {
		if (key !== 'set-cookie') res.setHeader(key, value);
	});
	if (setCookies.length > 0) res.setHeader('set-cookie', setCookies);
	const buf = Buffer.from(await fetchRes.arrayBuffer());
	if (res.send) res.send(buf);
	else res.end?.(buf);
}

// Hop-by-hop headers must not be forwarded onto a synthetic fetch Request
// (RFC 9110 §7.6.1); see the content-length note in the header loop above.
const HOP_BY_HOP_HEADERS = new Set([
	'connection',
	'keep-alive',
	'proxy-authenticate',
	'proxy-authorization',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'content-length',
]);
