import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Calls, Users, Widgets } from './endpoints';
import type {
	CallPageEndpointInputs,
	CallPageEndpointOutputs,
} from './endpoints/types';
import {
	CallPageEndpointInputSchemas,
	CallPageEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CallPageSchema } from './schema';
import { CallPageWebhooks } from './webhooks';
import type {
	CallPageWebhookEvent,
	CallPageWebhookOutputs,
} from './webhooks/types';
import {
	CallPageWebhookEventSchema,
	CallPageWebhookOutputSchema,
} from './webhooks/types';

export const callPageAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type CallPagePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCallPagePlugin['hooks'];
	webhookHooks?: InternalCallPagePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof callPageEndpointsNested>;
};

export type CallPageContext = CorsairPluginContext<
	typeof CallPageSchema,
	CallPagePluginOptions
>;
export type CallPageKeyBuilderContext = KeyBuilderContext<
	CallPagePluginOptions,
	typeof callPageAuthConfig
>;

type CallPageEndpoint<K extends keyof CallPageEndpointOutputs> =
	CorsairEndpoint<
		CallPageContext,
		CallPageEndpointInputs[K],
		CallPageEndpointOutputs[K]
	>;

export type CallPageEndpoints = {
	callsGet: CallPageEndpoint<'callsGet'>;
	callsHistory: CallPageEndpoint<'callsHistory'>;
	usersList: CallPageEndpoint<'usersList'>;
	usersGet: CallPageEndpoint<'usersGet'>;
	usersCreate: CallPageEndpoint<'usersCreate'>;
	usersUpdate: CallPageEndpoint<'usersUpdate'>;
	usersDelete: CallPageEndpoint<'usersDelete'>;
	widgetsGet: CallPageEndpoint<'widgetsGet'>;
	widgetsCreate: CallPageEndpoint<'widgetsCreate'>;
	widgetsUpdate: CallPageEndpoint<'widgetsUpdate'>;
	widgetsDelete: CallPageEndpoint<'widgetsDelete'>;
	widgetsCall: CallPageEndpoint<'widgetsCall'>;
	widgetsCallOrSchedule: CallPageEndpoint<'widgetsCallOrSchedule'>;
};

export type CallPageBoundEndpoints = BindEndpoints<
	typeof callPageEndpointsNested
>;

type CallPageWebhook<
	K extends keyof CallPageWebhookOutputs,
	TEvent,
> = CorsairWebhook<CallPageContext, TEvent, CallPageWebhookOutputs[K]>;
export type CallPageWebhooks = {
	event: CallPageWebhook<'event', CallPageWebhookEvent>;
};
export type CallPageBoundWebhooks = BindWebhooks<CallPageWebhooks>;

const callPageEndpointsNested = {
	calls: { get: Calls.get, history: Calls.history },
	users: {
		list: Users.list,
		get: Users.get,
		create: Users.create,
		update: Users.update,
		delete: Users.remove,
	},
	widgets: {
		get: Widgets.get,
		create: Widgets.create,
		update: Widgets.update,
		delete: Widgets.remove,
		call: Widgets.call,
		callOrSchedule: Widgets.callOrSchedule,
	},
} as const;

const callPageWebhooksNested = {
	event: { received: CallPageWebhooks.event },
} as const;

export const callPageEndpointSchemas = {
	'calls.get': {
		input: CallPageEndpointInputSchemas.callsGet,
		output: CallPageEndpointOutputSchemas.callsGet,
	},
	'calls.history': {
		input: CallPageEndpointInputSchemas.callsHistory,
		output: CallPageEndpointOutputSchemas.callsHistory,
	},
	'users.list': {
		input: CallPageEndpointInputSchemas.usersList,
		output: CallPageEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: CallPageEndpointInputSchemas.usersGet,
		output: CallPageEndpointOutputSchemas.usersGet,
	},
	'users.create': {
		input: CallPageEndpointInputSchemas.usersCreate,
		output: CallPageEndpointOutputSchemas.usersCreate,
	},
	'users.update': {
		input: CallPageEndpointInputSchemas.usersUpdate,
		output: CallPageEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: CallPageEndpointInputSchemas.usersDelete,
		output: CallPageEndpointOutputSchemas.usersDelete,
	},
	'widgets.get': {
		input: CallPageEndpointInputSchemas.widgetsGet,
		output: CallPageEndpointOutputSchemas.widgetsGet,
	},
	'widgets.create': {
		input: CallPageEndpointInputSchemas.widgetsCreate,
		output: CallPageEndpointOutputSchemas.widgetsCreate,
	},
	'widgets.update': {
		input: CallPageEndpointInputSchemas.widgetsUpdate,
		output: CallPageEndpointOutputSchemas.widgetsUpdate,
	},
	'widgets.delete': {
		input: CallPageEndpointInputSchemas.widgetsDelete,
		output: CallPageEndpointOutputSchemas.widgetsDelete,
	},
	'widgets.call': {
		input: CallPageEndpointInputSchemas.widgetsCall,
		output: CallPageEndpointOutputSchemas.widgetsCall,
	},
	'widgets.callOrSchedule': {
		input: CallPageEndpointInputSchemas.widgetsCallOrSchedule,
		output: CallPageEndpointOutputSchemas.widgetsCallOrSchedule,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof callPageEndpointsNested
>;

const callPageWebhookSchemas = {
	'event.received': {
		description: 'Receives CallPage outgoing webhook events.',
		payload: CallPageWebhookEventSchema,
		response: CallPageWebhookOutputSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof callPageWebhooksNested
>;

const callPageEndpointMeta = {
	'calls.get': { riskLevel: 'read', description: 'Get a CallPage call by ID.' },
	'calls.history': {
		riskLevel: 'read',
		description: 'List and filter CallPage call history.',
	},
	'users.list': { riskLevel: 'read', description: 'List CallPage users.' },
	'users.get': { riskLevel: 'read', description: 'Get a CallPage user.' },
	'users.create': {
		riskLevel: 'write',
		description: 'Create a CallPage user.',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a CallPage user.',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete a CallPage user.',
	},
	'widgets.get': { riskLevel: 'read', description: 'Get a CallPage widget.' },
	'widgets.create': {
		riskLevel: 'write',
		description: 'Create a CallPage widget.',
	},
	'widgets.update': {
		riskLevel: 'write',
		description: 'Update a CallPage widget.',
	},
	'widgets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a CallPage widget.',
	},
	'widgets.call': {
		riskLevel: 'write',
		description: 'Initiate a CallPage widget call.',
	},
	'widgets.callOrSchedule': {
		riskLevel: 'write',
		description: 'Initiate or schedule a CallPage widget call.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof callPageEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export type BaseCallPagePlugin<T extends CallPagePluginOptions> = CorsairPlugin<
	'callpage',
	typeof CallPageSchema,
	typeof callPageEndpointsNested,
	typeof callPageWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof callPageAuthConfig
>;
export type InternalCallPagePlugin = BaseCallPagePlugin<CallPagePluginOptions>;
export type ExternalCallPagePlugin<T extends CallPagePluginOptions> =
	BaseCallPagePlugin<T>;

export function callpage<const T extends CallPagePluginOptions>(
	incomingOptions: CallPagePluginOptions & T = {} as CallPagePluginOptions & T,
): ExternalCallPagePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'callpage',
		schema: CallPageSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: callPageEndpointsNested,
		webhooks: callPageWebhooksNested,
		authConfig: callPageAuthConfig,
		endpointMeta: callPageEndpointMeta,
		endpointSchemas: callPageEndpointSchemas,
		webhookSchemas: callPageWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const body =
				typeof request.body === 'string'
					? (() => {
							try {
								return JSON.parse(request.body);
							} catch {
								return null;
							}
						})()
					: request.body;
			const parsed = CallPageWebhookEventSchema.safeParse(body);
			if (!parsed.success) return false;
			if (options.webhookSecret) {
				const authorization = request.headers.authorization;
				const header = Array.isArray(authorization)
					? authorization[0]
					: authorization;
				return typeof header === 'string' && header.length > 0;
			}
			return true;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CallPageKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (res) return res;
				throw new Error(
					'[auth-missing:callpage:webhook_signature]: CallPage webhook verification token is missing',
				);
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
				throw new AuthMissingError('callpage', 'api_key');
			}

			throw new AuthMissingError('callpage', 'api_key');
		},
	} satisfies InternalCallPagePlugin;
}

export type {
	CallPageWebhookEvent,
	CallPageWebhookOutputs,
} from './webhooks/types';
