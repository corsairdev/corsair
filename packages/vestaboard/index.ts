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
import { packVestaboardCredentials, tryGetStoredKey } from './client';
import { Subscriptions } from './endpoints';
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
	key?: string;
	apiSecret?: string;
	hooks?: InternalVestaboardPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vestaboardEndpointsNested>;
};

export type VestaboardContext = CorsairPluginContext<
	typeof VestaboardSchema,
	VestaboardPluginOptions,
	undefined,
	typeof vestaboardAuthConfig
>;

export type VestaboardKeyBuilderContext = KeyBuilderContext<
	VestaboardPluginOptions,
	typeof vestaboardAuthConfig
>;

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
	subscriptionsList: VestaboardEndpoint<'subscriptionsList'>;
	subscriptionsPostMessage: VestaboardEndpoint<'subscriptionsPostMessage'>;
};

const vestaboardEndpointsNested = {
	subscriptions: {
		list: Subscriptions.list,
		postMessage: Subscriptions.postMessage,
	},
} as const;

export const vestaboardEndpointSchemas = {
	'subscriptions.list': {
		input: VestaboardEndpointInputSchemas.subscriptionsList,
		output: VestaboardEndpointOutputSchemas.subscriptionsList,
	},
	'subscriptions.postMessage': {
		input: VestaboardEndpointInputSchemas.subscriptionsPostMessage,
		output: VestaboardEndpointOutputSchemas.subscriptionsPostMessage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof vestaboardEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const vestaboardEndpointMeta = {
	'subscriptions.list': {
		riskLevel: 'read',
		description:
			'List Vestaboard subscriptions accessible with the current API key and secret',
	},
	'subscriptions.postMessage': {
		riskLevel: 'write',
		description:
			'Send text or a 6x22 character grid to a Vestaboard subscription',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof vestaboardEndpointsNested
>;

export const vestaboardAuthConfig = {
	api_key: {
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseVestaboardPlugin<T extends VestaboardPluginOptions> =
	CorsairPlugin<
		'vestaboard',
		typeof VestaboardSchema,
		typeof vestaboardEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof vestaboardAuthConfig
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
		webhookHooks: undefined,
		endpoints: vestaboardEndpointsNested,
		webhooks: {},
		endpointMeta: vestaboardEndpointMeta,
		endpointSchemas: vestaboardEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VestaboardKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('vestaboard', 'api_key');
			}

			const apiKey =
				options.key ?? (await tryGetStoredKey(() => ctx.keys.get_api_key()));
			const apiSecret =
				options.apiSecret ??
				(await tryGetStoredKey(() => ctx.keys.get_api_secret()));
			if (!apiKey || !apiSecret) {
				throw new AuthMissingError('vestaboard', 'api_key');
			}
			return packVestaboardCredentials(apiKey, apiSecret);
		},
	} satisfies InternalVestaboardPlugin;
}

export {
	makeVestaboardRequest,
	packVestaboardCredentials,
	VestaboardAPIError,
	VestaboardRateLimitError,
} from './client';
export type {
	SubscriptionsListInput,
	SubscriptionsListOutput,
	SubscriptionsPostMessageInput,
	SubscriptionsPostMessageOutput,
	VestaboardEndpointInputs,
	VestaboardEndpointOutputs,
} from './endpoints/types';
