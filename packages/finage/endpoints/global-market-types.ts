import { z } from 'zod';
import { finageJsonValue, outArray, outNumber, outText } from './json-value';

const text = z.string().min(1);
const positiveInteger = z.number().int().positive();
const time = z.enum([
	'1min',
	'5min',
	'15min',
	'30min',
	'45min',
	'1h',
	'2h',
	'4h',
	'1day',
	'1week',
	'1month',
]);
// Provider payloads may contain additional JSON fields beyond the stable values
// documented for each market family.
const priceResponse = z
	.object({
		symbol: outText,
		price: outNumber,
		timestamp: z.union([outNumber, outText]),
	})
	.catchall(finageJsonValue);
const aggregateBar = z
	.object({
		o: z.union([outNumber, outText]),
		h: z.union([outNumber, outText]),
		l: z.union([outNumber, outText]),
		c: z.union([outNumber, outText]),
		v: z.union([outNumber, outText]).optional(),
		t: z.union([outNumber, outText]),
	})
	.catchall(finageJsonValue);
const aggregateResponse = z
	.object({
		symbol: outText,
		totalResults: outNumber,
		results: outArray(aggregateBar),
	})
	.catchall(finageJsonValue);

const marketAggregateInput = z.object({
	symbol: text,
	time,
	from: text,
	to: text,
	limit: positiveInteger.max(5000).optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	date_format: z.enum(['dt', 'ts']).optional(),
	dbt_filter: z.boolean().optional(),
	st: text.optional(),
	et: text.optional(),
});
export const FinageGlobalMarketInputSchemas = {
	getCanadaMarketAggregates: marketAggregateInput,
	getCanadaMarketLastPrice: z.object({ symbol: text }),
	getCfdEtfLastPrice: z.object({ symbol: text }),
	getCfdEtfMarketAggregates: marketAggregateInput,
	getCfdEtfPreviousClose: z.object({ symbol: text }),
	getCfdIndexLastPrice: z.object({ symbol: text }),
	getCfdIndexMarketAggregates: marketAggregateInput,
	getCfdIndexPreviousClose: z.object({ symbol: text }),
	getIndianMarketAggregates: marketAggregateInput,
	getIndianMarketLastPrice: z.object({ symbol: text }),
	getRussianMarketAggregates: marketAggregateInput,
	getRussianMarketLastPrice: z.object({ symbol: text }),
	getUkMarketAggregates: marketAggregateInput,
	getUkMarketLastPrice: z.object({ symbol: text }),
} as const;

export const FinageGlobalMarketOutputSchemas = {
	getCanadaMarketAggregates: aggregateResponse,
	getCanadaMarketLastPrice: priceResponse,
	getCfdEtfLastPrice: priceResponse,
	getCfdEtfMarketAggregates: aggregateResponse,
	getCfdEtfPreviousClose: aggregateResponse,
	getCfdIndexLastPrice: priceResponse,
	getCfdIndexMarketAggregates: aggregateResponse,
	getCfdIndexPreviousClose: aggregateResponse,
	getIndianMarketAggregates: aggregateResponse,
	getIndianMarketLastPrice: priceResponse,
	getRussianMarketAggregates: aggregateResponse,
	getRussianMarketLastPrice: priceResponse,
	getUkMarketAggregates: aggregateResponse,
	getUkMarketLastPrice: priceResponse,
} as const;
