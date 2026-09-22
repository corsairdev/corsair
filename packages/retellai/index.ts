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
import { Calls, Chats } from './endpoints';
import type {
	RetellEndpointInputs,
	RetellEndpointOutputs,
} from './endpoints/types';
import {
	RetellEndpointInputSchemas,
	RetellEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RetellSchema } from './schema';

export type RetellPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRetellPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof retellEndpointsNested>;
};

export type RetellContext = CorsairPluginContext<
	typeof RetellSchema,
	RetellPluginOptions
>;
export type RetellKeyBuilderContext = KeyBuilderContext<RetellPluginOptions>;
export type RetellBoundEndpoints = BindEndpoints<typeof retellEndpointsNested>;

type RetellEndpoint<K extends keyof RetellEndpointOutputs> = CorsairEndpoint<
	RetellContext,
	RetellEndpointInputs[K],
	RetellEndpointOutputs[K]
>;

export type RetellEndpoints = {
	callsList: RetellEndpoint<'callsList'>;
	callsGet: RetellEndpoint<'callsGet'>;
	chatsList: RetellEndpoint<'chatsList'>;
	chatsGet: RetellEndpoint<'chatsGet'>;
};

const retellEndpointsNested = {
	calls: { list: Calls.list, get: Calls.get },
	chats: { list: Chats.list, get: Chats.get },
} as const;

export const retellEndpointSchemas = {
	'calls.list': {
		input: RetellEndpointInputSchemas.callsList,
		output: RetellEndpointOutputSchemas.callsList,
	},
	'calls.get': {
		input: RetellEndpointInputSchemas.callsGet,
		output: RetellEndpointOutputSchemas.callsGet,
	},
	'chats.list': {
		input: RetellEndpointInputSchemas.chatsList,
		output: RetellEndpointOutputSchemas.chatsList,
	},
	'chats.get': {
		input: RetellEndpointInputSchemas.chatsGet,
		output: RetellEndpointOutputSchemas.chatsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof retellEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const retellEndpointMeta = {
	'calls.list': {
		riskLevel: 'read',
		description: 'List Retell calls with filters and cursor pagination.',
	},
	'calls.get': {
		riskLevel: 'read',
		description:
			'Retrieve a call with its transcript, recording, and post-call analysis.',
	},
	'chats.list': {
		riskLevel: 'read',
		description: 'List Retell chats with filters and cursor pagination.',
	},
	'chats.get': {
		riskLevel: 'read',
		description: 'Retrieve a chat with its transcript and post-chat analysis.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof retellEndpointsNested>;

export const retellAuthConfig = {
	api_key: { account: ['one'] as const },
} as const satisfies PluginAuthConfig;

export type BaseRetellPlugin<T extends RetellPluginOptions> = CorsairPlugin<
	'retellai',
	typeof RetellSchema,
	typeof retellEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof retellAuthConfig
>;
export type InternalRetellPlugin = BaseRetellPlugin<RetellPluginOptions>;
export type ExternalRetellPlugin<T extends RetellPluginOptions> =
	BaseRetellPlugin<T>;

export function retellai<const T extends RetellPluginOptions>(
	incomingOptions: RetellPluginOptions & T = {} as RetellPluginOptions & T,
): ExternalRetellPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'retellai',
		schema: RetellSchema,
		options,
		hooks: options.hooks,
		endpoints: retellEndpointsNested,
		webhooks: {},
		endpointMeta: retellEndpointMeta,
		endpointSchemas: retellEndpointSchemas,
		authConfig: retellAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: RetellKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
				throw new AuthMissingError('retellai', 'api_key');
			}
			throw new AuthMissingError('retellai', 'api_key');
		},
	} satisfies InternalRetellPlugin;
}

export type {
	RetellEndpointInputs,
	RetellEndpointOutputs,
} from './endpoints/types';
export {
	RetellEndpointInputSchemas,
	RetellEndpointOutputSchemas,
} from './endpoints/types';
