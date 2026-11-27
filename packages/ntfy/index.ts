import type {
	BindEndpoints,
	CorsairEndpoint,
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
import { Account, Messages, Server } from './endpoints';
import type {
	NtfyEndpointInputs,
	NtfyEndpointOutputs,
} from './endpoints/types';
import {
	NtfyEndpointInputSchemas,
	NtfyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NtfySchema } from './schema';

export type NtfyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNtfyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ntfyEndpointsNested>;
};

export type NtfyContext = CorsairPluginContext<
	typeof NtfySchema,
	NtfyPluginOptions
>;

export type NtfyKeyBuilderContext = KeyBuilderContext<NtfyPluginOptions>;

export type NtfyBoundEndpoints = BindEndpoints<typeof ntfyEndpointsNested>;

type NtfyEndpoint<K extends keyof NtfyEndpointOutputs> = CorsairEndpoint<
	NtfyContext,
	NtfyEndpointInputs[K],
	NtfyEndpointOutputs[K]
>;

export type NtfyEndpoints = {
	messagesSend: NtfyEndpoint<'messagesSend'>;
	messagesPoll: NtfyEndpoint<'messagesPoll'>;
	messagesUpdate: NtfyEndpoint<'messagesUpdate'>;
	messagesClear: NtfyEndpoint<'messagesClear'>;
	messagesDelete: NtfyEndpoint<'messagesDelete'>;
	accountUsage: NtfyEndpoint<'accountUsage'>;
	serverHealth: NtfyEndpoint<'serverHealth'>;
	serverStats: NtfyEndpoint<'serverStats'>;
};

const ntfyEndpointsNested = {
	messages: {
		send: Messages.send,
		poll: Messages.poll,
		update: Messages.update,
		clear: Messages.clear,
		// `delete` is reserved as a function name; the endpoint is `remove`.
		delete: Messages.remove,
	},
	account: {
		usage: Account.usage,
	},
	server: {
		health: Server.health,
		stats: Server.stats,
	},
} as const;

export const ntfyEndpointSchemas = {
	'messages.send': {
		input: NtfyEndpointInputSchemas.messagesSend,
		output: NtfyEndpointOutputSchemas.messagesSend,
	},
	'messages.poll': {
		input: NtfyEndpointInputSchemas.messagesPoll,
		output: NtfyEndpointOutputSchemas.messagesPoll,
	},
	'messages.update': {
		input: NtfyEndpointInputSchemas.messagesUpdate,
		output: NtfyEndpointOutputSchemas.messagesUpdate,
	},
	'messages.clear': {
		input: NtfyEndpointInputSchemas.messagesClear,
		output: NtfyEndpointOutputSchemas.messagesClear,
	},
	'messages.delete': {
		input: NtfyEndpointInputSchemas.messagesDelete,
		output: NtfyEndpointOutputSchemas.messagesDelete,
	},
	'account.usage': {
		input: NtfyEndpointInputSchemas.accountUsage,
		output: NtfyEndpointOutputSchemas.accountUsage,
	},
	'server.health': {
		input: NtfyEndpointInputSchemas.serverHealth,
		output: NtfyEndpointOutputSchemas.serverHealth,
	},
	'server.stats': {
		input: NtfyEndpointInputSchemas.serverStats,
		output: NtfyEndpointOutputSchemas.serverStats,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ntfyEndpointsNested>;

const defaultAuthType = 'api_key' as const;

// ntfy has no inbound webhooks: subscribers poll topics, so the plugin ships
// no webhook handlers.
const ntfyEndpointMeta = {
	'messages.send': {
		riskLevel: 'write',
		description:
			'Publish a notification to a topic; every subscriber gets a push, so the send cannot be undone',
		irreversible: true,
	},
	'messages.poll': {
		riskLevel: 'read',
		description:
			'Read cached messages from one or more topics, optionally including scheduled ones, with since/filters',
	},
	'messages.update': {
		riskLevel: 'write',
		description:
			'Publish a new version of a message under an existing sequence id; the server keeps both versions and notifies again',
	},
	'messages.clear': {
		riskLevel: 'write',
		description:
			'Mark a message as read and dismissed on subscribers (sends a message_clear event)',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a message by sequence id, sending a delete event to subscribers; the cache entry is removed',
		irreversible: true,
	},
	'account.usage': {
		riskLevel: 'read',
		description:
			'Read the account view: tier limits, messages/emails/calls used and remaining, and the daily reset time',
	},
	'server.health': {
		riskLevel: 'read',
		description: 'Read server health (healthy flag and role)',
	},
	'server.stats': {
		riskLevel: 'read',
		description: 'Read server-wide totals: message count and rate per second',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ntfyEndpointsNested>;

export type BaseNtfyPlugin<T extends NtfyPluginOptions> = CorsairPlugin<
	'ntfy',
	typeof NtfySchema,
	typeof ntfyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNtfyPlugin = BaseNtfyPlugin<NtfyPluginOptions>;

export type ExternalNtfyPlugin<T extends NtfyPluginOptions> = BaseNtfyPlugin<T>;

export function ntfy<const T extends NtfyPluginOptions>(
	incomingOptions: NtfyPluginOptions & T = {} as NtfyPluginOptions & T,
): ExternalNtfyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ntfy',
		schema: NtfySchema,
		options: options,
		hooks: options.hooks,
		endpoints: ntfyEndpointsNested,
		webhooks: {},
		endpointMeta: ntfyEndpointMeta,
		endpointSchemas: ntfyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NtfyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			// Any garbage Authorization header 401s on ntfy.sh, so an absent
			// key must throw rather than send a placeholder.
			throw new AuthMissingError('ntfy', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNtfyPlugin;
}

export { NtfyAPIError } from './client';

export type {
	AccountUsageInput,
	AccountUsageResponse,
	MessagesClearInput,
	MessagesClearResponse,
	MessagesDeleteInput,
	MessagesDeleteResponse,
	MessagesPollInput,
	MessagesPollResponse,
	MessagesSendInput,
	MessagesSendResponse,
	MessagesUpdateInput,
	MessagesUpdateResponse,
	NtfyEndpointInputs,
	NtfyEndpointOutputs,
	ServerHealthInput,
	ServerHealthResponse,
	ServerStatsInput,
	ServerStatsResponse,
} from './endpoints/types';
