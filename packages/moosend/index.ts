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
import { Lists, Subscribers } from './endpoints';
import type {
	MoosendEndpointInputs,
	MoosendEndpointOutputs,
} from './endpoints/types';
import {
	MoosendEndpointInputSchemas,
	MoosendEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MoosendSchema } from './schema';

export type MoosendPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Moosend API key, from account settings. */
	key?: string;
	hooks?: InternalMoosendPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof moosendEndpointsNested>;
};

export type MoosendContext = CorsairPluginContext<
	typeof MoosendSchema,
	MoosendPluginOptions
>;

export type MoosendKeyBuilderContext = KeyBuilderContext<MoosendPluginOptions>;

export type MoosendBoundEndpoints = BindEndpoints<
	typeof moosendEndpointsNested
>;

type MoosendEndpoint<K extends keyof MoosendEndpointOutputs> = CorsairEndpoint<
	MoosendContext,
	MoosendEndpointInputs[K],
	MoosendEndpointOutputs[K]
>;

export type MoosendEndpoints = {
	listsList: MoosendEndpoint<'listsList'>;
	listsListPaged: MoosendEndpoint<'listsListPaged'>;
	listsGet: MoosendEndpoint<'listsGet'>;
	listsCreate: MoosendEndpoint<'listsCreate'>;
	listsUpdate: MoosendEndpoint<'listsUpdate'>;
	listsDelete: MoosendEndpoint<'listsDelete'>;
	subscribersList: MoosendEndpoint<'subscribersList'>;
	subscribersGetByEmail: MoosendEndpoint<'subscribersGetByEmail'>;
	subscribersGetById: MoosendEndpoint<'subscribersGetById'>;
	subscribersSubscribe: MoosendEndpoint<'subscribersSubscribe'>;
	subscribersSubscribeMany: MoosendEndpoint<'subscribersSubscribeMany'>;
	subscribersUpdate: MoosendEndpoint<'subscribersUpdate'>;
	subscribersUnsubscribe: MoosendEndpoint<'subscribersUnsubscribe'>;
	subscribersRemove: MoosendEndpoint<'subscribersRemove'>;
};

const moosendEndpointsNested = {
	lists: {
		list: Lists.list,
		listPaged: Lists.listPaged,
		get: Lists.get,
		create: Lists.create,
		update: Lists.update,
		delete: Lists.remove,
	},
	subscribers: {
		list: Subscribers.list,
		getByEmail: Subscribers.getByEmail,
		getById: Subscribers.getById,
		subscribe: Subscribers.subscribe,
		subscribeMany: Subscribers.subscribeMany,
		update: Subscribers.update,
		unsubscribe: Subscribers.unsubscribe,
		remove: Subscribers.remove,
	},
} as const;

export const moosendEndpointSchemas = {
	'lists.list': {
		input: MoosendEndpointInputSchemas.listsList,
		output: MoosendEndpointOutputSchemas.listsList,
	},
	'lists.listPaged': {
		input: MoosendEndpointInputSchemas.listsListPaged,
		output: MoosendEndpointOutputSchemas.listsListPaged,
	},
	'lists.get': {
		input: MoosendEndpointInputSchemas.listsGet,
		output: MoosendEndpointOutputSchemas.listsGet,
	},
	'lists.create': {
		input: MoosendEndpointInputSchemas.listsCreate,
		output: MoosendEndpointOutputSchemas.listsCreate,
	},
	'lists.update': {
		input: MoosendEndpointInputSchemas.listsUpdate,
		output: MoosendEndpointOutputSchemas.listsUpdate,
	},
	'lists.delete': {
		input: MoosendEndpointInputSchemas.listsDelete,
		output: MoosendEndpointOutputSchemas.listsDelete,
	},
	'subscribers.list': {
		input: MoosendEndpointInputSchemas.subscribersList,
		output: MoosendEndpointOutputSchemas.subscribersList,
	},
	'subscribers.getByEmail': {
		input: MoosendEndpointInputSchemas.subscribersGetByEmail,
		output: MoosendEndpointOutputSchemas.subscribersGetByEmail,
	},
	'subscribers.getById': {
		input: MoosendEndpointInputSchemas.subscribersGetById,
		output: MoosendEndpointOutputSchemas.subscribersGetById,
	},
	'subscribers.subscribe': {
		input: MoosendEndpointInputSchemas.subscribersSubscribe,
		output: MoosendEndpointOutputSchemas.subscribersSubscribe,
	},
	'subscribers.subscribeMany': {
		input: MoosendEndpointInputSchemas.subscribersSubscribeMany,
		output: MoosendEndpointOutputSchemas.subscribersSubscribeMany,
	},
	'subscribers.update': {
		input: MoosendEndpointInputSchemas.subscribersUpdate,
		output: MoosendEndpointOutputSchemas.subscribersUpdate,
	},
	'subscribers.unsubscribe': {
		input: MoosendEndpointInputSchemas.subscribersUnsubscribe,
		output: MoosendEndpointOutputSchemas.subscribersUnsubscribe,
	},
	'subscribers.remove': {
		input: MoosendEndpointInputSchemas.subscribersRemove,
		output: MoosendEndpointOutputSchemas.subscribersRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof moosendEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const moosendEndpointMeta = {
	'lists.list': {
		riskLevel: 'read',
		description:
			'List every active mailing list in the account, with subscriber statistics and custom fields',
	},
	'lists.listPaged': {
		riskLevel: 'read',
		description: 'List mailing lists one page at a time',
	},
	'lists.get': {
		riskLevel: 'read',
		description:
			'Read one mailing list with its custom fields, optionally without subscriber statistics',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create an empty mailing list',
	},
	'lists.update': {
		riskLevel: 'write',
		description: 'Update a mailing list name and confirmation pages',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a mailing list and its subscriber data; cannot be undone',
	},
	'subscribers.list': {
		riskLevel: 'read',
		description:
			'List a mailing list by subscriber status (subscribed, unsubscribed or cleaned), one page at a time',
	},
	'subscribers.getByEmail': {
		riskLevel: 'read',
		description: 'Find a subscriber by email address in one mailing list',
	},
	'subscribers.getById': {
		riskLevel: 'read',
		description: 'Find a subscriber by its unique id in one mailing list',
	},
	'subscribers.subscribe': {
		riskLevel: 'write',
		description:
			'Add a subscriber, updating the existing entry when the email is already on the list',
	},
	'subscribers.subscribeMany': {
		riskLevel: 'write',
		description:
			'Add many subscribers in one call; invalid addresses are skipped silently by Moosend',
	},
	'subscribers.update': {
		riskLevel: 'write',
		description: "Update a subscriber's email, name and custom fields",
	},
	'subscribers.unsubscribe': {
		riskLevel: 'write',
		description:
			'Unsubscribe an email from one mailing list, moving it to the suppression list; subscribe adds it back',
	},
	'subscribers.remove': {
		riskLevel: 'destructive',
		description:
			'Remove a subscriber from the mailing list permanently, without the suppression list',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof moosendEndpointsNested>;

export type BaseMoosendPlugin<T extends MoosendPluginOptions> = CorsairPlugin<
	'moosend',
	typeof MoosendSchema,
	typeof moosendEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalMoosendPlugin = BaseMoosendPlugin<MoosendPluginOptions>;

export type ExternalMoosendPlugin<T extends MoosendPluginOptions> =
	BaseMoosendPlugin<T>;

export function moosend<const T extends MoosendPluginOptions>(
	incomingOptions: MoosendPluginOptions & T = {} as MoosendPluginOptions & T,
): ExternalMoosendPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'moosend',
		schema: MoosendSchema,
		options: options,
		hooks: options.hooks,
		endpoints: moosendEndpointsNested,
		webhooks: {},
		endpointMeta: moosendEndpointMeta,
		endpointSchemas: moosendEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MoosendKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('moosend', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMoosendPlugin;
}

export { MoosendAPIError } from './client';

export type {
	ListsListInput,
	ListsListPagedInput,
	ListsListPagedResponse,
	ListsListResponse,
	ListsUpsertInput,
	MailingList,
	MailingListGetInput,
	MailingListResponse,
	MoosendEndpointInputs,
	MoosendEndpointOutputs,
	Subscriber,
	SubscriberByIdInput,
	SubscriberGetInput,
	SubscriberResponse,
	SubscribersListInput,
	SubscribersListResponse,
	SubscribersUpsertManyInput,
	SubscribersUpsertManyResponse,
	SubscriberUnsubscribeInput,
	SubscriberUpdateInput,
	SubscriberUpsertInput,
} from './endpoints/types';
