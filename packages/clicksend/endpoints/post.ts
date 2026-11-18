import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';

// ── Shared: empty result ──────────────────────────────────────────────────────

export const EmptyResultSchema = z.union([
	z.array(z.never()),
	z.record(z.string(), z.string()),
	z.boolean(),
	z.null(),
]);
export type EmptyResult = z.infer<typeof EmptyResultSchema>;

// ── Post letters: recipient ───────────────────────────────────────────────────

export const PostLetterRecipientSchema = z
	.object({
		message_id: z.string().optional(),
		address_name: z.string().optional(),
		address_line_1: z.string().optional(),
		address_line_2: z.string().optional(),
		address_city: z.string().optional(),
		address_state: z.string().optional(),
		address_postal_code: z.string().optional(),
		address_country: z.string().optional(),
		return_address_id: z.number().optional(),
		custom_string: z.string().optional(),
		schedule: z.number().optional(),
		source: z.string().optional(),
		colour: z.number().optional(),
		duplex: z.number().optional(),
		post_pages: z.number().optional(),
		post_price: z.number().optional(),
		priority_post: z.number().optional(),
		date_added: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type PostLetterRecipient = z.infer<typeof PostLetterRecipientSchema>;

export const PostLetterRecipientInputSchema = z
	.object({
		address_name: z.string().min(1),
		address_line_1: z.string().min(1),
		address_line_2: z.string().optional(),
		address_city: z.string().min(1),
		address_state: z.string().optional(),
		address_postal_code: z.string().min(1),
		address_country: z.string().min(1),
		return_address_id: z.number().int().positive(),
		custom_string: z.string().optional(),
		schedule: z.number().optional(),
	})
	.strict();
export type PostLetterRecipientInput = z.infer<
	typeof PostLetterRecipientInputSchema
>;

// ── Post letters: send ────────────────────────────────────────────────────────

export const PostLettersSendInputSchema = z
	.object({
		file_url: z.string().min(1),
		recipients: z.array(PostLetterRecipientInputSchema).min(1),
		template_used: z.number().optional(),
		colour: z.number().optional(),
		duplex: z.number().optional(),
		priority_post: z.number().optional(),
		schedule: z.number().optional(),
		source: z.string().optional(),
	})
	.strict();
export type PostLettersSendInput = z.infer<typeof PostLettersSendInputSchema>;

export const PostLettersSendResponseSchema = z
	.object({
		total_price: z.number().optional(),
		total_cost: z.number().optional(),
		recipients: z.array(PostLetterRecipientSchema).optional(),
	})
	.passthrough();
export type PostLettersSendResponse = z.infer<
	typeof PostLettersSendResponseSchema
>;

// ── Post letters: history ─────────────────────────────────────────────────────

export const PostLettersHistoryInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type PostLettersHistoryInput = z.infer<
	typeof PostLettersHistoryInputSchema
>;

export const PostLettersHistoryResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(PostLetterRecipientSchema).optional(),
	})
	.passthrough();
export type PostLettersHistoryResponse = z.infer<
	typeof PostLettersHistoryResponseSchema
>;

// ── Post letters: history export ──────────────────────────────────────────────

export const PostLettersHistoryExportInputSchema = z
	.object({
		filename: z.string().min(1),
		q: z.string().optional(),
		order_by: z.string().optional(),
		date_from: z.string().optional(),
		date_to: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type PostLettersHistoryExportInput = z.infer<
	typeof PostLettersHistoryExportInputSchema
>;

export const PostLettersHistoryExportResponseSchema = z
	.object({
		url: z.string().optional(),
	})
	.passthrough();
export type PostLettersHistoryExportResponse = z.infer<
	typeof PostLettersHistoryExportResponseSchema
>;

// ── Post letters: price ───────────────────────────────────────────────────────

export const PostLettersPriceInputSchema = z
	.object({
		file_url: z.string().min(1),
		recipients: z.array(PostLetterRecipientInputSchema).min(1),
		template_used: z.number().optional(),
		colour: z.number().optional(),
		duplex: z.number().optional(),
		priority_post: z.number().optional(),
		schedule: z.number().optional(),
		source: z.string().optional(),
	})
	.strict();
export type PostLettersPriceInput = z.infer<typeof PostLettersPriceInputSchema>;

export const PostLettersPriceResponseSchema = z
	.object({
		total_price: z.number().optional(),
		total_cost: z.number().optional(),
		recipients: z.array(PostLetterRecipientSchema).optional(),
	})
	.passthrough();
export type PostLettersPriceResponse = z.infer<
	typeof PostLettersPriceResponseSchema
>;

// ── Post letters: detect address ──────────────────────────────────────────────

export const PostLettersDetectAddressInputSchema = z
	.object({
		content: z
			.string()
			.optional()
			.describe(
				'Letter content to detect the address from; at least one of content or address is expected',
			),
		address: z
			.string()
			.optional()
			.describe(
				'Address text to parse; at least one of content or address is expected',
			),
	})
	.strict();
export type PostLettersDetectAddressInput = z.infer<
	typeof PostLettersDetectAddressInputSchema
>;

export const PostLettersDetectAddressResponseSchema = z
	.object({
		address_name: z.string().optional(),
		address_line_1: z.string().optional(),
		address_line_2: z.string().optional(),
		address_city: z.string().optional(),
		address_state: z.string().optional(),
		address_postal_code: z.string().optional(),
		address_country: z.string().optional(),
	})
	.passthrough();
export type PostLettersDetectAddressResponse = z.infer<
	typeof PostLettersDetectAddressResponseSchema
>;

// ── Post return addresses ─────────────────────────────────────────────────────

export const PostReturnAddressSchema = z
	.object({
		return_address_id: z.number().optional(),
		user_id: z.number().optional(),
		address_name: z.string().optional(),
		address_line_1: z.string().optional(),
		address_line_2: z.string().optional(),
		address_city: z.string().optional(),
		address_state: z.string().optional(),
		address_postal_code: z.string().optional(),
		address_country: z.string().optional(),
	})
	.passthrough();
export type PostReturnAddress = z.infer<typeof PostReturnAddressSchema>;

export const PostReturnAddressCreateInputSchema = z
	.object({
		address_name: z.string().min(1),
		address_line_1: z.string().min(1),
		address_line_2: z.string().optional(),
		address_city: z.string().min(1),
		address_state: z.string().optional(),
		address_postal_code: z.string().min(1),
		address_country: z.string().min(1),
	})
	.strict();
export type PostReturnAddressCreateInput = z.infer<
	typeof PostReturnAddressCreateInputSchema
>;

export const PostReturnAddressCreateResponseSchema = PostReturnAddressSchema;
export type PostReturnAddressCreateResponse = z.infer<
	typeof PostReturnAddressCreateResponseSchema
>;

export const PostReturnAddressesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type PostReturnAddressesListInput = z.infer<
	typeof PostReturnAddressesListInputSchema
>;

export const PostReturnAddressesListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(PostReturnAddressSchema).optional(),
	})
	.passthrough();
export type PostReturnAddressesListResponse = z.infer<
	typeof PostReturnAddressesListResponseSchema
>;

export const PostReturnAddressGetInputSchema = z
	.object({
		return_address_id: z.number().int().positive(),
	})
	.strict();
export type PostReturnAddressGetInput = z.infer<
	typeof PostReturnAddressGetInputSchema
>;

export const PostReturnAddressGetResponseSchema = PostReturnAddressSchema;
export type PostReturnAddressGetResponse = z.infer<
	typeof PostReturnAddressGetResponseSchema
>;

export const PostReturnAddressUpdateInputSchema = z
	.object({
		return_address_id: z.number().int().positive(),
		address_name: z.string().min(1),
		address_line_1: z.string().min(1),
		address_line_2: z.string().optional(),
		address_city: z.string().min(1),
		address_state: z.string().optional(),
		address_postal_code: z.string().min(1),
		address_country: z.string().min(1),
	})
	.strict();
export type PostReturnAddressUpdateInput = z.infer<
	typeof PostReturnAddressUpdateInputSchema
>;

export const PostReturnAddressUpdateResponseSchema = PostReturnAddressSchema;
export type PostReturnAddressUpdateResponse = z.infer<
	typeof PostReturnAddressUpdateResponseSchema
>;

export const PostReturnAddressDeleteInputSchema = z
	.object({
		return_address_id: z.number().int().positive(),
	})
	.strict();
export type PostReturnAddressDeleteInput = z.infer<
	typeof PostReturnAddressDeleteInputSchema
>;

// ── Post direct mail (legacy official-spec) ───────────────────────────────────

export const PostDirectMailAreaSchema = z
	.object({
		location_id: z.number().optional(),
		quantity: z.number().optional(),
	})
	.strict();
export type PostDirectMailArea = z.infer<typeof PostDirectMailAreaSchema>;

export const PostDirectMailSendInputSchema = z
	.object({
		name: z.string().min(1),
		size: z.enum(['A5', 'DL']),
		file_urls: z.array(z.string()).min(1),
		areas: z.array(PostDirectMailAreaSchema).optional(),
		schedule: z.number().optional(),
		source: z.string().optional(),
		custom_string: z.string().optional(),
	})
	.strict();
export type PostDirectMailSendInput = z.infer<
	typeof PostDirectMailSendInputSchema
>;

export const PostDirectMailSendResponseSchema = z.object({}).passthrough();
export type PostDirectMailSendResponse = z.infer<
	typeof PostDirectMailSendResponseSchema
>;

export const PostDirectMailSearchLocationsInputSchema = z
	.object({
		country: z.string().min(1),
		q: z.string().min(1),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type PostDirectMailSearchLocationsInput = z.infer<
	typeof PostDirectMailSearchLocationsInputSchema
>;

export const PostDirectMailLocationSchema = z.object({}).passthrough();
export type PostDirectMailLocation = z.infer<
	typeof PostDirectMailLocationSchema
>;

export const PostDirectMailSearchLocationsResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(PostDirectMailLocationSchema).optional(),
	})
	.passthrough();
export type PostDirectMailSearchLocationsResponse = z.infer<
	typeof PostDirectMailSearchLocationsResponseSchema
>;

// ── Endpoints: post letters ───────────────────────────────────────────────────

export const sendPostLetter: CorsairEndpoint<
	ClickSendContext,
	PostLettersSendInput,
	PostLettersSendResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/letters/send',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				file_url: input.file_url,
				recipients: input.recipients,
				template_used: input.template_used,
				colour: input.colour,
				duplex: input.duplex,
				priority_post: input.priority_post,
				schedule: input.schedule,
				source: input.source,
			},
			responseSchema: PostLettersSendResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postLetters.send',
		{ count: input.recipients.length },
		'completed',
	);

	return response;
};

export const getPostLettersHistory: CorsairEndpoint<
	ClickSendContext,
	PostLettersHistoryInput,
	PostLettersHistoryResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/letters/history',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: PostLettersHistoryResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postLetters.history',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const exportPostLettersHistory: CorsairEndpoint<
	ClickSendContext,
	PostLettersHistoryExportInput,
	PostLettersHistoryExportResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/letters/history/export',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				filename: input.filename,
				q: input.q,
				order_by: input.order_by,
				date_from: input.date_from,
				date_to: input.date_to,
				limit: input.limit,
			},
			responseSchema: PostLettersHistoryExportResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postLetters.historyExport',
		{ filename: input.filename },
		'completed',
	);

	return response;
};

export const calculatePostLettersPrice: CorsairEndpoint<
	ClickSendContext,
	PostLettersPriceInput,
	PostLettersPriceResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/letters/price',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				file_url: input.file_url,
				recipients: input.recipients,
				template_used: input.template_used,
				colour: input.colour,
				duplex: input.duplex,
				priority_post: input.priority_post,
				schedule: input.schedule,
				source: input.source,
			},
			responseSchema: PostLettersPriceResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postLetters.price',
		{ count: input.recipients.length },
		'completed',
	);

	return response;
};

export const detectPostAddress: CorsairEndpoint<
	ClickSendContext,
	PostLettersDetectAddressInput,
	PostLettersDetectAddressResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/letters/detect-address',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				content: input.content,
				address: input.address,
			},
			responseSchema: PostLettersDetectAddressResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postLetters.detectAddress',
		{},
		'completed',
	);

	return response;
};

// ── Endpoints: post return addresses ──────────────────────────────────────────

export const createPostReturnAddress: CorsairEndpoint<
	ClickSendContext,
	PostReturnAddressCreateInput,
	PostReturnAddressCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/return-addresses',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				address_name: input.address_name,
				address_line_1: input.address_line_1,
				address_line_2: input.address_line_2,
				address_city: input.address_city,
				address_state: input.address_state,
				address_postal_code: input.address_postal_code,
				address_country: input.address_country,
			},
			responseSchema: PostReturnAddressCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postReturnAddresses.create',
		{ address_name: input.address_name },
		'completed',
	);

	return response;
};

export const listPostReturnAddresses: CorsairEndpoint<
	ClickSendContext,
	PostReturnAddressesListInput,
	PostReturnAddressesListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/return-addresses',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: PostReturnAddressesListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postReturnAddresses.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const getPostReturnAddress: CorsairEndpoint<
	ClickSendContext,
	PostReturnAddressGetInput,
	PostReturnAddressGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/return-addresses/' + input.return_address_id,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: PostReturnAddressGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postReturnAddresses.get',
		{ return_address_id: input.return_address_id },
		'completed',
	);

	return response;
};

export const updatePostReturnAddress: CorsairEndpoint<
	ClickSendContext,
	PostReturnAddressUpdateInput,
	PostReturnAddressUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/return-addresses/' + input.return_address_id,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				address_name: input.address_name,
				address_line_1: input.address_line_1,
				address_line_2: input.address_line_2,
				address_city: input.address_city,
				address_state: input.address_state,
				address_postal_code: input.address_postal_code,
				address_country: input.address_country,
			},
			responseSchema: PostReturnAddressUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postReturnAddresses.update',
		{ return_address_id: input.return_address_id },
		'completed',
	);

	return response;
};

export const deletePostReturnAddress: CorsairEndpoint<
	ClickSendContext,
	PostReturnAddressDeleteInput,
	EmptyResult
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/return-addresses/' + input.return_address_id,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: EmptyResultSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postReturnAddresses.delete',
		{ return_address_id: input.return_address_id },
		'completed',
	);

	return response;
};

// ── Endpoints: post direct mail ───────────────────────────────────────────────

export const sendPostDirectMail: CorsairEndpoint<
	ClickSendContext,
	PostDirectMailSendInput,
	PostDirectMailSendResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/direct-mail/campaigns/send',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				name: input.name,
				size: input.size,
				file_urls: input.file_urls,
				areas: input.areas,
				schedule: input.schedule,
				source: input.source,
				custom_string: input.custom_string,
			},
			responseSchema: PostDirectMailSendResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postDirectMail.send',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const searchPostDirectMailLocations: CorsairEndpoint<
	ClickSendContext,
	PostDirectMailSearchLocationsInput,
	PostDirectMailSearchLocationsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'post/direct-mail/locations/search/' + input.country,
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				q: input.q,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: PostDirectMailSearchLocationsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.postDirectMail.searchLocations',
		{ country: input.country, q: input.q },
		'completed',
	);

	return response;
};
