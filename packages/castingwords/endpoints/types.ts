import { z } from 'zod';

const EmptyInputSchema = z.object({});

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

const AudiofileSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		statename: z.string().optional(),
		names: z.string().optional(),
		notes: z.string().optional(),
		originallink: z.string().optional(),
		title: z.string().optional(),
		duration: z.union([z.string(), z.number()]).optional(),
		description: z.string().optional(),
		quality_stars: z.union([z.string(), z.number()]).optional(),
		orders: z.array(z.union([z.string(), z.number()])).optional(),
		invoices: z.array(z.union([z.string(), z.number()])).optional(),
		total: z.union([z.string(), z.number()]).optional(),
	})
	.loose();

const InvoiceItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		sku: z.string().optional(),
		quantity: z.union([z.string(), z.number()]).optional(),
		price: z.union([z.string(), z.number()]).optional(),
		audiofile: z.union([z.string(), z.number()]).optional(),
		total: z.union([z.string(), z.number()]).optional(),
	})
	.loose();

const SuccessResponseSchema = z
	.object({
		message: z.string().optional(),
		success: z.boolean().optional(),
	})
	.loose();

export const CastingwordsEndpointInputSchemas = {
	createOrder: z.object({
		url: z.string().url(),
		sku: z
			.array(OrderSkuSchema)
			.min(1)
			.describe('CastingWords SKU(s) to order'),
		test: z.boolean().optional(),
		notes: z.string().optional(),
		names: z.array(z.string()).optional(),
	}),
	getPrepayBalance: EmptyInputSchema,
	getAudiofileDetails: z.object({
		audiofileId: z.union([z.string(), z.number()]),
	}),
	getTranscript: z.object({
		audiofileId: z.union([z.string(), z.number()]),
		extension: TranscriptExtensionSchema.default('txt'),
		test: z.boolean().optional(),
	}),
	orderUpgrade: z.object({
		audiofileId: z.union([z.string(), z.number()]),
		sku: z.array(UpgradeSkuSchema).min(1),
		test: z.boolean().optional(),
	}),
	refundAudiofile: z.object({
		audiofileId: z.union([z.string(), z.number()]),
		test: z.boolean().optional(),
	}),
	getInvoice: z.object({
		invoiceId: z.union([z.string(), z.number()]),
	}),
	getWebhook: EmptyInputSchema,
	setWebhook: z.object({
		webhook: z.string().url(),
	}),
} as const;

export const CastingwordsEndpointOutputSchemas = {
	createOrder: z
		.object({
			audiofiles: z.array(z.union([z.string(), z.number()])),
			order: z.union([z.string(), z.number()]),
			message: z.string().optional(),
			hold: z.string().optional(),
		})
		.loose(),
	getPrepayBalance: z.object({ balance: z.coerce.number() }).loose(),
	getAudiofileDetails: z
		.object({ audiofile: AudiofileSchema.optional() })
		.loose(),
	getTranscript: z.string(),
	orderUpgrade: SuccessResponseSchema,
	refundAudiofile: SuccessResponseSchema,
	getInvoice: z
		.object({
			id: z.union([z.string(), z.number()]),
			purchase_order: z.union([z.string(), z.number()]).nullable().optional(),
			createtime: z.string().optional(),
			paidtime: z.string().nullable().optional(),
			total: z.union([z.string(), z.number()]).optional(),
			items: z.array(InvoiceItemSchema).optional(),
			state: z.enum(['PAID', 'SUBMITTED', 'OPEN', 'CREATED']).optional(),
		})
		.loose(),
	getWebhook: z
		.object({
			webhook: z
				.union([z.string().url(), z.literal('')])
				.nullable()
				.optional(),
		})
		.loose(),
	setWebhook: z
		.object({
			webhook: z
				.union([z.string().url(), z.literal('')])
				.nullable()
				.optional(),
		})
		.loose(),
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
export type SetWebhookInput = CastingwordsEndpointInputs['setWebhook'];
export type SetWebhookResponse = CastingwordsEndpointOutputs['setWebhook'];
