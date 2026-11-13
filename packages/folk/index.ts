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
	Companies,
	Credits,
	FolkEndpointInputSchemas,
	FolkEndpointOutputSchemas,
	GroupMembers,
	Groups,
	Interactions,
	Notes,
	People,
	Users,
} from './endpoints';
import type {
	FolkEndpointInputs,
	FolkEndpointOutputs,
} from './endpoints/types';
import { mergeErrorHandlers } from './error-handlers';
import { FolkSchema } from './schema';

export type FolkPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFolkPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof folkEndpointsNested>;
};

export type FolkContext = CorsairPluginContext<
	typeof FolkSchema,
	FolkPluginOptions
>;

export type FolkKeyBuilderContext = KeyBuilderContext<FolkPluginOptions>;

export type FolkBoundEndpoints = BindEndpoints<typeof folkEndpointsNested>;

type FolkEndpoint<K extends keyof FolkEndpointOutputs> = CorsairEndpoint<
	FolkContext,
	FolkEndpointInputs[K],
	FolkEndpointOutputs[K]
>;

export type FolkEndpoints = {
	peopleList: FolkEndpoint<'peopleList'>;
	peopleGet: FolkEndpoint<'peopleGet'>;
	peopleCreate: FolkEndpoint<'peopleCreate'>;
	peopleUpdate: FolkEndpoint<'peopleUpdate'>;
	peopleDelete: FolkEndpoint<'peopleDelete'>;
	companiesList: FolkEndpoint<'companiesList'>;
	companiesGet: FolkEndpoint<'companiesGet'>;
	companiesCreate: FolkEndpoint<'companiesCreate'>;
	companiesUpdate: FolkEndpoint<'companiesUpdate'>;
	companiesDelete: FolkEndpoint<'companiesDelete'>;
	groupsList: FolkEndpoint<'groupsList'>;
	groupsCreate: FolkEndpoint<'groupsCreate'>;
	groupsUpdate: FolkEndpoint<'groupsUpdate'>;
	groupMembersList: FolkEndpoint<'groupMembersList'>;
	groupMembersAdd: FolkEndpoint<'groupMembersAdd'>;
	groupMembersUpdate: FolkEndpoint<'groupMembersUpdate'>;
	groupMembersRemove: FolkEndpoint<'groupMembersRemove'>;
	interactionsList: FolkEndpoint<'interactionsList'>;
	interactionsListPast: FolkEndpoint<'interactionsListPast'>;
	interactionsListUpcoming: FolkEndpoint<'interactionsListUpcoming'>;
	interactionsGet: FolkEndpoint<'interactionsGet'>;
	interactionsCreate: FolkEndpoint<'interactionsCreate'>;
	interactionsUpdate: FolkEndpoint<'interactionsUpdate'>;
	interactionsDelete: FolkEndpoint<'interactionsDelete'>;
	notesList: FolkEndpoint<'notesList'>;
	notesGet: FolkEndpoint<'notesGet'>;
	notesCreate: FolkEndpoint<'notesCreate'>;
	notesUpdate: FolkEndpoint<'notesUpdate'>;
	notesDelete: FolkEndpoint<'notesDelete'>;
	usersList: FolkEndpoint<'usersList'>;
	usersGetCurrentUser: FolkEndpoint<'usersGetCurrentUser'>;
	usersGet: FolkEndpoint<'usersGet'>;
	creditsGet: FolkEndpoint<'creditsGet'>;
};

const folkEndpointsNested = {
	people: {
		list: People.list,
		get: People.get,
		create: People.create,
		update: People.update,
		delete: People.delete,
	},
	companies: {
		list: Companies.list,
		get: Companies.get,
		create: Companies.create,
		update: Companies.update,
		delete: Companies.delete,
	},
	groups: {
		list: Groups.list,
		create: Groups.create,
		update: Groups.update,
	},
	groupMembers: {
		list: GroupMembers.list,
		add: GroupMembers.add,
		update: GroupMembers.update,
		remove: GroupMembers.remove,
	},
	interactions: {
		list: Interactions.list,
		listPast: Interactions.listPast,
		listUpcoming: Interactions.listUpcoming,
		get: Interactions.get,
		create: Interactions.create,
		update: Interactions.update,
		delete: Interactions.delete,
	},
	notes: {
		list: Notes.list,
		get: Notes.get,
		create: Notes.create,
		update: Notes.update,
		delete: Notes.delete,
	},
	users: {
		list: Users.list,
		getCurrentUser: Users.getCurrentUser,
		get: Users.get,
	},
	credits: {
		get: Credits.get,
	},
} as const;

const folkWebhooksNested = {} as const;

export const folkEndpointSchemas = {
	'people.list': {
		input: FolkEndpointInputSchemas.peopleList,
		output: FolkEndpointOutputSchemas.peopleList,
	},
	'people.get': {
		input: FolkEndpointInputSchemas.peopleGet,
		output: FolkEndpointOutputSchemas.peopleGet,
	},
	'people.create': {
		input: FolkEndpointInputSchemas.peopleCreate,
		output: FolkEndpointOutputSchemas.peopleCreate,
	},
	'people.update': {
		input: FolkEndpointInputSchemas.peopleUpdate,
		output: FolkEndpointOutputSchemas.peopleUpdate,
	},
	'people.delete': {
		input: FolkEndpointInputSchemas.peopleDelete,
		output: FolkEndpointOutputSchemas.peopleDelete,
	},
	'companies.list': {
		input: FolkEndpointInputSchemas.companiesList,
		output: FolkEndpointOutputSchemas.companiesList,
	},
	'companies.get': {
		input: FolkEndpointInputSchemas.companiesGet,
		output: FolkEndpointOutputSchemas.companiesGet,
	},
	'companies.create': {
		input: FolkEndpointInputSchemas.companiesCreate,
		output: FolkEndpointOutputSchemas.companiesCreate,
	},
	'companies.update': {
		input: FolkEndpointInputSchemas.companiesUpdate,
		output: FolkEndpointOutputSchemas.companiesUpdate,
	},
	'companies.delete': {
		input: FolkEndpointInputSchemas.companiesDelete,
		output: FolkEndpointOutputSchemas.companiesDelete,
	},
	'groups.list': {
		input: FolkEndpointInputSchemas.groupsList,
		output: FolkEndpointOutputSchemas.groupsList,
	},
	'groups.create': {
		input: FolkEndpointInputSchemas.groupsCreate,
		output: FolkEndpointOutputSchemas.groupsCreate,
	},
	'groups.update': {
		input: FolkEndpointInputSchemas.groupsUpdate,
		output: FolkEndpointOutputSchemas.groupsUpdate,
	},
	'groupMembers.list': {
		input: FolkEndpointInputSchemas.groupMembersList,
		output: FolkEndpointOutputSchemas.groupMembersList,
	},
	'groupMembers.add': {
		input: FolkEndpointInputSchemas.groupMembersAdd,
		output: FolkEndpointOutputSchemas.groupMembersAdd,
	},
	'groupMembers.update': {
		input: FolkEndpointInputSchemas.groupMembersUpdate,
		output: FolkEndpointOutputSchemas.groupMembersUpdate,
	},
	'groupMembers.remove': {
		input: FolkEndpointInputSchemas.groupMembersRemove,
		output: FolkEndpointOutputSchemas.groupMembersRemove,
	},
	'interactions.list': {
		input: FolkEndpointInputSchemas.interactionsList,
		output: FolkEndpointOutputSchemas.interactionsList,
	},
	'interactions.listPast': {
		input: FolkEndpointInputSchemas.interactionsListPast,
		output: FolkEndpointOutputSchemas.interactionsListPast,
	},
	'interactions.listUpcoming': {
		input: FolkEndpointInputSchemas.interactionsListUpcoming,
		output: FolkEndpointOutputSchemas.interactionsListUpcoming,
	},
	'interactions.get': {
		input: FolkEndpointInputSchemas.interactionsGet,
		output: FolkEndpointOutputSchemas.interactionsGet,
	},
	'interactions.create': {
		input: FolkEndpointInputSchemas.interactionsCreate,
		output: FolkEndpointOutputSchemas.interactionsCreate,
	},
	'interactions.update': {
		input: FolkEndpointInputSchemas.interactionsUpdate,
		output: FolkEndpointOutputSchemas.interactionsUpdate,
	},
	'interactions.delete': {
		input: FolkEndpointInputSchemas.interactionsDelete,
		output: FolkEndpointOutputSchemas.interactionsDelete,
	},
	'notes.list': {
		input: FolkEndpointInputSchemas.notesList,
		output: FolkEndpointOutputSchemas.notesList,
	},
	'notes.get': {
		input: FolkEndpointInputSchemas.notesGet,
		output: FolkEndpointOutputSchemas.notesGet,
	},
	'notes.create': {
		input: FolkEndpointInputSchemas.notesCreate,
		output: FolkEndpointOutputSchemas.notesCreate,
	},
	'notes.update': {
		input: FolkEndpointInputSchemas.notesUpdate,
		output: FolkEndpointOutputSchemas.notesUpdate,
	},
	'notes.delete': {
		input: FolkEndpointInputSchemas.notesDelete,
		output: FolkEndpointOutputSchemas.notesDelete,
	},
	'users.list': {
		input: FolkEndpointInputSchemas.usersList,
		output: FolkEndpointOutputSchemas.usersList,
	},
	'users.getCurrentUser': {
		input: FolkEndpointInputSchemas.usersGetCurrentUser,
		output: FolkEndpointOutputSchemas.usersGetCurrentUser,
	},
	'users.get': {
		input: FolkEndpointInputSchemas.usersGet,
		output: FolkEndpointOutputSchemas.usersGet,
	},
	'credits.get': {
		input: FolkEndpointInputSchemas.creditsGet,
		output: FolkEndpointOutputSchemas.creditsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof folkEndpointsNested>;

const folkWebhookSchemas = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const folkEndpointMeta = {
	'people.list': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of people in the workspace',
	},
	'people.get': {
		riskLevel: 'read',
		description: 'Retrieve an existing person by ID',
	},
	'people.create': {
		riskLevel: 'write',
		description: 'Create a new person in the workspace',
	},
	'people.update': {
		riskLevel: 'write',
		description: 'Update an existing person in the workspace',
	},
	'people.delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing person in the workspace',
	},
	'companies.list': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of companies in the workspace',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Retrieve an existing company by ID',
	},
	'companies.create': {
		riskLevel: 'write',
		description: 'Create a new company in the workspace',
	},
	'companies.update': {
		riskLevel: 'write',
		description: 'Update an existing company in the workspace',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing company in the workspace',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of groups in the workspace',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a new group in the workspace',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Update an existing group in the workspace',
	},
	'groupMembers.list': {
		riskLevel: 'read',
		description: 'Retrieve members of a specific group',
	},
	'groupMembers.add': {
		riskLevel: 'write',
		description: 'Add a workspace member to a group',
	},
	'groupMembers.update': {
		riskLevel: 'write',
		description: 'Update a member role within a group',
	},
	'groupMembers.remove': {
		riskLevel: 'destructive',
		description: 'Remove a member from a group',
	},
	'interactions.list': {
		riskLevel: 'read',
		description: 'Retrieve interactions linked to people or companies',
	},
	'interactions.listPast': {
		riskLevel: 'read',
		description: 'Retrieve past interactions in the workspace',
	},
	'interactions.listUpcoming': {
		riskLevel: 'read',
		description: 'Retrieve upcoming interactions in the workspace',
	},
	'interactions.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific past or upcoming interaction by ID',
	},
	'interactions.create': {
		riskLevel: 'write',
		description: 'Log an interaction connected to a person or company',
	},
	'interactions.update': {
		riskLevel: 'write',
		description: 'Update an existing interaction',
	},
	'interactions.delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing interaction',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'Retrieve notes in the workspace',
	},
	'notes.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific note by ID',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Create a note linked to a person or company',
	},
	'notes.update': {
		riskLevel: 'write',
		description: 'Update an existing note',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing note',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'Retrieve users in the workspace',
	},
	'users.getCurrentUser': {
		riskLevel: 'read',
		description: 'Retrieve the current authenticated user',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific user by ID',
	},
	'credits.get': {
		riskLevel: 'read',
		description: 'Retrieve credit balance for metered workspace features',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof folkEndpointsNested>;

export const folkAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFolkPlugin<T extends FolkPluginOptions> = CorsairPlugin<
	'folk',
	typeof FolkSchema,
	typeof folkEndpointsNested,
	typeof folkWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFolkPlugin = BaseFolkPlugin<FolkPluginOptions>;
export type ExternalFolkPlugin<T extends FolkPluginOptions> = BaseFolkPlugin<T>;

export function folk<const T extends FolkPluginOptions>(
	incomingOptions: FolkPluginOptions & T = {} as FolkPluginOptions & T,
): ExternalFolkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'folk',
		authConfig: folkAuthConfig,
		schema: FolkSchema,
		options,
		hooks: options.hooks,
		endpoints: folkEndpointsNested,
		webhooks: folkWebhooksNested,
		endpointMeta: folkEndpointMeta,
		endpointSchemas: folkEndpointSchemas,
		webhookSchemas: folkWebhookSchemas,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: FolkKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined && options.key.trim().length === 0) {
				throw new AuthMissingError('folk', 'api_key');
			}
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('folk', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey || apiKey.trim().length === 0) {
				throw new AuthMissingError('folk', 'api_key');
			}
			return apiKey;
		},
	} satisfies InternalFolkPlugin;
}

// makeFolkRequest stays internal: exporting it hands any caller's raw path to core's URL templating.
export type { FolkRequestOptions } from './client';
export {
	FOLK_API_BASE,
	FolkAPIError,
	flattenFilter,
	redactSensitiveData,
} from './client';
export * from './endpoints/types';
export * from './error-handlers';
export * from './schema';
