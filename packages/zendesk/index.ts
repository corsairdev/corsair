import type {
	AuthTypes,
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
import { Comments, Tickets, Users } from './endpoints';
import type {
	ZendeskEndpointInputs,
	ZendeskEndpointOutputs,
} from './endpoints/types';
import {
	ZendeskEndpointInputSchemas,
	ZendeskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZendeskSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { matchZendeskTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, ZendeskWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ZendeskPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	subdomain?: string;
	webhookSecret?: string;
	hooks?: InternalZendeskPlugin['hooks'];
	webhookHooks?: InternalZendeskPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zendeskEndpointsNested>;
};

export const zendeskAuthConfig = {
	api_key: {
		account: ['subdomain', 'account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ZendeskContext = CorsairPluginContext<
	typeof ZendeskSchema,
	ZendeskPluginOptions,
	undefined,
	typeof zendeskAuthConfig
>;

export type ZendeskKeyBuilderContext = KeyBuilderContext<
	ZendeskPluginOptions,
	typeof zendeskAuthConfig
>;

export type ZendeskBoundEndpoints = BindEndpoints<
	typeof zendeskEndpointsNested
>;

type ZendeskEndpoint<K extends keyof ZendeskEndpointOutputs> = CorsairEndpoint<
	ZendeskContext,
	ZendeskEndpointInputs[K],
	ZendeskEndpointOutputs[K]
>;

export type ZendeskEndpoints = {
	ticketsCreate: ZendeskEndpoint<'ticketsCreate'>;
	ticketsGet: ZendeskEndpoint<'ticketsGet'>;
	ticketsUpdate: ZendeskEndpoint<'ticketsUpdate'>;
	ticketsDelete: ZendeskEndpoint<'ticketsDelete'>;
	ticketsList: ZendeskEndpoint<'ticketsList'>;
	usersCreate: ZendeskEndpoint<'usersCreate'>;
	usersGet: ZendeskEndpoint<'usersGet'>;
	usersUpdate: ZendeskEndpoint<'usersUpdate'>;
	usersDelete: ZendeskEndpoint<'usersDelete'>;
	usersList: ZendeskEndpoint<'usersList'>;
	commentsList: ZendeskEndpoint<'commentsList'>;
};

type ZendeskWebhook<
	K extends keyof ZendeskWebhookOutputs,
	TEvent,
> = CorsairWebhook<ZendeskContext, TEvent, ZendeskWebhookOutputs[K]>;

export type ZendeskWebhooks = {
	example: ZendeskWebhook<'example', ExampleEvent>;
};

export type ZendeskBoundWebhooks = BindWebhooks<ZendeskWebhooks>;

const zendeskEndpointsNested = {
	tickets: {
		create: Tickets.create,
		get: Tickets.get,
		update: Tickets.update,
		delete: Tickets.deleteTicket,
		list: Tickets.list,
	},
	users: {
		create: Users.create,
		get: Users.get,
		update: Users.update,
		delete: Users.deleteUser,
		list: Users.list,
	},
	comments: {
		list: Comments.list,
	},
} as const;

const zendeskWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const zendeskEndpointSchemas = {
	'tickets.create': {
		input: ZendeskEndpointInputSchemas.ticketsCreate,
		output: ZendeskEndpointOutputSchemas.ticketsCreate,
	},
	'tickets.get': {
		input: ZendeskEndpointInputSchemas.ticketsGet,
		output: ZendeskEndpointOutputSchemas.ticketsGet,
	},
	'tickets.update': {
		input: ZendeskEndpointInputSchemas.ticketsUpdate,
		output: ZendeskEndpointOutputSchemas.ticketsUpdate,
	},
	'tickets.delete': {
		input: ZendeskEndpointInputSchemas.ticketsDelete,
		output: ZendeskEndpointOutputSchemas.ticketsDelete,
	},
	'tickets.list': {
		input: ZendeskEndpointInputSchemas.ticketsList,
		output: ZendeskEndpointOutputSchemas.ticketsList,
	},
	'users.create': {
		input: ZendeskEndpointInputSchemas.usersCreate,
		output: ZendeskEndpointOutputSchemas.usersCreate,
	},
	'users.get': {
		input: ZendeskEndpointInputSchemas.usersGet,
		output: ZendeskEndpointOutputSchemas.usersGet,
	},
	'users.update': {
		input: ZendeskEndpointInputSchemas.usersUpdate,
		output: ZendeskEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: ZendeskEndpointInputSchemas.usersDelete,
		output: ZendeskEndpointOutputSchemas.usersDelete,
	},
	'users.list': {
		input: ZendeskEndpointInputSchemas.usersList,
		output: ZendeskEndpointOutputSchemas.usersList,
	},
	'comments.list': {
		input: ZendeskEndpointInputSchemas.commentsList,
		output: ZendeskEndpointOutputSchemas.commentsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zendeskEndpointsNested
>;

const zendeskWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof zendeskWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const zendeskEndpointMeta = {
	'tickets.create': {
		riskLevel: 'write',
		description: 'Create a new ticket',
	},
	'tickets.get': {
		riskLevel: 'read',
		description: 'Retrieve a ticket by its ID',
	},
	'tickets.update': {
		riskLevel: 'write',
		description: 'Update an existing ticket',
	},
	'tickets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a ticket by its ID',
	},
	'tickets.list': {
		riskLevel: 'read',
		description: 'List tickets with pagination',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a new user',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Retrieve a user by their ID',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update an existing user',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete a user by their ID',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users with pagination',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments for a specific ticket',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zendeskEndpointsNested>;

export type BaseZendeskPlugin<T extends ZendeskPluginOptions> = CorsairPlugin<
	'zendesk',
	typeof ZendeskSchema,
	typeof zendeskEndpointsNested,
	typeof zendeskWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof zendeskAuthConfig
>;

export type InternalZendeskPlugin = BaseZendeskPlugin<ZendeskPluginOptions>;

export type ExternalZendeskPlugin<T extends ZendeskPluginOptions> =
	BaseZendeskPlugin<T>;

export function zendesk<const T extends ZendeskPluginOptions>(
	incomingOptions: ZendeskPluginOptions & T = {} as ZendeskPluginOptions & T,
): ExternalZendeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zendesk',
		schema: ZendeskSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zendeskEndpointsNested,
		webhooks: zendeskWebhooksNested,
		authConfig: zendeskAuthConfig,
		endpointMeta: zendeskEndpointMeta,
		endpointSchemas: zendeskEndpointSchemas,
		webhookSchemas: zendeskWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-zendesk-webhook-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchZendeskTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZendeskKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new Error(
						'[auth-missing:zendesk:webhook_signature]: Zendesk webhook signature is missing',
					);
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('zendesk', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('zendesk', 'api_key');
		},
	} satisfies InternalZendeskPlugin;
}

export type {
	ZendeskEndpointInputs,
	ZendeskEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	ZendeskWebhookOutputs,
} from './webhooks/types';
