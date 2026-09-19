import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

// Raw node:http MCP handler — the hosted runtime is plain node:http, so the
// Express-based createMcpRouter can't be used. Same Streamable-HTTP transport,
// no Express, and no pre-parsed body (handleRequest reads the stream itself).

type Session = {
	server: McpServer;
	transport: StreamableHTTPServerTransport;
	timer: NodeJS.Timeout;
};

export type NodeMcpHandlerOptions = {
	createServer: () => McpServer;
	// Close a session after this long with no request activity, so a parked
	// stream (an editor left open) can't pin the process and defeat idle-exit.
	idleMs?: number;
};

const DEFAULT_IDLE_MS = 5 * 60_000;

function sendJson(res: ServerResponse, status: number, body: unknown): void {
	const text = JSON.stringify(body);
	res.writeHead(status, { 'content-type': 'application/json' });
	res.end(text);
}

export function createNodeMcpHandler(
	options: NodeMcpHandlerOptions,
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
	const idleMs = options.idleMs ?? DEFAULT_IDLE_MS;
	const sessions = new Map<string, Session>();

	function cleanup(id: string): void {
		const session = sessions.get(id);
		if (!session) return;
		clearTimeout(session.timer);
		session.transport.close();
		session.server.close();
		sessions.delete(id);
	}

	function touch(id: string): void {
		const session = sessions.get(id);
		if (!session) return;
		clearTimeout(session.timer);
		session.timer = setTimeout(() => cleanup(id), idleMs);
	}

	return async (req, res) => {
		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		const method = req.method ?? 'GET';

		if (method === 'DELETE') {
			if (sessionId) cleanup(sessionId);
			res.writeHead(200).end();
			return;
		}

		if (method === 'GET') {
			if (!sessionId || !sessions.has(sessionId)) {
				sendJson(res, 400, { error: 'Missing or invalid mcp-session-id' });
				return;
			}
			touch(sessionId);
			await sessions.get(sessionId)!.transport.handleRequest(req, res);
			return;
		}

		if (method !== 'POST') {
			sendJson(res, 405, { error: 'Method not allowed' });
			return;
		}

		if (sessionId) {
			const session = sessions.get(sessionId);
			if (!session) {
				sendJson(res, 404, { error: 'Session not found' });
				return;
			}
			touch(sessionId);
			await session.transport.handleRequest(req, res);
			return;
		}

		// New session: the transport assigns an id on the initialize handshake.
		const server = options.createServer();
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: () => randomUUID(),
			onsessioninitialized: (id) => {
				const timer = setTimeout(() => cleanup(id), idleMs);
				sessions.set(id, { server, transport, timer });
			},
		});
		await server.connect(transport);
		await transport.handleRequest(req, res);
	};
}
