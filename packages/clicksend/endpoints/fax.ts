import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';
import { EmptyResultSchema } from './email';

// ── Fax receipts ──────────────────────────────────────────────────────────────

export const FaxReceiptSchema = z.object({
	timestamp_send: z.number().optional(),
	timestamp: z.number().optional(),
	message_id: z.string().optional(),
	status_code: z.string().optional(),
	status_text: z.string().optional(),
	error_code: z.string().optional(),
	error_text: z.string().optional(),
	custom_string: z.string().optional(),
	subaccount_id: z.number().optional(),
	message_type: z.string().optional(),
});
export type FaxReceipt = z.infer<typeof FaxReceiptSchema>;

export const FaxReceiptDetailSchema = z
	.object({
		user_id: z.number().optional(),
		subaccount_id: z.number().optional(),
		list_id: z.number().optional(),
		message_id: z.string().optional(),
		to: z.string().optional(),
		from: z.string().optional(),
		carrier: z.string().optional(),
		country: z.string().optional(),
		custom_string: z.string().optional(),
		schedule: z.number().optional(),
		message_pages: z.number().optional(),
		message_price: z.string().optional(),
		status_code: z.string().optional(),
		status_text: z.string().optional(),
		date_added: z.string().optional(),
		from_email: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type FaxReceiptDetail = z.infer<typeof FaxReceiptDetailSchema>;

export const FaxTestReceiptCreateInputSchema = z
	.object({
		url: z.string().min(1),
	})
	.strict();
export type FaxTestReceiptCreateInput = z.infer<
	typeof FaxTestReceiptCreateInputSchema
>;

export const FaxTestReceiptCreateResponseSchema = FaxReceiptSchema;
export type FaxTestReceiptCreateResponse = z.infer<
	typeof FaxTestReceiptCreateResponseSchema
>;

export const FaxReceiptListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type FaxReceiptListInput = z.infer<typeof FaxReceiptListInputSchema>;

export const FaxReceiptListResponseSchema = z.object({
	total: z.number().optional(),
	per_page: z.number().optional(),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(FaxReceiptSchema).optional(),
});
export type FaxReceiptListResponse = z.infer<
	typeof FaxReceiptListResponseSchema
>;

export const FaxReceiptGetInputSchema = z
	.object({
		message_id: z.string().min(1),
	})
	.strict();
export type FaxReceiptGetInput = z.infer<typeof FaxReceiptGetInputSchema>;

export const FaxReceiptGetResponseSchema = FaxReceiptDetailSchema;
export type FaxReceiptGetResponse = z.infer<typeof FaxReceiptGetResponseSchema>;

export const FaxReceiptsMarkReadInputSchema = z
	.object({
		date_before: z.number().optional(),
	})
	.strict();
export type FaxReceiptsMarkReadInput = z.infer<
	typeof FaxReceiptsMarkReadInputSchema
>;

export const FaxReceiptsMarkReadResponseSchema = EmptyResultSchema;
export type FaxReceiptsMarkReadResponse = z.infer<
	typeof FaxReceiptsMarkReadResponseSchema
>;

// ── Fax receipt rules ─────────────────────────────────────────────────────────

export const FaxReceiptRuleSchema = z.object({
	receipt_rule_id: z.number().optional(),
	rule_name: z.string().optional(),
	match_type: z.number().int().optional(),
	action: z.string().optional(),
	action_address: z.string().optional(),
	enabled: z.number().int().min(0).max(1).optional(),
});
export type FaxReceiptRule = z.infer<typeof FaxReceiptRuleSchema>;

export const FaxReceiptRuleListInputSchema = z
	.object({
		q: z.string().optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type FaxReceiptRuleListInput = z.infer<
	typeof FaxReceiptRuleListInputSchema
>;

export const FaxReceiptRuleListResponseSchema = z.object({
	total: z.number().optional(),
	per_page: z.number().optional(),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(FaxReceiptRuleSchema).optional(),
});
export type FaxReceiptRuleListResponse = z.infer<
	typeof FaxReceiptRuleListResponseSchema
>;

export const FaxReceiptRuleCreateInputSchema = z
	.object({
		rule_name: z.string().min(1),
		match_type: z.number().int(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type FaxReceiptRuleCreateInput = z.infer<
	typeof FaxReceiptRuleCreateInputSchema
>;

export const FaxReceiptRuleCreateResponseSchema = FaxReceiptRuleSchema;
export type FaxReceiptRuleCreateResponse = z.infer<
	typeof FaxReceiptRuleCreateResponseSchema
>;

export const FaxReceiptRuleGetInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
	})
	.strict();
export type FaxReceiptRuleGetInput = z.infer<
	typeof FaxReceiptRuleGetInputSchema
>;

export const FaxReceiptRuleGetResponseSchema = FaxReceiptRuleSchema;
export type FaxReceiptRuleGetResponse = z.infer<
	typeof FaxReceiptRuleGetResponseSchema
>;

export const FaxReceiptRuleUpdateInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
		rule_name: z.string().min(1),
		match_type: z.number().int(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type FaxReceiptRuleUpdateInput = z.infer<
	typeof FaxReceiptRuleUpdateInputSchema
>;

export const FaxReceiptRuleUpdateResponseSchema = FaxReceiptRuleSchema;
export type FaxReceiptRuleUpdateResponse = z.infer<
	typeof FaxReceiptRuleUpdateResponseSchema
>;

export const FaxReceiptRuleDeleteInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
	})
	.strict();
export type FaxReceiptRuleDeleteInput = z.infer<
	typeof FaxReceiptRuleDeleteInputSchema
>;

export const FaxReceiptRuleDeleteResponseSchema = EmptyResultSchema;
export type FaxReceiptRuleDeleteResponse = z.infer<
	typeof FaxReceiptRuleDeleteResponseSchema
>;

// ── Fax inbound rules ─────────────────────────────────────────────────────────

export const FaxInboundRuleSchema = z.object({
	inbound_rule_id: z.number().optional(),
	dedicated_number: z.string().optional(),
	rule_name: z.string().optional(),
	user_id: z.number().optional(),
	action: z.string().optional(),
	action_address: z.string().optional(),
	enabled: z.number().int().min(0).max(1).optional(),
});
export type FaxInboundRule = z.infer<typeof FaxInboundRuleSchema>;

export const FaxInboundRuleListInputSchema = z
	.object({
		q: z.string().optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type FaxInboundRuleListInput = z.infer<
	typeof FaxInboundRuleListInputSchema
>;

export const FaxInboundRuleListResponseSchema = z.object({
	total: z.number().optional(),
	per_page: z.number().optional(),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(FaxInboundRuleSchema).optional(),
});
export type FaxInboundRuleListResponse = z.infer<
	typeof FaxInboundRuleListResponseSchema
>;

export const FaxInboundRuleCreateInputSchema = z
	.object({
		dedicated_number: z.string().min(1),
		rule_name: z.string().min(1),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type FaxInboundRuleCreateInput = z.infer<
	typeof FaxInboundRuleCreateInputSchema
>;

export const FaxInboundRuleCreateResponseSchema = FaxInboundRuleSchema;
export type FaxInboundRuleCreateResponse = z.infer<
	typeof FaxInboundRuleCreateResponseSchema
>;

export const FaxInboundRuleGetInputSchema = z
	.object({
		inbound_rule_id: z.number().int().positive(),
	})
	.strict();
export type FaxInboundRuleGetInput = z.infer<
	typeof FaxInboundRuleGetInputSchema
>;

export const FaxInboundRuleGetResponseSchema = FaxInboundRuleSchema;
export type FaxInboundRuleGetResponse = z.infer<
	typeof FaxInboundRuleGetResponseSchema
>;

export const FaxInboundRuleUpdateInputSchema = z
	.object({
		inbound_rule_id: z.number().int().positive(),
		dedicated_number: z.string().min(1),
		rule_name: z.string().min(1),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type FaxInboundRuleUpdateInput = z.infer<
	typeof FaxInboundRuleUpdateInputSchema
>;

export const FaxInboundRuleUpdateResponseSchema = FaxInboundRuleSchema;
export type FaxInboundRuleUpdateResponse = z.infer<
	typeof FaxInboundRuleUpdateResponseSchema
>;

export const FaxInboundRuleDeleteInputSchema = z
	.object({
		inbound_rule_id: z.number().int().positive(),
	})
	.strict();
export type FaxInboundRuleDeleteInput = z.infer<
	typeof FaxInboundRuleDeleteInputSchema
>;

export const FaxInboundRuleDeleteResponseSchema = EmptyResultSchema;
export type FaxInboundRuleDeleteResponse = z.infer<
	typeof FaxInboundRuleDeleteResponseSchema
>;

// ── Fax receipt endpoints ─────────────────────────────────────────────────────

export const createFaxTestReceipt: CorsairEndpoint<
	ClickSendContext,
	FaxTestReceiptCreateInput,
	FaxTestReceiptCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'fax/receipts',
		username,
		apiKey,
		{
			method: 'POST',
			body: { url: input.url },
			responseSchema: FaxTestReceiptCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceipts.createTest',
		{ url: input.url },
		'completed',
	);

	return response;
};

export const listFaxReceipts: CorsairEndpoint<
	ClickSendContext,
	FaxReceiptListInput,
	FaxReceiptListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'fax/receipts',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: FaxReceiptListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceipts.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const getFaxReceipt: CorsairEndpoint<
	ClickSendContext,
	FaxReceiptGetInput,
	FaxReceiptGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`fax/receipts/${encodeURIComponent(input.message_id)}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: FaxReceiptGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceipts.get',
		{ message_id: input.message_id },
		'completed',
	);

	return response;
};

export const markFaxReceiptsRead: CorsairEndpoint<
	ClickSendContext,
	FaxReceiptsMarkReadInput,
	FaxReceiptsMarkReadResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'fax/receipts-read',
		username,
		apiKey,
		{
			method: 'PUT',
			body: { date_before: input.date_before },
			responseSchema: FaxReceiptsMarkReadResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceipts.markRead',
		{ date_before: input.date_before },
		'completed',
	);

	return response;
};

// ── Fax receipt rule endpoints ────────────────────────────────────────────────

export const listFaxReceiptRules: CorsairEndpoint<
	ClickSendContext,
	FaxReceiptRuleListInput,
	FaxReceiptRuleListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/fax/receipts',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				q: input.q,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: FaxReceiptRuleListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceiptRules.list',
		{ q: input.q, page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const createFaxReceiptRule: CorsairEndpoint<
	ClickSendContext,
	FaxReceiptRuleCreateInput,
	FaxReceiptRuleCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/fax/receipts',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				rule_name: input.rule_name,
				match_type: input.match_type,
				action: input.action,
				action_address: input.action_address,
				enabled: input.enabled,
			},
			responseSchema: FaxReceiptRuleCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceiptRules.create',
		{ rule_name: input.rule_name },
		'completed',
	);

	return response;
};

export const getFaxReceiptRule: CorsairEndpoint<
	ClickSendContext,
	FaxReceiptRuleGetInput,
	FaxReceiptRuleGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/fax/receipts/${input.receipt_rule_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: FaxReceiptRuleGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceiptRules.get',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

export const updateFaxReceiptRule: CorsairEndpoint<
	ClickSendContext,
	FaxReceiptRuleUpdateInput,
	FaxReceiptRuleUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/fax/receipts/${input.receipt_rule_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				rule_name: input.rule_name,
				match_type: input.match_type,
				action: input.action,
				action_address: input.action_address,
				enabled: input.enabled,
			},
			responseSchema: FaxReceiptRuleUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceiptRules.update',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

export const deleteFaxReceiptRule: CorsairEndpoint<
	ClickSendContext,
	FaxReceiptRuleDeleteInput,
	FaxReceiptRuleDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/fax/receipts/${input.receipt_rule_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: FaxReceiptRuleDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxReceiptRules.delete',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

// ── Fax inbound rule endpoints ────────────────────────────────────────────────

export const listFaxInboundRules: CorsairEndpoint<
	ClickSendContext,
	FaxInboundRuleListInput,
	FaxInboundRuleListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/fax/inbound',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				q: input.q,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: FaxInboundRuleListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxInboundRules.list',
		{ q: input.q, page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const createFaxInboundRule: CorsairEndpoint<
	ClickSendContext,
	FaxInboundRuleCreateInput,
	FaxInboundRuleCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/fax/inbound',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				dedicated_number: input.dedicated_number,
				rule_name: input.rule_name,
				action: input.action,
				action_address: input.action_address,
				enabled: input.enabled,
			},
			responseSchema: FaxInboundRuleCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxInboundRules.create',
		{ rule_name: input.rule_name },
		'completed',
	);

	return response;
};

export const getFaxInboundRule: CorsairEndpoint<
	ClickSendContext,
	FaxInboundRuleGetInput,
	FaxInboundRuleGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/fax/inbound/${input.inbound_rule_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: FaxInboundRuleGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxInboundRules.get',
		{ inbound_rule_id: input.inbound_rule_id },
		'completed',
	);

	return response;
};

export const updateFaxInboundRule: CorsairEndpoint<
	ClickSendContext,
	FaxInboundRuleUpdateInput,
	FaxInboundRuleUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/fax/inbound/${input.inbound_rule_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				dedicated_number: input.dedicated_number,
				rule_name: input.rule_name,
				action: input.action,
				action_address: input.action_address,
				enabled: input.enabled,
			},
			responseSchema: FaxInboundRuleUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxInboundRules.update',
		{ inbound_rule_id: input.inbound_rule_id },
		'completed',
	);

	return response;
};

export const deleteFaxInboundRule: CorsairEndpoint<
	ClickSendContext,
	FaxInboundRuleDeleteInput,
	FaxInboundRuleDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/fax/inbound/${input.inbound_rule_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: FaxInboundRuleDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.faxInboundRules.delete',
		{ inbound_rule_id: input.inbound_rule_id },
		'completed',
	);

	return response;
};
