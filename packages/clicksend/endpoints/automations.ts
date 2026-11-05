import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';
import type { EmptyResult } from './post';
import { EmptyResultSchema } from './post';

// ── SMS inbound rules ─────────────────────────────────────────────────────────

export const SmsInboundRuleSchema = z
	.object({
		inbound_rule_id: z.number().optional(),
		dedicated_number: z.string().optional(),
		rule_name: z.string().optional(),
		message_search_type: z.number().optional(),
		message_search_term: z.string().optional(),
		action: z.string().optional(),
		action_address: z.string().optional(),
		body: z.string().optional(),
		enabled: z.number().optional(),
	})
	.passthrough();
export type SmsInboundRule = z.infer<typeof SmsInboundRuleSchema>;

export const SmsInboundRuleCreateInputSchema = z
	.object({
		dedicated_number: z.string().min(1),
		rule_name: z.string().min(1),
		message_search_type: z.number().int(),
		message_search_term: z.string().optional(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		body: z.string().optional(),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type SmsInboundRuleCreateInput = z.infer<
	typeof SmsInboundRuleCreateInputSchema
>;

export const SmsInboundRuleCreateResponseSchema = SmsInboundRuleSchema;
export type SmsInboundRuleCreateResponse = z.infer<
	typeof SmsInboundRuleCreateResponseSchema
>;

export const SmsInboundRulesListInputSchema = z
	.object({
		q: z.string().optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type SmsInboundRulesListInput = z.infer<
	typeof SmsInboundRulesListInputSchema
>;

export const SmsInboundRulesListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(SmsInboundRuleSchema).optional(),
	})
	.passthrough();
export type SmsInboundRulesListResponse = z.infer<
	typeof SmsInboundRulesListResponseSchema
>;

export const SmsInboundRuleGetInputSchema = z
	.object({
		inbound_rule_id: z.number().int().positive(),
	})
	.strict();
export type SmsInboundRuleGetInput = z.infer<
	typeof SmsInboundRuleGetInputSchema
>;

export const SmsInboundRuleGetResponseSchema = SmsInboundRuleSchema;
export type SmsInboundRuleGetResponse = z.infer<
	typeof SmsInboundRuleGetResponseSchema
>;

export const SmsInboundRuleUpdateInputSchema = z
	.object({
		inbound_rule_id: z.number().int().positive(),
		dedicated_number: z.string().min(1),
		rule_name: z.string().min(1),
		message_search_type: z.number().int(),
		message_search_term: z.string().optional(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		body: z.string().optional(),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type SmsInboundRuleUpdateInput = z.infer<
	typeof SmsInboundRuleUpdateInputSchema
>;

export const SmsInboundRuleUpdateResponseSchema = SmsInboundRuleSchema;
export type SmsInboundRuleUpdateResponse = z.infer<
	typeof SmsInboundRuleUpdateResponseSchema
>;

export const SmsInboundRuleDeleteInputSchema = z
	.object({
		inbound_rule_id: z.number().int().positive(),
	})
	.strict();
export type SmsInboundRuleDeleteInput = z.infer<
	typeof SmsInboundRuleDeleteInputSchema
>;

export const SmsInboundRuleDeleteResponseSchema = EmptyResultSchema;
export type SmsInboundRuleDeleteResponse = EmptyResult;

// ── SMS receipt rules ─────────────────────────────────────────────────────────

export const SmsReceiptRuleSchema = z
	.object({
		receipt_rule_id: z.number().optional(),
		rule_name: z.string().optional(),
		match_type: z.number().optional(),
		action: z.string().optional(),
		action_address: z.string().optional(),
		enabled: z.number().optional(),
	})
	.passthrough();
export type SmsReceiptRule = z.infer<typeof SmsReceiptRuleSchema>;

export const SmsReceiptRuleCreateInputSchema = z
	.object({
		rule_name: z.string().min(1),
		match_type: z.number().int(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type SmsReceiptRuleCreateInput = z.infer<
	typeof SmsReceiptRuleCreateInputSchema
>;

export const SmsReceiptRuleCreateResponseSchema = SmsReceiptRuleSchema;
export type SmsReceiptRuleCreateResponse = z.infer<
	typeof SmsReceiptRuleCreateResponseSchema
>;

export const SmsReceiptRulesListInputSchema = z
	.object({
		q: z.string().optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type SmsReceiptRulesListInput = z.infer<
	typeof SmsReceiptRulesListInputSchema
>;

export const SmsReceiptRulesListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(SmsReceiptRuleSchema).optional(),
	})
	.passthrough();
export type SmsReceiptRulesListResponse = z.infer<
	typeof SmsReceiptRulesListResponseSchema
>;

export const SmsReceiptRuleGetInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
	})
	.strict();
export type SmsReceiptRuleGetInput = z.infer<
	typeof SmsReceiptRuleGetInputSchema
>;

export const SmsReceiptRuleGetResponseSchema = SmsReceiptRuleSchema;
export type SmsReceiptRuleGetResponse = z.infer<
	typeof SmsReceiptRuleGetResponseSchema
>;

export const SmsReceiptRuleUpdateInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
		rule_name: z.string().min(1),
		match_type: z.number().int(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type SmsReceiptRuleUpdateInput = z.infer<
	typeof SmsReceiptRuleUpdateInputSchema
>;

export const SmsReceiptRuleUpdateResponseSchema = SmsReceiptRuleSchema;
export type SmsReceiptRuleUpdateResponse = z.infer<
	typeof SmsReceiptRuleUpdateResponseSchema
>;

export const SmsReceiptRuleDeleteInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
	})
	.strict();
export type SmsReceiptRuleDeleteInput = z.infer<
	typeof SmsReceiptRuleDeleteInputSchema
>;

export const SmsReceiptRuleDeleteResponseSchema = EmptyResultSchema;
export type SmsReceiptRuleDeleteResponse = EmptyResult;

// ── Voice receipt rules ───────────────────────────────────────────────────────

export const VoiceReceiptRuleSchema = z
	.object({
		receipt_rule_id: z.number().optional(),
		rule_name: z.string().optional(),
		match_type: z.number().optional(),
		action: z.string().optional(),
		action_address: z.string().optional(),
		enabled: z.number().optional(),
	})
	.passthrough();
export type VoiceReceiptRule = z.infer<typeof VoiceReceiptRuleSchema>;

export const VoiceReceiptRuleCreateInputSchema = z
	.object({
		rule_name: z.string().min(1),
		match_type: z.number().int(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type VoiceReceiptRuleCreateInput = z.infer<
	typeof VoiceReceiptRuleCreateInputSchema
>;

export const VoiceReceiptRuleCreateResponseSchema = VoiceReceiptRuleSchema;
export type VoiceReceiptRuleCreateResponse = z.infer<
	typeof VoiceReceiptRuleCreateResponseSchema
>;

export const VoiceReceiptRulesListInputSchema = z
	.object({
		q: z.string().optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type VoiceReceiptRulesListInput = z.infer<
	typeof VoiceReceiptRulesListInputSchema
>;

export const VoiceReceiptRulesListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(VoiceReceiptRuleSchema).optional(),
	})
	.passthrough();
export type VoiceReceiptRulesListResponse = z.infer<
	typeof VoiceReceiptRulesListResponseSchema
>;

export const VoiceReceiptRuleGetInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
	})
	.strict();
export type VoiceReceiptRuleGetInput = z.infer<
	typeof VoiceReceiptRuleGetInputSchema
>;

export const VoiceReceiptRuleGetResponseSchema = VoiceReceiptRuleSchema;
export type VoiceReceiptRuleGetResponse = z.infer<
	typeof VoiceReceiptRuleGetResponseSchema
>;

export const VoiceReceiptRuleUpdateInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
		rule_name: z.string().min(1),
		match_type: z.number().int(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type VoiceReceiptRuleUpdateInput = z.infer<
	typeof VoiceReceiptRuleUpdateInputSchema
>;

export const VoiceReceiptRuleUpdateResponseSchema = VoiceReceiptRuleSchema;
export type VoiceReceiptRuleUpdateResponse = z.infer<
	typeof VoiceReceiptRuleUpdateResponseSchema
>;

export const VoiceReceiptRuleDeleteInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
	})
	.strict();
export type VoiceReceiptRuleDeleteInput = z.infer<
	typeof VoiceReceiptRuleDeleteInputSchema
>;

export const VoiceReceiptRuleDeleteResponseSchema = EmptyResultSchema;
export type VoiceReceiptRuleDeleteResponse = EmptyResult;

// ── Endpoints: SMS inbound rules ──────────────────────────────────────────────

export const listSmsInboundRules: CorsairEndpoint<
	ClickSendContext,
	SmsInboundRulesListInput,
	SmsInboundRulesListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/inbound',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				q: input.q,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: SmsInboundRulesListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsInboundRules.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const createSmsInboundRule: CorsairEndpoint<
	ClickSendContext,
	SmsInboundRuleCreateInput,
	SmsInboundRuleCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/inbound',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				dedicated_number: input.dedicated_number,
				rule_name: input.rule_name,
				message_search_type: input.message_search_type,
				message_search_term: input.message_search_term,
				action: input.action,
				action_address: input.action_address,
				body: input.body,
				enabled: input.enabled,
			},
			responseSchema: SmsInboundRuleCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsInboundRules.create',
		{ rule_name: input.rule_name },
		'completed',
	);

	return response;
};

export const getSmsInboundRule: CorsairEndpoint<
	ClickSendContext,
	SmsInboundRuleGetInput,
	SmsInboundRuleGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/inbound/' + input.inbound_rule_id,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: SmsInboundRuleGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsInboundRules.get',
		{ inbound_rule_id: input.inbound_rule_id },
		'completed',
	);

	return response;
};

export const updateSmsInboundRule: CorsairEndpoint<
	ClickSendContext,
	SmsInboundRuleUpdateInput,
	SmsInboundRuleUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/inbound/' + input.inbound_rule_id,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				dedicated_number: input.dedicated_number,
				rule_name: input.rule_name,
				message_search_type: input.message_search_type,
				message_search_term: input.message_search_term,
				action: input.action,
				action_address: input.action_address,
				body: input.body,
				enabled: input.enabled,
			},
			responseSchema: SmsInboundRuleUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsInboundRules.update',
		{ inbound_rule_id: input.inbound_rule_id },
		'completed',
	);

	return response;
};

export const deleteSmsInboundRule: CorsairEndpoint<
	ClickSendContext,
	SmsInboundRuleDeleteInput,
	SmsInboundRuleDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/inbound/' + input.inbound_rule_id,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: SmsInboundRuleDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsInboundRules.delete',
		{ inbound_rule_id: input.inbound_rule_id },
		'completed',
	);

	return response;
};

// ── Endpoints: SMS receipt rules ──────────────────────────────────────────────

export const listSmsReceiptRules: CorsairEndpoint<
	ClickSendContext,
	SmsReceiptRulesListInput,
	SmsReceiptRulesListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/receipts',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				q: input.q,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: SmsReceiptRulesListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsReceiptRules.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const createSmsReceiptRule: CorsairEndpoint<
	ClickSendContext,
	SmsReceiptRuleCreateInput,
	SmsReceiptRuleCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/receipts',
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
			responseSchema: SmsReceiptRuleCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsReceiptRules.create',
		{ rule_name: input.rule_name },
		'completed',
	);

	return response;
};

export const getSmsReceiptRule: CorsairEndpoint<
	ClickSendContext,
	SmsReceiptRuleGetInput,
	SmsReceiptRuleGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/receipts/' + input.receipt_rule_id,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: SmsReceiptRuleGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsReceiptRules.get',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

export const updateSmsReceiptRule: CorsairEndpoint<
	ClickSendContext,
	SmsReceiptRuleUpdateInput,
	SmsReceiptRuleUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/receipts/' + input.receipt_rule_id,
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
			responseSchema: SmsReceiptRuleUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsReceiptRules.update',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

export const deleteSmsReceiptRule: CorsairEndpoint<
	ClickSendContext,
	SmsReceiptRuleDeleteInput,
	SmsReceiptRuleDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/sms/receipts/' + input.receipt_rule_id,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: SmsReceiptRuleDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsReceiptRules.delete',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

// ── Endpoints: voice receipt rules ────────────────────────────────────────────

export const listVoiceReceiptRules: CorsairEndpoint<
	ClickSendContext,
	VoiceReceiptRulesListInput,
	VoiceReceiptRulesListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/voice/receipts',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				q: input.q,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: VoiceReceiptRulesListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.voiceReceiptRules.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const createVoiceReceiptRule: CorsairEndpoint<
	ClickSendContext,
	VoiceReceiptRuleCreateInput,
	VoiceReceiptRuleCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/voice/receipts',
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
			responseSchema: VoiceReceiptRuleCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.voiceReceiptRules.create',
		{ rule_name: input.rule_name },
		'completed',
	);

	return response;
};

export const getVoiceReceiptRule: CorsairEndpoint<
	ClickSendContext,
	VoiceReceiptRuleGetInput,
	VoiceReceiptRuleGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/voice/receipts/' + input.receipt_rule_id,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: VoiceReceiptRuleGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.voiceReceiptRules.get',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

export const updateVoiceReceiptRule: CorsairEndpoint<
	ClickSendContext,
	VoiceReceiptRuleUpdateInput,
	VoiceReceiptRuleUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/voice/receipts/' + input.receipt_rule_id,
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
			responseSchema: VoiceReceiptRuleUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.voiceReceiptRules.update',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

export const deleteVoiceReceiptRule: CorsairEndpoint<
	ClickSendContext,
	VoiceReceiptRuleDeleteInput,
	VoiceReceiptRuleDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/voice/receipts/' + input.receipt_rule_id,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: VoiceReceiptRuleDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.voiceReceiptRules.delete',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};
