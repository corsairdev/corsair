import { z } from 'zod';
import {
	CastingwordsAudiofile,
	CastingwordsInvoice,
	CastingwordsOrder,
	CastingwordsPrepayBalance,
	CastingwordsSku,
	CastingwordsWebhook,
} from '../schema/database';

const EmptyInputSchema = z.object({});

const PositiveIdSchema = z.union([
	z.number().int().positive(),
	z
		.string()
		.trim()
		.regex(/^[1-9]\d*$/),
]);

const HttpUrlSchema = z.url({ protocol: /^https?$/ });

const OrderSkuSchema = z.enum([
	'TRANS14',
	'TRANS2',
	'TRANS6',
	'TRANS7',
	'EMSR02',
	'DIFFQ2',
	'TSTMP1',
	'CAPTION1',
]);

const UpgradeSkuSchema = z.enum([
	'DIFFQ2',
	'TSTMP1',
	'CAPTION1',
	'EDIT01',
	'UPGRD1',
	'UPGRD2',
	'UPGRD3',
]);

const TranscriptExtensionSchema = z.enum([
	'txt',
	'doc',
	'rtf',
	'html',
	'srt',
	'docx',
	'tstxt',
	'vtt',
]);

const WebhookEventSchema = z.enum([
	'TRANSCRIPT_COMPLETE',
	'DIFFICULT_AUDIO',
	'REFUND_ISSUED',
	'ORDER_ON_HOLD',
]);

const SuccessResponseSchema = z
	.object({
		message: z.string().optional(),
		success: z.boolean().optional(),
	})
	.loose();

export const CASTINGWORDS_SKU_CATALOG: z.infer<typeof CastingwordsSku>[] = [
	{
		sku: 'TRANS14',
		kind: 'order',
		description: 'Budget Transcription with a target of 14 days.',
	},
	{
		sku: 'TRANS2',
		kind: 'order',
		description: '1 Day Expert Transcription',
	},
	{
		sku: 'TRANS6',
		kind: 'order',
		description: '6 Day Transcription',
	},
	{
		sku: 'TRANS7',
		kind: 'order',
		description: '7 Day Transcription',
	},
	{
		sku: 'EMSR02',
		kind: 'order',
		description: 'Advanced Machine Transcription',
	},
	{
		sku: 'DIFFQ2',
		kind: 'order',
		description: 'Difficult Audio',
	},
	{
		sku: 'TSTMP1',
		kind: 'order',
		description: 'Timestamps',
	},
	{
		sku: 'CAPTION1',
		kind: 'order',
		description: 'Captions/Subtitles',
	},
	{
		sku: 'DIFFQ2',
		kind: 'upgrade',
		description: 'Difficult Audio Upgrade',
	},
	{
		sku: 'TSTMP1',
		kind: 'upgrade',
		description: 'Timestamps',
	},
	{
		sku: 'CAPTION1',
		kind: 'upgrade',
		description: 'Subtitles/Captions',
	},
	{
		sku: 'EDIT01',
		kind: 'upgrade',
		description: 'Extra Editing',
	},
	{
		sku: 'UPGRD1',
		kind: 'upgrade',
		description: 'Upgrade TRANS14 to TRANS6',
	},
	{
		sku: 'UPGRD2',
		kind: 'upgrade',
		description: 'Upgrade TRANS14 to TRANS2',
	},
	{
		sku: 'UPGRD3',
		kind: 'upgrade',
		description: 'Upgrade TRANS6 to TRANS2',
	},
];

export const CastingwordsEndpointInputSchemas = {
	createOrder: z.object({
		url: z.union([HttpUrlSchema, z.array(HttpUrlSchema).min(1)]),
		sku: z.array(OrderSkuSchema).min(1),
		test: z.boolean().optional(),
		notes: z.string().optional(),
		names: z.array(z.string()).optional(),
	}),
	getPrepayBalance: EmptyInputSchema,
	getAudiofileDetails: z.object({
		audiofileId: PositiveIdSchema,
	}),
	getTranscript: z.object({
		audiofileId: PositiveIdSchema,
		extension: TranscriptExtensionSchema.default('txt'),
		test: z.boolean().optional(),
	}),
	orderUpgrade: z.object({
		audiofileId: PositiveIdSchema,
		sku: z.array(UpgradeSkuSchema).min(1),
		test: z.boolean().optional(),
	}),
	refundAudiofile: z.object({
		audiofileId: PositiveIdSchema,
		test: z.boolean().optional(),
	}),
	getInvoice: z.object({
		invoiceId: PositiveIdSchema,
	}),
	getWebhook: EmptyInputSchema,
	registerWebhook: z.object({
		webhook: HttpUrlSchema,
	}),
	testWebhook: z.object({
		event: WebhookEventSchema,
	}),
	listSkus: EmptyInputSchema,
} as const;

export const CastingwordsEndpointOutputSchemas = {
	createOrder: CastingwordsOrder,
	getPrepayBalance: CastingwordsPrepayBalance,
	getAudiofileDetails: z
		.object({ audiofile: CastingwordsAudiofile.optional() })
		.loose(),
	getTranscript: z.string(),
	orderUpgrade: SuccessResponseSchema,
	refundAudiofile: SuccessResponseSchema,
	getInvoice: CastingwordsInvoice,
	getWebhook: CastingwordsWebhook,
	registerWebhook: CastingwordsWebhook,
	testWebhook: CastingwordsWebhook,
	listSkus: z.object({ skus: z.array(CastingwordsSku) }),
} as const;

export type CastingwordsEndpointInputs = {
	[K in keyof typeof CastingwordsEndpointInputSchemas]: z.infer<
		(typeof CastingwordsEndpointInputSchemas)[K]
	>;
};

export type CastingwordsEndpointOutputs = {
	[K in keyof typeof CastingwordsEndpointOutputSchemas]: z.infer<
		(typeof CastingwordsEndpointOutputSchemas)[K]
	>;
};

export type CreateOrderInput = CastingwordsEndpointInputs['createOrder'];
export type CreateOrderResponse = CastingwordsEndpointOutputs['createOrder'];
export type GetPrepayBalanceInput =
	CastingwordsEndpointInputs['getPrepayBalance'];
export type GetPrepayBalanceResponse =
	CastingwordsEndpointOutputs['getPrepayBalance'];
export type GetAudiofileDetailsInput =
	CastingwordsEndpointInputs['getAudiofileDetails'];
export type GetAudiofileDetailsResponse =
	CastingwordsEndpointOutputs['getAudiofileDetails'];
export type GetTranscriptInput = CastingwordsEndpointInputs['getTranscript'];
export type GetTranscriptResponse =
	CastingwordsEndpointOutputs['getTranscript'];
export type OrderUpgradeInput = CastingwordsEndpointInputs['orderUpgrade'];
export type OrderUpgradeResponse = CastingwordsEndpointOutputs['orderUpgrade'];
export type RefundAudiofileInput =
	CastingwordsEndpointInputs['refundAudiofile'];
export type RefundAudiofileResponse =
	CastingwordsEndpointOutputs['refundAudiofile'];
export type GetInvoiceInput = CastingwordsEndpointInputs['getInvoice'];
export type GetInvoiceResponse = CastingwordsEndpointOutputs['getInvoice'];
export type GetWebhookInput = CastingwordsEndpointInputs['getWebhook'];
export type GetWebhookResponse = CastingwordsEndpointOutputs['getWebhook'];
export type RegisterWebhookInput =
	CastingwordsEndpointInputs['registerWebhook'];
export type RegisterWebhookResponse =
	CastingwordsEndpointOutputs['registerWebhook'];
export type TestWebhookInput = CastingwordsEndpointInputs['testWebhook'];
export type TestWebhookResponse = CastingwordsEndpointOutputs['testWebhook'];
export type ListSkusInput = CastingwordsEndpointInputs['listSkus'];
export type ListSkusResponse = CastingwordsEndpointOutputs['listSkus'];
