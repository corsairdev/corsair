import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';
import { EmptyResultSchema } from './messaging';

// ── MMS message ───────────────────────────────────────────────────────────────

export const MmsMessageInputSchema = z
	.object({
		to: z.string().min(1),
		body: z.string().min(1),
		subject: z.string().min(1),
		from: z.string().min(1),
		source: z.string().optional(),
		schedule: z.number().optional(),
		country: z.string().optional(),
		list_id: z.number().int().positive().optional(),
		custom_string: z.string().optional(),
		from_email: z.string().optional(),
	})
	.strict();
export type MmsMessageInput = z.infer<typeof MmsMessageInputSchema>;

export const MmsMessageResultSchema = z
	.object({
		direction: z.string().optional(),
		date: z.number().optional(),
		to: z.string().optional(),
		body: z.string().optional(),
		subject: z.string().optional(),
		from: z.string().optional(),
		schedule: z.number().optional(),
		message_id: z.string().optional(),
		message_parts: z.number().optional(),
		message_price: z.string().optional(),
		custom_string: z.string().optional(),
		user_id: z.number().optional(),
		subaccount_id: z.number().optional(),
		country: z.string().optional(),
		carrier: z.string().optional(),
		currency: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type MmsMessageResult = z.infer<typeof MmsMessageResultSchema>;

// ── MMS send ──────────────────────────────────────────────────────────────────

export const MmsSendInputSchema = z
	.object({
		media_file: z.string().min(1),
		messages: z.array(MmsMessageInputSchema).min(1),
	})
	.strict();
export type MmsSendInput = z.infer<typeof MmsSendInputSchema>;

export const MmsSendResponseSchema = z
	.object({
		total_price: z.number().optional(),
		total_count: z.number().optional(),
		queued_count: z.number().optional(),
		messages: z.array(MmsMessageResultSchema),
	})
	.passthrough();
export type MmsSendResponse = z.infer<typeof MmsSendResponseSchema>;

export const sendMms: CorsairEndpoint<
	ClickSendContext,
	MmsSendInput,
	MmsSendResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('mms/send', username, apiKey, {
		method: 'POST',
		body: { media_file: input.media_file, messages: input.messages },
		responseSchema: MmsSendResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.mms.send',
		{ count: input.messages.length },
		'completed',
	);

	return response;
};

// ── MMS price ─────────────────────────────────────────────────────────────────

export const MmsPriceInputSchema = MmsSendInputSchema;
export type MmsPriceInput = z.infer<typeof MmsPriceInputSchema>;

export const MmsPriceResponseSchema = MmsSendResponseSchema;
export type MmsPriceResponse = z.infer<typeof MmsPriceResponseSchema>;

export const priceMms: CorsairEndpoint<
	ClickSendContext,
	MmsPriceInput,
	MmsPriceResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('mms/price', username, apiKey, {
		method: 'POST',
		body: { media_file: input.media_file, messages: input.messages },
		responseSchema: MmsPriceResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.mms.price',
		{ count: input.messages.length },
		'completed',
	);

	return response;
};

// ── MMS history ───────────────────────────────────────────────────────────────

export const MmsHistoryInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		date_from: z.number().optional(),
		date_to: z.number().optional(),
	})
	.strict();
export type MmsHistoryInput = z.infer<typeof MmsHistoryInputSchema>;

export const MmsHistoryResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(MmsMessageResultSchema),
	})
	.passthrough();
export type MmsHistoryResponse = z.infer<typeof MmsHistoryResponseSchema>;

export const historyMms: CorsairEndpoint<
	ClickSendContext,
	MmsHistoryInput,
	MmsHistoryResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('mms/history', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			date_from: input.date_from,
			date_to: input.date_to,
		},
		responseSchema: MmsHistoryResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.mms.history',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

// ── MMS history export ────────────────────────────────────────────────────────

export const MmsHistoryExportInputSchema = z
	.object({
		filename: z.string().min(1).optional(),
		q: z.string().optional(),
		order_by: z.string().optional(),
		date_from: z.number().optional(),
		date_to: z.number().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type MmsHistoryExportInput = z.infer<typeof MmsHistoryExportInputSchema>;

export const MmsHistoryExportResponseSchema = z
	.object({
		url: z.string().optional(),
	})
	.passthrough();
export type MmsHistoryExportResponse = z.infer<
	typeof MmsHistoryExportResponseSchema
>;

export const exportMmsHistory: CorsairEndpoint<
	ClickSendContext,
	MmsHistoryExportInput,
	MmsHistoryExportResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'mms/history/export',
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
			responseSchema: MmsHistoryExportResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.mms.historyExport',
		{ filename: input.filename, limit: input.limit },
		'completed',
	);

	return response;
};

// ── MMS receipts ──────────────────────────────────────────────────────────────

export const MmsReceiptSchema = z
	.object({
		message_id: z.string().optional(),
		status: z.string().optional(),
		status_code: z.string().optional(),
		status_text: z.string().optional(),
		timestamp: z.number().optional(),
		original_message_id: z.string().optional(),
	})
	.passthrough();
export type MmsReceipt = z.infer<typeof MmsReceiptSchema>;

export const MmsReceiptsListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type MmsReceiptsListInput = z.infer<typeof MmsReceiptsListInputSchema>;

export const MmsReceiptsListResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(MmsReceiptSchema),
	})
	.passthrough();
export type MmsReceiptsListResponse = z.infer<
	typeof MmsReceiptsListResponseSchema
>;

export const listMmsReceipts: CorsairEndpoint<
	ClickSendContext,
	MmsReceiptsListInput,
	MmsReceiptsListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'mms/receipts',
		username,
		apiKey,
		{
			method: 'GET',
			query: { page: input.page, limit: input.limit },
			responseSchema: MmsReceiptsListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.mms.receipts',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

// ── MMS receipts mark read ────────────────────────────────────────────────────

export const MmsReceiptsMarkReadInputSchema = z
	.object({
		date_before: z.number().optional(),
	})
	.strict();
export type MmsReceiptsMarkReadInput = z.infer<
	typeof MmsReceiptsMarkReadInputSchema
>;

export const MmsReceiptsMarkReadResponseSchema = EmptyResultSchema;
export type MmsReceiptsMarkReadResponse = z.infer<
	typeof MmsReceiptsMarkReadResponseSchema
>;

export const markMmsReceiptsRead: CorsairEndpoint<
	ClickSendContext,
	MmsReceiptsMarkReadInput,
	MmsReceiptsMarkReadResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'mms/receipts-read',
		username,
		apiKey,
		{
			method: 'PUT',
			body: { date_before: input.date_before },
			responseSchema: MmsReceiptsMarkReadResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.mms.receiptsMarkRead',
		{ date_before: input.date_before },
		'completed',
	);

	return response;
};
