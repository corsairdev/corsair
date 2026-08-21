import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';
import type { NodeLikeRequest } from './node-request';
import {
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
// The shared node-request bridge keeps the body byte-verbatim (see there). With
// no parser it drains the raw stream; with express.text()/raw() it passes the
// value through; express.json() re-serializes (lossy, last resort).
// ─────────────────────────────────────────────────────────────────────────────

type ExpressLikeRequest = NodeLikeRequest & {
	originalUrl: string;
	url: string;
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
			const fetchRes = await handler(await nodeRequestToFetchRequest(req));
			await writeFetchResponseToNode(res, fetchRes);
		} catch (err) {
			next(err);
		}
	};
}
