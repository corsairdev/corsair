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

export type NodeLikeRequest = {
	method?: string;
	url?: string;
	originalUrl?: string;
	headers: Record<string, string | string[] | undefined>;
	body?: unknown;
	protocol?: string;
	get?: (name: string) => string | undefined;
	// IncomingMessage is an async-iterable of Buffer chunks when no parser ran.
	[Symbol.asyncIterator]?: () => AsyncIterator<unknown>;
};

export type NodeLikeResponse = {
	status?: (code: number) => unknown;
	statusCode?: number;
	setHeader: (name: string, value: string) => void;
	end?: (body?: string | Buffer) => void;
	send?: (body: string | Buffer) => void;
};

function headerValue(req: NodeLikeRequest, name: string): string | undefined {
	if (req.get) return req.get(name);
	const v = req.headers[name] ?? req.headers[name.toLowerCase()];
	return Array.isArray(v) ? v[0] : v;
}

// This project's DOM lib types `BodyInit` without a bare Uint8Array member even
// though the runtime (and undici's Request) accept it. Copy into a fresh
// ArrayBuffer-backed view and assert BodyInit at this single seam.
function bufToBody(view: Uint8Array): BodyInit {
	const copy = new Uint8Array(view.byteLength);
	copy.set(view);
	return copy.buffer as unknown as BodyInit;
}

// Drains an un-parsed Node request stream into a single Buffer of the raw bytes.
async function drainRawBody(req: NodeLikeRequest): Promise<Buffer> {
	const chunks: Buffer[] = [];
	for await (const chunk of req as AsyncIterable<unknown>) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
	}
	return Buffer.concat(chunks);
}

// Resolves the request body to bytes/string for a fetch Request, preferring
// verbatim pass-through over re-serialization. Returns undefined when empty.
async function resolveBody(
	req: NodeLikeRequest,
): Promise<BodyInit | undefined> {
	const method = (req.method ?? 'GET').toUpperCase();
	if (method === 'GET' || method === 'HEAD') return undefined;

	// A parser already consumed the stream.
	if (req.body !== undefined && req.body !== null) {
		if (typeof req.body === 'string') return req.body; // express.text()
		// express.raw() / fastify buffer parser → Buffer (a Uint8Array subclass).
		if (req.body instanceof Uint8Array) return bufToBody(req.body);
		// A parsed object (e.g. express.json()) — re-serialize (lossy; breaks HMAC).
		return JSON.stringify(req.body);
	}

	// No parser mounted: drain the raw stream ourselves, bytes verbatim.
	if (typeof req[Symbol.asyncIterator] !== 'function') return undefined;
	const buf = await drainRawBody(req);
	return buf.length > 0 ? bufToBody(buf) : undefined;
}

/** Builds a Web `Request` from a Node IncomingMessage-like object, body verbatim. */
export async function nodeRequestToFetchRequest(
	req: NodeLikeRequest,
): Promise<Request> {
	const host = headerValue(req, 'host') ?? 'localhost';
	const proto = req.protocol ?? 'http';
	const path = req.originalUrl ?? req.url ?? '/';
	const url = `${proto}://${host}${path}`;

	const headers = new Headers();
	for (const [k, v] of Object.entries(req.headers)) {
		if (v == null) continue;
		if (Array.isArray(v)) for (const vv of v) headers.append(k, vv);
		else headers.set(k, v);
	}

	const init: RequestInit = {
		method: (req.method ?? 'GET').toUpperCase(),
		headers,
	};
	const body = await resolveBody(req);
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
	fetchRes.headers.forEach((value, key) => res.setHeader(key, value));
	const buf = Buffer.from(await fetchRes.arrayBuffer());
	if (res.send) res.send(buf);
	else res.end?.(buf);
}
