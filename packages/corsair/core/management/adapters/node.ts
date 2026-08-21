import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';
import type { NodeLikeRequest, NodeLikeResponse } from './node-request';
import {
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

export function toNodeHandler(
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): NodeHandler {
	const handler = managementHandler(corsair, opts);
	return async (req, res) => {
		const fetchRes = await handler(await nodeRequestToFetchRequest(req));
		await writeFetchResponseToNode(res, fetchRes);
	};
}
