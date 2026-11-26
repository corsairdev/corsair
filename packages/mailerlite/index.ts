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
import { Campaigns, Fields, Groups, Subscribers } from './endpoints';
import type {
	MailerLiteEndpointInputs,
	MailerLiteEndpointOutputs,
} from './endpoints/types';
import {
	MailerLiteEndpointInputSchemas,
	MailerLiteEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MailerLiteSchema } from './schema';

export type MailerLitePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMailerLitePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailerLiteEndpointsNested>;
};

export type MailerLiteContext = CorsairPluginContext<
	typeof MailerLiteSchema,
	MailerLitePluginOptions
>;

export type MailerLiteKeyBuilderContext =
	KeyBuilderContext<MailerLitePluginOptions>;

export type MailerLiteBoundEndpoints = BindEndpoints<
	typeof mailerLiteEndpointsNested
>;

type MailerLiteEndpoint<K extends keyof MailerLiteEndpointOutputs> =
	CorsairEndpoint<
		MailerLiteContext,
		MailerLiteEndpointInputs[K],
		MailerLiteEndpointOutputs[K]
	>;

export type MailerLiteEndpoints = {
	subscribersList: MailerLiteEndpoint<'subscribersList'>;
	subscribersGet: MailerLiteEndpoint<'subscribersGet'>;
	subscribersUpsert: MailerLiteEndpoint<'subscribersUpsert'>;
	subscribersUpdate: MailerLiteEndpoint<'subscribersUpdate'>;
	subscribersDelete: MailerLiteEndpoint<'subscribersDelete'>;
	subscribersAddToGroup: MailerLiteEndpoint<'subscribersAddToGroup'>;
	subscribersRemoveFromGroup: MailerLiteEndpoint<'subscribersRemoveFromGroup'>;
	groupsList: MailerLiteEndpoint<'groupsList'>;
	groupsCreate: MailerLiteEndpoint<'groupsCreate'>;
	groupsDelete: MailerLiteEndpoint<'groupsDelete'>;
	fieldsList: MailerLiteEndpoint<'fieldsList'>;
	campaignsList: MailerLiteEndpoint<'campaignsList'>;
	campaignsCreate: MailerLiteEndpoint<'campaignsCreate'>;
	campaignsSchedule: MailerLiteEndpoint<'campaignsSchedule'>;
	campaignsCancel: MailerLiteEndpoint<'campaignsCancel'>;
	campaignsActivity: MailerLiteEndpoint<'campaignsActivity'>;
};

const mailerLiteEndpointsNested = {
	subscribers: {
		list: Subscribers.list,
		get: Subscribers.get,
		upsert: Subscribers.upsert,
		update: Subscribers.update,
		delete: Subscribers.remove,
		addToGroup: Subscribers.addToGroup,
		removeFromGroup: Subscribers.removeFromGroup,
	},
	groups: {
		list: Groups.list,
		create: Groups.create,
		delete: Groups.remove,
	},
	fields: {
		list: Fields.list,
	},
	campaigns: {
		list: Campaigns.list,
		create: Campaigns.create,
		schedule: Campaigns.schedule,
		cancel: Campaigns.cancel,
		activity: Campaigns.activity,
	},
} as const;

export const mailerLiteEndpointSchemas = {
	'subscribers.list': {
		input: MailerLiteEndpointInputSchemas.subscribersList,
		output: MailerLiteEndpointOutputSchemas.subscribersList,
	},
	'subscribers.get': {
		input: MailerLiteEndpointInputSchemas.subscribersGet,
		output: MailerLiteEndpointOutputSchemas.subscribersGet,
	},
	'subscribers.upsert': {
		input: MailerLiteEndpointInputSchemas.subscribersUpsert,
		output: MailerLiteEndpointOutputSchemas.subscribersUpsert,
	},
	'subscribers.update': {
		input: MailerLiteEndpointInputSchemas.subscribersUpdate,
		output: MailerLiteEndpointOutputSchemas.subscribersUpdate,
	},
	'subscribers.delete': {
		input: MailerLiteEndpointInputSchemas.subscribersDelete,
		output: MailerLiteEndpointOutputSchemas.subscribersDelete,
	},
	'subscribers.addToGroup': {
		input: MailerLiteEndpointInputSchemas.subscribersAddToGroup,
		output: MailerLiteEndpointOutputSchemas.subscribersAddToGroup,
	},
	'subscribers.removeFromGroup': {
		input: MailerLiteEndpointInputSchemas.subscribersRemoveFromGroup,
		output: MailerLiteEndpointOutputSchemas.subscribersRemoveFromGroup,
	},
	'groups.list': {
		input: MailerLiteEndpointInputSchemas.groupsList,
		output: MailerLiteEndpointOutputSchemas.groupsList,
	},
	'groups.create': {
		input: MailerLiteEndpointInputSchemas.groupsCreate,
		output: MailerLiteEndpointOutputSchemas.groupsCreate,
	},
	'groups.delete': {
		input: MailerLiteEndpointInputSchemas.groupsDelete,
		output: MailerLiteEndpointOutputSchemas.groupsDelete,
	},
	'fields.list': {
		input: MailerLiteEndpointInputSchemas.fieldsList,
		output: MailerLiteEndpointOutputSchemas.fieldsList,
	},
	'campaigns.list': {
		input: MailerLiteEndpointInputSchemas.campaignsList,
		output: MailerLiteEndpointOutputSchemas.campaignsList,
	},
	'campaigns.create': {
		input: MailerLiteEndpointInputSchemas.campaignsCreate,
		output: MailerLiteEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.schedule': {
		input: MailerLiteEndpointInputSchemas.campaignsSchedule,
		output: MailerLiteEndpointOutputSchemas.campaignsSchedule,
	},
	'campaigns.cancel': {
		input: MailerLiteEndpointInputSchemas.campaignsCancel,
		output: MailerLiteEndpointOutputSchemas.campaignsCancel,
	},
	'campaigns.activity': {
		input: MailerLiteEndpointInputSchemas.campaignsActivity,
		output: MailerLiteEndpointOutputSchemas.campaignsActivity,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailerLiteEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const mailerLiteEndpointMeta = {
	'subscribers.list': {
		riskLevel: 'read',
		description:
			'List subscribers, cursor paginated, optionally filtered by status or group',
	},
	'subscribers.get': {
		riskLevel: 'read',
		description:
			'Fetch one subscriber by id or by email address, with its custom field values',
	},
	'subscribers.upsert': {
		riskLevel: 'write',
		description:
			'Create a subscriber or update an existing one matched by email. Repeating the call is safe: it never deletes fields or group membership',
	},
	'subscribers.update': {
		riskLevel: 'write',
		description:
			'Update one subscriber. groups is the complete set: subscribers are removed from groups not listed, so an empty array removes them from every group',
	},
	'subscribers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a subscriber and their history. There is no undo',
	},
	'subscribers.addToGroup': {
		riskLevel: 'write',
		description: 'Add an existing subscriber to an existing group',
	},
	'subscribers.removeFromGroup': {
		riskLevel: 'write',
		description:
			'Remove a subscriber from a group. The subscriber keeps their status; only the membership goes',
	},
	'groups.list': {
		riskLevel: 'read',
		description:
			'List groups with their counts and open and click rates, page paginated',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create an empty group for subscribers, named up to 255 characters',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a group. Membership history is not restorable and the subscribers are kept',
	},
	'fields.list': {
		riskLevel: 'read',
		description:
			'List custom fields with their keys and types, page paginated',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'List campaigns with their status and delivery stats, page paginated',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create a draft campaign with recipients and email content. Nothing is sent until campaigns.schedule runs',
	},
	'campaigns.schedule': {
		riskLevel: 'write',
		description:
			'Schedule a ready draft, or send it now with delivery instant. This emails real recipients and an instant send cannot be unsent',
	},
	'campaigns.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a scheduled campaign that has not started sending, returning it to draft so it can be edited and rescheduled',
	},
	'campaigns.activity': {
		riskLevel: 'read',
		description:
			'List the recipients of a sent campaign with their open and click activity',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mailerLiteEndpointsNested>;

export const mailerliteAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const;

export type BaseMailerLitePlugin<T extends MailerLitePluginOptions> =
	CorsairPlugin<
		'mailerlite',
		typeof MailerLiteSchema,
		typeof mailerLiteEndpointsNested,
		// MailerLite delivers events to webhooks it registers, but this plugin
		// handles no inbound deliveries, so the map stays empty.
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalMailerLitePlugin = BaseMailerLitePlugin<MailerLitePluginOptions>;

export type ExternalMailerLitePlugin<T extends MailerLitePluginOptions> =
	BaseMailerLitePlugin<T>;

export function mailerlite<const T extends MailerLitePluginOptions>(
	incomingOptions: MailerLitePluginOptions & T = {} as MailerLitePluginOptions & T,
): ExternalMailerLitePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailerlite',
		schema: MailerLiteSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mailerLiteEndpointsNested,
		webhooks: {},
		endpointMeta: mailerLiteEndpointMeta,
		endpointSchemas: mailerLiteEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MailerLiteKeyBuilderContext, source) => {
			// Fail closed. Returning an empty string here would send an empty
			// bearer token, which MailerLite answers with a generic 401 instead
			// of Corsair surfacing its disconnected-auth flow.
			if (source !== 'endpoint') {
				throw new AuthMissingError('mailerlite', 'api_key');
			}

			if (options.key) return options.key;

			const res = await ctx.keys?.get_api_key();
			if (!res) {
				throw new AuthMissingError('mailerlite', 'api_key');
			}

			return res;
		},
	} satisfies InternalMailerLitePlugin;
}

export type {
	MailerLiteEndpointInputs,
	MailerLiteEndpointOutputs,
	SubscribersListInput,
	SubscribersListResponse,
	MailerLiteSubscriber,
	MailerLiteGroup,
	MailerLiteField,
	MailerLiteCampaign,
} from './endpoints/types';
export { MailerLiteAPIError } from './client';
