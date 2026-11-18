import type { z } from 'zod';
import { finageEndpointSchemas } from './index';

// jest-yaml-transform turns the yaml into a plain object; only apiExamples is
// read here.
const docs = require('./plugin-docs.yaml') as {
	// unknown: example args are free-form JSON; `call` entries are raw TS.
	apiExamples?: Record<string, Record<string, unknown> | { call: string }>;
};

// unknown: each operation has its own input schema; only parsing is needed here.
const schemas = finageEndpointSchemas as Record<
	string,
	{ input: z.ZodType<unknown> }
>;

// `call` entries are TypeScript text the docs generator prints verbatim. They're
// used where its type check can't read a literal union, so the same arguments are
// written out here and the text is checked against them.
// unknown: the arguments are free-form JSON.
const callArgs: Record<string, Record<string, unknown>> = {
	'market.getBalanceSheetStatements': {
		symbol: 'AAPL',
		limit: 5,
		period: 'annual',
	},
	'market.getCanadaMarketAggregates': {
		symbol: 'BB',
		time: '1day',
		from: '2025-01-01',
		to: '2025-02-01',
	},
	'market.getCashFlowStatements': {
		symbol: 'AAPL',
		limit: 5,
		period: 'annual',
	},
	'market.getCfdEtfMarketAggregates': {
		symbol: 'QQQ',
		time: '1day',
		from: '2025-01-01',
		to: '2025-02-01',
	},
	'market.getCfdIndexMarketAggregates': {
		symbol: 'US2000',
		time: '1day',
		from: '2025-01-01',
		to: '2025-02-01',
	},
	'market.getCryptoAggregates': {
		symbol: 'BTCUSD',
		multiply: 1,
		time: 'day',
		from: '2025-01-01',
		to: '2025-02-01',
		limit: 100,
		sort: 'desc',
	},
	'market.getForexMarketAggregates': {
		symbol: 'GBPUSD',
		multiply: 1,
		time: 'day',
		from: '2025-01-01',
		to: '2025-02-01',
	},
	'market.getForexSignal': { interval: 'daily', symbol: 'EURUSD' },
	'market.getIncomeStatements': {
		symbol: 'AAPL',
		exchange_code: 'TO',
		limit: 5,
		period: 'annual',
	},
	'market.getIndianMarketAggregates': {
		symbol: 'IDEA',
		time: '1day',
		from: '2025-01-01',
		to: '2025-02-01',
	},
	'market.getRussianMarketAggregates': {
		symbol: 'AFKS',
		time: '1day',
		from: '2025-01-01',
		to: '2025-02-01',
	},
	'market.getStockMarketAggregates': {
		symbol: 'AAPL',
		multiply: 1,
		time: 'day',
		from: '2025-01-01',
		to: '2025-02-01',
	},
	'market.getTechnicalIndicators': {
		symbol: 'AAPL',
		type: 'SMA',
		time: 'daily',
		period: 14,
	},
	'market.getUkMarketAggregates': {
		symbol: 'BP',
		time: '1day',
		from: '2025-01-01',
		to: '2025-02-01',
	},
	'market.getUsStocksSignal': { interval: 'daily', symbol: 'AAPL' },
	'market.listCryptocurrencies': { limit: 10, page: 1, sort: 'ASC' },
	'market.listSymbols': { market: 'forex', page: 1, search: 'GBP' },
};

// unknown: see callArgs.
const examples: Record<string, Record<string, unknown>> = Object.fromEntries(
	Object.entries(docs.apiExamples ?? {}).map(([id, entry]) => {
		if (typeof entry.call !== 'string') return [id, entry];
		const args = callArgs[id];
		if (!args) throw new Error(`${id}: call example has no args in callArgs`);
		// Compare with whitespace dropped: the yaml text is spaced for readers.
		const literal = JSON.stringify(args)
			.replace(/"(\w+)":/g, '$1:')
			.replace(/"/g, "'")
			.replace(/\s+/g, '');
		if (literal !== entry.call.replace(/\s+/g, '')) {
			throw new Error(`${id}: call example differs from callArgs`);
		}
		return [id, args];
	}),
);

// Keys a schema declares, read through refinements and passthrough wrappers so
// an example can't carry a field the operation silently forwards unchecked.
function declaredKeys(schema: z.ZodType<unknown>): Set<string> | undefined {
	// unknown: zod's internal def shape differs between wrapper types.
	let current: unknown = schema;
	for (let depth = 0; depth < 5 && current; depth += 1) {
		const shape = (current as { shape?: Record<string, unknown> }).shape;
		if (shape) return new Set(Object.keys(shape));
		const def = (current as { _zod?: { def?: Record<string, unknown> } })._zod
			?.def;
		current = def?.in ?? def?.schema ?? def?.innerType;
	}
	return undefined;
}

describe('plugin-docs.yaml apiExamples', () => {
	it('gives an example to every operation that has required inputs', () => {
		const missing = Object.entries(schemas)
			.filter(([, { input }]) => !input.safeParse({}).success)
			.map(([id]) => id)
			.filter((id) => !(id in examples));
		expect(missing).toEqual([]);
	});

	it('names only real operations', () => {
		expect(Object.keys(examples).filter((id) => !(id in schemas))).toEqual([]);
	});

	it.each(Object.entries(examples))(
		'%s example parses with its input schema',
		(id, args) => {
			const schema = schemas[id]?.input;
			expect(schema).toBeDefined();
			if (!schema) return;
			expect(schema.safeParse(args).error?.issues ?? []).toEqual([]);
			const keys = declaredKeys(schema);
			expect(keys).toBeDefined();
			expect(Object.keys(args).filter((key) => !keys?.has(key))).toEqual([]);
		},
	);
});
