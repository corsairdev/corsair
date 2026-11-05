import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';
import { EmptyResultSchema } from './messaging';

// ── SMS campaign ──────────────────────────────────────────────────────────────

export const SmsCampaignSchema = z
	.object({
		sms_campaign_id: z.number().optional(),
		name: z.string().optional(),
		user_id: z.number().optional(),
		subaccount_id: z.number().optional(),
		list_id: z.number().optional(),
		from: z.string().optional(),
		body: z.string().optional(),
		schedule: z.number().optional(),
		status: z.string().optional(),
		date_added: z.number().optional(),
		custom_string: z.string().optional(),
		url_to_shorten: z.string().optional(),
		_total_count: z.number().optional(),
		_list_name: z.string().optional(),
	})
	.passthrough();
export type SmsCampaign = z.infer<typeof SmsCampaignSchema>;

export const SmsCampaignResultSchema = z
	.object({
		total_price: z.number().optional(),
		total_count: z.number().optional(),
		queued_count: z.number().optional(),
		messages: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type SmsCampaignResult = z.infer<typeof SmsCampaignResultSchema>;

// ── SMS campaign price ────────────────────────────────────────────────────────

export const PriceSmsCampaignInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		name: z.string().min(1),
		body: z.string().min(1),
		from: z.string().min(1),
		schedule: z.number().optional(),
	})
	.strict();
export type PriceSmsCampaignInput = z.infer<typeof PriceSmsCampaignInputSchema>;

export const PriceSmsCampaignResponseSchema = SmsCampaignResultSchema;
export type PriceSmsCampaignResponse = z.infer<
	typeof PriceSmsCampaignResponseSchema
>;

export const priceSmsCampaign: CorsairEndpoint<
	ClickSendContext,
	PriceSmsCampaignInput,
	PriceSmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms-campaigns/price',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				list_id: input.list_id,
				name: input.name,
				body: input.body,
				from: input.from,
				schedule: input.schedule,
			},
			responseSchema: PriceSmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.sms.price',
		{ list_id: input.list_id, name: input.name },
		'completed',
	);

	return response;
};

// ── SMS campaign send ─────────────────────────────────────────────────────────

export const SendSmsCampaignInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		name: z.string().min(1),
		body: z.string().min(1),
		from: z.string().min(1),
		senders: z.array(z.record(z.string(), z.string())).min(1),
		source: z.string().optional(),
		schedule: z.number().optional(),
		url_to_shorten: z.string().optional(),
	})
	.strict();
export type SendSmsCampaignInput = z.infer<typeof SendSmsCampaignInputSchema>;

export const SendSmsCampaignResponseSchema = SmsCampaignResultSchema;
export type SendSmsCampaignResponse = z.infer<
	typeof SendSmsCampaignResponseSchema
>;

export const sendSmsCampaign: CorsairEndpoint<
	ClickSendContext,
	SendSmsCampaignInput,
	SendSmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms-campaigns/send',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				list_id: input.list_id,
				name: input.name,
				body: input.body,
				from: input.from,
				senders: input.senders,
				source: input.source,
				schedule: input.schedule,
				url_to_shorten: input.url_to_shorten,
			},
			responseSchema: SendSmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.sms.send',
		{ list_id: input.list_id, name: input.name },
		'completed',
	);

	return response;
};

// ── SMS campaigns list ────────────────────────────────────────────────────────

export const ListSmsCampaignsInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		q: z.string().optional(),
		order_by: z.string().optional(),
		date_from: z.number().optional(),
		date_to: z.number().optional(),
	})
	.strict();
export type ListSmsCampaignsInput = z.infer<typeof ListSmsCampaignsInputSchema>;

export const ListSmsCampaignsResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(SmsCampaignSchema),
	})
	.passthrough();
export type ListSmsCampaignsResponse = z.infer<
	typeof ListSmsCampaignsResponseSchema
>;

export const listSmsCampaigns: CorsairEndpoint<
	ClickSendContext,
	ListSmsCampaignsInput,
	ListSmsCampaignsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms-campaigns',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
				q: input.q,
				order_by: input.order_by,
				date_from: input.date_from,
				date_to: input.date_to,
			},
			responseSchema: ListSmsCampaignsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.sms.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

// ── SMS campaign get ──────────────────────────────────────────────────────────

export const GetSmsCampaignInputSchema = z
	.object({
		sms_campaign_id: z.number().int().positive(),
	})
	.strict();
export type GetSmsCampaignInput = z.infer<typeof GetSmsCampaignInputSchema>;

export const GetSmsCampaignResponseSchema = SmsCampaignSchema;
export type GetSmsCampaignResponse = z.infer<
	typeof GetSmsCampaignResponseSchema
>;

export const getSmsCampaign: CorsairEndpoint<
	ClickSendContext,
	GetSmsCampaignInput,
	GetSmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms-campaigns/${input.sms_campaign_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: GetSmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.sms.get',
		{ sms_campaign_id: input.sms_campaign_id },
		'completed',
	);

	return response;
};

// ── SMS campaign update ───────────────────────────────────────────────────────

export const UpdateSmsCampaignInputSchema = z
	.object({
		sms_campaign_id: z.number().int().positive(),
		list_id: z.number().int().positive(),
		name: z.string().min(1),
		body: z.string().min(1),
		from: z.string().min(1),
		schedule: z.number().optional(),
	})
	.strict();
export type UpdateSmsCampaignInput = z.infer<
	typeof UpdateSmsCampaignInputSchema
>;

export const UpdateSmsCampaignResponseSchema = SmsCampaignSchema;
export type UpdateSmsCampaignResponse = z.infer<
	typeof UpdateSmsCampaignResponseSchema
>;

export const updateSmsCampaign: CorsairEndpoint<
	ClickSendContext,
	UpdateSmsCampaignInput,
	UpdateSmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms-campaigns/${input.sms_campaign_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				list_id: input.list_id,
				name: input.name,
				body: input.body,
				from: input.from,
				schedule: input.schedule,
			},
			responseSchema: UpdateSmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.sms.update',
		{ sms_campaign_id: input.sms_campaign_id },
		'completed',
	);

	return response;
};

// ── SMS campaign cancel ───────────────────────────────────────────────────────

export const CancelSmsCampaignInputSchema = z
	.object({
		sms_campaign_id: z.number().int().positive(),
	})
	.strict();
export type CancelSmsCampaignInput = z.infer<
	typeof CancelSmsCampaignInputSchema
>;

export const CancelSmsCampaignResponseSchema = z.union([
	SmsCampaignSchema,
	EmptyResultSchema,
]);
export type CancelSmsCampaignResponse = z.infer<
	typeof CancelSmsCampaignResponseSchema
>;

export const cancelSmsCampaign: CorsairEndpoint<
	ClickSendContext,
	CancelSmsCampaignInput,
	CancelSmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms-campaigns/${input.sms_campaign_id}/cancel`,
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: CancelSmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.sms.cancel',
		{ sms_campaign_id: input.sms_campaign_id },
		'completed',
	);

	return response;
};

// ── MMS campaign ──────────────────────────────────────────────────────────────

export const MmsCampaignSchema = z
	.object({
		mms_campaign_id: z.number().optional(),
		name: z.string().optional(),
		user_id: z.number().optional(),
		subaccount_id: z.number().optional(),
		list_id: z.number().optional(),
		from: z.string().optional(),
		subject: z.string().optional(),
		file_name: z.string().optional(),
		body: z.string().optional(),
		schedule: z.number().optional(),
		status: z.string().optional(),
		date_added: z.number().optional(),
		_total_count: z.number().optional(),
		_list_name: z.string().optional(),
		_media_file_url: z.string().optional(),
	})
	.passthrough();
export type MmsCampaign = z.infer<typeof MmsCampaignSchema>;

export const MmsCampaignResultSchema = z
	.object({
		total_price: z.number().optional(),
		total_count: z.number().optional(),
		queued_count: z.number().optional(),
		messages: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type MmsCampaignResult = z.infer<typeof MmsCampaignResultSchema>;

// ── MMS campaigns list ────────────────────────────────────────────────────────

export const ListMmsCampaignsInputSchema = z.object({}).strict();
export type ListMmsCampaignsInput = z.infer<typeof ListMmsCampaignsInputSchema>;

export const ListMmsCampaignsResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(MmsCampaignSchema),
	})
	.passthrough();
export type ListMmsCampaignsResponse = z.infer<
	typeof ListMmsCampaignsResponseSchema
>;

export const listMmsCampaigns: CorsairEndpoint<
	ClickSendContext,
	ListMmsCampaignsInput,
	ListMmsCampaignsResponse
> = async (ctx, _input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'mms-campaigns',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: ListMmsCampaignsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.mms.list',
		{},
		'completed',
	);

	return response;
};

// ── MMS campaign send ─────────────────────────────────────────────────────────

export const SendMmsCampaignInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		name: z.string().min(1),
		body: z.string().min(1),
		from: z.string().min(1),
		subject: z.string().min(1),
		media_file: z.string().min(1),
		schedule: z.number().optional(),
		url_to_shorten: z.string().optional(),
	})
	.strict();
export type SendMmsCampaignInput = z.infer<typeof SendMmsCampaignInputSchema>;

export const SendMmsCampaignResponseSchema = MmsCampaignResultSchema;
export type SendMmsCampaignResponse = z.infer<
	typeof SendMmsCampaignResponseSchema
>;

export const sendMmsCampaign: CorsairEndpoint<
	ClickSendContext,
	SendMmsCampaignInput,
	SendMmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'mms-campaigns/send',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				list_id: input.list_id,
				name: input.name,
				body: input.body,
				from: input.from,
				subject: input.subject,
				media_file: input.media_file,
				schedule: input.schedule,
				url_to_shorten: input.url_to_shorten,
			},
			responseSchema: SendMmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.mms.send',
		{ list_id: input.list_id, name: input.name },
		'completed',
	);

	return response;
};

// ── MMS campaign price ────────────────────────────────────────────────────────

export const PriceMmsCampaignInputSchema = SendMmsCampaignInputSchema;
export type PriceMmsCampaignInput = z.infer<typeof PriceMmsCampaignInputSchema>;

export const PriceMmsCampaignResponseSchema = MmsCampaignResultSchema;
export type PriceMmsCampaignResponse = z.infer<
	typeof PriceMmsCampaignResponseSchema
>;

export const priceMmsCampaign: CorsairEndpoint<
	ClickSendContext,
	PriceMmsCampaignInput,
	PriceMmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'mms-campaigns/price',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				list_id: input.list_id,
				name: input.name,
				body: input.body,
				from: input.from,
				subject: input.subject,
				media_file: input.media_file,
				schedule: input.schedule,
				url_to_shorten: input.url_to_shorten,
			},
			responseSchema: PriceMmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.mms.price',
		{ list_id: input.list_id, name: input.name },
		'completed',
	);

	return response;
};

// ── MMS campaign update ───────────────────────────────────────────────────────

export const UpdateMmsCampaignInputSchema = z
	.object({
		mms_campaign_id: z.number().int().positive(),
		list_id: z.number().int().positive().optional(),
		name: z.string().min(1).optional(),
		from: z.string().min(1).optional(),
		body: z.string().min(1).optional(),
		subject: z.string().min(1).optional(),
		media_file: z.string().min(1).optional(),
		schedule: z.number().optional(),
	})
	.strict();
export type UpdateMmsCampaignInput = z.infer<
	typeof UpdateMmsCampaignInputSchema
>;

export const UpdateMmsCampaignResponseSchema = MmsCampaignSchema;
export type UpdateMmsCampaignResponse = z.infer<
	typeof UpdateMmsCampaignResponseSchema
>;

export const updateMmsCampaign: CorsairEndpoint<
	ClickSendContext,
	UpdateMmsCampaignInput,
	UpdateMmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`mms-campaigns/${input.mms_campaign_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				list_id: input.list_id,
				name: input.name,
				from: input.from,
				body: input.body,
				subject: input.subject,
				media_file: input.media_file,
				schedule: input.schedule,
			},
			responseSchema: UpdateMmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.mms.update',
		{ mms_campaign_id: input.mms_campaign_id },
		'completed',
	);

	return response;
};

// ── MMS campaign cancel ───────────────────────────────────────────────────────

export const CancelMmsCampaignInputSchema = z
	.object({
		mms_campaign_id: z.number().int().positive(),
	})
	.strict();
export type CancelMmsCampaignInput = z.infer<
	typeof CancelMmsCampaignInputSchema
>;

export const CancelMmsCampaignResponseSchema = z.union([
	MmsCampaignSchema,
	EmptyResultSchema,
]);
export type CancelMmsCampaignResponse = z.infer<
	typeof CancelMmsCampaignResponseSchema
>;

export const cancelMmsCampaign: CorsairEndpoint<
	ClickSendContext,
	CancelMmsCampaignInput,
	CancelMmsCampaignResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`mms-campaigns/${input.mms_campaign_id}/cancel`,
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: CancelMmsCampaignResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.campaigns.mms.cancel',
		{ mms_campaign_id: input.mms_campaign_id },
		'completed',
	);

	return response;
};
