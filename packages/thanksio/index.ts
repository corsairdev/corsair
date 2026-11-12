import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { thanksIoEndpointsNested } from './endpoints';
import {
	ThanksIoEndpointInputSchemas as Inputs,
	ThanksIoEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { mergeErrorHandlers } from './error-handlers';
import { ThanksIoSchema } from './schema';

export type ThanksIoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalThanksIoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof thanksIoEndpointsNested>;
};
export type ThanksIoContext = CorsairPluginContext<
	typeof ThanksIoSchema,
	ThanksIoPluginOptions
>;
export type ThanksIoKeyBuilderContext =
	KeyBuilderContext<ThanksIoPluginOptions>;
export type ThanksIoBoundEndpoints = BindEndpoints<
	typeof thanksIoEndpointsNested
>;

export const thanksIoEndpointSchemas = {
	'recipients.get': {
		input: Inputs.recipientsGet,
		output: Outputs.recipientsGet,
	},
	'recipients.update': {
		input: Inputs.recipientsUpdate,
		output: Outputs.recipientsUpdate,
	},
	'recipients.delete': {
		input: Inputs.recipientsDelete,
		output: Outputs.recipientsDelete,
	},
	'recipients.create': {
		input: Inputs.recipientsCreate,
		output: Outputs.recipientsCreate,
	},
	'recipients.createMultiple': {
		input: Inputs.recipientsCreateMultiple,
		output: Outputs.recipientsCreateMultiple,
	},
	'recipients.deleteByAddress': {
		input: Inputs.recipientsDeleteByAddress,
		output: Outputs.recipientsDeleteByAddress,
	},
	'mailingLists.list': {
		input: Inputs.mailingListsList,
		output: Outputs.mailingListsList,
	},
	'mailingLists.create': {
		input: Inputs.mailingListsCreate,
		output: Outputs.mailingListsCreate,
	},
	'mailingLists.get': {
		input: Inputs.mailingListsGet,
		output: Outputs.mailingListsGet,
	},
	'mailingLists.delete': {
		input: Inputs.mailingListsDelete,
		output: Outputs.mailingListsDelete,
	},
	'mailingLists.listRecipients': {
		input: Inputs.mailingListsListRecipients,
		output: Outputs.mailingListsListRecipients,
	},
	'mailingLists.buyRadiusSearch': {
		input: Inputs.mailingListsBuyRadiusSearch,
		output: Outputs.mailingListsBuyRadiusSearch,
	},
	'mailingLists.countRadiusSearch': {
		input: Inputs.mailingListsCountRadiusSearch,
		output: Outputs.mailingListsCountRadiusSearch,
	},
	'webhookDestinations.list': {
		input: Inputs.webhookDestinationsList,
		output: Outputs.webhookDestinationsList,
	},
	'webhookDestinations.create': {
		input: Inputs.webhookDestinationsCreate,
		output: Outputs.webhookDestinationsCreate,
	},
	'webhookDestinations.update': {
		input: Inputs.webhookDestinationsUpdate,
		output: Outputs.webhookDestinationsUpdate,
	},
	'webhookDestinations.delete': {
		input: Inputs.webhookDestinationsDelete,
		output: Outputs.webhookDestinationsDelete,
	},
	'subAccounts.list': {
		input: Inputs.subAccountsList,
		output: Outputs.subAccountsList,
	},
	'subAccounts.create': {
		input: Inputs.subAccountsCreate,
		output: Outputs.subAccountsCreate,
	},
	'subAccounts.get': {
		input: Inputs.subAccountsGet,
		output: Outputs.subAccountsGet,
	},
	'subAccounts.update': {
		input: Inputs.subAccountsUpdate,
		output: Outputs.subAccountsUpdate,
	},
	'subAccounts.delete': {
		input: Inputs.subAccountsDelete,
		output: Outputs.subAccountsDelete,
	},
	'messageTemplates.list': {
		input: Inputs.messageTemplatesList,
		output: Outputs.messageTemplatesList,
	},
	'messageTemplates.create': {
		input: Inputs.messageTemplatesCreate,
		output: Outputs.messageTemplatesCreate,
	},
	'messageTemplates.get': {
		input: Inputs.messageTemplatesGet,
		output: Outputs.messageTemplatesGet,
	},
	'messageTemplates.update': {
		input: Inputs.messageTemplatesUpdate,
		output: Outputs.messageTemplatesUpdate,
	},
	'messageTemplates.delete': {
		input: Inputs.messageTemplatesDelete,
		output: Outputs.messageTemplatesDelete,
	},
	'imageTemplates.list': {
		input: Inputs.imageTemplatesList,
		output: Outputs.imageTemplatesList,
	},
	'creatives.list': {
		input: Inputs.creativesList,
		output: Outputs.creativesList,
	},
	'creatives.get': { input: Inputs.creativesGet, output: Outputs.creativesGet },
	'handwritingStyles.list': {
		input: Inputs.handwritingStylesList,
		output: Outputs.handwritingStylesList,
	},
	'giftcardBrands.list': {
		input: Inputs.giftcardBrandsList,
		output: Outputs.giftcardBrandsList,
	},
	'giftcardBrands.listFlat': {
		input: Inputs.giftcardBrandsListFlat,
		output: Outputs.giftcardBrandsListFlat,
	},
	'orders.list': { input: Inputs.ordersList, output: Outputs.ordersList },
	'orders.track': { input: Inputs.ordersTrack, output: Outputs.ordersTrack },
	'orders.listItems': {
		input: Inputs.ordersListItems,
		output: Outputs.ordersListItems,
	},
	'orders.cancel': { input: Inputs.ordersCancel, output: Outputs.ordersCancel },
	'orders.replay': { input: Inputs.ordersReplay, output: Outputs.ordersReplay },
	'orderItems.invalidateGiftcard': {
		input: Inputs.orderItemsInvalidateGiftcard,
		output: Outputs.orderItemsInvalidateGiftcard,
	},
	'send.postcard': { input: Inputs.sendPostcard, output: Outputs.sendPostcard },
	'send.magnacard': {
		input: Inputs.sendMagnacard,
		output: Outputs.sendMagnacard,
	},
	'send.windowedLetter': {
		input: Inputs.sendWindowedLetter,
		output: Outputs.sendWindowedLetter,
	},
	'send.windowlessLetter': {
		input: Inputs.sendWindowlessLetter,
		output: Outputs.sendWindowlessLetter,
	},
	'send.notecard': { input: Inputs.sendNotecard, output: Outputs.sendNotecard },
	'send.giftcard': { input: Inputs.sendGiftcard, output: Outputs.sendGiftcard },
	'estimate.postcard': {
		input: Inputs.estimatePostcard,
		output: Outputs.estimatePostcard,
	},
	'estimate.magnacard': {
		input: Inputs.estimateMagnacard,
		output: Outputs.estimateMagnacard,
	},
	'estimate.windowedLetter': {
		input: Inputs.estimateWindowedLetter,
		output: Outputs.estimateWindowedLetter,
	},
	'estimate.windowlessLetter': {
		input: Inputs.estimateWindowlessLetter,
		output: Outputs.estimateWindowlessLetter,
	},
	'estimate.notecard': {
		input: Inputs.estimateNotecard,
		output: Outputs.estimateNotecard,
	},
	'estimate.giftcard': {
		input: Inputs.estimateGiftcard,
		output: Outputs.estimateGiftcard,
	},
	'imageBuilder.create': {
		input: Inputs.imageBuilderCreate,
		output: Outputs.imageBuilderCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof thanksIoEndpointsNested
>;

const thanksIoEndpointMeta = {
	'recipients.get': {
		riskLevel: 'read',
		description: 'Get a recipient by ID.',
	},
	'recipients.update': {
		riskLevel: 'write',
		description: 'Update a recipient by ID.',
	},
	'recipients.delete': {
		riskLevel: 'destructive',
		description: 'Delete a recipient by ID.',
	},
	'recipients.create': {
		riskLevel: 'write',
		description:
			'Create a recipient; email-only address lookup may incur a fee.',
	},
	'recipients.createMultiple': {
		riskLevel: 'write',
		description:
			'Create recipients; email-only address lookup may incur a fee.',
	},
	'recipients.deleteByAddress': {
		riskLevel: 'destructive',
		description: 'Delete a recipient by address or email.',
	},
	'mailingLists.list': {
		riskLevel: 'read',
		description: 'List mailing lists.',
	},
	'mailingLists.create': {
		riskLevel: 'write',
		description: 'Create a mailing list.',
	},
	'mailingLists.get': { riskLevel: 'read', description: 'Get a mailing list.' },
	'mailingLists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mailing list.',
	},
	'mailingLists.listRecipients': {
		riskLevel: 'read',
		description: 'List recipients in a mailing list.',
	},
	'mailingLists.buyRadiusSearch': {
		riskLevel: 'write',
		description: 'Purchase radius-search records; charges may apply.',
	},
	'mailingLists.countRadiusSearch': {
		riskLevel: 'read',
		description: 'Count available radius-search records.',
	},
	'webhookDestinations.list': {
		riskLevel: 'read',
		description: 'List outbound webhook destinations.',
	},
	'webhookDestinations.create': {
		riskLevel: 'write',
		description: 'Create an outbound webhook destination.',
	},
	'webhookDestinations.update': {
		riskLevel: 'write',
		description: 'Update an outbound webhook destination.',
	},
	'webhookDestinations.delete': {
		riskLevel: 'destructive',
		description: 'Delete an outbound webhook destination.',
	},
	'subAccounts.list': { riskLevel: 'read', description: 'List sub-accounts.' },
	'subAccounts.create': {
		riskLevel: 'write',
		description: 'Create a sub-account.',
	},
	'subAccounts.get': { riskLevel: 'read', description: 'Get a sub-account.' },
	'subAccounts.update': {
		riskLevel: 'write',
		description: 'Update a sub-account.',
	},
	'subAccounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a sub-account and its image templates, message templates, and campaigns; orders and lists move to the main account.',
	},
	'messageTemplates.list': {
		riskLevel: 'read',
		description: 'List message templates.',
	},
	'messageTemplates.create': {
		riskLevel: 'write',
		description: 'Create a message template.',
	},
	'messageTemplates.get': {
		riskLevel: 'read',
		description: 'Get a message template.',
	},
	'messageTemplates.update': {
		riskLevel: 'write',
		description: 'Update a message template.',
	},
	'messageTemplates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message template.',
	},
	'imageTemplates.list': {
		riskLevel: 'read',
		description: 'List image templates.',
	},
	'creatives.list': { riskLevel: 'read', description: 'List saved creatives.' },
	'creatives.get': { riskLevel: 'read', description: 'Get a saved creative.' },
	'handwritingStyles.list': {
		riskLevel: 'read',
		description: 'List handwriting styles.',
	},
	'giftcardBrands.list': {
		riskLevel: 'read',
		description: 'List gift-card brands by group.',
	},
	'giftcardBrands.listFlat': {
		riskLevel: 'read',
		description: 'List gift-card brands with their groups.',
	},
	'orders.list': { riskLevel: 'read', description: 'List recent orders.' },
	'orders.track': {
		riskLevel: 'read',
		description: 'Track an order and its delivery statistics.',
	},
	'orders.listItems': {
		riskLevel: 'read',
		description: 'List individual order items.',
	},
	'orders.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a reviewing order.',
	},
	'orders.replay': {
		riskLevel: 'write',
		description:
			'Place a new copy of a settled order; this charges and mails again.',
	},
	'orderItems.invalidateGiftcard': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently invalidate an unredeemed gift card.',
	},
	'send.postcard': {
		riskLevel: 'write',
		description: 'Send a postcard; charges may apply.',
	},
	'send.magnacard': {
		riskLevel: 'write',
		description: 'Send a magnacard; charges may apply.',
	},
	'send.windowedLetter': {
		riskLevel: 'write',
		description: 'Send a windowed letter; charges may apply.',
	},
	'send.windowlessLetter': {
		riskLevel: 'write',
		description: 'Send a windowless letter; charges may apply.',
	},
	'send.notecard': {
		riskLevel: 'write',
		description: 'Send a notecard; charges may apply.',
	},
	'send.giftcard': {
		riskLevel: 'write',
		description: 'Send a gift card; charges may apply.',
	},
	'estimate.postcard': {
		riskLevel: 'read',
		description: 'Estimate postcard costs without sending.',
	},
	'estimate.magnacard': {
		riskLevel: 'read',
		description: 'Estimate magnacard costs without sending.',
	},
	'estimate.windowedLetter': {
		riskLevel: 'read',
		description: 'Estimate windowed-letter costs without sending.',
	},
	'estimate.windowlessLetter': {
		riskLevel: 'read',
		description: 'Estimate windowless-letter costs without sending.',
	},
	'estimate.notecard': {
		riskLevel: 'read',
		description: 'Estimate notecard costs without sending.',
	},
	'estimate.giftcard': {
		riskLevel: 'read',
		description: 'Estimate gift-card costs without sending.',
	},
	'imageBuilder.create': {
		riskLevel: 'read',
		description: 'Build and return a PNG image without placing an order.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof thanksIoEndpointsNested>;

const defaultAuthType = 'api_key' as const;
export type BaseThanksIoPlugin<T extends ThanksIoPluginOptions> = CorsairPlugin<
	'thanksio',
	typeof ThanksIoSchema,
	typeof thanksIoEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;
export type InternalThanksIoPlugin = BaseThanksIoPlugin<ThanksIoPluginOptions>;
export type ExternalThanksIoPlugin<T extends ThanksIoPluginOptions> =
	BaseThanksIoPlugin<T>;

export function thanksio<const T extends ThanksIoPluginOptions>(
	incomingOptions: ThanksIoPluginOptions & T = {} as ThanksIoPluginOptions & T,
): ExternalThanksIoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'thanksio',
		schema: ThanksIoSchema,
		options,
		hooks: options.hooks,
		endpoints: thanksIoEndpointsNested,
		webhooks: {},
		pluginWebhookMatcher: () => false,
		endpointSchemas: thanksIoEndpointSchemas,
		endpointMeta: thanksIoEndpointMeta,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: ThanksIoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			throw new AuthMissingError('thanksio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalThanksIoPlugin;
}

export { ThanksIoAPIError } from './client';
export type {
	ThanksIoEndpointInputs,
	ThanksIoEndpointOutputs,
} from './endpoints/types';
