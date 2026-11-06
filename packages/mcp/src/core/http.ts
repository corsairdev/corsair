import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'crypto';
import type { Request, Response, Router } from 'express';
import { Router as createRouter } from 'express';

interface Session {
	server: McpServer;
	transport: StreamableHTTPServerTransport;
	openRequests: number;
	idleTimer?: ReturnType<typeof setTimeout>;
}

const SESSION_IDLE_MS = 60_000;

const sessions = new Map<string, Session>();

// Expire a session only after its last open request (including a GET event
// stream) has closed, so an active client is never cut off mid-conversation.
function trackRequest(sessionId: string, session: Session, res: Response) {
	clearTimeout(session.idleTimer);
	session.openRequests++;
	res.on('close', () => {
		session.openRequests--;
		if (session.openRequests === 0) {
			session.idleTimer = setTimeout(() => cleanup(sessionId), SESSION_IDLE_MS);
		}
	});
}

function cleanup(sessionId: string) {
	const session = sessions.get(sessionId);
	if (session) {
		clearTimeout(session.idleTimer);
		session.transport.close();
		session.server.close();
		sessions.delete(sessionId);
	}
}

export function createMcpRouter(createServer: () => McpServer): Router {
	const router = createRouter();

	router.post('/', async (req: Request, res: Response) => {
		const sessionId = req.headers['mcp-session-id'] as string | undefined;

		if (sessionId) {
			const session = sessions.get(sessionId);
			if (!session) {
				res.status(404).json({ error: 'Session not found' });
				return;
			}
			trackRequest(sessionId, session, res);
			await session.transport.handleRequest(req, res, req.body);
			return;
		}

		const server = createServer();
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: () => randomUUID(),
			onsessioninitialized: (id) => {
				const session: Session = { server, transport, openRequests: 0 };
				sessions.set(id, session);
				trackRequest(id, session, res);
			},
		});

		await server.connect(transport);
		await transport.handleRequest(req, res, req.body);
	});

	router.get('/', async (req: Request, res: Response) => {
		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		if (!sessionId || !sessions.has(sessionId)) {
			res.status(400).json({ error: 'Missing or invalid mcp-session-id' });
			return;
		}
		const session = sessions.get(sessionId)!;
		trackRequest(sessionId, session, res);
		await session.transport.handleRequest(req, res);
	});

	router.delete('/', async (req: Request, res: Response) => {
		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		if (sessionId) cleanup(sessionId);
		res.status(200).end();
	});

	return router;
}
