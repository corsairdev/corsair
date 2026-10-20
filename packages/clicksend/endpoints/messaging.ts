import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';
import {
	ClickSendSentMessageSchema,
	SmsMessageInputSchema,
	SmsSendResponseSchema,
} from './types';

// ── Shared ────────────────────────────────────────────────────────────────────

export const EmptyResultSchema = z.union([
	z.array(z.never()),
	z.record(z.string(), z.string()),
	z.boolean(),
	z.null(),
]);
export type EmptyResult = z.infer<typeof EmptyResultSchema>;

// ── SMS price ─────────────────────────────────────────────────────────────────

export const SmsPriceInputSchema = z
	.object({
		messages: z.array(SmsMessageInputSchema).min(1),
	})
	.strict();
export type SmsPriceInput = z.infer<typeof SmsPriceInputSchema>;

export const SmsPriceResponseSchema = SmsSendResponseSchema;
export type SmsPriceResponse = z.infer<typeof SmsPriceResponseSchema>;

export const priceSms: CorsairEndpoint<
	ClickSendContext,
	SmsPriceInput,
	SmsPriceResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('sms/price', username, apiKey, {
		method: 'POST',
		body: { messages: input.messages },
		responseSchema: SmsPriceResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.sms.price',
		{ count: input.messages.length },
		'completed',
	);

	return response;
};

// ── SMS history export ────────────────────────────────────────────────────────

export const SmsHistoryExportInputSchema = z
	.object({
		filename: z.string().min(1).optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		date_from: z.number().optional(),
		date_to: z.number().optional(),
	})
	.strict();
export type SmsHistoryExportInput = z.infer<typeof SmsHistoryExportInputSchema>;

export const SmsHistoryExportResponseSchema = z
	.object({
		url: z.string().optional(),
	})
	.passthrough();
export type SmsHistoryExportResponse = z.infer<
	typeof SmsHistoryExportResponseSchema
>;

export const exportSmsHistory: CorsairEndpoint<
	ClickSendContext,
	SmsHistoryExportInput,
	SmsHistoryExportResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/history/export',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				filename: input.filename,
				page: input.page,
				limit: input.limit,
				date_from: input.date_from,
				date_to: input.date_to,
			},
			responseSchema: SmsHistoryExportResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.historyExport',
		{ filename: input.filename, page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

// ── SMS receipt (single) ──────────────────────────────────────────────────────

export const SmsReceiptGetInputSchema = z
	.object({
		message_id: z.string().min(1),
	})
	.strict();
export type SmsReceiptGetInput = z.infer<typeof SmsReceiptGetInputSchema>;

export const SmsReceiptGetResponseSchema = z
	.object({
		message_id: z.string().optional(),
		status: z.string().optional(),
		status_code: z.string().optional(),
		status_text: z.string().optional(),
		timestamp: z.number().optional(),
		original_message_id: z.string().optional(),
	})
	.passthrough();
export type SmsReceiptGetResponse = z.infer<typeof SmsReceiptGetResponseSchema>;

export const getSmsReceipt: CorsairEndpoint<
	ClickSendContext,
	SmsReceiptGetInput,
	SmsReceiptGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/receipts/${input.message_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: SmsReceiptGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.receiptGet',
		{ message_id: input.message_id },
		'completed',
	);

	return response;
};

// ── SMS test receipt ──────────────────────────────────────────────────────────

export const SmsReceiptCreateTestInputSchema = z
	.object({
		url: z.string().min(1),
	})
	.strict();
export type SmsReceiptCreateTestInput = z.infer<
	typeof SmsReceiptCreateTestInputSchema
>;

export const SmsReceiptCreateTestResponseSchema = SmsReceiptGetResponseSchema;
export type SmsReceiptCreateTestResponse = z.infer<
	typeof SmsReceiptCreateTestResponseSchema
>;

export const createSmsTestReceipt: CorsairEndpoint<
	ClickSendContext,
	SmsReceiptCreateTestInput,
	SmsReceiptCreateTestResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/receipts',
		username,
		apiKey,
		{
			method: 'POST',
			body: { url: input.url },
			responseSchema: SmsReceiptCreateTestResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.receiptCreateTest',
		{ url: input.url },
		'completed',
	);

	return response;
};

// ── SMS receipts mark read ────────────────────────────────────────────────────

export const SmsReceiptsMarkReadInputSchema = z
	.object({
		date_before: z.number().optional(),
	})
	.strict();
export type SmsReceiptsMarkReadInput = z.infer<
	typeof SmsReceiptsMarkReadInputSchema
>;

export const SmsReceiptsMarkReadResponseSchema = EmptyResultSchema;
export type SmsReceiptsMarkReadResponse = z.infer<
	typeof SmsReceiptsMarkReadResponseSchema
>;

export const markSmsReceiptsRead: CorsairEndpoint<
	ClickSendContext,
	SmsReceiptsMarkReadInput,
	SmsReceiptsMarkReadResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/receipts-read',
		username,
		apiKey,
		{
			method: 'PUT',
			body: { date_before: input.date_before },
			responseSchema: SmsReceiptsMarkReadResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.receiptsMarkRead',
		{ date_before: input.date_before },
		'completed',
	);

	return response;
};

// ── SMS test inbound ──────────────────────────────────────────────────────────

export const SmsInboundCreateTestInputSchema = z
	.object({
		to: z.string().min(1),
		from: z.string().min(1),
		body: z.string().min(1),
	})
	.strict();
export type SmsInboundCreateTestInput = z.infer<
	typeof SmsInboundCreateTestInputSchema
>;

export const SmsInboundCreateTestResponseSchema = z
	.object({
		message_id: z.string().optional(),
		to: z.string().optional(),
		from: z.string().optional(),
		body: z.string().optional(),
		timestamp: z.number().optional(),
		original_message_id: z.string().optional(),
	})
	.passthrough();
export type SmsInboundCreateTestResponse = z.infer<
	typeof SmsInboundCreateTestResponseSchema
>;

export const createSmsTestInbound: CorsairEndpoint<
	ClickSendContext,
	SmsInboundCreateTestInput,
	SmsInboundCreateTestResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('sms/inbound', username, apiKey, {
		method: 'POST',
		body: { to: input.to, from: input.from, body: input.body },
		responseSchema: SmsInboundCreateTestResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.sms.inboundCreateTest',
		{ to: input.to, from: input.from },
		'completed',
	);

	return response;
};

// ── SMS inbound mark read ─────────────────────────────────────────────────────

export const SmsInboundMarkReadInputSchema = z
	.object({
		date_before: z.number().optional(),
	})
	.strict();
export type SmsInboundMarkReadInput = z.infer<
	typeof SmsInboundMarkReadInputSchema
>;

export const SmsInboundMarkReadResponseSchema = EmptyResultSchema;
export type SmsInboundMarkReadResponse = z.infer<
	typeof SmsInboundMarkReadResponseSchema
>;

export const markSmsInboundRead: CorsairEndpoint<
	ClickSendContext,
	SmsInboundMarkReadInput,
	SmsInboundMarkReadResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/inbound-read',
		username,
		apiKey,
		{
			method: 'PUT',
			body: { date_before: input.date_before },
			responseSchema: SmsInboundMarkReadResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.inboundMarkRead',
		{ date_before: input.date_before },
		'completed',
	);

	return response;
};

// ── SMS inbound mark read (one) ───────────────────────────────────────────────

export const SmsInboundMarkReadOneInputSchema = z
	.object({
		message_id: z.string().min(1),
	})
	.strict();
export type SmsInboundMarkReadOneInput = z.infer<
	typeof SmsInboundMarkReadOneInputSchema
>;

export const SmsInboundMarkReadOneResponseSchema = EmptyResultSchema;
export type SmsInboundMarkReadOneResponse = z.infer<
	typeof SmsInboundMarkReadOneResponseSchema
>;

export const markSmsInboundReadOne: CorsairEndpoint<
	ClickSendContext,
	SmsInboundMarkReadOneInput,
	SmsInboundMarkReadOneResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/inbound-read/${input.message_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: SmsInboundMarkReadOneResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.inboundMarkReadOne',
		{ message_id: input.message_id },
		'completed',
	);

	return response;
};

// ── SMS cancel ────────────────────────────────────────────────────────────────

export const SmsCancelInputSchema = z
	.object({
		message_id: z.string().min(1),
	})
	.strict();
export type SmsCancelInput = z.infer<typeof SmsCancelInputSchema>;

export const SmsCancelResponseSchema = ClickSendSentMessageSchema;
export type SmsCancelResponse = z.infer<typeof SmsCancelResponseSchema>;

export const cancelSms: CorsairEndpoint<
	ClickSendContext,
	SmsCancelInput,
	SmsCancelResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/${input.message_id}/cancel`,
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: SmsCancelResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.cancel',
		{ message_id: input.message_id },
		'completed',
	);

	return response;
};

// ── SMS cancel all ────────────────────────────────────────────────────────────

export const SmsCancelAllInputSchema = z
	.object({
		custom_string: z.string().optional(),
	})
	.strict();
export type SmsCancelAllInput = z.infer<typeof SmsCancelAllInputSchema>;

export const SmsCancelAllResponseSchema = z
	.object({
		count: z.number().optional(),
	})
	.passthrough();
export type SmsCancelAllResponse = z.infer<typeof SmsCancelAllResponseSchema>;

export const cancelAllSms: CorsairEndpoint<
	ClickSendContext,
	SmsCancelAllInput,
	SmsCancelAllResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/cancel-all',
		username,
		apiKey,
		{
			method: 'PUT',
			body: { custom_string: input.custom_string },
			responseSchema: SmsCancelAllResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.sms.cancelAll',
		{ custom_string: input.custom_string },
		'completed',
	);

	return response;
};

// ── SMS statistics ────────────────────────────────────────────────────────────

export const SmsStatisticsInputSchema = z.object({}).strict();
export type SmsStatisticsInput = z.infer<typeof SmsStatisticsInputSchema>;

export const SmsStatisticsResponseSchema = z
	.object({
		total: z.object({}).passthrough().optional(),
		inbound: z.object({}).passthrough().optional(),
		outbound: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type SmsStatisticsResponse = z.infer<typeof SmsStatisticsResponseSchema>;

export const smsStatistics: CorsairEndpoint<
	ClickSendContext,
	SmsStatisticsInput,
	SmsStatisticsResponse
> = async (ctx, _input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'statistics/sms',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: SmsStatisticsResponseSchema,
		},
	);

	await logEventFromContext(ctx, 'clicksend.sms.statistics', {}, 'completed');

	return response;
};

// ── SMS templates ─────────────────────────────────────────────────────────────

export const SmsTemplateSchema = z
	.object({
		template_id: z.number().optional(),
		template_name: z.string().optional(),
		body: z.string().optional(),
	})
	.passthrough();
export type SmsTemplate = z.infer<typeof SmsTemplateSchema>;

export const SmsTemplateCreateInputSchema = z
	.object({
		template_name: z.string().min(1),
		body: z.string().min(1),
	})
	.strict();
export type SmsTemplateCreateInput = z.infer<
	typeof SmsTemplateCreateInputSchema
>;

export const SmsTemplateCreateResponseSchema = SmsTemplateSchema;
export type SmsTemplateCreateResponse = z.infer<
	typeof SmsTemplateCreateResponseSchema
>;

export const createSmsTemplate: CorsairEndpoint<
	ClickSendContext,
	SmsTemplateCreateInput,
	SmsTemplateCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/templates',
		username,
		apiKey,
		{
			method: 'POST',
			body: { template_name: input.template_name, body: input.body },
			responseSchema: SmsTemplateCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsTemplates.create',
		{ template_name: input.template_name },
		'completed',
	);

	return response;
};

export const SmsTemplatesListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type SmsTemplatesListInput = z.infer<typeof SmsTemplatesListInputSchema>;

export const SmsTemplatesListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(SmsTemplateSchema),
	})
	.passthrough();
export type SmsTemplatesListResponse = z.infer<
	typeof SmsTemplatesListResponseSchema
>;

export const listSmsTemplates: CorsairEndpoint<
	ClickSendContext,
	SmsTemplatesListInput,
	SmsTemplatesListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/templates',
		username,
		apiKey,
		{
			method: 'GET',
			query: { page: input.page, limit: input.limit },
			responseSchema: SmsTemplatesListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsTemplates.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const SmsTemplateGetInputSchema = z
	.object({
		template_id: z.number().int().positive(),
	})
	.strict();
export type SmsTemplateGetInput = z.infer<typeof SmsTemplateGetInputSchema>;

export const SmsTemplateGetResponseSchema = SmsTemplateSchema;
export type SmsTemplateGetResponse = z.infer<
	typeof SmsTemplateGetResponseSchema
>;

export const getSmsTemplate: CorsairEndpoint<
	ClickSendContext,
	SmsTemplateGetInput,
	SmsTemplateGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/templates/${input.template_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: SmsTemplateGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsTemplates.get',
		{ template_id: input.template_id },
		'completed',
	);

	return response;
};

export const SmsTemplateUpdateInputSchema = z
	.object({
		template_id: z.number().int().positive(),
		template_name: z.string().min(1).optional(),
		body: z.string().min(1).optional(),
	})
	.strict();
export type SmsTemplateUpdateInput = z.infer<
	typeof SmsTemplateUpdateInputSchema
>;

export const SmsTemplateUpdateResponseSchema = SmsTemplateSchema;
export type SmsTemplateUpdateResponse = z.infer<
	typeof SmsTemplateUpdateResponseSchema
>;

export const updateSmsTemplate: CorsairEndpoint<
	ClickSendContext,
	SmsTemplateUpdateInput,
	SmsTemplateUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/templates/${input.template_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: { template_name: input.template_name, body: input.body },
			responseSchema: SmsTemplateUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsTemplates.update',
		{ template_id: input.template_id },
		'completed',
	);

	return response;
};

export const SmsTemplateDeleteInputSchema = z
	.object({
		template_id: z.number().int().positive(),
	})
	.strict();
export type SmsTemplateDeleteInput = z.infer<
	typeof SmsTemplateDeleteInputSchema
>;

export const SmsTemplateDeleteResponseSchema = EmptyResultSchema;
export type SmsTemplateDeleteResponse = z.infer<
	typeof SmsTemplateDeleteResponseSchema
>;

export const deleteSmsTemplate: CorsairEndpoint<
	ClickSendContext,
	SmsTemplateDeleteInput,
	SmsTemplateDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/templates/${input.template_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: SmsTemplateDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsTemplates.delete',
		{ template_id: input.template_id },
		'completed',
	);

	return response;
};

// ── SMS stripped strings ──────────────────────────────────────────────────────

export const SmsStrippedStringRuleSchema = z
	.object({
		rule_id: z.number().optional(),
		strip_string: z.string().optional(),
		stripped_string: z.string().optional(),
	})
	.passthrough();
export type SmsStrippedStringRule = z.infer<typeof SmsStrippedStringRuleSchema>;

export const SmsStrippedStringsListInputSchema = z.object({}).strict();
export type SmsStrippedStringsListInput = z.infer<
	typeof SmsStrippedStringsListInputSchema
>;

export const SmsStrippedStringsListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(SmsStrippedStringRuleSchema),
	})
	.passthrough();
export type SmsStrippedStringsListResponse = z.infer<
	typeof SmsStrippedStringsListResponseSchema
>;

export const listSmsStrippedStrings: CorsairEndpoint<
	ClickSendContext,
	SmsStrippedStringsListInput,
	SmsStrippedStringsListResponse
> = async (ctx, _input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/email-sms-stripped-strings',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: SmsStrippedStringsListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsStrippedStrings.list',
		{},
		'completed',
	);

	return response;
};

export const SmsStrippedStringGetInputSchema = z
	.object({
		rule_id: z.number().int().positive(),
	})
	.strict();
export type SmsStrippedStringGetInput = z.infer<
	typeof SmsStrippedStringGetInputSchema
>;

export const SmsStrippedStringGetResponseSchema = SmsStrippedStringRuleSchema;
export type SmsStrippedStringGetResponse = z.infer<
	typeof SmsStrippedStringGetResponseSchema
>;

export const getSmsStrippedString: CorsairEndpoint<
	ClickSendContext,
	SmsStrippedStringGetInput,
	SmsStrippedStringGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/email-sms-stripped-strings/${input.rule_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: SmsStrippedStringGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsStrippedStrings.get',
		{ rule_id: input.rule_id },
		'completed',
	);

	return response;
};

export const SmsStrippedStringCreateInputSchema = z
	.object({
		strip_string: z.string().min(1),
	})
	.strict();
export type SmsStrippedStringCreateInput = z.infer<
	typeof SmsStrippedStringCreateInputSchema
>;

export const SmsStrippedStringCreateResponseSchema =
	SmsStrippedStringRuleSchema;
export type SmsStrippedStringCreateResponse = z.infer<
	typeof SmsStrippedStringCreateResponseSchema
>;

export const createSmsStrippedString: CorsairEndpoint<
	ClickSendContext,
	SmsStrippedStringCreateInput,
	SmsStrippedStringCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/email-sms-stripped-strings',
		username,
		apiKey,
		{
			method: 'POST',
			body: { strip_string: input.strip_string },
			responseSchema: SmsStrippedStringCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsStrippedStrings.create',
		{ strip_string: input.strip_string },
		'completed',
	);

	return response;
};

export const SmsStrippedStringUpdateInputSchema = z
	.object({
		rule_id: z.number().int().positive(),
		strip_string: z.string().min(1),
	})
	.strict();
export type SmsStrippedStringUpdateInput = z.infer<
	typeof SmsStrippedStringUpdateInputSchema
>;

export const SmsStrippedStringUpdateResponseSchema =
	SmsStrippedStringRuleSchema;
export type SmsStrippedStringUpdateResponse = z.infer<
	typeof SmsStrippedStringUpdateResponseSchema
>;

export const updateSmsStrippedString: CorsairEndpoint<
	ClickSendContext,
	SmsStrippedStringUpdateInput,
	SmsStrippedStringUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/email-sms-stripped-strings/${input.rule_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: { strip_string: input.strip_string },
			responseSchema: SmsStrippedStringUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsStrippedStrings.update',
		{ rule_id: input.rule_id },
		'completed',
	);

	return response;
};

export const SmsStrippedStringDeleteInputSchema = z
	.object({
		rule_id: z.number().int().positive(),
	})
	.strict();
export type SmsStrippedStringDeleteInput = z.infer<
	typeof SmsStrippedStringDeleteInputSchema
>;

export const SmsStrippedStringDeleteResponseSchema = EmptyResultSchema;
export type SmsStrippedStringDeleteResponse = z.infer<
	typeof SmsStrippedStringDeleteResponseSchema
>;

export const deleteSmsStrippedString: CorsairEndpoint<
	ClickSendContext,
	SmsStrippedStringDeleteInput,
	SmsStrippedStringDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`sms/email-sms-stripped-strings/${input.rule_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: SmsStrippedStringDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsStrippedStrings.delete',
		{ rule_id: input.rule_id },
		'completed',
	);

	return response;
};

// ── SMS email-to-SMS allowed emails ───────────────────────────────────────────

export const SmsAllowedEmailSchema = z
	.object({
		email_address_id: z.number().optional(),
		email_address: z.string().optional(),
		from: z.string().optional(),
		subaccount_id: z.number().optional(),
		from_fax: z.string().optional(),
		voice: z.string().optional(),
		lang: z.string().optional(),
	})
	.passthrough();
export type SmsAllowedEmail = z.infer<typeof SmsAllowedEmailSchema>;

export const SmsAllowedEmailCreateInputSchema = z
	.object({
		email_address: z.string().min(1),
		from: z.string().optional(),
		from_fax: z.string().optional(),
		subaccount_id: z.number().int().positive().optional(),
	})
	.strict();
export type SmsAllowedEmailCreateInput = z.infer<
	typeof SmsAllowedEmailCreateInputSchema
>;

export const SmsAllowedEmailCreateResponseSchema = SmsAllowedEmailSchema;
export type SmsAllowedEmailCreateResponse = z.infer<
	typeof SmsAllowedEmailCreateResponseSchema
>;

export const createSmsAllowedEmail: CorsairEndpoint<
	ClickSendContext,
	SmsAllowedEmailCreateInput,
	SmsAllowedEmailCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/email-sms',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				email_address: input.email_address,
				from: input.from,
				from_fax: input.from_fax,
				subaccount_id: input.subaccount_id,
			},
			responseSchema: SmsAllowedEmailCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsEmailSms.create',
		{ email_address: input.email_address },
		'completed',
	);

	return response;
};

export const SmsAllowedEmailsListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type SmsAllowedEmailsListInput = z.infer<
	typeof SmsAllowedEmailsListInputSchema
>;

export const SmsAllowedEmailsListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(SmsAllowedEmailSchema),
	})
	.passthrough();
export type SmsAllowedEmailsListResponse = z.infer<
	typeof SmsAllowedEmailsListResponseSchema
>;

export const listSmsAllowedEmails: CorsairEndpoint<
	ClickSendContext,
	SmsAllowedEmailsListInput,
	SmsAllowedEmailsListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'sms/email-sms',
		username,
		apiKey,
		{
			method: 'GET',
			query: { page: input.page, limit: input.limit },
			responseSchema: SmsAllowedEmailsListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.smsEmailSms.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

// ── Voice cancel all ──────────────────────────────────────────────────────────

export const VoiceCancelAllInputSchema = z.object({}).strict();
export type VoiceCancelAllInput = z.infer<typeof VoiceCancelAllInputSchema>;

export const VoiceCancelAllResponseSchema = z
	.object({
		count: z.number().optional(),
	})
	.passthrough();
export type VoiceCancelAllResponse = z.infer<
	typeof VoiceCancelAllResponseSchema
>;

export const cancelAllVoice: CorsairEndpoint<
	ClickSendContext,
	VoiceCancelAllInput,
	VoiceCancelAllResponse
> = async (ctx, _input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'voice/cancel-all',
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: VoiceCancelAllResponseSchema,
		},
	);

	await logEventFromContext(ctx, 'clicksend.voice.cancelAll', {}, 'completed');

	return response;
};

// ── Voice history export ──────────────────────────────────────────────────────

export const VoiceHistoryExportInputSchema = z
	.object({
		filename: z.string().min(1).optional(),
		q: z.string().optional(),
		order_by: z.string().optional(),
		date_from: z.number().optional(),
		date_to: z.number().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type VoiceHistoryExportInput = z.infer<
	typeof VoiceHistoryExportInputSchema
>;

export const VoiceHistoryExportResponseSchema = z
	.object({
		url: z.string().optional(),
	})
	.passthrough();
export type VoiceHistoryExportResponse = z.infer<
	typeof VoiceHistoryExportResponseSchema
>;

export const exportVoiceHistory: CorsairEndpoint<
	ClickSendContext,
	VoiceHistoryExportInput,
	VoiceHistoryExportResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'voice/history/export',
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
			responseSchema: VoiceHistoryExportResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.voice.historyExport',
		{ filename: input.filename, limit: input.limit },
		'completed',
	);

	return response;
};

// ── Voice languages ───────────────────────────────────────────────────────────

export const VoiceLanguagesListInputSchema = z.object({}).strict();
export type VoiceLanguagesListInput = z.infer<
	typeof VoiceLanguagesListInputSchema
>;

export const VoiceLanguageSchema = z
	.object({
		code: z.string(),
		country: z.string().optional(),
		gender: z.string().optional(),
	})
	.passthrough();
export type VoiceLanguage = z.infer<typeof VoiceLanguageSchema>;

export const VoiceLanguagesListResponseSchema = z.array(VoiceLanguageSchema);
export type VoiceLanguagesListResponse = z.infer<
	typeof VoiceLanguagesListResponseSchema
>;

export const listVoiceLanguages: CorsairEndpoint<
	ClickSendContext,
	VoiceLanguagesListInput,
	VoiceLanguagesListResponse
> = async (ctx, _input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('voice/lang', username, apiKey, {
		method: 'GET',
		responseSchema: VoiceLanguagesListResponseSchema,
	});

	await logEventFromContext(ctx, 'clicksend.voice.languages', {}, 'completed');

	return response;
};

// ── Voice statistics ──────────────────────────────────────────────────────────

export const VoiceStatisticsInputSchema = z.object({}).strict();
export type VoiceStatisticsInput = z.infer<typeof VoiceStatisticsInputSchema>;

export const VoiceStatisticsResponseSchema = SmsStatisticsResponseSchema;
export type VoiceStatisticsResponse = z.infer<
	typeof VoiceStatisticsResponseSchema
>;

export const voiceStatistics: CorsairEndpoint<
	ClickSendContext,
	VoiceStatisticsInput,
	VoiceStatisticsResponse
> = async (ctx, _input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'statistics/voice',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: VoiceStatisticsResponseSchema,
		},
	);

	await logEventFromContext(ctx, 'clicksend.voice.statistics', {}, 'completed');

	return response;
};

// ── Voice receipts mark read ──────────────────────────────────────────────────

export const VoiceReceiptsMarkReadInputSchema = z
	.object({
		date_before: z.number().optional(),
	})
	.strict();
export type VoiceReceiptsMarkReadInput = z.infer<
	typeof VoiceReceiptsMarkReadInputSchema
>;

export const VoiceReceiptsMarkReadResponseSchema = EmptyResultSchema;
export type VoiceReceiptsMarkReadResponse = z.infer<
	typeof VoiceReceiptsMarkReadResponseSchema
>;

export const markVoiceReceiptsRead: CorsairEndpoint<
	ClickSendContext,
	VoiceReceiptsMarkReadInput,
	VoiceReceiptsMarkReadResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'voice/receipts-read',
		username,
		apiKey,
		{
			method: 'PUT',
			body: { date_before: input.date_before },
			responseSchema: VoiceReceiptsMarkReadResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.voice.receiptsMarkRead',
		{ date_before: input.date_before },
		'completed',
	);

	return response;
};
