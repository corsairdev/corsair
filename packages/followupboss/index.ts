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
	Appointments,
	AppointmentTypes,
	Calls,
	Events,
	Notes,
	People,
	PeopleRelationships,
	PersonAttachments,
	SmartLists,
	Tasks,
	TextMessages,
	Timeframes,
} from './endpoints';
import type {
	FollowUpBossEndpointInputs,
	FollowUpBossEndpointOutputs,
} from './endpoints/types';
import {
	FollowUpBossEndpointInputSchemas,
	FollowUpBossEndpointOutputSchemas,
} from './endpoints/types';
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
			'Find existing people matching an email address or phone number before creating a new lead',
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
	FollowUpBossAppointment,
	FollowUpBossAppointmentType,
	FollowUpBossCall,
	FollowUpBossDeletedResponse,
	FollowUpBossEndpointInputs,
	FollowUpBossEndpointOutputs,
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
