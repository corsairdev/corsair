import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';

// ── Numbers: list ─────────────────────────────────────────────────────────────

export const NumbersListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		q: z.string().optional(),
	})
	.strict();
export type NumbersListInput = z.infer<typeof NumbersListInputSchema>;

export const NumbersListItemSchema = z
	.object({
		dedicated_number: z.string().optional(),
		country: z.string().optional(),
		price: z.union([z.number(), z.string()]).optional(),
		type: z.string().optional(),
		number_type: z.string().optional(),
	})
	.passthrough();
export type NumbersListItem = z.infer<typeof NumbersListItemSchema>;

export const NumbersListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(NumbersListItemSchema).optional(),
	})
	.passthrough();
export type NumbersListResponse = z.infer<typeof NumbersListResponseSchema>;

// ── Numbers: search ───────────────────────────────────────────────────────────

export const NumbersSearchInputSchema = z
	.object({
		country: z.string().min(1),
		search: z.string().optional(),
		search_type: z.string().optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type NumbersSearchInput = z.infer<typeof NumbersSearchInputSchema>;

export const NumbersSearchItemSchema = z
	.object({
		country: z.string().optional(),
		country_name: z.string().optional(),
		dedicated_number: z.string().optional(),
		price_setup: z.union([z.number(), z.string()]).optional(),
		price_monthly: z.union([z.number(), z.string()]).optional(),
		price_total: z.union([z.number(), z.string()]).optional(),
	})
	.passthrough();
export type NumbersSearchItem = z.infer<typeof NumbersSearchItemSchema>;

export const NumbersSearchResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(NumbersSearchItemSchema).optional(),
	})
	.passthrough();
export type NumbersSearchResponse = z.infer<typeof NumbersSearchResponseSchema>;

// ── Numbers: buy ──────────────────────────────────────────────────────────────

export const NumbersBuyInputSchema = z
	.object({
		dedicated_number: z.string().min(1),
		type: z.enum(['sms', 'mms']),
	})
	.strict();
export type NumbersBuyInput = z.infer<typeof NumbersBuyInputSchema>;

export const NumbersBuyResponseSchema = z
	.object({
		dedicated_number: z.string().optional(),
		country: z.string().optional(),
		price_total: z.union([z.number(), z.string()]).optional(),
	})
	.passthrough();
export type NumbersBuyResponse = z.infer<typeof NumbersBuyResponseSchema>;

// ── Endpoints ─────────────────────────────────────────────────────────────────

export const listNumbers: CorsairEndpoint<
	ClickSendContext,
	NumbersListInput,
	NumbersListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('numbers', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			q: input.q,
		},
		responseSchema: NumbersListResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.numbers.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const searchNumbers: CorsairEndpoint<
	ClickSendContext,
	NumbersSearchInput,
	NumbersSearchResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'numbers/search/' + input.country,
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				search: input.search,
				search_type: input.search_type,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: NumbersSearchResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.numbers.search',
		{ country: input.country },
		'completed',
	);

	return response;
};

export const buyNumber: CorsairEndpoint<
	ClickSendContext,
	NumbersBuyInput,
	NumbersBuyResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'numbers/buy/' + input.dedicated_number,
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				dedicated_number: input.dedicated_number,
				type: input.type,
			},
			responseSchema: NumbersBuyResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.numbers.buy',
		{ dedicated_number: input.dedicated_number },
		'completed',
	);

	return response;
};
