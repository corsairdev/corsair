import { logEventFromContext } from 'corsair/core';
import { auditPayload } from './logging';
import { botbabaCall, compactBody, shopifyHeaders } from './shared';
import type { BotbabaEndpointInputs, BotbabaEndpointOutputs } from './types';
import {
	BotbabaEndpointInputSchemas,
	BotbabaEndpointOutputSchemas,
} from './types';

type Ctx = { key: string };

async function postApi<K extends keyof BotbabaEndpointOutputs>(
	ctx: Ctx,
	schemaKey: K,
	event: string,
	path: string,
	input: BotbabaEndpointInputs[K],
	body: Record<string, unknown>,
	headers?: Record<string, string>,
): Promise<BotbabaEndpointOutputs[K]> {
	const parsed = BotbabaEndpointInputSchemas[schemaKey].parse(input);
	const raw = await botbabaCall<unknown>(ctx, path, {
		method: 'POST',
		body: compactBody(body),
		headers,
	});
	const output = BotbabaEndpointOutputSchemas[schemaKey].parse(raw ?? {});
	await logEventFromContext(
		ctx as never,
		event,
		auditPayload(parsed as Record<string, unknown>, []),
		'completed',
	);
	return output as BotbabaEndpointOutputs[K];
}

function localResult<K extends keyof BotbabaEndpointOutputs>(
	schemaKey: K,
	value: unknown,
): BotbabaEndpointOutputs[K] {
	return BotbabaEndpointOutputSchemas[schemaKey].parse(
		value,
	) as BotbabaEndpointOutputs[K];
}

/** Official: https://kb.botbaba.io/docs/how-to-connect-your-shopify-store-with-botbaba/ */
export const cartCreationShopifyWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['cartCreationShopifyWebhook'],
) =>
	postApi(
		ctx,
		'cartCreationShopifyWebhook',
		'botbaba.shopify.cartCreation',
		'api/CartCreationShopifyWebhook',
		input,
		input.payload,
		shopifyHeaders(input),
	);

export const cartUpdateShopifyWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['cartUpdateShopifyWebhook'],
) =>
	postApi(
		ctx,
		'cartUpdateShopifyWebhook',
		'botbaba.shopify.cartUpdate',
		'api/CartUpdateShopifyWebhook',
		input,
		input.payload,
		shopifyHeaders(input),
	);

export const checkoutCreationShopifyWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['checkoutCreationShopifyWebhook'],
) =>
	postApi(
		ctx,
		'checkoutCreationShopifyWebhook',
		'botbaba.shopify.checkoutCreation',
		'api/CheckoutCreationShopifyWebhook',
		input,
		input.payload,
		shopifyHeaders(input),
	);

export const checkoutUpdateShopifyWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['checkoutUpdateShopifyWebhook'],
) =>
	postApi(
		ctx,
		'checkoutUpdateShopifyWebhook',
		'botbaba.shopify.checkoutUpdate',
		'api/CheckoutUpdateShopifyWebhook',
		input,
		input.webhook_payload,
		shopifyHeaders(input),
	);

export const deleteBroadcast = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['deleteBroadcast'],
) =>
	postApi(
		ctx,
		'deleteBroadcast',
		'botbaba.broadcasts.delete',
		'api/DeleteBroadcast',
		input,
		input,
	);

export const deleteContact = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['deleteContact'],
) =>
	postApi(
		ctx,
		'deleteContact',
		'botbaba.contacts.delete',
		'api/DeleteContact',
		input,
		input,
	);

export const deleteFlow = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['deleteFlow'],
) =>
	postApi(
		ctx,
		'deleteFlow',
		'botbaba.flows.delete',
		'api/DeleteFlow',
		input,
		input,
	);

export const deleteTag = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['deleteTag'],
) =>
	postApi(
		ctx,
		'deleteTag',
		'botbaba.tags.delete',
		'api/DeleteTag',
		input,
		input,
	);

export const deleteTemplate = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['deleteTemplate'],
) =>
	postApi(
		ctx,
		'deleteTemplate',
		'botbaba.templates.delete',
		'api/DeleteTemplate',
		input,
		input,
	);

export const deleteWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['deleteWebhook'],
) =>
	postApi(
		ctx,
		'deleteWebhook',
		'botbaba.webhooks.delete',
		'api/DeleteWebhook',
		input,
		input,
	);

export const executeBotAction = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['executeBotAction'],
) =>
	postApi(
		ctx,
		'executeBotAction',
		'botbaba.actions.execute',
		'api/ExecuteBotAction',
		input,
		input,
	);

export const executeBotActionByUser = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['executeBotActionByUser'],
) =>
	postApi(
		ctx,
		'executeBotActionByUser',
		'botbaba.actions.executeByUser',
		'api/ExecuteBotActionByUser',
		input,
		input,
	);

export const getBotWidgetSettings = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getBotWidgetSettings'],
) =>
	postApi(
		ctx,
		'getBotWidgetSettings',
		'botbaba.actions.getWidgetSettings',
		'api/GetBotWidgetSettings',
		input,
		input,
	);

export const getBroadcast = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getBroadcast'],
) =>
	postApi(
		ctx,
		'getBroadcast',
		'botbaba.broadcasts.get',
		'api/GetBroadcast',
		input,
		input,
	);

export const getContact = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getContact'],
) =>
	postApi(
		ctx,
		'getContact',
		'botbaba.contacts.get',
		'api/GetContact',
		input,
		input,
	);

export const getContactAnalytics = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getContactAnalytics'],
) =>
	postApi(
		ctx,
		'getContactAnalytics',
		'botbaba.contacts.getAnalytics',
		'api/GetContactAnalytics',
		input,
		input,
	);

export const getFilename = async (
	_ctx: Ctx,
	input: BotbabaEndpointInputs['getFilename'],
) => {
	const parsed = BotbabaEndpointInputSchemas.getFilename.parse(input);
	const parts = parsed.path.split(/[/\\]/).filter(Boolean);
	return localResult('getFilename', {
		filename: parts[parts.length - 1] ?? '',
	});
};

export const getFlow = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getFlow'],
) => postApi(ctx, 'getFlow', 'botbaba.flows.get', 'api/GetFlow', input, input);

export const getMessage = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getMessage'],
) =>
	postApi(
		ctx,
		'getMessage',
		'botbaba.messages.get',
		'api/GetMessage',
		input,
		input,
	);

export const getMessageAnalytics = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getMessageAnalytics'],
) =>
	postApi(
		ctx,
		'getMessageAnalytics',
		'botbaba.messages.getAnalytics',
		'api/GetMessageAnalytics',
		input,
		input,
	);

export const getTemplate = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getTemplate'],
) =>
	postApi(
		ctx,
		'getTemplate',
		'botbaba.templates.get',
		'api/GetTemplate',
		input,
		input,
	);

export const getWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['getWebhook'],
) =>
	postApi(
		ctx,
		'getWebhook',
		'botbaba.webhooks.get',
		'api/GetWebhook',
		input,
		input,
	);

export const listBroadcasts = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['listBroadcasts'],
) =>
	postApi(
		ctx,
		'listBroadcasts',
		'botbaba.broadcasts.list',
		'api/ListBroadcasts',
		input,
		input,
	);

export const listFlows = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['listFlows'],
) =>
	postApi(
		ctx,
		'listFlows',
		'botbaba.flows.list',
		'api/ListFlows',
		input,
		input,
	);

export const listMessages = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['listMessages'],
) =>
	postApi(
		ctx,
		'listMessages',
		'botbaba.messages.list',
		'api/ListMessages',
		input,
		input,
	);

export const listTags = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['listTags'],
) =>
	postApi(ctx, 'listTags', 'botbaba.tags.list', 'api/ListTags', input, input);

export const listTemplates = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['listTemplates'],
) =>
	postApi(
		ctx,
		'listTemplates',
		'botbaba.templates.list',
		'api/ListTemplates',
		input,
		input,
	);

export const listWebhookEventTypes = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['listWebhookEventTypes'],
) =>
	postApi(
		ctx,
		'listWebhookEventTypes',
		'botbaba.webhooks.listEventTypes',
		'api/ListWebhookEventTypes',
		input,
		input,
	);

export const listWebhooks = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['listWebhooks'],
) =>
	postApi(
		ctx,
		'listWebhooks',
		'botbaba.webhooks.list',
		'api/ListWebhooks',
		input,
		input,
	);

export const orderCancellationShopifyWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['orderCancellationShopifyWebhook'],
) =>
	postApi(
		ctx,
		'orderCancellationShopifyWebhook',
		'botbaba.shopify.orderCancellation',
		'api/OrderCancellationShopifyWebhook',
		input,
		input.payload,
		shopifyHeaders(input),
	);

export const orderFulfillmentEventSimulator = async (
	_ctx: Ctx,
	input: BotbabaEndpointInputs['orderFulfillmentEventSimulator'],
) => {
	const parsed =
		BotbabaEndpointInputSchemas.orderFulfillmentEventSimulator.parse(input);
	const tracking =
		parsed.variant === 'with_tracking'
			? { tracking_number: '1Z999', tracking_url: 'https://example.com/track' }
			: {};
	return localResult('orderFulfillmentEventSimulator', {
		payload: {
			id: 1001,
			order_id: 2002,
			status: parsed.variant === 'partial' ? 'partial' : 'success',
			...tracking,
		},
	});
};

export const orderFulfillmentShopifyWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['orderFulfillmentShopifyWebhook'],
) =>
	postApi(
		ctx,
		'orderFulfillmentShopifyWebhook',
		'botbaba.shopify.orderFulfillment',
		'api/OrderFulfillmentShopifyWebhook',
		input,
		input.payload,
		shopifyHeaders(input),
	);

export const orderPaymentShopifyWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['orderPaymentShopifyWebhook'],
) =>
	postApi(
		ctx,
		'orderPaymentShopifyWebhook',
		'botbaba.shopify.orderPayment',
		'api/OrderPaymentShopifyWebhook',
		input,
		input.payload,
		shopifyHeaders(input),
	);

/** Official: https://kb.botbaba.io/docs/how-to-forward-a-template-message-with-custom-data-using-botbabas-api-and-postman-runner/ */
export const sendWhatsappTemplateMessages = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['sendWhatsappTemplateMessages'],
) =>
	postApi(
		ctx,
		'sendWhatsappTemplateMessages',
		'botbaba.messages.sendWhatsappTemplate',
		'api/SendWhatsAppTemplateMessages',
		input,
		input.payload,
	);

export const cartCreationEventSimulator = async () =>
	localResult('cartCreationEventSimulator', {
		payload: {
			id: 'gid://shopify/Cart/1',
			token: 'cart-token',
			line_items: [],
		},
	});

export const shopifyCheckoutCreationEventSimulator = async () =>
	localResult('shopifyCheckoutCreationEventSimulator', {
		payload: {
			id: 3001,
			token: 'checkout-token',
			email: 'buyer@example.com',
		},
	});

export const shopifyCheckoutUpdateEventSimulator = async () =>
	localResult('shopifyCheckoutUpdateEventSimulator', {
		payload: {
			id: 3001,
			token: 'checkout-token',
			updated_at: '2026-01-01T00:00:00Z',
		},
	});

export const updateContact = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['updateContact'],
) =>
	postApi(
		ctx,
		'updateContact',
		'botbaba.contacts.update',
		'api/UpdateContact',
		input,
		input,
	);

export const updateTag = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['updateTag'],
) =>
	postApi(
		ctx,
		'updateTag',
		'botbaba.tags.update',
		'api/UpdateTag',
		input,
		input,
	);

export const updateTemplate = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['updateTemplate'],
) =>
	postApi(
		ctx,
		'updateTemplate',
		'botbaba.templates.update',
		'api/UpdateTemplate',
		input,
		input,
	);

export const updateWebhook = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['updateWebhook'],
) =>
	postApi(
		ctx,
		'updateWebhook',
		'botbaba.webhooks.update',
		'api/UpdateWebhook',
		input,
		input,
	);

export const waGupshupEventSimulator = async (
	_ctx: Ctx,
	input: BotbabaEndpointInputs['waGupshupEventSimulator'],
) => {
	const parsed =
		BotbabaEndpointInputSchemas.waGupshupEventSimulator.parse(input);
	return localResult('waGupshupEventSimulator', {
		payload: {
			event_type: parsed.event_type ?? 'message',
			sender: parsed.sender,
			recipient: parsed.recipient,
			text: parsed.text,
			timestamp: parsed.timestamp ?? Date.now(),
			message_id: parsed.message_id,
			interactive: parsed.interactive,
		},
	});
};

export const waGupshupMessage = async (
	ctx: Ctx,
	input: BotbabaEndpointInputs['waGupshupMessage'],
) =>
	postApi(
		ctx,
		'waGupshupMessage',
		'botbaba.gupshup.forwardMessage',
		'api/WAGupshupMessage',
		input,
		input.payload,
	);
