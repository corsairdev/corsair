import type { IncomingMessage, ServerResponse } from 'node:http';
import { exchangeOAuth, startOAuth } from './handlers/auth';
import { chatHandler } from './handlers/chat';
import {
	createChatHandler,
	getChatMessagesHandler,
	listChatsHandler,
} from './handlers/chats';
import { getCredentials, setCredentials } from './handlers/credentials';
import {
	listDbRows,
	listDbTables,
	listPermissions,
	queryEntityData,
} from './handlers/db';
import {
	listOperations,
	runOperation,
	runScript,
	schemaForOperation,
} from './handlers/operations';
import { setupPlugin } from './handlers/plugin-setup';
import { listPlugins } from './handlers/plugins';
import { getStatus } from './handlers/status';
import { createTenant, listTenants } from './handlers/tenants';
import type { HandlerCtx, HandlerFn } from './types';

type Route = {
	method: 'GET' | 'POST';
	path: string;
	handler: HandlerFn;
};

const routes: Route[] = [
	{ method: 'GET', path: '/api/status', handler: getStatus },
	{ method: 'GET', path: '/api/plugins', handler: listPlugins },
	{ method: 'POST', path: '/api/plugins/setup', handler: setupPlugin },
	{ method: 'GET', path: '/api/tenants', handler: listTenants },
	{ method: 'POST', path: '/api/tenants/create', handler: createTenant },

	{ method: 'POST', path: '/api/operations/list', handler: listOperations },
	{
		method: 'POST',
		path: '/api/operations/schema',
		handler: schemaForOperation,
	},
	{ method: 'POST', path: '/api/operations/run', handler: runOperation },
	{ method: 'POST', path: '/api/operations/script', handler: runScript },

	{ method: 'POST', path: '/api/credentials/get', handler: getCredentials },
	{ method: 'POST', path: '/api/credentials/set', handler: setCredentials },

	{ method: 'POST', path: '/api/auth/start', handler: startOAuth },
	{ method: 'POST', path: '/api/auth/exchange', handler: exchangeOAuth },

	{ method: 'GET', path: '/api/db/tables', handler: listDbTables },
	{ method: 'POST', path: '/api/db/rows', handler: listDbRows },
	{ method: 'POST', path: '/api/db/entities/query', handler: queryEntityData },
	{ method: 'GET', path: '/api/db/permissions', handler: listPermissions },

	{ method: 'GET', path: '/api/chats', handler: listChatsHandler },
	{ method: 'POST', path: '/api/chats', handler: createChatHandler },
	{
		method: 'GET',
		path: '/api/chats/messages',
		handler: getChatMessagesHandler,
	},

	{ method: 'POST', path: '/api/chat', handler: chatHandler },
];

export async function handleApi(
	req: IncomingMessage,
	res: ServerResponse,
	baseCtx: Omit<HandlerCtx, 'req' | 'res' | 'url'>,
): Promise<void> {
	const url = new URL(req.url ?? '/', 'http://localhost');
	const method = (req.method ?? 'GET').toUpperCase() as 'GET' | 'POST';

	const route = routes.find(
		(r) => r.method === method && r.path === url.pathname,
	);
	if (!route) {
		res.writeHead(404, { 'content-type': 'application/json' });
		res.end(
			JSON.stringify({ error: `No such endpoint: ${method} ${url.pathname}` }),
		);
		return;
	}

	const ctx: HandlerCtx = { req, res, url, ...baseCtx };

	try {
		const result = await route.handler(ctx);
		if (res.writableEnded || res.headersSent) return;
		res.writeHead(200, { 'content-type': 'application/json' });
		res.end(JSON.stringify(result ?? null));
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (!res.headersSent) {
			res.writeHead(500, { 'content-type': 'application/json' });
			res.end(JSON.stringify({ error: message }));
		}
	}
}

export async function readJsonBody(
	req: IncomingMessage,
): Promise<Record<string, unknown>> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		req.on('data', (c: Buffer) => chunks.push(c));
		req.on('end', () => {
			const raw = Buffer.concat(chunks).toString('utf8');
			if (!raw) return resolve({});
			try {
				const parsed = JSON.parse(raw) as unknown;
				if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
					resolve(parsed as Record<string, unknown>);
				} else {
					resolve({});
				}
			} catch (e) {
				reject(new Error(`Invalid JSON body: ${(e as Error).message}`));
			}
		});
		req.on('error', reject);
	});
}
