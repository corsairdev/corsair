import type {
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
import * as handlers from './endpoints';
import type {
	SendbirdEndpointInputs,
	SendbirdEndpointOutputs,
} from './endpoints/types';
import {
	SendbirdEndpointInputSchemas as inputs,
	SendbirdEndpointOutputSchemas as outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SendbirdSchema } from './schema';

export const sendbirdAuthConfig = {
	api_key: { account: ['applicationId'] as const },
} as const satisfies PluginAuthConfig;
export type SendbirdPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	applicationId?: string;
	hooks?: InternalSendbirdPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type SendbirdContext = CorsairPluginContext<
	typeof SendbirdSchema,
	SendbirdPluginOptions,
	undefined,
	typeof sendbirdAuthConfig
>;
export type SendbirdKeyBuilderContext = KeyBuilderContext<
	SendbirdPluginOptions,
	typeof sendbirdAuthConfig
>;
export type SendbirdEndpoints = {
	[K in keyof SendbirdEndpointInputs]: CorsairEndpoint<
		SendbirdContext,
		SendbirdEndpointInputs[K],
		SendbirdEndpointOutputs[K]
	>;
};
export type SendbirdBoundEndpoints = BindEndpoints<typeof endpoints>;

const endpoints = {
	users: {
		list: handlers.usersList,
		get: handlers.usersGet,
		create: handlers.usersCreate,
		update: handlers.usersUpdate,
		delete: handlers.usersDelete,
	},
	channels: {
		list: handlers.channelsList,
		get: handlers.channelsGet,
		create: handlers.channelsCreate,
		update: handlers.channelsUpdate,
		delete: handlers.channelsDelete,
	},
	messages: {
		list: handlers.messagesList,
		get: handlers.messagesGet,
		send: handlers.messagesSend,
		update: handlers.messagesUpdate,
		delete: handlers.messagesDelete,
	},
} as const;
export const sendbirdEndpointSchemas = {
	'users.list': { input: inputs.usersList, output: outputs.usersList },
	'users.get': { input: inputs.usersGet, output: outputs.usersGet },
	'users.create': { input: inputs.usersCreate, output: outputs.usersCreate },
	'users.update': { input: inputs.usersUpdate, output: outputs.usersUpdate },
	'users.delete': { input: inputs.usersDelete, output: outputs.usersDelete },
	'channels.list': { input: inputs.channelsList, output: outputs.channelsList },
	'channels.get': { input: inputs.channelsGet, output: outputs.channelsGet },
	'channels.create': {
		input: inputs.channelsCreate,
		output: outputs.channelsCreate,
	},
	'channels.update': {
		input: inputs.channelsUpdate,
		output: outputs.channelsUpdate,
	},
	'channels.delete': {
		input: inputs.channelsDelete,
		output: outputs.channelsDelete,
	},
	'messages.list': { input: inputs.messagesList, output: outputs.messagesList },
	'messages.get': { input: inputs.messagesGet, output: outputs.messagesGet },
	'messages.send': { input: inputs.messagesSend, output: outputs.messagesSend },
	'messages.update': {
		input: inputs.messagesUpdate,
		output: outputs.messagesUpdate,
	},
	'messages.delete': {
		input: inputs.messagesDelete,
		output: outputs.messagesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
export const sendbirdEndpointMeta = {
	'users.list': {
		riskLevel: 'read',
		description: 'List application users with a page token.',
	},
	'users.get': { riskLevel: 'read', description: 'Get a user by ID.' },
	'users.create': {
		riskLevel: 'write',
		description: 'Create a user with a profile URL.',
	},
	'users.update': { riskLevel: 'write', description: 'Update a user.' },
	'users.delete': { riskLevel: 'destructive', description: 'Delete a user.' },
	'channels.list': {
		riskLevel: 'read',
		description: 'List group channels with a page token.',
	},
	'channels.get': { riskLevel: 'read', description: 'Get a group channel.' },
	'channels.create': {
		riskLevel: 'write',
		description: 'Create a group channel from user IDs.',
	},
	'channels.update': {
		riskLevel: 'write',
		description: 'Update a group channel.',
	},
	'channels.delete': {
		riskLevel: 'destructive',
		description: 'Delete a group channel.',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages around a timestamp or message ID.',
	},
	'messages.get': { riskLevel: 'read', description: 'Get a message.' },
	'messages.send': { riskLevel: 'write', description: 'Send a text message.' },
	'messages.update': {
		riskLevel: 'write',
		description: 'Update a text message.',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;
const defaultAuthType = 'api_key' as const;
export type BaseSendbirdPlugin<T extends SendbirdPluginOptions> = CorsairPlugin<
	'sendbird',
	typeof SendbirdSchema,
	typeof endpoints,
	{},
	T,
	typeof defaultAuthType,
	typeof sendbirdAuthConfig
>;
export type InternalSendbirdPlugin = BaseSendbirdPlugin<SendbirdPluginOptions>;
export type ExternalSendbirdPlugin<T extends SendbirdPluginOptions> =
	BaseSendbirdPlugin<T>;

export function sendbird<const T extends SendbirdPluginOptions>(
	incomingOptions: SendbirdPluginOptions & T = {} as SendbirdPluginOptions & T,
): ExternalSendbirdPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sendbird',
		schema: SendbirdSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: sendbirdEndpointMeta,
		endpointSchemas: sendbirdEndpointSchemas,
		authConfig: sendbirdAuthConfig,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: SendbirdKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('sendbird', 'api_key');
			if (options.key?.trim()) {
				if (!options.applicationId?.trim())
					throw new AuthMissingError('sendbird', 'api_key');
				return options.key;
			}
			// Do not mix a shared application ID with a per-tenant token.
			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				const id = await ctx.keys.get_applicationId();
				if (key?.trim() && id?.trim()) return key;
			}
			throw new AuthMissingError('sendbird', 'api_key');
		},
	} satisfies InternalSendbirdPlugin;
}
export { SendbirdAPIError } from './client';
export type {
	SendbirdEndpointInputs,
	SendbirdEndpointOutputs,
} from './endpoints/types';
export {
	SendbirdChannelSchema,
	SendbirdEndpointInputSchemas,
	SendbirdEndpointOutputSchemas,
	SendbirdMessageSchema,
	SendbirdUserSchema,
} from './endpoints/types';
export { SendbirdSchema } from './schema';
