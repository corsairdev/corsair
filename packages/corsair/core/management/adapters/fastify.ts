import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';
import type { NodeLikeRequest } from './node-request';
import { nodeRequestToFetchRequest } from './node-request';

// ─────────────────────────────────────────────────────────────────────────────
// Fastify adapter.
//
//   import Fastify from 'fastify';
//   import { toFastifyHandler } from 'corsair';
//   const app = Fastify();
//   app.all('/api/corsair/*', toFastifyHandler(corsair, { basePath: '/api/corsair' }));
//   app.all('/api/corsair', toFastifyHandler(corsair, { basePath: '/api/corsair' }));
//
// No content-type parser needed. Fastify's built-in JSON parser would hand us a
// re-serialized (lossy) body, so the adapter reads `request.raw` — the untouched
// Node IncomingMessage — and drains it byte-verbatim via the shared bridge.
// Response is sent through `reply.raw` (the underlying ServerResponse) to avoid
// Fastify re-encoding the payload.
//
// Structural types only — no `fastify` peer dep.
// ─────────────────────────────────────────────────────────────────────────────

type FastifyLikeRequest = {
	raw: NodeLikeRequest;
	method?: string;
	url?: string;
	headers: Record<string, string | string[] | undefined>;
	protocol?: string;
	hostname?: string;
};

type FastifyLikeRawReply = {
	statusCode?: number;
	setHeader: (name: string, value: string) => void;
	end: (body?: string | Buffer) => void;
};

type FastifyLikeReply = {
	raw: FastifyLikeRawReply;
	hijack?: () => void;
};

export type FastifyHandler = (
	request: FastifyLikeRequest,
	reply: FastifyLikeReply,
) => Promise<void>;

export function toFastifyHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): FastifyHandler {
	const handler = managementHandler(corsair, opts);
	return async (request, reply) => {
		// `request.raw` is the Node IncomingMessage but Fastify strips method/url/
		// headers off it, so seed them from the Fastify request.
		const raw: NodeLikeRequest = request.raw;
		raw.method = request.method ?? raw.method;
		raw.url = request.url ?? raw.url;
		raw.headers = request.headers;
		raw.protocol = request.protocol;

		const fetchRes = await handler(await nodeRequestToFetchRequest(raw));

		// Take over the response so Fastify doesn't try to serialize it.
		reply.hijack?.();
		reply.raw.statusCode = fetchRes.status;
		fetchRes.headers.forEach((value, key) => reply.raw.setHeader(key, value));
		reply.raw.end(Buffer.from(await fetchRes.arrayBuffer()));
	};
}
