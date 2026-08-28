import { z } from 'zod';

const GetNewsInputSchema = z.object({
	page: z.number().int().min(0).max(100000).optional(),
	pageSize: z.number().int().min(1).max(100).optional(),
	displayOutput: z.enum(['full', 'abstract', 'headline']).optional(),
	date: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	updatedSince: z.number().int().optional(),
	publishedSince: z.number().int().optional(),
	sort: z
		.enum([
			'id:asc',
			'id:desc',
			'created:asc',
			'created:desc',
			'updated:asc',
			'updated:desc',
		])
		.optional(),
	isin: z.string().optional(),
	cusips: z.string().optional(),
	tickers: z.string().optional(),
	primaryTickers: z.string().optional(),
	channels: z.string().optional(),
	topics: z.string().optional(),
	topic_group_by: z.enum(['and', 'or']).optional(),
	authors: z.string().optional(),
});

export type GetNewsInput = z.infer<typeof GetNewsInputSchema>;

const BenzingaImageSchema = z.object({
	size: z.string(),
	url: z.string(),
	alt: z.string().optional(),
});

const BenzingaChannelSchema = z.object({
	name: z.string(),
});

const BenzingaStockSchema = z.object({
	name: z.string(),
	cusip: z.string().optional(),
	isin: z.string().optional(),
	exchange: z.string().optional(),
});

const BenzingaTagSchema = z.object({
	name: z.string(),
});

const GetNewsResponseSchema = z.array(
	z.object({
		id: z.number(),
		author: z.string(),
		created: z.string(),
		updated: z.string(),
		title: z.string(),
		teaser: z.string(),
		body: z.string(),
		url: z.string(),
		image: z.array(BenzingaImageSchema).optional(),
		channels: z.array(BenzingaChannelSchema).optional(),
		stocks: z.array(BenzingaStockSchema).optional(),
		tags: z.array(BenzingaTagSchema).optional(),
	}),
);

export type GetNewsResponse = z.infer<typeof GetNewsResponseSchema>;

export type BenzingaEndpointInputs = {
	getNews: GetNewsInput;
};

export type BenzingaEndpointOutputs = {
	getNews: GetNewsResponse;
};

export const BenzingaEndpointInputSchemas = {
	getNews: GetNewsInputSchema,
} as const;

export const BenzingaEndpointOutputSchemas = {
	getNews: GetNewsResponseSchema,
} as const;
