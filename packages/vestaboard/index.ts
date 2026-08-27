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
import { Message, Subscriptions, Viewer } from './endpoints';
import type {
	VestaboardEndpointInputs,
	VestaboardEndpointOutputs,
} from './endpoints/types';
import {
	VestaboardEndpointInputSchemas,
	VestaboardEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { VestaboardSchema } from './schema';

export type VestaboardPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * Vestaboard Read/Write API Key or Platform API Key.
	 */
	key?: string;
	/**
	 * Vestaboard Platform API Secret (used alongside Platform API Key).
	 */
	apiSecret?: string;
	hooks?: InternalVestaboardPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vestaboardEndpointsNested>;
};

export type VestaboardContext = CorsairPluginContext<
	typeof VestaboardSchema,
	VestaboardPluginOptions
>;

export type VestaboardKeyBuilderContext =
	KeyBuilderContext<VestaboardPluginOptions>;

export type VestaboardBoundEndpoints = BindEndpoints<
	typeof vestaboardEndpointsNested
>;

type VestaboardEndpoint<K extends keyof VestaboardEndpointOutputs> =
	CorsairEndpoint<
		VestaboardContext,
		VestaboardEndpointInputs[K],
		VestaboardEndpointOutputs[K]
	>;

export type VestaboardEndpoints = {
	messageGet: VestaboardEndpoint<'messageGet'>;
	messagePost: VestaboardEndpoint<'messagePost'>;
	messageClear: VestaboardEndpoint<'messageClear'>;
	subscriptionsList: VestaboardEndpoint<'subscriptionsList'>;
	subscriptionsGet: VestaboardEndpoint<'subscriptionsGet'>;
	subscriptionsPostMessage: VestaboardEndpoint<'subscriptionsPostMessage'>;
	viewerGet: VestaboardEndpoint<'viewerGet'>;
};

const vestaboardEndpointsNested = {
	message: {
		get: Message.get,
		post: Message.post,
		clear: Message.clear,
	},
	subscriptions: {
		list: Subscriptions.list,
		get: Subscriptions.get,
		postMessage: Subscriptions.postMessage,
	},
	viewer: {
		get: Viewer.get,
	},
} as const;

export const vestaboardEndpointSchemas = {
	'message.get': {
		input: VestaboardEndpointInputSchemas.messageGet,
		output: VestaboardEndpointOutputSchemas.messageGet,
	},
	'message.post': {
		input: VestaboardEndpointInputSchemas.messagePost,
		output: VestaboardEndpointOutputSchemas.messagePost,
	},
	'message.clear': {
		input: VestaboardEndpointInputSchemas.messageClear,
		output: VestaboardEndpointOutputSchemas.messageClear,
	},
	'subscriptions.list': {
		input: VestaboardEndpointInputSchemas.subscriptionsList,
		output: VestaboardEndpointOutputSchemas.subscriptionsList,
	},
	'subscriptions.get': {
		input: VestaboardEndpointInputSchemas.subscriptionsGet,
		output: VestaboardEndpointOutputSchemas.subscriptionsGet,
	},
	'subscriptions.postMessage': {
		input: VestaboardEndpointInputSchemas.subscriptionsPostMessage,
		output: VestaboardEndpointOutputSchemas.subscriptionsPostMessage,
	},
	'viewer.get': {
		input: VestaboardEndpointInputSchemas.viewerGet,
		output: VestaboardEndpointOutputSchemas.viewerGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof vestaboardEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const vestaboardEndpointMeta = {
	'message.get': {
		riskLevel: 'read',
		description: 'Get the currently displayed message on the Vestaboard',
	},
	'message.post': {
		riskLevel: 'write',
		description: 'Post a new text message or character matrix to the Vestaboard',
	},
	'message.clear': {
		riskLevel: 'write',
		description: 'Clear the Vestaboard display',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description: 'List all available Vestaboard subscriptions and boards',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description: 'Get the current message for a specific Vestaboard subscription',
	},
	'subscriptions.postMessage': {
		riskLevel: 'write',
		description: 'Post a message to a specific Vestaboard subscription',
	},
	'viewer.get': {
		riskLevel: 'read',
		description: 'Get information about the authenticated Vestaboard viewer',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof vestaboardEndpointsNested
>;

export const vestaboardAuthConfig = {
	api_key: {
		account: ['api_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseVestaboardPlugin<T extends VestaboardPluginOptions> =
	CorsairPlugin<
		'vestaboard',
		typeof VestaboardSchema,
		typeof vestaboardEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalVestaboardPlugin =
	BaseVestaboardPlugin<VestaboardPluginOptions>;

export type ExternalVestaboardPlugin<T extends VestaboardPluginOptions> =
	BaseVestaboardPlugin<T>;

export function vestaboard<const T extends VestaboardPluginOptions>(
	incomingOptions: VestaboardPluginOptions & T = {} as VestaboardPluginOptions &
		T,
): ExternalVestaboardPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'vestaboard',
		authConfig: vestaboardAuthConfig,
		schema: VestaboardSchema,
		options: options,
		hooks: options.hooks,
		endpoints: vestaboardEndpointsNested,
		webhooks: {} as const,
		endpointMeta: vestaboardEndpointMeta,
		endpointSchemas: vestaboardEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VestaboardKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalVestaboardPlugin;
}

export type {
	VestaboardEndpointInputs,
	VestaboardEndpointOutputs,
	MessageGetInput,
	MessageGetResponse,
	MessagePostInput,
	MessagePostResponse,
	MessageClearInput,
	MessageClearResponse,
	SubscriptionsListInput,
	SubscriptionsListResponse,
	SubscriptionsGetInput,
	SubscriptionsGetResponse,
	SubscriptionsPostMessageInput,
	SubscriptionsPostMessageResponse,
	ViewerGetInput,
	ViewerGetResponse,
} from './endpoints/types';
