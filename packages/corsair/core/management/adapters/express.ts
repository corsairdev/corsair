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
// Express's `req.url` is path-only and `req.body` is already-parsed when
// `express.json()` is mounted upstream. We reconstruct a fetch Request,
// dispatch to the vanilla handler, then stream the Response back onto
// Express's `res`.
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

function buildFetchRequest(req: ExpressLikeRequest): Request {
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

	const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
	const init: RequestInit = { method: req.method, headers };
	if (hasBody && req.body !== undefined) {
		// `express.json()` parsed it; re-serialize.
		init.body =
			typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
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
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): ExpressHandler {
	const handler = managementHandler(corsair, opts);
	return async (req, res, next) => {
		try {
			const fetchRes = await handler(buildFetchRequest(req));
			await writeResponse(res, fetchRes);
		} catch (err) {
			next(err);
		}
	};
}
