import { AuthMissingError } from 'corsair/core';
import { twelvedata, twelvedataEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof twelvedata>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

// The indicator names, which are also the route names.
const indicators = [
	'adx',
	'apo',
	'atr',
	'bbands',
	'beta',
	'cci',
	'correl',
	'ema',
	'macd',
	'max',
	'mfi',
	'min',
	'ppo',
	'roc',
	'rsi',
	'sma',
	'stddev',
	'stoch',
	'stochrsi',
	'supertrend',
	'tsf',
	'ultosc',
	'vwma',
	'willr',
	'wma',
];

const operations = [
	'market.apiUsage',
	'market.exchangeRate',
	'market.price',
	'market.quote',
	'market.timeSeries',
	'reference.cryptocurrencies',
	'reference.bonds',
	'reference.etf',
	'reference.exchanges',
	'reference.funds',
	'reference.forexPairs',
	'reference.stocks',
	...indicators.map((name) => `indicators.${name}`),
].sort();

describe('twelvedata plugin definition', () => {
	const plugin = twelvedata();

	it('registers as twelvedata with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('twelvedata');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('has 37 operations', () => {
		expect(operations).toHaveLength(37);
	});

	it('gives every endpoint a description and reads only', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry?.description?.length ?? 0).toBeGreaterThan(10);
			// Every wrapped route is a GET over market data.
			expect(entry?.riskLevel).toBe('read');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(twelvedataEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(twelvedataEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('names no route twice', () => {
		const nested = Object.values(plugin.endpoints ?? {}).flatMap((group) =>
			Object.values(group),
		);
		expect(new Set(nested).size).toBe(nested.length);
	});
});

describe('twelvedata key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = twelvedata({ key: 'inline-key' });
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = twelvedata();
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = twelvedata();
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
