import { createHmac, randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createCorsair } from '../core';
import {
	DEFAULT_MAX_BODY_BYTES,
	managementHandler,
	toAstroHandler,
	toExpressHandler,
	toFastifyHandler,
	toHonoHandler,
	toNextJsHandler,
	toNodeHandler,
	toNuxtHandler,
	toRemixHandler,
	toSvelteKitHandler,
	toTanStackHandler,
	toWebHandler,
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
//
// Casts: `as unknown as CorsairPlugin` on the fixture, `as any` on the
// createCorsair call and the framework doubles — see management-handler.test.ts
// for the rationale; the doubles only touch fields the adapters read, which is
// exactly what keeps them framework-dependency-free.
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
		return {
			// toNextJsHandler fans POST to the shared handler.
			nextjs: (req: Request) =>
				toNextJsHandler(corsair, { basePath: BASE }).POST(req),
			// toHonoHandler passes c.req.raw straight through.
			hono: (req: Request) =>
				toHonoHandler(corsair, { basePath: BASE })({ req: { raw: req } }),
			// Baseline: managementHandler itself. SvelteKit / Remix / Astro /
			// TanStack / Nuxt / Workers are each exercised through their REAL
			// adapter further down ("web-standard adapters") — aliasing them here
			// used to run the same code path six times under six names.
			baseline: (req: Request) =>
				managementHandler(corsair, { basePath: BASE })(req),
		};
	}

	it('delivers verbatim across Next.js, Hono, and the shared baseline', async () => {
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
		setHeader: (n: string, v: string | string[]) => {
			headers[n.toLowerCase()] = Array.isArray(v) ? v.join(', ') : v;
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

	it('captured Buffer beyond maxBodyBytes gets 413 — the cap covers host-captured bodies too', async () => {
		env = createTestDatabase();
		const handler = toExpressHandler(makeCorsair(env), { basePath: BASE });
		// express.raw() already buffered an oversized body; forwarding must still
		// be gated (a host capture must not bypass the documented limit).
		const oversized = `{"pad":"${'x'.repeat(DEFAULT_MAX_BODY_BYTES + 1)}"}`;
		const req = makeExpressReq({
			method: 'POST',
			body: Buffer.from(oversized, 'utf-8'),
			headers: { 'content-type': 'application/json' },
		});
		const { res, text } = makeExpressRes();
		await handler(req, res, () => {});
		expect(text()).toContain('payload_too_large');
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
		// The adapter must tell the operator WHY deliveries are failing. The warn
		// fires once per process; this is the first lossy-path test in the file,
		// so it owns the assertion. Assertions stay inside try — mockRestore()
		// resets mock.calls.
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			await handler(req, res, () => {});
			expect(text().includes('Invalid tunnel signature')).toBe(true);
			expect(warn.mock.calls[0]?.[0]).toContain('[corsair]');
		} finally {
			warn.mockRestore();
		}
	});
});

// ── Node: first-class toNodeHandler on a REAL http server ────────────────────

describe('body fidelity — toNodeHandler (real node:http server)', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('createServer(toNodeHandler) delivers the raw stream verbatim', async () => {
		env = createTestDatabase();
		// Mount exactly as documented: the adapter IS the request listener.
		const server = createServer(
			toNodeHandler(makeCorsair(env), { basePath: BASE }),
		);

		await new Promise<void>((r) => server.listen(0, r));
		try {
			const { port } = server.address() as AddressInfo;
			const { body, headers } = makeSignedNonCanonicalDelivery();
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

// ── Fastify: first-class toFastifyHandler over the shared bridge ─────────────
// Fastify isn't a dependency; we drive the adapter with structural doubles that
// mirror its shape (request.raw = Node stream, request.body = parser output,
// reply.raw = ServerResponse). Two stream states matter:
//   - 'fresh':  request.raw still yields the body. Real Fastify NEVER hands an
//     application/json POST to a handler in this state — its built-in parser
//     drains request.raw first (the real-server suite proves that). Kept to pin
//     the bridge's drain path for genuinely parser-less mounts.
//   - 'consumed': request.raw yields NOTHING and the parsed body arrives via
//     request.body — the state of every real Fastify JSON delivery.

describe('body fidelity — toFastifyHandler', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	function makeFastify(opts: {
		headers: Record<string, string>;
		body?: unknown;
		rawStream?: string;
	}) {
		const rawReq: any = { headers: opts.headers };
		if (opts.rawStream !== undefined) {
			rawReq[Symbol.asyncIterator] = async function* () {
				if (opts.rawStream!.length > 0) {
					yield Buffer.from(opts.rawStream!, 'utf-8');
				}
			};
		}
		const request: any = {
			raw: rawReq,
			method: 'POST',
			url: BASE,
			headers: opts.headers,
			protocol: 'http',
		};
		if (opts.body !== undefined) request.body = opts.body;
		let out: Buffer | string | undefined;
		let hijacked = false;
		const reply: any = {
			hijack: () => {
				hijacked = true;
			},
			raw: {
				statusCode: 200,
				setHeader: () => {},
				end: (b?: Buffer | string) => {
					out = b;
				},
			},
		};
		return {
			request,
			reply,
			read: () => ({
				hijacked,
				text: typeof out === 'string' ? out : (out?.toString('utf-8') ?? ''),
			}),
		};
	}

	it('drains an UNREAD request.raw verbatim (parser-less mount)', async () => {
		env = createTestDatabase();
		const handler = toFastifyHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedNonCanonicalDelivery();
		const { request, reply, read } = makeFastify({
			headers,
			rawStream: body,
		});
		await handler(request, reply);
		const { hijacked, text } = read();
		expect(hijacked).toBe(true);
		expect(text.includes('Invalid tunnel signature')).toBe(false);
	});

	it('reads the preserved Buffer from request.body when the raw stream is already drained', async () => {
		env = createTestDatabase();
		const handler = toFastifyHandler(makeCorsair(env), { basePath: BASE });
		// Host registered the raw-buffer parser (registerCorsairRawBodyParser):
		// Fastify consumed request.raw and handed us the untouched bytes as
		// request.body. The empty iterator models that exhausted stream.
		const { body, headers } = makeSignedNonCanonicalDelivery();
		const { request, reply, read } = makeFastify({
			headers,
			body: Buffer.from(body, 'utf-8'),
			rawStream: '',
		});
		await handler(request, reply);
		const { hijacked, text } = read();
		expect(hijacked).toBe(true);
		expect(text.includes('Invalid tunnel signature')).toBe(false);
	});

	it('parsed-object body from the DEFAULT json parser stays lossy — documents the trap', async () => {
		env = createTestDatabase();
		const handler = toFastifyHandler(makeCorsair(env), { basePath: BASE });
		// No raw-buffer parser: the default parser drained request.raw AND parsed
		// it, so only a lossy re-serialization is possible → signature must fail.
		const { body, headers } = makeSignedNonCanonicalDelivery();
		const { request, reply, read } = makeFastify({
			headers,
			body: JSON.parse(body),
			rawStream: '',
		});
		await handler(request, reply);
		const { text } = read();
		expect(text.includes('Invalid tunnel signature')).toBe(true);
	});
});

// ── Web-standard first-class adapters ────────────────────────────────────────
// SvelteKit / Remix / Astro / TanStack forward the native Request unchanged;
// Nuxt bridges the Node request under event.node. toWebHandler is managementHandler.

describe('body fidelity — web-standard adapters', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('SvelteKit / Remix / Astro / TanStack / Web forward the Request verbatim', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);

		// Each entry mounts the real adapter and returns (Request) => Response.
		const svelte = toSvelteKitHandler(corsair, { basePath: BASE });
		const remix = toRemixHandler(corsair, { basePath: BASE });
		const astro = toAstroHandler(corsair, { basePath: BASE });
		const tanstack = toTanStackHandler(corsair, { basePath: BASE });
		const web = toWebHandler(corsair, { basePath: BASE });

		const cases: Record<string, (req: Request) => Promise<Response>> = {
			'sveltekit.POST': (req) => svelte.POST({ request: req }),
			'remix.action': (req) => remix.action({ request: req }),
			'astro.POST': (req) => astro.POST({ request: req }),
			'tanstack.POST': (req) => tanstack.POST({ request: req }),
			'web (workers/bun/deno)': (req) => web(req),
		};

		for (const [framework, run] of Object.entries(cases)) {
			const { body, headers } = makeSignedNonCanonicalDelivery();
			const res = await run(
				new Request(`http://x${BASE}`, { method: 'POST', headers, body }),
			);
			await assertVerbatim(res, framework);
		}
	});

	it('toNuxtHandler bridges event.node request verbatim', async () => {
		env = createTestDatabase();
		const handler = toNuxtHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedNonCanonicalDelivery();

		let out: Buffer | string | undefined;
		const event: any = {
			node: {
				req: {
					method: 'POST',
					url: BASE,
					headers,
					[Symbol.asyncIterator]: async function* () {
						yield Buffer.from(body, 'utf-8');
					},
				},
				res: {
					statusCode: 200,
					setHeader: () => {},
					end: (b?: Buffer | string) => {
						out = b;
					},
				},
			},
		};
		await handler(event);
		const text = typeof out === 'string' ? out : (out?.toString('utf-8') ?? '');
		expect(text.includes('Invalid tunnel signature')).toBe(false);
	});

	// h3 caches bytes consumed by EARLIER middleware on the EVENT — readRawBody
	// leaves the untouched text on `_rawBody`, readBody leaves its parsed value
	// on `_body` — never on node.req. Without consulting those caches every
	// delivery behind a body-reading middleware would drain an exhausted stream
	// and die on Hub's signature check (the live-Nuxt regression this pins).
	function makeNuxtEventWithCache(opts: {
		headers: Record<string, string>;
		rawBody?: string;
		parsedBody?: unknown;
	}) {
		let out: Buffer | string | undefined;
		const event: any = {
			_rawBody: opts.rawBody,
			_body: opts.parsedBody,
			node: {
				req: {
					method: 'POST',
					url: BASE,
					headers: opts.headers,
					// The middleware already consumed the stream: nothing left.
					[Symbol.asyncIterator]: async function* () {},
				},
				res: {
					statusCode: 200,
					setHeader: () => {},
					end: (b?: Buffer | string) => {
						out = b;
					},
				},
			},
		};
		return {
			event,
			text: () =>
				typeof out === 'string' ? out : (out?.toString('utf-8') ?? ''),
		};
	}

	it('toNuxtHandler recovers h3 _rawBody when earlier middleware used readRawBody', async () => {
		env = createTestDatabase();
		const handler = toNuxtHandler(makeCorsair(env), { basePath: BASE });
		const { body, headers } = makeSignedNonCanonicalDelivery();
		const { event, text } = makeNuxtEventWithCache({
			headers,
			rawBody: body, // readRawBody(event) cached the untouched text
		});
		await handler(event);
		expect(text().includes('Invalid tunnel signature')).toBe(false);
	});

	it('toNuxtHandler falls back lossily for h3 _body when only readBody ran', async () => {
		env = createTestDatabase();
		const handler = toNuxtHandler(makeCorsair(env), { basePath: BASE });
		// readBody(event) PARSED the JSON; raw bytes are unrecoverable, so the
		// re-serialized body must fail the non-canonical signature — same trap
		// as express.json(), now at least with a deterministic outcome.
		const { body, headers } = makeSignedNonCanonicalDelivery();
		const { event, text } = makeNuxtEventWithCache({
			headers,
			parsedBody: JSON.parse(body),
		});
		await handler(event);
		expect(text().includes('Invalid tunnel signature')).toBe(true);
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
