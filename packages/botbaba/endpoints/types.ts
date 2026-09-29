import { z } from 'zod';

/**
 * Input fields from https://docs.composio.dev/toolkits/botbaba
 * Official HTTP surface is POST https://app.botbaba.io/api/{Name}
 * (Shopify + WhatsApp paths documented on kb.botbaba.io).
 */

const JsonObject = z.record(z.string(), z.unknown());

const ShopifyHeaderFields = {
	'X-Shopify-Topic': z.string().optional(),
	'X-Shopify-Webhook-Id': z.string().optional(),
	'X-Shopify-API-Version': z.string().optional(),
	'X-Shopify-Hmac-SHA256': z.string().optional(),
	'X-Shopify-Shop-Domain': z.string().optional(),
	'X-Shopify-Triggered-At': z.string().optional(),
	x_shopify_topic: z.string().optional(),
	x_shopify_webhook_id: z.string().optional(),
	x_shopify_api_version: z.string().optional(),
	x_shopify_hmac_sha256: z.string().optional(),
	x_shopify_shop_domain: z.string().optional(),
	x_shopify_triggered_at: z.string().optional(),
};

export const BotbabaApiResponse = z.union([
	JsonObject,
	z.array(z.unknown()),
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);

const EmptyInput = z.object({});

const CartCreationShopifyWebhookInput = z.object({
	payload: JsonObject,
	...ShopifyHeaderFields,
});

const CartUpdateShopifyWebhookInput = z.object({
	payload: JsonObject,
	...ShopifyHeaderFields,
});

const CheckoutCreationShopifyWebhookInput = z.object({
	payload: JsonObject,
	...ShopifyHeaderFields,
});

const CheckoutUpdateShopifyWebhookInput = z.object({
	webhook_payload: JsonObject,
	...ShopifyHeaderFields,
});

const DeleteBroadcastInput = z.object({ broadcast_id: z.string() });
const DeleteContactInput = z.object({ contact_id: z.string() });
const DeleteFlowInput = z.object({ flow_id: z.string() });
const DeleteTagInput = z.object({ tag_id: z.string() });
const DeleteTemplateInput = z.object({ template_id: z.string() });
const DeleteWebhookInput = z.object({ webhook_id: z.string() });

const ExecuteBotActionInput = z.object({
	action: z.string().optional(),
	conv_id: z.string().optional(),
	tag_ids: z.string().optional(),
	action_id: z.number().int().optional(),
});

const ExecuteBotActionByUserInput = z.object({
	action: z.string().optional(),
	bot_id: z.number().int().optional(),
	action_id: z.number().int().optional(),
	bot_user_id: z.array(z.unknown()).optional(),
	json_payload: z.string().optional(),
});

const GetBotWidgetSettingsInput = z.object({ bot_id: z.number().int() });
const GetBroadcastInput = z.object({ broadcast_id: z.string() });
const GetContactInput = z.object({ contact_id: z.string() });
const GetContactAnalyticsInput = z.object({
	end_date: z.string().optional(),
	start_date: z.string().optional(),
});
const GetFilenameInput = z.object({ path: z.string() });
const GetFlowInput = z.object({ flow_id: z.string() });
const GetMessageInput = z.object({ message_id: z.string() });
const GetMessageAnalyticsInput = z.object({ message_id: z.string() });
const GetTemplateInput = z.object({ template_id: z.string() });
const GetWebhookInput = z.object({ webhook_id: z.string() });

const ListBroadcastsInput = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
const ListMessagesInput = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).optional(),
});
const ListTemplatesInput = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().optional(),
	search: z.string().optional(),
});
const ListWebhooksInput = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});

const OrderCancellationShopifyWebhookInput = z.object({
	payload: JsonObject,
	'X-Shopify-Topic': z.string(),
	'X-Shopify-Webhook-Id': z.string(),
	'X-Shopify-API-Version': z.string().optional(),
	'X-Shopify-Hmac-SHA256': z.string(),
	'X-Shopify-Shop-Domain': z.string(),
	'X-Shopify-Triggered-At': z.string(),
});

const OrderFulfillmentEventSimulatorInput = z.object({
	variant: z.enum(['standard', 'with_tracking', 'partial']),
});

const OrderFulfillmentShopifyWebhookInput = z.object({
	payload: JsonObject,
	...ShopifyHeaderFields,
});

const OrderPaymentShopifyWebhookInput = z.object({
	payload: JsonObject,
	'X-Shopify-Event-Id': z.string().optional(),
	...ShopifyHeaderFields,
});

const SendWhatsappTemplateMessagesInput = z.object({
	payload: JsonObject,
});

const UpdateContactInput = z.object({
	contact_id: z.string(),
	tags: z.array(z.string()).optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	last_name: z.string().optional(),
	first_name: z.string().optional(),
	custom_fields: JsonObject.optional(),
});

const UpdateTagInput = z.object({
	name: z.string(),
	tag_id: z.string(),
});

const UpdateTemplateInput = z.object({
	template_id: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	content: z.string().optional(),
	parameters: z.array(z.unknown()).optional(),
});

const UpdateWebhookInput = z.object({
	webhook_id: z.string(),
	url: z.string().optional(),
	active: z.boolean().optional(),
	events: z.array(z.string()).optional(),
});

const WaGupshupEventSimulatorInput = z.object({
	sender: z.string(),
	recipient: z.string(),
	text: z.string().optional(),
	timestamp: z.number().int().optional(),
	event_type: z.enum(['message', 'delivery', 'read', 'interactive']).optional(),
	message_id: z.string().optional(),
	interactive: JsonObject.optional(),
});

const WaGupshupMessageInput = z.object({
	payload: JsonObject,
});

const FilenameOutput = z.object({ filename: z.string() });
const SimulatorOutput = z.object({ payload: JsonObject });

export const BotbabaEndpointInputSchemas = {
	cartCreationShopifyWebhook: CartCreationShopifyWebhookInput,
	cartUpdateShopifyWebhook: CartUpdateShopifyWebhookInput,
	checkoutCreationShopifyWebhook: CheckoutCreationShopifyWebhookInput,
	checkoutUpdateShopifyWebhook: CheckoutUpdateShopifyWebhookInput,
	deleteBroadcast: DeleteBroadcastInput,
	deleteContact: DeleteContactInput,
	deleteFlow: DeleteFlowInput,
	deleteTag: DeleteTagInput,
	deleteTemplate: DeleteTemplateInput,
	deleteWebhook: DeleteWebhookInput,
	executeBotAction: ExecuteBotActionInput,
	executeBotActionByUser: ExecuteBotActionByUserInput,
	getBotWidgetSettings: GetBotWidgetSettingsInput,
	getBroadcast: GetBroadcastInput,
	getContact: GetContactInput,
	getContactAnalytics: GetContactAnalyticsInput,
	getFilename: GetFilenameInput,
	getFlow: GetFlowInput,
	getMessage: GetMessageInput,
	getMessageAnalytics: GetMessageAnalyticsInput,
	getTemplate: GetTemplateInput,
	getWebhook: GetWebhookInput,
	listBroadcasts: ListBroadcastsInput,
	listFlows: EmptyInput,
	listMessages: ListMessagesInput,
	listTags: EmptyInput,
	listTemplates: ListTemplatesInput,
	listWebhookEventTypes: EmptyInput,
	listWebhooks: ListWebhooksInput,
	orderCancellationShopifyWebhook: OrderCancellationShopifyWebhookInput,
	orderFulfillmentEventSimulator: OrderFulfillmentEventSimulatorInput,
	orderFulfillmentShopifyWebhook: OrderFulfillmentShopifyWebhookInput,
	orderPaymentShopifyWebhook: OrderPaymentShopifyWebhookInput,
	sendWhatsappTemplateMessages: SendWhatsappTemplateMessagesInput,
	cartCreationEventSimulator: EmptyInput,
	shopifyCheckoutCreationEventSimulator: EmptyInput,
	shopifyCheckoutUpdateEventSimulator: EmptyInput,
	updateContact: UpdateContactInput,
	updateTag: UpdateTagInput,
	updateTemplate: UpdateTemplateInput,
	updateWebhook: UpdateWebhookInput,
	waGupshupEventSimulator: WaGupshupEventSimulatorInput,
	waGupshupMessage: WaGupshupMessageInput,
} as const;

export const BotbabaEndpointOutputSchemas = {
	cartCreationShopifyWebhook: BotbabaApiResponse,
	cartUpdateShopifyWebhook: BotbabaApiResponse,
	checkoutCreationShopifyWebhook: BotbabaApiResponse,
	checkoutUpdateShopifyWebhook: BotbabaApiResponse,
	deleteBroadcast: BotbabaApiResponse,
	deleteContact: BotbabaApiResponse,
	deleteFlow: BotbabaApiResponse,
	deleteTag: BotbabaApiResponse,
	deleteTemplate: BotbabaApiResponse,
	deleteWebhook: BotbabaApiResponse,
	executeBotAction: BotbabaApiResponse,
	executeBotActionByUser: BotbabaApiResponse,
	getBotWidgetSettings: BotbabaApiResponse,
	getBroadcast: BotbabaApiResponse,
	getContact: BotbabaApiResponse,
	getContactAnalytics: BotbabaApiResponse,
	getFilename: FilenameOutput,
	getFlow: BotbabaApiResponse,
	getMessage: BotbabaApiResponse,
	getMessageAnalytics: BotbabaApiResponse,
	getTemplate: BotbabaApiResponse,
	getWebhook: BotbabaApiResponse,
	listBroadcasts: BotbabaApiResponse,
	listFlows: BotbabaApiResponse,
	listMessages: BotbabaApiResponse,
	listTags: BotbabaApiResponse,
	listTemplates: BotbabaApiResponse,
	listWebhookEventTypes: BotbabaApiResponse,
	listWebhooks: BotbabaApiResponse,
	orderCancellationShopifyWebhook: BotbabaApiResponse,
	orderFulfillmentEventSimulator: SimulatorOutput,
	orderFulfillmentShopifyWebhook: BotbabaApiResponse,
	orderPaymentShopifyWebhook: BotbabaApiResponse,
	sendWhatsappTemplateMessages: BotbabaApiResponse,
	cartCreationEventSimulator: SimulatorOutput,
	shopifyCheckoutCreationEventSimulator: SimulatorOutput,
	shopifyCheckoutUpdateEventSimulator: SimulatorOutput,
	updateContact: BotbabaApiResponse,
	updateTag: BotbabaApiResponse,
	updateTemplate: BotbabaApiResponse,
	updateWebhook: BotbabaApiResponse,
	waGupshupEventSimulator: SimulatorOutput,
	waGupshupMessage: BotbabaApiResponse,
} as const;

export type BotbabaEndpointInputs = {
	[K in keyof typeof BotbabaEndpointInputSchemas]: z.infer<
		(typeof BotbabaEndpointInputSchemas)[K]
	>;
};

export type BotbabaEndpointOutputs = {
	[K in keyof typeof BotbabaEndpointOutputSchemas]: z.infer<
		(typeof BotbabaEndpointOutputSchemas)[K]
	>;
};
