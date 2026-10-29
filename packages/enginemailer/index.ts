import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
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
	campaignEndpoints,
	n8nEndpoints,
	subscriberEndpoints,
} from './endpoints';
import type {
	EnginemailerEndpointInputs,
	EnginemailerEndpointOutputs,
} from './endpoints/types';
import {
	EnginemailerEndpointInputSchemas,
	EnginemailerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EnginemailerSchema } from './schema';

export type EnginemailerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEnginemailerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof enginemailerEndpointsNested>;
};

export type EnginemailerContext = CorsairPluginContext<
	typeof EnginemailerSchema,
	EnginemailerPluginOptions
>;
export type EnginemailerKeyBuilderContext =
	KeyBuilderContext<EnginemailerPluginOptions>;
export type EnginemailerBoundEndpoints = BindEndpoints<
	typeof enginemailerEndpointsNested
>;

type EnginemailerEndpoint<K extends keyof EnginemailerEndpointOutputs> =
	CorsairEndpoint<
		EnginemailerContext,
		EnginemailerEndpointInputs[K],
		EnginemailerEndpointOutputs[K]
	>;

export type EnginemailerSubscriberEndpoints = {
	get: EnginemailerEndpoint<'getSubscriber'>;
	activate: EnginemailerEndpoint<'activateSubscriber'>;
	insert: EnginemailerEndpoint<'insertSubscriber'>;
	update: EnginemailerEndpoint<'updateSubscriber'>;
	unsubscribe: EnginemailerEndpoint<'unsubscribeSubscriber'>;
	getSubcategories: EnginemailerEndpoint<'getSubcategories'>;
	updateCategory: EnginemailerEndpoint<'updateCategory'>;
	getCustomFields: EnginemailerEndpoint<'getCustomFields'>;
	batchUpdateSubscribers: EnginemailerEndpoint<'batchUpdateSubscribers'>;
	batchUpdateStatus: EnginemailerEndpoint<'batchUpdateStatus'>;
	deleteSubscriber: EnginemailerEndpoint<'deleteSubscriber'>;
};

export type EnginemailerCampaignEndpoints = {
	listCampaigns: EnginemailerEndpoint<'listCampaigns'>;
	createCampaign: EnginemailerEndpoint<'createCampaign'>;
	updateCampaign: EnginemailerEndpoint<'updateCampaign'>;
	deleteCampaign: EnginemailerEndpoint<'deleteCampaign'>;
	assignRecipientList: EnginemailerEndpoint<'assignRecipientList'>;
	deleteRecipientList: EnginemailerEndpoint<'deleteRecipientList'>;
	pauseCampaign: EnginemailerEndpoint<'pauseCampaign'>;
	sendCampaign: EnginemailerEndpoint<'sendCampaign'>;
};

export type EnginemailerN8nEndpoints = {
	addOrUpdateSubscriber: EnginemailerEndpoint<'addOrUpdateSubscriber'>;
	deactivateSubscriber: EnginemailerEndpoint<'deactivateSubscriber'>;
	deleteN8nSubscriber: EnginemailerEndpoint<'deleteN8nSubscriber'>;
	findSubscriber: EnginemailerEndpoint<'findSubscriber'>;
	sendEmail: EnginemailerEndpoint<'sendEmail'>;
	tagSubscriber: EnginemailerEndpoint<'tagSubscriber'>;
	untagSubscriber: EnginemailerEndpoint<'untagSubscriber'>;
	newSubscribers: EnginemailerEndpoint<'newSubscribers'>;
	unsubscribedSubscribers: EnginemailerEndpoint<'unsubscribedSubscribers'>;
	taggedSubscribers: EnginemailerEndpoint<'taggedSubscribers'>;
	deletedSubscribers: EnginemailerEndpoint<'deletedSubscribers'>;
	untaggedSubscribers: EnginemailerEndpoint<'untaggedSubscribers'>;
	modifiedSubscribers: EnginemailerEndpoint<'modifiedSubscribers'>;
	autoresponderTriggered: EnginemailerEndpoint<'autoresponderTriggered'>;
	autoresponderCompleted: EnginemailerEndpoint<'autoresponderCompleted'>;
	connect: EnginemailerEndpoint<'connect'>;
	listForms: EnginemailerEndpoint<'listForms'>;
	listPages: EnginemailerEndpoint<'listPages'>;
	listPopups: EnginemailerEndpoint<'listPopups'>;
};

export type EnginemailerEndpoints = EnginemailerSubscriberEndpoints &
	EnginemailerCampaignEndpoints &
	EnginemailerN8nEndpoints;

const enginemailerEndpointsNested = {
	subscribers: subscriberEndpoints,
	campaigns: campaignEndpoints,
	n8n: n8nEndpoints,
} as const;

export const enginemailerEndpointSchemas = {
	'subscribers.get': {
		input: EnginemailerEndpointInputSchemas.getSubscriber,
		output: EnginemailerEndpointOutputSchemas.getSubscriber,
	},
	'subscribers.activate': {
		input: EnginemailerEndpointInputSchemas.activateSubscriber,
		output: EnginemailerEndpointOutputSchemas.activateSubscriber,
	},
	'subscribers.insert': {
		input: EnginemailerEndpointInputSchemas.insertSubscriber,
		output: EnginemailerEndpointOutputSchemas.insertSubscriber,
	},
	'subscribers.update': {
		input: EnginemailerEndpointInputSchemas.updateSubscriber,
		output: EnginemailerEndpointOutputSchemas.updateSubscriber,
	},
	'subscribers.unsubscribe': {
		input: EnginemailerEndpointInputSchemas.unsubscribeSubscriber,
		output: EnginemailerEndpointOutputSchemas.unsubscribeSubscriber,
	},
	'subscribers.getSubcategories': {
		input: EnginemailerEndpointInputSchemas.getSubcategories,
		output: EnginemailerEndpointOutputSchemas.getSubcategories,
	},
	'subscribers.updateCategory': {
		input: EnginemailerEndpointInputSchemas.updateCategory,
		output: EnginemailerEndpointOutputSchemas.updateCategory,
	},
	'subscribers.getCustomFields': {
		input: EnginemailerEndpointInputSchemas.getCustomFields,
		output: EnginemailerEndpointOutputSchemas.getCustomFields,
	},
	'subscribers.batchUpdateSubscribers': {
		input: EnginemailerEndpointInputSchemas.batchUpdateSubscribers,
		output: EnginemailerEndpointOutputSchemas.batchUpdateSubscribers,
	},
	'subscribers.batchUpdateStatus': {
		input: EnginemailerEndpointInputSchemas.batchUpdateStatus,
		output: EnginemailerEndpointOutputSchemas.batchUpdateStatus,
	},
	'subscribers.deleteSubscriber': {
		input: EnginemailerEndpointInputSchemas.deleteSubscriber,
		output: EnginemailerEndpointOutputSchemas.deleteSubscriber,
	},
	'campaigns.listCampaigns': {
		input: EnginemailerEndpointInputSchemas.listCampaigns,
		output: EnginemailerEndpointOutputSchemas.listCampaigns,
	},
	'campaigns.createCampaign': {
		input: EnginemailerEndpointInputSchemas.createCampaign,
		output: EnginemailerEndpointOutputSchemas.createCampaign,
	},
	'campaigns.updateCampaign': {
		input: EnginemailerEndpointInputSchemas.updateCampaign,
		output: EnginemailerEndpointOutputSchemas.updateCampaign,
	},
	'campaigns.deleteCampaign': {
		input: EnginemailerEndpointInputSchemas.deleteCampaign,
		output: EnginemailerEndpointOutputSchemas.deleteCampaign,
	},
	'campaigns.assignRecipientList': {
		input: EnginemailerEndpointInputSchemas.assignRecipientList,
		output: EnginemailerEndpointOutputSchemas.assignRecipientList,
	},
	'campaigns.deleteRecipientList': {
		input: EnginemailerEndpointInputSchemas.deleteRecipientList,
		output: EnginemailerEndpointOutputSchemas.deleteRecipientList,
	},
	'campaigns.pauseCampaign': {
		input: EnginemailerEndpointInputSchemas.pauseCampaign,
		output: EnginemailerEndpointOutputSchemas.pauseCampaign,
	},
	'campaigns.sendCampaign': {
		input: EnginemailerEndpointInputSchemas.sendCampaign,
		output: EnginemailerEndpointOutputSchemas.sendCampaign,
	},
	'n8n.addOrUpdateSubscriber': {
		input: EnginemailerEndpointInputSchemas.addOrUpdateSubscriber,
		output: EnginemailerEndpointOutputSchemas.addOrUpdateSubscriber,
	},
	'n8n.deactivateSubscriber': {
		input: EnginemailerEndpointInputSchemas.deactivateSubscriber,
		output: EnginemailerEndpointOutputSchemas.deactivateSubscriber,
	},
	'n8n.deleteN8nSubscriber': {
		input: EnginemailerEndpointInputSchemas.deleteN8nSubscriber,
		output: EnginemailerEndpointOutputSchemas.deleteN8nSubscriber,
	},
	'n8n.findSubscriber': {
		input: EnginemailerEndpointInputSchemas.findSubscriber,
		output: EnginemailerEndpointOutputSchemas.findSubscriber,
	},
	'n8n.sendEmail': {
		input: EnginemailerEndpointInputSchemas.sendEmail,
		output: EnginemailerEndpointOutputSchemas.sendEmail,
	},
	'n8n.tagSubscriber': {
		input: EnginemailerEndpointInputSchemas.tagSubscriber,
		output: EnginemailerEndpointOutputSchemas.tagSubscriber,
	},
	'n8n.untagSubscriber': {
		input: EnginemailerEndpointInputSchemas.untagSubscriber,
		output: EnginemailerEndpointOutputSchemas.untagSubscriber,
	},
	'n8n.newSubscribers': {
		input: EnginemailerEndpointInputSchemas.newSubscribers,
		output: EnginemailerEndpointOutputSchemas.newSubscribers,
	},
	'n8n.unsubscribedSubscribers': {
		input: EnginemailerEndpointInputSchemas.unsubscribedSubscribers,
		output: EnginemailerEndpointOutputSchemas.unsubscribedSubscribers,
	},
	'n8n.taggedSubscribers': {
		input: EnginemailerEndpointInputSchemas.taggedSubscribers,
		output: EnginemailerEndpointOutputSchemas.taggedSubscribers,
	},
	'n8n.deletedSubscribers': {
		input: EnginemailerEndpointInputSchemas.deletedSubscribers,
		output: EnginemailerEndpointOutputSchemas.deletedSubscribers,
	},
	'n8n.untaggedSubscribers': {
		input: EnginemailerEndpointInputSchemas.untaggedSubscribers,
		output: EnginemailerEndpointOutputSchemas.untaggedSubscribers,
	},
	'n8n.modifiedSubscribers': {
		input: EnginemailerEndpointInputSchemas.modifiedSubscribers,
		output: EnginemailerEndpointOutputSchemas.modifiedSubscribers,
	},
	'n8n.autoresponderTriggered': {
		input: EnginemailerEndpointInputSchemas.autoresponderTriggered,
		output: EnginemailerEndpointOutputSchemas.autoresponderTriggered,
	},
	'n8n.autoresponderCompleted': {
		input: EnginemailerEndpointInputSchemas.autoresponderCompleted,
		output: EnginemailerEndpointOutputSchemas.autoresponderCompleted,
	},
	'n8n.connect': {
		input: EnginemailerEndpointInputSchemas.connect,
		output: EnginemailerEndpointOutputSchemas.connect,
	},
	'n8n.listForms': {
		input: EnginemailerEndpointInputSchemas.listForms,
		output: EnginemailerEndpointOutputSchemas.listForms,
	},
	'n8n.listPages': {
		input: EnginemailerEndpointInputSchemas.listPages,
		output: EnginemailerEndpointOutputSchemas.listPages,
	},
	'n8n.listPopups': {
		input: EnginemailerEndpointInputSchemas.listPopups,
		output: EnginemailerEndpointOutputSchemas.listPopups,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof enginemailerEndpointsNested
>;

const enginemailerEndpointMeta = {
	'subscribers.get': {
		riskLevel: 'read',
		description: 'Retrieve a subscriber by email address',
	},
	'subscribers.activate': {
		riskLevel: 'write',
		description: 'Activate a subscriber',
	},
	'subscribers.insert': {
		riskLevel: 'write',
		description: 'Insert a subscriber into Enginemailer',
	},
	'subscribers.update': {
		riskLevel: 'write',
		description: 'Update a subscriber record',
	},
	'subscribers.unsubscribe': {
		riskLevel: 'write',
		description: 'Unsubscribe a subscriber',
	},
	'subscribers.getSubcategories': {
		riskLevel: 'read',
		description: 'List subscriber subcategories',
	},
	'subscribers.updateCategory': {
		riskLevel: 'write',
		description: 'Create or update a subscriber category',
	},
	'subscribers.getCustomFields': {
		riskLevel: 'read',
		description: 'List subscriber custom fields',
	},
	'subscribers.batchUpdateSubscribers': {
		riskLevel: 'write',
		description: 'Update subscribers in a batch',
	},
	'subscribers.batchUpdateStatus': {
		riskLevel: 'write',
		description: 'Update subscriber status in a batch',
	},
	'subscribers.deleteSubscriber': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a subscriber',
	},
	'campaigns.listCampaigns': {
		riskLevel: 'read',
		description: 'List campaigns',
	},
	'campaigns.createCampaign': {
		riskLevel: 'write',
		description: 'Create an email campaign',
	},
	'campaigns.updateCampaign': {
		riskLevel: 'write',
		description: 'Update an email campaign',
	},
	'campaigns.deleteCampaign': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an email campaign',
	},
	'campaigns.assignRecipientList': {
		riskLevel: 'write',
		description: 'Assign a recipient list to a campaign',
	},
	'campaigns.deleteRecipientList': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a recipient list from a campaign',
	},
	'campaigns.pauseCampaign': {
		riskLevel: 'write',
		description: 'Pause an email campaign',
	},
	'campaigns.sendCampaign': {
		riskLevel: 'write',
		description: 'Send an email campaign',
	},
	'n8n.addOrUpdateSubscriber': {
		riskLevel: 'write',
		description: 'Add or update a subscriber through Enginemailer N8N',
	},
	'n8n.deactivateSubscriber': {
		riskLevel: 'write',
		description: 'Unsubscribe a subscriber through Enginemailer N8N',
	},
	'n8n.deleteN8nSubscriber': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a subscriber through Enginemailer N8N',
	},
	'n8n.findSubscriber': {
		riskLevel: 'read',
		description: 'Find a subscriber through Enginemailer N8N',
	},
	'n8n.sendEmail': {
		riskLevel: 'write',
		description: 'Send an email through Enginemailer N8N',
	},
	'n8n.tagSubscriber': {
		riskLevel: 'write',
		description: 'Tag a subscriber through Enginemailer N8N',
	},
	'n8n.untagSubscriber': {
		riskLevel: 'write',
		description: 'Remove a tag from a subscriber through Enginemailer N8N',
	},
	'n8n.newSubscribers': {
		riskLevel: 'read',
		description: 'List new subscribers through Enginemailer N8N',
	},
	'n8n.unsubscribedSubscribers': {
		riskLevel: 'read',
		description: 'List unsubscribed subscribers through Enginemailer N8N',
	},
	'n8n.taggedSubscribers': {
		riskLevel: 'read',
		description: 'List tagged subscribers through Enginemailer N8N',
	},
	'n8n.deletedSubscribers': {
		riskLevel: 'read',
		description: 'List deleted subscribers through Enginemailer N8N',
	},
	'n8n.untaggedSubscribers': {
		riskLevel: 'read',
		description: 'List untagged subscribers through Enginemailer N8N',
	},
	'n8n.modifiedSubscribers': {
		riskLevel: 'read',
		description: 'List modified subscribers through Enginemailer N8N',
	},
	'n8n.autoresponderTriggered': {
		riskLevel: 'read',
		description: 'List subscribers who triggered an autoresponder',
	},
	'n8n.autoresponderCompleted': {
		riskLevel: 'read',
		description: 'List subscribers who completed an autoresponder',
	},
	'n8n.connect': {
		riskLevel: 'read',
		description: 'Test the Enginemailer N8N connection',
	},
	'n8n.listForms': {
		riskLevel: 'read',
		description: 'List Enginemailer forms through N8N',
	},
	'n8n.listPages': {
		riskLevel: 'read',
		description: 'List Enginemailer pages through N8N',
	},
	'n8n.listPopups': {
		riskLevel: 'read',
		description: 'List Enginemailer popups through N8N',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof enginemailerEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

export const enginemailerAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseEnginemailerPlugin<T extends EnginemailerPluginOptions> =
	CorsairPlugin<
		'enginemailer',
		typeof EnginemailerSchema,
		typeof enginemailerEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof enginemailerAuthConfig
	>;
export type InternalEnginemailerPlugin =
	BaseEnginemailerPlugin<EnginemailerPluginOptions>;
export type ExternalEnginemailerPlugin<T extends EnginemailerPluginOptions> =
	BaseEnginemailerPlugin<T>;

export function enginemailer<const T extends EnginemailerPluginOptions>(
	incomingOptions: EnginemailerPluginOptions &
		T = {} as EnginemailerPluginOptions & T,
): ExternalEnginemailerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'enginemailer',
		authConfig: enginemailerAuthConfig,
		schema: EnginemailerSchema,
		options,
		hooks: options.hooks,
		endpoints: enginemailerEndpointsNested,
		endpointMeta: enginemailerEndpointMeta,
		endpointSchemas: enginemailerEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: EnginemailerKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('enginemailer', 'api_key');
			return key;
		},
	} satisfies InternalEnginemailerPlugin;
}

export type {
	EnginemailerEndpointInputs,
	EnginemailerEndpointOutputs,
} from './endpoints/types';
