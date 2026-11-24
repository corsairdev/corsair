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
import {
	Campaigns,
	Lists,
	Segments,
	Senders,
	Subscribers,
	Transactional,
} from './endpoints';
import { moosendEndpointMeta as endpointMeta } from './endpoints/meta';
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
	/** The Moosend API key, from Settings > API key. */
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

export type MoosendEndpoints = {
	[K in keyof MoosendEndpointOutputs]: CorsairEndpoint<
		MoosendContext,
		MoosendEndpointInputs[K],
		MoosendEndpointOutputs[K]
	>;
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
	customFields: {
		create: Lists.createCustomField,
		update: Lists.updateCustomField,
		delete: Lists.removeCustomField,
	},
	subscribers: {
		list: Subscribers.list,
		getByEmail: Subscribers.getByEmail,
		getById: Subscribers.getById,
		getByIdAnyList: Subscribers.getByIdAnyList,
		subscribe: Subscribers.subscribe,
		subscribeMany: Subscribers.subscribeMany,
		update: Subscribers.update,
		unsubscribe: Subscribers.unsubscribe,
		unsubscribeFromCampaign: Subscribers.unsubscribeFromCampaign,
		unsubscribeFromAccount: Subscribers.unsubscribeFromAccount,
		remove: Subscribers.remove,
		removeMany: Subscribers.removeMany,
		delete: Subscribers.deleteOne,
		deleteMany: Subscribers.deleteMany,
		deleteFromAccount: Subscribers.deleteFromAccount,
		addTags: Subscribers.addTags,
		removeTags: Subscribers.removeTags,
	},
	segments: {
		list: Segments.list,
		get: Segments.get,
		members: Segments.members,
		create: Segments.create,
		update: Segments.update,
		addCriteria: Segments.addCriteria,
		updateCriteria: Segments.updateCriteria,
		delete: Segments.remove,
	},
	campaigns: {
		list: Campaigns.list,
		get: Campaigns.get,
		create: Campaigns.create,
		update: Campaigns.update,
		clone: Campaigns.clone,
		delete: Campaigns.remove,
		send: Campaigns.send,
		sendTest: Campaigns.sendTest,
		schedule: Campaigns.schedule,
		unschedule: Campaigns.unschedule,
		summary: Campaigns.summary,
		abSummary: Campaigns.abSummary,
		stats: Campaigns.stats,
		activityByLocation: Campaigns.activityByLocation,
		linkActivity: Campaigns.linkActivity,
	},
	senders: {
		list: Senders.list,
		get: Senders.get,
	},
	transactional: {
		send: Transactional.send,
	},
} as const;

const schemas = <K extends keyof typeof MoosendEndpointInputSchemas>(key: K) =>
	({
		input: MoosendEndpointInputSchemas[key],
		output: MoosendEndpointOutputSchemas[key],
	}) as const;

// 52 operations, one per Moosend v3 route (campaigns.list covers the
// three campaign list routes).
export const moosendEndpointSchemas = {
	'lists.list': schemas('listsList'),
	'lists.listPaged': schemas('listsListPaged'),
	'lists.get': schemas('listsGet'),
	'lists.create': schemas('listsCreate'),
	'lists.update': schemas('listsUpdate'),
	'lists.delete': schemas('listsDelete'),
	'customFields.create': schemas('customFieldsCreate'),
	'customFields.update': schemas('customFieldsUpdate'),
	'customFields.delete': schemas('customFieldsDelete'),
	'subscribers.list': schemas('subscribersList'),
	'subscribers.getByEmail': schemas('subscribersGetByEmail'),
	'subscribers.getById': schemas('subscribersGetById'),
	'subscribers.getByIdAnyList': schemas('subscribersGetByIdAnyList'),
	'subscribers.subscribe': schemas('subscribersSubscribe'),
	'subscribers.subscribeMany': schemas('subscribersSubscribeMany'),
	'subscribers.update': schemas('subscribersUpdate'),
	'subscribers.unsubscribe': schemas('subscribersUnsubscribe'),
	'subscribers.unsubscribeFromCampaign': schemas(
		'subscribersUnsubscribeFromCampaign',
	),
	'subscribers.unsubscribeFromAccount': schemas(
		'subscribersUnsubscribeFromAccount',
	),
	'subscribers.remove': schemas('subscribersRemove'),
	'subscribers.removeMany': schemas('subscribersRemoveMany'),
	'subscribers.delete': schemas('subscribersDelete'),
	'subscribers.deleteMany': schemas('subscribersDeleteMany'),
	'subscribers.deleteFromAccount': schemas('subscribersDeleteFromAccount'),
	'subscribers.addTags': schemas('subscribersAddTags'),
	'subscribers.removeTags': schemas('subscribersRemoveTags'),
	'segments.list': schemas('segmentsList'),
	'segments.get': schemas('segmentsGet'),
	'segments.members': schemas('segmentsMembers'),
	'segments.create': schemas('segmentsCreate'),
	'segments.update': schemas('segmentsUpdate'),
	'segments.addCriteria': schemas('segmentsAddCriteria'),
	'segments.updateCriteria': schemas('segmentsUpdateCriteria'),
	'segments.delete': schemas('segmentsDelete'),
	'campaigns.list': schemas('campaignsList'),
	'campaigns.get': schemas('campaignsGet'),
	'campaigns.create': schemas('campaignsCreate'),
	'campaigns.update': schemas('campaignsUpdate'),
	'campaigns.clone': schemas('campaignsClone'),
	'campaigns.delete': schemas('campaignsDelete'),
	'campaigns.send': schemas('campaignsSend'),
	'campaigns.sendTest': schemas('campaignsSendTest'),
	'campaigns.schedule': schemas('campaignsSchedule'),
	'campaigns.unschedule': schemas('campaignsUnschedule'),
	'campaigns.summary': schemas('campaignsSummary'),
	'campaigns.abSummary': schemas('campaignsAbSummary'),
	'campaigns.stats': schemas('campaignsStats'),
	'campaigns.activityByLocation': schemas('campaignsActivityByLocation'),
	'campaigns.linkActivity': schemas('campaignsLinkActivity'),
	'senders.list': schemas('sendersList'),
	'senders.get': schemas('sendersGet'),
	'transactional.send': schemas('transactionalSend'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof moosendEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const moosendEndpointMeta = endpointMeta satisfies RequiredPluginEndpointMeta<
	typeof moosendEndpointsNested
>;

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

export type {
	Campaign,
	MailingList,
	MoosendEndpointInputs,
	MoosendEndpointOutputs,
	Segment,
	Sender,
	Subscriber,
} from './endpoints/types';
