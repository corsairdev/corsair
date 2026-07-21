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
import { fetchMailchimpOAuthMetadata } from './client';
import {
	AccountEndpoints,
	CampaignsEndpoints,
	InterestCategoriesEndpoints,
	InterestsEndpoints,
	ListsEndpoints,
	MembersEndpoints,
	MergeFieldsEndpoints,
	SegmentsEndpoints,
	WebhooksEndpoints,
} from './endpoints';
import type {
	MailchimpEndpointInputs,
	MailchimpEndpointOutputs,
} from './endpoints/types';
import {
	MailchimpEndpointInputSchemas,
	MailchimpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MailchimpSchema } from './schema';
import { packMailchimpOAuthKey } from './utils';
import { MailchimpTriggerWebhooks } from './webhooks';
import { resolveMailchimpOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchMailchimpTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CampaignEvent,
	MailchimpWebhookOutputs,
	ProfileEvent,
	SubscribeEvent,
	UnsubscribeEvent,
} from './webhooks/types';
import {
	CampaignEventSchema,
	MailchimpWebhookTypes,
	ProfileEventSchema,
	parseMailchimpWebhookBody,
	SubscribeEventSchema,
	UnsubscribeEventSchema,
} from './webhooks/types';

export type MailchimpPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMailchimpPlugin['hooks'];
	webhookHooks?: InternalMailchimpPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailchimpEndpointsNested>;
};

export type MailchimpContext = CorsairPluginContext<
	typeof MailchimpSchema,
	MailchimpPluginOptions
>;

export type MailchimpKeyBuilderContext =
	KeyBuilderContext<MailchimpPluginOptions>;

export type MailchimpBoundEndpoints = BindEndpoints<
	typeof mailchimpEndpointsNested
>;

type MailchimpEndpoint<K extends keyof MailchimpEndpointOutputs> =
	CorsairEndpoint<
		MailchimpContext,
		MailchimpEndpointInputs[K],
		MailchimpEndpointOutputs[K]
	>;

export type MailchimpEndpoints = {
	accountPing: MailchimpEndpoint<'accountPing'>;
	accountRoot: MailchimpEndpoint<'accountRoot'>;
	listsList: MailchimpEndpoint<'listsList'>;
	listsGet: MailchimpEndpoint<'listsGet'>;
	listsCreate: MailchimpEndpoint<'listsCreate'>;
	listsUpdate: MailchimpEndpoint<'listsUpdate'>;
	listsRemove: MailchimpEndpoint<'listsRemove'>;
	membersList: MailchimpEndpoint<'membersList'>;
	membersGet: MailchimpEndpoint<'membersGet'>;
	membersUpsert: MailchimpEndpoint<'membersUpsert'>;
	membersAdd: MailchimpEndpoint<'membersAdd'>;
	membersUpdate: MailchimpEndpoint<'membersUpdate'>;
	membersArchive: MailchimpEndpoint<'membersArchive'>;
	membersRemove: MailchimpEndpoint<'membersRemove'>;
	membersSearch: MailchimpEndpoint<'membersSearch'>;
	membersListTags: MailchimpEndpoint<'membersListTags'>;
	membersUpdateTags: MailchimpEndpoint<'membersUpdateTags'>;
	segmentsList: MailchimpEndpoint<'segmentsList'>;
	segmentsGet: MailchimpEndpoint<'segmentsGet'>;
	segmentsCreate: MailchimpEndpoint<'segmentsCreate'>;
	segmentsUpdate: MailchimpEndpoint<'segmentsUpdate'>;
	segmentsRemove: MailchimpEndpoint<'segmentsRemove'>;
	segmentsListMembers: MailchimpEndpoint<'segmentsListMembers'>;
	segmentsAddMember: MailchimpEndpoint<'segmentsAddMember'>;
	segmentsRemoveMember: MailchimpEndpoint<'segmentsRemoveMember'>;
	mergeFieldsList: MailchimpEndpoint<'mergeFieldsList'>;
	mergeFieldsGet: MailchimpEndpoint<'mergeFieldsGet'>;
	mergeFieldsCreate: MailchimpEndpoint<'mergeFieldsCreate'>;
	mergeFieldsUpdate: MailchimpEndpoint<'mergeFieldsUpdate'>;
	mergeFieldsRemove: MailchimpEndpoint<'mergeFieldsRemove'>;
	interestCategoriesList: MailchimpEndpoint<'interestCategoriesList'>;
	interestCategoriesGet: MailchimpEndpoint<'interestCategoriesGet'>;
	interestCategoriesCreate: MailchimpEndpoint<'interestCategoriesCreate'>;
	interestCategoriesUpdate: MailchimpEndpoint<'interestCategoriesUpdate'>;
	interestCategoriesRemove: MailchimpEndpoint<'interestCategoriesRemove'>;
	interestsList: MailchimpEndpoint<'interestsList'>;
	interestsGet: MailchimpEndpoint<'interestsGet'>;
	interestsCreate: MailchimpEndpoint<'interestsCreate'>;
	interestsUpdate: MailchimpEndpoint<'interestsUpdate'>;
	interestsRemove: MailchimpEndpoint<'interestsRemove'>;
	campaignsList: MailchimpEndpoint<'campaignsList'>;
	campaignsGet: MailchimpEndpoint<'campaignsGet'>;
	campaignsCreate: MailchimpEndpoint<'campaignsCreate'>;
	campaignsUpdate: MailchimpEndpoint<'campaignsUpdate'>;
	campaignsRemove: MailchimpEndpoint<'campaignsRemove'>;
	campaignsGetContent: MailchimpEndpoint<'campaignsGetContent'>;
	campaignsSetContent: MailchimpEndpoint<'campaignsSetContent'>;
	campaignsSendTest: MailchimpEndpoint<'campaignsSendTest'>;
	campaignsSchedule: MailchimpEndpoint<'campaignsSchedule'>;
	campaignsUnschedule: MailchimpEndpoint<'campaignsUnschedule'>;
	campaignsSend: MailchimpEndpoint<'campaignsSend'>;
	webhooksList: MailchimpEndpoint<'webhooksList'>;
	webhooksGet: MailchimpEndpoint<'webhooksGet'>;
	webhooksCreate: MailchimpEndpoint<'webhooksCreate'>;
	webhooksUpdate: MailchimpEndpoint<'webhooksUpdate'>;
	webhooksRemove: MailchimpEndpoint<'webhooksRemove'>;
};

type MailchimpWebhook<
	K extends keyof MailchimpWebhookOutputs,
	TEvent,
> = CorsairWebhook<MailchimpContext, TEvent, MailchimpWebhookOutputs[K]>;

export type MailchimpWebhooks = {
	subscribe: MailchimpWebhook<'subscribe', SubscribeEvent>;
	unsubscribe: MailchimpWebhook<'unsubscribe', UnsubscribeEvent>;
	profile: MailchimpWebhook<'profile', ProfileEvent>;
	campaign: MailchimpWebhook<'campaign', CampaignEvent>;
};

export type MailchimpBoundWebhooks = BindWebhooks<
	typeof mailchimpWebhooksNested
>;

const mailchimpEndpointsNested = {
	account: {
		ping: AccountEndpoints.ping,
		root: AccountEndpoints.root,
	},
	lists: {
		list: ListsEndpoints.list,
		get: ListsEndpoints.get,
		create: ListsEndpoints.create,
		update: ListsEndpoints.update,
		remove: ListsEndpoints.remove,
	},
	members: {
		list: MembersEndpoints.list,
		get: MembersEndpoints.get,
		upsert: MembersEndpoints.upsert,
		add: MembersEndpoints.add,
		update: MembersEndpoints.update,
		archive: MembersEndpoints.archive,
		remove: MembersEndpoints.remove,
		search: MembersEndpoints.search,
		listTags: MembersEndpoints.listTags,
		updateTags: MembersEndpoints.updateTags,
	},
	segments: {
		list: SegmentsEndpoints.list,
		get: SegmentsEndpoints.get,
		create: SegmentsEndpoints.create,
		update: SegmentsEndpoints.update,
		remove: SegmentsEndpoints.remove,
		listMembers: SegmentsEndpoints.listMembers,
		addMember: SegmentsEndpoints.addMember,
		removeMember: SegmentsEndpoints.removeMember,
	},
	mergeFields: {
		list: MergeFieldsEndpoints.list,
		get: MergeFieldsEndpoints.get,
		create: MergeFieldsEndpoints.create,
		update: MergeFieldsEndpoints.update,
		remove: MergeFieldsEndpoints.remove,
	},
	interestCategories: {
		list: InterestCategoriesEndpoints.list,
		get: InterestCategoriesEndpoints.get,
		create: InterestCategoriesEndpoints.create,
		update: InterestCategoriesEndpoints.update,
		remove: InterestCategoriesEndpoints.remove,
	},
	interests: {
		list: InterestsEndpoints.list,
		get: InterestsEndpoints.get,
		create: InterestsEndpoints.create,
		update: InterestsEndpoints.update,
		remove: InterestsEndpoints.remove,
	},
	campaigns: {
		list: CampaignsEndpoints.list,
		get: CampaignsEndpoints.get,
		create: CampaignsEndpoints.create,
		update: CampaignsEndpoints.update,
		remove: CampaignsEndpoints.remove,
		getContent: CampaignsEndpoints.getContent,
		setContent: CampaignsEndpoints.setContent,
		sendTest: CampaignsEndpoints.sendTest,
		schedule: CampaignsEndpoints.schedule,
		unschedule: CampaignsEndpoints.unschedule,
		send: CampaignsEndpoints.send,
	},
	webhooks: {
		list: WebhooksEndpoints.list,
		get: WebhooksEndpoints.get,
		create: WebhooksEndpoints.create,
		update: WebhooksEndpoints.update,
		remove: WebhooksEndpoints.remove,
	},
} as const;

const mailchimpWebhooksNested = {
	subscribe: MailchimpTriggerWebhooks.subscribe,
	unsubscribe: MailchimpTriggerWebhooks.unsubscribe,
	profile: MailchimpTriggerWebhooks.profile,
	campaign: MailchimpTriggerWebhooks.campaign,
} as const;

export const mailchimpEndpointSchemas = {
	'account.ping': {
		input: MailchimpEndpointInputSchemas.accountPing,
		output: MailchimpEndpointOutputSchemas.accountPing,
	},
	'account.root': {
		input: MailchimpEndpointInputSchemas.accountRoot,
		output: MailchimpEndpointOutputSchemas.accountRoot,
	},
	'lists.list': {
		input: MailchimpEndpointInputSchemas.listsList,
		output: MailchimpEndpointOutputSchemas.listsList,
	},
	'lists.get': {
		input: MailchimpEndpointInputSchemas.listsGet,
		output: MailchimpEndpointOutputSchemas.listsGet,
	},
	'lists.create': {
		input: MailchimpEndpointInputSchemas.listsCreate,
		output: MailchimpEndpointOutputSchemas.listsCreate,
	},
	'lists.update': {
		input: MailchimpEndpointInputSchemas.listsUpdate,
		output: MailchimpEndpointOutputSchemas.listsUpdate,
	},
	'lists.remove': {
		input: MailchimpEndpointInputSchemas.listsRemove,
		output: MailchimpEndpointOutputSchemas.listsRemove,
	},
	'members.list': {
		input: MailchimpEndpointInputSchemas.membersList,
		output: MailchimpEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: MailchimpEndpointInputSchemas.membersGet,
		output: MailchimpEndpointOutputSchemas.membersGet,
	},
	'members.upsert': {
		input: MailchimpEndpointInputSchemas.membersUpsert,
		output: MailchimpEndpointOutputSchemas.membersUpsert,
	},
	'members.add': {
		input: MailchimpEndpointInputSchemas.membersAdd,
		output: MailchimpEndpointOutputSchemas.membersAdd,
	},
	'members.update': {
		input: MailchimpEndpointInputSchemas.membersUpdate,
		output: MailchimpEndpointOutputSchemas.membersUpdate,
	},
	'members.archive': {
		input: MailchimpEndpointInputSchemas.membersArchive,
		output: MailchimpEndpointOutputSchemas.membersArchive,
	},
	'members.remove': {
		input: MailchimpEndpointInputSchemas.membersRemove,
		output: MailchimpEndpointOutputSchemas.membersRemove,
	},
	'members.search': {
		input: MailchimpEndpointInputSchemas.membersSearch,
		output: MailchimpEndpointOutputSchemas.membersSearch,
	},
	'members.listTags': {
		input: MailchimpEndpointInputSchemas.membersListTags,
		output: MailchimpEndpointOutputSchemas.membersListTags,
	},
	'members.updateTags': {
		input: MailchimpEndpointInputSchemas.membersUpdateTags,
		output: MailchimpEndpointOutputSchemas.membersUpdateTags,
	},
	'segments.list': {
		input: MailchimpEndpointInputSchemas.segmentsList,
		output: MailchimpEndpointOutputSchemas.segmentsList,
	},
	'segments.get': {
		input: MailchimpEndpointInputSchemas.segmentsGet,
		output: MailchimpEndpointOutputSchemas.segmentsGet,
	},
	'segments.create': {
		input: MailchimpEndpointInputSchemas.segmentsCreate,
		output: MailchimpEndpointOutputSchemas.segmentsCreate,
	},
	'segments.update': {
		input: MailchimpEndpointInputSchemas.segmentsUpdate,
		output: MailchimpEndpointOutputSchemas.segmentsUpdate,
	},
	'segments.remove': {
		input: MailchimpEndpointInputSchemas.segmentsRemove,
		output: MailchimpEndpointOutputSchemas.segmentsRemove,
	},
	'segments.listMembers': {
		input: MailchimpEndpointInputSchemas.segmentsListMembers,
		output: MailchimpEndpointOutputSchemas.segmentsListMembers,
	},
	'segments.addMember': {
		input: MailchimpEndpointInputSchemas.segmentsAddMember,
		output: MailchimpEndpointOutputSchemas.segmentsAddMember,
	},
	'segments.removeMember': {
		input: MailchimpEndpointInputSchemas.segmentsRemoveMember,
		output: MailchimpEndpointOutputSchemas.segmentsRemoveMember,
	},
	'mergeFields.list': {
		input: MailchimpEndpointInputSchemas.mergeFieldsList,
		output: MailchimpEndpointOutputSchemas.mergeFieldsList,
	},
	'mergeFields.get': {
		input: MailchimpEndpointInputSchemas.mergeFieldsGet,
		output: MailchimpEndpointOutputSchemas.mergeFieldsGet,
	},
	'mergeFields.create': {
		input: MailchimpEndpointInputSchemas.mergeFieldsCreate,
		output: MailchimpEndpointOutputSchemas.mergeFieldsCreate,
	},
	'mergeFields.update': {
		input: MailchimpEndpointInputSchemas.mergeFieldsUpdate,
		output: MailchimpEndpointOutputSchemas.mergeFieldsUpdate,
	},
	'mergeFields.remove': {
		input: MailchimpEndpointInputSchemas.mergeFieldsRemove,
		output: MailchimpEndpointOutputSchemas.mergeFieldsRemove,
	},
	'interestCategories.list': {
		input: MailchimpEndpointInputSchemas.interestCategoriesList,
		output: MailchimpEndpointOutputSchemas.interestCategoriesList,
	},
	'interestCategories.get': {
		input: MailchimpEndpointInputSchemas.interestCategoriesGet,
		output: MailchimpEndpointOutputSchemas.interestCategoriesGet,
	},
	'interestCategories.create': {
		input: MailchimpEndpointInputSchemas.interestCategoriesCreate,
		output: MailchimpEndpointOutputSchemas.interestCategoriesCreate,
	},
	'interestCategories.update': {
		input: MailchimpEndpointInputSchemas.interestCategoriesUpdate,
		output: MailchimpEndpointOutputSchemas.interestCategoriesUpdate,
	},
	'interestCategories.remove': {
		input: MailchimpEndpointInputSchemas.interestCategoriesRemove,
		output: MailchimpEndpointOutputSchemas.interestCategoriesRemove,
	},
	'interests.list': {
		input: MailchimpEndpointInputSchemas.interestsList,
		output: MailchimpEndpointOutputSchemas.interestsList,
	},
	'interests.get': {
		input: MailchimpEndpointInputSchemas.interestsGet,
		output: MailchimpEndpointOutputSchemas.interestsGet,
	},
	'interests.create': {
		input: MailchimpEndpointInputSchemas.interestsCreate,
		output: MailchimpEndpointOutputSchemas.interestsCreate,
	},
	'interests.update': {
		input: MailchimpEndpointInputSchemas.interestsUpdate,
		output: MailchimpEndpointOutputSchemas.interestsUpdate,
	},
	'interests.remove': {
		input: MailchimpEndpointInputSchemas.interestsRemove,
		output: MailchimpEndpointOutputSchemas.interestsRemove,
	},
	'campaigns.list': {
		input: MailchimpEndpointInputSchemas.campaignsList,
		output: MailchimpEndpointOutputSchemas.campaignsList,
	},
	'campaigns.get': {
		input: MailchimpEndpointInputSchemas.campaignsGet,
		output: MailchimpEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.create': {
		input: MailchimpEndpointInputSchemas.campaignsCreate,
		output: MailchimpEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.update': {
		input: MailchimpEndpointInputSchemas.campaignsUpdate,
		output: MailchimpEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.remove': {
		input: MailchimpEndpointInputSchemas.campaignsRemove,
		output: MailchimpEndpointOutputSchemas.campaignsRemove,
	},
	'campaigns.getContent': {
		input: MailchimpEndpointInputSchemas.campaignsGetContent,
		output: MailchimpEndpointOutputSchemas.campaignsGetContent,
	},
	'campaigns.setContent': {
		input: MailchimpEndpointInputSchemas.campaignsSetContent,
		output: MailchimpEndpointOutputSchemas.campaignsSetContent,
	},
	'campaigns.sendTest': {
		input: MailchimpEndpointInputSchemas.campaignsSendTest,
		output: MailchimpEndpointOutputSchemas.campaignsSendTest,
	},
	'campaigns.schedule': {
		input: MailchimpEndpointInputSchemas.campaignsSchedule,
		output: MailchimpEndpointOutputSchemas.campaignsSchedule,
	},
	'campaigns.unschedule': {
		input: MailchimpEndpointInputSchemas.campaignsUnschedule,
		output: MailchimpEndpointOutputSchemas.campaignsUnschedule,
	},
	'campaigns.send': {
		input: MailchimpEndpointInputSchemas.campaignsSend,
		output: MailchimpEndpointOutputSchemas.campaignsSend,
	},
	'webhooks.list': {
		input: MailchimpEndpointInputSchemas.webhooksList,
		output: MailchimpEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: MailchimpEndpointInputSchemas.webhooksGet,
		output: MailchimpEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: MailchimpEndpointInputSchemas.webhooksCreate,
		output: MailchimpEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: MailchimpEndpointInputSchemas.webhooksUpdate,
		output: MailchimpEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.remove': {
		input: MailchimpEndpointInputSchemas.webhooksRemove,
		output: MailchimpEndpointOutputSchemas.webhooksRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailchimpEndpointsNested
>;

const mailchimpWebhookSchemas = {
	subscribe: {
		description: 'Fired when a subscriber joins a list.',
		payload: SubscribeEventSchema,
		response: SubscribeEventSchema,
	},
	unsubscribe: {
		description: 'Fired when a subscriber leaves a list.',
		payload: UnsubscribeEventSchema,
		response: UnsubscribeEventSchema,
	},
	profile: {
		description: 'Fired when a subscriber updates their profile.',
		payload: ProfileEventSchema,
		response: ProfileEventSchema,
	},
	campaign: {
		description: 'Fired when a campaign is sent.',
		payload: CampaignEventSchema,
		response: CampaignEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof mailchimpWebhooksNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const mailchimpEndpointMeta = {
	'account.ping': { riskLevel: 'read', description: 'Health-check the API.' },
	'account.root': {
		riskLevel: 'read',
		description: 'Get account and API root information.',
	},
	'lists.list': { riskLevel: 'read', description: 'List all audiences.' },
	'lists.get': { riskLevel: 'read', description: 'Get an audience by id.' },
	'lists.create': { riskLevel: 'write', description: 'Create an audience.' },
	'lists.update': {
		riskLevel: 'write',
		description: 'Update audience settings.',
	},
	'lists.remove': {
		riskLevel: 'destructive',
		description: 'Delete an audience.',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List members of an audience.',
	},
	'members.get': { riskLevel: 'read', description: 'Get a member.' },
	'members.upsert': {
		riskLevel: 'write',
		description: 'Add or update a member (idempotent).',
	},
	'members.add': { riskLevel: 'write', description: 'Add a new member.' },
	'members.update': { riskLevel: 'write', description: 'Update a member.' },
	'members.archive': {
		riskLevel: 'destructive',
		description: 'Archive a member.',
	},
	'members.remove': {
		riskLevel: 'destructive',
		description: 'Permanently delete a member.',
	},
	'members.search': { riskLevel: 'read', description: 'Search members.' },
	'members.listTags': {
		riskLevel: 'read',
		description: "List a member's tags.",
	},
	'members.updateTags': {
		riskLevel: 'write',
		description: "Add or remove a member's tags.",
	},
	'segments.list': { riskLevel: 'read', description: 'List segments.' },
	'segments.get': { riskLevel: 'read', description: 'Get a segment.' },
	'segments.create': { riskLevel: 'write', description: 'Create a segment.' },
	'segments.update': { riskLevel: 'write', description: 'Update a segment.' },
	'segments.remove': {
		riskLevel: 'destructive',
		description: 'Delete a segment.',
	},
	'segments.listMembers': {
		riskLevel: 'read',
		description: 'List members in a segment.',
	},
	'segments.addMember': {
		riskLevel: 'write',
		description: 'Add a member to a segment.',
	},
	'segments.removeMember': {
		riskLevel: 'destructive',
		description: 'Remove a member from a segment.',
	},
	'mergeFields.list': { riskLevel: 'read', description: 'List merge fields.' },
	'mergeFields.get': { riskLevel: 'read', description: 'Get a merge field.' },
	'mergeFields.create': {
		riskLevel: 'write',
		description: 'Create a merge field.',
	},
	'mergeFields.update': {
		riskLevel: 'write',
		description: 'Update a merge field.',
	},
	'mergeFields.remove': {
		riskLevel: 'destructive',
		description: 'Delete a merge field.',
	},
	'interestCategories.list': {
		riskLevel: 'read',
		description: 'List interest categories (groups).',
	},
	'interestCategories.get': {
		riskLevel: 'read',
		description: 'Get an interest category.',
	},
	'interestCategories.create': {
		riskLevel: 'write',
		description: 'Create an interest category.',
	},
	'interestCategories.update': {
		riskLevel: 'write',
		description: 'Update an interest category.',
	},
	'interestCategories.remove': {
		riskLevel: 'destructive',
		description: 'Delete an interest category.',
	},
	'interests.list': {
		riskLevel: 'read',
		description: 'List interests in a category.',
	},
	'interests.get': { riskLevel: 'read', description: 'Get an interest.' },
	'interests.create': {
		riskLevel: 'write',
		description: 'Create an interest.',
	},
	'interests.update': {
		riskLevel: 'write',
		description: 'Update an interest.',
	},
	'interests.remove': {
		riskLevel: 'destructive',
		description: 'Delete an interest.',
	},
	'campaigns.list': { riskLevel: 'read', description: 'List campaigns.' },
	'campaigns.get': { riskLevel: 'read', description: 'Get a campaign.' },
	'campaigns.create': { riskLevel: 'write', description: 'Create a campaign.' },
	'campaigns.update': {
		riskLevel: 'write',
		description: 'Update campaign settings.',
	},
	'campaigns.remove': {
		riskLevel: 'destructive',
		description: 'Delete a campaign.',
	},
	'campaigns.getContent': {
		riskLevel: 'read',
		description: 'Get campaign content.',
	},
	'campaigns.setContent': {
		riskLevel: 'write',
		description: 'Set campaign content.',
	},
	'campaigns.sendTest': {
		riskLevel: 'write',
		description: 'Send a test email.',
	},
	'campaigns.schedule': {
		riskLevel: 'write',
		description: 'Schedule a campaign.',
	},
	'campaigns.unschedule': {
		riskLevel: 'write',
		description: 'Unschedule a campaign.',
	},
	'campaigns.send': {
		riskLevel: 'destructive',
		description: 'Send a campaign to its audience.',
	},
	'webhooks.list': { riskLevel: 'read', description: 'List list webhooks.' },
	'webhooks.get': { riskLevel: 'read', description: 'Get a webhook.' },
	'webhooks.create': { riskLevel: 'write', description: 'Create a webhook.' },
	'webhooks.update': { riskLevel: 'write', description: 'Update a webhook.' },
	'webhooks.remove': {
		riskLevel: 'destructive',
		description: 'Delete a webhook.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mailchimpEndpointsNested
>;

export const mailchimpAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMailchimpPlugin<T extends MailchimpPluginOptions> =
	CorsairPlugin<
		'mailchimp',
		typeof MailchimpSchema,
		typeof mailchimpEndpointsNested,
		typeof mailchimpWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalMailchimpPlugin =
	BaseMailchimpPlugin<MailchimpPluginOptions>;

export type ExternalMailchimpPlugin<T extends MailchimpPluginOptions> =
	BaseMailchimpPlugin<T>;

export function mailchimp<const T extends MailchimpPluginOptions>(
	incomingOptions: MailchimpPluginOptions & T = {} as MailchimpPluginOptions &
		T,
): ExternalMailchimpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailchimp',
		authConfig: mailchimpAuthConfig,
		schema: MailchimpSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mailchimpEndpointsNested,
		webhooks: mailchimpWebhooksNested,
		endpointMeta: mailchimpEndpointMeta,
		endpointSchemas: mailchimpEndpointSchemas,
		webhookSchemas: mailchimpWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			// Mailchimp does not sign webhook requests, so require the
			// secret-in-URL routing hint in addition to the event type. The
			// handler validates its value after the tenant is resolved.
			const rawSecret = request.query?.secret;
			const secret = Array.isArray(rawSecret) ? rawSecret[0] : rawSecret;
			if (typeof secret !== 'string' || secret.length === 0) {
				return false;
			}
			const body = parseMailchimpWebhookBody(request.body);
			const type = body?.type;
			return (
				typeof type === 'string' &&
				(MailchimpWebhookTypes as readonly string[]).includes(type)
			);
		},
		pluginTenantWebhookMatcher: matchMailchimpTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMailchimpOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MailchimpKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.get_access_token();
				if (!accessToken) return '';
				// OAuth access tokens do not encode a data center, so resolve it
				// once via the metadata endpoint and pack it into ctx.key. The
				// client parses the packed key to build the correct base URL and
				// use Bearer auth without each endpoint needing to know the
				// auth mode.
				const metadata = await fetchMailchimpOAuthMetadata(accessToken);
				return packMailchimpOAuthKey(accessToken, metadata.dc);
			}

			return '';
		},
	} satisfies InternalMailchimpPlugin;
}

export type {
	MailchimpEndpointInputs,
	MailchimpEndpointOutputs,
} from './endpoints/types';
export type {
	CampaignEvent,
	MailchimpWebhookOutputs,
	ProfileEvent,
	SubscribeEvent,
	UnsubscribeEvent,
} from './webhooks/types';
