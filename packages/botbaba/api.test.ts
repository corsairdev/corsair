import * as client from './client';
import * as Handlers from './endpoints/handlers';
import { BotbabaEndpointInputSchemas } from './endpoints/types';
import { isNonIdempotent } from './error-handlers';
import { botbaba, botbabaAuthConfig, botbabaEndpointSchemas } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeBotbabaRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

const ctx = { key: 'test-token', pluginId: 'botbaba', operation: 'test' };

const API_CASES: Array<{
	name: string;
	fn: (context: typeof ctx, input: never) => Promise<unknown>;
	input: Record<string, unknown>;
	path: string;
	body: Record<string, unknown>;
	headers?: Record<string, string>;
}> = [
	{
		name: 'contacts.get',
		fn: Handlers.getContact,
		input: { contact_id: 'c1' },
		path: 'api/GetContact',
		body: { contact_id: 'c1' },
	},
	{
		name: 'contacts.update',
		fn: Handlers.updateContact,
		input: { contact_id: 'c1', email: 'a@b.com' },
		path: 'api/UpdateContact',
		body: { contact_id: 'c1', email: 'a@b.com' },
	},
	{
		name: 'contacts.delete',
		fn: Handlers.deleteContact,
		input: { contact_id: 'c1' },
		path: 'api/DeleteContact',
		body: { contact_id: 'c1' },
	},
	{
		name: 'contacts.getAnalytics',
		fn: Handlers.getContactAnalytics,
		input: { start_date: '2023-01-01' },
		path: 'api/GetContactAnalytics',
		body: { start_date: '2023-01-01' },
	},
	{
		name: 'tags.list',
		fn: Handlers.listTags,
		input: {},
		path: 'api/ListTags',
		body: {},
	},
	{
		name: 'tags.update',
		fn: Handlers.updateTag,
		input: { tag_id: 't1', name: 'vip' },
		path: 'api/UpdateTag',
		body: { tag_id: 't1', name: 'vip' },
	},
	{
		name: 'tags.delete',
		fn: Handlers.deleteTag,
		input: { tag_id: 't1' },
		path: 'api/DeleteTag',
		body: { tag_id: 't1' },
	},
	{
		name: 'templates.get',
		fn: Handlers.getTemplate,
		input: { template_id: 'tpl' },
		path: 'api/GetTemplate',
		body: { template_id: 'tpl' },
	},
	{
		name: 'templates.list',
		fn: Handlers.listTemplates,
		input: { page: 1, search: 'hi' },
		path: 'api/ListTemplates',
		body: { page: 1, search: 'hi' },
	},
	{
		name: 'templates.update',
		fn: Handlers.updateTemplate,
		input: { template_id: 'tpl', name: 'n' },
		path: 'api/UpdateTemplate',
		body: { template_id: 'tpl', name: 'n' },
	},
	{
		name: 'templates.delete',
		fn: Handlers.deleteTemplate,
		input: { template_id: 'tpl' },
		path: 'api/DeleteTemplate',
		body: { template_id: 'tpl' },
	},
	{
		name: 'broadcasts.get',
		fn: Handlers.getBroadcast,
		input: { broadcast_id: 'b1' },
		path: 'api/GetBroadcast',
		body: { broadcast_id: 'b1' },
	},
	{
		name: 'broadcasts.list',
		fn: Handlers.listBroadcasts,
		input: { limit: 10, offset: 0 },
		path: 'api/ListBroadcasts',
		body: { limit: 10, offset: 0 },
	},
	{
		name: 'broadcasts.delete',
		fn: Handlers.deleteBroadcast,
		input: { broadcast_id: 'b1' },
		path: 'api/DeleteBroadcast',
		body: { broadcast_id: 'b1' },
	},
	{
		name: 'flows.get',
		fn: Handlers.getFlow,
		input: { flow_id: 'f1' },
		path: 'api/GetFlow',
		body: { flow_id: 'f1' },
	},
	{
		name: 'flows.list',
		fn: Handlers.listFlows,
		input: {},
		path: 'api/ListFlows',
		body: {},
	},
	{
		name: 'flows.delete',
		fn: Handlers.deleteFlow,
		input: { flow_id: 'f1' },
		path: 'api/DeleteFlow',
		body: { flow_id: 'f1' },
	},
	{
		name: 'webhooks.get',
		fn: Handlers.getWebhook,
		input: { webhook_id: 'w1' },
		path: 'api/GetWebhook',
		body: { webhook_id: 'w1' },
	},
	{
		name: 'webhooks.list',
		fn: Handlers.listWebhooks,
		input: { limit: 5 },
		path: 'api/ListWebhooks',
		body: { limit: 5 },
	},
	{
		name: 'webhooks.update',
		fn: Handlers.updateWebhook,
		input: { webhook_id: 'w1', active: true },
		path: 'api/UpdateWebhook',
		body: { webhook_id: 'w1', active: true },
	},
	{
		name: 'webhooks.delete',
		fn: Handlers.deleteWebhook,
		input: { webhook_id: 'w1' },
		path: 'api/DeleteWebhook',
		body: { webhook_id: 'w1' },
	},
	{
		name: 'webhooks.listEventTypes',
		fn: Handlers.listWebhookEventTypes,
		input: {},
		path: 'api/ListWebhookEventTypes',
		body: {},
	},
	{
		name: 'messages.get',
		fn: Handlers.getMessage,
		input: { message_id: 'm1' },
		path: 'api/GetMessage',
		body: { message_id: 'm1' },
	},
	{
		name: 'messages.list',
		fn: Handlers.listMessages,
		input: { page: 2 },
		path: 'api/ListMessages',
		body: { page: 2 },
	},
	{
		name: 'messages.getAnalytics',
		fn: Handlers.getMessageAnalytics,
		input: { message_id: 'm1' },
		path: 'api/GetMessageAnalytics',
		body: { message_id: 'm1' },
	},
	{
		name: 'messages.sendWhatsappTemplate',
		fn: Handlers.sendWhatsappTemplateMessages,
		input: { payload: { to: '91' } },
		path: 'api/SendWhatsAppTemplateMessages',
		body: { to: '91' },
	},
	{
		name: 'actions.execute',
		fn: Handlers.executeBotAction,
		input: { conv_id: 'cv1', action: 'tag' },
		path: 'api/ExecuteBotAction',
		body: { conv_id: 'cv1', action: 'tag' },
	},
	{
		name: 'actions.executeByUser',
		fn: Handlers.executeBotActionByUser,
		input: { bot_id: 9, action_id: 3 },
		path: 'api/ExecuteBotActionByUser',
		body: { bot_id: 9, action_id: 3 },
	},
	{
		name: 'actions.getWidgetSettings',
		fn: Handlers.getBotWidgetSettings,
		input: { bot_id: 9 },
		path: 'api/GetBotWidgetSettings',
		body: { bot_id: 9 },
	},
	{
		name: 'shopify.cartCreation',
		fn: Handlers.cartCreationShopifyWebhook,
		input: {
			payload: { token: 'cart' },
			'X-Shopify-Topic': 'carts/create',
		},
		path: 'api/CartCreationShopifyWebhook',
		body: { token: 'cart' },
		headers: { 'X-Shopify-Topic': 'carts/create' },
	},
	{
		name: 'shopify.cartUpdate',
		fn: Handlers.cartUpdateShopifyWebhook,
		input: { payload: { token: 'cart' }, x_shopify_topic: 'carts/update' },
		path: 'api/CartUpdateShopifyWebhook',
		body: { token: 'cart' },
		headers: { 'X-Shopify-Topic': 'carts/update' },
	},
	{
		name: 'shopify.checkoutCreation',
		fn: Handlers.checkoutCreationShopifyWebhook,
		input: { payload: { id: 1 } },
		path: 'api/CheckoutCreationShopifyWebhook',
		body: { id: 1 },
	},
	{
		name: 'shopify.checkoutUpdate',
		fn: Handlers.checkoutUpdateShopifyWebhook,
		input: { webhook_payload: { id: 2 } },
		path: 'api/CheckoutUpdateShopifyWebhook',
		body: { id: 2 },
	},
	{
		name: 'shopify.orderCancellation',
		fn: Handlers.orderCancellationShopifyWebhook,
		input: {
			payload: { id: 3 },
			'X-Shopify-Topic': 'orders/cancelled',
			'X-Shopify-Webhook-Id': 'wh',
			'X-Shopify-Hmac-SHA256': 'sig',
			'X-Shopify-Shop-Domain': 'store.myshopify.com',
			'X-Shopify-Triggered-At': '2026-01-01T00:00:00Z',
		},
		path: 'api/OrderCancellationShopifyWebhook',
		body: { id: 3 },
		headers: {
			'X-Shopify-Topic': 'orders/cancelled',
			'X-Shopify-Webhook-Id': 'wh',
			'X-Shopify-Hmac-SHA256': 'sig',
			'X-Shopify-Shop-Domain': 'store.myshopify.com',
			'X-Shopify-Triggered-At': '2026-01-01T00:00:00Z',
		},
	},
	{
		name: 'shopify.orderFulfillment',
		fn: Handlers.orderFulfillmentShopifyWebhook,
		input: { payload: { id: 4 } },
		path: 'api/OrderFulfillmentShopifyWebhook',
		body: { id: 4 },
	},
	{
		name: 'shopify.orderPayment',
		fn: Handlers.orderPaymentShopifyWebhook,
		input: { payload: { id: 5 } },
		path: 'api/OrderPaymentShopifyWebhook',
		body: { id: 5 },
	},
	{
		name: 'gupshup.forwardMessage',
		fn: Handlers.waGupshupMessage,
		input: { payload: { type: 'message' } },
		path: 'api/WAGupshupMessage',
		body: { type: 'message' },
	},
];

describe('botbaba plugin', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('initializes as an api_key plugin', () => {
		const instance = botbaba({ key: 'k' });
		expect(instance.id).toBe('botbaba');
		expect(instance.options?.key).toBe('k');
		expect(botbabaAuthConfig).toHaveProperty('api_key');
		expect(botbabaAuthConfig).not.toHaveProperty('oauth_2');
	});

	it('registers schemas for every nested endpoint', () => {
		expect(Object.keys(botbabaEndpointSchemas)).toHaveLength(43);
		for (const key of Object.keys(botbabaEndpointSchemas)) {
			const schema =
				botbabaEndpointSchemas[key as keyof typeof botbabaEndpointSchemas];
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
		}
	});

	it.each(API_CASES)(
		'$name posts the documented Botbaba path',
		async ({ fn, input, path, body, headers }) => {
			(client.makeBotbabaRequest as jest.Mock).mockResolvedValueOnce({
				ok: true,
			});
			const result = await fn(ctx, input as never);
			expect(result).toEqual({ ok: true });
			expect(client.makeBotbabaRequest).toHaveBeenCalledWith(
				path,
				'test-token',
				expect.objectContaining({
					method: 'POST',
					body,
					headers,
				}),
			);
		},
	);

	it('utils.getFilename parses a path locally', async () => {
		await expect(
			Handlers.getFilename(ctx, { path: '/tmp/inbox/file.jpg' }),
		).resolves.toEqual({ filename: 'file.jpg' });
		expect(client.makeBotbabaRequest).not.toHaveBeenCalled();
	});

	it('simulators return payloads without calling the API', async () => {
		await expect(Handlers.cartCreationEventSimulator()).resolves.toEqual({
			payload: expect.objectContaining({ token: 'cart-token' }),
		});
		await expect(
			Handlers.shopifyCheckoutCreationEventSimulator(),
		).resolves.toEqual({
			payload: expect.objectContaining({ token: 'checkout-token' }),
		});
		await expect(
			Handlers.shopifyCheckoutUpdateEventSimulator(),
		).resolves.toEqual({
			payload: expect.objectContaining({ token: 'checkout-token' }),
		});
		await expect(
			Handlers.orderFulfillmentEventSimulator(ctx, {
				variant: 'with_tracking',
			}),
		).resolves.toEqual({
			payload: expect.objectContaining({ tracking_number: '1Z999' }),
		});
		await expect(
			Handlers.waGupshupEventSimulator(ctx, {
				sender: '9198',
				recipient: '9112',
				event_type: 'message',
			}),
		).resolves.toEqual({
			payload: expect.objectContaining({ sender: '9198', recipient: '9112' }),
		});
		expect(client.makeBotbabaRequest).not.toHaveBeenCalled();
	});

	it('rejects invalid contact input', () => {
		expect(BotbabaEndpointInputSchemas.getContact.safeParse({}).success).toBe(
			false,
		);
	});

	it('does not retry non-idempotent sends', () => {
		expect(isNonIdempotent('messages.sendWhatsappTemplate')).toBe(true);
		expect(isNonIdempotent('contacts.get')).toBe(false);
	});
});
