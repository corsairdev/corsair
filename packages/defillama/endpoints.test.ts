import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { DEFILLAMA_PRO_URL, defillamaErrorMessage } from './client';
import { defillamaEndpointsNested } from './endpoints/catalog';
import {
	defillamaDefinitions,
	defillamaOperations,
} from './endpoints/manifest';
import type { DefillamaContext } from './index';

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

const KEY = 'pro-key-0123456789abcdef';

function ctx(key = KEY): DefillamaContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
		options: {},
		keys: {},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as DefillamaContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: DefillamaContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = defillamaEndpointsNested;
	for (const part of id.split('.'))
		node = (node as Record<string, unknown>)[part];
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

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
		node = defillamaDefinitions[ref];
	}
	return {};
}

/** A body the operation's output schema accepts, by its top-level type. */
// `unknown` because the sample is any JSON value.
function sampleOutput(id: string): unknown {
	const operation = defillamaOperations.find((o) => o.id === id);
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
	it.each(defillamaOperations.map((o) => o.id))(
		'%s goes to Pro with the key in the path, and to its free host without a key',
		async (id) => {
			const operation = defillamaOperations.find((o) => o.id === id);
			if (!operation) throw new Error(id);
			reply(() => ({ status: 200, body: sampleOutput(id) }));
			const args = docs.apiExamples[id]?.args ?? {};
			await call(id, args);
			const pro = new URL(calls[0]?.url ?? '');
			expect(calls[0]?.method).toBe('GET');
			expect(pro.origin).toBe(DEFILLAMA_PRO_URL);
			expect(pro.pathname).toMatch(
				new RegExp(
					`^${operation.path.replace('{api_key}', KEY).replace(/{[^}]+}/g, '[^/]+')}$`,
				),
			);
			calls = [];
			if (operation.free) {
				await call(id, args, ctx(''));
				const free = new URL(calls[0]?.url ?? '');
				expect(free.origin).toBe(operation.free.base);
				expect(free.pathname).toMatch(
					new RegExp(`^${operation.free.path.replace(/{[^}]+}/g, '[^/]+')}$`),
				);
				expect(calls[0]?.url).not.toContain(KEY);
			} else {
				await expect(call(id, args, ctx(''))).rejects.toBeInstanceOf(
					AuthMissingError,
				);
				expect(calls).toHaveLength(0);
			}
		},
	);
});

describe('requests', () => {
	it('keeps the : and , of a coin list in the path', async () => {
		reply(() => ({ status: 200, body: { coins: {} } }));
		await call(
			'coins.current',
			{
				coins:
					'coingecko:ethereum,ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7',
			},
			ctx(''),
		);
		expect(calls[0]?.url).toBe(
			'https://coins.llama.fi/prices/current/coingecko:ethereum,ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7',
		);
	});

	it('puts the key after the route for account.usage', async () => {
		reply(() => ({ status: 200, body: {} }));
		await call('account.usage', {});
		expect(calls[0]?.url).toBe(`${DEFILLAMA_PRO_URL}/usage/${KEY}`);
	});

	it('refuses unknown input fields', async () => {
		reply(() => ({ status: 200, body: [] }));
		await expect(call('tvl.protocols', { nope: 1 })).rejects.toThrow(
			/unknown field/,
		);
		expect(calls).toHaveLength(0);
	});
});

describe('errors', () => {
	it("keeps DefiLlama's reason and drops the key from the URL and body", async () => {
		reply(() => ({
			status: 400,
			body: { message: `bad key ${KEY} for protocol` },
		}));
		const error = await call('tvl.protocol', { protocol: 'aave' }).catch(
			(e: unknown) => e,
		);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(400);
		expect(apiError.message).toMatch(/^DefiLlama 400: bad key/);
		expect(apiError.message).not.toContain(KEY);
		expect(apiError.url).not.toContain(KEY);
		expect(JSON.stringify(apiError.request)).not.toContain(KEY);
	});

	it('reads each error shape', () => {
		expect(defillamaErrorMessage(404, 'Not Found', 'Protocol not found')).toBe(
			'DefiLlama 404: Protocol not found',
		);
		expect(defillamaErrorMessage(402, '', { error: 'Pro-only endpoint' })).toBe(
			'DefiLlama 402: Pro-only endpoint',
		);
	});
});

describe('review round 1', () => {
	it('keeps the key out of the reason phrase and out of error-body keys', async () => {
		jest.spyOn(globalThis, 'fetch').mockImplementation(
			async () =>
				new Response(JSON.stringify({ [KEY]: 'invalid key' }), {
					status: 401,
					statusText: `Bad key ${KEY}`,
					headers: { 'content-type': 'application/json' },
				}),
		);
		const error = await call('tvl.protocols', {}).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(401);
		expect(apiError.statusText).not.toContain(KEY);
		expect(apiError.message).not.toContain(KEY);
		expect(JSON.stringify(apiError.body)).not.toContain(KEY);
		expect(apiError.body).toEqual({ '[REDACTED]': 'invalid key' });
	});

	it('checks every returned coin, not only the example address', async () => {
		reply(() => ({
			status: 200,
			body: {
				coins: {
					'coingecko:ethereum': {
						price: 3000,
						symbol: 'ETH',
						timestamp: 1764547200,
					},
				},
			},
		}));
		await expect(
			call('coins.current', { coins: 'coingecko:ethereum' }),
		).resolves.toEqual({
			coins: {
				'coingecko:ethereum': {
					price: 3000,
					symbol: 'ETH',
					timestamp: 1764547200,
				},
			},
		});
		reply(() => ({
			status: 200,
			body: { coins: { 'coingecko:ethereum': { price: 'n/a' } } },
		}));
		await expect(
			call('coins.current', { coins: 'coingecko:ethereum' }),
		).rejects.toThrow(/did not match/);
		// An empty result is still a result.
		reply(() => ({ status: 200, body: { coins: {} } }));
		await expect(
			call('coins.percentageChange', { coins: 'coingecko:ethereum' }),
		).resolves.toEqual({ coins: {} });
	});

	it('accepts a null historical stablecoin quote', async () => {
		reply(() => ({
			status: 200,
			body: [{ date: 1764547200, prices: { tether: 1, frax: null } }],
		}));
		await expect(call('stablecoins.prices', {})).resolves.toEqual([
			{ date: 1764547200, prices: { tether: 1, frax: null } },
		]);
	});

	it('sends activeMcap and repeated chain and protocol filters', async () => {
		reply(() => ({ status: 200, body: [] }));
		await call('rwa.chartByChain', { key: 'activeMcap' });
		expect(calls[0]?.url).toContain('key=activeMcap');
		reply(() => ({ status: 200, body: { data: [] } }));
		await call('yields.earn.query', {
			chain: ['ethereum', 'arbitrum'],
			protocol: 'aave-v3',
		});
		expect(calls[1]?.url).toContain('chain=ethereum&chain=arbitrum');
		expect(calls[1]?.url).toContain('protocol=aave-v3');
		await expect(
			call('yields.earn.query', {
				chain: Array.from({ length: 21 }, (_, i) => `c${i}`),
			}),
		).rejects.toThrow(/Invalid input/);
	});

	it('checks positional rows as tuples', async () => {
		const row = [1764547200, 1, 2, 0.5, 1.5, 100];
		reply(() => ({ status: 200, body: { ohlcv: [row] } }));
		await expect(
			call('dat.institution', { symbol: 'MSTR' }),
		).resolves.toMatchObject({ ohlcv: [row] });
		reply(() => ({ status: 200, body: { ohlcv: [['not a candle']] } }));
		await expect(call('dat.institution', { symbol: 'MSTR' })).rejects.toThrow(
			/did not match/,
		);
	});

	it('refuses a missing body on an untyped route', async () => {
		reply(() => ({ status: 204 }));
		await expect(call('account.usage', {})).rejects.toThrow(/without a body/);
		reply(() => ({ status: 200, body: 0 }));
		await expect(call('account.usage', {})).resolves.toBe(0);
	});
});
