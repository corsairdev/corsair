import { errorResponse, json, ManagementApiError } from '../errors';
import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';
import type { NodeLikeRequest, NodeLikeResponse } from './node-request';
import {
	discardRequestBody,
	nodeRequestToFetchRequest,
	writeFetchResponseToNode,
} from './node-request';

// ─────────────────────────────────────────────────────────────────────────────
// Raw node:http adapter.
//
//   import { createServer } from 'node:http';
//   import { toNodeHandler } from 'corsair';
//   createServer(toNodeHandler(corsair, { basePath: '/api/corsair' })).listen(3000);
//
// Also mountable inside an existing server: call it when req.url starts with
// your base path. Drains the raw IncomingMessage stream so the body reaches Hub
// byte-verbatim (shared node-request bridge).
// ─────────────────────────────────────────────────────────────────────────────

export type NodeHandler = (
	req: NodeLikeRequest,
	res: NodeLikeResponse,
) => Promise<void>;

/**
 * Creates a Node request listener that forwards requests to the shared
 * management handler over the node bridge, body byte-verbatim. Usable as the
 * entire `createServer` listener or mounted inside an existing server.
 */
export function toNodeHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): NodeHandler {
	const handler = managementHandler(corsair, opts);
	return async (req, res) => {
		try {
			const fetchRes = await handler(
				await nodeRequestToFetchRequest(req, {
					maxBodyBytes: opts?.maxBodyBytes,
					bodyStallTimeoutMs: opts?.bodyStallTimeoutMs,
				}),
			);
			await writeFetchResponseToNode(res, fetchRes);
		} catch (err) {
			// An async request listener's rejection is unhandled by node:http and,
			// on modern Node defaults, terminates the whole process. Answer the
			// client instead of dying; ManagementApiError keeps its status/body,
			// everything else collapses to a generic 500.
			if (res.headersSent === true) {
				// Nothing can be written after the head flushed — log so the
				// truncation isn't invisible to operators, discard whatever is
				// still in flight, and close.
				console.error(
					'[corsair] management response failed after headers were sent:',
					err,
				);
				res.end?.();
				discardRequestBody(req);
				return;
			}
			if (err instanceof ManagementApiError) {
				await writeFetchResponseToNode(res, errorResponse(err));
				discardRequestBody(req);
				return;
			}
			console.error('[corsair] management handler failed:', err);
			await writeFetchResponseToNode(
				res,
				json(500, { error: 'internal_error' }),
			);
			discardRequestBody(req);
		}
	};
}
