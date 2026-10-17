import { z } from 'zod';
import {
	CoinmarketcalCategory,
	CoinmarketcalCoin,
	CoinmarketcalEvent,
} from '../schema/database';

const CoinSchema = CoinmarketcalCoin;

const PaginationMetaSchema = z.object({
	total: z.number().optional(),
	limit: z.number().optional(),
	cursor: z.string().nullable().optional(),
});

const CoinsInputSchema = z.object({
	q: z.string().optional(),
	tracked: z.boolean().optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
	cursor: z.string().optional(),
});

const CoinGetInputSchema = z.object({
	slug: z.string().min(1),
});

const CoinsResponseSchema = z.object({
	data: z.array(CoinSchema).optional(),
	meta: PaginationMetaSchema.optional(),
});

const CoinGetResponseSchema = CoinSchema;

const EventsInputSchema = z.object({
	coins: z.string().optional(),
	categories: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	keyword: z.string().optional(),
	impactMin: z.coerce.number().min(0).max(10).optional(),
	sortBy: z
		.enum([
			'date_asc',
			'date_desc',
			'created_desc',
			'created_desc_and_updated_desc',
			'impact_desc',
		])
		.optional(),
	limit: z.coerce.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});

const EventGetInputSchema = z.object({
	id: z.string().min(1),
});

const EventSchema = CoinmarketcalEvent;

const EventsResponseSchema = z.object({
	data: z.array(EventSchema).optional(),
	meta: PaginationMetaSchema.optional(),
});

const EventGetResponseSchema = EventSchema;

const CategoriesInputSchema = z.object({});

const CategorySchema = z.object({
	...CoinmarketcalCategory.shape,
	id: z.union([z.string(), z.number()]),
});

const CategoriesResponseSchema = z.object({
	data: z.array(CategorySchema).optional(),
});

export type CoinsInput = z.infer<typeof CoinsInputSchema>;
export type CoinsResponse = z.infer<typeof CoinsResponseSchema>;
export type CoinGetInput = z.infer<typeof CoinGetInputSchema>;
export type CoinGetResponse = z.infer<typeof CoinGetResponseSchema>;

export type EventsInput = z.infer<typeof EventsInputSchema>;
export type EventsResponse = z.infer<typeof EventsResponseSchema>;
export type EventGetInput = z.infer<typeof EventGetInputSchema>;
export type EventGetResponse = z.infer<typeof EventGetResponseSchema>;

export type CategoriesInput = z.infer<typeof CategoriesInputSchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

export type CoinmarketcalEndpointInputs = {
	coinsList: CoinsInput;
	coinsGet: CoinGetInput;
	eventsList: EventsInput;
	eventsGet: EventGetInput;
	categoriesList: CategoriesInput;
};

export type CoinmarketcalEndpointOutputs = {
	coinsList: CoinsResponse;
	coinsGet: CoinGetResponse;
	eventsList: EventsResponse;
	eventsGet: EventGetResponse;
	categoriesList: CategoriesResponse;
};

export const CoinmarketcalEndpointInputSchemas = {
	coinsList: CoinsInputSchema,
	coinsGet: CoinGetInputSchema,
	eventsList: EventsInputSchema,
	eventsGet: EventGetInputSchema,
	categoriesList: CategoriesInputSchema,
} as const;

export const CoinmarketcalEndpointOutputSchemas = {
	coinsList: CoinsResponseSchema,
	coinsGet: CoinGetResponseSchema,
	eventsList: EventsResponseSchema,
	eventsGet: EventGetResponseSchema,
	categoriesList: CategoriesResponseSchema,
} as const;
