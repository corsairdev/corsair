import type {
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
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import {
	AppointmentLinks,
	CodeSnippets,
	FileRequests,
	InsightsReports,
	Integrations,
	Livefeed,
	MeetingInvites,
	Meetings,
	MeetingTypes,
	Messages,
	Polls,
	Qa,
	Reports,
	Rules,
	Salesforce,
	SequenceFolders,
	Sequences,
	Snippets,
	SnippetTags,
	Tasks,
	Teams,
	Unsubscribes,
	Users,
	YesNo,
} from './endpoints';
import type {
	MixmaxEndpointInputs,
	MixmaxEndpointOutputs,
} from './endpoints/types';
import {
	MixmaxEndpointInputSchemas,
	MixmaxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MixmaxSchema } from './schema';

export type MixmaxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMixmaxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mixmaxEndpointsNested>;
};

export type MixmaxContext = CorsairPluginContext<
	typeof MixmaxSchema,
	MixmaxPluginOptions
>;

export type MixmaxKeyBuilderContext = KeyBuilderContext<MixmaxPluginOptions>;

export type MixmaxBoundEndpoints = BindEndpoints<typeof mixmaxEndpointsNested>;

type MixmaxEndpoint<K extends keyof MixmaxEndpointOutputs> = CorsairEndpoint<
	MixmaxContext,
	MixmaxEndpointInputs[K],
	MixmaxEndpointOutputs[K]
>;

export type MixmaxEndpoints = {
	usersGetMe: MixmaxEndpoint<'usersGetMe'>;
	userPreferencesGet: MixmaxEndpoint<'userPreferencesGet'>;
	userPreferencesUpdate: MixmaxEndpoint<'userPreferencesUpdate'>;
	userPreferencesAutoBccList: MixmaxEndpoint<'userPreferencesAutoBccList'>;
	userPreferencesAutoBccAdd: MixmaxEndpoint<'userPreferencesAutoBccAdd'>;
	userPreferencesAutoBccExists: MixmaxEndpoint<'userPreferencesAutoBccExists'>;
	messagesList: MixmaxEndpoint<'messagesList'>;
	messagesCreate: MixmaxEndpoint<'messagesCreate'>;
	messagesGet: MixmaxEndpoint<'messagesGet'>;
	messagesUpdate: MixmaxEndpoint<'messagesUpdate'>;
	messagesSend: MixmaxEndpoint<'messagesSend'>;
	messagesSchedule: MixmaxEndpoint<'messagesSchedule'>;
	messagesUnschedule: MixmaxEndpoint<'messagesUnschedule'>;
	messagesTest: MixmaxEndpoint<'messagesTest'>;
	messagesSendPlain: MixmaxEndpoint<'messagesSendPlain'>;
	snippetsList: MixmaxEndpoint<'snippetsList'>;
	snippetsGet: MixmaxEndpoint<'snippetsGet'>;
	snippetsUpdate: MixmaxEndpoint<'snippetsUpdate'>;
	snippetsDelete: MixmaxEndpoint<'snippetsDelete'>;
	snippetsSend: MixmaxEndpoint<'snippetsSend'>;
	snippetTagsList: MixmaxEndpoint<'snippetTagsList'>;
	snippetTagsCreate: MixmaxEndpoint<'snippetTagsCreate'>;
	snippetTagsGet: MixmaxEndpoint<'snippetTagsGet'>;
	snippetTagsUpdate: MixmaxEndpoint<'snippetTagsUpdate'>;
	snippetTagsDelete: MixmaxEndpoint<'snippetTagsDelete'>;
	snippetTagsListSnippets: MixmaxEndpoint<'snippetTagsListSnippets'>;
	snippetTagsAddSnippets: MixmaxEndpoint<'snippetTagsAddSnippets'>;
	unsubscribesList: MixmaxEndpoint<'unsubscribesList'>;
	unsubscribesCreate: MixmaxEndpoint<'unsubscribesCreate'>;
	unsubscribesRemove: MixmaxEndpoint<'unsubscribesRemove'>;
	livefeedList: MixmaxEndpoint<'livefeedList'>;
	livefeedEvents: MixmaxEndpoint<'livefeedEvents'>;
	sequencesList: MixmaxEndpoint<'sequencesList'>;
	sequencesSearch: MixmaxEndpoint<'sequencesSearch'>;
	sequencesCancelAll: MixmaxEndpoint<'sequencesCancelAll'>;
	sequencesCancel: MixmaxEndpoint<'sequencesCancel'>;
	sequencesRecipientsList: MixmaxEndpoint<'sequencesRecipientsList'>;
	sequencesRecipientsAdd: MixmaxEndpoint<'sequencesRecipientsAdd'>;
	sequenceFoldersList: MixmaxEndpoint<'sequenceFoldersList'>;
	sequenceFoldersCreate: MixmaxEndpoint<'sequenceFoldersCreate'>;
	sequenceFoldersGet: MixmaxEndpoint<'sequenceFoldersGet'>;
	sequenceFoldersRename: MixmaxEndpoint<'sequenceFoldersRename'>;
	sequenceFoldersDelete: MixmaxEndpoint<'sequenceFoldersDelete'>;
	sequenceFoldersAddSequences: MixmaxEndpoint<'sequenceFoldersAddSequences'>;
	rulesList: MixmaxEndpoint<'rulesList'>;
	rulesCreate: MixmaxEndpoint<'rulesCreate'>;
	rulesGet: MixmaxEndpoint<'rulesGet'>;
	rulesUpdate: MixmaxEndpoint<'rulesUpdate'>;
	rulesDelete: MixmaxEndpoint<'rulesDelete'>;
	rulesDeleteBulk: MixmaxEndpoint<'rulesDeleteBulk'>;
	rulesListActions: MixmaxEndpoint<'rulesListActions'>;
	rulesCreateAction: MixmaxEndpoint<'rulesCreateAction'>;
	rulesUpdateAction: MixmaxEndpoint<'rulesUpdateAction'>;
	rulesDeleteAction: MixmaxEndpoint<'rulesDeleteAction'>;
	rulesListEvents: MixmaxEndpoint<'rulesListEvents'>;
	rulesGetEvent: MixmaxEndpoint<'rulesGetEvent'>;
	codeSnippetsList: MixmaxEndpoint<'codeSnippetsList'>;
	codeSnippetsCreate: MixmaxEndpoint<'codeSnippetsCreate'>;
	codeSnippetsGet: MixmaxEndpoint<'codeSnippetsGet'>;
	qaList: MixmaxEndpoint<'qaList'>;
	qaGet: MixmaxEndpoint<'qaGet'>;
	yesnoList: MixmaxEndpoint<'yesnoList'>;
	yesnoGet: MixmaxEndpoint<'yesnoGet'>;
	pollsList: MixmaxEndpoint<'pollsList'>;
	pollsGet: MixmaxEndpoint<'pollsGet'>;
	appointmentLinksList: MixmaxEndpoint<'appointmentLinksList'>;
	appointmentLinksGetMe: MixmaxEndpoint<'appointmentLinksGetMe'>;
	appointmentLinksUpdateMe: MixmaxEndpoint<'appointmentLinksUpdateMe'>;
	meetingTypesList: MixmaxEndpoint<'meetingTypesList'>;
	meetingTypesCreate: MixmaxEndpoint<'meetingTypesCreate'>;
	meetingTypesGet: MixmaxEndpoint<'meetingTypesGet'>;
	meetingTypesUpdate: MixmaxEndpoint<'meetingTypesUpdate'>;
	meetingTypesDelete: MixmaxEndpoint<'meetingTypesDelete'>;
	meetingInvitesList: MixmaxEndpoint<'meetingInvitesList'>;
	meetingInvitesGet: MixmaxEndpoint<'meetingInvitesGet'>;
	meetingsSearchSummaries: MixmaxEndpoint<'meetingsSearchSummaries'>;
	meetingsGetTranscript: MixmaxEndpoint<'meetingsGetTranscript'>;
	tasksList: MixmaxEndpoint<'tasksList'>;
	fileRequestsList: MixmaxEndpoint<'fileRequestsList'>;
	fileRequestsGet: MixmaxEndpoint<'fileRequestsGet'>;
	insightsReportsList: MixmaxEndpoint<'insightsReportsList'>;
	insightsReportsCreate: MixmaxEndpoint<'insightsReportsCreate'>;
	insightsReportsUpdate: MixmaxEndpoint<'insightsReportsUpdate'>;
	insightsReportsDelete: MixmaxEndpoint<'insightsReportsDelete'>;
	reportsRunDataTable: MixmaxEndpoint<'reportsRunDataTable'>;
	salesforceListAccounts: MixmaxEndpoint<'salesforceListAccounts'>;
	salesforceCreateAccount: MixmaxEndpoint<'salesforceCreateAccount'>;
	salesforceGetAccountImplicit: MixmaxEndpoint<'salesforceGetAccountImplicit'>;
	salesforceGetAccount: MixmaxEndpoint<'salesforceGetAccount'>;
	salesforceUpdateAccount: MixmaxEndpoint<'salesforceUpdateAccount'>;
	salesforceCreateContact: MixmaxEndpoint<'salesforceCreateContact'>;
	salesforceGetContact: MixmaxEndpoint<'salesforceGetContact'>;
	salesforceUpdateContact: MixmaxEndpoint<'salesforceUpdateContact'>;
	salesforceListContactTasks: MixmaxEndpoint<'salesforceListContactTasks'>;
	salesforceGetContactOrLead: MixmaxEndpoint<'salesforceGetContactOrLead'>;
	salesforceCreateLead: MixmaxEndpoint<'salesforceCreateLead'>;
	salesforceGetLead: MixmaxEndpoint<'salesforceGetLead'>;
	salesforceUpdateLead: MixmaxEndpoint<'salesforceUpdateLead'>;
	salesforceListLeadTasks: MixmaxEndpoint<'salesforceListLeadTasks'>;
	salesforceCreateOpportunity: MixmaxEndpoint<'salesforceCreateOpportunity'>;
	salesforceGetOpportunity: MixmaxEndpoint<'salesforceGetOpportunity'>;
	salesforceUpdateOpportunity: MixmaxEndpoint<'salesforceUpdateOpportunity'>;
	salesforceDeleteOpportunity: MixmaxEndpoint<'salesforceDeleteOpportunity'>;
	salesforceSearch: MixmaxEndpoint<'salesforceSearch'>;
	salesforceSyncedFields: MixmaxEndpoint<'salesforceSyncedFields'>;
	salesforceCreateTask: MixmaxEndpoint<'salesforceCreateTask'>;
	salesforceGetTask: MixmaxEndpoint<'salesforceGetTask'>;
	salesforceUpdateTask: MixmaxEndpoint<'salesforceUpdateTask'>;
	salesforceDeleteTask: MixmaxEndpoint<'salesforceDeleteTask'>;
	salesforceGetWhat: MixmaxEndpoint<'salesforceGetWhat'>;
	salesforceGetWho: MixmaxEndpoint<'salesforceGetWho'>;
	teamsList: MixmaxEndpoint<'teamsList'>;
	teamsCreate: MixmaxEndpoint<'teamsCreate'>;
	teamsGet: MixmaxEndpoint<'teamsGet'>;
	teamsUpdate: MixmaxEndpoint<'teamsUpdate'>;
	teamsDelete: MixmaxEndpoint<'teamsDelete'>;
	teamsMembersList: MixmaxEndpoint<'teamsMembersList'>;
	teamsMembersAdd: MixmaxEndpoint<'teamsMembersAdd'>;
	teamsMembersRemove: MixmaxEndpoint<'teamsMembersRemove'>;
	teamsMembersUpdate: MixmaxEndpoint<'teamsMembersUpdate'>;
	integrationsCommandsList: MixmaxEndpoint<'integrationsCommandsList'>;
	integrationsCommandsCreate: MixmaxEndpoint<'integrationsCommandsCreate'>;
	integrationsCommandsDelete: MixmaxEndpoint<'integrationsCommandsDelete'>;
	integrationsEnhancementsList: MixmaxEndpoint<'integrationsEnhancementsList'>;
	integrationsEnhancementsCreate: MixmaxEndpoint<'integrationsEnhancementsCreate'>;
	integrationsEnhancementsDelete: MixmaxEndpoint<'integrationsEnhancementsDelete'>;
	integrationsLinkResolversList: MixmaxEndpoint<'integrationsLinkResolversList'>;
	integrationsLinkResolversCreate: MixmaxEndpoint<'integrationsLinkResolversCreate'>;
	integrationsLinkResolversDelete: MixmaxEndpoint<'integrationsLinkResolversDelete'>;
	integrationsSidebarsList: MixmaxEndpoint<'integrationsSidebarsList'>;
	integrationsSidebarsCreate: MixmaxEndpoint<'integrationsSidebarsCreate'>;
	integrationsSidebarsDelete: MixmaxEndpoint<'integrationsSidebarsDelete'>;
};

const mixmaxEndpointsNested = {
	users: {
		getMe: Users.getMe,
		preferences: {
			get: Users.preferences.get,
			update: Users.preferences.update,
			autoBccExcludedEmails: {
				list: Users.preferences.autoBccExcludedEmails.list,
				add: Users.preferences.autoBccExcludedEmails.add,
				exists: Users.preferences.autoBccExcludedEmails.exists,
			},
		},
	},
	messages: {
		list: Messages.list,
		create: Messages.create,
		get: Messages.get,
		update: Messages.update,
		send: Messages.send,
		schedule: Messages.schedule,
		unschedule: Messages.unschedule,
		test: Messages.test,
		sendPlain: Messages.sendPlain,
	},
	snippets: {
		list: Snippets.list,
		get: Snippets.get,
		update: Snippets.update,
		delete: Snippets.delete,
		send: Snippets.send,
	},
	snippetTags: {
		list: SnippetTags.list,
		create: SnippetTags.create,
		get: SnippetTags.get,
		update: SnippetTags.update,
		delete: SnippetTags.delete,
		listSnippets: SnippetTags.listSnippets,
		addSnippets: SnippetTags.addSnippets,
	},
	unsubscribes: {
		list: Unsubscribes.list,
		create: Unsubscribes.create,
		remove: Unsubscribes.remove,
	},
	livefeed: {
		list: Livefeed.list,
		events: Livefeed.events,
	},
	sequences: {
		list: Sequences.list,
		search: Sequences.search,
		cancelAll: Sequences.cancelAll,
		cancel: Sequences.cancel,
		recipients: {
			list: Sequences.recipients.list,
			add: Sequences.recipients.add,
		},
	},
	sequenceFolders: {
		list: SequenceFolders.list,
		create: SequenceFolders.create,
		get: SequenceFolders.get,
		rename: SequenceFolders.rename,
		delete: SequenceFolders.delete,
		addSequences: SequenceFolders.addSequences,
	},
	rules: {
		list: Rules.list,
		create: Rules.create,
		get: Rules.get,
		update: Rules.update,
		delete: Rules.delete,
		deleteBulk: Rules.deleteBulk,
		actions: {
			list: Rules.actions.list,
			create: Rules.actions.create,
			update: Rules.actions.update,
			delete: Rules.actions.delete,
		},
		events: {
			list: Rules.events.list,
			get: Rules.events.get,
		},
	},
	codeSnippets: {
		list: CodeSnippets.list,
		create: CodeSnippets.create,
		get: CodeSnippets.get,
	},
	qa: {
		list: Qa.list,
		get: Qa.get,
	},
	yesno: {
		list: YesNo.list,
		get: YesNo.get,
	},
	polls: {
		list: Polls.list,
		get: Polls.get,
	},
	appointmentLinks: {
		list: AppointmentLinks.list,
		getMe: AppointmentLinks.getMe,
		updateMe: AppointmentLinks.updateMe,
	},
	meetingTypes: {
		list: MeetingTypes.list,
		create: MeetingTypes.create,
		get: MeetingTypes.get,
		update: MeetingTypes.update,
		delete: MeetingTypes.delete,
	},
	meetingInvites: {
		list: MeetingInvites.list,
		get: MeetingInvites.get,
	},
	meetings: {
		searchSummaries: Meetings.searchSummaries,
		getTranscript: Meetings.getTranscript,
	},
	tasks: {
		list: Tasks.list,
	},
	fileRequests: {
		list: FileRequests.list,
		get: FileRequests.get,
	},
	insightsReports: {
		list: InsightsReports.list,
		create: InsightsReports.create,
		update: InsightsReports.update,
		delete: InsightsReports.delete,
	},
	reports: {
		runDataTable: Reports.runDataTable,
	},
	salesforce: {
		listAccounts: Salesforce.listAccounts,
		createAccount: Salesforce.createAccount,
		getAccountImplicit: Salesforce.getAccountImplicit,
		getAccount: Salesforce.getAccount,
		updateAccount: Salesforce.updateAccount,
		createContact: Salesforce.createContact,
		getContact: Salesforce.getContact,
		updateContact: Salesforce.updateContact,
		listContactTasks: Salesforce.listContactTasks,
		getContactOrLead: Salesforce.getContactOrLead,
		createLead: Salesforce.createLead,
		getLead: Salesforce.getLead,
		updateLead: Salesforce.updateLead,
		listLeadTasks: Salesforce.listLeadTasks,
		createOpportunity: Salesforce.createOpportunity,
		getOpportunity: Salesforce.getOpportunity,
		updateOpportunity: Salesforce.updateOpportunity,
		deleteOpportunity: Salesforce.deleteOpportunity,
		search: Salesforce.search,
		syncedFields: Salesforce.syncedFields,
		createTask: Salesforce.createTask,
		getTask: Salesforce.getTask,
		updateTask: Salesforce.updateTask,
		deleteTask: Salesforce.deleteTask,
		getWhat: Salesforce.getWhat,
		getWho: Salesforce.getWho,
	},
	teams: {
		list: Teams.list,
		create: Teams.create,
		get: Teams.get,
		update: Teams.update,
		delete: Teams.delete,
		members: {
			list: Teams.members.list,
			add: Teams.members.add,
			remove: Teams.members.remove,
			update: Teams.members.update,
		},
	},
	integrations: {
		commands: {
			list: Integrations.commands.list,
			create: Integrations.commands.create,
			delete: Integrations.commands.delete,
		},
		enhancements: {
			list: Integrations.enhancements.list,
			create: Integrations.enhancements.create,
			delete: Integrations.enhancements.delete,
		},
		linkResolvers: {
			list: Integrations.linkResolvers.list,
			create: Integrations.linkResolvers.create,
			delete: Integrations.linkResolvers.delete,
		},
		sidebars: {
			list: Integrations.sidebars.list,
			create: Integrations.sidebars.create,
			delete: Integrations.sidebars.delete,
		},
	},
} as const;

export const mixmaxEndpointSchemas = {
	'users.getMe': {
		input: MixmaxEndpointInputSchemas.usersGetMe,
		output: MixmaxEndpointOutputSchemas.usersGetMe,
	},
	'users.preferences.get': {
		input: MixmaxEndpointInputSchemas.userPreferencesGet,
		output: MixmaxEndpointOutputSchemas.userPreferencesGet,
	},
	'users.preferences.update': {
		input: MixmaxEndpointInputSchemas.userPreferencesUpdate,
		output: MixmaxEndpointOutputSchemas.userPreferencesUpdate,
	},
	'users.preferences.autoBccExcludedEmails.list': {
		input: MixmaxEndpointInputSchemas.userPreferencesAutoBccList,
		output: MixmaxEndpointOutputSchemas.userPreferencesAutoBccList,
	},
	'users.preferences.autoBccExcludedEmails.add': {
		input: MixmaxEndpointInputSchemas.userPreferencesAutoBccAdd,
		output: MixmaxEndpointOutputSchemas.userPreferencesAutoBccAdd,
	},
	'users.preferences.autoBccExcludedEmails.exists': {
		input: MixmaxEndpointInputSchemas.userPreferencesAutoBccExists,
		output: MixmaxEndpointOutputSchemas.userPreferencesAutoBccExists,
	},
	'messages.list': {
		input: MixmaxEndpointInputSchemas.messagesList,
		output: MixmaxEndpointOutputSchemas.messagesList,
	},
	'messages.create': {
		input: MixmaxEndpointInputSchemas.messagesCreate,
		output: MixmaxEndpointOutputSchemas.messagesCreate,
	},
	'messages.get': {
		input: MixmaxEndpointInputSchemas.messagesGet,
		output: MixmaxEndpointOutputSchemas.messagesGet,
	},
	'messages.update': {
		input: MixmaxEndpointInputSchemas.messagesUpdate,
		output: MixmaxEndpointOutputSchemas.messagesUpdate,
	},
	'messages.send': {
		input: MixmaxEndpointInputSchemas.messagesSend,
		output: MixmaxEndpointOutputSchemas.messagesSend,
	},
	'messages.schedule': {
		input: MixmaxEndpointInputSchemas.messagesSchedule,
		output: MixmaxEndpointOutputSchemas.messagesSchedule,
	},
	'messages.unschedule': {
		input: MixmaxEndpointInputSchemas.messagesUnschedule,
		output: MixmaxEndpointOutputSchemas.messagesUnschedule,
	},
	'messages.test': {
		input: MixmaxEndpointInputSchemas.messagesTest,
		output: MixmaxEndpointOutputSchemas.messagesTest,
	},
	'messages.sendPlain': {
		input: MixmaxEndpointInputSchemas.messagesSendPlain,
		output: MixmaxEndpointOutputSchemas.messagesSendPlain,
	},
	'snippets.list': {
		input: MixmaxEndpointInputSchemas.snippetsList,
		output: MixmaxEndpointOutputSchemas.snippetsList,
	},
	'snippets.get': {
		input: MixmaxEndpointInputSchemas.snippetsGet,
		output: MixmaxEndpointOutputSchemas.snippetsGet,
	},
	'snippets.update': {
		input: MixmaxEndpointInputSchemas.snippetsUpdate,
		output: MixmaxEndpointOutputSchemas.snippetsUpdate,
	},
	'snippets.delete': {
		input: MixmaxEndpointInputSchemas.snippetsDelete,
		output: MixmaxEndpointOutputSchemas.snippetsDelete,
	},
	'snippets.send': {
		input: MixmaxEndpointInputSchemas.snippetsSend,
		output: MixmaxEndpointOutputSchemas.snippetsSend,
	},
	'snippetTags.list': {
		input: MixmaxEndpointInputSchemas.snippetTagsList,
		output: MixmaxEndpointOutputSchemas.snippetTagsList,
	},
	'snippetTags.create': {
		input: MixmaxEndpointInputSchemas.snippetTagsCreate,
		output: MixmaxEndpointOutputSchemas.snippetTagsCreate,
	},
	'snippetTags.get': {
		input: MixmaxEndpointInputSchemas.snippetTagsGet,
		output: MixmaxEndpointOutputSchemas.snippetTagsGet,
	},
	'snippetTags.update': {
		input: MixmaxEndpointInputSchemas.snippetTagsUpdate,
		output: MixmaxEndpointOutputSchemas.snippetTagsUpdate,
	},
	'snippetTags.delete': {
		input: MixmaxEndpointInputSchemas.snippetTagsDelete,
		output: MixmaxEndpointOutputSchemas.snippetTagsDelete,
	},
	'snippetTags.listSnippets': {
		input: MixmaxEndpointInputSchemas.snippetTagsListSnippets,
		output: MixmaxEndpointOutputSchemas.snippetTagsListSnippets,
	},
	'snippetTags.addSnippets': {
		input: MixmaxEndpointInputSchemas.snippetTagsAddSnippets,
		output: MixmaxEndpointOutputSchemas.snippetTagsAddSnippets,
	},
	'unsubscribes.list': {
		input: MixmaxEndpointInputSchemas.unsubscribesList,
		output: MixmaxEndpointOutputSchemas.unsubscribesList,
	},
	'unsubscribes.create': {
		input: MixmaxEndpointInputSchemas.unsubscribesCreate,
		output: MixmaxEndpointOutputSchemas.unsubscribesCreate,
	},
	'unsubscribes.remove': {
		input: MixmaxEndpointInputSchemas.unsubscribesRemove,
		output: MixmaxEndpointOutputSchemas.unsubscribesRemove,
	},
	'livefeed.list': {
		input: MixmaxEndpointInputSchemas.livefeedList,
		output: MixmaxEndpointOutputSchemas.livefeedList,
	},
	'livefeed.events': {
		input: MixmaxEndpointInputSchemas.livefeedEvents,
		output: MixmaxEndpointOutputSchemas.livefeedEvents,
	},
	'sequences.list': {
		input: MixmaxEndpointInputSchemas.sequencesList,
		output: MixmaxEndpointOutputSchemas.sequencesList,
	},
	'sequences.search': {
		input: MixmaxEndpointInputSchemas.sequencesSearch,
		output: MixmaxEndpointOutputSchemas.sequencesSearch,
	},
	'sequences.cancelAll': {
		input: MixmaxEndpointInputSchemas.sequencesCancelAll,
		output: MixmaxEndpointOutputSchemas.sequencesCancelAll,
	},
	'sequences.cancel': {
		input: MixmaxEndpointInputSchemas.sequencesCancel,
		output: MixmaxEndpointOutputSchemas.sequencesCancel,
	},
	'sequences.recipients.list': {
		input: MixmaxEndpointInputSchemas.sequencesRecipientsList,
		output: MixmaxEndpointOutputSchemas.sequencesRecipientsList,
	},
	'sequences.recipients.add': {
		input: MixmaxEndpointInputSchemas.sequencesRecipientsAdd,
		output: MixmaxEndpointOutputSchemas.sequencesRecipientsAdd,
	},
	'sequenceFolders.list': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersList,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersList,
	},
	'sequenceFolders.create': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersCreate,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersCreate,
	},
	'sequenceFolders.get': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersGet,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersGet,
	},
	'sequenceFolders.rename': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersRename,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersRename,
	},
	'sequenceFolders.delete': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersDelete,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersDelete,
	},
	'sequenceFolders.addSequences': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersAddSequences,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersAddSequences,
	},
	'rules.list': {
		input: MixmaxEndpointInputSchemas.rulesList,
		output: MixmaxEndpointOutputSchemas.rulesList,
	},
	'rules.create': {
		input: MixmaxEndpointInputSchemas.rulesCreate,
		output: MixmaxEndpointOutputSchemas.rulesCreate,
	},
	'rules.get': {
		input: MixmaxEndpointInputSchemas.rulesGet,
		output: MixmaxEndpointOutputSchemas.rulesGet,
	},
	'rules.update': {
		input: MixmaxEndpointInputSchemas.rulesUpdate,
		output: MixmaxEndpointOutputSchemas.rulesUpdate,
	},
	'rules.delete': {
		input: MixmaxEndpointInputSchemas.rulesDelete,
		output: MixmaxEndpointOutputSchemas.rulesDelete,
	},
	'rules.deleteBulk': {
		input: MixmaxEndpointInputSchemas.rulesDeleteBulk,
		output: MixmaxEndpointOutputSchemas.rulesDeleteBulk,
	},
	'rules.actions.list': {
		input: MixmaxEndpointInputSchemas.rulesListActions,
		output: MixmaxEndpointOutputSchemas.rulesListActions,
	},
	'rules.actions.create': {
		input: MixmaxEndpointInputSchemas.rulesCreateAction,
		output: MixmaxEndpointOutputSchemas.rulesCreateAction,
	},
	'rules.actions.update': {
		input: MixmaxEndpointInputSchemas.rulesUpdateAction,
		output: MixmaxEndpointOutputSchemas.rulesUpdateAction,
	},
	'rules.actions.delete': {
		input: MixmaxEndpointInputSchemas.rulesDeleteAction,
		output: MixmaxEndpointOutputSchemas.rulesDeleteAction,
	},
	'rules.events.list': {
		input: MixmaxEndpointInputSchemas.rulesListEvents,
		output: MixmaxEndpointOutputSchemas.rulesListEvents,
	},
	'rules.events.get': {
		input: MixmaxEndpointInputSchemas.rulesGetEvent,
		output: MixmaxEndpointOutputSchemas.rulesGetEvent,
	},
	'codeSnippets.list': {
		input: MixmaxEndpointInputSchemas.codeSnippetsList,
		output: MixmaxEndpointOutputSchemas.codeSnippetsList,
	},
	'codeSnippets.create': {
		input: MixmaxEndpointInputSchemas.codeSnippetsCreate,
		output: MixmaxEndpointOutputSchemas.codeSnippetsCreate,
	},
	'codeSnippets.get': {
		input: MixmaxEndpointInputSchemas.codeSnippetsGet,
		output: MixmaxEndpointOutputSchemas.codeSnippetsGet,
	},
	'qa.list': {
		input: MixmaxEndpointInputSchemas.qaList,
		output: MixmaxEndpointOutputSchemas.qaList,
	},
	'qa.get': {
		input: MixmaxEndpointInputSchemas.qaGet,
		output: MixmaxEndpointOutputSchemas.qaGet,
	},
	'yesno.list': {
		input: MixmaxEndpointInputSchemas.yesnoList,
		output: MixmaxEndpointOutputSchemas.yesnoList,
	},
	'yesno.get': {
		input: MixmaxEndpointInputSchemas.yesnoGet,
		output: MixmaxEndpointOutputSchemas.yesnoGet,
	},
	'polls.list': {
		input: MixmaxEndpointInputSchemas.pollsList,
		output: MixmaxEndpointOutputSchemas.pollsList,
	},
	'polls.get': {
		input: MixmaxEndpointInputSchemas.pollsGet,
		output: MixmaxEndpointOutputSchemas.pollsGet,
	},

	'appointmentLinks.list': {
		input: MixmaxEndpointInputSchemas.appointmentLinksList,
		output: MixmaxEndpointOutputSchemas.appointmentLinksList,
	},
	'appointmentLinks.getMe': {
		input: MixmaxEndpointInputSchemas.appointmentLinksGetMe,
		output: MixmaxEndpointOutputSchemas.appointmentLinksGetMe,
	},
	'appointmentLinks.updateMe': {
		input: MixmaxEndpointInputSchemas.appointmentLinksUpdateMe,
		output: MixmaxEndpointOutputSchemas.appointmentLinksUpdateMe,
	},
	'meetingTypes.list': {
		input: MixmaxEndpointInputSchemas.meetingTypesList,
		output: MixmaxEndpointOutputSchemas.meetingTypesList,
	},
	'meetingTypes.create': {
		input: MixmaxEndpointInputSchemas.meetingTypesCreate,
		output: MixmaxEndpointOutputSchemas.meetingTypesCreate,
	},
	'meetingTypes.get': {
		input: MixmaxEndpointInputSchemas.meetingTypesGet,
		output: MixmaxEndpointOutputSchemas.meetingTypesGet,
	},
	'meetingTypes.update': {
		input: MixmaxEndpointInputSchemas.meetingTypesUpdate,
		output: MixmaxEndpointOutputSchemas.meetingTypesUpdate,
	},
	'meetingTypes.delete': {
		input: MixmaxEndpointInputSchemas.meetingTypesDelete,
		output: MixmaxEndpointOutputSchemas.meetingTypesDelete,
	},
	'meetingInvites.list': {
		input: MixmaxEndpointInputSchemas.meetingInvitesList,
		output: MixmaxEndpointOutputSchemas.meetingInvitesList,
	},
	'meetingInvites.get': {
		input: MixmaxEndpointInputSchemas.meetingInvitesGet,
		output: MixmaxEndpointOutputSchemas.meetingInvitesGet,
	},
	'meetings.searchSummaries': {
		input: MixmaxEndpointInputSchemas.meetingsSearchSummaries,
		output: MixmaxEndpointOutputSchemas.meetingsSearchSummaries,
	},
	'meetings.getTranscript': {
		input: MixmaxEndpointInputSchemas.meetingsGetTranscript,
		output: MixmaxEndpointOutputSchemas.meetingsGetTranscript,
	},
	'tasks.list': {
		input: MixmaxEndpointInputSchemas.tasksList,
		output: MixmaxEndpointOutputSchemas.tasksList,
	},
	'fileRequests.list': {
		input: MixmaxEndpointInputSchemas.fileRequestsList,
		output: MixmaxEndpointOutputSchemas.fileRequestsList,
	},
	'fileRequests.get': {
		input: MixmaxEndpointInputSchemas.fileRequestsGet,
		output: MixmaxEndpointOutputSchemas.fileRequestsGet,
	},
	'insightsReports.list': {
		input: MixmaxEndpointInputSchemas.insightsReportsList,
		output: MixmaxEndpointOutputSchemas.insightsReportsList,
	},
	'insightsReports.create': {
		input: MixmaxEndpointInputSchemas.insightsReportsCreate,
		output: MixmaxEndpointOutputSchemas.insightsReportsCreate,
	},
	'insightsReports.update': {
		input: MixmaxEndpointInputSchemas.insightsReportsUpdate,
		output: MixmaxEndpointOutputSchemas.insightsReportsUpdate,
	},
	'insightsReports.delete': {
		input: MixmaxEndpointInputSchemas.insightsReportsDelete,
		output: MixmaxEndpointOutputSchemas.insightsReportsDelete,
	},
	'reports.runDataTable': {
		input: MixmaxEndpointInputSchemas.reportsRunDataTable,
		output: MixmaxEndpointOutputSchemas.reportsRunDataTable,
	},
	'salesforce.listAccounts': {
		input: MixmaxEndpointInputSchemas.salesforceListAccounts,
		output: MixmaxEndpointOutputSchemas.salesforceListAccounts,
	},
	'salesforce.createAccount': {
		input: MixmaxEndpointInputSchemas.salesforceCreateAccount,
		output: MixmaxEndpointOutputSchemas.salesforceCreateAccount,
	},
	'salesforce.getAccountImplicit': {
		input: MixmaxEndpointInputSchemas.salesforceGetAccountImplicit,
		output: MixmaxEndpointOutputSchemas.salesforceGetAccountImplicit,
	},
	'salesforce.getAccount': {
		input: MixmaxEndpointInputSchemas.salesforceGetAccount,
		output: MixmaxEndpointOutputSchemas.salesforceGetAccount,
	},
	'salesforce.updateAccount': {
		input: MixmaxEndpointInputSchemas.salesforceUpdateAccount,
		output: MixmaxEndpointOutputSchemas.salesforceUpdateAccount,
	},
	'salesforce.createContact': {
		input: MixmaxEndpointInputSchemas.salesforceCreateContact,
		output: MixmaxEndpointOutputSchemas.salesforceCreateContact,
	},
	'salesforce.getContact': {
		input: MixmaxEndpointInputSchemas.salesforceGetContact,
		output: MixmaxEndpointOutputSchemas.salesforceGetContact,
	},
	'salesforce.updateContact': {
		input: MixmaxEndpointInputSchemas.salesforceUpdateContact,
		output: MixmaxEndpointOutputSchemas.salesforceUpdateContact,
	},
	'salesforce.listContactTasks': {
		input: MixmaxEndpointInputSchemas.salesforceListContactTasks,
		output: MixmaxEndpointOutputSchemas.salesforceListContactTasks,
	},
	'salesforce.getContactOrLead': {
		input: MixmaxEndpointInputSchemas.salesforceGetContactOrLead,
		output: MixmaxEndpointOutputSchemas.salesforceGetContactOrLead,
	},
	'salesforce.createLead': {
		input: MixmaxEndpointInputSchemas.salesforceCreateLead,
		output: MixmaxEndpointOutputSchemas.salesforceCreateLead,
	},
	'salesforce.getLead': {
		input: MixmaxEndpointInputSchemas.salesforceGetLead,
		output: MixmaxEndpointOutputSchemas.salesforceGetLead,
	},
	'salesforce.updateLead': {
		input: MixmaxEndpointInputSchemas.salesforceUpdateLead,
		output: MixmaxEndpointOutputSchemas.salesforceUpdateLead,
	},
	'salesforce.listLeadTasks': {
		input: MixmaxEndpointInputSchemas.salesforceListLeadTasks,
		output: MixmaxEndpointOutputSchemas.salesforceListLeadTasks,
	},
	'salesforce.createOpportunity': {
		input: MixmaxEndpointInputSchemas.salesforceCreateOpportunity,
		output: MixmaxEndpointOutputSchemas.salesforceCreateOpportunity,
	},
	'salesforce.getOpportunity': {
		input: MixmaxEndpointInputSchemas.salesforceGetOpportunity,
		output: MixmaxEndpointOutputSchemas.salesforceGetOpportunity,
	},
	'salesforce.updateOpportunity': {
		input: MixmaxEndpointInputSchemas.salesforceUpdateOpportunity,
		output: MixmaxEndpointOutputSchemas.salesforceUpdateOpportunity,
	},
	'salesforce.deleteOpportunity': {
		input: MixmaxEndpointInputSchemas.salesforceDeleteOpportunity,
		output: MixmaxEndpointOutputSchemas.salesforceDeleteOpportunity,
	},
	'salesforce.search': {
		input: MixmaxEndpointInputSchemas.salesforceSearch,
		output: MixmaxEndpointOutputSchemas.salesforceSearch,
	},
	'salesforce.syncedFields': {
		input: MixmaxEndpointInputSchemas.salesforceSyncedFields,
		output: MixmaxEndpointOutputSchemas.salesforceSyncedFields,
	},
	'salesforce.createTask': {
		input: MixmaxEndpointInputSchemas.salesforceCreateTask,
		output: MixmaxEndpointOutputSchemas.salesforceCreateTask,
	},
	'salesforce.getTask': {
		input: MixmaxEndpointInputSchemas.salesforceGetTask,
		output: MixmaxEndpointOutputSchemas.salesforceGetTask,
	},
	'salesforce.updateTask': {
		input: MixmaxEndpointInputSchemas.salesforceUpdateTask,
		output: MixmaxEndpointOutputSchemas.salesforceUpdateTask,
	},
	'salesforce.deleteTask': {
		input: MixmaxEndpointInputSchemas.salesforceDeleteTask,
		output: MixmaxEndpointOutputSchemas.salesforceDeleteTask,
	},
	'salesforce.getWhat': {
		input: MixmaxEndpointInputSchemas.salesforceGetWhat,
		output: MixmaxEndpointOutputSchemas.salesforceGetWhat,
	},
	'salesforce.getWho': {
		input: MixmaxEndpointInputSchemas.salesforceGetWho,
		output: MixmaxEndpointOutputSchemas.salesforceGetWho,
	},
	'teams.list': {
		input: MixmaxEndpointInputSchemas.teamsList,
		output: MixmaxEndpointOutputSchemas.teamsList,
	},
	'teams.create': {
		input: MixmaxEndpointInputSchemas.teamsCreate,
		output: MixmaxEndpointOutputSchemas.teamsCreate,
	},
	'teams.get': {
		input: MixmaxEndpointInputSchemas.teamsGet,
		output: MixmaxEndpointOutputSchemas.teamsGet,
	},
	'teams.update': {
		input: MixmaxEndpointInputSchemas.teamsUpdate,
		output: MixmaxEndpointOutputSchemas.teamsUpdate,
	},
	'teams.delete': {
		input: MixmaxEndpointInputSchemas.teamsDelete,
		output: MixmaxEndpointOutputSchemas.teamsDelete,
	},
	'teams.members.list': {
		input: MixmaxEndpointInputSchemas.teamsMembersList,
		output: MixmaxEndpointOutputSchemas.teamsMembersList,
	},
	'teams.members.add': {
		input: MixmaxEndpointInputSchemas.teamsMembersAdd,
		output: MixmaxEndpointOutputSchemas.teamsMembersAdd,
	},
	'teams.members.remove': {
		input: MixmaxEndpointInputSchemas.teamsMembersRemove,
		output: MixmaxEndpointOutputSchemas.teamsMembersRemove,
	},
	'teams.members.update': {
		input: MixmaxEndpointInputSchemas.teamsMembersUpdate,
		output: MixmaxEndpointOutputSchemas.teamsMembersUpdate,
	},
	'integrations.commands.list': {
		input: MixmaxEndpointInputSchemas.integrationsCommandsList,
		output: MixmaxEndpointOutputSchemas.integrationsCommandsList,
	},
	'integrations.commands.create': {
		input: MixmaxEndpointInputSchemas.integrationsCommandsCreate,
		output: MixmaxEndpointOutputSchemas.integrationsCommandsCreate,
	},
	'integrations.commands.delete': {
		input: MixmaxEndpointInputSchemas.integrationsCommandsDelete,
		output: MixmaxEndpointOutputSchemas.integrationsCommandsDelete,
	},
	'integrations.enhancements.list': {
		input: MixmaxEndpointInputSchemas.integrationsEnhancementsList,
		output: MixmaxEndpointOutputSchemas.integrationsEnhancementsList,
	},
	'integrations.enhancements.create': {
		input: MixmaxEndpointInputSchemas.integrationsEnhancementsCreate,
		output: MixmaxEndpointOutputSchemas.integrationsEnhancementsCreate,
	},
	'integrations.enhancements.delete': {
		input: MixmaxEndpointInputSchemas.integrationsEnhancementsDelete,
		output: MixmaxEndpointOutputSchemas.integrationsEnhancementsDelete,
	},
	'integrations.linkResolvers.list': {
		input: MixmaxEndpointInputSchemas.integrationsLinkResolversList,
		output: MixmaxEndpointOutputSchemas.integrationsLinkResolversList,
	},
	'integrations.linkResolvers.create': {
		input: MixmaxEndpointInputSchemas.integrationsLinkResolversCreate,
		output: MixmaxEndpointOutputSchemas.integrationsLinkResolversCreate,
	},
	'integrations.linkResolvers.delete': {
		input: MixmaxEndpointInputSchemas.integrationsLinkResolversDelete,
		output: MixmaxEndpointOutputSchemas.integrationsLinkResolversDelete,
	},
	'integrations.sidebars.list': {
		input: MixmaxEndpointInputSchemas.integrationsSidebarsList,
		output: MixmaxEndpointOutputSchemas.integrationsSidebarsList,
	},
	'integrations.sidebars.create': {
		input: MixmaxEndpointInputSchemas.integrationsSidebarsCreate,
		output: MixmaxEndpointOutputSchemas.integrationsSidebarsCreate,
	},
	'integrations.sidebars.delete': {
		input: MixmaxEndpointInputSchemas.integrationsSidebarsDelete,
		output: MixmaxEndpointOutputSchemas.integrationsSidebarsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mixmaxEndpointsNested
>;

export const mixmaxEndpointMeta = {
	'users.getMe': {
		riskLevel: 'read',
		description: 'Get the current Mixmax user.',
	},
	'users.preferences.get': {
		riskLevel: 'read',
		description: 'Get the calling user’s Mixmax preferences.',
	},
	'users.preferences.update': {
		riskLevel: 'write',
		description: 'Update the calling user’s Mixmax preferences.',
	},
	'users.preferences.autoBccExcludedEmails.list': {
		riskLevel: 'read',
		description:
			'Check whether one email address is excluded from the user’s Mixmax auto BCC list.',
	},
	'users.preferences.autoBccExcludedEmails.add': {
		riskLevel: 'write',
		description:
			'Add email addresses to the user’s Mixmax auto BCC exclusion list.',
	},
	'users.preferences.autoBccExcludedEmails.exists': {
		riskLevel: 'read',
		description:
			'Check exactly which email addresses are excluded from the user’s Mixmax auto BCC list, including role exclusions.',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'List Mixmax messages (drafts, scheduled, sent, or failed), newest first.',
	},
	'messages.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax draft message without sending it.',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax message by id.',
	},
	'messages.update': {
		riskLevel: 'write',
		description:
			'Update the fields of a sent Mixmax message; each included field replaces the stored value.',
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send a saved Mixmax draft: this emails its recipients. Delivery is asynchronous and cannot be undone.',
	},
	'messages.schedule': {
		riskLevel: 'write',
		description:
			'Schedule a saved Mixmax draft: Mixmax emails its recipients at the given Unix-millisecond timestamp unless the send is unscheduled first.',
	},
	'messages.unschedule': {
		riskLevel: 'write',
		description:
			'Cancel a scheduled Mixmax send and return the message to draft.',
	},
	'messages.test': {
		riskLevel: 'write',
		description: 'Send a Mixmax test email to the calling user’s own account.',
	},
	'messages.sendPlain': {
		riskLevel: 'write',
		description:
			'Send a plain email from the user’s mailbox to its recipients immediately, outside Mixmax tracking. It cannot be undone.',
	},
	'snippets.list': {
		riskLevel: 'read',
		description:
			'List the Mixmax templates (snippets) the user can access, including shared ones.',
	},
	'snippets.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax template by id.',
	},
	'snippets.update': {
		riskLevel: 'write',
		description:
			'Update the fields of a Mixmax template; only the fields sent change.',
	},
	'snippets.delete': {
		riskLevel: 'destructive',
		description:
			'Move a Mixmax template to the trash, or archive it, removing it from its folders.',
	},
	'snippets.send': {
		riskLevel: 'write',
		description:
			'Send an email built from a Mixmax template to its recipients, immediately or at a scheduled time.',
	},
	'snippetTags.list': {
		riskLevel: 'read',
		description:
			'List the Mixmax template folders (snippet tags) the user can access.',
	},
	'snippetTags.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax template folder.',
	},
	'snippetTags.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax template folder by id.',
	},
	'snippetTags.update': {
		riskLevel: 'write',
		description: 'Rename a Mixmax template folder.',
	},
	'snippetTags.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a Mixmax template folder and move every template inside it to the trash.',
	},
	'snippetTags.listSnippets': {
		riskLevel: 'read',
		description: 'List the templates contained in one Mixmax template folder.',
	},
	'snippetTags.addSnippets': {
		riskLevel: 'write',
		description: 'Add a template to a Mixmax template folder.',
	},
	'unsubscribes.list': {
		riskLevel: 'read',
		description:
			'List the email addresses unsubscribed from the user’s Mixmax sends.',
	},
	'unsubscribes.create': {
		riskLevel: 'write',
		description:
			'Add one or more email addresses to the Mixmax unsubscribe list.',
	},
	'unsubscribes.remove': {
		riskLevel: 'destructive',
		description: 'Remove one email address from the Mixmax unsubscribe list.',
	},
	'livefeed.list': {
		riskLevel: 'read',
		description:
			'List the user’s Mixmax live feed of tracked email activity, with optional stats.',
	},
	'livefeed.events': {
		riskLevel: 'read',
		description:
			'List individual Mixmax live feed events such as opens, clicks, and replies.',
	},
	'sequences.list': {
		riskLevel: 'read',
		description:
			'List the Mixmax sequences the user can access, including shared ones.',
	},
	'sequences.search': {
		riskLevel: 'read',
		description:
			'Search sequence recipients across every accessible Mixmax sequence with their status and activity.',
	},
	'sequences.cancelAll': {
		riskLevel: 'destructive',
		description:
			'Stop the user’s recipients across every Mixmax sequence at once; cancelled recipients cannot be resumed.',
	},
	'sequences.cancel': {
		riskLevel: 'destructive',
		description:
			'Stop recipients of one Mixmax sequence; cancellation is one-way and deletes their open tasks.',
	},
	'sequences.recipients.list': {
		riskLevel: 'read',
		description:
			'List the recipients of one Mixmax sequence with their per-stage activity.',
	},
	'sequences.recipients.add': {
		riskLevel: 'write',
		description:
			'Add recipients to a Mixmax sequence: this starts emailing them the sequence unless each recipient is kept as a draft with scheduledAt false.',
	},
	'sequenceFolders.list': {
		riskLevel: 'read',
		description: 'List the Mixmax sequence folders the user can access.',
	},
	'sequenceFolders.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax sequence folder.',
	},
	'sequenceFolders.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax sequence folder by id.',
	},
	'sequenceFolders.rename': {
		riskLevel: 'write',
		description: 'Rename a Mixmax sequence folder.',
	},
	'sequenceFolders.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a Mixmax sequence folder; its sequences are kept but left without a folder.',
	},
	'sequenceFolders.addSequences': {
		riskLevel: 'write',
		description: 'Move one or more Mixmax sequences into a sequence folder.',
	},
	'rules.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax rules, optionally with their actions.',
	},
	'rules.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax rule with a trigger and actions.',
	},
	'rules.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax rule by id.',
	},
	'rules.update': {
		riskLevel: 'write',
		description: 'Update the trigger or fields of a Mixmax rule.',
	},
	'rules.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Mixmax rule permanently.',
	},
	'rules.deleteBulk': {
		riskLevel: 'destructive',
		description: 'Delete several Mixmax rules at once by their ids.',
	},
	'rules.actions.list': {
		riskLevel: 'read',
		description: 'List the actions of one Mixmax rule.',
	},
	'rules.actions.create': {
		riskLevel: 'write',
		description: 'Add an action to a Mixmax rule.',
	},
	'rules.actions.update': {
		riskLevel: 'write',
		description: 'Update one action of a Mixmax rule.',
	},
	'rules.actions.delete': {
		riskLevel: 'destructive',
		description: 'Remove one action from a Mixmax rule.',
	},
	'rules.events.list': {
		riskLevel: 'read',
		description:
			'List Mixmax rule events with their status, filterable by rule and outcome.',
	},
	'rules.events.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax rule event by id.',
	},
	'codeSnippets.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax code snippets.',
	},
	'codeSnippets.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax code snippet.',
	},
	'codeSnippets.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax code snippet by id.',
	},
	'qa.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax Q&A forms with their answers.',
	},
	'qa.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax Q&A form by id.',
	},
	'yesno.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax yes/no questions with their answers.',
	},
	'yesno.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax yes/no question by id.',
	},
	'polls.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax polls with their response counts.',
	},
	'polls.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax poll by id.',
	},

	'appointmentLinks.list': {
		riskLevel: 'read',
		description: 'Search the user’s Mixmax appointment links by name.',
	},
	'appointmentLinks.getMe': {
		riskLevel: 'read',
		description: 'Get the user’s default Mixmax appointment link.',
	},
	'appointmentLinks.updateMe': {
		riskLevel: 'write',
		description: 'Rename the user’s default Mixmax appointment link.',
	},
	'meetingTypes.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax meeting templates.',
	},
	'meetingTypes.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax meeting template.',
	},
	'meetingTypes.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax meeting template by id.',
	},
	'meetingTypes.update': {
		riskLevel: 'write',
		description: 'Update a Mixmax meeting template.',
	},
	'meetingTypes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Mixmax meeting template permanently.',
	},
	'meetingInvites.list': {
		riskLevel: 'read',
		description: 'List the Mixmax meeting invites sent to the user.',
	},
	'meetingInvites.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax meeting invite by id.',
	},
	'meetings.searchSummaries': {
		riskLevel: 'read',
		description:
			'Search Mixmax meeting summaries by attendee, title, and date range.',
	},
	'meetings.getTranscript': {
		riskLevel: 'read',
		description: 'Retrieve the transcript of one Mixmax meeting.',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List the user’s open Mixmax tasks.',
	},
	'fileRequests.list': {
		riskLevel: 'read',
		description: 'List the Mixmax file requests the user has access to.',
	},
	'fileRequests.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax file request by id.',
	},
	'insightsReports.list': {
		riskLevel: 'read',
		description: 'List the user’s saved Mixmax insights reports.',
	},
	'insightsReports.create': {
		riskLevel: 'write',
		description: 'Create a saved Mixmax insights report from a query.',
	},
	'insightsReports.update': {
		riskLevel: 'write',
		description: 'Update a saved Mixmax insights report.',
	},
	'insightsReports.delete': {
		riskLevel: 'destructive',
		description: 'Delete a saved Mixmax insights report permanently.',
	},
	'reports.runDataTable': {
		riskLevel: 'read',
		description:
			'Run a Mixmax reporting query and return the aggregated data table buckets.',
	},
	'salesforce.listAccounts': {
		riskLevel: 'read',
		description: 'List the Salesforce accounts synced to the user’s Mixmax.',
	},
	'salesforce.createAccount': {
		riskLevel: 'write',
		description: 'Create a Salesforce account through Mixmax.',
	},
	'salesforce.getAccountImplicit': {
		riskLevel: 'read',
		description: 'Look up the Salesforce account matching an email domain.',
	},
	'salesforce.getAccount': {
		riskLevel: 'read',
		description: 'Retrieve one Salesforce account synced to Mixmax.',
	},
	'salesforce.updateAccount': {
		riskLevel: 'write',
		description: 'Update a Salesforce account through Mixmax.',
	},
	'salesforce.createContact': {
		riskLevel: 'write',
		description: 'Create a Salesforce contact through Mixmax.',
	},
	'salesforce.getContact': {
		riskLevel: 'read',
		description: 'Retrieve one Salesforce contact synced to Mixmax.',
	},
	'salesforce.updateContact': {
		riskLevel: 'write',
		description: 'Update a Salesforce contact through Mixmax.',
	},
	'salesforce.listContactTasks': {
		riskLevel: 'read',
		description: 'List the Salesforce tasks of one contact.',
	},
	'salesforce.getContactOrLead': {
		riskLevel: 'read',
		description:
			'Look up the Salesforce contact or lead matching an email address.',
	},
	'salesforce.createLead': {
		riskLevel: 'write',
		description: 'Create a Salesforce lead through Mixmax.',
	},
	'salesforce.getLead': {
		riskLevel: 'read',
		description: 'Retrieve one Salesforce lead synced to Mixmax.',
	},
	'salesforce.updateLead': {
		riskLevel: 'write',
		description: 'Update a Salesforce lead through Mixmax.',
	},
	'salesforce.listLeadTasks': {
		riskLevel: 'read',
		description: 'List the Salesforce tasks of one lead.',
	},
	'salesforce.createOpportunity': {
		riskLevel: 'write',
		description: 'Create a Salesforce opportunity through Mixmax.',
	},
	'salesforce.getOpportunity': {
		riskLevel: 'read',
		description: 'Retrieve one Salesforce opportunity synced to Mixmax.',
	},
	'salesforce.updateOpportunity': {
		riskLevel: 'write',
		description: 'Update a Salesforce opportunity through Mixmax.',
	},
	'salesforce.deleteOpportunity': {
		riskLevel: 'destructive',
		description: 'Delete a Salesforce opportunity through Mixmax.',
	},
	'salesforce.search': {
		riskLevel: 'read',
		description: 'Search Salesforce records of one object type through Mixmax.',
	},
	'salesforce.syncedFields': {
		riskLevel: 'read',
		description:
			'List the Salesforce fields Mixmax syncs for each object type.',
	},
	'salesforce.createTask': {
		riskLevel: 'write',
		description: 'Create a Salesforce task through Mixmax.',
	},
	'salesforce.getTask': {
		riskLevel: 'read',
		description: 'Retrieve one Salesforce task synced to Mixmax.',
	},
	'salesforce.updateTask': {
		riskLevel: 'write',
		description: 'Update a Salesforce task through Mixmax.',
	},
	'salesforce.deleteTask': {
		riskLevel: 'destructive',
		description: 'Delete a Salesforce task through Mixmax.',
	},
	'salesforce.getWhat': {
		riskLevel: 'read',
		description:
			'Resolve any Salesforce record id to its related “what” object.',
	},
	'salesforce.getWho': {
		riskLevel: 'read',
		description:
			'Resolve any Salesforce record id to its related “who” object.',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax teams.',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax team.',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax team by id.',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Rename a Mixmax team.',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Mixmax team permanently.',
	},
	'teams.members.list': {
		riskLevel: 'read',
		description: 'List the members of one Mixmax team.',
	},
	'teams.members.add': {
		riskLevel: 'write',
		description:
			'Add people to a Mixmax team; Mixmax emails each of them an invite.',
	},
	'teams.members.remove': {
		riskLevel: 'destructive',
		description: 'Remove one member from a Mixmax team.',
	},
	'teams.members.update': {
		riskLevel: 'write',
		description: 'Change a Mixmax team member’s role.',
	},
	'integrations.commands.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax slash command integrations.',
	},
	'integrations.commands.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax slash command integration.',
	},
	'integrations.commands.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Mixmax slash command integration.',
	},
	'integrations.enhancements.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax enhance-menu integrations.',
	},
	'integrations.enhancements.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax enhance-menu integration.',
	},
	'integrations.enhancements.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Mixmax enhance-menu integration.',
	},
	'integrations.linkResolvers.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax link resolver integrations.',
	},
	'integrations.linkResolvers.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax link resolver integration.',
	},
	'integrations.linkResolvers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Mixmax link resolver integration.',
	},
	'integrations.sidebars.list': {
		riskLevel: 'read',
		description: 'List the user’s Mixmax sidebar integrations.',
	},
	'integrations.sidebars.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax sidebar integration.',
	},
	'integrations.sidebars.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Mixmax sidebar integration.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mixmaxEndpointsNested>;

export const mixmaxAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType = 'api_key' as const;

type MixmaxOperation = keyof typeof mixmaxEndpointMeta;

// Records that a write succeeded at Mixmax but its response did not match the
// output schema. The event is `completed` (the write happened) and carries
// only the schema paths and issue codes, never response values.
async function recordOutputMismatch(
	ctx: unknown, // unknown: the Corsair runtime context, passed through from the endpoint call
	operation: string,
	error: z.ZodError,
): Promise<void> {
	try {
		await logEventFromContext(
			ctx as Parameters<typeof logEventFromContext>[0],
			`mixmax.${operation}.outputMismatch`,
			{
				operation,
				outputMismatch: true,
				issues: error.issues.slice(0, 20).map((issue) => ({
					path: issue.path.join('.'),
					code: issue.code,
				})),
			},
			'completed',
		);
	} catch {
		// Logging must never turn a completed write into a failure.
	}
}

// Binds every Mixmax endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata. The runtime context and per-operation shapes are
// intentional opacity: each unknown below carries its own justification.
function withMixmaxSchemas<
	T extends Record<string, unknown>, // unknown: the tree mixes endpoint functions with family objects at any depth
>(tree: T, prefix = ''): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				mixmaxEndpointSchemas[operation as keyof typeof mixmaxEndpointSchemas];
			if (!schema) {
				throw new Error(`Missing Mixmax endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown, // unknown: the Corsair runtime context varies by deployment; passed through untouched
				input: unknown, // unknown: parsed by schema.input.parse before the call
			) => Promise<unknown>; // unknown: each operation returns its own documented shape, parsed by schema.output.parse
			const validated = async (
				ctx: unknown, // unknown: same runtime context as above; only the schema boundary wraps the call
				input: unknown, // unknown: caller-supplied payload, parsed before transport
			) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				const parsedOutput = schema.output.safeParse(result);
				if (parsedOutput.success) return parsedOutput.data;
				// A read that does not match its schema throws: nothing changed
				// at Mixmax, so the caller can safely retry or report it.
				if (
					mixmaxEndpointMeta[operation as MixmaxOperation].riskLevel === 'read'
				) {
					throw parsedOutput.error;
				}
				// A write has already happened by now (the email is sent, the
				// record changed). Throwing would invite a retry that sends or
				// writes twice, so return the response as Mixmax sent it and
				// record the mismatch next to the completed event instead.
				await recordOutputMismatch(ctx, operation, parsedOutput.error);
				return result;
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				// unknown: family group nodes are plain objects at arbitrary
				// depth; the wrapper recurses so every nested leaf gets a
				// contract from the registry.
				withMixmaxSchemas(
					value as Record<string, unknown>, // unknown: a family group object, recursed one level deeper
					operation,
				),
			];
		}
		return [key, value];
	});
	// unknown: the rebuild keeps the caller's tree shape while each leaf is
	// replaced by its schema-validated wrapper; TypeScript cannot express the
	// mixed function/object remap structurally, and the satisfies-checked
	// tree definition plus the endpoint schemas registry keep it honest.
	return Object.fromEntries(validatedEntries) as T; // unknown: same tree shape, leaves wrapped by their contracts
}

const validatedMixmaxEndpointsNested = withMixmaxSchemas(mixmaxEndpointsNested);

export type BaseMixmaxPlugin<T extends MixmaxPluginOptions> = CorsairPlugin<
	'mixmax',
	typeof MixmaxSchema,
	typeof mixmaxEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalMixmaxPlugin = BaseMixmaxPlugin<MixmaxPluginOptions>;

export type ExternalMixmaxPlugin<T extends MixmaxPluginOptions> =
	BaseMixmaxPlugin<T>;

export function mixmax<const T extends MixmaxPluginOptions>(
	incomingOptions: MixmaxPluginOptions & T = {} as MixmaxPluginOptions & T,
): ExternalMixmaxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'mixmax',
		authConfig: mixmaxAuthConfig,
		schema: MixmaxSchema,
		options: options,
		hooks: options.hooks,
		endpoints: validatedMixmaxEndpointsNested,
		webhooks: {},
		endpointMeta: mixmaxEndpointMeta,
		endpointSchemas: mixmaxEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MixmaxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('mixmax', 'api_key');
		},
	} satisfies InternalMixmaxPlugin;
}

export type {
	MixmaxEndpointInputs,
	MixmaxEndpointOutputs,
} from './endpoints/types';
