import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Handlers } from './endpoints';
import type {
	BotbabaEndpointInputs,
	BotbabaEndpointOutputs,
} from './endpoints/types';
import {
	BotbabaEndpointInputSchemas,
	BotbabaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BotbabaSchema } from './schema';

export type BotbabaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBotbabaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof botbabaEndpointsNested>;
};

export const botbabaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BotbabaContext = CorsairPluginContext<
	typeof BotbabaSchema,
	BotbabaPluginOptions
>;

export type BotbabaKeyBuilderContext = KeyBuilderContext<BotbabaPluginOptions>;

export type BotbabaBoundEndpoints = BindEndpoints<
	typeof botbabaEndpointsNested
>;

type BotbabaEndpoint<K extends keyof BotbabaEndpointOutputs> = CorsairEndpoint<
	BotbabaContext,
	BotbabaEndpointInputs[K],
	BotbabaEndpointOutputs[K]
>;

export type BotbabaEndpoints = {
	[K in keyof BotbabaEndpointOutputs]: BotbabaEndpoint<K>;
};

const botbabaEndpointsNested = {
	contacts: {
		get: Handlers.getContact,
		update: Handlers.updateContact,
		delete: Handlers.deleteContact,
		getAnalytics: Handlers.getContactAnalytics,
	},
	tags: {
		list: Handlers.listTags,
		update: Handlers.updateTag,
		delete: Handlers.deleteTag,
	},
	templates: {
		get: Handlers.getTemplate,
		list: Handlers.listTemplates,
		update: Handlers.updateTemplate,
		delete: Handlers.deleteTemplate,
	},
	broadcasts: {
		get: Handlers.getBroadcast,
		list: Handlers.listBroadcasts,
		delete: Handlers.deleteBroadcast,
	},
	flows: {
		get: Handlers.getFlow,
		list: Handlers.listFlows,
		delete: Handlers.deleteFlow,
	},
	webhooks: {
		get: Handlers.getWebhook,
		list: Handlers.listWebhooks,
		update: Handlers.updateWebhook,
		delete: Handlers.deleteWebhook,
		listEventTypes: Handlers.listWebhookEventTypes,
	},
	messages: {
		get: Handlers.getMessage,
		list: Handlers.listMessages,
		getAnalytics: Handlers.getMessageAnalytics,
		sendWhatsappTemplate: Handlers.sendWhatsappTemplateMessages,
	},
	actions: {
		execute: Handlers.executeBotAction,
		executeByUser: Handlers.executeBotActionByUser,
		getWidgetSettings: Handlers.getBotWidgetSettings,
	},
	shopify: {
		cartCreation: Handlers.cartCreationShopifyWebhook,
		cartUpdate: Handlers.cartUpdateShopifyWebhook,
		checkoutCreation: Handlers.checkoutCreationShopifyWebhook,
		checkoutUpdate: Handlers.checkoutUpdateShopifyWebhook,
		orderCancellation: Handlers.orderCancellationShopifyWebhook,
		orderFulfillment: Handlers.orderFulfillmentShopifyWebhook,
		orderPayment: Handlers.orderPaymentShopifyWebhook,
	},
	gupshup: {
		forwardMessage: Handlers.waGupshupMessage,
	},
	utils: {
		getFilename: Handlers.getFilename,
	},
	simulators: {
		cartCreation: Handlers.cartCreationEventSimulator,
		checkoutCreation: Handlers.shopifyCheckoutCreationEventSimulator,
		checkoutUpdate: Handlers.shopifyCheckoutUpdateEventSimulator,
		orderFulfillment: Handlers.orderFulfillmentEventSimulator,
		gupshup: Handlers.waGupshupEventSimulator,
	},
} as const;

export const botbabaEndpointSchemas = {
	'contacts.get': {
		input: BotbabaEndpointInputSchemas.getContact,
		output: BotbabaEndpointOutputSchemas.getContact,
	},
	'contacts.update': {
		input: BotbabaEndpointInputSchemas.updateContact,
		output: BotbabaEndpointOutputSchemas.updateContact,
	},
	'contacts.delete': {
		input: BotbabaEndpointInputSchemas.deleteContact,
		output: BotbabaEndpointOutputSchemas.deleteContact,
	},
	'contacts.getAnalytics': {
		input: BotbabaEndpointInputSchemas.getContactAnalytics,
		output: BotbabaEndpointOutputSchemas.getContactAnalytics,
	},
	'tags.list': {
		input: BotbabaEndpointInputSchemas.listTags,
		output: BotbabaEndpointOutputSchemas.listTags,
	},
	'tags.update': {
		input: BotbabaEndpointInputSchemas.updateTag,
		output: BotbabaEndpointOutputSchemas.updateTag,
	},
	'tags.delete': {
		input: BotbabaEndpointInputSchemas.deleteTag,
		output: BotbabaEndpointOutputSchemas.deleteTag,
	},
	'templates.get': {
		input: BotbabaEndpointInputSchemas.getTemplate,
		output: BotbabaEndpointOutputSchemas.getTemplate,
	},
	'templates.list': {
		input: BotbabaEndpointInputSchemas.listTemplates,
		output: BotbabaEndpointOutputSchemas.listTemplates,
	},
	'templates.update': {
		input: BotbabaEndpointInputSchemas.updateTemplate,
		output: BotbabaEndpointOutputSchemas.updateTemplate,
	},
	'templates.delete': {
		input: BotbabaEndpointInputSchemas.deleteTemplate,
		output: BotbabaEndpointOutputSchemas.deleteTemplate,
	},
	'broadcasts.get': {
		input: BotbabaEndpointInputSchemas.getBroadcast,
		output: BotbabaEndpointOutputSchemas.getBroadcast,
	},
	'broadcasts.list': {
		input: BotbabaEndpointInputSchemas.listBroadcasts,
		output: BotbabaEndpointOutputSchemas.listBroadcasts,
	},
	'broadcasts.delete': {
		input: BotbabaEndpointInputSchemas.deleteBroadcast,
		output: BotbabaEndpointOutputSchemas.deleteBroadcast,
	},
	'flows.get': {
		input: BotbabaEndpointInputSchemas.getFlow,
		output: BotbabaEndpointOutputSchemas.getFlow,
	},
	'flows.list': {
		input: BotbabaEndpointInputSchemas.listFlows,
		output: BotbabaEndpointOutputSchemas.listFlows,
	},
	'flows.delete': {
		input: BotbabaEndpointInputSchemas.deleteFlow,
		output: BotbabaEndpointOutputSchemas.deleteFlow,
	},
	'webhooks.get': {
		input: BotbabaEndpointInputSchemas.getWebhook,
		output: BotbabaEndpointOutputSchemas.getWebhook,
	},
	'webhooks.list': {
		input: BotbabaEndpointInputSchemas.listWebhooks,
		output: BotbabaEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.update': {
		input: BotbabaEndpointInputSchemas.updateWebhook,
		output: BotbabaEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.delete': {
		input: BotbabaEndpointInputSchemas.deleteWebhook,
		output: BotbabaEndpointOutputSchemas.deleteWebhook,
	},
	'webhooks.listEventTypes': {
		input: BotbabaEndpointInputSchemas.listWebhookEventTypes,
		output: BotbabaEndpointOutputSchemas.listWebhookEventTypes,
	},
	'messages.get': {
		input: BotbabaEndpointInputSchemas.getMessage,
		output: BotbabaEndpointOutputSchemas.getMessage,
	},
	'messages.list': {
		input: BotbabaEndpointInputSchemas.listMessages,
		output: BotbabaEndpointOutputSchemas.listMessages,
	},
	'messages.getAnalytics': {
		input: BotbabaEndpointInputSchemas.getMessageAnalytics,
		output: BotbabaEndpointOutputSchemas.getMessageAnalytics,
	},
	'messages.sendWhatsappTemplate': {
		input: BotbabaEndpointInputSchemas.sendWhatsappTemplateMessages,
		output: BotbabaEndpointOutputSchemas.sendWhatsappTemplateMessages,
	},
	'actions.execute': {
		input: BotbabaEndpointInputSchemas.executeBotAction,
		output: BotbabaEndpointOutputSchemas.executeBotAction,
	},
	'actions.executeByUser': {
		input: BotbabaEndpointInputSchemas.executeBotActionByUser,
		output: BotbabaEndpointOutputSchemas.executeBotActionByUser,
	},
	'actions.getWidgetSettings': {
		input: BotbabaEndpointInputSchemas.getBotWidgetSettings,
		output: BotbabaEndpointOutputSchemas.getBotWidgetSettings,
	},
	'shopify.cartCreation': {
		input: BotbabaEndpointInputSchemas.cartCreationShopifyWebhook,
		output: BotbabaEndpointOutputSchemas.cartCreationShopifyWebhook,
	},
	'shopify.cartUpdate': {
		input: BotbabaEndpointInputSchemas.cartUpdateShopifyWebhook,
		output: BotbabaEndpointOutputSchemas.cartUpdateShopifyWebhook,
	},
	'shopify.checkoutCreation': {
		input: BotbabaEndpointInputSchemas.checkoutCreationShopifyWebhook,
		output: BotbabaEndpointOutputSchemas.checkoutCreationShopifyWebhook,
	},
	'shopify.checkoutUpdate': {
		input: BotbabaEndpointInputSchemas.checkoutUpdateShopifyWebhook,
		output: BotbabaEndpointOutputSchemas.checkoutUpdateShopifyWebhook,
	},
	'shopify.orderCancellation': {
		input: BotbabaEndpointInputSchemas.orderCancellationShopifyWebhook,
		output: BotbabaEndpointOutputSchemas.orderCancellationShopifyWebhook,
	},
	'shopify.orderFulfillment': {
		input: BotbabaEndpointInputSchemas.orderFulfillmentShopifyWebhook,
		output: BotbabaEndpointOutputSchemas.orderFulfillmentShopifyWebhook,
	},
	'shopify.orderPayment': {
		input: BotbabaEndpointInputSchemas.orderPaymentShopifyWebhook,
		output: BotbabaEndpointOutputSchemas.orderPaymentShopifyWebhook,
	},
	'gupshup.forwardMessage': {
		input: BotbabaEndpointInputSchemas.waGupshupMessage,
		output: BotbabaEndpointOutputSchemas.waGupshupMessage,
	},
	'utils.getFilename': {
		input: BotbabaEndpointInputSchemas.getFilename,
		output: BotbabaEndpointOutputSchemas.getFilename,
	},
	'simulators.cartCreation': {
		input: BotbabaEndpointInputSchemas.cartCreationEventSimulator,
		output: BotbabaEndpointOutputSchemas.cartCreationEventSimulator,
	},
	'simulators.checkoutCreation': {
		input: BotbabaEndpointInputSchemas.shopifyCheckoutCreationEventSimulator,
		output: BotbabaEndpointOutputSchemas.shopifyCheckoutCreationEventSimulator,
	},
	'simulators.checkoutUpdate': {
		input: BotbabaEndpointInputSchemas.shopifyCheckoutUpdateEventSimulator,
		output: BotbabaEndpointOutputSchemas.shopifyCheckoutUpdateEventSimulator,
	},
	'simulators.orderFulfillment': {
		input: BotbabaEndpointInputSchemas.orderFulfillmentEventSimulator,
		output: BotbabaEndpointOutputSchemas.orderFulfillmentEventSimulator,
	},
	'simulators.gupshup': {
		input: BotbabaEndpointInputSchemas.waGupshupEventSimulator,
		output: BotbabaEndpointOutputSchemas.waGupshupEventSimulator,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof botbabaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const botbabaEndpointMeta = {
	'contacts.get': {
		riskLevel: 'read',
		description: 'Fetch a Botbaba contact by ID',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing Botbaba contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Botbaba contact',
	},
	'contacts.getAnalytics': {
		riskLevel: 'read',
		description: 'Retrieve contact analytics over a date range',
	},
	'tags.list': { riskLevel: 'read', description: 'List all tags' },
	'tags.update': { riskLevel: 'write', description: 'Rename a tag' },
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tag',
	},
	'templates.get': { riskLevel: 'read', description: 'Get a message template' },
	'templates.list': {
		riskLevel: 'read',
		description: 'List message templates',
	},
	'templates.update': {
		riskLevel: 'write',
		description: 'Update a message template',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message template',
	},
	'broadcasts.get': { riskLevel: 'read', description: 'Get a broadcast' },
	'broadcasts.list': { riskLevel: 'read', description: 'List broadcasts' },
	'broadcasts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a broadcast',
	},
	'flows.get': { riskLevel: 'read', description: 'Get a conversation flow' },
	'flows.list': { riskLevel: 'read', description: 'List conversation flows' },
	'flows.delete': {
		riskLevel: 'destructive',
		description: 'Delete a conversation flow',
	},
	'webhooks.get': { riskLevel: 'read', description: 'Get a webhook' },
	'webhooks.list': { riskLevel: 'read', description: 'List webhooks' },
	'webhooks.update': { riskLevel: 'write', description: 'Update a webhook' },
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook',
	},
	'webhooks.listEventTypes': {
		riskLevel: 'read',
		description: 'List webhook event types',
	},
	'messages.get': { riskLevel: 'read', description: 'Get a message' },
	'messages.list': { riskLevel: 'read', description: 'List messages' },
	'messages.getAnalytics': {
		riskLevel: 'read',
		description: 'Get message analytics',
	},
	'messages.sendWhatsappTemplate': {
		riskLevel: 'write',
		description: 'Send a WhatsApp template via Botbaba',
	},
	'actions.execute': {
		riskLevel: 'write',
		description: 'Execute a bot action for a conversation',
	},
	'actions.executeByUser': {
		riskLevel: 'write',
		description: 'Execute a bot action for users',
	},
	'actions.getWidgetSettings': {
		riskLevel: 'read',
		description: 'Get bot widget settings',
	},
	'shopify.cartCreation': {
		riskLevel: 'write',
		description: 'Forward Shopify cart creation to Botbaba',
	},
	'shopify.cartUpdate': {
		riskLevel: 'write',
		description: 'Forward Shopify cart update to Botbaba',
	},
	'shopify.checkoutCreation': {
		riskLevel: 'write',
		description: 'Forward Shopify checkout creation to Botbaba',
	},
	'shopify.checkoutUpdate': {
		riskLevel: 'write',
		description: 'Forward Shopify checkout update to Botbaba',
	},
	'shopify.orderCancellation': {
		riskLevel: 'write',
		description: 'Forward Shopify order cancellation to Botbaba',
	},
	'shopify.orderFulfillment': {
		riskLevel: 'write',
		description: 'Forward Shopify order fulfillment to Botbaba',
	},
	'shopify.orderPayment': {
		riskLevel: 'write',
		description: 'Forward Shopify order payment to Botbaba',
	},
	'gupshup.forwardMessage': {
		riskLevel: 'write',
		description: 'Forward a Gupshup WhatsApp webhook to Botbaba',
	},
	'utils.getFilename': {
		riskLevel: 'read',
		description: 'Extract a filename from a path',
	},
	'simulators.cartCreation': {
		riskLevel: 'read',
		description: 'Simulate a Shopify cart creation payload',
	},
	'simulators.checkoutCreation': {
		riskLevel: 'read',
		description: 'Simulate a Shopify checkout creation payload',
	},
	'simulators.checkoutUpdate': {
		riskLevel: 'read',
		description: 'Simulate a Shopify checkout update payload',
	},
	'simulators.orderFulfillment': {
		riskLevel: 'read',
		description: 'Simulate a Shopify order fulfillment payload',
	},
	'simulators.gupshup': {
		riskLevel: 'read',
		description: 'Simulate a Gupshup WhatsApp webhook payload',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof botbabaEndpointsNested>;

export type BaseBotbabaPlugin<T extends BotbabaPluginOptions> = CorsairPlugin<
	'botbaba',
	typeof BotbabaSchema,
	typeof botbabaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalBotbabaPlugin = BaseBotbabaPlugin<BotbabaPluginOptions>;

export type ExternalBotbabaPlugin<T extends BotbabaPluginOptions> =
	BaseBotbabaPlugin<T>;

export function botbaba<const T extends BotbabaPluginOptions>(
	incomingOptions: BotbabaPluginOptions & T = {} as BotbabaPluginOptions & T,
): ExternalBotbabaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'botbaba',
		authConfig: botbabaAuthConfig,
		schema: BotbabaSchema,
		options,
		hooks: options.hooks,
		endpoints: botbabaEndpointsNested,
		webhooks: {},
		endpointMeta: botbabaEndpointMeta,
		endpointSchemas: botbabaEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BotbabaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) {
				return options.key.trim();
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res?.trim()) return res.trim();
			}

			throw new AuthMissingError('botbaba', 'api_key');
		},
	} satisfies InternalBotbabaPlugin;
}

export type {
	BotbabaEndpointInputs,
	BotbabaEndpointOutputs,
} from './endpoints/types';
