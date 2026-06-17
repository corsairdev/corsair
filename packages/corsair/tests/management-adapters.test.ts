import { createCorsair } from '../core';
import {
	toExpressHandler,
	toHonoHandler,
	toNextJsHandler,
} from '../core/management';
import type { CorsairPlugin } from '../core/plugins';
import { createTestDatabase } from './setup-db';

// ─────────────────────────────────────────────────────────────────────────────
// Framework adapter tests. Each adapter is a thin bridge to the same vanilla
// (Request) => Promise<Response> handler; we just confirm the bridge wires up
// methods, paths, and bodies correctly. The handler's own semantics are
// covered exhaustively in management-handler.test.ts.
//
// Casts: `as unknown as CorsairPlugin` on the fixture, `as any` on the
// createCorsair call — see management-handler.test.ts for the rationale.
// ─────────────────────────────────────────────────────────────────────────────

const slack = {
	id: 'slack',
	options: { authType: 'oauth_2' as const },
	oauthConfig: {
		providerName: 'Slack',
		authUrl: 'https://slack.com/oauth/v2/authorize',
		tokenUrl: 'https://slack.com/api/oauth.v2.access',
		scopes: ['chat:write'],
	},
} as unknown as CorsairPlugin;

const KEK = 'test-kek-adapters';

function makeCorsair(env: ReturnType<typeof createTestDatabase>) {
	return createCorsair({
		plugins: [slack],
		database: env.db,
		kek: KEK,
	} as any);
}

describe('toNextJsHandler', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('exposes GET and POST that share the same handler', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		const route = toNextJsHandler(corsair);

		const ok = await route.GET(
			new Request('http://x/api/corsair/ok', { method: 'GET' }),
		);
		expect(ok.status).toBe(200);
		expect(await ok.json()).toEqual({ ok: true });

		const created = await route.POST(
			new Request('http://x/api/corsair/tenants', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: 'team-a' }),
			}),
		);
		expect(created.status).toBe(201);
		const body = await created.json();
		expect(body.id).toBe('team-a');
	});
});

describe('toHonoHandler', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('dispatches c.req.raw to the vanilla handler', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		const honoHandler = toHonoHandler(corsair);

		const c = {
			req: {
				raw: new Request('http://x/api/corsair/ok', { method: 'GET' }),
			},
		};
		const res = await honoHandler(c);
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
	});
});

describe('toExpressHandler', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	function makeRes() {
		let statusCode = 200;
		const headers: Record<string, string> = {};
		let body: Buffer | string | undefined;
		const res: any = {
			status: (code: number) => {
				statusCode = code;
				return res;
			},
			setHeader: (name: string, value: string) => {
				headers[name.toLowerCase()] = value;
			},
			send: (b: Buffer | string) => {
				body = b;
			},
		};
		return {
			res,
			read: () => ({
				status: statusCode,
				headers,
				body: typeof body === 'string' ? body : body?.toString('utf-8'),
			}),
		};
	}

	it('bridges Express req → fetch Request, writes the Response back', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		const handler = toExpressHandler(corsair);

		const req: any = {
			method: 'GET',
			originalUrl: '/api/corsair/ok',
			url: '/api/corsair/ok',
			headers: { host: 'example.com' },
			protocol: 'https',
			get: (name: string) =>
				name.toLowerCase() === 'host' ? 'example.com' : undefined,
		};
		const { res, read } = makeRes();
		const next = jest.fn();

		await handler(req, res, next);

		const out = read();
		expect(out.status).toBe(200);
		expect(out.headers['content-type']).toContain('application/json');
		expect(JSON.parse(out.body!)).toEqual({ ok: true });
		expect(next).not.toHaveBeenCalled();
	});

	it('re-serializes a parsed JSON body for POST', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		const handler = toExpressHandler(corsair);

		const req: any = {
			method: 'POST',
			originalUrl: '/api/corsair/tenants',
			url: '/api/corsair/tenants',
			headers: { host: 'example.com', 'content-type': 'application/json' },
			protocol: 'http',
			body: { id: 'team-b' },
			get: (name: string) =>
				name.toLowerCase() === 'host' ? 'example.com' : undefined,
		};
		const { res, read } = makeRes();
		await handler(req, res, jest.fn());

		const out = read();
		expect(out.status).toBe(201);
		expect(JSON.parse(out.body!).id).toBe('team-b');
	});

	it('forwards adapter-level errors to next()', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		const handler = toExpressHandler(corsair);

		const req: any = {
			method: 'GET',
			// missing originalUrl + url triggers buildFetchRequest to construct an
			// invalid URL — Request() throws synchronously inside the try.
			originalUrl: 'not a url',
			url: 'not a url',
			headers: {},
			get: () => undefined,
		};
		const { res } = makeRes();
		const next = jest.fn();
		await handler(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
