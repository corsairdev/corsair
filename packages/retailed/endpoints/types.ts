import { z } from 'zod';
import { RetailedProductSchema } from '../schema';

/*                            Usage          						*/

const GetUsageInputSchema = z.object({});

const GetUsageResponseSchema = z.object({
	plan: z.string(),
	remaining: z.string(),
});

/*               Search Products                          */

const SearchProductsInputSchema = z.object({
	name: z.string().optional(),
	sku: z.string().optional(),
	page: z.number().int().positive().default(1).optional(),
	sort: z.string().optional(),
});

/*               StockX Trends                          */

const StockXTrendsInputSchema = z.object({
	query: z.string().optional(),
	sort_by: z.enum(['featured', 'most_active', 'release_date']).optional(),
	country: z.string().optional(),
});

/*               StockX Search                          */

const StockXSearchInputSchema = z.object({
	query: z.string(),
});

const StockXSearchResponseSchema = z.array(RetailedProductSchema);

const StockXTrendsResponseSchema = z.array(RetailedProductSchema);

const SearchProductsResponseSchema = z.object({
	docs: z.array(RetailedProductSchema),
	totalDocs: z.number(),
	limit: z.number(),
	totalPages: z.number(),
	page: z.number(),
	hasPrevPage: z.boolean(),
	hasNextPage: z.boolean(),
	prevPage: z.number().nullable(),
	nextPage: z.number().nullable(),
});

export type GetUsageInput = z.infer<typeof GetUsageInputSchema>;
export type GetUsageResponse = z.infer<typeof GetUsageResponseSchema>;

export type SearchProductsInput = z.infer<typeof SearchProductsInputSchema>;

export type SearchProductsResponse = z.infer<
	typeof SearchProductsResponseSchema
>;

export type StockXTrendsInput = z.infer<typeof StockXTrendsInputSchema>;

export type StockXTrendsResponse = z.infer<typeof StockXTrendsResponseSchema>;
export type StockXSearchInput = z.infer<typeof StockXSearchInputSchema>;

export type StockXSearchResponse = z.infer<typeof StockXSearchResponseSchema>;

export type RetailedEndpointInputs = {
	getUsage: GetUsageInput;
	searchProducts: SearchProductsInput;
	stockxTrends: StockXTrendsInput;
	stockxSearch: StockXSearchInput;
};

export type RetailedEndpointOutputs = {
	getUsage: GetUsageResponse;
	searchProducts: SearchProductsResponse;
	stockxTrends: StockXTrendsResponse;
	stockxSearch: StockXSearchResponse;
};

export const RetailedEndpointInputSchemas = {
	getUsage: GetUsageInputSchema,
	searchProducts: SearchProductsInputSchema,
	stockxTrends: StockXTrendsInputSchema,
	stockxSearch: StockXSearchInputSchema,
} as const;

export const RetailedEndpointOutputSchemas = {
	getUsage: GetUsageResponseSchema,
	searchProducts: SearchProductsResponseSchema,
	stockxTrends: StockXTrendsResponseSchema,
	stockxSearch: StockXSearchResponseSchema,
} as const;
