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
	eventsCreate,
	eventsGet,
	eventsList,
	listsAddProfiles,
	listsCreate,
	listsGet,
	listsList,
	listsProfiles,
	listsRemove,
	listsRemoveProfiles,
	listsUpdate,
	metricsAggregate,
	metricsGet,
	metricsList,
	profilesCreate,
	profilesGet,
	profilesList,
	profilesSubscribe,
	profilesUpdate,
	segmentsCreate,
	segmentsGet,
	segmentsList,
	segmentsProfiles,
	segmentsRemove,
	segmentsUpdate,
	tagGroupsCreate,
	tagGroupsList,
	tagGroupsRemove,
	tagsCreate,
	tagsGet,
	tagsList,
	tagsRemove,
	tagsUpdate,
	webhooksCreate,
	webhooksGet,
	webhooksList,
	webhooksRemove,
	webhooksUpdate,
	webhookTopicsList,
} from './endpoints';
import type {
	KlaviyoEndpointInputs,
	KlaviyoEndpointOutputs,
} from './endpoints/types';
import {
	KlaviyoEndpointInputSchemas,
	KlaviyoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KlaviyoSchema } from './schema';

export type KlaviyoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalKlaviyoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof klaviyoEndpointsNested>;
};

export type KlaviyoContext = CorsairPluginContext<
	typeof KlaviyoSchema,
	KlaviyoPluginOptions
>;

export type KlaviyoKeyBuilderContext = KeyBuilderContext<KlaviyoPluginOptions>;

export type KlaviyoBoundEndpoints = BindEndpoints<
	typeof klaviyoEndpointsNested
>;

type KlaviyoEndpoint<K extends keyof KlaviyoEndpointOutputs> = CorsairEndpoint<
	KlaviyoContext,
	KlaviyoEndpointInputs[K],
	KlaviyoEndpointOutputs[K]
>;

export type KlaviyoEndpoints = {
	profilesList: KlaviyoEndpoint<'profilesList'>;
	profilesGet: KlaviyoEndpoint<'profilesGet'>;
	profilesCreate: KlaviyoEndpoint<'profilesCreate'>;
	profilesUpdate: KlaviyoEndpoint<'profilesUpdate'>;
	profilesSubscribe: KlaviyoEndpoint<'profilesSubscribe'>;
	listsList: KlaviyoEndpoint<'listsList'>;
	listsGet: KlaviyoEndpoint<'listsGet'>;
	listsCreate: KlaviyoEndpoint<'listsCreate'>;
	listsUpdate: KlaviyoEndpoint<'listsUpdate'>;
	listsRemove: KlaviyoEndpoint<'listsRemove'>;
	listsProfiles: KlaviyoEndpoint<'listsProfiles'>;
	listsAddProfiles: KlaviyoEndpoint<'listsAddProfiles'>;
	listsRemoveProfiles: KlaviyoEndpoint<'listsRemoveProfiles'>;
	segmentsList: KlaviyoEndpoint<'segmentsList'>;
	segmentsGet: KlaviyoEndpoint<'segmentsGet'>;
	segmentsCreate: KlaviyoEndpoint<'segmentsCreate'>;
	segmentsUpdate: KlaviyoEndpoint<'segmentsUpdate'>;
	segmentsRemove: KlaviyoEndpoint<'segmentsRemove'>;
	segmentsProfiles: KlaviyoEndpoint<'segmentsProfiles'>;
	eventsList: KlaviyoEndpoint<'eventsList'>;
	eventsGet: KlaviyoEndpoint<'eventsGet'>;
	eventsCreate: KlaviyoEndpoint<'eventsCreate'>;
	metricsList: KlaviyoEndpoint<'metricsList'>;
	metricsGet: KlaviyoEndpoint<'metricsGet'>;
	metricsAggregate: KlaviyoEndpoint<'metricsAggregate'>;
	webhooksList: KlaviyoEndpoint<'webhooksList'>;
	webhooksGet: KlaviyoEndpoint<'webhooksGet'>;
	webhooksCreate: KlaviyoEndpoint<'webhooksCreate'>;
	webhooksUpdate: KlaviyoEndpoint<'webhooksUpdate'>;
	webhooksRemove: KlaviyoEndpoint<'webhooksRemove'>;
	webhookTopicsList: KlaviyoEndpoint<'webhookTopicsList'>;
	tagsList: KlaviyoEndpoint<'tagsList'>;
	tagsGet: KlaviyoEndpoint<'tagsGet'>;
	tagsCreate: KlaviyoEndpoint<'tagsCreate'>;
	tagsUpdate: KlaviyoEndpoint<'tagsUpdate'>;
	tagsRemove: KlaviyoEndpoint<'tagsRemove'>;
	tagGroupsList: KlaviyoEndpoint<'tagGroupsList'>;
	tagGroupsCreate: KlaviyoEndpoint<'tagGroupsCreate'>;
	tagGroupsRemove: KlaviyoEndpoint<'tagGroupsRemove'>;
};

const klaviyoEndpointsNested = {
	profiles: {
		list: profilesList,
		get: profilesGet,
		create: profilesCreate,
		update: profilesUpdate,
		subscribe: profilesSubscribe,
	},
	lists: {
		list: listsList,
		get: listsGet,
		create: listsCreate,
		update: listsUpdate,
		remove: listsRemove,
		profiles: listsProfiles,
		addProfiles: listsAddProfiles,
		removeProfiles: listsRemoveProfiles,
	},
	segments: {
		list: segmentsList,
		get: segmentsGet,
		create: segmentsCreate,
		update: segmentsUpdate,
		remove: segmentsRemove,
		profiles: segmentsProfiles,
	},
	events: {
		list: eventsList,
		get: eventsGet,
		create: eventsCreate,
	},
	metrics: {
		list: metricsList,
		get: metricsGet,
		aggregate: metricsAggregate,
	},
	webhooks: {
		list: webhooksList,
		get: webhooksGet,
		create: webhooksCreate,
		update: webhooksUpdate,
		remove: webhooksRemove,
	},
	webhookTopics: {
		list: webhookTopicsList,
	},
	tags: {
		list: tagsList,
		get: tagsGet,
		create: tagsCreate,
		update: tagsUpdate,
		remove: tagsRemove,
	},
	tagGroups: {
		list: tagGroupsList,
		create: tagGroupsCreate,
		remove: tagGroupsRemove,
	},
} as const;

export const klaviyoEndpointSchemas = {
	'profiles.list': {
		input: KlaviyoEndpointInputSchemas.profilesList,
		output: KlaviyoEndpointOutputSchemas.profilesList,
	},
	'profiles.get': {
		input: KlaviyoEndpointInputSchemas.profilesGet,
		output: KlaviyoEndpointOutputSchemas.profilesGet,
	},
	'profiles.create': {
		input: KlaviyoEndpointInputSchemas.profilesCreate,
		output: KlaviyoEndpointOutputSchemas.profilesCreate,
	},
	'profiles.update': {
		input: KlaviyoEndpointInputSchemas.profilesUpdate,
		output: KlaviyoEndpointOutputSchemas.profilesUpdate,
	},
	'profiles.subscribe': {
		input: KlaviyoEndpointInputSchemas.profilesSubscribe,
		output: KlaviyoEndpointOutputSchemas.profilesSubscribe,
	},
	'lists.list': {
		input: KlaviyoEndpointInputSchemas.listsList,
		output: KlaviyoEndpointOutputSchemas.listsList,
	},
	'lists.get': {
		input: KlaviyoEndpointInputSchemas.listsGet,
		output: KlaviyoEndpointOutputSchemas.listsGet,
	},
	'lists.create': {
		input: KlaviyoEndpointInputSchemas.listsCreate,
		output: KlaviyoEndpointOutputSchemas.listsCreate,
	},
	'lists.update': {
		input: KlaviyoEndpointInputSchemas.listsUpdate,
		output: KlaviyoEndpointOutputSchemas.listsUpdate,
	},
	'lists.remove': {
		input: KlaviyoEndpointInputSchemas.listsRemove,
		output: KlaviyoEndpointOutputSchemas.listsRemove,
	},
	'lists.profiles': {
		input: KlaviyoEndpointInputSchemas.listsProfiles,
		output: KlaviyoEndpointOutputSchemas.listsProfiles,
	},
	'lists.addProfiles': {
		input: KlaviyoEndpointInputSchemas.listsAddProfiles,
		output: KlaviyoEndpointOutputSchemas.listsAddProfiles,
	},
	'lists.removeProfiles': {
		input: KlaviyoEndpointInputSchemas.listsRemoveProfiles,
		output: KlaviyoEndpointOutputSchemas.listsRemoveProfiles,
	},
	'segments.list': {
		input: KlaviyoEndpointInputSchemas.segmentsList,
		output: KlaviyoEndpointOutputSchemas.segmentsList,
	},
	'segments.get': {
		input: KlaviyoEndpointInputSchemas.segmentsGet,
		output: KlaviyoEndpointOutputSchemas.segmentsGet,
	},
	'segments.create': {
		input: KlaviyoEndpointInputSchemas.segmentsCreate,
		output: KlaviyoEndpointOutputSchemas.segmentsCreate,
	},
	'segments.update': {
		input: KlaviyoEndpointInputSchemas.segmentsUpdate,
		output: KlaviyoEndpointOutputSchemas.segmentsUpdate,
	},
	'segments.remove': {
		input: KlaviyoEndpointInputSchemas.segmentsRemove,
		output: KlaviyoEndpointOutputSchemas.segmentsRemove,
	},
	'segments.profiles': {
		input: KlaviyoEndpointInputSchemas.segmentsProfiles,
		output: KlaviyoEndpointOutputSchemas.segmentsProfiles,
	},
	'events.list': {
		input: KlaviyoEndpointInputSchemas.eventsList,
		output: KlaviyoEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: KlaviyoEndpointInputSchemas.eventsGet,
		output: KlaviyoEndpointOutputSchemas.eventsGet,
	},
	'events.create': {
		input: KlaviyoEndpointInputSchemas.eventsCreate,
		output: KlaviyoEndpointOutputSchemas.eventsCreate,
	},
	'metrics.list': {
		input: KlaviyoEndpointInputSchemas.metricsList,
		output: KlaviyoEndpointOutputSchemas.metricsList,
	},
	'metrics.get': {
		input: KlaviyoEndpointInputSchemas.metricsGet,
		output: KlaviyoEndpointOutputSchemas.metricsGet,
	},
	'metrics.aggregate': {
		input: KlaviyoEndpointInputSchemas.metricsAggregate,
		output: KlaviyoEndpointOutputSchemas.metricsAggregate,
	},
	'webhooks.list': {
		input: KlaviyoEndpointInputSchemas.webhooksList,
		output: KlaviyoEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: KlaviyoEndpointInputSchemas.webhooksGet,
		output: KlaviyoEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: KlaviyoEndpointInputSchemas.webhooksCreate,
		output: KlaviyoEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: KlaviyoEndpointInputSchemas.webhooksUpdate,
		output: KlaviyoEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.remove': {
		input: KlaviyoEndpointInputSchemas.webhooksRemove,
		output: KlaviyoEndpointOutputSchemas.webhooksRemove,
	},
	'webhookTopics.list': {
		input: KlaviyoEndpointInputSchemas.webhookTopicsList,
		output: KlaviyoEndpointOutputSchemas.webhookTopicsList,
	},
	'tags.list': {
		input: KlaviyoEndpointInputSchemas.tagsList,
		output: KlaviyoEndpointOutputSchemas.tagsList,
	},
	'tags.get': {
		input: KlaviyoEndpointInputSchemas.tagsGet,
		output: KlaviyoEndpointOutputSchemas.tagsGet,
	},
	'tags.create': {
		input: KlaviyoEndpointInputSchemas.tagsCreate,
		output: KlaviyoEndpointOutputSchemas.tagsCreate,
	},
	'tags.update': {
		input: KlaviyoEndpointInputSchemas.tagsUpdate,
		output: KlaviyoEndpointOutputSchemas.tagsUpdate,
	},
	'tags.remove': {
		input: KlaviyoEndpointInputSchemas.tagsRemove,
		output: KlaviyoEndpointOutputSchemas.tagsRemove,
	},
	'tagGroups.list': {
		input: KlaviyoEndpointInputSchemas.tagGroupsList,
		output: KlaviyoEndpointOutputSchemas.tagGroupsList,
	},
	'tagGroups.create': {
		input: KlaviyoEndpointInputSchemas.tagGroupsCreate,
		output: KlaviyoEndpointOutputSchemas.tagGroupsCreate,
	},
	'tagGroups.remove': {
		input: KlaviyoEndpointInputSchemas.tagGroupsRemove,
		output: KlaviyoEndpointOutputSchemas.tagGroupsRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof klaviyoEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const klaviyoEndpointMeta = {
	'profiles.list': {
		riskLevel: 'read',
		description:
			'Search profiles with a Klaviyo filter expression, sorted and cursor-paged; returns each profile with its attributes and subscription state',
	},
	'profiles.get': {
		riskLevel: 'read',
		description:
			'Read one profile by id, optionally including its conversations or push tokens',
	},
	'profiles.create': {
		riskLevel: 'write',
		description:
			'Create a profile from an email, phone number or external id, with names, location and custom properties; Klaviyo merges a duplicate onto the existing profile',
	},
	'profiles.update': {
		riskLevel: 'write',
		description:
			'Change a profile name, location, custom properties or identifiers by id',
	},
	'profiles.subscribe': {
		riskLevel: 'write',
		description:
			'Subscribe a profile to a list over email or SMS; this grants marketing consent through a queued bulk job, so it confirms the request was accepted rather than returning the profile',
	},
	'lists.list': {
		riskLevel: 'read',
		description:
			'List the marketing lists on the account, filtered and cursor-paged',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Read one marketing list by id, with its name and timestamps',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create an empty marketing list with a name',
	},
	'lists.update': {
		riskLevel: 'write',
		description: 'Rename an existing list',
	},
	'lists.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a list; the profiles on it stay on the account but lose that membership, and the list cannot be restored',
		irreversible: true,
	},
	'lists.profiles': {
		riskLevel: 'read',
		description: 'Page the profiles that belong to a list',
	},
	'lists.addProfiles': {
		riskLevel: 'write',
		description:
			'Add up to 1000 profiles to a list by id; adding does not change their subscription consent',
	},
	'lists.removeProfiles': {
		riskLevel: 'destructive',
		description:
			'Remove up to 1000 profiles from a list; their submission or consent elsewhere is untouched',
		irreversible: true,
	},
	'segments.list': {
		riskLevel: 'read',
		description: 'List the segments on the account, filtered and cursor-paged',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Read one segment by id, with its active flag',
	},
	'segments.create': {
		riskLevel: 'write',
		description:
			'Create a segment from a condition group; Klaviyo evaluates it server-side, so the segment is not immediately populated',
	},
	'segments.update': {
		riskLevel: 'write',
		description: 'Change a segment name or its condition group',
	},
	'segments.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a segment; its definition is lost and cannot be restored',
		irreversible: true,
	},
	'segments.profiles': {
		riskLevel: 'read',
		description: 'Page the profiles that currently match a segment',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'Page the events recorded for the account, filtered by metric, profile or time',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Read one event by id, with its properties and timestamp',
	},
	'events.create': {
		riskLevel: 'write',
		description:
			'Record an event against a profile by metric name; Klaviyo creates the metric on first use, and the event can trigger flows',
	},
	'metrics.list': {
		riskLevel: 'read',
		description:
			'List the metrics defined on the account, such as Placed Order',
	},
	'metrics.get': {
		riskLevel: 'read',
		description: 'Read one metric by id',
	},
	'metrics.aggregate': {
		riskLevel: 'read',
		description:
			'Aggregate a metric into time buckets, such as a daily count over a date range, optionally grouped by a dimension',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhooks configured on the account',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook by id',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Create a webhook with an endpoint URL, a shared secret and one or more topics; Klaviyo signs each delivery with that secret',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			'Change a webhook name, description, endpoint URL or enabled flag',
	},
	'webhooks.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a webhook; deliveries stop immediately and it cannot be restored',
		irreversible: true,
	},
	'webhookTopics.list': {
		riskLevel: 'read',
		description:
			'List the topics a webhook can subscribe to, such as Placed Order',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List the tags on the account, filtered and cursor-paged',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Read one tag by id, with its name and timestamps',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a tag with a name, unique within its tag group',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Rename a tag; its group and attachments stay as they are',
	},
	'tags.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a tag; it detaches from every campaign, flow, list and segment that carried it',
		irreversible: true,
	},
	'tagGroups.list': {
		riskLevel: 'read',
		description:
			'List the tag groups, which namespace tags and can allow only one tag each',
	},
	'tagGroups.create': {
		riskLevel: 'write',
		description:
			'Create a tag group, optionally exclusive so only one of its tags applies',
	},
	'tagGroups.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a tag group; the tags inside it go with it and cannot be restored',
		irreversible: true,
	},
} as const satisfies RequiredPluginEndpointMeta<typeof klaviyoEndpointsNested>;

export type BaseKlaviyoPlugin<T extends KlaviyoPluginOptions> = CorsairPlugin<
	'klaviyo',
	typeof KlaviyoSchema,
	typeof klaviyoEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalKlaviyoPlugin = BaseKlaviyoPlugin<KlaviyoPluginOptions>;

export type ExternalKlaviyoPlugin<T extends KlaviyoPluginOptions> =
	BaseKlaviyoPlugin<T>;

export function klaviyo<const T extends KlaviyoPluginOptions>(
	incomingOptions: KlaviyoPluginOptions & T = {} as KlaviyoPluginOptions & T,
): ExternalKlaviyoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'klaviyo',
		schema: KlaviyoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: klaviyoEndpointsNested,
		// Klaviyo sends webhooks to a URL you register, signed with the
		// `secret_key` you set at creation. The REST API exposes no verifier and
		// the signature scheme is documented per-topic, so this plugin manages the
		// webhooks but does not receive them; `webhooks.*` covers the management.
		webhooks: {},
		endpointMeta: klaviyoEndpointMeta,
		endpointSchemas: klaviyoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KlaviyoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('klaviyo', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKlaviyoPlugin;
}

export { KlaviyoAPIError } from './client';

export type {
	EventsCreateInput,
	EventsGetInput,
	EventsListInput,
	EventsListResponse,
	KlaviyoEndpointInputs,
	KlaviyoEndpointOutputs,
	KlaviyoEvent,
	KlaviyoList,
	KlaviyoMetric,
	KlaviyoProfile,
	KlaviyoSegment,
	KlaviyoTag,
	KlaviyoTagGroup,
	KlaviyoWebhook,
	KlaviyoWebhookTopic,
	ListsAddProfilesInput,
	ListsCreateInput,
	ListsGetInput,
	ListsListInput,
	ListsListResponse,
	ListsProfilesInput,
	ListsRemoveInput,
	ListsRemoveProfilesInput,
	ListsUpdateInput,
	MetricAggregateInput,
	MetricAggregateResponse,
	MetricsGetInput,
	MetricsListInput,
	MetricsListResponse,
	ProfilesCreateInput,
	ProfilesGetInput,
	ProfilesListInput,
	ProfilesListResponse,
	ProfilesSubscribeInput,
	ProfilesUpdateInput,
	SegmentsCreateInput,
	SegmentsGetInput,
	SegmentsListInput,
	SegmentsListResponse,
	SegmentsProfilesInput,
	SegmentsRemoveInput,
	SegmentsUpdateInput,
	TagGroupsCreateInput,
	TagGroupsListInput,
	TagGroupsListResponse,
	TagGroupsRemoveInput,
	TagsCreateInput,
	TagsGetInput,
	TagsListInput,
	TagsListResponse,
	TagsRemoveInput,
	TagsUpdateInput,
	WebhooksCreateInput,
	WebhooksGetInput,
	WebhooksListInput,
	WebhooksListResponse,
	WebhooksRemoveInput,
	WebhooksUpdateInput,
	WebhookTopicsListInput,
	WebhookTopicsListResponse,
} from './endpoints/types';
