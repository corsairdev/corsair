import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GorgiasContext } from '..';
import { makeGorgiasRequest } from '../client';
import type { GorgiasOperationDefinition } from './definitions';
import { gorgiasOperationDefinitions } from './definitions';

type OperationDefinitionFor<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
> = {
	key: string;
	operationId: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	summary: string;
	input: InputSchema;
	output: OutputSchema;
	multipart: boolean;
	binary: boolean;
};

function createGorgiasEndpoint<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
>(definition: OperationDefinitionFor<InputSchema, OutputSchema>) {
	return async (
		ctx: GorgiasContext,
		input: z.input<InputSchema>,
	): Promise<z.output<OutputSchema>> => {
		const parsedInput = definition.input.parse(input);
		// `unknown` because HTTP JSON remains untrusted until the output schema validates it.
		const response: unknown = await makeGorgiasRequest(
			ctx,
			definition,
			parsedInput,
		);
		const parsedOutput = definition.output.parse(response);
		await logEventFromContext(
			ctx,
			`gorgias.${definition.key}`,
			{ operation: definition.operationId },
			'completed',
		);
		return parsedOutput;
	};
}

export async function executeGorgiasOperation(
	ctx: GorgiasContext,
	definition: GorgiasOperationDefinition,
	// `unknown` because this dispatch helper is used by the inventory-driven test matrix.
	input: unknown,
): Promise<unknown> {
	const parsedInput = definition.input.parse(input);
	// `unknown` because the provider response is untrusted until schema parsing below.
	const response: unknown = await makeGorgiasRequest(
		ctx,
		definition,
		parsedInput,
	);
	const parsedOutput = definition.output.parse(response);
	await logEventFromContext(
		ctx,
		`gorgias.${definition.key}`,
		{ operation: definition.operationId },
		'completed',
	);
	return parsedOutput;
}

export const Gorgias = {
	account: {
		createAccountSetting: createGorgiasEndpoint(
			gorgiasOperationDefinitions['account']['createAccountSetting'],
		),
		getAccount: createGorgiasEndpoint(
			gorgiasOperationDefinitions['account']['getAccount'],
		),
		listAccountSettings: createGorgiasEndpoint(
			gorgiasOperationDefinitions['account']['listAccountSettings'],
		),
		updateAccountSetting: createGorgiasEndpoint(
			gorgiasOperationDefinitions['account']['updateAccountSetting'],
		),
	},
	customFields: {
		createCustomField: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customFields']['createCustomField'],
		),
		getCustomField: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customFields']['getCustomField'],
		),
		listCustomFields: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customFields']['listCustomFields'],
		),
		updateCustomField: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customFields']['updateCustomField'],
		),
		updateCustomFields: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customFields']['updateCustomFields'],
		),
	},
	customers: {
		createCustomer: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers']['createCustomer'],
		),
		deleteCustomer: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers']['deleteCustomer'],
		),
		deleteCustomerCustomFieldValue: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers'][
				'deleteCustomerCustomFieldValue'
			],
		),
		deleteCustomers: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers']['deleteCustomers'],
		),
		getCustomer: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers']['getCustomer'],
		),
		listCustomerCustomFieldsValues: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers'][
				'listCustomerCustomFieldsValues'
			],
		),
		listCustomers: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers']['listCustomers'],
		),
		mergeCustomers: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers']['mergeCustomers'],
		),
		updateCustomer: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers']['updateCustomer'],
		),
		updateCustomerCustomFieldValue: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers'][
				'updateCustomerCustomFieldValue'
			],
		),
		updateCustomerCustomFieldValues: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers'][
				'updateCustomerCustomFieldValues'
			],
		),
		updateCustomerData: createGorgiasEndpoint(
			gorgiasOperationDefinitions['customers']['updateCustomerData'],
		),
	},
	events: {
		getEvent: createGorgiasEndpoint(
			gorgiasOperationDefinitions['events']['getEvent'],
		),
		listEvents: createGorgiasEndpoint(
			gorgiasOperationDefinitions['events']['listEvents'],
		),
	},
	files: {
		uploadFiles: createGorgiasEndpoint(
			gorgiasOperationDefinitions['files']['uploadFiles'],
		),
		downloadFile: createGorgiasEndpoint(
			gorgiasOperationDefinitions['files']['downloadFile'],
		),
	},
	integrations: {
		createIntegration: createGorgiasEndpoint(
			gorgiasOperationDefinitions['integrations']['createIntegration'],
		),
		deleteIntegration: createGorgiasEndpoint(
			gorgiasOperationDefinitions['integrations']['deleteIntegration'],
		),
		getIntegration: createGorgiasEndpoint(
			gorgiasOperationDefinitions['integrations']['getIntegration'],
		),
		listIntegrations: createGorgiasEndpoint(
			gorgiasOperationDefinitions['integrations']['listIntegrations'],
		),
		updateIntegration: createGorgiasEndpoint(
			gorgiasOperationDefinitions['integrations']['updateIntegration'],
		),
	},
	jobs: {
		cancelJob: createGorgiasEndpoint(
			gorgiasOperationDefinitions['jobs']['cancelJob'],
		),
		createJob: createGorgiasEndpoint(
			gorgiasOperationDefinitions['jobs']['createJob'],
		),
		getJob: createGorgiasEndpoint(
			gorgiasOperationDefinitions['jobs']['getJob'],
		),
		listJobs: createGorgiasEndpoint(
			gorgiasOperationDefinitions['jobs']['listJobs'],
		),
		updateJob: createGorgiasEndpoint(
			gorgiasOperationDefinitions['jobs']['updateJob'],
		),
	},
	macros: {
		bulkArchiveMacros: createGorgiasEndpoint(
			gorgiasOperationDefinitions['macros']['bulkArchiveMacros'],
		),
		bulkUnarchiveMacros: createGorgiasEndpoint(
			gorgiasOperationDefinitions['macros']['bulkUnarchiveMacros'],
		),
		createMacro: createGorgiasEndpoint(
			gorgiasOperationDefinitions['macros']['createMacro'],
		),
		deleteMacro: createGorgiasEndpoint(
			gorgiasOperationDefinitions['macros']['deleteMacro'],
		),
		getMacro: createGorgiasEndpoint(
			gorgiasOperationDefinitions['macros']['getMacro'],
		),
		listMacros: createGorgiasEndpoint(
			gorgiasOperationDefinitions['macros']['listMacros'],
		),
		updateMacro: createGorgiasEndpoint(
			gorgiasOperationDefinitions['macros']['updateMacro'],
		),
	},
	metricCards: {
		createMetricCardFeedback: createGorgiasEndpoint(
			gorgiasOperationDefinitions['metricCards']['createMetricCardFeedback'],
		),
		getMetricCard: createGorgiasEndpoint(
			gorgiasOperationDefinitions['metricCards']['getMetricCard'],
		),
		searchMetricCards: createGorgiasEndpoint(
			gorgiasOperationDefinitions['metricCards']['searchMetricCards'],
		),
	},
	reportingStatistics: {
		getStatistic: createGorgiasEndpoint(
			gorgiasOperationDefinitions['reportingStatistics']['getStatistic'],
		),
	},
	rules: {
		createRule: createGorgiasEndpoint(
			gorgiasOperationDefinitions['rules']['createRule'],
		),
		deleteRule: createGorgiasEndpoint(
			gorgiasOperationDefinitions['rules']['deleteRule'],
		),
		getRule: createGorgiasEndpoint(
			gorgiasOperationDefinitions['rules']['getRule'],
		),
		listRules: createGorgiasEndpoint(
			gorgiasOperationDefinitions['rules']['listRules'],
		),
		updateRule: createGorgiasEndpoint(
			gorgiasOperationDefinitions['rules']['updateRule'],
		),
		updateRulesPriorities: createGorgiasEndpoint(
			gorgiasOperationDefinitions['rules']['updateRulesPriorities'],
		),
	},
	satisfactionSurveys: {
		createSatisfactionSurvey: createGorgiasEndpoint(
			gorgiasOperationDefinitions['satisfactionSurveys'][
				'createSatisfactionSurvey'
			],
		),
		getSatisfactionSurvey: createGorgiasEndpoint(
			gorgiasOperationDefinitions['satisfactionSurveys'][
				'getSatisfactionSurvey'
			],
		),
		listSatisfactionSurveys: createGorgiasEndpoint(
			gorgiasOperationDefinitions['satisfactionSurveys'][
				'listSatisfactionSurveys'
			],
		),
		updateSatisfactionSurvey: createGorgiasEndpoint(
			gorgiasOperationDefinitions['satisfactionSurveys'][
				'updateSatisfactionSurvey'
			],
		),
	},
	search: {
		search: createGorgiasEndpoint(
			gorgiasOperationDefinitions['search']['search'],
		),
	},
	statistics: {
		downloadLegacyStatistic: createGorgiasEndpoint(
			gorgiasOperationDefinitions['statistics']['downloadLegacyStatistic'],
		),
		getLegacyStatistic: createGorgiasEndpoint(
			gorgiasOperationDefinitions['statistics']['getLegacyStatistic'],
		),
	},
	tags: {
		createTag: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tags']['createTag'],
		),
		deleteTag: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tags']['deleteTag'],
		),
		deleteTags: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tags']['deleteTags'],
		),
		getTag: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tags']['getTag'],
		),
		listTags: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tags']['listTags'],
		),
		mergeTags: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tags']['mergeTags'],
		),
		updateTag: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tags']['updateTag'],
		),
	},
	teams: {
		createTeam: createGorgiasEndpoint(
			gorgiasOperationDefinitions['teams']['createTeam'],
		),
		deleteTeam: createGorgiasEndpoint(
			gorgiasOperationDefinitions['teams']['deleteTeam'],
		),
		getTeam: createGorgiasEndpoint(
			gorgiasOperationDefinitions['teams']['getTeam'],
		),
		listTeams: createGorgiasEndpoint(
			gorgiasOperationDefinitions['teams']['listTeams'],
		),
		updateTeam: createGorgiasEndpoint(
			gorgiasOperationDefinitions['teams']['updateTeam'],
		),
	},
	ticketMessages: {
		createTicketMessage: createGorgiasEndpoint(
			gorgiasOperationDefinitions['ticketMessages']['createTicketMessage'],
		),
		deleteTicketMessage: createGorgiasEndpoint(
			gorgiasOperationDefinitions['ticketMessages']['deleteTicketMessage'],
		),
		getTicketMessage: createGorgiasEndpoint(
			gorgiasOperationDefinitions['ticketMessages']['getTicketMessage'],
		),
		listMessages: createGorgiasEndpoint(
			gorgiasOperationDefinitions['ticketMessages']['listMessages'],
		),
		listTicketMessages: createGorgiasEndpoint(
			gorgiasOperationDefinitions['ticketMessages']['listTicketMessages'],
		),
		updateTicketMessage: createGorgiasEndpoint(
			gorgiasOperationDefinitions['ticketMessages']['updateTicketMessage'],
		),
	},
	tickets: {
		createTicket: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['createTicket'],
		),
		createTicketTags: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['createTicketTags'],
		),
		deleteTicket: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['deleteTicket'],
		),
		deleteTicketCustomField: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['deleteTicketCustomField'],
		),
		deleteTicketTags: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['deleteTicketTags'],
		),
		getTicket: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['getTicket'],
		),
		listTicketCustomFields: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['listTicketCustomFields'],
		),
		listTicketTags: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['listTicketTags'],
		),
		listTickets: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['listTickets'],
		),
		updateTicket: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['updateTicket'],
		),
		updateTicketCustomField: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['updateTicketCustomField'],
		),
		updateTicketCustomFields: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['updateTicketCustomFields'],
		),
		updateTicketTags: createGorgiasEndpoint(
			gorgiasOperationDefinitions['tickets']['updateTicketTags'],
		),
	},
	users: {
		createUser: createGorgiasEndpoint(
			gorgiasOperationDefinitions['users']['createUser'],
		),
		deleteUser: createGorgiasEndpoint(
			gorgiasOperationDefinitions['users']['deleteUser'],
		),
		getUser: createGorgiasEndpoint(
			gorgiasOperationDefinitions['users']['getUser'],
		),
		listUsers: createGorgiasEndpoint(
			gorgiasOperationDefinitions['users']['listUsers'],
		),
		updateUser: createGorgiasEndpoint(
			gorgiasOperationDefinitions['users']['updateUser'],
		),
	},
	views: {
		createView: createGorgiasEndpoint(
			gorgiasOperationDefinitions['views']['createView'],
		),
		deleteView: createGorgiasEndpoint(
			gorgiasOperationDefinitions['views']['deleteView'],
		),
		getView: createGorgiasEndpoint(
			gorgiasOperationDefinitions['views']['getView'],
		),
		listViewItems: createGorgiasEndpoint(
			gorgiasOperationDefinitions['views']['listViewItems'],
		),
		listViews: createGorgiasEndpoint(
			gorgiasOperationDefinitions['views']['listViews'],
		),
		updateView: createGorgiasEndpoint(
			gorgiasOperationDefinitions['views']['updateView'],
		),
		updateViewItems: createGorgiasEndpoint(
			gorgiasOperationDefinitions['views']['updateViewItems'],
		),
	},
	voiceCallEvents: {
		getVoiceCallEvent: createGorgiasEndpoint(
			gorgiasOperationDefinitions['voiceCallEvents']['getVoiceCallEvent'],
		),
		listVoiceCallEvents: createGorgiasEndpoint(
			gorgiasOperationDefinitions['voiceCallEvents']['listVoiceCallEvents'],
		),
	},
	voiceCallRecordings: {
		deleteVoiceCallRecording: createGorgiasEndpoint(
			gorgiasOperationDefinitions['voiceCallRecordings'][
				'deleteVoiceCallRecording'
			],
		),
		getVoiceCallRecording: createGorgiasEndpoint(
			gorgiasOperationDefinitions['voiceCallRecordings'][
				'getVoiceCallRecording'
			],
		),
		listVoiceCallRecordings: createGorgiasEndpoint(
			gorgiasOperationDefinitions['voiceCallRecordings'][
				'listVoiceCallRecordings'
			],
		),
	},
	voiceCalls: {
		getVoiceCall: createGorgiasEndpoint(
			gorgiasOperationDefinitions['voiceCalls']['getVoiceCall'],
		),
		listVoiceCalls: createGorgiasEndpoint(
			gorgiasOperationDefinitions['voiceCalls']['listVoiceCalls'],
		),
	},
	widgets: {
		createWidget: createGorgiasEndpoint(
			gorgiasOperationDefinitions['widgets']['createWidget'],
		),
		deleteWidget: createGorgiasEndpoint(
			gorgiasOperationDefinitions['widgets']['deleteWidget'],
		),
		getWidget: createGorgiasEndpoint(
			gorgiasOperationDefinitions['widgets']['getWidget'],
		),
		listWidgets: createGorgiasEndpoint(
			gorgiasOperationDefinitions['widgets']['listWidgets'],
		),
		updateWidget: createGorgiasEndpoint(
			gorgiasOperationDefinitions['widgets']['updateWidget'],
		),
	},
} as const;

export const gorgiasEndpointsNested = Gorgias;
export type GorgiasEndpointTree = typeof gorgiasEndpointsNested;
