import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	POLYMARKET_HOSTS,
	polymarketErrorMessage,
	polymarketHmacSignature,
	serializePolymarketCredentials,
} from './client';
import { polymarketEndpointsNested } from './endpoints/catalog';
import {
	polymarketDefinitions,
	polymarketOperations,
} from './endpoints/manifest';
import type { PolymarketContext } from './index';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body: unknown;
};
let calls: Captured[] = [];

type Answer = { status: number; body?: unknown; contentType?: string };

function reply(answer: (url: string) => Answer) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		const url = String(input);
		calls.push({
			url,
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const { status, body, contentType = 'application/json' } = answer(url);
		const payload =
			body === undefined
				? null
				: typeof body === 'string' || body instanceof Uint8Array
					? body
					: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: { 'content-type': contentType },
		});
	});
}

// base64url of "0123456789abcdef0123456789abcdef", as the CLOB issues secrets.
const SECRET = 'MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=';
const CLOB = {
	apiKey: '11111111-2222-3333-4444-555555555555',
	secret: SECRET,
	passphrase: 'passphrase-value',
	address: '0x56687bf447db6ffa42ffe2204a05edaa20f55839',
};
const OPTIONS = {
	perps: {
		proxy: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
		secret: 'perps-secret-value',
	},
	rfq: { keyId: 'rfq-key-id', secret: 'rfq-secret' },
	relayer: { apiKey: 'relayer-key-value', address: CLOB.address },
};

function ctx(
	key = serializePolymarketCredentials({ clob: CLOB, ...OPTIONS }),
): PolymarketContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
		options: {},
		keys: {},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as PolymarketContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: PolymarketContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = polymarketEndpointsNested;
	for (const part of id.split('.'))
		node = (node as Record<string, unknown>)[part];
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const ORDER = (
	require('./plugin-docs.yaml') as {
		apiExamples: Record<string, { args: Record<string, unknown> }>;
	}
).apiExamples['clob.orders.create']?.args;

const call = (id: string, input: unknown, c = ctx()) =>
	endpointFor(id)(c, input);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

// `unknown` because an output schema is provider JSON Schema.
function resolve(schema: unknown): Record<string, unknown> {
	let node = schema;
	for (let i = 0; i < 20; i++) {
		if (typeof node !== 'object' || node === null) return {};
		const ref = (node as { $ref?: unknown }).$ref;
		if (typeof ref !== 'string') return node as Record<string, unknown>;
		node = polymarketDefinitions[ref];
	}
	return {};
}

/** A body the operation's output schema accepts, by its top-level type. */
// `unknown` because the sample is any JSON value.
function sampleOutput(id: string): unknown {
	const operation = polymarketOperations.find((o) => o.id === id);
	const output = resolve(operation?.output);
	let type = output.type;
	if (Array.isArray(type)) type = type.find((t) => t !== 'null');
	if (!type && Array.isArray(output.anyOf ?? output.oneOf)) {
		const first = resolve(((output.anyOf ?? output.oneOf) as unknown[])[0]);
		type = first.type;
	}
	switch (type) {
		case 'array':
			return [];
		case 'string':
			// Sent as the raw body, so a JSON string literal.
			return '"ok"';
		case 'integer':
		case 'number':
			return 1;
		case 'boolean':
			return true;
		default:
			return {};
	}
}

describe('every operation', () => {
	it.each(polymarketOperations.map((o) => o.id))(
		'%s goes to its host, method and path with its credential',
		async (id) => {
			const operation = polymarketOperations.find((o) => o.id === id);
			if (!operation) throw new Error(id);
			reply(() => {
				if (operation.response === 'text')
					return { status: 200, body: 'OK', contentType: 'text/plain' };
				if (operation.response === 'empty') return { status: 200 };
				return { status: 200, body: sampleOutput(id) };
			});
			await call(id, docs.apiExamples[id]?.args ?? {});
			const sent = new URL(calls[0]?.url ?? '');
			const headers = calls[0]?.headers ?? {};
			expect(calls[0]?.method).toBe(operation.method);
			expect(sent.origin).toBe(POLYMARKET_HOSTS[operation.host]);
			expect(sent.pathname).toMatch(
				new RegExp(`^${operation.path.replace(/{[^}]+}/g, '[^/]+')}$`),
			);
			const has = (name: string) => name.toLowerCase() in headers;
			expect(has('POLY_API_KEY')).toBe(operation.auth === 'clob');
			expect(has('POLY_NONCE')).toBe(operation.auth === 'clobL1');
			expect(has('POLYMARKET-SECRET')).toBe(operation.auth === 'perps');
			expect(has('RFQ-Signature')).toBe(operation.auth === 'rfq');
			expect(has('RELAYER_API_KEY')).toBe(operation.auth === 'relayer');
		},
	);
});

describe('credentials', () => {
	it('signs CLOB requests the way py-clob-client does', async () => {
		// Computed with Python's hmac + base64.urlsafe_b64encode.
		expect(
			polymarketHmacSignature(
				SECRET,
				'1700000000',
				'POST',
				'/order',
				'{"order":{"salt":1},"owner":"k","orderType":"GTC"}',
			),
		).toBe('gmYcWq1gPH90w_i-xqVu2n2ACYh3eMbWmJoEEfdldgE=');
		jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
		reply(() => ({ status: 200, body: { success: true, orderID: '0x1' } }));
		await call('clob.orders.create', ORDER);
		const headers = calls[0]?.headers ?? {};
		expect(headers.poly_address).toBe(CLOB.address);
		expect(headers.poly_api_key).toBe(CLOB.apiKey);
		expect(headers.poly_passphrase).toBe(CLOB.passphrase);
		expect(headers.poly_timestamp).toBe('1700000000');
		expect(headers.poly_signature).toBe(
			polymarketHmacSignature(
				SECRET,
				'1700000000',
				'POST',
				'/order',
				String(calls[0]?.body),
			),
		);
	});

	it('signs an RFQ call with the secret as given, path without the query', () => {
		expect(
			polymarketHmacSignature(
				'rfq-secret',
				'1700000000',
				'GET',
				'/v1/rfq-trades/trd_1',
				'',
				false,
			),
		).toBe('UZHp0NMMnAmQs48ApuYZo1Wgz9LdjBEdVfVN1NleJ-Q=');
	});

	it('runs public reads with no key and refuses account calls without one', async () => {
		reply(() => ({ status: 200, body: [] }));
		await call('gamma.markets.list', { limit: 1 }, ctx(''));
		expect(Object.keys(calls[0]?.headers ?? {})).not.toContain('poly_api_key');
		for (const id of [
			'clob.orders.list',
			'perps.account.balances',
			'rfq.trades.get',
			'relayer.apiKeys.list',
		]) {
			await expect(
				call(id, docs.apiExamples[id]?.args ?? {}, ctx('')),
			).rejects.toBeInstanceOf(AuthMissingError);
		}
		expect(calls).toHaveLength(1);
	});

	it('passes the wallet signature headers for L1 key routes', async () => {
		reply(() => ({
			status: 200,
			body: { apiKey: 'k', secret: 's', passphrase: 'p' },
		}));
		await call('clob.apiKeys.derive', {
			poly_address: CLOB.address,
			poly_signature: '0xsig',
			poly_timestamp: '1700000000',
			poly_nonce: '0',
		});
		expect(calls[0]?.headers).toMatchObject({
			poly_address: CLOB.address,
			poly_signature: '0xsig',
			poly_timestamp: '1700000000',
			poly_nonce: '0',
		});
	});

	it('signs relayer calls with builder credentials when there is no relayer key', async () => {
		jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
		reply(() => ({ status: 200, body: [] }));
		const builder = { apiKey: 'b-key', secret: SECRET, passphrase: 'b-pass' };
		await call(
			'relayer.transactions.list',
			{},
			ctx(serializePolymarketCredentials({ relayer: { builder } })),
		);
		expect(calls[0]?.headers).toMatchObject({
			poly_builder_api_key: 'b-key',
			poly_builder_passphrase: 'b-pass',
			poly_builder_timestamp: '1700000000',
			poly_builder_signature: polymarketHmacSignature(
				SECRET,
				'1700000000',
				'GET',
				'/transactions',
				'',
			),
		});
	});
});

describe('requests', () => {
	it('sends repeated keys for list query values', async () => {
		reply(() => ({ status: 200, body: [] }));
		await call('gamma.markets.list', { id: [1, 2], closed: 'false' });
		const sent = new URL(calls[0]?.url ?? '');
		expect(sent.searchParams.getAll('id')).toEqual(['1', '2']);
		expect(sent.searchParams.get('closed')).toBe('false');
	});

	it('sends a list body as the whole body', async () => {
		reply(() => ({ status: 200, body: [] }));
		await call('clob.books.listByBody', { body: [{ token_id: '1' }] });
		expect(calls[0]?.body).toBe('[{"token_id":"1"}]');
	});

	it('answers plain text as { text }', async () => {
		reply(() => ({ status: 200, body: 'OK', contentType: 'text/plain' }));
		await expect(call('gamma.status', {})).resolves.toEqual({ text: 'OK' });
	});

	it('refuses unknown input fields', async () => {
		reply(() => ({ status: 200, body: [] }));
		await expect(call('clob.books.get', { nope: 1 })).rejects.toThrow(
			/unknown field/,
		);
		expect(calls).toHaveLength(0);
	});
});

describe('errors', () => {
	it("keeps Polymarket's reason and drops the credentials and body", async () => {
		reply(() => ({
			status: 400,
			body: { error: `invalid order, key ${CLOB.apiKey}` },
		}));
		const error = await call('clob.orders.create', ORDER).catch(
			(e: unknown) => e,
		);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(400);
		expect(apiError.message).toMatch(/^Polymarket 400: invalid order/);
		expect(JSON.stringify(apiError.body)).not.toContain(CLOB.apiKey);
		expect(apiError.request.body).toBe('[REDACTED]');
		expect(apiError.request.headers).toBeUndefined();
	});

	it('scrubs the L1 wallet signature and address from an error', async () => {
		reply(() => ({
			status: 400,
			body: { error: `invalid signature 0xsig-value for ${CLOB.address}` },
		}));
		const error = await call('clob.apiKeys.derive', {
			poly_address: CLOB.address,
			poly_signature: '0xsig-value',
			poly_timestamp: '1700000000',
			poly_nonce: '0',
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const text = `${(error as ApiError).message} ${JSON.stringify((error as ApiError).body)}`;
		expect(text).toMatch(/^Polymarket 400: invalid signature/);
		expect(text).not.toContain('0xsig-value');
		expect(text).not.toContain(CLOB.address);
	});

	it('reads each API error shape', () => {
		expect(
			polymarketErrorMessage(404, 'Not Found', { error: 'market not found' }),
		).toBe('Polymarket 404: market not found');
		expect(
			polymarketErrorMessage(400, '', { code: 1002, msg: 'bad instrument' }),
		).toBe('Polymarket 400: bad instrument');
		expect(
			polymarketErrorMessage(422, '', {
				error: 'rejected',
				message: 'price outside band',
				details: { reason: 'PRICE_OUT_OF_BAND' },
			}),
		).toBe('Polymarket 422: rejected: price outside band; PRICE_OUT_OF_BAND');
	});
});
