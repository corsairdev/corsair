import { z } from 'zod';

const NonEmptyString = z.string().trim().min(1);
const DateString = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');
const IdentifierFields = {
	token_id: z.union([NonEmptyString, z.number()]).optional(),
	symbol: NonEmptyString.optional(),
};
const requireIdentifier = <T extends z.ZodTypeAny>(schema: T) =>
	schema.refine((value) => {
		const record = value as { token_id?: unknown; symbol?: unknown };
		return record.token_id !== undefined || record.symbol !== undefined;
	}, 'Provide token_id or symbol');

export const GetPriceInputSchema = requireIdentifier(
	z.object({
		...IdentifierFields,
		interval: NonEmptyString.optional(),
		startDate: DateString.optional(),
		endDate: DateString.optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		page: z.number().int().min(0).optional(),
	}),
);
export const GetTechnicalIndicatorsInputSchema = z.object({
	symbol: NonEmptyString,
	interval: NonEmptyString,
	indicator: NonEmptyString,
	startDate: DateString.optional(),
	endDate: DateString.optional(),
});
export const ListTokensInputSchema = z.object({
	...IdentifierFields,
	category: NonEmptyString.optional(),
	exchange: NonEmptyString.optional(),
	marketcap: z.number().nonnegative().optional(),
	volume: z.number().nonnegative().optional(),
	fdv: z.number().nonnegative().optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	page: z.number().int().min(0).optional(),
});
export const GetTopMarketCapInputSchema = z.object({
	top_k: z.number().int().min(1).max(1000).optional(),
	page: z.number().int().min(0).optional(),
});
export const GetTradingSignalsInputSchema = z.object({
	...IdentifierFields,
	startDate: DateString.optional(),
	endDate: DateString.optional(),
	category: NonEmptyString.optional(),
	exchange: NonEmptyString.optional(),
	marketcap: z.number().nonnegative().optional(),
	volume: z.number().nonnegative().optional(),
	fdv: z.number().nonnegative().optional(),
	signal: z.union([z.literal(-1), z.literal(0), z.literal(1)]).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	page: z.number().int().min(0).optional(),
});

const TokenRecordSchema = z
	.object({
		token_id: z.union([z.string(), z.number()]).optional(),
		symbol: z.string().optional(),
		name: z.string().optional(),
		price: z.number().optional(),
		market_cap: z.number().optional(),
		volume_24h: z.number().nullable().optional(),
		number_of_holders: z.number().nullable().optional(),
		token_creation_date: z.string().optional(),
	})
	.loose();
const TechnicalRecordSchema = z
	.object({
		symbol: z.string().optional(),
		indicator: z.string().optional(),
		value: z.number().optional(),
		datetime: z.string().optional(),
	})
	.loose();
const SignalRecordSchema = z
	.object({
		token_id: z.union([z.string(), z.number()]).optional(),
		symbol: z.string().optional(),
		signal: z.number().optional(),
		date: z.string().optional(),
	})
	.loose();
const envelope = <T extends z.ZodTypeAny>(item: T) =>
	z
		.object({
			data: z.array(item),
			success: z.boolean().optional(),
			message: z.string().optional(),
		})
		.loose();

export const PriceResponseSchema = envelope(TokenRecordSchema);
export const TechnicalIndicatorsResponseSchema = envelope(
	TechnicalRecordSchema,
);
export const TokensResponseSchema = envelope(TokenRecordSchema);
export const TopMarketCapResponseSchema = envelope(TokenRecordSchema);
export const TradingSignalsResponseSchema = envelope(SignalRecordSchema);

export type TokenMetricsEndpointInputs = {
	marketGetPrice: z.infer<typeof GetPriceInputSchema>;
	technicalGetIndicators: z.infer<typeof GetTechnicalIndicatorsInputSchema>;
	tokensList: z.infer<typeof ListTokensInputSchema>;
	marketGetTopMarketCap: z.infer<typeof GetTopMarketCapInputSchema>;
	tradingGetSignals: z.infer<typeof GetTradingSignalsInputSchema>;
};
export type TokenMetricsEndpointOutputs = {
	marketGetPrice: z.infer<typeof PriceResponseSchema>;
	technicalGetIndicators: z.infer<typeof TechnicalIndicatorsResponseSchema>;
	tokensList: z.infer<typeof TokensResponseSchema>;
	marketGetTopMarketCap: z.infer<typeof TopMarketCapResponseSchema>;
	tradingGetSignals: z.infer<typeof TradingSignalsResponseSchema>;
};
export const TokenMetricsEndpointInputSchemas = {
	marketGetPrice: GetPriceInputSchema,
	technicalGetIndicators: GetTechnicalIndicatorsInputSchema,
	tokensList: ListTokensInputSchema,
	marketGetTopMarketCap: GetTopMarketCapInputSchema,
	tradingGetSignals: GetTradingSignalsInputSchema,
} as const;
export const TokenMetricsEndpointOutputSchemas = {
	marketGetPrice: PriceResponseSchema,
	technicalGetIndicators: TechnicalIndicatorsResponseSchema,
	tokensList: TokensResponseSchema,
	marketGetTopMarketCap: TopMarketCapResponseSchema,
	tradingGetSignals: TradingSignalsResponseSchema,
} as const;
