import { logEventFromContext } from 'corsair/core';
import { makeCastingwordsRequest } from '../client';
import type {
	CreateOrderInput,
	GetAudiofileDetailsInput,
	GetInvoiceInput,
	GetTranscriptInput,
	OrderUpgradeInput,
	RefundAudiofileInput,
	RegisterWebhookInput,
	TestWebhookInput,
} from './types';
import {
	CASTINGWORDS_SKU_CATALOG,
	CastingwordsEndpointOutputSchemas,
} from './types';

type Ctx = { key: string };

// Event payloads differ per operation; unknown keeps the logger generic.
function log(ctx: Ctx, name: string, data: Record<string, unknown>) {
	return logEventFromContext(ctx as never, name, data, 'completed');
}

// Store API v4 bodies vary (JSON object, webhook URL string, or transcript
// text); unknown forces Zod parse before use.
function wire(
	endpoint: string,
	apiKey: string,
	options?: Parameters<typeof makeCastingwordsRequest>[2],
): Promise<unknown> {
	return makeCastingwordsRequest<unknown>(endpoint, apiKey, options);
}

function asWebhook(response: unknown) {
	return CastingwordsEndpointOutputSchemas.getWebhook.parse(
		typeof response === 'string' ? { webhook: response } : response,
	);
}

export async function createOrder(ctx: Ctx, input: CreateOrderInput) {
	const response = await wire('order_url', ctx.key, {
		method: 'POST',
		body: {
			url: input.url,
			sku: input.sku,
			test: input.test ? '1' : undefined,
			notes: input.notes,
			names: input.names,
		},
	});
	const parsed = CastingwordsEndpointOutputSchemas.createOrder.parse(response);
	await log(ctx, 'castingwords.create_order', { url: input.url });
	return parsed;
}

export async function getPrepayBalance(ctx: Ctx) {
	const response = await wire('prepay_balance', ctx.key);
	const parsed =
		CastingwordsEndpointOutputSchemas.getPrepayBalance.parse(response);
	await log(ctx, 'castingwords.get_prepay_balance', {});
	return parsed;
}

export async function getAudiofileDetails(
	ctx: Ctx,
	input: GetAudiofileDetailsInput,
) {
	const response = await wire(
		`audiofile/${encodeURIComponent(String(input.audiofileId))}`,
		ctx.key,
	);
	const parsed =
		CastingwordsEndpointOutputSchemas.getAudiofileDetails.parse(response);
	await log(ctx, 'castingwords.get_audiofile_details', {
		audiofileId: input.audiofileId,
	});
	return parsed;
}

export async function getTranscript(ctx: Ctx, input: GetTranscriptInput) {
	const response = await wire(
		`audiofile/${encodeURIComponent(String(input.audiofileId))}/transcript.${input.extension}`,
		ctx.key,
		input.test ? { method: 'POST', body: { test: '1' } } : {},
	);
	const parsed =
		CastingwordsEndpointOutputSchemas.getTranscript.parse(response);
	await log(ctx, 'castingwords.get_transcript', {
		audiofileId: input.audiofileId,
		extension: input.extension,
	});
	return parsed;
}

export async function orderUpgrade(ctx: Ctx, input: OrderUpgradeInput) {
	const response = await wire(
		`audiofile/${encodeURIComponent(String(input.audiofileId))}/upgrade`,
		ctx.key,
		{
			method: 'POST',
			body: { sku: input.sku, test: input.test ? '1' : undefined },
		},
	);
	const parsed = CastingwordsEndpointOutputSchemas.orderUpgrade.parse(
		typeof response === 'string' ? { message: response } : response,
	);
	await log(ctx, 'castingwords.order_upgrade', {
		audiofileId: input.audiofileId,
		sku: input.sku,
	});
	return parsed;
}

export async function refundAudiofile(ctx: Ctx, input: RefundAudiofileInput) {
	const response = await wire(
		`audiofile/${encodeURIComponent(String(input.audiofileId))}/refund`,
		ctx.key,
		{ method: 'POST', body: { test: input.test ? '1' : undefined } },
	);
	const parsed = CastingwordsEndpointOutputSchemas.refundAudiofile.parse(
		typeof response === 'string' ? { message: response } : response,
	);
	await log(ctx, 'castingwords.refund_audiofile', {
		audiofileId: input.audiofileId,
	});
	return parsed;
}

export async function getInvoice(ctx: Ctx, input: GetInvoiceInput) {
	const response = await wire(
		`invoice/${encodeURIComponent(String(input.invoiceId))}`,
		ctx.key,
	);
	const parsed = CastingwordsEndpointOutputSchemas.getInvoice.parse(response);
	await log(ctx, 'castingwords.get_invoice', { invoiceId: input.invoiceId });
	return parsed;
}

export async function getWebhook(ctx: Ctx) {
	const parsed = asWebhook(await wire('webhook', ctx.key));
	await log(ctx, 'castingwords.get_webhook', {});
	return parsed;
}

export async function registerWebhook(ctx: Ctx, input: RegisterWebhookInput) {
	const parsed = asWebhook(
		await wire('webhook', ctx.key, {
			method: 'POST',
			body: { webhook: input.webhook },
		}),
	);
	await log(ctx, 'castingwords.register_webhook', { webhook: input.webhook });
	return parsed;
}

export async function testWebhook(ctx: Ctx, input: TestWebhookInput) {
	const parsed = asWebhook(
		await wire(`webhook/test/${input.event}`, ctx.key, { method: 'POST' }),
	);
	await log(ctx, 'castingwords.test_webhook', { event: input.event });
	return parsed;
}

export async function listSkus(ctx: Ctx) {
	await log(ctx, 'castingwords.list_skus', {});
	return { skus: CASTINGWORDS_SKU_CATALOG };
}
