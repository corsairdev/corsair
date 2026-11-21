import type {
	AuthTypes,
	BindEndpoints,
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
import {
	AutomationMails,
	Campaigns,
	EmailLists,
	Links,
	Segments,
	Sends,
	SubscriberImports,
	Subscribers,
	Suppressions,
	Tags,
	Templates,
	TransactionalMails,
	Uploads,
	User,
} from './endpoints';
import { MailcoachOperations } from './endpoints/operations';
import {
	MailcoachEndpointInputSchemas,
	MailcoachEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MailcoachSchema } from './schema';

export type MailcoachPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The API URL shown in Mailcoach team settings, including the `/api` path. */
	apiUrl?: string;
	key?: string;
	hooks?: InternalMailcoachPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailcoachEndpointsNested>;
};

export type MailcoachContext = CorsairPluginContext<
	typeof MailcoachSchema,
	MailcoachPluginOptions,
	undefined,
	typeof mailcoachAuthConfig
>;
export type MailcoachKeyBuilderContext = KeyBuilderContext<
	MailcoachPluginOptions,
	typeof mailcoachAuthConfig
>;

const mailcoachEndpointsNested = {
	user: User,
	emailLists: EmailLists,
	subscribers: Subscribers,
	subscriberImports: SubscriberImports,
	tags: Tags,
	segments: Segments,
	templates: Templates,
	campaigns: Campaigns,
	transactionalMails: TransactionalMails,
	automationMails: AutomationMails,
	sends: Sends,
	links: Links,
	suppressions: Suppressions,
	uploads: Uploads,
} as const;

export type MailcoachBoundEndpoints = BindEndpoints<
	typeof mailcoachEndpointsNested
>;
export type MailcoachEndpoints = MailcoachBoundEndpoints;

export const mailcoachEndpointSchemas = {
	'user.get': {
		input: MailcoachEndpointInputSchemas['user.get'],
		output: MailcoachEndpointOutputSchemas['user.get'],
	},
	'emailLists.list': {
		input: MailcoachEndpointInputSchemas['emailLists.list'],
		output: MailcoachEndpointOutputSchemas['emailLists.list'],
	},
	'emailLists.get': {
		input: MailcoachEndpointInputSchemas['emailLists.get'],
		output: MailcoachEndpointOutputSchemas['emailLists.get'],
	},
	'emailLists.create': {
		input: MailcoachEndpointInputSchemas['emailLists.create'],
		output: MailcoachEndpointOutputSchemas['emailLists.create'],
	},
	'emailLists.update': {
		input: MailcoachEndpointInputSchemas['emailLists.update'],
		output: MailcoachEndpointOutputSchemas['emailLists.update'],
	},
	'emailLists.delete': {
		input: MailcoachEndpointInputSchemas['emailLists.delete'],
		output: MailcoachEndpointOutputSchemas['emailLists.delete'],
	},
	'subscribers.list': {
		input: MailcoachEndpointInputSchemas['subscribers.list'],
		output: MailcoachEndpointOutputSchemas['subscribers.list'],
	},
	'subscribers.get': {
		input: MailcoachEndpointInputSchemas['subscribers.get'],
		output: MailcoachEndpointOutputSchemas['subscribers.get'],
	},
	'subscribers.subscribe': {
		input: MailcoachEndpointInputSchemas['subscribers.subscribe'],
		output: MailcoachEndpointOutputSchemas['subscribers.subscribe'],
	},
	'subscribers.update': {
		input: MailcoachEndpointInputSchemas['subscribers.update'],
		output: MailcoachEndpointOutputSchemas['subscribers.update'],
	},
	'subscribers.delete': {
		input: MailcoachEndpointInputSchemas['subscribers.delete'],
		output: MailcoachEndpointOutputSchemas['subscribers.delete'],
	},
	'subscribers.confirm': {
		input: MailcoachEndpointInputSchemas['subscribers.confirm'],
		output: MailcoachEndpointOutputSchemas['subscribers.confirm'],
	},
	'subscribers.confirmByEmail': {
		input: MailcoachEndpointInputSchemas['subscribers.confirmByEmail'],
		output: MailcoachEndpointOutputSchemas['subscribers.confirmByEmail'],
	},
	'subscribers.unsubscribe': {
		input: MailcoachEndpointInputSchemas['subscribers.unsubscribe'],
		output: MailcoachEndpointOutputSchemas['subscribers.unsubscribe'],
	},
	'subscribers.unsubscribeByEmail': {
		input: MailcoachEndpointInputSchemas['subscribers.unsubscribeByEmail'],
		output: MailcoachEndpointOutputSchemas['subscribers.unsubscribeByEmail'],
	},
	'subscribers.resendConfirmation': {
		input: MailcoachEndpointInputSchemas['subscribers.resendConfirmation'],
		output: MailcoachEndpointOutputSchemas['subscribers.resendConfirmation'],
	},
	'subscribers.resendConfirmationByEmail': {
		input:
			MailcoachEndpointInputSchemas['subscribers.resendConfirmationByEmail'],
		output:
			MailcoachEndpointOutputSchemas['subscribers.resendConfirmationByEmail'],
	},
	'subscribers.addTags': {
		input: MailcoachEndpointInputSchemas['subscribers.addTags'],
		output: MailcoachEndpointOutputSchemas['subscribers.addTags'],
	},
	'subscribers.removeTags': {
		input: MailcoachEndpointInputSchemas['subscribers.removeTags'],
		output: MailcoachEndpointOutputSchemas['subscribers.removeTags'],
	},
	'subscriberImports.list': {
		input: MailcoachEndpointInputSchemas['subscriberImports.list'],
		output: MailcoachEndpointOutputSchemas['subscriberImports.list'],
	},
	'subscriberImports.get': {
		input: MailcoachEndpointInputSchemas['subscriberImports.get'],
		output: MailcoachEndpointOutputSchemas['subscriberImports.get'],
	},
	'subscriberImports.create': {
		input: MailcoachEndpointInputSchemas['subscriberImports.create'],
		output: MailcoachEndpointOutputSchemas['subscriberImports.create'],
	},
	'subscriberImports.update': {
		input: MailcoachEndpointInputSchemas['subscriberImports.update'],
		output: MailcoachEndpointOutputSchemas['subscriberImports.update'],
	},
	'subscriberImports.delete': {
		input: MailcoachEndpointInputSchemas['subscriberImports.delete'],
		output: MailcoachEndpointOutputSchemas['subscriberImports.delete'],
	},
	'subscriberImports.append': {
		input: MailcoachEndpointInputSchemas['subscriberImports.append'],
		output: MailcoachEndpointOutputSchemas['subscriberImports.append'],
	},
	'subscriberImports.start': {
		input: MailcoachEndpointInputSchemas['subscriberImports.start'],
		output: MailcoachEndpointOutputSchemas['subscriberImports.start'],
	},
	'tags.list': {
		input: MailcoachEndpointInputSchemas['tags.list'],
		output: MailcoachEndpointOutputSchemas['tags.list'],
	},
	'tags.get': {
		input: MailcoachEndpointInputSchemas['tags.get'],
		output: MailcoachEndpointOutputSchemas['tags.get'],
	},
	'tags.create': {
		input: MailcoachEndpointInputSchemas['tags.create'],
		output: MailcoachEndpointOutputSchemas['tags.create'],
	},
	'tags.update': {
		input: MailcoachEndpointInputSchemas['tags.update'],
		output: MailcoachEndpointOutputSchemas['tags.update'],
	},
	'tags.delete': {
		input: MailcoachEndpointInputSchemas['tags.delete'],
		output: MailcoachEndpointOutputSchemas['tags.delete'],
	},
	'segments.list': {
		input: MailcoachEndpointInputSchemas['segments.list'],
		output: MailcoachEndpointOutputSchemas['segments.list'],
	},
	'segments.get': {
		input: MailcoachEndpointInputSchemas['segments.get'],
		output: MailcoachEndpointOutputSchemas['segments.get'],
	},
	'segments.create': {
		input: MailcoachEndpointInputSchemas['segments.create'],
		output: MailcoachEndpointOutputSchemas['segments.create'],
	},
	'segments.update': {
		input: MailcoachEndpointInputSchemas['segments.update'],
		output: MailcoachEndpointOutputSchemas['segments.update'],
	},
	'segments.delete': {
		input: MailcoachEndpointInputSchemas['segments.delete'],
		output: MailcoachEndpointOutputSchemas['segments.delete'],
	},
	'templates.list': {
		input: MailcoachEndpointInputSchemas['templates.list'],
		output: MailcoachEndpointOutputSchemas['templates.list'],
	},
	'templates.get': {
		input: MailcoachEndpointInputSchemas['templates.get'],
		output: MailcoachEndpointOutputSchemas['templates.get'],
	},
	'templates.create': {
		input: MailcoachEndpointInputSchemas['templates.create'],
		output: MailcoachEndpointOutputSchemas['templates.create'],
	},
	'templates.update': {
		input: MailcoachEndpointInputSchemas['templates.update'],
		output: MailcoachEndpointOutputSchemas['templates.update'],
	},
	'templates.delete': {
		input: MailcoachEndpointInputSchemas['templates.delete'],
		output: MailcoachEndpointOutputSchemas['templates.delete'],
	},
	'campaigns.list': {
		input: MailcoachEndpointInputSchemas['campaigns.list'],
		output: MailcoachEndpointOutputSchemas['campaigns.list'],
	},
	'campaigns.get': {
		input: MailcoachEndpointInputSchemas['campaigns.get'],
		output: MailcoachEndpointOutputSchemas['campaigns.get'],
	},
	'campaigns.create': {
		input: MailcoachEndpointInputSchemas['campaigns.create'],
		output: MailcoachEndpointOutputSchemas['campaigns.create'],
	},
	'campaigns.update': {
		input: MailcoachEndpointInputSchemas['campaigns.update'],
		output: MailcoachEndpointOutputSchemas['campaigns.update'],
	},
	'campaigns.delete': {
		input: MailcoachEndpointInputSchemas['campaigns.delete'],
		output: MailcoachEndpointOutputSchemas['campaigns.delete'],
	},
	'campaigns.sendTest': {
		input: MailcoachEndpointInputSchemas['campaigns.sendTest'],
		output: MailcoachEndpointOutputSchemas['campaigns.sendTest'],
	},
	'campaigns.send': {
		input: MailcoachEndpointInputSchemas['campaigns.send'],
		output: MailcoachEndpointOutputSchemas['campaigns.send'],
	},
	'campaigns.opens': {
		input: MailcoachEndpointInputSchemas['campaigns.opens'],
		output: MailcoachEndpointOutputSchemas['campaigns.opens'],
	},
	'campaigns.clicks': {
		input: MailcoachEndpointInputSchemas['campaigns.clicks'],
		output: MailcoachEndpointOutputSchemas['campaigns.clicks'],
	},
	'campaigns.unsubscribes': {
		input: MailcoachEndpointInputSchemas['campaigns.unsubscribes'],
		output: MailcoachEndpointOutputSchemas['campaigns.unsubscribes'],
	},
	'campaigns.bounces': {
		input: MailcoachEndpointInputSchemas['campaigns.bounces'],
		output: MailcoachEndpointOutputSchemas['campaigns.bounces'],
	},
	'transactionalMails.send': {
		input: MailcoachEndpointInputSchemas['transactionalMails.send'],
		output: MailcoachEndpointOutputSchemas['transactionalMails.send'],
	},
	'transactionalMails.listTemplates': {
		input: MailcoachEndpointInputSchemas['transactionalMails.listTemplates'],
		output: MailcoachEndpointOutputSchemas['transactionalMails.listTemplates'],
	},
	'transactionalMails.getTemplate': {
		input: MailcoachEndpointInputSchemas['transactionalMails.getTemplate'],
		output: MailcoachEndpointOutputSchemas['transactionalMails.getTemplate'],
	},
	'automationMails.list': {
		input: MailcoachEndpointInputSchemas['automationMails.list'],
		output: MailcoachEndpointOutputSchemas['automationMails.list'],
	},
	'automationMails.get': {
		input: MailcoachEndpointInputSchemas['automationMails.get'],
		output: MailcoachEndpointOutputSchemas['automationMails.get'],
	},
	'automationMails.create': {
		input: MailcoachEndpointInputSchemas['automationMails.create'],
		output: MailcoachEndpointOutputSchemas['automationMails.create'],
	},
	'automationMails.update': {
		input: MailcoachEndpointInputSchemas['automationMails.update'],
		output: MailcoachEndpointOutputSchemas['automationMails.update'],
	},
	'automationMails.delete': {
		input: MailcoachEndpointInputSchemas['automationMails.delete'],
		output: MailcoachEndpointOutputSchemas['automationMails.delete'],
	},
	'sends.list': {
		input: MailcoachEndpointInputSchemas['sends.list'],
		output: MailcoachEndpointOutputSchemas['sends.list'],
	},
	'sends.get': {
		input: MailcoachEndpointInputSchemas['sends.get'],
		output: MailcoachEndpointOutputSchemas['sends.get'],
	},
	'sends.delete': {
		input: MailcoachEndpointInputSchemas['sends.delete'],
		output: MailcoachEndpointOutputSchemas['sends.delete'],
	},
	'links.get': {
		input: MailcoachEndpointInputSchemas['links.get'],
		output: MailcoachEndpointOutputSchemas['links.get'],
	},
	'suppressions.list': {
		input: MailcoachEndpointInputSchemas['suppressions.list'],
		output: MailcoachEndpointOutputSchemas['suppressions.list'],
	},
	'suppressions.get': {
		input: MailcoachEndpointInputSchemas['suppressions.get'],
		output: MailcoachEndpointOutputSchemas['suppressions.get'],
	},
	'suppressions.create': {
		input: MailcoachEndpointInputSchemas['suppressions.create'],
		output: MailcoachEndpointOutputSchemas['suppressions.create'],
	},
	'suppressions.delete': {
		input: MailcoachEndpointInputSchemas['suppressions.delete'],
		output: MailcoachEndpointOutputSchemas['suppressions.delete'],
	},
	'uploads.create': {
		input: MailcoachEndpointInputSchemas['uploads.create'],
		output: MailcoachEndpointOutputSchemas['uploads.create'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailcoachEndpointsNested
>;

export const mailcoachEndpointMeta = {
	'user.get': {
		riskLevel: MailcoachOperations['user.get'].riskLevel,
		description: MailcoachOperations['user.get'].description,
	},
	'emailLists.list': {
		riskLevel: MailcoachOperations['emailLists.list'].riskLevel,
		description: MailcoachOperations['emailLists.list'].description,
	},
	'emailLists.get': {
		riskLevel: MailcoachOperations['emailLists.get'].riskLevel,
		description: MailcoachOperations['emailLists.get'].description,
	},
	'emailLists.create': {
		riskLevel: MailcoachOperations['emailLists.create'].riskLevel,
		description: MailcoachOperations['emailLists.create'].description,
	},
	'emailLists.update': {
		riskLevel: MailcoachOperations['emailLists.update'].riskLevel,
		description: MailcoachOperations['emailLists.update'].description,
	},
	'emailLists.delete': {
		riskLevel: MailcoachOperations['emailLists.delete'].riskLevel,
		description: MailcoachOperations['emailLists.delete'].description,
	},
	'subscribers.list': {
		riskLevel: MailcoachOperations['subscribers.list'].riskLevel,
		description: MailcoachOperations['subscribers.list'].description,
	},
	'subscribers.get': {
		riskLevel: MailcoachOperations['subscribers.get'].riskLevel,
		description: MailcoachOperations['subscribers.get'].description,
	},
	'subscribers.subscribe': {
		riskLevel: MailcoachOperations['subscribers.subscribe'].riskLevel,
		description: MailcoachOperations['subscribers.subscribe'].description,
	},
	'subscribers.update': {
		riskLevel: MailcoachOperations['subscribers.update'].riskLevel,
		description: MailcoachOperations['subscribers.update'].description,
	},
	'subscribers.delete': {
		riskLevel: MailcoachOperations['subscribers.delete'].riskLevel,
		description: MailcoachOperations['subscribers.delete'].description,
	},
	'subscribers.confirm': {
		riskLevel: MailcoachOperations['subscribers.confirm'].riskLevel,
		description: MailcoachOperations['subscribers.confirm'].description,
	},
	'subscribers.confirmByEmail': {
		riskLevel: MailcoachOperations['subscribers.confirmByEmail'].riskLevel,
		description: MailcoachOperations['subscribers.confirmByEmail'].description,
	},
	'subscribers.unsubscribe': {
		riskLevel: MailcoachOperations['subscribers.unsubscribe'].riskLevel,
		description: MailcoachOperations['subscribers.unsubscribe'].description,
	},
	'subscribers.unsubscribeByEmail': {
		riskLevel: MailcoachOperations['subscribers.unsubscribeByEmail'].riskLevel,
		description:
			MailcoachOperations['subscribers.unsubscribeByEmail'].description,
	},
	'subscribers.resendConfirmation': {
		riskLevel: MailcoachOperations['subscribers.resendConfirmation'].riskLevel,
		description:
			MailcoachOperations['subscribers.resendConfirmation'].description,
	},
	'subscribers.resendConfirmationByEmail': {
		riskLevel:
			MailcoachOperations['subscribers.resendConfirmationByEmail'].riskLevel,
		description:
			MailcoachOperations['subscribers.resendConfirmationByEmail'].description,
	},
	'subscribers.addTags': {
		riskLevel: MailcoachOperations['subscribers.addTags'].riskLevel,
		description: MailcoachOperations['subscribers.addTags'].description,
	},
	'subscribers.removeTags': {
		riskLevel: MailcoachOperations['subscribers.removeTags'].riskLevel,
		description: MailcoachOperations['subscribers.removeTags'].description,
	},
	'subscriberImports.list': {
		riskLevel: MailcoachOperations['subscriberImports.list'].riskLevel,
		description: MailcoachOperations['subscriberImports.list'].description,
	},
	'subscriberImports.get': {
		riskLevel: MailcoachOperations['subscriberImports.get'].riskLevel,
		description: MailcoachOperations['subscriberImports.get'].description,
	},
	'subscriberImports.create': {
		riskLevel: MailcoachOperations['subscriberImports.create'].riskLevel,
		description: MailcoachOperations['subscriberImports.create'].description,
	},
	'subscriberImports.update': {
		riskLevel: MailcoachOperations['subscriberImports.update'].riskLevel,
		description: MailcoachOperations['subscriberImports.update'].description,
	},
	'subscriberImports.delete': {
		riskLevel: MailcoachOperations['subscriberImports.delete'].riskLevel,
		description: MailcoachOperations['subscriberImports.delete'].description,
	},
	'subscriberImports.append': {
		riskLevel: MailcoachOperations['subscriberImports.append'].riskLevel,
		description: MailcoachOperations['subscriberImports.append'].description,
	},
	'subscriberImports.start': {
		riskLevel: MailcoachOperations['subscriberImports.start'].riskLevel,
		description: MailcoachOperations['subscriberImports.start'].description,
	},
	'tags.list': {
		riskLevel: MailcoachOperations['tags.list'].riskLevel,
		description: MailcoachOperations['tags.list'].description,
	},
	'tags.get': {
		riskLevel: MailcoachOperations['tags.get'].riskLevel,
		description: MailcoachOperations['tags.get'].description,
	},
	'tags.create': {
		riskLevel: MailcoachOperations['tags.create'].riskLevel,
		description: MailcoachOperations['tags.create'].description,
	},
	'tags.update': {
		riskLevel: MailcoachOperations['tags.update'].riskLevel,
		description: MailcoachOperations['tags.update'].description,
	},
	'tags.delete': {
		riskLevel: MailcoachOperations['tags.delete'].riskLevel,
		description: MailcoachOperations['tags.delete'].description,
	},
	'segments.list': {
		riskLevel: MailcoachOperations['segments.list'].riskLevel,
		description: MailcoachOperations['segments.list'].description,
	},
	'segments.get': {
		riskLevel: MailcoachOperations['segments.get'].riskLevel,
		description: MailcoachOperations['segments.get'].description,
	},
	'segments.create': {
		riskLevel: MailcoachOperations['segments.create'].riskLevel,
		description: MailcoachOperations['segments.create'].description,
	},
	'segments.update': {
		riskLevel: MailcoachOperations['segments.update'].riskLevel,
		description: MailcoachOperations['segments.update'].description,
	},
	'segments.delete': {
		riskLevel: MailcoachOperations['segments.delete'].riskLevel,
		description: MailcoachOperations['segments.delete'].description,
	},
	'templates.list': {
		riskLevel: MailcoachOperations['templates.list'].riskLevel,
		description: MailcoachOperations['templates.list'].description,
	},
	'templates.get': {
		riskLevel: MailcoachOperations['templates.get'].riskLevel,
		description: MailcoachOperations['templates.get'].description,
	},
	'templates.create': {
		riskLevel: MailcoachOperations['templates.create'].riskLevel,
		description: MailcoachOperations['templates.create'].description,
	},
	'templates.update': {
		riskLevel: MailcoachOperations['templates.update'].riskLevel,
		description: MailcoachOperations['templates.update'].description,
	},
	'templates.delete': {
		riskLevel: MailcoachOperations['templates.delete'].riskLevel,
		description: MailcoachOperations['templates.delete'].description,
	},
	'campaigns.list': {
		riskLevel: MailcoachOperations['campaigns.list'].riskLevel,
		description: MailcoachOperations['campaigns.list'].description,
	},
	'campaigns.get': {
		riskLevel: MailcoachOperations['campaigns.get'].riskLevel,
		description: MailcoachOperations['campaigns.get'].description,
	},
	'campaigns.create': {
		riskLevel: MailcoachOperations['campaigns.create'].riskLevel,
		description: MailcoachOperations['campaigns.create'].description,
	},
	'campaigns.update': {
		riskLevel: MailcoachOperations['campaigns.update'].riskLevel,
		description: MailcoachOperations['campaigns.update'].description,
	},
	'campaigns.delete': {
		riskLevel: MailcoachOperations['campaigns.delete'].riskLevel,
		description: MailcoachOperations['campaigns.delete'].description,
	},
	'campaigns.sendTest': {
		riskLevel: MailcoachOperations['campaigns.sendTest'].riskLevel,
		description: MailcoachOperations['campaigns.sendTest'].description,
	},
	'campaigns.send': {
		riskLevel: MailcoachOperations['campaigns.send'].riskLevel,
		description: MailcoachOperations['campaigns.send'].description,
	},
	'campaigns.opens': {
		riskLevel: MailcoachOperations['campaigns.opens'].riskLevel,
		description: MailcoachOperations['campaigns.opens'].description,
	},
	'campaigns.clicks': {
		riskLevel: MailcoachOperations['campaigns.clicks'].riskLevel,
		description: MailcoachOperations['campaigns.clicks'].description,
	},
	'campaigns.unsubscribes': {
		riskLevel: MailcoachOperations['campaigns.unsubscribes'].riskLevel,
		description: MailcoachOperations['campaigns.unsubscribes'].description,
	},
	'campaigns.bounces': {
		riskLevel: MailcoachOperations['campaigns.bounces'].riskLevel,
		description: MailcoachOperations['campaigns.bounces'].description,
	},
	'transactionalMails.send': {
		riskLevel: MailcoachOperations['transactionalMails.send'].riskLevel,
		description: MailcoachOperations['transactionalMails.send'].description,
	},
	'transactionalMails.listTemplates': {
		riskLevel:
			MailcoachOperations['transactionalMails.listTemplates'].riskLevel,
		description:
			MailcoachOperations['transactionalMails.listTemplates'].description,
	},
	'transactionalMails.getTemplate': {
		riskLevel: MailcoachOperations['transactionalMails.getTemplate'].riskLevel,
		description:
			MailcoachOperations['transactionalMails.getTemplate'].description,
	},
	'automationMails.list': {
		riskLevel: MailcoachOperations['automationMails.list'].riskLevel,
		description: MailcoachOperations['automationMails.list'].description,
	},
	'automationMails.get': {
		riskLevel: MailcoachOperations['automationMails.get'].riskLevel,
		description: MailcoachOperations['automationMails.get'].description,
	},
	'automationMails.create': {
		riskLevel: MailcoachOperations['automationMails.create'].riskLevel,
		description: MailcoachOperations['automationMails.create'].description,
	},
	'automationMails.update': {
		riskLevel: MailcoachOperations['automationMails.update'].riskLevel,
		description: MailcoachOperations['automationMails.update'].description,
	},
	'automationMails.delete': {
		riskLevel: MailcoachOperations['automationMails.delete'].riskLevel,
		description: MailcoachOperations['automationMails.delete'].description,
	},
	'sends.list': {
		riskLevel: MailcoachOperations['sends.list'].riskLevel,
		description: MailcoachOperations['sends.list'].description,
	},
	'sends.get': {
		riskLevel: MailcoachOperations['sends.get'].riskLevel,
		description: MailcoachOperations['sends.get'].description,
	},
	'sends.delete': {
		riskLevel: MailcoachOperations['sends.delete'].riskLevel,
		description: MailcoachOperations['sends.delete'].description,
	},
	'links.get': {
		riskLevel: MailcoachOperations['links.get'].riskLevel,
		description: MailcoachOperations['links.get'].description,
	},
	'suppressions.list': {
		riskLevel: MailcoachOperations['suppressions.list'].riskLevel,
		description: MailcoachOperations['suppressions.list'].description,
	},
	'suppressions.get': {
		riskLevel: MailcoachOperations['suppressions.get'].riskLevel,
		description: MailcoachOperations['suppressions.get'].description,
	},
	'suppressions.create': {
		riskLevel: MailcoachOperations['suppressions.create'].riskLevel,
		description: MailcoachOperations['suppressions.create'].description,
	},
	'suppressions.delete': {
		riskLevel: MailcoachOperations['suppressions.delete'].riskLevel,
		description: MailcoachOperations['suppressions.delete'].description,
	},
	'uploads.create': {
		riskLevel: MailcoachOperations['uploads.create'].riskLevel,
		description: MailcoachOperations['uploads.create'].description,
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mailcoachEndpointsNested
>;

export const mailcoachAuthConfig = {
	api_key: { account: ['api_url'] as const },
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseMailcoachPlugin<T extends MailcoachPluginOptions> =
	CorsairPlugin<
		'mailcoach',
		typeof MailcoachSchema,
		typeof mailcoachEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof mailcoachAuthConfig
	>;
export type InternalMailcoachPlugin =
	BaseMailcoachPlugin<MailcoachPluginOptions>;
export type ExternalMailcoachPlugin<T extends MailcoachPluginOptions> =
	BaseMailcoachPlugin<T>;

const { DEFAULT: builtInDefault, ...builtInErrorHandlers } = errorHandlers;

export function mailcoach<const T extends MailcoachPluginOptions>(
	incomingOptions: MailcoachPluginOptions & T = {} as MailcoachPluginOptions &
		T,
): ExternalMailcoachPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: callerDefault, ...callerErrorHandlers } =
		options.errorHandlers ?? {};

	return {
		id: 'mailcoach',
		authConfig: mailcoachAuthConfig,
		schema: MailcoachSchema,
		options,
		hooks: options.hooks,
		endpoints: mailcoachEndpointsNested,
		// Mailcoach documents outbound notifications, but this integration has no
		// inbound webhook contract in scope.
		webhooks: {},
		endpointMeta: mailcoachEndpointMeta,
		endpointSchemas: mailcoachEndpointSchemas,
		errorHandlers: {
			...callerErrorHandlers,
			...builtInErrorHandlers,
			...callerErrorHandlers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (context: MailcoachKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) {
				if (options.key.length === 0) {
					throw new AuthMissingError('mailcoach', 'api_key');
				}
				return options.key;
			}
			if (!context.keys) {
				throw new AuthMissingError('mailcoach', 'api_key');
			}
			const apiKey = await context.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('mailcoach', 'api_key');
			return apiKey;
		},
	} satisfies InternalMailcoachPlugin;
}

export type {
	AutomationMailsListInput,
	CampaignsListInput,
	EmailListsCreateInput,
	EmailListsDeleteInput,
	EmailListsGetInput,
	EmailListsListInput,
	EmailListsUpdateInput,
	MailcoachEndpointInputs,
	MailcoachEndpointOutputs,
	MailcoachJsonValue,
	SegmentsListInput,
	SendsListInput,
	SubscriberImportsListInput,
	SubscribersDeleteInput,
	SubscribersGetInput,
	SubscribersListInput,
	SubscribersSubscribeInput,
	SubscribersUpdateInput,
	SuppressionsListInput,
	TagsListInput,
	TemplatesListInput,
	TransactionalMailSendInput,
	UploadsCreateInput,
	UserGetInput,
	UserGetResponse,
} from './endpoints/types';
