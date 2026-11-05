import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';

// ── countries.list ────────────────────────────────────────────────────────────

export const GeoListCountriesInputSchema = z.object({}).strict();
export type GeoListCountriesInput = z.infer<typeof GeoListCountriesInputSchema>;

export const GeoCountrySchema = z.object({
	code: z.string(),
	value: z.string(),
});
export type GeoCountry = z.infer<typeof GeoCountrySchema>;

export const GeoListCountriesResponseSchema = z.array(GeoCountrySchema);
export type GeoListCountriesResponse = z.infer<
	typeof GeoListCountriesResponseSchema
>;

export const listCountries: CorsairEndpoint<
	ClickSendContext,
	GeoListCountriesInput,
	GeoListCountriesResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('countries', username, apiKey, {
		method: 'GET',
		responseSchema: GeoListCountriesResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.countries.list',
		{ ...input },
		'completed',
	);

	return response;
};

// ── countries.globalList ──────────────────────────────────────────────────────

export const GeoListGlobalSendingCountriesInputSchema = z.object({}).strict();
export type GeoListGlobalSendingCountriesInput = z.infer<
	typeof GeoListGlobalSendingCountriesInputSchema
>;

export const GeoGlobalSendingCountrySchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		code: z.string().optional(),
		region: z.string().optional(),
	})
	.passthrough();
export type GeoGlobalSendingCountry = z.infer<
	typeof GeoGlobalSendingCountrySchema
>;

export const GeoListGlobalSendingCountriesResponseSchema = z.array(
	GeoGlobalSendingCountrySchema,
);
export type GeoListGlobalSendingCountriesResponse = z.infer<
	typeof GeoListGlobalSendingCountriesResponseSchema
>;

export const listGlobalSendingCountries: CorsairEndpoint<
	ClickSendContext,
	GeoListGlobalSendingCountriesInput,
	GeoListGlobalSendingCountriesResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'country-list',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: GeoListGlobalSendingCountriesResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.countries.globalList',
		{ ...input },
		'completed',
	);

	return response;
};

// ── countries.pricing ─────────────────────────────────────────────────────────

export const GeoGetCountryPricingInputSchema = z
	.object({
		country: z.string().min(1),
		currency: z.string().min(1),
	})
	.strict();
export type GeoGetCountryPricingInput = z.infer<
	typeof GeoGetCountryPricingInputSchema
>;

export const GeoGetCountryPricingResponseSchema = z
	.object({
		country: z.string().optional(),
		_currency: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type GeoGetCountryPricingResponse = z.infer<
	typeof GeoGetCountryPricingResponseSchema
>;

export const getCountryPricing: CorsairEndpoint<
	ClickSendContext,
	GeoGetCountryPricingInput,
	GeoGetCountryPricingResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`pricing/${input.country}`,
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				currency: input.currency,
			},
			responseSchema: GeoGetCountryPricingResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.countries.pricing',
		{ country: input.country, currency: input.currency },
		'completed',
	);

	return response;
};

// ── countries.userCountries ───────────────────────────────────────────────────

export const GeoUserCountrySchema = z.object({}).passthrough();
export type GeoUserCountry = z.infer<typeof GeoUserCountrySchema>;

export const GeoGetUserCountriesInputSchema = z.object({}).strict();
export type GeoGetUserCountriesInput = z.infer<
	typeof GeoGetUserCountriesInputSchema
>;

export const GeoGetUserCountriesResponseSchema = z.array(GeoUserCountrySchema);
export type GeoGetUserCountriesResponse = z.infer<
	typeof GeoGetUserCountriesResponseSchema
>;

export const getUserCountries: CorsairEndpoint<
	ClickSendContext,
	GeoGetUserCountriesInput,
	GeoGetUserCountriesResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'user-countries',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: GeoGetUserCountriesResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.countries.userCountriesGet',
		{ ...input },
		'completed',
	);

	return response;
};

export const GeoSelectUserCountriesInputSchema = z
	.object({
		country_list_ids: z.array(z.number().int()),
	})
	.strict();
export type GeoSelectUserCountriesInput = z.infer<
	typeof GeoSelectUserCountriesInputSchema
>;

export const GeoSelectUserCountriesResponseSchema =
	GeoGetUserCountriesResponseSchema;
export type GeoSelectUserCountriesResponse = z.infer<
	typeof GeoSelectUserCountriesResponseSchema
>;

export const selectUserCountries: CorsairEndpoint<
	ClickSendContext,
	GeoSelectUserCountriesInput,
	GeoSelectUserCountriesResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'user-countries',
		username,
		apiKey,
		{
			method: 'POST',
			body: { country_list_ids: input.country_list_ids },
			responseSchema: GeoSelectUserCountriesResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.countries.userCountriesSelect',
		{ country_list_ids: input.country_list_ids },
		'completed',
	);

	return response;
};

export const GeoAgreeUserCountriesRulesInputSchema = z.object({}).strict();
export type GeoAgreeUserCountriesRulesInput = z.infer<
	typeof GeoAgreeUserCountriesRulesInputSchema
>;

export const GeoAgreeUserCountriesRulesResponseSchema =
	GeoGetUserCountriesResponseSchema;
export type GeoAgreeUserCountriesRulesResponse = z.infer<
	typeof GeoAgreeUserCountriesRulesResponseSchema
>;

export const agreeUserCountriesRules: CorsairEndpoint<
	ClickSendContext,
	GeoAgreeUserCountriesRulesInput,
	GeoAgreeUserCountriesRulesResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'user-countries/agree',
		username,
		apiKey,
		{
			method: 'POST',
			responseSchema: GeoAgreeUserCountriesRulesResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.countries.userCountriesAgree',
		{ ...input },
		'completed',
	);

	return response;
};

// ── timezones.list ────────────────────────────────────────────────────────────

export const GeoListTimezonesInputSchema = z.object({}).strict();
export type GeoListTimezonesInput = z.infer<typeof GeoListTimezonesInputSchema>;

export const GeoListTimezonesResponseSchema = z.array(z.string());
export type GeoListTimezonesResponse = z.infer<
	typeof GeoListTimezonesResponseSchema
>;

export const listTimezones: CorsairEndpoint<
	ClickSendContext,
	GeoListTimezonesInput,
	GeoListTimezonesResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('timezones', username, apiKey, {
		method: 'GET',
		responseSchema: GeoListTimezonesResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.timezones.list',
		{ ...input },
		'completed',
	);

	return response;
};

// ── deliveryIssues ────────────────────────────────────────────────────────────

export const GeoDeliveryIssueObjectSchema = z
	.object({
		issue_id: z.union([z.number(), z.string()]).optional(),
		user_id: z.union([z.number(), z.string()]).optional(),
		message_id: z.string().optional(),
		type: z.string().optional(),
		description: z.string().optional(),
		status: z.string().optional(),
		date_added: z.string().optional(),
		resolved: z.union([z.number(), z.string(), z.boolean()]).optional(),
		email_address: z.string().optional(),
	})
	.passthrough();
export type GeoDeliveryIssueObject = z.infer<
	typeof GeoDeliveryIssueObjectSchema
>;

export const GeoListDeliveryIssuesInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type GeoListDeliveryIssuesInput = z.infer<
	typeof GeoListDeliveryIssuesInputSchema
>;

export const GeoListDeliveryIssuesResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(GeoDeliveryIssueObjectSchema).optional(),
	})
	.passthrough();
export type GeoListDeliveryIssuesResponse = z.infer<
	typeof GeoListDeliveryIssuesResponseSchema
>;

export const listDeliveryIssues: CorsairEndpoint<
	ClickSendContext,
	GeoListDeliveryIssuesInput,
	GeoListDeliveryIssuesResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'delivery-issues',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: GeoListDeliveryIssuesResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.deliveryIssues.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const GeoCreateDeliveryIssueInputSchema = z
	.object({
		message_id: z.string().optional(),
		type: z.string().min(1),
		description: z.string().min(1),
		email_address: z.string().min(1),
		client_comments: z.string().optional(),
	})
	.strict();
export type GeoCreateDeliveryIssueInput = z.infer<
	typeof GeoCreateDeliveryIssueInputSchema
>;

export const GeoCreateDeliveryIssueResponseSchema = z
	.object({
		issue_id: z.union([z.number(), z.string()]).optional(),
		user_id: z.union([z.number(), z.string()]).optional(),
		message_id: z.string().optional(),
		type: z.string().optional(),
		description: z.string().optional(),
		date_added: z.string().optional(),
		email_address: z.string().optional(),
	})
	.passthrough();
export type GeoCreateDeliveryIssueResponse = z.infer<
	typeof GeoCreateDeliveryIssueResponseSchema
>;

export const createDeliveryIssue: CorsairEndpoint<
	ClickSendContext,
	GeoCreateDeliveryIssueInput,
	GeoCreateDeliveryIssueResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'delivery-issues',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				message_id: input.message_id,
				type: input.type,
				description: input.description,
				email_address: input.email_address,
				client_comments: input.client_comments,
			},
			responseSchema: GeoCreateDeliveryIssueResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.deliveryIssues.create',
		{ type: input.type },
		'completed',
	);

	return response;
};
