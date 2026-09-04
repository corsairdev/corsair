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
import { Callerapi } from './endpoints';
import type {
	CallerapiEndpointInputs,
	CallerapiEndpointOutputs,
} from './endpoints/types';
import {
	CallerapiEndpointInputSchemas,
	CallerapiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CallerapiSchema } from './schema';

export type CallerapiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCallerapiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof callerapiEndpointsNested>;
};

export type CallerapiContext = CorsairPluginContext<
	typeof CallerapiSchema,
	CallerapiPluginOptions
>;

export type CallerapiKeyBuilderContext =
	KeyBuilderContext<CallerapiPluginOptions>;

export type CallerapiBoundEndpoints = BindEndpoints<
	typeof callerapiEndpointsNested
>;

type CallerapiEndpoint<K extends keyof CallerapiEndpointOutputs> =
	CorsairEndpoint<
		CallerapiContext,
		CallerapiEndpointInputs[K],
		CallerapiEndpointOutputs[K]
	>;

export type CallerapiEndpoints = {
	lookup: CallerapiEndpoint<'lookup'>;
	ported: CallerapiEndpoint<'ported'>;
	portingHistory: CallerapiEndpoint<'portingHistory'>;
	onlinePresence: CallerapiEndpoint<'onlinePresence'>;
};

const callerapiEndpointsNested = {
	callerapi: {
		lookup: Callerapi.lookup,
		ported: Callerapi.ported,
		portingHistory: Callerapi.portingHistory,
		onlinePresence: Callerapi.onlinePresence,
	},
} as const;

export const callerapiEndpointSchemas = {
	'callerapi.lookup': {
		input: CallerapiEndpointInputSchemas.lookup,
		output: CallerapiEndpointOutputSchemas.lookup,
	},

	'callerapi.ported': {
		input: CallerapiEndpointInputSchemas.ported,
		output: CallerapiEndpointOutputSchemas.ported,
	},

	'callerapi.portingHistory': {
		input: CallerapiEndpointInputSchemas.portingHistory,
		output: CallerapiEndpointOutputSchemas.portingHistory,
	},

	'callerapi.onlinePresence': {
		input: CallerapiEndpointInputSchemas.onlinePresence,
		output: CallerapiEndpointOutputSchemas.onlinePresence,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof callerapiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const callerapiEndpointMeta = {
	'callerapi.lookup': {
		riskLevel: 'read',
		description: 'Look up caller information for a phone number',
	},

	'callerapi.ported': {
		riskLevel: 'read',
		description: 'Check whether a phone number has been ported',
	},

	'callerapi.portingHistory': {
		riskLevel: 'read',
		description: 'Get porting history for a phone number',
	},

	'callerapi.onlinePresence': {
		riskLevel: 'read',
		description: 'Check online presence for a phone number',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof callerapiEndpointsNested
>;

export const callerapiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCallerapiPlugin<T extends CallerapiPluginOptions> =
	CorsairPlugin<
		'callerapi',
		typeof CallerapiSchema,
		typeof callerapiEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalCallerapiPlugin =
	BaseCallerapiPlugin<CallerapiPluginOptions>;

export type ExternalCallerapiPlugin<T extends CallerapiPluginOptions> =
	BaseCallerapiPlugin<T>;

export function callerapi<const T extends CallerapiPluginOptions>(
	incomingOptions: CallerapiPluginOptions & T = {} as CallerapiPluginOptions &
		T,
): ExternalCallerapiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'callerapi',
		authConfig: callerapiAuthConfig,
		schema: CallerapiSchema,
		options,
		hooks: options.hooks,
		endpoints: callerapiEndpointsNested,
		webhooks: {},
		endpointMeta: callerapiEndpointMeta,
		endpointSchemas: callerapiEndpointSchemas,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: CallerapiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCallerapiPlugin;
}

export type {
	CallerApiResponse,
	CallerapiEndpointInputs,
	CallerapiEndpointOutputs,
	PhoneInput,
} from './endpoints/types';
