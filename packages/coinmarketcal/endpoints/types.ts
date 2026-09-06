import { z } from 'zod';

const CoinSchema = z.object({
	slug: z.string().optional(),
	symbol: z.string().optional(),
	name: z.string().optional(),
});

const PaginationMetaSchema = z.object({
	total: z.number().optional(),
	cursor: z.string().nullable().optional(),
});

const CoinsInputSchema = z.object({
	limit: z.coerce.number().optional(),
	cursor: z.string().optional(),
});

const CoinsResponseSchema = z.object({
	data: z.array(CoinSchema).optional(),
	meta: PaginationMetaSchema.optional(),
});

const EventsInputSchema = z.object({
	coins: z.string().optional(),
	categories: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	keyword: z.string().optional(),
	impactMin: z.coerce.number().optional(),
	sortBy: z.string().optional(),
	limit: z.coerce.number().optional(),
	cursor: z.string().optional(),
});

const EventSchema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	slug: z.string().optional(),
	title: z.string().optional(),
	description: z.string().nullable().optional(),
	date: z.string().optional(),
	dateEnd: z.string().nullable().optional(),
	dateType: z.string().optional(),
	isEstimated: z.boolean().optional(),
	displayedDate: z.string().optional(),
	categories: z.array(z.string()).optional(),
	coins: z.array(CoinSchema).optional(),
	impact: z.number().nullable().optional(),
	impactSummary: z.string().nullable().optional(),
	sourceUrl: z.string().nullable().optional(),
	snapshotUrl: z.string().nullable().optional(),
});

const EventsResponseSchema = z.object({
	data: z.array(EventSchema).optional(),
	meta: PaginationMetaSchema.optional(),
});

const CategoriesInputSchema = z.object({});

const CategorySchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	slug: z.string().optional(),
});

const CategoriesResponseSchema = z.object({
	data: z.array(CategorySchema).optional(),
});

export type CoinsInput = z.infer<typeof CoinsInputSchema>;
export type CoinsResponse = z.infer<typeof CoinsResponseSchema>;

export type EventsInput = z.infer<typeof EventsInputSchema>;
export type EventsResponse = z.infer<typeof EventsResponseSchema>;

export type CategoriesInput = z.infer<typeof CategoriesInputSchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

export type CoinmarketcalEndpointInputs = {
	exampleGet: CoinsInput;
	eventsList: EventsInput;
	categoriesList: CategoriesInput;
};

export type CoinmarketcalEndpointOutputs = {
	exampleGet: CoinsResponse;
	eventsList: EventsResponse;
	categoriesList: CategoriesResponse;
};

export const CoinmarketcalEndpointInputSchemas = {
	exampleGet: CoinsInputSchema,
	eventsList: EventsInputSchema,
	categoriesList: CategoriesInputSchema,
} as const;

export const CoinmarketcalEndpointOutputSchemas = {
	exampleGet: CoinsResponseSchema,
	eventsList: EventsResponseSchema,
	categoriesList: CategoriesResponseSchema,
} as const;
