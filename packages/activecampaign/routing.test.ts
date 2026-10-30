import type { z } from 'zod';
import { ActiveCampaignEndpointInputSchemas } from './endpoints/types';
import { activecampaign, activecampaignEndpointMeta } from './index';

/**
 * Exercises every registered operation against a mocked fetch and asserts the
 * request it actually issues.
 *
 * This is the test that catches the bug class unit tests usually miss: a
 * plausible but wrong URL. Three real routing errors were found this way
 * against the live API - `siteTrackingWhitelist` (the route is
 * `siteTracking/whitelist`), `dealOwners/bulkUpdate` (it is
 * `deals/bulkUpdate/owners`), and `smsBroadcasts` (it is `sms/broadcasts`) -
 * and none of them would fail a schema or registry test.
 *
 * Inputs are generated from each operation's own zod schema rather than
 * hand-written 275 times, by parsing an empty object and filling whatever the
 * schema complains about until it is satisfied. That keeps the test honest: it
 * uses the same schema the runtime validates against.
 */

const SCHEMAS = ActiveCampaignEndpointInputSchemas as unknown as Record<
	string,
	z.ZodType | undefined
>;

/** Looks up an operation's input schema, failing loudly if it is missing. */
function schemaFor(key: string): z.ZodType {
	const schema = SCHEMAS[key];
	if (!schema) throw new Error(`No input schema registered for ${key}`);
	return schema;
}

const ACCOUNT = 'example';
const TOKEN = 'test-token-value';
const EXPECTED_BASE = `https://${ACCOUNT}.api-us1.com/api/3`;

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

/**
 * Enough of a response for every envelope the plugin reads. Composite
 * operations look a contact up before routing, so an empty body would make
 * them throw before issuing the request this test exists to check.
 */
const MOCK_BODY = {
	contacts: [{ id: '1' }],
	contactAutomations: [{ id: '1', automation: 'xx' }],
	meta: { total: '1' },
};

/**
 * GraphQL is POST-only, including for queries, so a read there is still a
 * POST. Event tracking posts to a separate host entirely.
 */
const GRAPHQL_PATH = '/ecom/graphql';
const TRACKING_HOST = 'https://trackcmp.net/';

/**
 * Builds a minimal valid input by walking the schema itself.
 *
 * Driving this from the schema rather than a hand-written fixture per
 * operation means the 275 routing cases below use exactly the shape the
 * runtime validates, and a schema change cannot leave a stale fixture behind.
 */
function sampleInput(schema: z.ZodType): Record<string, unknown> {
	const minimal = (sampleFor(schema) ?? {}) as Record<string, unknown>;
	if (schema.safeParse(minimal).success) return minimal;

	// A cross-field refinement can make the minimal object invalid - the
	// stage-delete schema requires the relocation targets when action_type is
	// 'Move'. Filling the optional keys as well satisfies those.
	const def = defOf(schema);
	const full: Record<string, unknown> = { ...minimal };
	for (const [key, child] of Object.entries(def?.shape ?? {})) {
		if (full[key] !== undefined) continue;
		const v = sampleFor(child);
		if (v !== undefined) full[key] = v;
	}
	return full;
}

interface ZodDef {
	type: string;
	shape?: Record<string, z.ZodType>;
	element?: z.ZodType;
	innerType?: z.ZodType;
	entries?: Record<string, unknown>;
	options?: z.ZodType[];
	values?: unknown[];
}

function defOf(schema: z.ZodType): ZodDef {
	return (schema as unknown as { def: ZodDef }).def;
}

/** Candidate strings, in order, so a format-checked string still validates. */
const STRING_CANDIDATES = [
	'xx',
	'someone@example.com',
	'https://example.com',
	'2026-08-14T00:00:00Z',
];

function sampleFor(schema: z.ZodType): unknown {
	const def = defOf(schema);
	if (!def) return undefined;

	switch (def.type) {
		case 'optional':
		case 'nullable':
		case 'default':
		case 'catch':
			return def.innerType ? sampleFor(def.innerType) : undefined;

		case 'object': {
			const out: Record<string, unknown> = {};
			for (const [key, child] of Object.entries(def.shape ?? {})) {
				// Omitting optional keys keeps the sample minimal, which is what
				// makes an accidental required-field regression visible.
				if (child.safeParse(undefined).success) continue;
				const v = sampleFor(child);
				if (v !== undefined) out[key] = v;
			}
			return out;
		}

		case 'array':
			return def.element ? [sampleFor(def.element)] : [];

		case 'enum':
			return Object.values(def.entries ?? {})[0];

		case 'literal':
			return def.values?.[0];

		case 'union': {
			const first = def.options?.[0];
			return first ? sampleFor(first) : undefined;
		}

		case 'record':
			return {};

		case 'number':
		case 'int':
			return 1;

		case 'boolean':
			return true;

		case 'string': {
			for (const candidate of STRING_CANDIDATES) {
				if (schema.safeParse(candidate).success) return candidate;
			}
			return 'xx';
		}

		default:
			return {};
	}
}

interface Captured {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
}

function readHeaders(init?: RequestInit): Record<string, string> {
	const raw = init?.headers;
	if (!raw) return {};
	if (raw instanceof Headers) return Object.fromEntries(raw.entries());
	if (Array.isArray(raw)) return Object.fromEntries(raw);
	return { ...(raw as Record<string, string>) };
}

describe('operation routing', () => {
	const plugin = activecampaign({ key: TOKEN, account: ACCOUNT });
	const tree = plugin.endpoints as Record<string, Record<string, AnyEndpoint>>;
	const META = activecampaignEndpointMeta as Record<
		string,
		{ riskLevel: string }
	>;

	const originalFetch = globalThis.fetch;
	let calls: Captured[] = [];
	let warn: jest.SpyInstance;

	beforeEach(() => {
		calls = [];
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({
				url: String(url),
				method: init?.method ?? 'GET',
				headers: readHeaders(init),
				body: typeof init?.body === 'string' ? init.body : undefined,
			});
			// Every envelope key the plugin reads is absent, which exercises the
			// "no rows" path rather than the happy path.
			return new Response(JSON.stringify(MOCK_BODY), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
		// The event logger has no database in this harness and warns; that is
		// expected and must not drown the output.
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		warn.mockRestore();
	});

	function makeCtx() {
		return {
			key: TOKEN,
			options: { account: ACCOUNT },
			keys: { get_account: async () => ACCOUNT },
			db: {},
			$getAccountId: async () => 'test-account',
			database: undefined,
		};
	}

	/** Every registered operation, flattened to (path, handler). */
	const OPERATIONS: Array<[string, AnyEndpoint]> = Object.entries(tree).flatMap(
		([group, leaves]) =>
			Object.entries(leaves).map(
				([leaf, fn]) => [`${group}.${leaf}`, fn] as [string, AnyEndpoint],
			),
	);

	it('exposes every operation in the registry', () => {
		expect(OPERATIONS).toHaveLength(304);
		expect(OPERATIONS).toHaveLength(Object.keys(META).length);
	});

	it('generates a valid input for every operation schema', () => {
		const schemas = SCHEMAS;
		const unbuildable: string[] = [];
		for (const [path] of OPERATIONS) {
			const key = path.replace(/\.(.)/g, (_m, c: string) => c.toUpperCase());
			const schema = schemas[key];
			expect(schema).toBeDefined();
			if (schema && !schema.safeParse(sampleInput(schema)).success) {
				unbuildable.push(path);
			}
		}
		// A schema this cannot satisfy would silently skip the routing checks
		// below, so the list has to be empty rather than merely short.
		expect(unbuildable).toEqual([]);
	});

	describe.each(OPERATIONS)('%s', (path, handler) => {
		const key = path.replace(/\.(.)/g, (_m, c: string) => c.toUpperCase());
		const schema = schemaFor(key);

		it('issues a request to the account base URL with the token in a header', async () => {
			await handler(makeCtx(), sampleInput(schema));

			expect(calls.length).toBeGreaterThan(0);
			for (const call of calls) {
				// Event tracking deliberately posts to a separate host.
				if (call.url.startsWith(TRACKING_HOST)) continue;

				expect(call.url.startsWith(EXPECTED_BASE)).toBe(true);

				const headerNames = Object.keys(call.headers).map((h) =>
					h.toLowerCase(),
				);
				expect(headerNames).toContain('api-token');

				// A credential in the query string would leak into logs and
				// referrer headers.
				expect(call.url).not.toContain(TOKEN);
			}
		});

		it('uses a method consistent with its declared risk level', async () => {
			await handler(makeCtx(), sampleInput(schema));
			const external = calls.filter((c) => !c.url.startsWith(TRACKING_HOST));
			if (external.length === 0) {
				// Event tracking posts only to the separate tracking host.
				expect(calls.some((c) => c.url.startsWith(TRACKING_HOST))).toBe(true);
				return;
			}

			const rest = external.filter((c) => !c.url.includes(GRAPHQL_PATH));
			const methods = rest.map((c) => c.method.toUpperCase());
			if (rest.length === 0) {
				// A GraphQL-only operation: POST is correct even for a query.
				expect(external.length).toBeGreaterThan(0);
				expect(external.every((c) => c.method.toUpperCase() === 'POST')).toBe(
					true,
				);
				return;
			}
			if (META[path]?.riskLevel === 'read') {
				// A REST read must never issue a state-changing request.
				expect(methods.every((m) => m === 'GET')).toBe(true);
			} else {
				expect(methods.some((m) => m !== 'GET')).toBe(true);
			}
		});

		it('never interpolates undefined into the path', async () => {
			await handler(makeCtx(), sampleInput(schema));
			for (const call of calls) {
				expect(call.url).not.toContain('/undefined');
				expect(call.url).not.toContain('undefined?');
				expect(call.url).not.toMatch(/=undefined(&|$)/);
			}
		});
	});
});

describe('destructive operations', () => {
	const plugin = activecampaign({ key: TOKEN, account: ACCOUNT });
	const tree = plugin.endpoints as Record<string, Record<string, AnyEndpoint>>;
	const META = activecampaignEndpointMeta as Record<
		string,
		{ riskLevel: string }
	>;

	const originalFetch = globalThis.fetch;
	let calls: Captured[] = [];
	let warn: jest.SpyInstance;

	beforeEach(() => {
		calls = [];
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({
				url: String(url),
				method: init?.method ?? 'GET',
				headers: readHeaders(init),
			});
			return new Response(JSON.stringify(MOCK_BODY), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		warn.mockRestore();
	});

	const DESTRUCTIVE = Object.entries(tree)
		.flatMap(([group, leaves]) =>
			Object.entries(leaves).map(
				([leaf, fn]) => [`${group}.${leaf}`, fn] as [string, AnyEndpoint],
			),
		)
		.filter(([path]) => META[path]?.riskLevel === 'destructive');

	it('has destructive operations to check', () => {
		// Without this the loop below would pass by matching nothing.
		expect(DESTRUCTIVE).toHaveLength(46);
	});

	it.each(DESTRUCTIVE)(
		'%s issues a DELETE or an explicit bulk write',
		async (path, handler) => {
			const key = path.replace(/\.(.)/g, (_m, c: string) => c.toUpperCase());
			const schema = schemaFor(key);

			await handler(
				{
					key: TOKEN,
					options: { account: ACCOUNT },
					keys: { get_account: async () => ACCOUNT },
					db: {},
					$getAccountId: async () => 'test-account',
					database: undefined,
				},
				sampleInput(schema),
			);

			const methods = calls.map((c) => c.method.toUpperCase());
			// Most deletes are a DELETE; the bulk ones POST an id list, and the
			// stage-delete-with-move issues a PUT before its DELETE.
			expect(
				methods.includes('DELETE') ||
					methods.includes('POST') ||
					methods.includes('PATCH'),
			).toBe(true);
		},
	);
});
