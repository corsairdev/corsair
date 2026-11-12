import type {
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
import { lists, subscribers } from './endpoints';
import {
	campaignInputSchemas,
	campaignOutputSchemas,
} from './endpoints/campaign-types';
import { campaigns } from './endpoints/campaigns';
import {
	automations,
	fields,
	home,
	integrations,
	tasks,
	templates,
} from './endpoints/other';
import { otherInputSchemas, otherOutputSchemas } from './endpoints/other-types';
import {
	listInputSchemas,
	listOutputSchemas,
	subscriberInputSchemas,
	subscriberOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DopplerMarketingAutomationSchema } from './schema';

const endpoints = {
	lists,
	subscribers,
	campaigns,
	automations,
	templates,
	fields,
	home,
	tasks,
	integrations,
} as const;
export type DopplerMarketingAutomationPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDopplerMarketingAutomationPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type DopplerMarketingAutomationContext = CorsairPluginContext<
	typeof DopplerMarketingAutomationSchema,
	DopplerMarketingAutomationPluginOptions
>;
export type DopplerMarketingAutomationBoundEndpoints = BindEndpoints<
	typeof endpoints
>;

export const dopplerMarketingAutomationEndpointSchemas = {
	'lists.list': {
		input: listInputSchemas.list,
		output: listOutputSchemas.list,
	},
	'lists.create': {
		input: listInputSchemas.create,
		output: listOutputSchemas.create,
	},
	'lists.get': { input: listInputSchemas.get, output: listOutputSchemas.get },
	'lists.update': {
		input: listInputSchemas.update,
		output: listOutputSchemas.update,
	},
	'lists.delete': {
		input: listInputSchemas.delete,
		output: listOutputSchemas.delete,
	},
	'subscribers.list': {
		input: subscriberInputSchemas.list,
		output: subscriberOutputSchemas.list,
	},
	'subscribers.listForList': {
		input: subscriberInputSchemas.listForList,
		output: subscriberOutputSchemas.listForList,
	},
	'subscribers.get': {
		input: subscriberInputSchemas.get,
		output: subscriberOutputSchemas.get,
	},
	'subscribers.exists': {
		input: subscriberInputSchemas.exists,
		output: subscriberOutputSchemas.exists,
	},
	'subscribers.create': {
		input: subscriberInputSchemas.create,
		output: subscriberOutputSchemas.create,
	},
	'subscribers.associate': {
		input: subscriberInputSchemas.associate,
		output: subscriberOutputSchemas.associate,
	},
	'subscribers.removeFromList': {
		input: subscriberInputSchemas.removeFromList,
		output: subscriberOutputSchemas.removeFromList,
	},
	'subscribers.archive': {
		input: subscriberInputSchemas.archive,
		output: subscriberOutputSchemas.archive,
	},
	'subscribers.listUnsubscribed': {
		input: subscriberInputSchemas.listUnsubscribed,
		output: subscriberOutputSchemas.listUnsubscribed,
	},
	'subscribers.unsubscribe': {
		input: subscriberInputSchemas.unsubscribe,
		output: subscriberOutputSchemas.unsubscribe,
	},
	'subscribers.import': {
		input: subscriberInputSchemas.import,
		output: subscriberOutputSchemas.import,
	},
	'subscribers.importToList': {
		input: subscriberInputSchemas.importToList,
		output: subscriberOutputSchemas.importToList,
	},
	'subscribers.importCsv': {
		input: subscriberInputSchemas.importCsv,
		output: subscriberOutputSchemas.importCsv,
	},
	'subscribers.doubleOptIn': {
		input: subscriberInputSchemas.doubleOptIn,
		output: subscriberOutputSchemas.doubleOptIn,
	},
	'subscribers.listByOrigin': {
		input: subscriberInputSchemas.listByOrigin,
		output: subscriberOutputSchemas.listByOrigin,
	},
	'subscribers.permissionsHistory': {
		input: subscriberInputSchemas.permissionsHistory,
		output: subscriberOutputSchemas.permissionsHistory,
	},
	'subscribers.deliveries': {
		input: subscriberInputSchemas.deliveries,
		output: subscriberOutputSchemas.deliveries,
	},
	'subscribers.importUnsubscribed': {
		input: subscriberInputSchemas.importUnsubscribed,
		output: subscriberOutputSchemas.importUnsubscribed,
	},
	'campaigns.list': {
		input: campaignInputSchemas.list,
		output: campaignOutputSchemas.list,
	},
	'campaigns.create': {
		input: campaignInputSchemas.create,
		output: campaignOutputSchemas.create,
	},
	'campaigns.get': {
		input: campaignInputSchemas.get,
		output: campaignOutputSchemas.get,
	},
	'campaigns.update': {
		input: campaignInputSchemas.update,
		output: campaignOutputSchemas.update,
	},
	'campaigns.delete': {
		input: campaignInputSchemas.delete,
		output: campaignOutputSchemas.delete,
	},
	'campaigns.approve': {
		input: campaignInputSchemas.approve,
		output: campaignOutputSchemas.approve,
	},
	'campaigns.deliveries': {
		input: campaignInputSchemas.deliveries,
		output: campaignOutputSchemas.deliveries,
	},
	'campaigns.preview': {
		input: campaignInputSchemas.preview,
		output: campaignOutputSchemas.preview,
	},
	'campaigns.resultsSummary': {
		input: campaignInputSchemas.resultsSummary,
		output: campaignOutputSchemas.resultsSummary,
	},
	'campaigns.unsubscribed': {
		input: campaignInputSchemas.unsubscribed,
		output: campaignOutputSchemas.unsubscribed,
	},
	'campaigns.getContent': {
		input: campaignInputSchemas.getContent,
		output: campaignOutputSchemas.getContent,
	},
	'campaigns.updateContent': {
		input: campaignInputSchemas.updateContent,
		output: campaignOutputSchemas.updateContent,
	},
	'campaigns.getTextAlternative': {
		input: campaignInputSchemas.getTextAlternative,
		output: campaignOutputSchemas.getTextAlternative,
	},
	'campaigns.updateTextAlternative': {
		input: campaignInputSchemas.updateTextAlternative,
		output: campaignOutputSchemas.updateTextAlternative,
	},
	'campaigns.deleteTextAlternative': {
		input: campaignInputSchemas.deleteTextAlternative,
		output: campaignOutputSchemas.deleteTextAlternative,
	},
	'campaigns.getRecipients': {
		input: campaignInputSchemas.getRecipients,
		output: campaignOutputSchemas.getRecipients,
	},
	'campaigns.updateRecipients': {
		input: campaignInputSchemas.updateRecipients,
		output: campaignOutputSchemas.updateRecipients,
	},
	'campaigns.createShipping': {
		input: campaignInputSchemas.createShipping,
		output: campaignOutputSchemas.createShipping,
	},
	'campaigns.getShipping': {
		input: campaignInputSchemas.getShipping,
		output: campaignOutputSchemas.getShipping,
	},
	'campaigns.deleteShipping': {
		input: campaignInputSchemas.deleteShipping,
		output: campaignOutputSchemas.deleteShipping,
	},
	'campaigns.getSocial': {
		input: campaignInputSchemas.getSocial,
		output: campaignOutputSchemas.getSocial,
	},
	'campaigns.updateSocial': {
		input: campaignInputSchemas.updateSocial,
		output: campaignOutputSchemas.updateSocial,
	},
	'automations.list': {
		input: otherInputSchemas.automationList,
		output: otherOutputSchemas.automationList,
	},
	'automations.summary': {
		input: otherInputSchemas.automationSummary,
		output: otherOutputSchemas.automationSummary,
	},
	'automations.opensAndClicks': {
		input: otherInputSchemas.automationOpensAndClicks,
		output: otherOutputSchemas.automationOpensAndClicks,
	},
	'automations.deliverabilityRate': {
		input: otherInputSchemas.automationDeliverabilityRate,
		output: otherOutputSchemas.automationDeliverabilityRate,
	},
	'automations.linksTracking': {
		input: otherInputSchemas.automationLinksTracking,
		output: otherOutputSchemas.automationLinksTracking,
	},
	'automations.unsubscribeActivity': {
		input: otherInputSchemas.automationUnsubscribeActivity,
		output: otherOutputSchemas.automationUnsubscribeActivity,
	},
	'templates.create': {
		input: otherInputSchemas.templateCreate,
		output: otherOutputSchemas.templateCreate,
	},
	'templates.get': {
		input: otherInputSchemas.templateGet,
		output: otherOutputSchemas.templateGet,
	},
	'templates.updateContent': {
		input: otherInputSchemas.templateUpdateContent,
		output: otherOutputSchemas.templateUpdateContent,
	},
	'fields.list': {
		input: otherInputSchemas.fieldsList,
		output: otherOutputSchemas.fieldsList,
	},
	'home.get': {
		input: otherInputSchemas.home,
		output: otherOutputSchemas.home,
	},
	'home.account': {
		input: otherInputSchemas.accountHome,
		output: otherOutputSchemas.accountHome,
	},
	'tasks.list': {
		input: otherInputSchemas.tasksList,
		output: otherOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: otherInputSchemas.tasksGet,
		output: otherOutputSchemas.tasksGet,
	},
	'tasks.importErrors': {
		input: otherInputSchemas.tasksImportErrors,
		output: otherOutputSchemas.tasksImportErrors,
	},
	'integrations.get': {
		input: otherInputSchemas.integrationGet,
		output: otherOutputSchemas.integrationGet,
	},
	'integrations.update': {
		input: otherInputSchemas.integrationUpdate,
		output: otherOutputSchemas.integrationUpdate,
	},
	'integrations.delete': {
		input: otherInputSchemas.integrationDelete,
		output: otherOutputSchemas.integrationDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;

const endpointMeta = {
	'lists.list': { riskLevel: 'read', description: 'List subscriber lists' },
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a subscriber list',
	},
	'lists.get': { riskLevel: 'read', description: 'Get a subscriber list' },
	'lists.update': {
		riskLevel: 'write',
		description: 'Update a subscriber list',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a subscriber list',
	},
	'subscribers.list': {
		riskLevel: 'read',
		description: 'List account subscribers',
	},
	'subscribers.listForList': {
		riskLevel: 'read',
		description: 'List subscribers in a list',
	},
	'subscribers.get': { riskLevel: 'read', description: 'Get a subscriber' },
	'subscribers.exists': {
		riskLevel: 'read',
		description: 'Check whether a subscriber exists',
	},
	'subscribers.create': {
		riskLevel: 'write',
		description: 'Create or update a subscriber',
	},
	'subscribers.associate': {
		riskLevel: 'write',
		description: 'Associate a subscriber with a list',
	},
	'subscribers.removeFromList': {
		riskLevel: 'write',
		description: 'Remove a subscriber from a list',
	},
	'subscribers.archive': {
		riskLevel: 'write',
		description: 'Archive a subscriber',
	},
	'subscribers.listUnsubscribed': {
		riskLevel: 'read',
		description: 'List unsubscribed subscribers',
	},
	'subscribers.unsubscribe': {
		riskLevel: 'write',
		description: 'Unsubscribe a subscriber from the account',
	},
	'subscribers.import': {
		riskLevel: 'write',
		description: 'Import account subscribers',
	},
	'subscribers.importToList': {
		riskLevel: 'write',
		description: 'Import subscribers into a list',
	},
	'subscribers.importCsv': {
		riskLevel: 'write',
		description: 'Import subscribers from CSV',
	},
	'subscribers.doubleOptIn': {
		riskLevel: 'write',
		description: 'Associate a subscriber using double opt-in',
	},
	'subscribers.listByOrigin': {
		riskLevel: 'read',
		description: 'List subscribers by origin',
	},
	'subscribers.permissionsHistory': {
		riskLevel: 'read',
		description: 'Get subscriber permission history',
	},
	'subscribers.deliveries': {
		riskLevel: 'read',
		description: 'List subscriber campaign deliveries',
	},
	'subscribers.importUnsubscribed': {
		riskLevel: 'write',
		description: 'Import unsubscribed subscribers',
	},
	'campaigns.list': { riskLevel: 'read', description: 'List campaigns' },
	'campaigns.create': { riskLevel: 'write', description: 'Create a campaign' },
	'campaigns.get': { riskLevel: 'read', description: 'Get a campaign' },
	'campaigns.update': { riskLevel: 'write', description: 'Update a campaign' },
	'campaigns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a campaign',
	},
	'campaigns.approve': {
		riskLevel: 'write',
		description: 'Approve a campaign',
	},
	'campaigns.deliveries': {
		riskLevel: 'read',
		description: 'List campaign deliveries',
	},
	'campaigns.preview': {
		riskLevel: 'read',
		description: 'Preview campaign content',
	},
	'campaigns.resultsSummary': {
		riskLevel: 'read',
		description: 'Get campaign results',
	},
	'campaigns.unsubscribed': {
		riskLevel: 'read',
		description: 'List campaign unsubscribers',
	},
	'campaigns.getContent': {
		riskLevel: 'read',
		description: 'Get campaign HTML content',
	},
	'campaigns.updateContent': {
		riskLevel: 'write',
		description: 'Update campaign HTML content',
	},
	'campaigns.getTextAlternative': {
		riskLevel: 'read',
		description: 'Get campaign text alternative',
	},
	'campaigns.updateTextAlternative': {
		riskLevel: 'write',
		description: 'Update campaign text alternative',
	},
	'campaigns.deleteTextAlternative': {
		riskLevel: 'write',
		description: 'Delete campaign text alternative',
	},
	'campaigns.getRecipients': {
		riskLevel: 'read',
		description: 'Get campaign recipients',
	},
	'campaigns.updateRecipients': {
		riskLevel: 'write',
		description: 'Update campaign recipients',
	},
	'campaigns.createShipping': {
		riskLevel: 'write',
		description: 'Send or schedule a campaign',
	},
	'campaigns.getShipping': {
		riskLevel: 'read',
		description: 'Get a scheduled campaign delivery',
	},
	'campaigns.deleteShipping': {
		riskLevel: 'write',
		description: 'Cancel a scheduled campaign delivery',
	},
	'campaigns.getSocial': {
		riskLevel: 'read',
		description: 'Get campaign social preferences',
	},
	'campaigns.updateSocial': {
		riskLevel: 'write',
		description: 'Update campaign social preferences',
	},
	'automations.list': { riskLevel: 'read', description: 'List automations' },
	'automations.summary': {
		riskLevel: 'read',
		description: 'Get automation summary',
	},
	'automations.opensAndClicks': {
		riskLevel: 'read',
		description: 'List automation opens and clicks',
	},
	'automations.deliverabilityRate': {
		riskLevel: 'read',
		description: 'List automation deliverability',
	},
	'automations.linksTracking': {
		riskLevel: 'read',
		description: 'List automation link tracking',
	},
	'automations.unsubscribeActivity': {
		riskLevel: 'read',
		description: 'List automation unsubscribe activity',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a double opt-in template',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get a double opt-in template',
	},
	'templates.updateContent': {
		riskLevel: 'write',
		description: 'Update double opt-in template HTML',
	},
	'fields.list': {
		riskLevel: 'read',
		description: 'List subscriber field definitions',
	},
	'home.get': { riskLevel: 'read', description: 'Get the API home' },
	'home.account': {
		riskLevel: 'read',
		description: 'Get the account API home',
	},
	'tasks.list': { riskLevel: 'read', description: 'List account tasks' },
	'tasks.get': { riskLevel: 'read', description: 'Get a task' },
	'tasks.importErrors': {
		riskLevel: 'read',
		description: 'List task import errors',
	},
	'integrations.get': {
		riskLevel: 'read',
		description: 'Get integration access',
	},
	'integrations.update': {
		riskLevel: 'write',
		description: 'Update integration access',
	},
	'integrations.delete': {
		riskLevel: 'destructive',
		description: 'Delete integration access',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;

const defaultAuthType = 'api_key' as const;
export const dopplerMarketingAutomationAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
export type BaseDopplerMarketingAutomationPlugin<
	T extends DopplerMarketingAutomationPluginOptions,
> = CorsairPlugin<
	'dopplermarketingautomation',
	typeof DopplerMarketingAutomationSchema,
	typeof endpoints,
	{},
	T,
	typeof defaultAuthType,
	typeof dopplerMarketingAutomationAuthConfig
>;
export type InternalDopplerMarketingAutomationPlugin =
	BaseDopplerMarketingAutomationPlugin<DopplerMarketingAutomationPluginOptions>;

export function dopplermarketingautomation<
	const T extends DopplerMarketingAutomationPluginOptions,
>(
	incomingOptions: DopplerMarketingAutomationPluginOptions &
		T = {} as DopplerMarketingAutomationPluginOptions & T,
): BaseDopplerMarketingAutomationPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dopplermarketingautomation',
		authConfig: dopplerMarketingAutomationAuthConfig,
		schema: DopplerMarketingAutomationSchema,
		options,
		hooks: options.hooks,
		endpoints,
		endpointMeta,
		endpointSchemas: dopplerMarketingAutomationEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (
			ctx: KeyBuilderContext<DopplerMarketingAutomationPluginOptions>,
			source,
		) => {
			if (source !== 'endpoint') return '';
			const key = options.key ?? (await ctx.keys.get_api_key());
			if (!key?.trim())
				throw new AuthMissingError('dopplermarketingautomation', 'api_key');
			return key;
		},
	} satisfies InternalDopplerMarketingAutomationPlugin;
}

export * from './endpoints/types';
