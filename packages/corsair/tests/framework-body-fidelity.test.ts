import { createHmac, randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createCorsair } from '../core';
import {
	managementHandler,
	toExpressHandler,
	toHonoHandler,
	toNextJsHandler,
} from '../core/management';
import type { CorsairPlugin } from '../core/plugins';
import { signDeliveryEnvelope } from '../hub/signing/envelope';
import { createTestDatabase } from './setup-db';

// ─────────────────────────────────────────────────────────────────────────────
// Framework body-fidelity matrix.
//
// Every documented mount path must deliver Hub's POST body to the SDK handler
// BYTE-FOR-BYTE. Hub HMAC-signs each delivery over the exact bytes it sent
// (hub/signing/envelope.ts); any re-serialization or dropped body flips the
// signature check to "Invalid tunnel signature". So we don't string-compare the
// body — we let the real signature verification be the oracle:
//
//   verbatim body  → signature verifies → error is NEVER "Invalid tunnel signature"
//   mangled body   → signature rejected → error IS "Invalid tunnel signature"
//
// The frameworks collapse into a handful of mechanically-distinct transports:
//   - Web Request forwarded verbatim  → Next.js, Hono, and EVERY web-standard
//     runtime (SvelteKit / Remix / Astro / Nuxt / TanStack / Workers / Bun /
//     Deno) — their route handlers all hand `managementHandler` the native
//     Request untouched, so one proof covers them all.
//   - Express, no body parser (recommended) → adapter drains the raw stream.
//   - Express + express.text({ type: '*/*' })  → verbatim string.
//   - Express + express.raw({ type: '*/*' })   → verbatim Buffer.
//   - Node http bridge  → raw stream → managementHandler.
//   - Fastify raw-buffer bridge → Buffer → managementHandler.
//
// The one lossy path, express.json(), is asserted to FAIL, documenting the trap.
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

const KEK = 'test-kek-body-fidelity';
const PROJECT = 'proj_test';
const SIGNING_SECRET = 'signing-secret-body-fidelity';
const BASE = '/api/corsair';

function makeCorsair(env: ReturnType<typeof createTestDatabase>) {
	return createCorsair({
		plugins: [slack],
		database: env.db,
		kek: KEK,
		hub: { projectApiKey: 'ck_dev_test_key', signingSecret: SIGNING_SECRET },
	} as any);
}

function makeSignedDelivery() {
	const { body, headers } = signDeliveryEnvelope({
		projectId: PROJECT,
		signingSecret: SIGNING_SECRET,
		type: 'webhook',
		payload: { z: 1, a: 'π/λ', nested: { b: true, a: [3, 2, 1] } },
	});
	return { body, headers };
}

// Signs a NON-canonical raw body (extra whitespace) that JSON.stringify(parsed)
// can never reproduce — so any re-serialization (the express.json() path) is
// provably lossy and trips the signature check.
function makeSignedNonCanonicalDelivery() {
	const canonical = JSON.stringify({
		type: 'webhook',
		payload: { a: 1, b: 2 },
	});
	// Inject a space after the leading brace: still valid JSON, different bytes.
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

// The oracle: the response body must not carry the signature-rejection error.
async function assertVerbatim(res: Response, framework: string) {
	const text = await res.text();
	expect({ framework, sig: text.includes('Invalid tunnel signature') }).toEqual(
		{ framework, sig: false },
	);
}

async function assertRejected(res: Response) {
	const text = await res.text();
	expect(text.includes('Invalid tunnel signature')).toBe(true);
}

// ── Web Request path: Next.js, Hono, and all web-standard runtimes ───────────

describe('body fidelity — Web Request forwarded verbatim', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	// Each entry mounts the documented handler and returns a (Request)=>Response.
	function transports(corsair: unknown) {
		const web = (req: Request) =>
			managementHandler(corsair, { basePath: BASE })(req);
		return {
			// toNextJsHandler fans POST to the shared handler.
			nextjs: (req: Request) =>
				toNextJsHandler(corsair, { basePath: BASE }).POST(req),
			// toHonoHandler passes c.req.raw straight through.
			hono: (req: Request) =>
				toHonoHandler(corsair, { basePath: BASE })({ req: { raw: req } }),
			// Web-standard frameworks all forward `request` unchanged to managementHandler.
			sveltekit: web,
			remix: web,
			astro: web,
			nuxt: web,
			tanstack: web,
			workers: web,
		};
	}

	it('delivers verbatim across Next.js, Hono, and every web-standard runtime', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		const t = transports(corsair);

		for (const [framework, handler] of Object.entries(t)) {
			const { body, headers } = makeSignedDelivery();
			const res = await handler(
				new Request(`http://x${BASE}`, { method: 'POST', headers, body }),
			);
			await assertVerbatim(res, framework);
		}
	});
});

// ── Express: raw stream (no parser), text() string, raw() Buffer ─────────────

// Minimal Express-like req/res doubles. The adapter only touches the fields
// declared in express.ts's structural types, so we don't need real Express.
function makeExpressReq(opts: {
	method: string;
	body?: unknown;
	rawBody?: Buffer; // present when no parser is mounted (stream to drain)
	headers: Record<string, string>;
}) {
	const base: any = {
		method: opts.method,
		originalUrl: BASE,
		url: BASE,
		headers: opts.headers,
		protocol: 'http',
		get: (n: string) =>
			n.toLowerCase() === 'host' ? 'example.com' : undefined,
	};
	if (opts.body !== undefined) base.body = opts.body;
	if (opts.rawBody !== undefined) {
		// Make it an async-iterable of one Buffer chunk, like IncomingMessage.
		base[Symbol.asyncIterator] = async function* () {
			yield opts.rawBody!;
		};
	}
	return base;
}

function makeExpressRes() {
	let statusCode = 200;
	const headers: Record<string, string> = {};
	let body: Buffer | string | undefined;
	const res: any = {
		status: (c: number) => {
			statusCode = c;
			return res;
		},
		setHeader: (n: string, v: string) => {
			headers[n.toLowerCase()] = v;
		},
		send: (b: Buffer | string) => {
			body = b;
		},
	};
	return {
		res,
		text: () =>
			typeof body === 'string' ? body : (body?.toString('utf-8') ?? ''),
	};
}

describe('body fidelity — Express', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('no parser: drains the raw stream verbatim', async () => {
		env = createTestDatabase();
		const handler = toExpressHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedDelivery();
		const req = makeExpressReq({
			method: 'POST',
			rawBody: Buffer.from(body, 'utf-8'),
			headers,
		});
		const { res, text } = makeExpressRes();
		await handler(req, res, () => {});
		expect(text().includes('Invalid tunnel signature')).toBe(false);
	});

	it('no parser: preserves NON-canonical bytes that express.json() would corrupt', async () => {
		env = createTestDatabase();
		const handler = toExpressHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedNonCanonicalDelivery();
		const req = makeExpressReq({
			method: 'POST',
			rawBody: Buffer.from(body, 'utf-8'),
			headers,
		});
		const { res, text } = makeExpressRes();
		await handler(req, res, () => {});
		expect(text().includes('Invalid tunnel signature')).toBe(false);
	});

	it("express.text({ type: '*/*' }): verbatim string", async () => {
		env = createTestDatabase();
		const handler = toExpressHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedDelivery();
		const req = makeExpressReq({ method: 'POST', body, headers });
		const { res, text } = makeExpressRes();
		await handler(req, res, () => {});
		expect(text().includes('Invalid tunnel signature')).toBe(false);
	});

	it("express.raw({ type: '*/*' }): verbatim Buffer", async () => {
		env = createTestDatabase();
		const handler = toExpressHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedDelivery();
		const req = makeExpressReq({
			method: 'POST',
			body: Buffer.from(body, 'utf-8'),
			headers,
		});
		const { res, text } = makeExpressRes();
		await handler(req, res, () => {});
		expect(text().includes('Invalid tunnel signature')).toBe(false);
	});

	it('express.json() (lossy): re-serialized body FAILS signature — documents the trap', async () => {
		env = createTestDatabase();
		const handler = toExpressHandler(makeCorsair(env), { basePath: BASE });
		// Sender used non-canonical whitespace; express.json() gives the adapter a
		// parsed object, so JSON.stringify() drops that whitespace → HMAC mismatch.
		const { body, headers } = makeSignedNonCanonicalDelivery();
		const req = makeExpressReq({
			method: 'POST',
			body: JSON.parse(body),
			headers,
		});
		const { res, text } = makeExpressRes();
		await handler(req, res, () => {});
		expect(text().includes('Invalid tunnel signature')).toBe(true);
	});
});

// ── Node raw http bridge → managementHandler ─────────────────────────────────

describe('body fidelity — Node (node:http raw-stream bridge)', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('boots a real http server, delivers verbatim', async () => {
		env = createTestDatabase();
		const handler = managementHandler(makeCorsair(env), { basePath: BASE });

		// The exact node.mdx bridge: drain req into a Buffer, build a Request.
		const server = createServer(async (req, res) => {
			const chunks: Buffer[] = [];
			for await (const chunk of req) chunks.push(chunk as Buffer);
			const rawBody = Buffer.concat(chunks);
			const url = `http://${req.headers.host}${req.url}`;
			const headers = new Headers();
			for (const [k, v] of Object.entries(req.headers)) {
				if (typeof v === 'string') headers.set(k, v);
			}
			const request = new Request(url, {
				method: req.method,
				headers,
				body: req.method === 'POST' ? new Uint8Array(rawBody) : undefined,
			});
			const response = await handler(request);
			res.statusCode = response.status;
			res.end(Buffer.from(await response.arrayBuffer()));
		});

		await new Promise<void>((r) => server.listen(0, r));
		try {
			const { port } = server.address() as AddressInfo;
			const { body, headers } = makeSignedDelivery();
			const res = await fetch(`http://127.0.0.1:${port}${BASE}`, {
				method: 'POST',
				headers,
				body,
			});
			const text = await res.text();
			expect(text.includes('Invalid tunnel signature')).toBe(false);
		} finally {
			await new Promise<void>((r) => server.close(() => r()));
		}
	});
});

// ── Fastify raw-buffer bridge → managementHandler ────────────────────────────
// Fastify isn't a dependency; we exercise the documented bridge shape (a
// raw-buffer content-type parser hands the handler the untouched Buffer).

describe('body fidelity — Fastify (raw-buffer bridge)', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('raw Buffer body reaches managementHandler verbatim', async () => {
		env = createTestDatabase();
		const handler = managementHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedDelivery();

		// addContentTypeParser('*', { parseAs: 'buffer' }, ...) gives req.body as
		// a Buffer; the route forwards it verbatim into a Request.
		const rawBuffer = Buffer.from(body, 'utf-8');
		const h = new Headers();
		for (const [k, v] of Object.entries(headers)) h.set(k, v as string);
		const request = new Request(`http://x${BASE}`, {
			method: 'POST',
			headers: h,
			body: new Uint8Array(rawBuffer),
		});
		const res = await handler(request);
		const text = await res.text();
		expect(text.includes('Invalid tunnel signature')).toBe(false);
	});
});

// ── Negative control: prove the oracle actually catches corruption ───────────

describe('body fidelity — oracle sanity (mangled body is rejected)', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('a single flipped byte trips "Invalid tunnel signature"', async () => {
		env = createTestDatabase();
		const handler = managementHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedDelivery();
		const mangled = `${body} `; // one trailing space
		const h = new Headers();
		for (const [k, v] of Object.entries(headers)) h.set(k, v as string);
		const res = await handler(
			new Request(`http://x${BASE}`, {
				method: 'POST',
				headers: h,
				body: mangled,
			}),
		);
		await assertRejected(res);
	});
});
