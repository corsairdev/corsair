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

export type RetailedEndpointInputs = {
	getUsage: GetUsageInput;
	searchProducts: SearchProductsInput;
};

export type RetailedEndpointOutputs = {
	getUsage: GetUsageResponse;
	searchProducts: SearchProductsResponse;
};

export const RetailedEndpointInputSchemas = {
	getUsage: GetUsageInputSchema,
	searchProducts: SearchProductsInputSchema,
} as const;

export const RetailedEndpointOutputSchemas = {
	getUsage: GetUsageResponseSchema,
	searchProducts: SearchProductsResponseSchema,
} as const;
