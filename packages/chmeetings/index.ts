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
	Events,
	Families,
	Groups,
	Organizations,
	People,
	Settings,
} from './endpoints';
import type {
	ChMeetingsEndpointInputs,
	ChMeetingsEndpointOutputs,
} from './endpoints/types';
import {
	ChMeetingsEndpointInputSchemas,
	ChMeetingsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChMeetingsSchema } from './schema';

export type ChMeetingsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalChMeetingsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chMeetingsEndpointsNested>;
};

export type ChMeetingsContext = CorsairPluginContext<
	typeof ChMeetingsSchema,
	ChMeetingsPluginOptions
>;

export type ChMeetingsKeyBuilderContext =
	KeyBuilderContext<ChMeetingsPluginOptions>;

export type ChMeetingsBoundEndpoints = BindEndpoints<
	typeof chMeetingsEndpointsNested
>;

type ChMeetingsEndpoint<K extends keyof ChMeetingsEndpointOutputs> =
	CorsairEndpoint<
		ChMeetingsContext,
		ChMeetingsEndpointInputs[K],
		ChMeetingsEndpointOutputs[K]
	>;

export type ChMeetingsEndpoints = {
	peopleList: ChMeetingsEndpoint<'peopleList'>;
	peopleGet: ChMeetingsEndpoint<'peopleGet'>;
	peopleCreate: ChMeetingsEndpoint<'peopleCreate'>;
	peopleUpdate: ChMeetingsEndpoint<'peopleUpdate'>;
	peopleDelete: ChMeetingsEndpoint<'peopleDelete'>;
	peopleListOrganizations: ChMeetingsEndpoint<'peopleListOrganizations'>;
	settingsGet: ChMeetingsEndpoint<'settingsGet'>;
	organizationsList: ChMeetingsEndpoint<'organizationsList'>;
	organizationsGet: ChMeetingsEndpoint<'organizationsGet'>;
	organizationsListPeople: ChMeetingsEndpoint<'organizationsListPeople'>;
	organizationsAddPerson: ChMeetingsEndpoint<'organizationsAddPerson'>;
	organizationsRemovePerson: ChMeetingsEndpoint<'organizationsRemovePerson'>;
	eventsList: ChMeetingsEndpoint<'eventsList'>;
	eventsGet: ChMeetingsEndpoint<'eventsGet'>;
	eventsListOccurrences: ChMeetingsEndpoint<'eventsListOccurrences'>;
	attendanceList: ChMeetingsEndpoint<'attendanceList'>;
	groupsList: ChMeetingsEndpoint<'groupsList'>;
	groupsGet: ChMeetingsEndpoint<'groupsGet'>;
	groupsCreate: ChMeetingsEndpoint<'groupsCreate'>;
	groupsUpdate: ChMeetingsEndpoint<'groupsUpdate'>;
	groupsDelete: ChMeetingsEndpoint<'groupsDelete'>;
	groupsAddMember: ChMeetingsEndpoint<'groupsAddMember'>;
	groupsRemoveMember: ChMeetingsEndpoint<'groupsRemoveMember'>;
	familiesList: ChMeetingsEndpoint<'familiesList'>;
	familiesGet: ChMeetingsEndpoint<'familiesGet'>;
	familiesCreate: ChMeetingsEndpoint<'familiesCreate'>;
	familiesDelete: ChMeetingsEndpoint<'familiesDelete'>;
	notesList: ChMeetingsEndpoint<'notesList'>;
};

const chMeetingsEndpointsNested = {
	people: {
		list: People.list,
		get: People.get,
		create: People.create,
		update: People.update,
		delete: People.remove,
		listOrganizations: People.listOrganizations,
	},
	settings: {
		get: Settings.get,
	},
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
		listPeople: Organizations.listPeople,
		addPerson: Organizations.addPerson,
		removePerson: Organizations.removePerson,
	},
	events: {
		list: Events.list,
		get: Events.get,
		listOccurrences: Events.listOccurrences,
	},
	attendance: {
		list: Events.listAttendance,
	},
	groups: {
		list: Groups.list,
		get: Groups.get,
		create: Groups.create,
		update: Groups.update,
		delete: Groups.remove,
		addMember: Groups.addMember,
		removeMember: Groups.removeMember,
	},
	families: {
		list: Families.list,
		get: Families.get,
		create: Families.create,
		delete: Families.remove,
	},
	notes: {
		list: Families.listNotes,
	},
} as const;

const chMeetingsWebhooksNested = {} as const;

export const chMeetingsEndpointSchemas = {
	'people.list': {
		input: ChMeetingsEndpointInputSchemas.peopleList,
		output: ChMeetingsEndpointOutputSchemas.peopleList,
	},
	'people.get': {
		input: ChMeetingsEndpointInputSchemas.peopleGet,
		output: ChMeetingsEndpointOutputSchemas.peopleGet,
	},
	'people.create': {
		input: ChMeetingsEndpointInputSchemas.peopleCreate,
		output: ChMeetingsEndpointOutputSchemas.peopleCreate,
	},
	'people.update': {
		input: ChMeetingsEndpointInputSchemas.peopleUpdate,
		output: ChMeetingsEndpointOutputSchemas.peopleUpdate,
	},
	'people.delete': {
		input: ChMeetingsEndpointInputSchemas.peopleDelete,
		output: ChMeetingsEndpointOutputSchemas.peopleDelete,
	},
	'people.listOrganizations': {
		input: ChMeetingsEndpointInputSchemas.peopleListOrganizations,
		output: ChMeetingsEndpointOutputSchemas.peopleListOrganizations,
	},
	'settings.get': {
		input: ChMeetingsEndpointInputSchemas.settingsGet,
		output: ChMeetingsEndpointOutputSchemas.settingsGet,
	},
	'organizations.list': {
		input: ChMeetingsEndpointInputSchemas.organizationsList,
		output: ChMeetingsEndpointOutputSchemas.organizationsList,
	},
	'organizations.get': {
		input: ChMeetingsEndpointInputSchemas.organizationsGet,
		output: ChMeetingsEndpointOutputSchemas.organizationsGet,
	},
	'organizations.listPeople': {
		input: ChMeetingsEndpointInputSchemas.organizationsListPeople,
		output: ChMeetingsEndpointOutputSchemas.organizationsListPeople,
	},
	'organizations.addPerson': {
		input: ChMeetingsEndpointInputSchemas.organizationsAddPerson,
		output: ChMeetingsEndpointOutputSchemas.organizationsAddPerson,
	},
	'organizations.removePerson': {
		input: ChMeetingsEndpointInputSchemas.organizationsRemovePerson,
		output: ChMeetingsEndpointOutputSchemas.organizationsRemovePerson,
	},
	'events.list': {
		input: ChMeetingsEndpointInputSchemas.eventsList,
		output: ChMeetingsEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: ChMeetingsEndpointInputSchemas.eventsGet,
		output: ChMeetingsEndpointOutputSchemas.eventsGet,
	},
	'events.listOccurrences': {
		input: ChMeetingsEndpointInputSchemas.eventsListOccurrences,
		output: ChMeetingsEndpointOutputSchemas.eventsListOccurrences,
	},
	'attendance.list': {
		input: ChMeetingsEndpointInputSchemas.attendanceList,
		output: ChMeetingsEndpointOutputSchemas.attendanceList,
	},
	'groups.list': {
		input: ChMeetingsEndpointInputSchemas.groupsList,
		output: ChMeetingsEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: ChMeetingsEndpointInputSchemas.groupsGet,
		output: ChMeetingsEndpointOutputSchemas.groupsGet,
	},
	'groups.create': {
		input: ChMeetingsEndpointInputSchemas.groupsCreate,
		output: ChMeetingsEndpointOutputSchemas.groupsCreate,
	},
	'groups.update': {
		input: ChMeetingsEndpointInputSchemas.groupsUpdate,
		output: ChMeetingsEndpointOutputSchemas.groupsUpdate,
	},
	'groups.delete': {
		input: ChMeetingsEndpointInputSchemas.groupsDelete,
		output: ChMeetingsEndpointOutputSchemas.groupsDelete,
	},
	'groups.addMember': {
		input: ChMeetingsEndpointInputSchemas.groupsAddMember,
		output: ChMeetingsEndpointOutputSchemas.groupsAddMember,
	},
	'groups.removeMember': {
		input: ChMeetingsEndpointInputSchemas.groupsRemoveMember,
		output: ChMeetingsEndpointOutputSchemas.groupsRemoveMember,
	},
	'families.list': {
		input: ChMeetingsEndpointInputSchemas.familiesList,
		output: ChMeetingsEndpointOutputSchemas.familiesList,
	},
	'families.get': {
		input: ChMeetingsEndpointInputSchemas.familiesGet,
		output: ChMeetingsEndpointOutputSchemas.familiesGet,
	},
	'families.create': {
		input: ChMeetingsEndpointInputSchemas.familiesCreate,
		output: ChMeetingsEndpointOutputSchemas.familiesCreate,
	},
	'families.delete': {
		input: ChMeetingsEndpointInputSchemas.familiesDelete,
		output: ChMeetingsEndpointOutputSchemas.familiesDelete,
	},
	'notes.list': {
		input: ChMeetingsEndpointInputSchemas.notesList,
		output: ChMeetingsEndpointOutputSchemas.notesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chMeetingsEndpointsNested
>;

const chMeetingsEndpointMeta = {
	'people.list': {
		riskLevel: 'read',
		description: 'List people from GET /api/v1/people',
	},
	'people.get': {
		riskLevel: 'read',
		description: 'Get a person by ID from GET /api/v1/people/{id}',
	},
	'people.create': {
		riskLevel: 'write',
		description: 'Create a person via POST /api/v1/people',
	},
	'people.update': {
		riskLevel: 'write',
		description: 'Update a person via PUT /api/v1/people/{id}',
	},
	'people.delete': {
		riskLevel: 'destructive',
		description: 'Delete a person via DELETE /api/v1/people/{id}',
	},
	'people.listOrganizations': {
		riskLevel: 'read',
		description: 'List a person organizations',
	},
	'settings.get': {
		riskLevel: 'read',
		description:
			'Get genders, social statuses, grade values, family roles, and member fields',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations from GET /api/v1/organizations',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization by ID',
	},
	'organizations.listPeople': {
		riskLevel: 'read',
		description: 'List people in an organization',
	},
	'organizations.addPerson': {
		riskLevel: 'write',
		description: 'Add a person to an organization',
	},
	'organizations.removePerson': {
		riskLevel: 'destructive',
		description: 'Remove a person from an organization',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List events in a date range (max 366 days)',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get an event by ID',
	},
	'events.listOccurrences': {
		riskLevel: 'read',
		description: 'List occurrences for an event in a date range',
	},
	'attendance.list': {
		riskLevel: 'read',
		description: 'List attendance for an occurrence',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List groups',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Get a group by ID',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a group',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Update a group',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a group',
	},
	'groups.addMember': {
		riskLevel: 'write',
		description: 'Add a person to a group',
	},
	'groups.removeMember': {
		riskLevel: 'destructive',
		description: 'Remove a person from a group',
	},
	'families.list': {
		riskLevel: 'read',
		description: 'List families',
	},
	'families.get': {
		riskLevel: 'read',
		description: 'Get a family by ID',
	},
	'families.create': {
		riskLevel: 'write',
		description: 'Create a family with members',
	},
	'families.delete': {
		riskLevel: 'destructive',
		description: 'Delete a family',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'List notes for a person',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof chMeetingsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const chMeetingsAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseChMeetingsPlugin<T extends ChMeetingsPluginOptions> =
	CorsairPlugin<
		'chmeetings',
		typeof ChMeetingsSchema,
		typeof chMeetingsEndpointsNested,
		typeof chMeetingsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalChMeetingsPlugin =
	BaseChMeetingsPlugin<ChMeetingsPluginOptions>;

export type ExternalChMeetingsPlugin<T extends ChMeetingsPluginOptions> =
	BaseChMeetingsPlugin<T>;

export function chmeetings<const T extends ChMeetingsPluginOptions>(
	incomingOptions: ChMeetingsPluginOptions & T = {} as ChMeetingsPluginOptions &
		T,
): ExternalChMeetingsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chmeetings',
		authConfig: chMeetingsAuthConfig,
		schema: ChMeetingsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: chMeetingsEndpointsNested,
		webhooks: chMeetingsWebhooksNested,
		endpointMeta: chMeetingsEndpointMeta,
		endpointSchemas: chMeetingsEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChMeetingsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('chmeetings', 'api_key');
		},
	} satisfies InternalChMeetingsPlugin;
}

export type {
	ChMeetingsEndpointInputs,
	ChMeetingsEndpointOutputs,
} from './endpoints/types';
