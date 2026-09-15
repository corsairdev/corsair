import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServer } from 'node:http';

export type MockCall = { method: string; path: string; body?: unknown };

export type MockRuntime = {
	url: string;
	close(): Promise<void>;
	calls: MockCall[];
};

const EXPECTED_KEY = 'ck_cloud_test';

function send(res: ServerResponse, status: number, body: unknown): void {
	const json = JSON.stringify(body);
	res.writeHead(status, { 'content-type': 'application/json' });
	res.end(json);
}

async function readBody(req: IncomingMessage): Promise<unknown> {
	const chunks: Buffer[] = [];
	for await (const chunk of req) chunks.push(chunk as Buffer);
	if (chunks.length === 0) return undefined;
	return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function startMockRuntime(): Promise<MockRuntime> {
	const calls: MockCall[] = [];

	const server = createServer((req, res) => {
		void (async () => {
			const method = req.method ?? 'GET';
			const path = req.url ?? '/';
			const body = await readBody(req);
			calls.push({ method, path, body });

			const auth = req.headers.authorization;
			if (auth !== `Bearer ${EXPECTED_KEY}`) {
				send(res, 401, { error: 'unauthorized' });
				return;
			}

			const pathname = path.split('?')[0] ?? path;

			if (method === 'POST' && pathname === '/tenants') {
				const { id } = (body ?? {}) as { id?: string };
				send(res, 201, { id });
				return;
			}

			if (method === 'POST' && pathname === '/connect/links') {
				send(res, 200, { connectUrl: 'https://mock.local/oauth', state: 's1' });
				return;
			}

			if (method === 'GET' && pathname === '/connection-status') {
				send(res, 200, { slack: 'connected' });
				return;
			}

			const callMatch = pathname.match(/^\/([^/]+)\/([^/]+)\/call\/(.+)$/);
			if (method === 'POST' && callMatch) {
				const [, tenantId, , op] = callMatch;
				send(res, 200, { data: { op, tenantId } });
				return;
			}

			send(res, 404, { error: 'not_found' });
		})();
	});

	await new Promise<void>((resolve) => server.listen(0, resolve));

	return {
		get url() {
			const address = server.address();
			if (address === null || typeof address === 'string') {
				throw new Error('mock runtime server has no port');
			}
			return `http://127.0.0.1:${address.port}`;
		},
		close: () =>
			new Promise<void>((resolve, reject) => {
				server.close((err) => (err ? reject(err) : resolve()));
			}),
		calls,
	};
}
