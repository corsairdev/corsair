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
	Agency,
	Assistants,
	Contacts,
	Datasources,
	Forms,
	Providers,
	Tools,
	WebhooksTelephony,
	Widgets,
} from './endpoints';
import type {
	InsightoaiEndpointInputs,
	InsightoaiEndpointOutputs,
} from './endpoints/types';
import {
	InsightoaiEndpointInputSchemas,
	InsightoaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { InsightoaiSchema } from './schema';

export type InsightoaiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalInsightoaiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof insightoaiEndpointsNested>;
};

export type InsightoaiContext = CorsairPluginContext<
	typeof InsightoaiSchema,
	InsightoaiPluginOptions
>;

export type InsightoaiKeyBuilderContext =
	KeyBuilderContext<InsightoaiPluginOptions>;

export type InsightoaiBoundEndpoints = BindEndpoints<
	typeof insightoaiEndpointsNested
>;

type InsightoaiEndpoint<K extends keyof InsightoaiEndpointOutputs> =
	CorsairEndpoint<
		InsightoaiContext,
		InsightoaiEndpointInputs[K],
		InsightoaiEndpointOutputs[K]
	>;

export type InsightoaiEndpoints = {
	getAssistantById: InsightoaiEndpoint<'getAssistantById'>;
	deleteAssistantById: InsightoaiEndpoint<'deleteAssistantById'>;
	addIntentToAssistant: InsightoaiEndpoint<'addIntentToAssistant'>;
	createIntent: InsightoaiEndpoint<'createIntent'>;
	getIntentById: InsightoaiEndpoint<'getIntentById'>;
	readIntentsList: InsightoaiEndpoint<'readIntentsList'>;
	createPrompt: InsightoaiEndpoint<'createPrompt'>;
	getPromptById: InsightoaiEndpoint<'getPromptById'>;
	deletePromptById: InsightoaiEndpoint<'deletePromptById'>;

	createProvider: InsightoaiEndpoint<'createProvider'>;
	getProviderById: InsightoaiEndpoint<'getProviderById'>;
	deleteProviderById: InsightoaiEndpoint<'deleteProviderById'>;
	getSpeechtotextList: InsightoaiEndpoint<'getSpeechtotextList'>;
	retrieveListOfUserCustomVoice: InsightoaiEndpoint<'retrieveListOfUserCustomVoice'>;

	getContactById: InsightoaiEndpoint<'getContactById'>;
	getListOfContacts: InsightoaiEndpoint<'getListOfContacts'>;
	upsertContactByEmailOrPhoneNumber: InsightoaiEndpoint<'upsertContactByEmailOrPhoneNumber'>;
	deleteContactsInBulk: InsightoaiEndpoint<'deleteContactsInBulk'>;
	createContactCustomField: InsightoaiEndpoint<'createContactCustomField'>;
	readContactCustomFieldList: InsightoaiEndpoint<'readContactCustomFieldList'>;
	readCampaignContactList: InsightoaiEndpoint<'readCampaignContactList'>;
	sendMessagesToContacts: InsightoaiEndpoint<'sendMessagesToContacts'>;
	readContactSyncLogList: InsightoaiEndpoint<'readContactSyncLogList'>;

	createForm: InsightoaiEndpoint<'createForm'>;
	getCapturedFormByFormId: InsightoaiEndpoint<'getCapturedFormByFormId'>;
	deleteFormById: InsightoaiEndpoint<'deleteFormById'>;
	deleteBulkFormsByIds: InsightoaiEndpoint<'deleteBulkFormsByIds'>;

	createToolfunction: InsightoaiEndpoint<'createToolfunction'>;
	updateToolfunctionById: InsightoaiEndpoint<'updateToolfunctionById'>;
	deleteToolfunctionById: InsightoaiEndpoint<'deleteToolfunctionById'>;
	readToolToolfunctionList: InsightoaiEndpoint<'readToolToolfunctionList'>;
	updateToolById: InsightoaiEndpoint<'updateToolById'>;
	deleteToolById: InsightoaiEndpoint<'deleteToolById'>;
	readToolFunctionInvokeLogList: InsightoaiEndpoint<'readToolFunctionInvokeLogList'>;
	retrieveLinkedToolAndUser: InsightoaiEndpoint<'retrieveLinkedToolAndUser'>;
	updateLinkToolUser: InsightoaiEndpoint<'updateLinkToolUser'>;

	createWidget: InsightoaiEndpoint<'createWidget'>;
	getWidgetById: InsightoaiEndpoint<'getWidgetById'>;
	deleteWidgetById: InsightoaiEndpoint<'deleteWidgetById'>;
	getListOfWidgetsLinkedToAssistantId: InsightoaiEndpoint<'getListOfWidgetsLinkedToAssistantId'>;
	listChannels: InsightoaiEndpoint<'listChannels'>;
	getListOfConversations: InsightoaiEndpoint<'getListOfConversations'>;

	getDatasourceById: InsightoaiEndpoint<'getDatasourceById'>;
	getListOfDatasources: InsightoaiEndpoint<'getListOfDatasources'>;
	getListOfDataSourcesLinkedToAssistantId: InsightoaiEndpoint<'getListOfDataSourcesLinkedToAssistantId'>;
	deleteLinkedAssistantDatasource: InsightoaiEndpoint<'deleteLinkedAssistantDatasource'>;
	createTag: InsightoaiEndpoint<'createTag'>;
	readTagList: InsightoaiEndpoint<'readTagList'>;
	deleteTagById: InsightoaiEndpoint<'deleteTagById'>;
	deleteLinkTagEntityById: InsightoaiEndpoint<'deleteLinkTagEntityById'>;

	createWebhook: InsightoaiEndpoint<'createWebhook'>;
	updateWebhookById: InsightoaiEndpoint<'updateWebhookById'>;
	deleteWebhookById: InsightoaiEndpoint<'deleteWebhookById'>;
	retrieveWebhookLog: InsightoaiEndpoint<'retrieveWebhookLog'>;
	readTwilioAuthList: InsightoaiEndpoint<'readTwilioAuthList'>;
	updateTwilioAuthById: InsightoaiEndpoint<'updateTwilioAuthById'>;
	deleteTwilioAuthById: InsightoaiEndpoint<'deleteTwilioAuthById'>;
	updateUserwhatsappById: InsightoaiEndpoint<'updateUserwhatsappById'>;
	deleteUserwhatsappById: InsightoaiEndpoint<'deleteUserwhatsappById'>;

	createAgency: InsightoaiEndpoint<'createAgency'>;
	getAgencyBrandingById: InsightoaiEndpoint<'getAgencyBrandingById'>;
	getAgencyBillingPlan: InsightoaiEndpoint<'getAgencyBillingPlan'>;
	getPricingForUser: InsightoaiEndpoint<'getPricingForUser'>;
	getAgentList: InsightoaiEndpoint<'getAgentList'>;
	updateUserProfile: InsightoaiEndpoint<'updateUserProfile'>;
	retrieveUserMonthlyUsagesAggregation: InsightoaiEndpoint<'retrieveUserMonthlyUsagesAggregation'>;
};

const insightoaiEndpointsNested = {
	assistants: {
		getAssistantById: Assistants.getAssistantById,
		deleteAssistantById: Assistants.deleteAssistantById,
		addIntentToAssistant: Assistants.addIntentToAssistant,
		createIntent: Assistants.createIntent,
		getIntentById: Assistants.getIntentById,
		readIntentsList: Assistants.readIntentsList,
		createPrompt: Assistants.createPrompt,
		getPromptById: Assistants.getPromptById,
		deletePromptById: Assistants.deletePromptById,
	},
	providers: {
		createProvider: Providers.createProvider,
		getProviderById: Providers.getProviderById,
		deleteProviderById: Providers.deleteProviderById,
		getSpeechtotextList: Providers.getSpeechtotextList,
		retrieveListOfUserCustomVoice: Providers.retrieveListOfUserCustomVoice,
	},
	contacts: {
		getContactById: Contacts.getContactById,
		getListOfContacts: Contacts.getListOfContacts,
		upsertContactByEmailOrPhoneNumber:
			Contacts.upsertContactByEmailOrPhoneNumber,
		deleteContactsInBulk: Contacts.deleteContactsInBulk,
		createContactCustomField: Contacts.createContactCustomField,
		readContactCustomFieldList: Contacts.readContactCustomFieldList,
		readCampaignContactList: Contacts.readCampaignContactList,
		sendMessagesToContacts: Contacts.sendMessagesToContacts,
		readContactSyncLogList: Contacts.readContactSyncLogList,
	},
	forms: {
		createForm: Forms.createForm,
		getCapturedFormByFormId: Forms.getCapturedFormByFormId,
		deleteFormById: Forms.deleteFormById,
		deleteBulkFormsByIds: Forms.deleteBulkFormsByIds,
	},
	tools: {
		createToolfunction: Tools.createToolfunction,
		updateToolfunctionById: Tools.updateToolfunctionById,
		deleteToolfunctionById: Tools.deleteToolfunctionById,
		readToolToolfunctionList: Tools.readToolToolfunctionList,
		updateToolById: Tools.updateToolById,
		deleteToolById: Tools.deleteToolById,
		readToolFunctionInvokeLogList: Tools.readToolFunctionInvokeLogList,
		retrieveLinkedToolAndUser: Tools.retrieveLinkedToolAndUser,
		updateLinkToolUser: Tools.updateLinkToolUser,
	},
	widgets: {
		createWidget: Widgets.createWidget,
		getWidgetById: Widgets.getWidgetById,
		deleteWidgetById: Widgets.deleteWidgetById,
		getListOfWidgetsLinkedToAssistantId:
			Widgets.getListOfWidgetsLinkedToAssistantId,
		listChannels: Widgets.listChannels,
		getListOfConversations: Widgets.getListOfConversations,
	},
	datasources: {
		getDatasourceById: Datasources.getDatasourceById,
		getListOfDatasources: Datasources.getListOfDatasources,
		getListOfDataSourcesLinkedToAssistantId:
			Datasources.getListOfDataSourcesLinkedToAssistantId,
		deleteLinkedAssistantDatasource:
			Datasources.deleteLinkedAssistantDatasource,
		createTag: Datasources.createTag,
		readTagList: Datasources.readTagList,
		deleteTagById: Datasources.deleteTagById,
		deleteLinkTagEntityById: Datasources.deleteLinkTagEntityById,
	},
	webhooksTelephony: {
		createWebhook: WebhooksTelephony.createWebhook,
		updateWebhookById: WebhooksTelephony.updateWebhookById,
		deleteWebhookById: WebhooksTelephony.deleteWebhookById,
		retrieveWebhookLog: WebhooksTelephony.retrieveWebhookLog,
		readTwilioAuthList: WebhooksTelephony.readTwilioAuthList,
		updateTwilioAuthById: WebhooksTelephony.updateTwilioAuthById,
		deleteTwilioAuthById: WebhooksTelephony.deleteTwilioAuthById,
		updateUserwhatsappById: WebhooksTelephony.updateUserwhatsappById,
		deleteUserwhatsappById: WebhooksTelephony.deleteUserwhatsappById,
	},
	agency: {
		createAgency: Agency.createAgency,
		getAgencyBrandingById: Agency.getAgencyBrandingById,
		getAgencyBillingPlan: Agency.getAgencyBillingPlan,
		getPricingForUser: Agency.getPricingForUser,
		getAgentList: Agency.getAgentList,
		updateUserProfile: Agency.updateUserProfile,
		retrieveUserMonthlyUsagesAggregation:
			Agency.retrieveUserMonthlyUsagesAggregation,
	},
} as const;

export const insightoaiEndpointSchemas = {
	'assistants.getAssistantById': {
		input: InsightoaiEndpointInputSchemas.getAssistantById,
		output: InsightoaiEndpointOutputSchemas.getAssistantById,
	},
	'assistants.deleteAssistantById': {
		input: InsightoaiEndpointInputSchemas.deleteAssistantById,
		output: InsightoaiEndpointOutputSchemas.deleteAssistantById,
	},
	'assistants.addIntentToAssistant': {
		input: InsightoaiEndpointInputSchemas.addIntentToAssistant,
		output: InsightoaiEndpointOutputSchemas.addIntentToAssistant,
	},
	'assistants.createIntent': {
		input: InsightoaiEndpointInputSchemas.createIntent,
		output: InsightoaiEndpointOutputSchemas.createIntent,
	},
	'assistants.getIntentById': {
		input: InsightoaiEndpointInputSchemas.getIntentById,
		output: InsightoaiEndpointOutputSchemas.getIntentById,
	},
	'assistants.readIntentsList': {
		input: InsightoaiEndpointInputSchemas.readIntentsList,
		output: InsightoaiEndpointOutputSchemas.readIntentsList,
	},
	'assistants.createPrompt': {
		input: InsightoaiEndpointInputSchemas.createPrompt,
		output: InsightoaiEndpointOutputSchemas.createPrompt,
	},
	'assistants.getPromptById': {
		input: InsightoaiEndpointInputSchemas.getPromptById,
		output: InsightoaiEndpointOutputSchemas.getPromptById,
	},
	'assistants.deletePromptById': {
		input: InsightoaiEndpointInputSchemas.deletePromptById,
		output: InsightoaiEndpointOutputSchemas.deletePromptById,
	},

	'providers.createProvider': {
		input: InsightoaiEndpointInputSchemas.createProvider,
		output: InsightoaiEndpointOutputSchemas.createProvider,
	},
	'providers.getProviderById': {
		input: InsightoaiEndpointInputSchemas.getProviderById,
		output: InsightoaiEndpointOutputSchemas.getProviderById,
	},
	'providers.deleteProviderById': {
		input: InsightoaiEndpointInputSchemas.deleteProviderById,
		output: InsightoaiEndpointOutputSchemas.deleteProviderById,
	},
	'providers.getSpeechtotextList': {
		input: InsightoaiEndpointInputSchemas.getSpeechtotextList,
		output: InsightoaiEndpointOutputSchemas.getSpeechtotextList,
	},
	'providers.retrieveListOfUserCustomVoice': {
		input: InsightoaiEndpointInputSchemas.retrieveListOfUserCustomVoice,
		output: InsightoaiEndpointOutputSchemas.retrieveListOfUserCustomVoice,
	},

	'contacts.getContactById': {
		input: InsightoaiEndpointInputSchemas.getContactById,
		output: InsightoaiEndpointOutputSchemas.getContactById,
	},
	'contacts.getListOfContacts': {
		input: InsightoaiEndpointInputSchemas.getListOfContacts,
		output: InsightoaiEndpointOutputSchemas.getListOfContacts,
	},
	'contacts.upsertContactByEmailOrPhoneNumber': {
		input: InsightoaiEndpointInputSchemas.upsertContactByEmailOrPhoneNumber,
		output: InsightoaiEndpointOutputSchemas.upsertContactByEmailOrPhoneNumber,
	},
	'contacts.deleteContactsInBulk': {
		input: InsightoaiEndpointInputSchemas.deleteContactsInBulk,
		output: InsightoaiEndpointOutputSchemas.deleteContactsInBulk,
	},
	'contacts.createContactCustomField': {
		input: InsightoaiEndpointInputSchemas.createContactCustomField,
		output: InsightoaiEndpointOutputSchemas.createContactCustomField,
	},
	'contacts.readContactCustomFieldList': {
		input: InsightoaiEndpointInputSchemas.readContactCustomFieldList,
		output: InsightoaiEndpointOutputSchemas.readContactCustomFieldList,
	},
	'contacts.readCampaignContactList': {
		input: InsightoaiEndpointInputSchemas.readCampaignContactList,
		output: InsightoaiEndpointOutputSchemas.readCampaignContactList,
	},
	'contacts.sendMessagesToContacts': {
		input: InsightoaiEndpointInputSchemas.sendMessagesToContacts,
		output: InsightoaiEndpointOutputSchemas.sendMessagesToContacts,
	},
	'contacts.readContactSyncLogList': {
		input: InsightoaiEndpointInputSchemas.readContactSyncLogList,
		output: InsightoaiEndpointOutputSchemas.readContactSyncLogList,
	},

	'forms.createForm': {
		input: InsightoaiEndpointInputSchemas.createForm,
		output: InsightoaiEndpointOutputSchemas.createForm,
	},
	'forms.getCapturedFormByFormId': {
		input: InsightoaiEndpointInputSchemas.getCapturedFormByFormId,
		output: InsightoaiEndpointOutputSchemas.getCapturedFormByFormId,
	},
	'forms.deleteFormById': {
		input: InsightoaiEndpointInputSchemas.deleteFormById,
		output: InsightoaiEndpointOutputSchemas.deleteFormById,
	},
	'forms.deleteBulkFormsByIds': {
		input: InsightoaiEndpointInputSchemas.deleteBulkFormsByIds,
		output: InsightoaiEndpointOutputSchemas.deleteBulkFormsByIds,
	},

	'tools.createToolfunction': {
		input: InsightoaiEndpointInputSchemas.createToolfunction,
		output: InsightoaiEndpointOutputSchemas.createToolfunction,
	},
	'tools.updateToolfunctionById': {
		input: InsightoaiEndpointInputSchemas.updateToolfunctionById,
		output: InsightoaiEndpointOutputSchemas.updateToolfunctionById,
	},
	'tools.deleteToolfunctionById': {
		input: InsightoaiEndpointInputSchemas.deleteToolfunctionById,
		output: InsightoaiEndpointOutputSchemas.deleteToolfunctionById,
	},
	'tools.readToolToolfunctionList': {
		input: InsightoaiEndpointInputSchemas.readToolToolfunctionList,
		output: InsightoaiEndpointOutputSchemas.readToolToolfunctionList,
	},
	'tools.updateToolById': {
		input: InsightoaiEndpointInputSchemas.updateToolById,
		output: InsightoaiEndpointOutputSchemas.updateToolById,
	},
	'tools.deleteToolById': {
		input: InsightoaiEndpointInputSchemas.deleteToolById,
		output: InsightoaiEndpointOutputSchemas.deleteToolById,
	},
	'tools.readToolFunctionInvokeLogList': {
		input: InsightoaiEndpointInputSchemas.readToolFunctionInvokeLogList,
		output: InsightoaiEndpointOutputSchemas.readToolFunctionInvokeLogList,
	},
	'tools.retrieveLinkedToolAndUser': {
		input: InsightoaiEndpointInputSchemas.retrieveLinkedToolAndUser,
		output: InsightoaiEndpointOutputSchemas.retrieveLinkedToolAndUser,
	},
	'tools.updateLinkToolUser': {
		input: InsightoaiEndpointInputSchemas.updateLinkToolUser,
		output: InsightoaiEndpointOutputSchemas.updateLinkToolUser,
	},

	'widgets.createWidget': {
		input: InsightoaiEndpointInputSchemas.createWidget,
		output: InsightoaiEndpointOutputSchemas.createWidget,
	},
	'widgets.getWidgetById': {
		input: InsightoaiEndpointInputSchemas.getWidgetById,
		output: InsightoaiEndpointOutputSchemas.getWidgetById,
	},
	'widgets.deleteWidgetById': {
		input: InsightoaiEndpointInputSchemas.deleteWidgetById,
		output: InsightoaiEndpointOutputSchemas.deleteWidgetById,
	},
	'widgets.getListOfWidgetsLinkedToAssistantId': {
		input: InsightoaiEndpointInputSchemas.getListOfWidgetsLinkedToAssistantId,
		output: InsightoaiEndpointOutputSchemas.getListOfWidgetsLinkedToAssistantId,
	},
	'widgets.listChannels': {
		input: InsightoaiEndpointInputSchemas.listChannels,
		output: InsightoaiEndpointOutputSchemas.listChannels,
	},
	'widgets.getListOfConversations': {
		input: InsightoaiEndpointInputSchemas.getListOfConversations,
		output: InsightoaiEndpointOutputSchemas.getListOfConversations,
	},

	'datasources.getDatasourceById': {
		input: InsightoaiEndpointInputSchemas.getDatasourceById,
		output: InsightoaiEndpointOutputSchemas.getDatasourceById,
	},
	'datasources.getListOfDatasources': {
		input: InsightoaiEndpointInputSchemas.getListOfDatasources,
		output: InsightoaiEndpointOutputSchemas.getListOfDatasources,
	},
	'datasources.getListOfDataSourcesLinkedToAssistantId': {
		input:
			InsightoaiEndpointInputSchemas.getListOfDataSourcesLinkedToAssistantId,
		output:
			InsightoaiEndpointOutputSchemas.getListOfDataSourcesLinkedToAssistantId,
	},
	'datasources.deleteLinkedAssistantDatasource': {
		input: InsightoaiEndpointInputSchemas.deleteLinkedAssistantDatasource,
		output: InsightoaiEndpointOutputSchemas.deleteLinkedAssistantDatasource,
	},
	'datasources.createTag': {
		input: InsightoaiEndpointInputSchemas.createTag,
		output: InsightoaiEndpointOutputSchemas.createTag,
	},
	'datasources.readTagList': {
		input: InsightoaiEndpointInputSchemas.readTagList,
		output: InsightoaiEndpointOutputSchemas.readTagList,
	},
	'datasources.deleteTagById': {
		input: InsightoaiEndpointInputSchemas.deleteTagById,
		output: InsightoaiEndpointOutputSchemas.deleteTagById,
	},
	'datasources.deleteLinkTagEntityById': {
		input: InsightoaiEndpointInputSchemas.deleteLinkTagEntityById,
		output: InsightoaiEndpointOutputSchemas.deleteLinkTagEntityById,
	},

	'webhooksTelephony.createWebhook': {
		input: InsightoaiEndpointInputSchemas.createWebhook,
		output: InsightoaiEndpointOutputSchemas.createWebhook,
	},
	'webhooksTelephony.updateWebhookById': {
		input: InsightoaiEndpointInputSchemas.updateWebhookById,
		output: InsightoaiEndpointOutputSchemas.updateWebhookById,
	},
	'webhooksTelephony.deleteWebhookById': {
		input: InsightoaiEndpointInputSchemas.deleteWebhookById,
		output: InsightoaiEndpointOutputSchemas.deleteWebhookById,
	},
	'webhooksTelephony.retrieveWebhookLog': {
		input: InsightoaiEndpointInputSchemas.retrieveWebhookLog,
		output: InsightoaiEndpointOutputSchemas.retrieveWebhookLog,
	},
	'webhooksTelephony.readTwilioAuthList': {
		input: InsightoaiEndpointInputSchemas.readTwilioAuthList,
		output: InsightoaiEndpointOutputSchemas.readTwilioAuthList,
	},
	'webhooksTelephony.updateTwilioAuthById': {
		input: InsightoaiEndpointInputSchemas.updateTwilioAuthById,
		output: InsightoaiEndpointOutputSchemas.updateTwilioAuthById,
	},
	'webhooksTelephony.deleteTwilioAuthById': {
		input: InsightoaiEndpointInputSchemas.deleteTwilioAuthById,
		output: InsightoaiEndpointOutputSchemas.deleteTwilioAuthById,
	},
	'webhooksTelephony.updateUserwhatsappById': {
		input: InsightoaiEndpointInputSchemas.updateUserwhatsappById,
		output: InsightoaiEndpointOutputSchemas.updateUserwhatsappById,
	},
	'webhooksTelephony.deleteUserwhatsappById': {
		input: InsightoaiEndpointInputSchemas.deleteUserwhatsappById,
		output: InsightoaiEndpointOutputSchemas.deleteUserwhatsappById,
	},

	'agency.createAgency': {
		input: InsightoaiEndpointInputSchemas.createAgency,
		output: InsightoaiEndpointOutputSchemas.createAgency,
	},
	'agency.getAgencyBrandingById': {
		input: InsightoaiEndpointInputSchemas.getAgencyBrandingById,
		output: InsightoaiEndpointOutputSchemas.getAgencyBrandingById,
	},
	'agency.getAgencyBillingPlan': {
		input: InsightoaiEndpointInputSchemas.getAgencyBillingPlan,
		output: InsightoaiEndpointOutputSchemas.getAgencyBillingPlan,
	},
	'agency.getPricingForUser': {
		input: InsightoaiEndpointInputSchemas.getPricingForUser,
		output: InsightoaiEndpointOutputSchemas.getPricingForUser,
	},
	'agency.getAgentList': {
		input: InsightoaiEndpointInputSchemas.getAgentList,
		output: InsightoaiEndpointOutputSchemas.getAgentList,
	},
	'agency.updateUserProfile': {
		input: InsightoaiEndpointInputSchemas.updateUserProfile,
		output: InsightoaiEndpointOutputSchemas.updateUserProfile,
	},
	'agency.retrieveUserMonthlyUsagesAggregation': {
		input: InsightoaiEndpointInputSchemas.retrieveUserMonthlyUsagesAggregation,
		output:
			InsightoaiEndpointOutputSchemas.retrieveUserMonthlyUsagesAggregation,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof insightoaiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const insightoaiEndpointMeta = {
	'assistants.getAssistantById': {
		riskLevel: 'read',
		description:
			'Retrieve comprehensive details and configuration of a specific assistant',
	},
	'assistants.deleteAssistantById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently remove an assistant from the system',
	},
	'assistants.addIntentToAssistant': {
		riskLevel: 'write',
		description: 'Link an existing conversational intent to an assistant',
	},
	'assistants.createIntent': {
		riskLevel: 'write',
		description: 'Create a new custom conversational intent',
	},
	'assistants.getIntentById': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific intent by ID',
	},
	'assistants.readIntentsList': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of all configured intents',
	},
	'assistants.createPrompt': {
		riskLevel: 'write',
		description:
			'Create a new customizable AI prompt template with variable support',
	},
	'assistants.getPromptById': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific prompt template by ID',
	},
	'assistants.deletePromptById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a prompt template by ID',
	},

	'providers.createProvider': {
		riskLevel: 'write',
		description:
			'Configure an AI provider (OpenAI, ElevenLabs, Azure Speech, Cartesia, PlayHT)',
	},
	'providers.getProviderById': {
		riskLevel: 'read',
		description: 'Retrieve configuration details of an AI provider',
	},
	'providers.deleteProviderById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an AI provider configuration',
	},
	'providers.getSpeechtotextList': {
		riskLevel: 'read',
		description:
			'Fetch a paginated list of available speech-to-text voice configurations',
	},
	'providers.retrieveListOfUserCustomVoice': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of custom user voice models',
	},

	'contacts.getContactById': {
		riskLevel: 'read',
		description: 'Retrieve a comprehensive profile of a specific contact',
	},
	'contacts.getListOfContacts': {
		riskLevel: 'read',
		description: 'Fetch a paginated list of contacts',
	},
	'contacts.upsertContactByEmailOrPhoneNumber': {
		riskLevel: 'write',
		description: 'Create or update a contact using email or phone number',
	},
	'contacts.deleteContactsInBulk': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete multiple contacts simultaneously by UUIDs',
	},
	'contacts.createContactCustomField': {
		riskLevel: 'write',
		description: 'Create a custom metadata field for contacts',
	},
	'contacts.readContactCustomFieldList': {
		riskLevel: 'read',
		description: 'Retrieve definitions of all contact custom fields',
	},
	'contacts.readCampaignContactList': {
		riskLevel: 'read',
		description: 'Fetch all contacts enrolled in a specific campaign',
	},
	'contacts.sendMessagesToContacts': {
		riskLevel: 'write',
		description:
			'Send bulk broadcast messages to contacts via connected WhatsApp or SMS',
	},
	'contacts.readContactSyncLogList': {
		riskLevel: 'read',
		description:
			'Retrieve audit history and logs of contact synchronization operations',
	},

	'forms.createForm': {
		riskLevel: 'write',
		description:
			'Create a conversational AI-driven or traditional data capture form',
	},
	'forms.getCapturedFormByFormId': {
		riskLevel: 'read',
		description: 'Fetch captured user form submissions with pagination',
	},
	'forms.deleteFormById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently remove a form by unique ID',
	},
	'forms.deleteBulkFormsByIds': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete multiple forms in a single bulk operation',
	},

	'tools.createToolfunction': {
		riskLevel: 'write',
		description:
			'Register a new tool function (SDK, CURL, or query index) for assistant workflows',
	},
	'tools.updateToolfunctionById': {
		riskLevel: 'write',
		description:
			'Modify the name, type, or enabled status of an existing tool function',
	},
	'tools.deleteToolfunctionById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a tool function from the system',
	},
	'tools.readToolToolfunctionList': {
		riskLevel: 'read',
		description: 'Fetch all tool functions associated with a specific tool ID',
	},
	'tools.updateToolById': {
		riskLevel: 'write',
		description: 'Modify general properties and enabled status of a tool',
	},
	'tools.deleteToolById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove an entire tool integration by ID',
	},
	'tools.readToolFunctionInvokeLogList': {
		riskLevel: 'read',
		description:
			'Inspect execution history and audit logs of tool function calls',
	},
	'tools.retrieveLinkedToolAndUser': {
		riskLevel: 'read',
		description: 'Retrieve linked tool and user associations',
	},
	'tools.updateLinkToolUser': {
		riskLevel: 'write',
		description: 'Modify properties of a linked tool user integration',
	},

	'widgets.createWidget': {
		riskLevel: 'write',
		description: 'Create a new chat/voice widget for web or mobile embedding',
	},
	'widgets.getWidgetById': {
		riskLevel: 'read',
		description: 'Retrieve widget configuration and visual styling attributes',
	},
	'widgets.deleteWidgetById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently remove a widget by ID',
	},
	'widgets.getListOfWidgetsLinkedToAssistantId': {
		riskLevel: 'read',
		description: 'Discover all widgets associated with a specific assistant',
	},
	'widgets.listChannels': {
		riskLevel: 'read',
		description:
			'Retrieve all available communication channels and configurations',
	},
	'widgets.getListOfConversations': {
		riskLevel: 'read',
		description: 'Retrieve filtered conversation metadata across date ranges',
	},

	'datasources.getDatasourceById': {
		riskLevel: 'read',
		description:
			'Retrieve comprehensive details of a specific knowledge base data source',
	},
	'datasources.getListOfDatasources': {
		riskLevel: 'read',
		description:
			'Discover all available knowledge base data sources (text, URLs, files)',
	},
	'datasources.getListOfDataSourcesLinkedToAssistantId': {
		riskLevel: 'read',
		description: 'List all data sources linked to an assistant',
	},
	'datasources.deleteLinkedAssistantDatasource': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Unlink and remove a data source from an assistant's knowledge base",
	},
	'datasources.createTag': {
		riskLevel: 'write',
		description:
			'Create a custom tag for categorizing contacts and conversations',
	},
	'datasources.readTagList': {
		riskLevel: 'read',
		description: 'Fetch a paginated list of all available tags',
	},
	'datasources.deleteTagById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently remove a tag by ID',
	},
	'datasources.deleteLinkTagEntityById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a specific tag association from an entity',
	},

	'webhooksTelephony.createWebhook': {
		riskLevel: 'write',
		description: 'Configure an outbound webhook URL for event notifications',
	},
	'webhooksTelephony.updateWebhookById': {
		riskLevel: 'write',
		description:
			'Modify the endpoint URL, name, or enabled status of an outbound webhook',
	},
	'webhooksTelephony.deleteWebhookById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently remove an outbound webhook configuration',
	},
	'webhooksTelephony.retrieveWebhookLog': {
		riskLevel: 'read',
		description:
			'Inspect delivery status and debug logs for a specific webhook',
	},
	'webhooksTelephony.readTwilioAuthList': {
		riskLevel: 'read',
		description: 'Retrieve all configured Twilio authentication integrations',
	},
	'webhooksTelephony.updateTwilioAuthById': {
		riskLevel: 'write',
		description: 'Modify Twilio auth credentials or telephony settings',
	},
	'webhooksTelephony.deleteTwilioAuthById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a Twilio authentication integration',
	},
	'webhooksTelephony.updateUserwhatsappById': {
		riskLevel: 'write',
		description: 'Modify WhatsApp Business API settings for a user',
	},
	'webhooksTelephony.deleteUserwhatsappById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a WhatsApp Business connection',
	},

	'agency.createAgency': {
		riskLevel: 'write',
		description:
			'Create a new agency with organization-specific branding and config',
	},
	'agency.getAgencyBrandingById': {
		riskLevel: 'read',
		description: 'Retrieve the branding configuration for an agency',
	},
	'agency.getAgencyBillingPlan': {
		riskLevel: 'read',
		description:
			'View an agency billing plan limits for bots, queries, words, and voice seconds',
	},
	'agency.getPricingForUser': {
		riskLevel: 'read',
		description:
			'Retrieve pricing tier information for LLM, voice, or transcription services',
	},
	'agency.getAgentList': {
		riskLevel: 'read',
		description: 'Fetch a paginated list of team agents/users',
	},
	'agency.updateUserProfile': {
		riskLevel: 'write',
		description:
			'Modify user account details, contact information, or billing settings',
	},
	'agency.retrieveUserMonthlyUsagesAggregation': {
		riskLevel: 'read',
		description: 'Retrieve monthly aggregated usage analytics',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof insightoaiEndpointsNested
>;

export const insightoaiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseInsightoaiPlugin<T extends InsightoaiPluginOptions> =
	CorsairPlugin<
		'insightoai',
		typeof InsightoaiSchema,
		typeof insightoaiEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof insightoaiAuthConfig
	>;

export type InternalInsightoaiPlugin =
	BaseInsightoaiPlugin<InsightoaiPluginOptions>;

export type ExternalInsightoaiPlugin<T extends InsightoaiPluginOptions> =
	BaseInsightoaiPlugin<T>;

// The assertion is safe: InsightoaiPluginOptions has no required fields (all are
// optional), so an empty object satisfies the constraint at runtime even though
// TypeScript cannot verify it without the assertion.
export function insightoai<const T extends InsightoaiPluginOptions>(
	incomingOptions: InsightoaiPluginOptions & T = {} as InsightoaiPluginOptions &
		T,
): ExternalInsightoaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'insightoai',
		schema: InsightoaiSchema,
		options,
		hooks: options.hooks,
		endpoints: insightoaiEndpointsNested,
		webhooks: {},
		endpointMeta: insightoaiEndpointMeta,
		endpointSchemas: insightoaiEndpointSchemas,
		authConfig: insightoaiAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// DEFAULT matches everything (`() => true`), so it must always be evaluated
			// last — otherwise it shadows any custom handler contributed via options.
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: InsightoaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('insightoai', 'api_key');
				}

				return key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const token = await ctx.keys.get_access_token();

				if (!token) {
					throw new AuthMissingError('insightoai', 'oauth_2');
				}

				return token;
			}

			throw new AuthMissingError('insightoai', ctx.authType);
		},
	} satisfies InternalInsightoaiPlugin;
}

export type {
	InsightoaiEndpointInputs,
	InsightoaiEndpointOutputs,
} from './endpoints/types';
