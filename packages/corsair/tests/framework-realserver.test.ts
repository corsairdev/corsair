import { createHmac, randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import { createServer } from 'node:http';
import express from 'express';
import fastify from 'fastify';
import { createCorsair } from '../core';
import {
	DEFAULT_MAX_BODY_BYTES,
	managementHandler,
	registerCorsairRawBodyParser,
	toExpressHandler,
	toFastifyHandler,
	toNodeHandler,
} from '../core/management';
import type { CorsairPlugin } from '../core/plugins';
import { signDeliveryEnvelope } from '../hub/signing/envelope';
import { createTestDatabase } from './setup-db';

// ─────────────────────────────────────────────────────────────────────────────
// Real-server adapter integration tests.
//
// The structural doubles in framework-body-fidelity.test.ts pin the shared
// bridge logic without framework dependencies; THIS suite boots REAL Express
// and Fastify servers because doubles cannot model framework internals. That
// gap is exactly how the Fastify bug shipped: the built-in JSON parser drains
// request.raw BEFORE any handler runs, which a fresh fake stream never shows.
//
// Oracle: a delivery whose signature PASSES reaches webhook dispatch and gets
// back "No matching webhook handler found" (no plugin registers webhooks here),
// while a corrupted body never gets past HMAC and answers "Invalid tunnel
// signature". Asserting the POSITIVE marker avoids the one-directional trap
// where any non-signature error — including 500s — reads as success.
//
// Casts: `as unknown as CorsairPlugin` on the fixture, `as any` on the
// createCorsair call — see management-handler.test.ts for the rationale.
//
// CI note: pr-checks ignores files matching api\.test\.ts|integration\.test\.ts.
// This file is deliberately named so it does NOT match — renaming it to
// *.integration.test.ts would silently skip it in CI.
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

const KEK = 'test-kek-realserver';
const PROJECT = 'proj_realserver';
const SIGNING_SECRET = 'signing-secret-realserver';
const BASE = '/api/corsair';

// The response substring that proves the signature CHECK PASSED (dispatch ran).
const SIG_PASS_MARKER = 'No matching webhook handler found';
const SIG_FAIL = 'Invalid tunnel signature';

function makeCorsair(env: ReturnType<typeof createTestDatabase>) {
	return createCorsair({
		plugins: [slack],
		database: env.db,
		kek: KEK,
		hub: { projectApiKey: 'ck_dev_test_key', signingSecret: SIGNING_SECRET },
	} as any);
}

function makeSignedDelivery() {
	return signDeliveryEnvelope({
		projectId: PROJECT,
		signingSecret: SIGNING_SECRET,
		type: 'webhook',
		// Full webhook-envelope payload: dispatch needs `plugin` to reach the
		// no-handler-registered outcome our positive oracle asserts.
		payload: {
			z: 1,
			a: 'π/λ',
			nested: { b: true, a: [3, 2, 1] },
			plugin: 'slack',
			headers: {},
			body: JSON.stringify({ ok: true }),
		},
	});
}

// Non-canonical bytes (injected whitespace) that JSON.stringify(parsed) can
// never reproduce — any parse/re-serialize step provably flips the oracle.
function makeNonCanonical(): { body: string; headers: Record<string, string> } {
	const canonical = JSON.stringify({
		type: 'webhook',
		payload: {
			headers: {},
			body: JSON.stringify({ a: 1, b: 2 }),
			plugin: 'slack',
		},
	});
	const body = canonical.replace('{"type"', '{ "type"');
	const signature = createHmac('sha256', SIGNING_SECRET)
		.update(body)
		.digest('hex');
	return {
		body,
		headers: {
			'content-type': 'application/json',
			'x-corsair-signature': `sha256=${signature}`,
			'x-corsair-timestamp': Math.floor(Date.now() / 1000).toString(),
			'x-corsair-project': PROJECT,
			'x-corsair-nonce': randomUUID(),
		},
	};
}

// Fastify apps MUST boot through app.listen()/ready() — listening on
// app.server directly skips avvio boot and leaves route contexts (hook
// arrays, parser registry) uninitialized. Express apps are wrapped in a real
// http.Server instead, since app.listen() returns the server rather than
// mutating the app.
async function startHttpServer(server: Server): Promise<number> {
	// Reject on 'error' so a listen failure (EMFILE, EADDRINUSE on a busy CI)
	// surfaces as a real error instead of hanging until the jest timeout.
	await new Promise<void>((resolve, reject) => {
		server.once('error', reject);
		server.listen(0, '127.0.0.1', () => {
			server.off('error', reject);
			resolve();
		});
	});
	const addr = server.address();
	if (addr === null || typeof addr === 'string') {
		throw new Error('server did not report an address');
	}
	return addr.port;
}

function stopHttpServer(server: Server): Promise<void> {
	// Undici's global fetch agent pools keep-alive loopback sockets; without
	// this the worker can outlive the suite and get force-exited by jest.
	server.closeAllConnections();
	return new Promise<void>((r) => server.close(() => r()));
}

async function startFastifyApp(
	app: ReturnType<typeof fastify>,
): Promise<number> {
	await app.listen({ port: 0, host: '127.0.0.1' });
	const addr = app.server.address();
	if (addr === null || typeof addr === 'string') {
		throw new Error('fastify did not report an address');
	}
	return addr.port;
}

async function postRaw(
	port: number,
	payload: { body: string; headers: Record<string, string> },
): Promise<{ status: number; text: string }> {
	const res = await fetch(`http://127.0.0.1:${port}${BASE}`, {
		method: 'POST',
		headers: payload.headers,
		body: payload.body,
	});
	return { status: res.status, text: await res.text() };
}

async function post(
	port: number,
	payload: { body: string; headers: Record<string, string> },
): Promise<string> {
	return (await postRaw(port, payload)).text;
}

// ── Fastify ──────────────────────────────────────────────────────────────────

describe('real server — Fastify', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('DEFAULT parsers alone are not enough — the parsed-object path stays lossy', async () => {
		env = createTestDatabase();
		const app = fastify({ logger: false });
		const corsair = makeCorsair(env);
		app.all(`${BASE}/*`, toFastifyHandler(corsair, { basePath: BASE }));
		app.all(BASE, toFastifyHandler(corsair, { basePath: BASE }));

		const port = await startFastifyApp(app);
		try {
			// Without registerCorsairRawBodyParser the built-in parser hands the
			// adapter an already-parsed object → re-serialization breaks the HMAC.
			// This pins WHY the raw-body registration below is required, not
			// optional, documentation.
			const text = await post(port, makeNonCanonical());
			expect(text.includes(SIG_FAIL)).toBe(true);
		} finally {
			await app.close();
		}
	});

	it('registerCorsairRawBodyParser + adapter delivers canonical AND non-canonical verbatim', async () => {
		env = createTestDatabase();
		const app = fastify({ logger: false });
		registerCorsairRawBodyParser(app);
		const corsair = makeCorsair(env);
		app.all(`${BASE}/*`, toFastifyHandler(corsair, { basePath: BASE }));
		app.all(BASE, toFastifyHandler(corsair, { basePath: BASE }));

		const port = await startFastifyApp(app);
		try {
			// charset-suffixed content type must match the registered parser too
			const payload = makeNonCanonical();
			const charsetPayload = {
				...payload,
				headers: {
					...payload.headers,
					'content-type': 'application/json; charset=utf-8',
				},
			};
			const payloads = [
				makeSignedDelivery(),
				makeNonCanonical(),
				charsetPayload,
			];
			for (const p of payloads) {
				const text = await post(port, p);
				expect(text.includes(SIG_FAIL)).toBe(false);
				expect(text).toContain(SIG_PASS_MARKER);
			}
		} finally {
			await app.close();
		}
	});

	it('helper keeps parsed-object semantics on NON-corsair routes', async () => {
		env = createTestDatabase();
		const app = fastify({ logger: false });
		registerCorsairRawBodyParser(app);
		let seen: unknown;
		app.post('/users', (req) => {
			seen = req.body;
			return { ok: true };
		});

		await startFastifyApp(app);
		try {
			const res = await fetch(
				`http://127.0.0.1:${(app.server.address() as { port: number }).port}/users`,
				{
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: '{"email":"a@b.c"}',
				},
			);
			expect(res.status).toBe(200);
			// The whole point of the parser swap: other routes must keep seeing a
			// parsed object, never the raw Buffer.
			expect(seen).toEqual({ email: 'a@b.c' });
		} finally {
			await app.close();
		}
	});

	it('invalid JSON through the helper answers 400 like the built-in parser', async () => {
		env = createTestDatabase();
		const app = fastify({ logger: false });
		registerCorsairRawBodyParser(app);
		const corsair = makeCorsair(env);
		app.all(`${BASE}/*`, toFastifyHandler(corsair, { basePath: BASE }));
		app.all(BASE, toFastifyHandler(corsair, { basePath: BASE }));

		const port = await startFastifyApp(app);
		try {
			const { status } = await postRaw(port, {
				body: '{"broken":',
				headers: { 'content-type': 'application/json' },
			});
			expect(status).toBe(400);
		} finally {
			await app.close();
		}
	});

	it('oversized captured body gets the 413 corsair envelope on Fastify too', async () => {
		env = createTestDatabase();
		const app = fastify({ logger: false, bodyLimit: 8 * 1024 * 1024 });
		registerCorsairRawBodyParser(app);
		const corsair = makeCorsair(env);
		app.all(`${BASE}/*`, toFastifyHandler(corsair, { basePath: BASE }));
		app.all(BASE, toFastifyHandler(corsair, { basePath: BASE }));

		const port = await startFastifyApp(app);
		try {
			// Fastify's own bodyLimit is raised, so the parser hands the adapter a
			// Buffer far past corsair's default cap — the bridge must still gate it.
			const oversized = `{"pad":"${'x'.repeat(DEFAULT_MAX_BODY_BYTES)}"}`;
			const { status, text } = await postRaw(port, {
				body: oversized,
				headers: { 'content-type': 'application/json' },
			});
			expect(status).toBe(413);
			expect(text).toContain('payload_too_large');
		} finally {
			await app.close();
		}
	});
});

// ── Express ──────────────────────────────────────────────────────────────────

describe('real server — Express', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('global express.json() corrupts signatures on the real stack too', async () => {
		env = createTestDatabase();
		const app = express();
		// 🚨 parser FIRST — the documented trap, now proven against real Express.
		app.use(express.json());
		app.use(BASE, toExpressHandler(makeCorsair(env), { basePath: BASE }));

		const server = createServer(app);
		const port = await startHttpServer(server);
		try {
			const text = await post(port, makeNonCanonical());
			expect(text.includes(SIG_FAIL)).toBe(true);
			// NOTE: the adapter's lossy-reencode console.warn is asserted in
			// framework-body-fidelity.test.ts, whose lossy path runs first in its
			// own jest module registry. warnLossyReencode is once-per-process per
			// registry, so a spy HERE would only ever capture unrelated
			// createCorsair warnings and pass vacuously.
		} finally {
			await stopHttpServer(server);
		}
	});

	it('route-scoped express.raw delivers verbatim (Stripe-style mount)', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		const app = express();
		app.post(
			BASE,
			express.raw({ type: 'application/json' }),
			toExpressHandler(corsair, { basePath: BASE }),
		);
		app.use(BASE, toExpressHandler(corsair, { basePath: BASE }));

		const server = createServer(app);
		const port = await startHttpServer(server);
		try {
			for (const payload of [makeSignedDelivery(), makeNonCanonical()]) {
				const text = await post(port, payload);
				expect(text.includes(SIG_FAIL)).toBe(false);
				expect(text).toContain(SIG_PASS_MARKER);
			}
		} finally {
			await stopHttpServer(server);
		}
	});
});

// ── node:http ────────────────────────────────────────────────────────────────

describe('real server — node:http', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('bodies beyond maxBodyBytes get 413 instead of unbounded buffering', async () => {
		env = createTestDatabase();
		const server = createServer(
			toNodeHandler(makeCorsair(env), { basePath: BASE }),
		);
		const port = await startHttpServer(server);
		try {
			const oversized = `{"pad":"${'x'.repeat(DEFAULT_MAX_BODY_BYTES)}"}`;
			const res = await fetch(`http://127.0.0.1:${port}${BASE}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: oversized,
			});
			expect(res.status).toBe(413);
			expect(await res.text()).toContain('payload_too_large');
		} finally {
			await stopHttpServer(server);
		}
	});

	it('declared content-length past maxBodyBytes is rejected BEFORE routing — hub delivery included', async () => {
		env = createTestDatabase();
		const handler = managementHandler(makeCorsair(env), { basePath: BASE });
		// POST to the BASE path routes to hub delivery, whose reader buffers the
		// whole body — the entry-level gate must answer 413 BEFORE that read.
		// A minimal Request-shaped double carries the oversized header because
		// undici's Request constructor strips the forbidden `content-length`
		// name; the gate itself only reads url/method/headers.
		const req = {
			url: `http://localhost${BASE}`,
			method: 'POST',
			headers: new Headers({
				'content-type': 'application/json',
				'content-length': String(DEFAULT_MAX_BODY_BYTES * 4),
			}),
		} as unknown as Request;
		const res = await handler(req);
		expect(res.status).toBe(413);
		expect(await res.text()).toContain('payload_too_large');
	});

	it('a rejecting request listener answers 500 instead of crashing the process', async () => {
		env = createTestDatabase();
		const handle = toNodeHandler(makeCorsair(env), { basePath: BASE });

		// Malformed URL makes Request construction throw INSIDE the listener —
		// unguarded, this rejection is unhandled by node:http and terminates
		// Node ≥15 processes.
		let out: Buffer | string | undefined;
		const resDouble = {
			statusCode: 0,
			headersSent: false,
			setHeader: () => {},
			end: (b?: string | Buffer) => {
				out = b;
			},
		};
		await handle(
			{
				method: 'GET',
				url: 'not a url',
				headers: { host: 'example.com' },
				protocol: 'http',
			},
			resDouble,
		);

		expect(resDouble.statusCode).toBe(500);
		expect(String(out)).toContain('internal_error');
	});
});
