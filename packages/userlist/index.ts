import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Companies, Events, Messages, Relationships, Users } from './endpoints';
import type {
	UserlistEndpointInputs,
	UserlistEndpointOutputs,
} from './endpoints/types';
import {
	UserlistEndpointInputSchemas,
	UserlistEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { UserlistSchema } from './schema';
import { UserlistWebhooks } from './webhooks';
import { USERLIST_WEBHOOK_EVENTS } from './webhooks/types';

export type UserlistPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Push API key used by the endpoint operations. */
	key?: string;
	/**
	 * The signing secret for incoming deliveries. Userlist returns one per webhook
	 * subscription, and it is not the Push key, so it is a separate option.
	 */
	webhookSecret?: string;
	hooks?: InternalUserlistPlugin['hooks'];
	webhookHooks?: InternalUserlistPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof userlistEndpointsNested>;
};

export type UserlistContext = CorsairPluginContext<
	typeof UserlistSchema,
	UserlistPluginOptions
>;

export type UserlistKeyBuilderContext =
	KeyBuilderContext<UserlistPluginOptions>;

export type UserlistBoundEndpoints = BindEndpoints<
	typeof userlistEndpointsNested
>;

/**
 * The handlers, keyed by topic. Each verifies its own signature.
 *
 * unknown: these are the erased generics of `CorsairWebhook`. Each handler's real
 * payload and result types live in `webhooks/types.ts`; repeating all fourteen here
 * would duplicate that file, and the handler map is only used for binding.
 */
export type UserlistWebhookHandlers = {
	userCreated: CorsairWebhook<UserlistContext, unknown, unknown>;
	userUpdated: CorsairWebhook<UserlistContext, unknown, unknown>;
	userSubscribed: CorsairWebhook<UserlistContext, unknown, unknown>;
	userUnsubscribed: CorsairWebhook<UserlistContext, unknown, unknown>;
	companyCreated: CorsairWebhook<UserlistContext, unknown, unknown>;
	companyUpdated: CorsairWebhook<UserlistContext, unknown, unknown>;
	relationshipCreated: CorsairWebhook<UserlistContext, unknown, unknown>;
	relationshipUpdated: CorsairWebhook<UserlistContext, unknown, unknown>;
	formSubmitted: CorsairWebhook<UserlistContext, unknown, unknown>;
	messageEnqueued: CorsairWebhook<UserlistContext, unknown, unknown>;
	messageOpened: CorsairWebhook<UserlistContext, unknown, unknown>;
	messageClicked: CorsairWebhook<UserlistContext, unknown, unknown>;
	messageBounced: CorsairWebhook<UserlistContext, unknown, unknown>;
	messageReported: CorsairWebhook<UserlistContext, unknown, unknown>;
};

type UserlistEndpoint<K extends keyof UserlistEndpointOutputs> =
	CorsairEndpoint<
		UserlistContext,
		UserlistEndpointInputs[K],
		UserlistEndpointOutputs[K]
	>;

export type UserlistEndpoints = {
	usersUpsert: UserlistEndpoint<'usersUpsert'>;
	usersDelete: UserlistEndpoint<'usersDelete'>;
	companiesUpsert: UserlistEndpoint<'companiesUpsert'>;
	companiesDelete: UserlistEndpoint<'companiesDelete'>;
	relationshipsUpsert: UserlistEndpoint<'relationshipsUpsert'>;
	relationshipsDelete: UserlistEndpoint<'relationshipsDelete'>;
	eventsCreate: UserlistEndpoint<'eventsCreate'>;
	messagesSend: UserlistEndpoint<'messagesSend'>;
};

const userlistEndpointsNested = {
	users: {
		upsert: Users.upsert,
		delete: Users.remove,
	},
	companies: {
		upsert: Companies.upsert,
		delete: Companies.remove,
	},
	relationships: {
		upsert: Relationships.upsert,
		delete: Relationships.remove,
	},
	events: {
		create: Events.create,
	},
	messages: {
		send: Messages.send,
	},
} as const;

export const userlistEndpointSchemas = {
	'users.upsert': {
		input: UserlistEndpointInputSchemas.usersUpsert,
		output: UserlistEndpointOutputSchemas.usersUpsert,
	},
	'users.delete': {
		input: UserlistEndpointInputSchemas.usersDelete,
		output: UserlistEndpointOutputSchemas.usersDelete,
	},
	'companies.upsert': {
		input: UserlistEndpointInputSchemas.companiesUpsert,
		output: UserlistEndpointOutputSchemas.companiesUpsert,
	},
	'companies.delete': {
		input: UserlistEndpointInputSchemas.companiesDelete,
		output: UserlistEndpointOutputSchemas.companiesDelete,
	},
	'relationships.upsert': {
		input: UserlistEndpointInputSchemas.relationshipsUpsert,
		output: UserlistEndpointOutputSchemas.relationshipsUpsert,
	},
	'relationships.delete': {
		input: UserlistEndpointInputSchemas.relationshipsDelete,
		output: UserlistEndpointOutputSchemas.relationshipsDelete,
	},
	'events.create': {
		input: UserlistEndpointInputSchemas.eventsCreate,
		output: UserlistEndpointOutputSchemas.eventsCreate,
	},
	'messages.send': {
		input: UserlistEndpointInputSchemas.messagesSend,
		output: UserlistEndpointOutputSchemas.messagesSend,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof userlistEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const userlistEndpointMeta = {
	'users.upsert': {
		riskLevel: 'write',
		description:
			'Create or update a user by identifier or email, with properties, companies, relationships and topic preferences; queued, not applied at once',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a user along with their relationships and events; queued, and not reversible',
	},
	'companies.upsert': {
		riskLevel: 'write',
		description:
			'Create or update a company by identifier, with a name and custom properties',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a company, leaving its users in place; only the relationships go',
	},
	'relationships.upsert': {
		riskLevel: 'write',
		description:
			'Tie a user to a company, with properties on the relationship such as a role',
	},
	'relationships.delete': {
		riskLevel: 'write',
		description:
			'Unlink one user from one company, leaving both objects in place',
	},
	'events.create': {
		riskLevel: 'write',
		description:
			'Record an event against a user, a company or both, with properties and an optional past timestamp',
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Queue a transactional email or in-app message, from a template or with an inline subject and body',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof userlistEndpointsNested>;

export type BaseUserlistPlugin<T extends UserlistPluginOptions> = CorsairPlugin<
	'userlist',
	typeof UserlistSchema,
	typeof userlistEndpointsNested,
	typeof UserlistWebhooks,
	T,
	typeof defaultAuthType
>;

export type InternalUserlistPlugin = BaseUserlistPlugin<UserlistPluginOptions>;

export type ExternalUserlistPlugin<T extends UserlistPluginOptions> =
	BaseUserlistPlugin<T>;

export function userlist<const T extends UserlistPluginOptions>(
	incomingOptions: UserlistPluginOptions & T = {} as UserlistPluginOptions & T,
): ExternalUserlistPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'userlist',
		schema: UserlistSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: userlistEndpointsNested,
		webhooks: UserlistWebhooks,
		endpointMeta: userlistEndpointMeta,
		endpointSchemas: userlistEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			// The Push API key is not the webhook secret, so the matcher only
			// checks that the body names a topic this plugin handles.
			const body =
				typeof request.body === 'string'
					? (() => {
							try {
								// unknown: parsed just to read `name`.
								return JSON.parse(request.body) as unknown;
							} catch {
								return undefined;
							}
						})()
					: request.body;
			if (typeof body !== 'object' || body === null) return false;
			const name = (body as { name?: unknown }).name;
			return (
				typeof name === 'string' &&
				(USERLIST_WEBHOOK_EVENTS as readonly string[]).includes(name)
			);
		},
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: UserlistKeyBuilderContext, source) => {
			// A delivery is verified with its subscription's signing secret, which is
			// not the Push key. Returning nothing here made every delivery throw before
			// its handler ran.
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				throw new AuthMissingError('userlist', ctx.authType ?? 'api_key');
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('userlist', ctx.authType ?? 'api_key');
		},
	} satisfies InternalUserlistPlugin;
}

export {
	isUserlistFailure,
	USERLIST_AUTH_SCHEME,
	USERLIST_PUSH_API_BASE,
	UserlistAPIError,
} from './client';
export type {
	CompaniesDeleteInput,
	CompaniesUpsertInput,
	EventsCreateInput,
	MessagesSendInput,
	RelationshipsDeleteInput,
	RelationshipsUpsertInput,
	UserlistAcknowledgement,
	UserlistEndpointInputs,
	UserlistEndpointOutputs,
	UsersDeleteInput,
	UsersUpsertInput,
} from './endpoints/types';

export type { UserlistWebhookEvent } from './webhooks/types';
export {
	createUserlistMatch,
	USERLIST_WEBHOOK_EVENTS,
	verifyUserlistWebhookSignature,
} from './webhooks/types';
