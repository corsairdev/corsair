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
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	ActionPlans,
	ActionPlansPeople,
	AppointmentOutcomes,
	Appointments,
	AppointmentTypes,
	Automations,
	AutomationsPeople,
	Calls,
	CustomFields,
	DealAttachments,
	DealCustomFields,
	Deals,
	EmCampaigns,
	EmEvents,
	Events,
	Groups,
	InboxApps,
	Notes,
	People,
	PeopleRelationships,
	PersonAttachments,
	Pipelines,
	Ponds,
	RateLimit,
	Reactions,
	SmartLists,
	Stages,
	Tasks,
	TeamInboxes,
	Teams,
	Templates,
	TextMessages,
	TextMessageTemplates,
	ThreadedReplies,
	Timeframes,
	Users,
	WebhookEvents,
	Webhooks,
} from './endpoints';
import type {
	FollowUpBossEndpointInputs,
	FollowUpBossEndpointOutputs,
} from './endpoints/registry';
import {
	FollowUpBossEndpointInputSchemas,
	FollowUpBossEndpointOutputSchemas,
} from './endpoints/registry';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { FollowUpBossSchema } from './schema';

export type FollowUpBossPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** System name sent as the X-System identification header; defaults to 'corsair'. */
	systemName?: string;
	/**
	 * System key sent as X-System-Key, issued when the integration registers at
	 * apps.followupboss.com/system-registration. Registered systems get higher
	 * rate limits; the header is omitted when this is unset.
	 */
	systemKey?: string;
	hooks?: InternalFollowUpBossPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof followUpBossEndpointsNested>;
};

export type FollowUpBossContext = CorsairPluginContext<
	typeof FollowUpBossSchema,
	FollowUpBossPluginOptions
>;

export type FollowUpBossKeyBuilderContext =
	KeyBuilderContext<FollowUpBossPluginOptions>;

export type FollowUpBossBoundEndpoints = BindEndpoints<
	typeof followUpBossEndpointsNested
>;

type FollowUpBossEndpoint<K extends keyof FollowUpBossEndpointOutputs> =
	CorsairEndpoint<
		FollowUpBossContext,
		FollowUpBossEndpointInputs[K],
		FollowUpBossEndpointOutputs[K]
	>;

export type FollowUpBossEndpoints = {
	peopleList: FollowUpBossEndpoint<'peopleList'>;
	peopleGet: FollowUpBossEndpoint<'peopleGet'>;
	peopleCreate: FollowUpBossEndpoint<'peopleCreate'>;
	peopleUpdate: FollowUpBossEndpoint<'peopleUpdate'>;
	peopleDelete: FollowUpBossEndpoint<'peopleDelete'>;
	peopleCheckDuplicate: FollowUpBossEndpoint<'peopleCheckDuplicate'>;
	peopleUnclaimed: FollowUpBossEndpoint<'peopleUnclaimed'>;
	peopleClaim: FollowUpBossEndpoint<'peopleClaim'>;
	peopleIgnoreUnclaimed: FollowUpBossEndpoint<'peopleIgnoreUnclaimed'>;
	personAttachmentCreate: FollowUpBossEndpoint<'personAttachmentCreate'>;
	personAttachmentGet: FollowUpBossEndpoint<'personAttachmentGet'>;
	personAttachmentUpdate: FollowUpBossEndpoint<'personAttachmentUpdate'>;
	personAttachmentDelete: FollowUpBossEndpoint<'personAttachmentDelete'>;
	peopleRelationshipsList: FollowUpBossEndpoint<'peopleRelationshipsList'>;
	peopleRelationshipsCreate: FollowUpBossEndpoint<'peopleRelationshipsCreate'>;
	peopleRelationshipsGet: FollowUpBossEndpoint<'peopleRelationshipsGet'>;
	peopleRelationshipsUpdate: FollowUpBossEndpoint<'peopleRelationshipsUpdate'>;
	peopleRelationshipsDelete: FollowUpBossEndpoint<'peopleRelationshipsDelete'>;
	callsList: FollowUpBossEndpoint<'callsList'>;
	callsCreate: FollowUpBossEndpoint<'callsCreate'>;
	callsGet: FollowUpBossEndpoint<'callsGet'>;
	callsUpdate: FollowUpBossEndpoint<'callsUpdate'>;
	textMessagesList: FollowUpBossEndpoint<'textMessagesList'>;
	textMessagesCreate: FollowUpBossEndpoint<'textMessagesCreate'>;
	textMessagesGet: FollowUpBossEndpoint<'textMessagesGet'>;
	notesCreate: FollowUpBossEndpoint<'notesCreate'>;
	notesGet: FollowUpBossEndpoint<'notesGet'>;
	notesUpdate: FollowUpBossEndpoint<'notesUpdate'>;
	notesDelete: FollowUpBossEndpoint<'notesDelete'>;
	eventsList: FollowUpBossEndpoint<'eventsList'>;
	eventsGet: FollowUpBossEndpoint<'eventsGet'>;
	eventsCreate: FollowUpBossEndpoint<'eventsCreate'>;
	tasksList: FollowUpBossEndpoint<'tasksList'>;
	tasksCreate: FollowUpBossEndpoint<'tasksCreate'>;
	tasksGet: FollowUpBossEndpoint<'tasksGet'>;
	tasksUpdate: FollowUpBossEndpoint<'tasksUpdate'>;
	tasksDelete: FollowUpBossEndpoint<'tasksDelete'>;
	appointmentsList: FollowUpBossEndpoint<'appointmentsList'>;
	appointmentsCreate: FollowUpBossEndpoint<'appointmentsCreate'>;
	appointmentsGet: FollowUpBossEndpoint<'appointmentsGet'>;
	appointmentsUpdate: FollowUpBossEndpoint<'appointmentsUpdate'>;
	appointmentsDelete: FollowUpBossEndpoint<'appointmentsDelete'>;
	appointmentTypesList: FollowUpBossEndpoint<'appointmentTypesList'>;
	appointmentTypesCreate: FollowUpBossEndpoint<'appointmentTypesCreate'>;
	appointmentTypesGet: FollowUpBossEndpoint<'appointmentTypesGet'>;
	appointmentTypesUpdate: FollowUpBossEndpoint<'appointmentTypesUpdate'>;
	appointmentTypesDelete: FollowUpBossEndpoint<'appointmentTypesDelete'>;
	timeframesList: FollowUpBossEndpoint<'timeframesList'>;
	smartListsList: FollowUpBossEndpoint<'smartListsList'>;
	smartListsGet: FollowUpBossEndpoint<'smartListsGet'>;
	meGet: FollowUpBossEndpoint<'meGet'>;
	identityGet: FollowUpBossEndpoint<'identityGet'>;
	dealsList: FollowUpBossEndpoint<'dealsList'>;
	dealsGet: FollowUpBossEndpoint<'dealsGet'>;
	dealsCreate: FollowUpBossEndpoint<'dealsCreate'>;
	dealsUpdate: FollowUpBossEndpoint<'dealsUpdate'>;
	dealsDelete: FollowUpBossEndpoint<'dealsDelete'>;
	pipelinesList: FollowUpBossEndpoint<'pipelinesList'>;
	pipelinesGet: FollowUpBossEndpoint<'pipelinesGet'>;
	pipelinesCreate: FollowUpBossEndpoint<'pipelinesCreate'>;
	pipelinesUpdate: FollowUpBossEndpoint<'pipelinesUpdate'>;
	pipelinesDelete: FollowUpBossEndpoint<'pipelinesDelete'>;
	stagesList: FollowUpBossEndpoint<'stagesList'>;
	stagesGet: FollowUpBossEndpoint<'stagesGet'>;
	stagesCreate: FollowUpBossEndpoint<'stagesCreate'>;
	stagesUpdate: FollowUpBossEndpoint<'stagesUpdate'>;
	stagesDelete: FollowUpBossEndpoint<'stagesDelete'>;
	dealCustomFieldsList: FollowUpBossEndpoint<'dealCustomFieldsList'>;
	dealCustomFieldsGet: FollowUpBossEndpoint<'dealCustomFieldsGet'>;
	dealCustomFieldsCreate: FollowUpBossEndpoint<'dealCustomFieldsCreate'>;
	dealCustomFieldsUpdate: FollowUpBossEndpoint<'dealCustomFieldsUpdate'>;
	dealCustomFieldsDelete: FollowUpBossEndpoint<'dealCustomFieldsDelete'>;
	dealAttachmentsCreate: FollowUpBossEndpoint<'dealAttachmentsCreate'>;
	dealAttachmentsGet: FollowUpBossEndpoint<'dealAttachmentsGet'>;
	dealAttachmentsUpdate: FollowUpBossEndpoint<'dealAttachmentsUpdate'>;
	dealAttachmentsDelete: FollowUpBossEndpoint<'dealAttachmentsDelete'>;
	appointmentOutcomesList: FollowUpBossEndpoint<'appointmentOutcomesList'>;
	appointmentOutcomesGet: FollowUpBossEndpoint<'appointmentOutcomesGet'>;
	appointmentOutcomesCreate: FollowUpBossEndpoint<'appointmentOutcomesCreate'>;
	appointmentOutcomesUpdate: FollowUpBossEndpoint<'appointmentOutcomesUpdate'>;
	appointmentOutcomesDelete: FollowUpBossEndpoint<'appointmentOutcomesDelete'>;
	customFieldsList: FollowUpBossEndpoint<'customFieldsList'>;
	customFieldsGet: FollowUpBossEndpoint<'customFieldsGet'>;
	customFieldsCreate: FollowUpBossEndpoint<'customFieldsCreate'>;
	customFieldsUpdate: FollowUpBossEndpoint<'customFieldsUpdate'>;
	customFieldsDelete: FollowUpBossEndpoint<'customFieldsDelete'>;
	templatesList: FollowUpBossEndpoint<'templatesList'>;
	templatesGet: FollowUpBossEndpoint<'templatesGet'>;
	templatesCreate: FollowUpBossEndpoint<'templatesCreate'>;
	templatesUpdate: FollowUpBossEndpoint<'templatesUpdate'>;
	templatesDelete: FollowUpBossEndpoint<'templatesDelete'>;
	templatesMerge: FollowUpBossEndpoint<'templatesMerge'>;
	textMessageTemplatesList: FollowUpBossEndpoint<'textMessageTemplatesList'>;
	textMessageTemplatesGet: FollowUpBossEndpoint<'textMessageTemplatesGet'>;
	textMessageTemplatesCreate: FollowUpBossEndpoint<'textMessageTemplatesCreate'>;
	textMessageTemplatesUpdate: FollowUpBossEndpoint<'textMessageTemplatesUpdate'>;
	textMessageTemplatesDelete: FollowUpBossEndpoint<'textMessageTemplatesDelete'>;
	textMessageTemplatesMerge: FollowUpBossEndpoint<'textMessageTemplatesMerge'>;
	emCampaignsList: FollowUpBossEndpoint<'emCampaignsList'>;
	emCampaignsCreate: FollowUpBossEndpoint<'emCampaignsCreate'>;
	emCampaignsUpdate: FollowUpBossEndpoint<'emCampaignsUpdate'>;
	emEventsList: FollowUpBossEndpoint<'emEventsList'>;
	emEventsCreate: FollowUpBossEndpoint<'emEventsCreate'>;
	usersList: FollowUpBossEndpoint<'usersList'>;
	usersGet: FollowUpBossEndpoint<'usersGet'>;
	usersDelete: FollowUpBossEndpoint<'usersDelete'>;
	teamsList: FollowUpBossEndpoint<'teamsList'>;
	teamsCreate: FollowUpBossEndpoint<'teamsCreate'>;
	teamsGet: FollowUpBossEndpoint<'teamsGet'>;
	teamsUpdate: FollowUpBossEndpoint<'teamsUpdate'>;
	teamsDelete: FollowUpBossEndpoint<'teamsDelete'>;
	groupsList: FollowUpBossEndpoint<'groupsList'>;
	groupsCreate: FollowUpBossEndpoint<'groupsCreate'>;
	groupsGet: FollowUpBossEndpoint<'groupsGet'>;
	groupsUpdate: FollowUpBossEndpoint<'groupsUpdate'>;
	groupsDelete: FollowUpBossEndpoint<'groupsDelete'>;
	groupsRoundRobin: FollowUpBossEndpoint<'groupsRoundRobin'>;
	pondsList: FollowUpBossEndpoint<'pondsList'>;
	pondsCreate: FollowUpBossEndpoint<'pondsCreate'>;
	pondsGet: FollowUpBossEndpoint<'pondsGet'>;
	pondsUpdate: FollowUpBossEndpoint<'pondsUpdate'>;
	pondsDelete: FollowUpBossEndpoint<'pondsDelete'>;
	rateLimitLimits: FollowUpBossEndpoint<'rateLimitLimits'>;
	rateLimitUsage: FollowUpBossEndpoint<'rateLimitUsage'>;
	automationsList: FollowUpBossEndpoint<'automationsList'>;
	automationsGet: FollowUpBossEndpoint<'automationsGet'>;
	automationsPeopleList: FollowUpBossEndpoint<'automationsPeopleList'>;
	automationsPeopleGet: FollowUpBossEndpoint<'automationsPeopleGet'>;
	automationsPeopleCreate: FollowUpBossEndpoint<'automationsPeopleCreate'>;
	automationsPeopleUpdate: FollowUpBossEndpoint<'automationsPeopleUpdate'>;
	actionPlansList: FollowUpBossEndpoint<'actionPlansList'>;
	actionPlansPeopleList: FollowUpBossEndpoint<'actionPlansPeopleList'>;
	actionPlansPeopleCreate: FollowUpBossEndpoint<'actionPlansPeopleCreate'>;
	actionPlansPeopleUpdate: FollowUpBossEndpoint<'actionPlansPeopleUpdate'>;
	webhooksList: FollowUpBossEndpoint<'webhooksList'>;
	webhooksCreate: FollowUpBossEndpoint<'webhooksCreate'>;
	webhooksGet: FollowUpBossEndpoint<'webhooksGet'>;
	webhooksUpdate: FollowUpBossEndpoint<'webhooksUpdate'>;
	webhooksDelete: FollowUpBossEndpoint<'webhooksDelete'>;
	webhookEventsGet: FollowUpBossEndpoint<'webhookEventsGet'>;
	inboxAppsDeactivate: FollowUpBossEndpoint<'inboxAppsDeactivate'>;
	inboxAppsDeleteParticipant: FollowUpBossEndpoint<'inboxAppsDeleteParticipant'>;
	inboxAppsGetParticipants: FollowUpBossEndpoint<'inboxAppsGetParticipants'>;
	inboxAppsCreateParticipant: FollowUpBossEndpoint<'inboxAppsCreateParticipant'>;
	inboxAppsAddMessage: FollowUpBossEndpoint<'inboxAppsAddMessage'>;
	inboxAppsAddNote: FollowUpBossEndpoint<'inboxAppsAddNote'>;
	inboxAppsAddSystemConfirmationMessage: FollowUpBossEndpoint<'inboxAppsAddSystemConfirmationMessage'>;
	inboxAppsInstall: FollowUpBossEndpoint<'inboxAppsInstall'>;
	inboxAppsUpdateConversation: FollowUpBossEndpoint<'inboxAppsUpdateConversation'>;
	inboxAppsUpdateMessage: FollowUpBossEndpoint<'inboxAppsUpdateMessage'>;
	inboxAppsInstalledApp: FollowUpBossEndpoint<'inboxAppsInstalledApp'>;
	teamInboxesList: FollowUpBossEndpoint<'teamInboxesList'>;
	reactionsCreate: FollowUpBossEndpoint<'reactionsCreate'>;
	reactionsGet: FollowUpBossEndpoint<'reactionsGet'>;
	reactionsDelete: FollowUpBossEndpoint<'reactionsDelete'>;
	threadedRepliesGet: FollowUpBossEndpoint<'threadedRepliesGet'>;
};

const followUpBossEndpointsNested = {
	people: {
		list: People.list,
		get: People.get,
		create: People.create,
		update: People.update,
		delete: People.delete,
		checkDuplicate: People.checkDuplicate,
		unclaimed: People.unclaimed,
		claim: People.claim,
		ignoreUnclaimed: People.ignoreUnclaimed,
	},
	personAttachments: {
		create: PersonAttachments.create,
		get: PersonAttachments.get,
		update: PersonAttachments.update,
		delete: PersonAttachments.delete,
	},
	peopleRelationships: {
		list: PeopleRelationships.list,
		create: PeopleRelationships.create,
		get: PeopleRelationships.get,
		update: PeopleRelationships.update,
		delete: PeopleRelationships.delete,
	},
	calls: {
		list: Calls.list,
		create: Calls.create,
		get: Calls.get,
		update: Calls.update,
	},
	textMessages: {
		list: TextMessages.list,
		create: TextMessages.create,
		get: TextMessages.get,
	},
	notes: {
		create: Notes.create,
		get: Notes.get,
		update: Notes.update,
		delete: Notes.delete,
	},
	events: {
		list: Events.list,
		get: Events.get,
		create: Events.create,
	},
	tasks: {
		list: Tasks.list,
		create: Tasks.create,
		get: Tasks.get,
		update: Tasks.update,
		delete: Tasks.delete,
	},
	appointments: {
		list: Appointments.list,
		create: Appointments.create,
		get: Appointments.get,
		update: Appointments.update,
		delete: Appointments.delete,
	},
	appointmentTypes: {
		list: AppointmentTypes.list,
		create: AppointmentTypes.create,
		get: AppointmentTypes.get,
		update: AppointmentTypes.update,
		delete: AppointmentTypes.delete,
	},
	timeframes: {
		list: Timeframes.list,
	},
	smartLists: {
		list: SmartLists.list,
		get: SmartLists.get,
	},
	account: {
		me: Account.me,
		identity: Account.identity,
	},
	deals: {
		list: Deals.list,
		get: Deals.get,
		create: Deals.create,
		update: Deals.update,
		delete: Deals.delete,
	},
	pipelines: {
		list: Pipelines.list,
		get: Pipelines.get,
		create: Pipelines.create,
		update: Pipelines.update,
		delete: Pipelines.delete,
	},
	stages: {
		list: Stages.list,
		get: Stages.get,
		create: Stages.create,
		update: Stages.update,
		delete: Stages.delete,
	},
	dealCustomFields: {
		list: DealCustomFields.list,
		get: DealCustomFields.get,
		create: DealCustomFields.create,
		update: DealCustomFields.update,
		delete: DealCustomFields.delete,
	},
	dealAttachments: {
		create: DealAttachments.create,
		get: DealAttachments.get,
		update: DealAttachments.update,
		delete: DealAttachments.delete,
	},
	appointmentOutcomes: {
		list: AppointmentOutcomes.list,
		get: AppointmentOutcomes.get,
		create: AppointmentOutcomes.create,
		update: AppointmentOutcomes.update,
		delete: AppointmentOutcomes.delete,
	},
	customFields: {
		list: CustomFields.list,
		get: CustomFields.get,
		create: CustomFields.create,
		update: CustomFields.update,
		delete: CustomFields.delete,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		update: Templates.update,
		delete: Templates.delete,
		merge: Templates.merge,
	},
	textMessageTemplates: {
		list: TextMessageTemplates.list,
		get: TextMessageTemplates.get,
		create: TextMessageTemplates.create,
		update: TextMessageTemplates.update,
		delete: TextMessageTemplates.delete,
		merge: TextMessageTemplates.merge,
	},
	emCampaigns: {
		list: EmCampaigns.list,
		create: EmCampaigns.create,
		update: EmCampaigns.update,
	},
	emEvents: {
		list: EmEvents.list,
		create: EmEvents.create,
	},
	users: {
		list: Users.list,
		get: Users.get,
		delete: Users.delete,
	},
	teams: {
		list: Teams.list,
		create: Teams.create,
		get: Teams.get,
		update: Teams.update,
		delete: Teams.delete,
	},
	groups: {
		list: Groups.list,
		create: Groups.create,
		get: Groups.get,
		update: Groups.update,
		delete: Groups.delete,
		roundRobin: Groups.roundRobin,
	},
	ponds: {
		list: Ponds.list,
		create: Ponds.create,
		get: Ponds.get,
		update: Ponds.update,
		delete: Ponds.delete,
	},
	rateLimit: {
		limits: RateLimit.limits,
		usage: RateLimit.usage,
	},
	automations: {
		list: Automations.list,
		get: Automations.get,
	},
	automationsPeople: {
		list: AutomationsPeople.list,
		get: AutomationsPeople.get,
		create: AutomationsPeople.create,
		update: AutomationsPeople.update,
	},
	actionPlans: {
		list: ActionPlans.list,
	},
	actionPlansPeople: {
		list: ActionPlansPeople.list,
		create: ActionPlansPeople.create,
		update: ActionPlansPeople.update,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		get: Webhooks.get,
		update: Webhooks.update,
		delete: Webhooks.delete,
	},
	webhookEvents: {
		get: WebhookEvents.get,
	},
	inboxApps: {
		deactivate: InboxApps.deactivate,
		deleteParticipant: InboxApps.deleteParticipant,
		getParticipants: InboxApps.getParticipants,
		createParticipant: InboxApps.createParticipant,
		addMessage: InboxApps.addMessage,
		addNote: InboxApps.addNote,
		addSystemConfirmationMessage: InboxApps.addSystemConfirmationMessage,
		install: InboxApps.install,
		updateConversation: InboxApps.updateConversation,
		updateMessage: InboxApps.updateMessage,
		installedApp: InboxApps.installedApp,
	},
	teamInboxes: {
		list: TeamInboxes.list,
	},
	reactions: {
		create: Reactions.create,
		get: Reactions.get,
		delete: Reactions.delete,
	},
	threadedReplies: {
		get: ThreadedReplies.get,
	},
} as const;

export const followUpBossEndpointSchemas = {
	'people.list': {
		input: FollowUpBossEndpointInputSchemas.peopleList,
		output: FollowUpBossEndpointOutputSchemas.peopleList,
	},
	'people.get': {
		input: FollowUpBossEndpointInputSchemas.peopleGet,
		output: FollowUpBossEndpointOutputSchemas.peopleGet,
	},
	'people.create': {
		input: FollowUpBossEndpointInputSchemas.peopleCreate,
		output: FollowUpBossEndpointOutputSchemas.peopleCreate,
	},
	'people.update': {
		input: FollowUpBossEndpointInputSchemas.peopleUpdate,
		output: FollowUpBossEndpointOutputSchemas.peopleUpdate,
	},
	'people.delete': {
		input: FollowUpBossEndpointInputSchemas.peopleDelete,
		output: FollowUpBossEndpointOutputSchemas.peopleDelete,
	},
	'people.checkDuplicate': {
		input: FollowUpBossEndpointInputSchemas.peopleCheckDuplicate,
		output: FollowUpBossEndpointOutputSchemas.peopleCheckDuplicate,
	},
	'people.unclaimed': {
		input: FollowUpBossEndpointInputSchemas.peopleUnclaimed,
		output: FollowUpBossEndpointOutputSchemas.peopleUnclaimed,
	},
	'people.claim': {
		input: FollowUpBossEndpointInputSchemas.peopleClaim,
		output: FollowUpBossEndpointOutputSchemas.peopleClaim,
	},
	'people.ignoreUnclaimed': {
		input: FollowUpBossEndpointInputSchemas.peopleIgnoreUnclaimed,
		output: FollowUpBossEndpointOutputSchemas.peopleIgnoreUnclaimed,
	},
	'personAttachments.create': {
		input: FollowUpBossEndpointInputSchemas.personAttachmentCreate,
		output: FollowUpBossEndpointOutputSchemas.personAttachmentCreate,
	},
	'personAttachments.get': {
		input: FollowUpBossEndpointInputSchemas.personAttachmentGet,
		output: FollowUpBossEndpointOutputSchemas.personAttachmentGet,
	},
	'personAttachments.update': {
		input: FollowUpBossEndpointInputSchemas.personAttachmentUpdate,
		output: FollowUpBossEndpointOutputSchemas.personAttachmentUpdate,
	},
	'personAttachments.delete': {
		input: FollowUpBossEndpointInputSchemas.personAttachmentDelete,
		output: FollowUpBossEndpointOutputSchemas.personAttachmentDelete,
	},
	'peopleRelationships.list': {
		input: FollowUpBossEndpointInputSchemas.peopleRelationshipsList,
		output: FollowUpBossEndpointOutputSchemas.peopleRelationshipsList,
	},
	'peopleRelationships.create': {
		input: FollowUpBossEndpointInputSchemas.peopleRelationshipsCreate,
		output: FollowUpBossEndpointOutputSchemas.peopleRelationshipsCreate,
	},
	'peopleRelationships.get': {
		input: FollowUpBossEndpointInputSchemas.peopleRelationshipsGet,
		output: FollowUpBossEndpointOutputSchemas.peopleRelationshipsGet,
	},
	'peopleRelationships.update': {
		input: FollowUpBossEndpointInputSchemas.peopleRelationshipsUpdate,
		output: FollowUpBossEndpointOutputSchemas.peopleRelationshipsUpdate,
	},
	'peopleRelationships.delete': {
		input: FollowUpBossEndpointInputSchemas.peopleRelationshipsDelete,
		output: FollowUpBossEndpointOutputSchemas.peopleRelationshipsDelete,
	},
	'calls.list': {
		input: FollowUpBossEndpointInputSchemas.callsList,
		output: FollowUpBossEndpointOutputSchemas.callsList,
	},
	'calls.create': {
		input: FollowUpBossEndpointInputSchemas.callsCreate,
		output: FollowUpBossEndpointOutputSchemas.callsCreate,
	},
	'calls.get': {
		input: FollowUpBossEndpointInputSchemas.callsGet,
		output: FollowUpBossEndpointOutputSchemas.callsGet,
	},
	'calls.update': {
		input: FollowUpBossEndpointInputSchemas.callsUpdate,
		output: FollowUpBossEndpointOutputSchemas.callsUpdate,
	},
	'textMessages.list': {
		input: FollowUpBossEndpointInputSchemas.textMessagesList,
		output: FollowUpBossEndpointOutputSchemas.textMessagesList,
	},
	'textMessages.create': {
		input: FollowUpBossEndpointInputSchemas.textMessagesCreate,
		output: FollowUpBossEndpointOutputSchemas.textMessagesCreate,
	},
	'textMessages.get': {
		input: FollowUpBossEndpointInputSchemas.textMessagesGet,
		output: FollowUpBossEndpointOutputSchemas.textMessagesGet,
	},
	'notes.create': {
		input: FollowUpBossEndpointInputSchemas.notesCreate,
		output: FollowUpBossEndpointOutputSchemas.notesCreate,
	},
	'notes.get': {
		input: FollowUpBossEndpointInputSchemas.notesGet,
		output: FollowUpBossEndpointOutputSchemas.notesGet,
	},
	'notes.update': {
		input: FollowUpBossEndpointInputSchemas.notesUpdate,
		output: FollowUpBossEndpointOutputSchemas.notesUpdate,
	},
	'notes.delete': {
		input: FollowUpBossEndpointInputSchemas.notesDelete,
		output: FollowUpBossEndpointOutputSchemas.notesDelete,
	},
	'events.list': {
		input: FollowUpBossEndpointInputSchemas.eventsList,
		output: FollowUpBossEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: FollowUpBossEndpointInputSchemas.eventsGet,
		output: FollowUpBossEndpointOutputSchemas.eventsGet,
	},
	'events.create': {
		input: FollowUpBossEndpointInputSchemas.eventsCreate,
		output: FollowUpBossEndpointOutputSchemas.eventsCreate,
	},
	'tasks.list': {
		input: FollowUpBossEndpointInputSchemas.tasksList,
		output: FollowUpBossEndpointOutputSchemas.tasksList,
	},
	'tasks.create': {
		input: FollowUpBossEndpointInputSchemas.tasksCreate,
		output: FollowUpBossEndpointOutputSchemas.tasksCreate,
	},
	'tasks.get': {
		input: FollowUpBossEndpointInputSchemas.tasksGet,
		output: FollowUpBossEndpointOutputSchemas.tasksGet,
	},
	'tasks.update': {
		input: FollowUpBossEndpointInputSchemas.tasksUpdate,
		output: FollowUpBossEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: FollowUpBossEndpointInputSchemas.tasksDelete,
		output: FollowUpBossEndpointOutputSchemas.tasksDelete,
	},
	'appointments.list': {
		input: FollowUpBossEndpointInputSchemas.appointmentsList,
		output: FollowUpBossEndpointOutputSchemas.appointmentsList,
	},
	'appointments.create': {
		input: FollowUpBossEndpointInputSchemas.appointmentsCreate,
		output: FollowUpBossEndpointOutputSchemas.appointmentsCreate,
	},
	'appointments.get': {
		input: FollowUpBossEndpointInputSchemas.appointmentsGet,
		output: FollowUpBossEndpointOutputSchemas.appointmentsGet,
	},
	'appointments.update': {
		input: FollowUpBossEndpointInputSchemas.appointmentsUpdate,
		output: FollowUpBossEndpointOutputSchemas.appointmentsUpdate,
	},
	'appointments.delete': {
		input: FollowUpBossEndpointInputSchemas.appointmentsDelete,
		output: FollowUpBossEndpointOutputSchemas.appointmentsDelete,
	},
	'appointmentTypes.list': {
		input: FollowUpBossEndpointInputSchemas.appointmentTypesList,
		output: FollowUpBossEndpointOutputSchemas.appointmentTypesList,
	},
	'appointmentTypes.create': {
		input: FollowUpBossEndpointInputSchemas.appointmentTypesCreate,
		output: FollowUpBossEndpointOutputSchemas.appointmentTypesCreate,
	},
	'appointmentTypes.get': {
		input: FollowUpBossEndpointInputSchemas.appointmentTypesGet,
		output: FollowUpBossEndpointOutputSchemas.appointmentTypesGet,
	},
	'appointmentTypes.update': {
		input: FollowUpBossEndpointInputSchemas.appointmentTypesUpdate,
		output: FollowUpBossEndpointOutputSchemas.appointmentTypesUpdate,
	},
	'appointmentTypes.delete': {
		input: FollowUpBossEndpointInputSchemas.appointmentTypesDelete,
		output: FollowUpBossEndpointOutputSchemas.appointmentTypesDelete,
	},
	'timeframes.list': {
		input: FollowUpBossEndpointInputSchemas.timeframesList,
		output: FollowUpBossEndpointOutputSchemas.timeframesList,
	},
	'smartLists.list': {
		input: FollowUpBossEndpointInputSchemas.smartListsList,
		output: FollowUpBossEndpointOutputSchemas.smartListsList,
	},
	'smartLists.get': {
		input: FollowUpBossEndpointInputSchemas.smartListsGet,
		output: FollowUpBossEndpointOutputSchemas.smartListsGet,
	},
	'account.me': {
		input: FollowUpBossEndpointInputSchemas.meGet,
		output: FollowUpBossEndpointOutputSchemas.meGet,
	},
	'account.identity': {
		input: FollowUpBossEndpointInputSchemas.identityGet,
		output: FollowUpBossEndpointOutputSchemas.identityGet,
	},
	'deals.list': {
		input: FollowUpBossEndpointInputSchemas.dealsList,
		output: FollowUpBossEndpointOutputSchemas.dealsList,
	},
	'deals.get': {
		input: FollowUpBossEndpointInputSchemas.dealsGet,
		output: FollowUpBossEndpointOutputSchemas.dealsGet,
	},
	'deals.create': {
		input: FollowUpBossEndpointInputSchemas.dealsCreate,
		output: FollowUpBossEndpointOutputSchemas.dealsCreate,
	},
	'deals.update': {
		input: FollowUpBossEndpointInputSchemas.dealsUpdate,
		output: FollowUpBossEndpointOutputSchemas.dealsUpdate,
	},
	'deals.delete': {
		input: FollowUpBossEndpointInputSchemas.dealsDelete,
		output: FollowUpBossEndpointOutputSchemas.dealsDelete,
	},
	'pipelines.list': {
		input: FollowUpBossEndpointInputSchemas.pipelinesList,
		output: FollowUpBossEndpointOutputSchemas.pipelinesList,
	},
	'pipelines.get': {
		input: FollowUpBossEndpointInputSchemas.pipelinesGet,
		output: FollowUpBossEndpointOutputSchemas.pipelinesGet,
	},
	'pipelines.create': {
		input: FollowUpBossEndpointInputSchemas.pipelinesCreate,
		output: FollowUpBossEndpointOutputSchemas.pipelinesCreate,
	},
	'pipelines.update': {
		input: FollowUpBossEndpointInputSchemas.pipelinesUpdate,
		output: FollowUpBossEndpointOutputSchemas.pipelinesUpdate,
	},
	'pipelines.delete': {
		input: FollowUpBossEndpointInputSchemas.pipelinesDelete,
		output: FollowUpBossEndpointOutputSchemas.pipelinesDelete,
	},
	'stages.list': {
		input: FollowUpBossEndpointInputSchemas.stagesList,
		output: FollowUpBossEndpointOutputSchemas.stagesList,
	},
	'stages.get': {
		input: FollowUpBossEndpointInputSchemas.stagesGet,
		output: FollowUpBossEndpointOutputSchemas.stagesGet,
	},
	'stages.create': {
		input: FollowUpBossEndpointInputSchemas.stagesCreate,
		output: FollowUpBossEndpointOutputSchemas.stagesCreate,
	},
	'stages.update': {
		input: FollowUpBossEndpointInputSchemas.stagesUpdate,
		output: FollowUpBossEndpointOutputSchemas.stagesUpdate,
	},
	'stages.delete': {
		input: FollowUpBossEndpointInputSchemas.stagesDelete,
		output: FollowUpBossEndpointOutputSchemas.stagesDelete,
	},
	'dealCustomFields.list': {
		input: FollowUpBossEndpointInputSchemas.dealCustomFieldsList,
		output: FollowUpBossEndpointOutputSchemas.dealCustomFieldsList,
	},
	'dealCustomFields.get': {
		input: FollowUpBossEndpointInputSchemas.dealCustomFieldsGet,
		output: FollowUpBossEndpointOutputSchemas.dealCustomFieldsGet,
	},
	'dealCustomFields.create': {
		input: FollowUpBossEndpointInputSchemas.dealCustomFieldsCreate,
		output: FollowUpBossEndpointOutputSchemas.dealCustomFieldsCreate,
	},
	'dealCustomFields.update': {
		input: FollowUpBossEndpointInputSchemas.dealCustomFieldsUpdate,
		output: FollowUpBossEndpointOutputSchemas.dealCustomFieldsUpdate,
	},
	'dealCustomFields.delete': {
		input: FollowUpBossEndpointInputSchemas.dealCustomFieldsDelete,
		output: FollowUpBossEndpointOutputSchemas.dealCustomFieldsDelete,
	},
	'dealAttachments.create': {
		input: FollowUpBossEndpointInputSchemas.dealAttachmentsCreate,
		output: FollowUpBossEndpointOutputSchemas.dealAttachmentsCreate,
	},
	'dealAttachments.get': {
		input: FollowUpBossEndpointInputSchemas.dealAttachmentsGet,
		output: FollowUpBossEndpointOutputSchemas.dealAttachmentsGet,
	},
	'dealAttachments.update': {
		input: FollowUpBossEndpointInputSchemas.dealAttachmentsUpdate,
		output: FollowUpBossEndpointOutputSchemas.dealAttachmentsUpdate,
	},
	'dealAttachments.delete': {
		input: FollowUpBossEndpointInputSchemas.dealAttachmentsDelete,
		output: FollowUpBossEndpointOutputSchemas.dealAttachmentsDelete,
	},
	'appointmentOutcomes.list': {
		input: FollowUpBossEndpointInputSchemas.appointmentOutcomesList,
		output: FollowUpBossEndpointOutputSchemas.appointmentOutcomesList,
	},
	'appointmentOutcomes.get': {
		input: FollowUpBossEndpointInputSchemas.appointmentOutcomesGet,
		output: FollowUpBossEndpointOutputSchemas.appointmentOutcomesGet,
	},
	'appointmentOutcomes.create': {
		input: FollowUpBossEndpointInputSchemas.appointmentOutcomesCreate,
		output: FollowUpBossEndpointOutputSchemas.appointmentOutcomesCreate,
	},
	'appointmentOutcomes.update': {
		input: FollowUpBossEndpointInputSchemas.appointmentOutcomesUpdate,
		output: FollowUpBossEndpointOutputSchemas.appointmentOutcomesUpdate,
	},
	'appointmentOutcomes.delete': {
		input: FollowUpBossEndpointInputSchemas.appointmentOutcomesDelete,
		output: FollowUpBossEndpointOutputSchemas.appointmentOutcomesDelete,
	},
	'customFields.list': {
		input: FollowUpBossEndpointInputSchemas.customFieldsList,
		output: FollowUpBossEndpointOutputSchemas.customFieldsList,
	},
	'customFields.get': {
		input: FollowUpBossEndpointInputSchemas.customFieldsGet,
		output: FollowUpBossEndpointOutputSchemas.customFieldsGet,
	},
	'customFields.create': {
		input: FollowUpBossEndpointInputSchemas.customFieldsCreate,
		output: FollowUpBossEndpointOutputSchemas.customFieldsCreate,
	},
	'customFields.update': {
		input: FollowUpBossEndpointInputSchemas.customFieldsUpdate,
		output: FollowUpBossEndpointOutputSchemas.customFieldsUpdate,
	},
	'customFields.delete': {
		input: FollowUpBossEndpointInputSchemas.customFieldsDelete,
		output: FollowUpBossEndpointOutputSchemas.customFieldsDelete,
	},
	'templates.list': {
		input: FollowUpBossEndpointInputSchemas.templatesList,
		output: FollowUpBossEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: FollowUpBossEndpointInputSchemas.templatesGet,
		output: FollowUpBossEndpointOutputSchemas.templatesGet,
	},
	'templates.create': {
		input: FollowUpBossEndpointInputSchemas.templatesCreate,
		output: FollowUpBossEndpointOutputSchemas.templatesCreate,
	},
	'templates.update': {
		input: FollowUpBossEndpointInputSchemas.templatesUpdate,
		output: FollowUpBossEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: FollowUpBossEndpointInputSchemas.templatesDelete,
		output: FollowUpBossEndpointOutputSchemas.templatesDelete,
	},
	'templates.merge': {
		input: FollowUpBossEndpointInputSchemas.templatesMerge,
		output: FollowUpBossEndpointOutputSchemas.templatesMerge,
	},
	'textMessageTemplates.list': {
		input: FollowUpBossEndpointInputSchemas.textMessageTemplatesList,
		output: FollowUpBossEndpointOutputSchemas.textMessageTemplatesList,
	},
	'textMessageTemplates.get': {
		input: FollowUpBossEndpointInputSchemas.textMessageTemplatesGet,
		output: FollowUpBossEndpointOutputSchemas.textMessageTemplatesGet,
	},
	'textMessageTemplates.create': {
		input: FollowUpBossEndpointInputSchemas.textMessageTemplatesCreate,
		output: FollowUpBossEndpointOutputSchemas.textMessageTemplatesCreate,
	},
	'textMessageTemplates.update': {
		input: FollowUpBossEndpointInputSchemas.textMessageTemplatesUpdate,
		output: FollowUpBossEndpointOutputSchemas.textMessageTemplatesUpdate,
	},
	'textMessageTemplates.delete': {
		input: FollowUpBossEndpointInputSchemas.textMessageTemplatesDelete,
		output: FollowUpBossEndpointOutputSchemas.textMessageTemplatesDelete,
	},
	'textMessageTemplates.merge': {
		input: FollowUpBossEndpointInputSchemas.textMessageTemplatesMerge,
		output: FollowUpBossEndpointOutputSchemas.textMessageTemplatesMerge,
	},
	'emCampaigns.list': {
		input: FollowUpBossEndpointInputSchemas.emCampaignsList,
		output: FollowUpBossEndpointOutputSchemas.emCampaignsList,
	},
	'emCampaigns.create': {
		input: FollowUpBossEndpointInputSchemas.emCampaignsCreate,
		output: FollowUpBossEndpointOutputSchemas.emCampaignsCreate,
	},
	'emCampaigns.update': {
		input: FollowUpBossEndpointInputSchemas.emCampaignsUpdate,
		output: FollowUpBossEndpointOutputSchemas.emCampaignsUpdate,
	},
	'emEvents.list': {
		input: FollowUpBossEndpointInputSchemas.emEventsList,
		output: FollowUpBossEndpointOutputSchemas.emEventsList,
	},
	'emEvents.create': {
		input: FollowUpBossEndpointInputSchemas.emEventsCreate,
		output: FollowUpBossEndpointOutputSchemas.emEventsCreate,
	},
	'users.list': {
		input: FollowUpBossEndpointInputSchemas.usersList,
		output: FollowUpBossEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: FollowUpBossEndpointInputSchemas.usersGet,
		output: FollowUpBossEndpointOutputSchemas.usersGet,
	},
	'users.delete': {
		input: FollowUpBossEndpointInputSchemas.usersDelete,
		output: FollowUpBossEndpointOutputSchemas.usersDelete,
	},
	'teams.list': {
		input: FollowUpBossEndpointInputSchemas.teamsList,
		output: FollowUpBossEndpointOutputSchemas.teamsList,
	},
	'teams.create': {
		input: FollowUpBossEndpointInputSchemas.teamsCreate,
		output: FollowUpBossEndpointOutputSchemas.teamsCreate,
	},
	'teams.get': {
		input: FollowUpBossEndpointInputSchemas.teamsGet,
		output: FollowUpBossEndpointOutputSchemas.teamsGet,
	},
	'teams.update': {
		input: FollowUpBossEndpointInputSchemas.teamsUpdate,
		output: FollowUpBossEndpointOutputSchemas.teamsUpdate,
	},
	'teams.delete': {
		input: FollowUpBossEndpointInputSchemas.teamsDelete,
		output: FollowUpBossEndpointOutputSchemas.teamsDelete,
	},
	'groups.list': {
		input: FollowUpBossEndpointInputSchemas.groupsList,
		output: FollowUpBossEndpointOutputSchemas.groupsList,
	},
	'groups.create': {
		input: FollowUpBossEndpointInputSchemas.groupsCreate,
		output: FollowUpBossEndpointOutputSchemas.groupsCreate,
	},
	'groups.get': {
		input: FollowUpBossEndpointInputSchemas.groupsGet,
		output: FollowUpBossEndpointOutputSchemas.groupsGet,
	},
	'groups.update': {
		input: FollowUpBossEndpointInputSchemas.groupsUpdate,
		output: FollowUpBossEndpointOutputSchemas.groupsUpdate,
	},
	'groups.delete': {
		input: FollowUpBossEndpointInputSchemas.groupsDelete,
		output: FollowUpBossEndpointOutputSchemas.groupsDelete,
	},
	'groups.roundRobin': {
		input: FollowUpBossEndpointInputSchemas.groupsRoundRobin,
		output: FollowUpBossEndpointOutputSchemas.groupsRoundRobin,
	},
	'ponds.list': {
		input: FollowUpBossEndpointInputSchemas.pondsList,
		output: FollowUpBossEndpointOutputSchemas.pondsList,
	},
	'ponds.create': {
		input: FollowUpBossEndpointInputSchemas.pondsCreate,
		output: FollowUpBossEndpointOutputSchemas.pondsCreate,
	},
	'ponds.get': {
		input: FollowUpBossEndpointInputSchemas.pondsGet,
		output: FollowUpBossEndpointOutputSchemas.pondsGet,
	},
	'ponds.update': {
		input: FollowUpBossEndpointInputSchemas.pondsUpdate,
		output: FollowUpBossEndpointOutputSchemas.pondsUpdate,
	},
	'ponds.delete': {
		input: FollowUpBossEndpointInputSchemas.pondsDelete,
		output: FollowUpBossEndpointOutputSchemas.pondsDelete,
	},
	'rateLimit.limits': {
		input: FollowUpBossEndpointInputSchemas.rateLimitLimits,
		output: FollowUpBossEndpointOutputSchemas.rateLimitLimits,
	},
	'rateLimit.usage': {
		input: FollowUpBossEndpointInputSchemas.rateLimitUsage,
		output: FollowUpBossEndpointOutputSchemas.rateLimitUsage,
	},
	'automations.list': {
		input: FollowUpBossEndpointInputSchemas.automationsList,
		output: FollowUpBossEndpointOutputSchemas.automationsList,
	},
	'automations.get': {
		input: FollowUpBossEndpointInputSchemas.automationsGet,
		output: FollowUpBossEndpointOutputSchemas.automationsGet,
	},
	'automationsPeople.list': {
		input: FollowUpBossEndpointInputSchemas.automationsPeopleList,
		output: FollowUpBossEndpointOutputSchemas.automationsPeopleList,
	},
	'automationsPeople.get': {
		input: FollowUpBossEndpointInputSchemas.automationsPeopleGet,
		output: FollowUpBossEndpointOutputSchemas.automationsPeopleGet,
	},
	'automationsPeople.create': {
		input: FollowUpBossEndpointInputSchemas.automationsPeopleCreate,
		output: FollowUpBossEndpointOutputSchemas.automationsPeopleCreate,
	},
	'automationsPeople.update': {
		input: FollowUpBossEndpointInputSchemas.automationsPeopleUpdate,
		output: FollowUpBossEndpointOutputSchemas.automationsPeopleUpdate,
	},
	'actionPlans.list': {
		input: FollowUpBossEndpointInputSchemas.actionPlansList,
		output: FollowUpBossEndpointOutputSchemas.actionPlansList,
	},
	'actionPlansPeople.list': {
		input: FollowUpBossEndpointInputSchemas.actionPlansPeopleList,
		output: FollowUpBossEndpointOutputSchemas.actionPlansPeopleList,
	},
	'actionPlansPeople.create': {
		input: FollowUpBossEndpointInputSchemas.actionPlansPeopleCreate,
		output: FollowUpBossEndpointOutputSchemas.actionPlansPeopleCreate,
	},
	'actionPlansPeople.update': {
		input: FollowUpBossEndpointInputSchemas.actionPlansPeopleUpdate,
		output: FollowUpBossEndpointOutputSchemas.actionPlansPeopleUpdate,
	},
	'webhooks.list': {
		input: FollowUpBossEndpointInputSchemas.webhooksList,
		output: FollowUpBossEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: FollowUpBossEndpointInputSchemas.webhooksCreate,
		output: FollowUpBossEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.get': {
		input: FollowUpBossEndpointInputSchemas.webhooksGet,
		output: FollowUpBossEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.update': {
		input: FollowUpBossEndpointInputSchemas.webhooksUpdate,
		output: FollowUpBossEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: FollowUpBossEndpointInputSchemas.webhooksDelete,
		output: FollowUpBossEndpointOutputSchemas.webhooksDelete,
	},
	'webhookEvents.get': {
		input: FollowUpBossEndpointInputSchemas.webhookEventsGet,
		output: FollowUpBossEndpointOutputSchemas.webhookEventsGet,
	},
	'inboxApps.deactivate': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsDeactivate,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsDeactivate,
	},
	'inboxApps.deleteParticipant': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsDeleteParticipant,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsDeleteParticipant,
	},
	'inboxApps.getParticipants': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsGetParticipants,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsGetParticipants,
	},
	'inboxApps.createParticipant': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsCreateParticipant,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsCreateParticipant,
	},
	'inboxApps.addMessage': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsAddMessage,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsAddMessage,
	},
	'inboxApps.addNote': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsAddNote,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsAddNote,
	},
	'inboxApps.addSystemConfirmationMessage': {
		input:
			FollowUpBossEndpointInputSchemas.inboxAppsAddSystemConfirmationMessage,
		output:
			FollowUpBossEndpointOutputSchemas.inboxAppsAddSystemConfirmationMessage,
	},
	'inboxApps.install': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsInstall,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsInstall,
	},
	'inboxApps.updateConversation': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsUpdateConversation,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsUpdateConversation,
	},
	'inboxApps.updateMessage': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsUpdateMessage,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsUpdateMessage,
	},
	'inboxApps.installedApp': {
		input: FollowUpBossEndpointInputSchemas.inboxAppsInstalledApp,
		output: FollowUpBossEndpointOutputSchemas.inboxAppsInstalledApp,
	},
	'teamInboxes.list': {
		input: FollowUpBossEndpointInputSchemas.teamInboxesList,
		output: FollowUpBossEndpointOutputSchemas.teamInboxesList,
	},
	'reactions.create': {
		input: FollowUpBossEndpointInputSchemas.reactionsCreate,
		output: FollowUpBossEndpointOutputSchemas.reactionsCreate,
	},
	'reactions.get': {
		input: FollowUpBossEndpointInputSchemas.reactionsGet,
		output: FollowUpBossEndpointOutputSchemas.reactionsGet,
	},
	'reactions.delete': {
		input: FollowUpBossEndpointInputSchemas.reactionsDelete,
		output: FollowUpBossEndpointOutputSchemas.reactionsDelete,
	},
	'threadedReplies.get': {
		input: FollowUpBossEndpointInputSchemas.threadedRepliesGet,
		output: FollowUpBossEndpointOutputSchemas.threadedRepliesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof followUpBossEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const followUpBossEndpointMeta = {
	'people.list': {
		riskLevel: 'read',
		description:
			'List people with filters such as name, email, phone, stage, source, tags or assignment, sorted and paged',
	},
	'people.get': {
		riskLevel: 'read',
		description:
			'Get one person by ID with their contact details, stage, source, tags and timeframes',
	},
	'people.create': {
		riskLevel: 'write',
		description:
			'Create a person, optionally merging into an existing duplicate instead of creating a new lead',
	},
	'people.update': {
		riskLevel: 'write',
		description:
			"Update one person's contact details, stage, price, assignment, tags, timeframes or custom fields",
	},
	'people.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a person from the account',
	},
	'people.checkDuplicate': {
		riskLevel: 'read',
		description:
			'Check whether a person with this email address or phone number already exists, and who they are assigned to, before creating a new lead',
	},
	'people.unclaimed': {
		riskLevel: 'read',
		description: 'List the unclaimed leads currently offered to the user',
	},
	'people.claim': {
		riskLevel: 'write',
		description: "Claim an unclaimed lead so it becomes the user's contact",
	},
	'people.ignoreUnclaimed': {
		riskLevel: 'write',
		description:
			'Ignore an unclaimed lead so it is no longer offered to the user; the lead answers 204 and is not deleted',
	},
	'personAttachments.create': {
		riskLevel: 'write',
		description: 'Attach an externally hosted file to a person',
	},
	'personAttachments.get': {
		riskLevel: 'read',
		description: 'Get one file attachment of a person by ID',
	},
	'personAttachments.update': {
		riskLevel: 'write',
		description: 'Update the file URI, name or size of a person attachment',
	},
	'personAttachments.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a file attachment from a person',
	},
	'peopleRelationships.list': {
		riskLevel: 'read',
		description:
			'List the partner relationships of people, filtered by person or name',
	},
	'peopleRelationships.create': {
		riskLevel: 'write',
		description: 'Create a partner relationship attached to a person',
	},
	'peopleRelationships.get': {
		riskLevel: 'read',
		description: 'Get one partner relationship by ID',
	},
	'peopleRelationships.update': {
		riskLevel: 'write',
		description: 'Update the name, type or contact details of a relationship',
	},
	'peopleRelationships.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a partner relationship',
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List logged calls, filtered by person or phone number, paged',
	},
	'calls.create': {
		riskLevel: 'write',
		description:
			'Log a call on a person with its direction, duration, outcome and note',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Get one logged call by ID',
	},
	'calls.update': {
		riskLevel: 'write',
		description: "Update a logged call's note, outcome or duration",
	},
	'textMessages.list': {
		riskLevel: 'read',
		description:
			'List text messages, filtered by person or phone number, paged',
	},
	'textMessages.create': {
		riskLevel: 'write',
		description:
			'Log a text message on a person with its direction and byline details',
	},
	'textMessages.get': {
		riskLevel: 'read',
		description: 'Get one text message by ID',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Add a note to a person',
	},
	'notes.get': {
		riskLevel: 'read',
		description:
			'Get one note by ID, optionally with its threaded replies and reactions',
	},
	'notes.update': {
		riskLevel: 'write',
		description: "Update a note's subject, body or person",
	},
	'notes.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a note',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'List lead events, filtered by person, type or property, paged with the keyset cursor FUB enforces on deep pages',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get one lead event by ID',
	},
	'events.create': {
		riskLevel: 'write',
		description:
			"Push a lead event into Follow Up Boss's routing, which creates or matches the person and runs their action plans",
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List tasks, filtered by person, assignee, type or due range, paged',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task such as a follow-up on a person',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Get one task by ID with its type, due date and completion status',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: "Update a task's name, type, due date or completion",
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a task',
	},
	'appointments.list': {
		riskLevel: 'read',
		description:
			'List appointments, filtered by person, user or date range, paged',
	},
	'appointments.create': {
		riskLevel: 'write',
		description:
			'Create an appointment with invitees, optionally sending them invitations',
	},
	'appointments.get': {
		riskLevel: 'read',
		description: 'Get one appointment by ID',
	},
	'appointments.update': {
		riskLevel: 'write',
		description: "Update an appointment's time, place, type or invitees",
	},
	'appointments.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an appointment',
	},
	'appointmentTypes.list': {
		riskLevel: 'read',
		description: 'List the appointment types, sorted and paged',
	},
	'appointmentTypes.create': {
		riskLevel: 'write',
		description: 'Create an appointment type with an optional sort order',
	},
	'appointmentTypes.get': {
		riskLevel: 'read',
		description: 'Get one appointment type by ID',
	},
	'appointmentTypes.update': {
		riskLevel: 'write',
		description: "Update an appointment type's name or sort order",
	},
	'appointmentTypes.delete': {
		riskLevel: 'destructive',
		description:
			'Delete an appointment type after reassigning its appointments to another type',
	},
	'timeframes.list': {
		riskLevel: 'read',
		description: 'List the named timeframes available for people',
	},
	'smartLists.list': {
		riskLevel: 'read',
		description: 'List the account smart lists, paged',
	},
	'smartLists.get': {
		riskLevel: 'read',
		description: 'Get one smart list by ID',
	},
	'account.me': {
		riskLevel: 'read',
		description: "Get the authenticated user's profile and role",
	},
	'account.identity': {
		riskLevel: 'read',
		description:
			'Get the account identity information behind the authenticated API key',
	},
	'deals.list': {
		riskLevel: 'read',
		description:
			'List deals with their stage, price and people, sorted and paged',
	},
	'deals.get': {
		riskLevel: 'read',
		description:
			'Get one deal by ID with its stage, value and associated people',
	},
	'deals.create': {
		riskLevel: 'write',
		description:
			'Create a deal on a pipeline stage with a value and description',
	},
	'deals.update': {
		riskLevel: 'write',
		description:
			"Update a deal's stage, value, commission or associated people",
	},
	'deals.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a deal',
	},
	'pipelines.list': {
		riskLevel: 'read',
		description: 'List the deal pipelines with their stages and order',
	},
	'pipelines.get': {
		riskLevel: 'read',
		description: 'Get one deal pipeline by ID',
	},
	'pipelines.create': {
		riskLevel: 'write',
		description: 'Create a deal pipeline with an optional stage list',
	},
	'pipelines.update': {
		riskLevel: 'write',
		description: "Update a pipeline's name, description or stage order",
	},
	'pipelines.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a deal pipeline',
	},
	'stages.list': {
		riskLevel: 'read',
		description:
			'List the deal stages across pipelines with their order weight',
	},
	'stages.get': {
		riskLevel: 'read',
		description: 'Get one deal stage by ID',
	},
	'stages.create': {
		riskLevel: 'write',
		description: 'Create a deal stage with an optional sort order',
	},
	'stages.update': {
		riskLevel: 'write',
		description: "Update a deal stage's name or sort order",
	},
	'stages.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a deal stage after reassigning its action plans to another stage',
	},
	'dealCustomFields.list': {
		riskLevel: 'read',
		description: 'List the custom fields available on deals',
	},
	'dealCustomFields.get': {
		riskLevel: 'read',
		description: 'Get one deal custom field definition by ID',
	},
	'dealCustomFields.create': {
		riskLevel: 'write',
		description:
			'Create a custom field definition for deals, with choices for dropdown types',
	},
	'dealCustomFields.update': {
		riskLevel: 'write',
		description: "Update a deal custom field's label, choices or visibility",
	},
	'dealCustomFields.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a deal custom field definition',
	},
	'dealAttachments.create': {
		riskLevel: 'write',
		description: 'Attach an externally hosted file to a deal',
	},
	'dealAttachments.get': {
		riskLevel: 'read',
		description: 'Get one file attachment of a deal by ID',
	},
	'dealAttachments.update': {
		riskLevel: 'write',
		description: 'Update the file URI, name or size of a deal attachment',
	},
	'dealAttachments.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a file attachment from a deal',
	},
	'appointmentOutcomes.list': {
		riskLevel: 'read',
		description: 'List the outcomes that appointments can be closed with',
	},
	'appointmentOutcomes.get': {
		riskLevel: 'read',
		description: 'Get one appointment outcome by ID',
	},
	'appointmentOutcomes.create': {
		riskLevel: 'write',
		description: 'Create an appointment outcome with an optional sort order',
	},
	'appointmentOutcomes.update': {
		riskLevel: 'write',
		description: "Update an appointment outcome's name or sort order",
	},
	'appointmentOutcomes.delete': {
		riskLevel: 'destructive',
		description:
			'Delete an appointment outcome after reassigning its appointments to another outcome',
	},
	'customFields.list': {
		riskLevel: 'read',
		description: 'List the custom fields available on people',
	},
	'customFields.get': {
		riskLevel: 'read',
		description: 'Get one person custom field definition by ID',
	},
	'customFields.create': {
		riskLevel: 'write',
		description:
			'Create a custom field definition for people, with choices for dropdown types',
	},
	'customFields.update': {
		riskLevel: 'write',
		description: "Update a person custom field's label, choices or visibility",
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a person custom field definition',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List the email message templates, paged',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get one email template by ID',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create an email template with subject and body, optionally shared',
	},
	'templates.update': {
		riskLevel: 'write',
		description: "Replace an email template's name, subject and body",
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an email template',
	},
	'templates.merge': {
		riskLevel: 'write',
		description:
			'Render an email template for a person, merging their fields into the body',
	},
	'textMessageTemplates.list': {
		riskLevel: 'read',
		description: 'List the text message templates, paged',
	},
	'textMessageTemplates.get': {
		riskLevel: 'read',
		description: 'Get one text message template by ID',
	},
	'textMessageTemplates.create': {
		riskLevel: 'write',
		description: 'Create a text message template, optionally shared',
	},
	'textMessageTemplates.update': {
		riskLevel: 'write',
		description: "Update a text message template's name or message",
	},
	'textMessageTemplates.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a text message template',
	},
	'textMessageTemplates.merge': {
		riskLevel: 'write',
		description:
			'Render a text message template for a person, merging their fields into the message',
	},
	'emCampaigns.list': {
		riskLevel: 'read',
		description: 'List the email marketing campaigns, filtered by origin',
	},
	'emCampaigns.create': {
		riskLevel: 'write',
		description:
			'Create an email marketing campaign with subject and HTML body',
	},
	'emCampaigns.update': {
		riskLevel: 'write',
		description: "Update an email marketing campaign's name, subject or body",
	},
	'emEvents.list': {
		riskLevel: 'read',
		description: 'List email marketing events such as sends, opens and clicks',
	},
	'emEvents.create': {
		riskLevel: 'write',
		description:
			'Record email marketing events against subscriber email addresses',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List the users of the account with their roles',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get one user by ID with their role and contact details',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Permanently remove a user from the account',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List the teams in the account with their members',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a team with members and leaders',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Get one team by ID with its members and leaders',
	},
	'teams.update': {
		riskLevel: 'write',
		description: "Update a team's name, members or leaders",
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a team',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List the routing groups with their distribution strategy',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a routing group of users with a distribution strategy',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Get one routing group by ID',
	},
	'groups.update': {
		riskLevel: 'write',
		description: "Update a routing group's name, members or distribution",
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a routing group',
	},
	'groups.roundRobin': {
		riskLevel: 'read',
		description: 'Read the round-robin rotation state of the routing groups',
	},
	'ponds.list': {
		riskLevel: 'read',
		description:
			'List the ponds, the lead pools that distribute new contacts to agents',
	},
	'ponds.create': {
		riskLevel: 'write',
		description: 'Create a pond with the users whose leads land in it',
	},
	'ponds.get': {
		riskLevel: 'read',
		description: 'Get one pond by ID with its assigned users',
	},
	'ponds.update': {
		riskLevel: 'write',
		description: "Update a pond's name or assigned users",
	},
	'ponds.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a pond',
	},
	'rateLimit.limits': {
		riskLevel: 'read',
		description:
			'Read the rate-limit levels currently configured for this system',
	},
	'rateLimit.usage': {
		riskLevel: 'read',
		description:
			"Read this system's 24-hour API usage totals and rate-limit statistics",
	},
	'automations.list': {
		riskLevel: 'read',
		description: "List the account's automations",
	},
	'automations.get': {
		riskLevel: 'read',
		description: 'Get one automation by ID',
	},
	'automationsPeople.list': {
		riskLevel: 'read',
		description:
			'List the people enrolled in automations, filtered by automation',
	},
	'automationsPeople.get': {
		riskLevel: 'read',
		description: 'Get one automation enrollment by ID',
	},
	'automationsPeople.create': {
		riskLevel: 'write',
		description: 'Enroll a person into an automation',
	},
	'automationsPeople.update': {
		riskLevel: 'write',
		description: 'Update an automation enrollment, such as finishing it',
	},
	'actionPlans.list': {
		riskLevel: 'read',
		description: "List the account's action plans",
	},
	'actionPlansPeople.list': {
		riskLevel: 'read',
		description: 'List the people enrolled in action plans, filtered by person',
	},
	'actionPlansPeople.create': {
		riskLevel: 'write',
		description: 'Enroll a person into an action plan',
	},
	'actionPlansPeople.update': {
		riskLevel: 'write',
		description: 'Update an action plan enrollment, such as finishing it',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhook subscriptions of the account',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Subscribe a URL to one Follow Up Boss event',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get one webhook subscription by ID',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: "Update a webhook subscription's URL or event type",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a webhook subscription',
	},
	'webhookEvents.get': {
		riskLevel: 'read',
		description:
			'List the delivery events recorded for one webhook subscription',
	},
	'inboxApps.deactivate': {
		riskLevel: 'destructive',
		description: 'Deactivate an inbox app so it stops receiving conversations',
	},
	'inboxApps.deleteParticipant': {
		riskLevel: 'destructive',
		description: 'Remove a participant from an inbox app conversation',
	},
	'inboxApps.getParticipants': {
		riskLevel: 'read',
		description: 'List the participants of an inbox app conversation',
	},
	'inboxApps.createParticipant': {
		riskLevel: 'write',
		description: 'Add a participant to an inbox app conversation',
	},
	'inboxApps.addMessage': {
		riskLevel: 'write',
		description:
			'Deliver a message from your system into an inbox app conversation',
	},
	'inboxApps.addNote': {
		riskLevel: 'write',
		description: 'Add an internal note to an inbox app conversation',
	},
	'inboxApps.addSystemConfirmationMessage': {
		riskLevel: 'write',
		description:
			'Add a system confirmation message to an inbox app conversation',
	},
	'inboxApps.install': {
		riskLevel: 'write',
		description:
			'Install a published inbox app for a user with a subscription URL',
	},
	'inboxApps.updateConversation': {
		riskLevel: 'write',
		description: "Update an inbox app conversation's subject or state",
	},
	'inboxApps.updateMessage': {
		riskLevel: 'write',
		description:
			'Update a message previously delivered to an inbox app conversation',
	},
	'inboxApps.installedApp': {
		riskLevel: 'read',
		description: 'Read the installation details of a published inbox app',
	},
	'teamInboxes.list': {
		riskLevel: 'read',
		description: 'List the team inboxes available in the account',
	},
	'reactions.create': {
		riskLevel: 'write',
		description: 'Add a reaction to a note or other reference',
	},
	'reactions.get': {
		riskLevel: 'read',
		description: 'Get the reactions attached to a note',
	},
	'reactions.delete': {
		riskLevel: 'destructive',
		description: 'Remove a reaction, sending the documented delete body',
	},
	'threadedReplies.get': {
		riskLevel: 'read',
		description: 'Get the threaded replies of a note',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof followUpBossEndpointsNested
>;

export const followUpBossAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFollowUpBossPlugin<T extends FollowUpBossPluginOptions> =
	CorsairPlugin<
		'followupboss',
		typeof FollowUpBossSchema,
		typeof followUpBossEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalFollowUpBossPlugin =
	BaseFollowUpBossPlugin<FollowUpBossPluginOptions>;

export type ExternalFollowUpBossPlugin<T extends FollowUpBossPluginOptions> =
	BaseFollowUpBossPlugin<T>;

export function followupboss<const T extends FollowUpBossPluginOptions>(
	incomingOptions: FollowUpBossPluginOptions &
		T = {} as FollowUpBossPluginOptions & T,
): ExternalFollowUpBossPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'followupboss',
		authConfig: followUpBossAuthConfig,
		schema: FollowUpBossSchema,
		options: options,
		hooks: options.hooks,
		endpoints: followUpBossEndpointsNested,
		webhooks: {},
		endpointMeta: followUpBossEndpointMeta,
		endpointSchemas: followUpBossEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: FollowUpBossKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('followupboss', ctx.authType ?? 'api_key');
		},
	} satisfies InternalFollowUpBossPlugin;
}

export { FollowUpBossAPIError } from './client';
export type {
	FollowUpBossEndpointInputs,
	FollowUpBossEndpointOutputs,
} from './endpoints/registry';
export type {
	FollowUpBossAppointment,
	FollowUpBossAppointmentType,
	FollowUpBossCall,
	FollowUpBossDeletedResponse,
	FollowUpBossEvent,
	FollowUpBossIdentity,
	FollowUpBossMe,
	FollowUpBossNote,
	FollowUpBossPerson,
	FollowUpBossPersonAttachment,
	FollowUpBossPersonRelationship,
	FollowUpBossSmartList,
	FollowUpBossTask,
	FollowUpBossTextMessage,
} from './endpoints/types';
export { TASK_TYPES } from './endpoints/types';
