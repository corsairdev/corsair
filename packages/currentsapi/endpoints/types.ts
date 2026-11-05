import { z } from 'zod';

const PageNumberSchema = z.number().int().min(1).max(180).optional();
const PageSizeSchema = z.number().int().min(1).max(300).optional();

const NewsItemSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		description: z.string().optional(),
		url: z.string().optional(),
		author: z.string().optional(),
		image: z.string().optional(),
		language: z.string().optional(),
		category: z.array(z.string()).optional(),
		source_category: z.array(z.string()).optional(),
		published: z.string().optional(),
	})
	.passthrough();

const ResultsBaseSchema = z
	.object({
		status: z.enum(['ok', 'error']),
		news: z.array(NewsItemSchema),
		page: z.number(),
		query_matched: z.boolean().optional(),
		query_scope: z.string().optional(),
		reason: z.string().optional(),
		page_has_results: z.boolean().optional(),
	})
	.passthrough();

const SearchInputSchema = z
	.object({
		keywords: z.string().min(1).optional(),
		query: z.string().min(1).optional(),
		language: z.string().min(1).default('en'),
		category: z.string().min(1).optional(),
		country: z.string().min(1).optional(),
		start_date: z.string().min(1).optional(),
		end_date: z.string().min(1).optional(),
		page_number: PageNumberSchema,
		page_size: PageSizeSchema,
		limit: z.number().int().min(1).max(300).optional(),
		type: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
		domain: z.string().min(1).optional(),
		domain_not: z.string().min(1).optional(),
		author: z.string().min(1).optional(),
		has_image: z.boolean().optional(),
		has_description: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		const pageNumber = value.page_number ?? 1;
		const pageSize = value.page_size ?? value.limit ?? 30;
		if ((pageNumber - 1) * pageSize > 5000) {
			ctx.addIssue({
				code: 'custom',
				message: 'Offset (page_number - 1) * page_size must not exceed 5000',
			});
		}
	});

const LatestInputSchema = z
	.object({
		language: z.string().min(1).default('en'),
		category: z.string().min(1).optional(),
		country: z.string().min(1).optional(),
		page_number: PageNumberSchema,
		page_size: PageSizeSchema,
		type: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
		domain: z.string().min(1).optional(),
		domain_not: z.string().min(1).optional(),
		author: z.string().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		const pageNumber = value.page_number ?? 1;
		const pageSize = value.page_size ?? 30;
		if ((pageNumber - 1) * pageSize > 5000) {
			ctx.addIssue({
				code: 'custom',
				message: 'Offset (page_number - 1) * page_size must not exceed 5000',
			});
		}
	});

const LanguagesResponseSchema = z
	.object({
		languages: z.record(z.string(), z.string()),
		description: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

const RegionsResponseSchema = z
	.object({
		regions: z.record(z.string(), z.string()),
		description: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

const CategoriesResponseSchema = z
	.object({
		categories: z.array(z.string()),
		description: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

const EmptyInputSchema = z.object({});

export type SearchInput = z.input<typeof SearchInputSchema>;
export type LatestInput = z.input<typeof LatestInputSchema>;
export type LanguagesResponse = z.infer<typeof LanguagesResponseSchema>;
export type RegionsResponse = z.infer<typeof RegionsResponseSchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
export type NewsItem = z.infer<typeof NewsItemSchema>;
export type SearchResponse = z.infer<typeof ResultsBaseSchema>;
export type LatestResponse = z.infer<typeof ResultsBaseSchema>;

export type CurrentsApiEndpointInputs = {
	search: SearchInput;
	latest: LatestInput;
	languages: z.infer<typeof EmptyInputSchema>;
	regions: z.infer<typeof EmptyInputSchema>;
	categories: z.infer<typeof EmptyInputSchema>;
};

export type CurrentsApiEndpointOutputs = {
	search: SearchResponse;
	latest: LatestResponse;
	languages: LanguagesResponse;
	regions: RegionsResponse;
	categories: CategoriesResponse;
};

export const CurrentsApiEndpointInputSchemas = {
	search: SearchInputSchema,
	latest: LatestInputSchema,
	languages: EmptyInputSchema,
	regions: EmptyInputSchema,
	categories: EmptyInputSchema,
} as const;

export const CurrentsApiEndpointOutputSchemas = {
	search: ResultsBaseSchema,
	latest: ResultsBaseSchema,
	languages: LanguagesResponseSchema,
	regions: RegionsResponseSchema,
	categories: CategoriesResponseSchema,
} as const;
