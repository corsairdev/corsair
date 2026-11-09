import { AuthMissingError } from 'corsair/core';
import type { CoinMarketCapKeyBuilderContext } from './index';
import { CoinMarketCapAPIError, coinmarketcap } from './index';

const OPERATIONS = [
	'cryptocurrency.info',
	'cryptocurrency.listings',
	'cryptocurrency.map',
	'cryptocurrency.quotes',
	'exchange.info',
	'globalMetrics.quotes',
	'key.info',
	'tools.priceConversion',
] as const;

type EndpointMeta = { riskLevel: string; description: string };
type SchemaPair = { input?: unknown; output?: unknown };
type KeyBuilder = (
	ctx: CoinMarketCapKeyBuilderContext,
	source: string,
) => Promise<string>;

const INLINE_KEY = 'inline-key';

/** Reads a field that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

function flatten(endpoints: Record<string, unknown>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, unknown>)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

// A fixture cannot be typed as KeyBuilderContext directly: `keys` must be a
// full AccountKeyManager. Only get_api_key is read here.
function keyContext(stored: string | undefined) {
	return {
		authType: 'api_key',
		keys: {
			get_api_key: async () => stored,
		},
	} as unknown as CoinMarketCapKeyBuilderContext;
}

describe('coinmarketcap plugin', () => {
	const plugin = coinmarketcap();
	const meta = plugin.endpointMeta as unknown as Record<string, EndpointMeta>;
	const schemas = plugin.endpointSchemas as unknown as Record<
		string,
		SchemaPair
	>;
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	it('has the id the constants file registers', () => {
		expect(plugin.id).toBe('coinmarketcap');
	});

	it('defaults to api_key auth', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers exactly the eight documented operations', () => {
		expect(flatten(plugin.endpoints as Record<string, unknown>)).toEqual([
			...OPERATIONS,
		]);
	});

	it('declares every operation as a read', () => {
		// CoinMarketCap has no write API, so no operation may claim otherwise.
		const risks = Object.values(meta).map((entry) => entry.riskLevel);
		expect(risks).toHaveLength(8);
		expect(risks.every((risk) => risk === 'read')).toBe(true);
	});

	it('documents every operation', () => {
		for (const [operation, entry] of Object.entries(meta)) {
			expect(entry.description.length).toBeGreaterThan(20);
			expect(operation).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('supplies an input and an output schema for every operation', () => {
		expect(Object.keys(schemas).sort()).toEqual(Object.keys(meta).sort());
		for (const operation of OPERATIONS) {
			const pair = required(schemas, operation);
			expect(pair.input).toBeDefined();
			expect(pair.output).toBeDefined();
		}
	});

	it('receives no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		// The matcher takes a delivery the plugin never expects.
		const matcher = plugin.pluginWebhookMatcher;
		expect(matcher).toBeDefined();
		expect(matcher?.({} as never)).toBe(false);
	});

	it('registers an error handler map with DEFAULT last', () => {
		const handlers = plugin.errorHandlers as unknown as Record<string, unknown>;
		expect(Object.keys(handlers).at(-1)).toBe('DEFAULT');
	});

	describe('keyBuilder', () => {
		it('prefers the inline key over the stored one', async () => {
			const configured = coinmarketcap({ key: INLINE_KEY });
			await expect(
				keyBuilderOf(configured)(keyContext('stored'), 'endpoint'),
			).resolves.toBe(INLINE_KEY);
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored'), 'endpoint'),
			).resolves.toBe('stored');
		});

		it('throws AuthMissingError when neither exists', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('reads only get_api_key from the key manager', async () => {
			// An api_key integration only generates accessors for account-level
			// authConfig fields, so get_api_key is the only method that exists.
			// This fails if the keyBuilder reaches for another one.
			const calls: string[] = [];
			const ctx = {
				authType: 'api_key',
				keys: {
					get_api_key: async () => {
						calls.push('get_api_key');
						return 'stored';
					},
				},
			} as unknown as CoinMarketCapKeyBuilderContext;

			await keyBuilderOf(plugin)(ctx, 'endpoint');
			expect(calls).toEqual(['get_api_key']);
		});
	});
});

describe('exports', () => {
	it('exports the error class so callers can narrow a failure', () => {
		expect(CoinMarketCapAPIError.prototype).toBeInstanceOf(Error);
	});
});
