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
import { gorgiasEndpointsNested } from './endpoints';
import {
	GorgiasEndpointInputSchemas,
	GorgiasEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GorgiasSchema } from './schema';

export type GorgiasPluginOptions = {
	authType?: PickAuth<'api_key'>;
	hooks?: InternalGorgiasPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gorgiasEndpointsNested>;
};

export type GorgiasContext = CorsairPluginContext<
	typeof GorgiasSchema,
	GorgiasPluginOptions,
	undefined,
	typeof gorgiasAuthConfig
>;
export type GorgiasKeyBuilderContext = KeyBuilderContext<
	GorgiasPluginOptions,
	typeof gorgiasAuthConfig
>;
export type GorgiasBoundEndpoints = BindEndpoints<
	typeof gorgiasEndpointsNested
>;
export type GorgiasEndpoints = typeof gorgiasEndpointsNested;

export const gorgiasEndpointSchemas = {
	'account.createAccountSetting': {
		input: GorgiasEndpointInputSchemas['account.createAccountSetting'],
		output: GorgiasEndpointOutputSchemas['account.createAccountSetting'],
	},
	'account.getAccount': {
		input: GorgiasEndpointInputSchemas['account.getAccount'],
		output: GorgiasEndpointOutputSchemas['account.getAccount'],
	},
	'account.listAccountSettings': {
		input: GorgiasEndpointInputSchemas['account.listAccountSettings'],
		output: GorgiasEndpointOutputSchemas['account.listAccountSettings'],
	},
	'account.updateAccountSetting': {
		input: GorgiasEndpointInputSchemas['account.updateAccountSetting'],
		output: GorgiasEndpointOutputSchemas['account.updateAccountSetting'],
	},
	'customFields.createCustomField': {
		input: GorgiasEndpointInputSchemas['customFields.createCustomField'],
		output: GorgiasEndpointOutputSchemas['customFields.createCustomField'],
	},
	'customFields.getCustomField': {
		input: GorgiasEndpointInputSchemas['customFields.getCustomField'],
		output: GorgiasEndpointOutputSchemas['customFields.getCustomField'],
	},
	'customFields.listCustomFields': {
		input: GorgiasEndpointInputSchemas['customFields.listCustomFields'],
		output: GorgiasEndpointOutputSchemas['customFields.listCustomFields'],
	},
	'customFields.updateCustomField': {
		input: GorgiasEndpointInputSchemas['customFields.updateCustomField'],
		output: GorgiasEndpointOutputSchemas['customFields.updateCustomField'],
	},
	'customFields.updateCustomFields': {
		input: GorgiasEndpointInputSchemas['customFields.updateCustomFields'],
		output: GorgiasEndpointOutputSchemas['customFields.updateCustomFields'],
	},
	'customers.createCustomer': {
		input: GorgiasEndpointInputSchemas['customers.createCustomer'],
		output: GorgiasEndpointOutputSchemas['customers.createCustomer'],
	},
	'customers.deleteCustomer': {
		input: GorgiasEndpointInputSchemas['customers.deleteCustomer'],
		output: GorgiasEndpointOutputSchemas['customers.deleteCustomer'],
	},
	'customers.deleteCustomerCustomFieldValue': {
		input:
			GorgiasEndpointInputSchemas['customers.deleteCustomerCustomFieldValue'],
		output:
			GorgiasEndpointOutputSchemas['customers.deleteCustomerCustomFieldValue'],
	},
	'customers.deleteCustomers': {
		input: GorgiasEndpointInputSchemas['customers.deleteCustomers'],
		output: GorgiasEndpointOutputSchemas['customers.deleteCustomers'],
	},
	'customers.getCustomer': {
		input: GorgiasEndpointInputSchemas['customers.getCustomer'],
		output: GorgiasEndpointOutputSchemas['customers.getCustomer'],
	},
	'customers.listCustomerCustomFieldsValues': {
		input:
			GorgiasEndpointInputSchemas['customers.listCustomerCustomFieldsValues'],
		output:
			GorgiasEndpointOutputSchemas['customers.listCustomerCustomFieldsValues'],
	},
	'customers.listCustomers': {
		input: GorgiasEndpointInputSchemas['customers.listCustomers'],
		output: GorgiasEndpointOutputSchemas['customers.listCustomers'],
	},
	'customers.mergeCustomers': {
		input: GorgiasEndpointInputSchemas['customers.mergeCustomers'],
		output: GorgiasEndpointOutputSchemas['customers.mergeCustomers'],
	},
	'customers.updateCustomer': {
		input: GorgiasEndpointInputSchemas['customers.updateCustomer'],
		output: GorgiasEndpointOutputSchemas['customers.updateCustomer'],
	},
	'customers.updateCustomerCustomFieldValue': {
		input:
			GorgiasEndpointInputSchemas['customers.updateCustomerCustomFieldValue'],
		output:
			GorgiasEndpointOutputSchemas['customers.updateCustomerCustomFieldValue'],
	},
	'customers.updateCustomerCustomFieldValues': {
		input:
			GorgiasEndpointInputSchemas['customers.updateCustomerCustomFieldValues'],
		output:
			GorgiasEndpointOutputSchemas['customers.updateCustomerCustomFieldValues'],
	},
	'customers.updateCustomerData': {
		input: GorgiasEndpointInputSchemas['customers.updateCustomerData'],
		output: GorgiasEndpointOutputSchemas['customers.updateCustomerData'],
	},
	'events.getEvent': {
		input: GorgiasEndpointInputSchemas['events.getEvent'],
		output: GorgiasEndpointOutputSchemas['events.getEvent'],
	},
	'events.listEvents': {
		input: GorgiasEndpointInputSchemas['events.listEvents'],
		output: GorgiasEndpointOutputSchemas['events.listEvents'],
	},
	'files.uploadFiles': {
		input: GorgiasEndpointInputSchemas['files.uploadFiles'],
		output: GorgiasEndpointOutputSchemas['files.uploadFiles'],
	},
	'files.downloadFile': {
		input: GorgiasEndpointInputSchemas['files.downloadFile'],
		output: GorgiasEndpointOutputSchemas['files.downloadFile'],
	},
	'integrations.createIntegration': {
		input: GorgiasEndpointInputSchemas['integrations.createIntegration'],
		output: GorgiasEndpointOutputSchemas['integrations.createIntegration'],
	},
	'integrations.deleteIntegration': {
		input: GorgiasEndpointInputSchemas['integrations.deleteIntegration'],
		output: GorgiasEndpointOutputSchemas['integrations.deleteIntegration'],
	},
	'integrations.getIntegration': {
		input: GorgiasEndpointInputSchemas['integrations.getIntegration'],
		output: GorgiasEndpointOutputSchemas['integrations.getIntegration'],
	},
	'integrations.listIntegrations': {
		input: GorgiasEndpointInputSchemas['integrations.listIntegrations'],
		output: GorgiasEndpointOutputSchemas['integrations.listIntegrations'],
	},
	'integrations.updateIntegration': {
		input: GorgiasEndpointInputSchemas['integrations.updateIntegration'],
		output: GorgiasEndpointOutputSchemas['integrations.updateIntegration'],
	},
	'jobs.cancelJob': {
		input: GorgiasEndpointInputSchemas['jobs.cancelJob'],
		output: GorgiasEndpointOutputSchemas['jobs.cancelJob'],
	},
	'jobs.createJob': {
		input: GorgiasEndpointInputSchemas['jobs.createJob'],
		output: GorgiasEndpointOutputSchemas['jobs.createJob'],
	},
	'jobs.getJob': {
		input: GorgiasEndpointInputSchemas['jobs.getJob'],
		output: GorgiasEndpointOutputSchemas['jobs.getJob'],
	},
	'jobs.listJobs': {
		input: GorgiasEndpointInputSchemas['jobs.listJobs'],
		output: GorgiasEndpointOutputSchemas['jobs.listJobs'],
	},
	'jobs.updateJob': {
		input: GorgiasEndpointInputSchemas['jobs.updateJob'],
		output: GorgiasEndpointOutputSchemas['jobs.updateJob'],
	},
	'macros.bulkArchiveMacros': {
		input: GorgiasEndpointInputSchemas['macros.bulkArchiveMacros'],
		output: GorgiasEndpointOutputSchemas['macros.bulkArchiveMacros'],
	},
	'macros.bulkUnarchiveMacros': {
		input: GorgiasEndpointInputSchemas['macros.bulkUnarchiveMacros'],
		output: GorgiasEndpointOutputSchemas['macros.bulkUnarchiveMacros'],
	},
	'macros.createMacro': {
		input: GorgiasEndpointInputSchemas['macros.createMacro'],
		output: GorgiasEndpointOutputSchemas['macros.createMacro'],
	},
	'macros.deleteMacro': {
		input: GorgiasEndpointInputSchemas['macros.deleteMacro'],
		output: GorgiasEndpointOutputSchemas['macros.deleteMacro'],
	},
	'macros.getMacro': {
		input: GorgiasEndpointInputSchemas['macros.getMacro'],
		output: GorgiasEndpointOutputSchemas['macros.getMacro'],
	},
	'macros.listMacros': {
		input: GorgiasEndpointInputSchemas['macros.listMacros'],
		output: GorgiasEndpointOutputSchemas['macros.listMacros'],
	},
	'macros.updateMacro': {
		input: GorgiasEndpointInputSchemas['macros.updateMacro'],
		output: GorgiasEndpointOutputSchemas['macros.updateMacro'],
	},
	'metricCards.createMetricCardFeedback': {
		input: GorgiasEndpointInputSchemas['metricCards.createMetricCardFeedback'],
		output:
			GorgiasEndpointOutputSchemas['metricCards.createMetricCardFeedback'],
	},
	'metricCards.getMetricCard': {
		input: GorgiasEndpointInputSchemas['metricCards.getMetricCard'],
		output: GorgiasEndpointOutputSchemas['metricCards.getMetricCard'],
	},
	'metricCards.searchMetricCards': {
		input: GorgiasEndpointInputSchemas['metricCards.searchMetricCards'],
		output: GorgiasEndpointOutputSchemas['metricCards.searchMetricCards'],
	},
	'reportingStatistics.getStatistic': {
		input: GorgiasEndpointInputSchemas['reportingStatistics.getStatistic'],
		output: GorgiasEndpointOutputSchemas['reportingStatistics.getStatistic'],
	},
	'rules.createRule': {
		input: GorgiasEndpointInputSchemas['rules.createRule'],
		output: GorgiasEndpointOutputSchemas['rules.createRule'],
	},
	'rules.deleteRule': {
		input: GorgiasEndpointInputSchemas['rules.deleteRule'],
		output: GorgiasEndpointOutputSchemas['rules.deleteRule'],
	},
	'rules.getRule': {
		input: GorgiasEndpointInputSchemas['rules.getRule'],
		output: GorgiasEndpointOutputSchemas['rules.getRule'],
	},
	'rules.listRules': {
		input: GorgiasEndpointInputSchemas['rules.listRules'],
		output: GorgiasEndpointOutputSchemas['rules.listRules'],
	},
	'rules.updateRule': {
		input: GorgiasEndpointInputSchemas['rules.updateRule'],
		output: GorgiasEndpointOutputSchemas['rules.updateRule'],
	},
	'rules.updateRulesPriorities': {
		input: GorgiasEndpointInputSchemas['rules.updateRulesPriorities'],
		output: GorgiasEndpointOutputSchemas['rules.updateRulesPriorities'],
	},
	'satisfactionSurveys.createSatisfactionSurvey': {
		input:
			GorgiasEndpointInputSchemas[
				'satisfactionSurveys.createSatisfactionSurvey'
			],
		output:
			GorgiasEndpointOutputSchemas[
				'satisfactionSurveys.createSatisfactionSurvey'
			],
	},
	'satisfactionSurveys.getSatisfactionSurvey': {
		input:
			GorgiasEndpointInputSchemas['satisfactionSurveys.getSatisfactionSurvey'],
		output:
			GorgiasEndpointOutputSchemas['satisfactionSurveys.getSatisfactionSurvey'],
	},
	'satisfactionSurveys.listSatisfactionSurveys': {
		input:
			GorgiasEndpointInputSchemas[
				'satisfactionSurveys.listSatisfactionSurveys'
			],
		output:
			GorgiasEndpointOutputSchemas[
				'satisfactionSurveys.listSatisfactionSurveys'
			],
	},
	'satisfactionSurveys.updateSatisfactionSurvey': {
		input:
			GorgiasEndpointInputSchemas[
				'satisfactionSurveys.updateSatisfactionSurvey'
			],
		output:
			GorgiasEndpointOutputSchemas[
				'satisfactionSurveys.updateSatisfactionSurvey'
			],
	},
	'search.search': {
		input: GorgiasEndpointInputSchemas['search.search'],
		output: GorgiasEndpointOutputSchemas['search.search'],
	},
	'statistics.downloadLegacyStatistic': {
		input: GorgiasEndpointInputSchemas['statistics.downloadLegacyStatistic'],
		output: GorgiasEndpointOutputSchemas['statistics.downloadLegacyStatistic'],
	},
	'statistics.getLegacyStatistic': {
		input: GorgiasEndpointInputSchemas['statistics.getLegacyStatistic'],
		output: GorgiasEndpointOutputSchemas['statistics.getLegacyStatistic'],
	},
	'tags.createTag': {
		input: GorgiasEndpointInputSchemas['tags.createTag'],
		output: GorgiasEndpointOutputSchemas['tags.createTag'],
	},
	'tags.deleteTag': {
		input: GorgiasEndpointInputSchemas['tags.deleteTag'],
		output: GorgiasEndpointOutputSchemas['tags.deleteTag'],
	},
	'tags.deleteTags': {
		input: GorgiasEndpointInputSchemas['tags.deleteTags'],
		output: GorgiasEndpointOutputSchemas['tags.deleteTags'],
	},
	'tags.getTag': {
		input: GorgiasEndpointInputSchemas['tags.getTag'],
		output: GorgiasEndpointOutputSchemas['tags.getTag'],
	},
	'tags.listTags': {
		input: GorgiasEndpointInputSchemas['tags.listTags'],
		output: GorgiasEndpointOutputSchemas['tags.listTags'],
	},
	'tags.mergeTags': {
		input: GorgiasEndpointInputSchemas['tags.mergeTags'],
		output: GorgiasEndpointOutputSchemas['tags.mergeTags'],
	},
	'tags.updateTag': {
		input: GorgiasEndpointInputSchemas['tags.updateTag'],
		output: GorgiasEndpointOutputSchemas['tags.updateTag'],
	},
	'teams.createTeam': {
		input: GorgiasEndpointInputSchemas['teams.createTeam'],
		output: GorgiasEndpointOutputSchemas['teams.createTeam'],
	},
	'teams.deleteTeam': {
		input: GorgiasEndpointInputSchemas['teams.deleteTeam'],
		output: GorgiasEndpointOutputSchemas['teams.deleteTeam'],
	},
	'teams.getTeam': {
		input: GorgiasEndpointInputSchemas['teams.getTeam'],
		output: GorgiasEndpointOutputSchemas['teams.getTeam'],
	},
	'teams.listTeams': {
		input: GorgiasEndpointInputSchemas['teams.listTeams'],
		output: GorgiasEndpointOutputSchemas['teams.listTeams'],
	},
	'teams.updateTeam': {
		input: GorgiasEndpointInputSchemas['teams.updateTeam'],
		output: GorgiasEndpointOutputSchemas['teams.updateTeam'],
	},
	'ticketMessages.createTicketMessage': {
		input: GorgiasEndpointInputSchemas['ticketMessages.createTicketMessage'],
		output: GorgiasEndpointOutputSchemas['ticketMessages.createTicketMessage'],
	},
	'ticketMessages.deleteTicketMessage': {
		input: GorgiasEndpointInputSchemas['ticketMessages.deleteTicketMessage'],
		output: GorgiasEndpointOutputSchemas['ticketMessages.deleteTicketMessage'],
	},
	'ticketMessages.getTicketMessage': {
		input: GorgiasEndpointInputSchemas['ticketMessages.getTicketMessage'],
		output: GorgiasEndpointOutputSchemas['ticketMessages.getTicketMessage'],
	},
	'ticketMessages.listMessages': {
		input: GorgiasEndpointInputSchemas['ticketMessages.listMessages'],
		output: GorgiasEndpointOutputSchemas['ticketMessages.listMessages'],
	},
	'ticketMessages.listTicketMessages': {
		input: GorgiasEndpointInputSchemas['ticketMessages.listTicketMessages'],
		output: GorgiasEndpointOutputSchemas['ticketMessages.listTicketMessages'],
	},
	'ticketMessages.updateTicketMessage': {
		input: GorgiasEndpointInputSchemas['ticketMessages.updateTicketMessage'],
		output: GorgiasEndpointOutputSchemas['ticketMessages.updateTicketMessage'],
	},
	'tickets.createTicket': {
		input: GorgiasEndpointInputSchemas['tickets.createTicket'],
		output: GorgiasEndpointOutputSchemas['tickets.createTicket'],
	},
	'tickets.createTicketTags': {
		input: GorgiasEndpointInputSchemas['tickets.createTicketTags'],
		output: GorgiasEndpointOutputSchemas['tickets.createTicketTags'],
	},
	'tickets.deleteTicket': {
		input: GorgiasEndpointInputSchemas['tickets.deleteTicket'],
		output: GorgiasEndpointOutputSchemas['tickets.deleteTicket'],
	},
	'tickets.deleteTicketCustomField': {
		input: GorgiasEndpointInputSchemas['tickets.deleteTicketCustomField'],
		output: GorgiasEndpointOutputSchemas['tickets.deleteTicketCustomField'],
	},
	'tickets.deleteTicketTags': {
		input: GorgiasEndpointInputSchemas['tickets.deleteTicketTags'],
		output: GorgiasEndpointOutputSchemas['tickets.deleteTicketTags'],
	},
	'tickets.getTicket': {
		input: GorgiasEndpointInputSchemas['tickets.getTicket'],
		output: GorgiasEndpointOutputSchemas['tickets.getTicket'],
	},
	'tickets.listTicketCustomFields': {
		input: GorgiasEndpointInputSchemas['tickets.listTicketCustomFields'],
		output: GorgiasEndpointOutputSchemas['tickets.listTicketCustomFields'],
	},
	'tickets.listTicketTags': {
		input: GorgiasEndpointInputSchemas['tickets.listTicketTags'],
		output: GorgiasEndpointOutputSchemas['tickets.listTicketTags'],
	},
	'tickets.listTickets': {
		input: GorgiasEndpointInputSchemas['tickets.listTickets'],
		output: GorgiasEndpointOutputSchemas['tickets.listTickets'],
	},
	'tickets.updateTicket': {
		input: GorgiasEndpointInputSchemas['tickets.updateTicket'],
		output: GorgiasEndpointOutputSchemas['tickets.updateTicket'],
	},
	'tickets.updateTicketCustomField': {
		input: GorgiasEndpointInputSchemas['tickets.updateTicketCustomField'],
		output: GorgiasEndpointOutputSchemas['tickets.updateTicketCustomField'],
	},
	'tickets.updateTicketCustomFields': {
		input: GorgiasEndpointInputSchemas['tickets.updateTicketCustomFields'],
		output: GorgiasEndpointOutputSchemas['tickets.updateTicketCustomFields'],
	},
	'tickets.updateTicketTags': {
		input: GorgiasEndpointInputSchemas['tickets.updateTicketTags'],
		output: GorgiasEndpointOutputSchemas['tickets.updateTicketTags'],
	},
	'users.createUser': {
		input: GorgiasEndpointInputSchemas['users.createUser'],
		output: GorgiasEndpointOutputSchemas['users.createUser'],
	},
	'users.deleteUser': {
		input: GorgiasEndpointInputSchemas['users.deleteUser'],
		output: GorgiasEndpointOutputSchemas['users.deleteUser'],
	},
	'users.getUser': {
		input: GorgiasEndpointInputSchemas['users.getUser'],
		output: GorgiasEndpointOutputSchemas['users.getUser'],
	},
	'users.listUsers': {
		input: GorgiasEndpointInputSchemas['users.listUsers'],
		output: GorgiasEndpointOutputSchemas['users.listUsers'],
	},
	'users.updateUser': {
		input: GorgiasEndpointInputSchemas['users.updateUser'],
		output: GorgiasEndpointOutputSchemas['users.updateUser'],
	},
	'views.createView': {
		input: GorgiasEndpointInputSchemas['views.createView'],
		output: GorgiasEndpointOutputSchemas['views.createView'],
	},
	'views.deleteView': {
		input: GorgiasEndpointInputSchemas['views.deleteView'],
		output: GorgiasEndpointOutputSchemas['views.deleteView'],
	},
	'views.getView': {
		input: GorgiasEndpointInputSchemas['views.getView'],
		output: GorgiasEndpointOutputSchemas['views.getView'],
	},
	'views.listViewItems': {
		input: GorgiasEndpointInputSchemas['views.listViewItems'],
		output: GorgiasEndpointOutputSchemas['views.listViewItems'],
	},
	'views.listViews': {
		input: GorgiasEndpointInputSchemas['views.listViews'],
		output: GorgiasEndpointOutputSchemas['views.listViews'],
	},
	'views.updateView': {
		input: GorgiasEndpointInputSchemas['views.updateView'],
		output: GorgiasEndpointOutputSchemas['views.updateView'],
	},
	'views.updateViewItems': {
		input: GorgiasEndpointInputSchemas['views.updateViewItems'],
		output: GorgiasEndpointOutputSchemas['views.updateViewItems'],
	},
	'voiceCallEvents.getVoiceCallEvent': {
		input: GorgiasEndpointInputSchemas['voiceCallEvents.getVoiceCallEvent'],
		output: GorgiasEndpointOutputSchemas['voiceCallEvents.getVoiceCallEvent'],
	},
	'voiceCallEvents.listVoiceCallEvents': {
		input: GorgiasEndpointInputSchemas['voiceCallEvents.listVoiceCallEvents'],
		output: GorgiasEndpointOutputSchemas['voiceCallEvents.listVoiceCallEvents'],
	},
	'voiceCallRecordings.deleteVoiceCallRecording': {
		input:
			GorgiasEndpointInputSchemas[
				'voiceCallRecordings.deleteVoiceCallRecording'
			],
		output:
			GorgiasEndpointOutputSchemas[
				'voiceCallRecordings.deleteVoiceCallRecording'
			],
	},
	'voiceCallRecordings.getVoiceCallRecording': {
		input:
			GorgiasEndpointInputSchemas['voiceCallRecordings.getVoiceCallRecording'],
		output:
			GorgiasEndpointOutputSchemas['voiceCallRecordings.getVoiceCallRecording'],
	},
	'voiceCallRecordings.listVoiceCallRecordings': {
		input:
			GorgiasEndpointInputSchemas[
				'voiceCallRecordings.listVoiceCallRecordings'
			],
		output:
			GorgiasEndpointOutputSchemas[
				'voiceCallRecordings.listVoiceCallRecordings'
			],
	},
	'voiceCalls.getVoiceCall': {
		input: GorgiasEndpointInputSchemas['voiceCalls.getVoiceCall'],
		output: GorgiasEndpointOutputSchemas['voiceCalls.getVoiceCall'],
	},
	'voiceCalls.listVoiceCalls': {
		input: GorgiasEndpointInputSchemas['voiceCalls.listVoiceCalls'],
		output: GorgiasEndpointOutputSchemas['voiceCalls.listVoiceCalls'],
	},
	'widgets.createWidget': {
		input: GorgiasEndpointInputSchemas['widgets.createWidget'],
		output: GorgiasEndpointOutputSchemas['widgets.createWidget'],
	},
	'widgets.deleteWidget': {
		input: GorgiasEndpointInputSchemas['widgets.deleteWidget'],
		output: GorgiasEndpointOutputSchemas['widgets.deleteWidget'],
	},
	'widgets.getWidget': {
		input: GorgiasEndpointInputSchemas['widgets.getWidget'],
		output: GorgiasEndpointOutputSchemas['widgets.getWidget'],
	},
	'widgets.listWidgets': {
		input: GorgiasEndpointInputSchemas['widgets.listWidgets'],
		output: GorgiasEndpointOutputSchemas['widgets.listWidgets'],
	},
	'widgets.updateWidget': {
		input: GorgiasEndpointInputSchemas['widgets.updateWidget'],
		output: GorgiasEndpointOutputSchemas['widgets.updateWidget'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gorgiasEndpointsNested
>;

const gorgiasEndpointMeta = {
	'account.createAccountSetting': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a setting.',
	},
	'account.getAccount': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve your account.',
	},
	'account.listAccountSettings': {
		riskLevel: 'read',
		description: 'Gorgias REST: List settings.',
	},
	'account.updateAccountSetting': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a setting.',
	},
	'customFields.createCustomField': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a custom field.',
	},
	'customFields.getCustomField': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a custom field.',
	},
	'customFields.listCustomFields': {
		riskLevel: 'read',
		description: 'Gorgias REST: List custom fields.',
	},
	'customFields.updateCustomField': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a custom field.',
	},
	'customFields.updateCustomFields': {
		riskLevel: 'write',
		description: 'Gorgias REST: Bulk update a list of custom fields.',
	},
	'customers.createCustomer': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a customer.',
	},
	'customers.deleteCustomer': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a customer.',
	},
	'customers.deleteCustomerCustomFieldValue': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete customer field value.',
	},
	'customers.deleteCustomers': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete customers.',
	},
	'customers.getCustomer': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a customer.',
	},
	'customers.listCustomerCustomFieldsValues': {
		riskLevel: 'read',
		description: 'Gorgias REST: List customer field values.',
	},
	'customers.listCustomers': {
		riskLevel: 'read',
		description: 'Gorgias REST: List customers.',
	},
	'customers.mergeCustomers': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Merge two customers.',
	},
	'customers.updateCustomer': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a customer.',
	},
	'customers.updateCustomerCustomFieldValue': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update customer field value.',
	},
	'customers.updateCustomerCustomFieldValues': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update customer fields values.',
	},
	'customers.updateCustomerData': {
		riskLevel: 'write',
		description: 'Gorgias REST: Set customer data.',
	},
	'events.getEvent': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve an event.',
	},
	'events.listEvents': {
		riskLevel: 'read',
		description: 'Gorgias REST: List events.',
	},
	'files.uploadFiles': {
		riskLevel: 'write',
		description: 'Gorgias REST: Upload files.',
	},
	'files.downloadFile': {
		riskLevel: 'read',
		description: 'Gorgias REST: Download a file.',
	},
	'integrations.createIntegration': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create an integration.',
	},
	'integrations.deleteIntegration': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete an integration.',
	},
	'integrations.getIntegration': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve an integration.',
	},
	'integrations.listIntegrations': {
		riskLevel: 'read',
		description: 'Gorgias REST: List integrations.',
	},
	'integrations.updateIntegration': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update an integration.',
	},
	'jobs.cancelJob': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Cancel a job.',
	},
	'jobs.createJob': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a job.',
	},
	'jobs.getJob': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a job.',
	},
	'jobs.listJobs': {
		riskLevel: 'read',
		description: 'Gorgias REST: List jobs.',
	},
	'jobs.updateJob': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a job.',
	},
	'macros.bulkArchiveMacros': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Archive macros.',
	},
	'macros.bulkUnarchiveMacros': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Unarchive macros.',
	},
	'macros.createMacro': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a macro.',
	},
	'macros.deleteMacro': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a macro.',
	},
	'macros.getMacro': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a macro.',
	},
	'macros.listMacros': {
		riskLevel: 'read',
		description: 'Gorgias REST: List macros.',
	},
	'macros.updateMacro': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a macro.',
	},
	'metricCards.createMetricCardFeedback': {
		riskLevel: 'write',
		description: 'Gorgias REST: Submit feedback on a metric card definition.',
	},
	'metricCards.getMetricCard': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a metric card by slug.',
	},
	'metricCards.searchMetricCards': {
		riskLevel: 'read',
		description: 'Gorgias REST: Search metric cards.',
	},
	'reportingStatistics.getStatistic': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a statistic.',
	},
	'rules.createRule': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a rule.',
	},
	'rules.deleteRule': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a rule.',
	},
	'rules.getRule': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a rule.',
	},
	'rules.listRules': {
		riskLevel: 'read',
		description: 'Gorgias REST: List rules.',
	},
	'rules.updateRule': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a rule.',
	},
	'rules.updateRulesPriorities': {
		riskLevel: 'write',
		description: "Gorgias REST: Update rules' priorities.",
	},
	'satisfactionSurveys.createSatisfactionSurvey': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Create a survey.',
	},
	'satisfactionSurveys.getSatisfactionSurvey': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a survey.',
	},
	'satisfactionSurveys.listSatisfactionSurveys': {
		riskLevel: 'read',
		description: 'Gorgias REST: List surveys.',
	},
	'satisfactionSurveys.updateSatisfactionSurvey': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a survey.',
	},
	'search.search': {
		riskLevel: 'read',
		description: 'Gorgias REST: Search for resources.',
	},
	'statistics.downloadLegacyStatistic': {
		riskLevel: 'read',
		description: 'Gorgias REST: Download a statistic.',
	},
	'statistics.getLegacyStatistic': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a statistic.',
	},
	'tags.createTag': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a tag.',
	},
	'tags.deleteTag': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a tag.',
	},
	'tags.deleteTags': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete tags.',
	},
	'tags.getTag': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a tag.',
	},
	'tags.listTags': {
		riskLevel: 'read',
		description: 'Gorgias REST: List tags.',
	},
	'tags.mergeTags': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Merge tags.',
	},
	'tags.updateTag': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a tag.',
	},
	'teams.createTeam': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a team.',
	},
	'teams.deleteTeam': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a team.',
	},
	'teams.getTeam': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a team.',
	},
	'teams.listTeams': {
		riskLevel: 'read',
		description: 'Gorgias REST: List teams.',
	},
	'teams.updateTeam': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a team.',
	},
	'ticketMessages.createTicketMessage': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Create a message.',
	},
	'ticketMessages.deleteTicketMessage': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a message.',
	},
	'ticketMessages.getTicketMessage': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a message.',
	},
	'ticketMessages.listMessages': {
		riskLevel: 'read',
		description: 'Gorgias REST: List messages.',
	},
	'ticketMessages.listTicketMessages': {
		riskLevel: 'read',
		description: 'Gorgias REST: List messages of a ticket.',
	},
	'ticketMessages.updateTicketMessage': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a message.',
	},
	'tickets.createTicket': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a ticket.',
	},
	'tickets.createTicketTags': {
		riskLevel: 'write',
		description: 'Gorgias REST: Add ticket tags.',
	},
	'tickets.deleteTicket': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a ticket.',
	},
	'tickets.deleteTicketCustomField': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete ticket field value.',
	},
	'tickets.deleteTicketTags': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Remove ticket tags.',
	},
	'tickets.getTicket': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a ticket.',
	},
	'tickets.listTicketCustomFields': {
		riskLevel: 'read',
		description: 'Gorgias REST: List ticket field values.',
	},
	'tickets.listTicketTags': {
		riskLevel: 'read',
		description: 'Gorgias REST: List ticket tags.',
	},
	'tickets.listTickets': {
		riskLevel: 'read',
		description: 'Gorgias REST: List tickets.',
	},
	'tickets.updateTicket': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a ticket.',
	},
	'tickets.updateTicketCustomField': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update ticket field value.',
	},
	'tickets.updateTicketCustomFields': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update ticket fields values.',
	},
	'tickets.updateTicketTags': {
		riskLevel: 'write',
		description: 'Gorgias REST: Set ticket tags.',
	},
	'users.createUser': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a user.',
	},
	'users.deleteUser': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a user.',
	},
	'users.getUser': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a user.',
	},
	'users.listUsers': {
		riskLevel: 'read',
		description: 'Gorgias REST: List users.',
	},
	'users.updateUser': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a user.',
	},
	'views.createView': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a view.',
	},
	'views.deleteView': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a view.',
	},
	'views.getView': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a view.',
	},
	'views.listViewItems': {
		riskLevel: 'read',
		description: "Gorgias REST: List view's items.",
	},
	'views.listViews': {
		riskLevel: 'read',
		description: 'Gorgias REST: List views.',
	},
	'views.updateView': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a view.',
	},
	'views.updateViewItems': {
		riskLevel: 'write',
		description: "Gorgias REST: Search for view's items.",
	},
	'voiceCallEvents.getVoiceCallEvent': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a voice call event.',
	},
	'voiceCallEvents.listVoiceCallEvents': {
		riskLevel: 'read',
		description: 'Gorgias REST: List voice call events.',
	},
	'voiceCallRecordings.deleteVoiceCallRecording': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a voice call recording.',
	},
	'voiceCallRecordings.getVoiceCallRecording': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a voice call recording.',
	},
	'voiceCallRecordings.listVoiceCallRecordings': {
		riskLevel: 'read',
		description: 'Gorgias REST: List voice call recordings.',
	},
	'voiceCalls.getVoiceCall': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a voice call.',
	},
	'voiceCalls.listVoiceCalls': {
		riskLevel: 'read',
		description: 'Gorgias REST: List voice calls.',
	},
	'widgets.createWidget': {
		riskLevel: 'write',
		description: 'Gorgias REST: Create a widget.',
	},
	'widgets.deleteWidget': {
		riskLevel: 'destructive',
		description: 'Gorgias REST: Delete a widget.',
	},
	'widgets.getWidget': {
		riskLevel: 'read',
		description: 'Gorgias REST: Retrieve a widget.',
	},
	'widgets.listWidgets': {
		riskLevel: 'read',
		description: 'Gorgias REST: List widgets.',
	},
	'widgets.updateWidget': {
		riskLevel: 'write',
		description: 'Gorgias REST: Update a widget.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gorgiasEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export const gorgiasAuthConfig = {
	api_key: { account: ['email', 'tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseGorgiasPlugin<T extends GorgiasPluginOptions> = CorsairPlugin<
	'gorgias',
	typeof GorgiasSchema,
	typeof gorgiasEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof gorgiasAuthConfig
>;
export type InternalGorgiasPlugin = BaseGorgiasPlugin<GorgiasPluginOptions>;
export type ExternalGorgiasPlugin<T extends GorgiasPluginOptions> =
	BaseGorgiasPlugin<T>;

export function gorgias<const T extends GorgiasPluginOptions>(
	incomingOptions: GorgiasPluginOptions & T = {} as GorgiasPluginOptions & T,
): ExternalGorgiasPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callerHandlers,
		...builtInHandlers,
		...callerHandlers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
	return {
		id: 'gorgias',
		authConfig: gorgiasAuthConfig,
		schema: GorgiasSchema,
		options,
		hooks: options.hooks,
		endpoints: gorgiasEndpointsNested,
		webhooks: {},
		endpointMeta: gorgiasEndpointMeta,
		endpointSchemas: gorgiasEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: GorgiasKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (!ctx.keys) throw new AuthMissingError('gorgias', 'api_key');
			const [apiKey, email, subdomain] = await Promise.all([
				ctx.keys.get_api_key(),
				ctx.keys.get_email(),
				ctx.keys.get_tenant_external_id(),
			]);
			if (!apiKey || !email || !subdomain) {
				throw new AuthMissingError('gorgias', 'api_key');
			}
			return apiKey;
		},
	} satisfies InternalGorgiasPlugin;
}

export type {
	GorgiasEndpointInputs,
	GorgiasEndpointOutputs,
} from './endpoints/types';
