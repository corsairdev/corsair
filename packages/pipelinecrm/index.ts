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
import { Companies, Deals, Notes, People, Users } from './endpoints';
import type {
	PipelineCrmEndpointInputs,
	PipelineCrmEndpointOutputs,
} from './endpoints/types';
import {
	PipelineCrmEndpointInputSchemas,
	PipelineCrmEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PipelinecrmSchema } from './schema';

export type PipelineCrmPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPipelineCrmPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pipelinecrmEndpointsNested>;
};

export type PipelineCrmContext = CorsairPluginContext<
	typeof PipelinecrmSchema,
	PipelineCrmPluginOptions,
	undefined,
	typeof pipelinecrmAuthConfig
>;

export type PipelineCrmKeyBuilderContext = KeyBuilderContext<
	PipelineCrmPluginOptions,
	typeof pipelinecrmAuthConfig
>;

export type PipelineCrmBoundEndpoints = BindEndpoints<
	typeof pipelinecrmEndpointsNested
>;

type PipelineCrmEndpoint<K extends keyof PipelineCrmEndpointOutputs> =
	CorsairEndpoint<
		PipelineCrmContext,
		PipelineCrmEndpointInputs[K],
		PipelineCrmEndpointOutputs[K]
	>;

export type PipelineCrmEndpoints = {
	[K in keyof PipelineCrmEndpointOutputs]: PipelineCrmEndpoint<K>;
};

const pipelinecrmEndpointsNested = {
	deals: {
		list: Deals.list,
		create: Deals.create,
		get: Deals.get,
		update: Deals.update,
		delete: Deals.deleteDeal,
		totalsByStage: Deals.totalsByStage,
		listNotes: Deals.listNotes,
	},
	people: {
		list: People.list,
		create: People.create,
		get: People.get,
		update: People.update,
		delete: People.deletePerson,
		autocomplete: People.autocomplete,
		listDeals: People.listDeals,
		listNotes: People.listNotes,
	},
	companies: {
		list: Companies.list,
		create: Companies.create,
		get: Companies.get,
		update: Companies.update,
		delete: Companies.deleteCompany,
		autocomplete: Companies.autocomplete,
		listPeople: Companies.listPeople,
	},
	notes: {
		list: Notes.list,
		create: Notes.create,
		get: Notes.get,
		update: Notes.update,
		delete: Notes.deleteNote,
	},
	users: {
		list: Users.list,
		get: Users.get,
	},
} as const;

export const pipelinecrmEndpointSchemas = {
	'deals.list': {
		input: PipelineCrmEndpointInputSchemas.dealsList,
		output: PipelineCrmEndpointOutputSchemas.dealsList,
	},
	'deals.create': {
		input: PipelineCrmEndpointInputSchemas.dealsCreate,
		output: PipelineCrmEndpointOutputSchemas.dealsCreate,
	},
	'deals.get': {
		input: PipelineCrmEndpointInputSchemas.dealsGet,
		output: PipelineCrmEndpointOutputSchemas.dealsGet,
	},
	'deals.update': {
		input: PipelineCrmEndpointInputSchemas.dealsUpdate,
		output: PipelineCrmEndpointOutputSchemas.dealsUpdate,
	},
	'deals.delete': {
		input: PipelineCrmEndpointInputSchemas.dealsDelete,
		output: PipelineCrmEndpointOutputSchemas.dealsDelete,
	},
	'deals.totalsByStage': {
		input: PipelineCrmEndpointInputSchemas.dealsTotalsByStage,
		output: PipelineCrmEndpointOutputSchemas.dealsTotalsByStage,
	},
	'deals.listNotes': {
		input: PipelineCrmEndpointInputSchemas.dealsListNotes,
		output: PipelineCrmEndpointOutputSchemas.dealsListNotes,
	},
	'people.list': {
		input: PipelineCrmEndpointInputSchemas.peopleList,
		output: PipelineCrmEndpointOutputSchemas.peopleList,
	},
	'people.create': {
		input: PipelineCrmEndpointInputSchemas.peopleCreate,
		output: PipelineCrmEndpointOutputSchemas.peopleCreate,
	},
	'people.get': {
		input: PipelineCrmEndpointInputSchemas.peopleGet,
		output: PipelineCrmEndpointOutputSchemas.peopleGet,
	},
	'people.update': {
		input: PipelineCrmEndpointInputSchemas.peopleUpdate,
		output: PipelineCrmEndpointOutputSchemas.peopleUpdate,
	},
	'people.delete': {
		input: PipelineCrmEndpointInputSchemas.peopleDelete,
		output: PipelineCrmEndpointOutputSchemas.peopleDelete,
	},
	'people.autocomplete': {
		input: PipelineCrmEndpointInputSchemas.peopleAutocomplete,
		output: PipelineCrmEndpointOutputSchemas.peopleAutocomplete,
	},
	'people.listDeals': {
		input: PipelineCrmEndpointInputSchemas.peopleListDeals,
		output: PipelineCrmEndpointOutputSchemas.peopleListDeals,
	},
	'people.listNotes': {
		input: PipelineCrmEndpointInputSchemas.peopleListNotes,
		output: PipelineCrmEndpointOutputSchemas.peopleListNotes,
	},
	'companies.list': {
		input: PipelineCrmEndpointInputSchemas.companiesList,
		output: PipelineCrmEndpointOutputSchemas.companiesList,
	},
	'companies.create': {
		input: PipelineCrmEndpointInputSchemas.companiesCreate,
		output: PipelineCrmEndpointOutputSchemas.companiesCreate,
	},
	'companies.get': {
		input: PipelineCrmEndpointInputSchemas.companiesGet,
		output: PipelineCrmEndpointOutputSchemas.companiesGet,
	},
	'companies.update': {
		input: PipelineCrmEndpointInputSchemas.companiesUpdate,
		output: PipelineCrmEndpointOutputSchemas.companiesUpdate,
	},
	'companies.delete': {
		input: PipelineCrmEndpointInputSchemas.companiesDelete,
		output: PipelineCrmEndpointOutputSchemas.companiesDelete,
	},
	'companies.autocomplete': {
		input: PipelineCrmEndpointInputSchemas.companiesAutocomplete,
		output: PipelineCrmEndpointOutputSchemas.companiesAutocomplete,
	},
	'companies.listPeople': {
		input: PipelineCrmEndpointInputSchemas.companiesListPeople,
		output: PipelineCrmEndpointOutputSchemas.companiesListPeople,
	},
	'notes.list': {
		input: PipelineCrmEndpointInputSchemas.notesList,
		output: PipelineCrmEndpointOutputSchemas.notesList,
	},
	'notes.create': {
		input: PipelineCrmEndpointInputSchemas.notesCreate,
		output: PipelineCrmEndpointOutputSchemas.notesCreate,
	},
	'notes.get': {
		input: PipelineCrmEndpointInputSchemas.notesGet,
		output: PipelineCrmEndpointOutputSchemas.notesGet,
	},
	'notes.update': {
		input: PipelineCrmEndpointInputSchemas.notesUpdate,
		output: PipelineCrmEndpointOutputSchemas.notesUpdate,
	},
	'notes.delete': {
		input: PipelineCrmEndpointInputSchemas.notesDelete,
		output: PipelineCrmEndpointOutputSchemas.notesDelete,
	},
	'users.list': {
		input: PipelineCrmEndpointInputSchemas.usersList,
		output: PipelineCrmEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: PipelineCrmEndpointInputSchemas.usersGet,
		output: PipelineCrmEndpointOutputSchemas.usersGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pipelinecrmEndpointsNested
>;

export const pipelinecrmEndpointMeta = {
	'deals.list': {
		riskLevel: 'read',
		description: 'List deals with conditions filters and paging',
	},
	'deals.create': {
		riskLevel: 'write',
		description: 'Create a deal',
	},
	'deals.get': {
		riskLevel: 'read',
		description: 'Read one deal',
	},
	'deals.update': {
		riskLevel: 'write',
		description: 'Update a deal',
	},
	'deals.delete': {
		riskLevel: 'destructive',
		description: 'Delete a deal',
	},
	'deals.totalsByStage': {
		riskLevel: 'read',
		description: 'Deal count and value per stage',
	},
	'deals.listNotes': {
		riskLevel: 'read',
		description: 'List the activities of a deal',
	},
	'people.list': {
		riskLevel: 'read',
		description: 'List people with conditions filters and paging',
	},
	'people.create': {
		riskLevel: 'write',
		description: 'Create a person',
	},
	'people.get': {
		riskLevel: 'read',
		description: 'Read one person',
	},
	'people.update': {
		riskLevel: 'write',
		description: 'Update a person',
	},
	'people.delete': {
		riskLevel: 'destructive',
		description: 'Delete a person',
	},
	'people.autocomplete': {
		riskLevel: 'read',
		description: 'Search people by text for autocomplete',
	},
	'people.listDeals': {
		riskLevel: 'read',
		description: 'List the deals of a person',
	},
	'people.listNotes': {
		riskLevel: 'read',
		description: 'List the activities of a person',
	},
	'companies.list': {
		riskLevel: 'read',
		description: 'List companies with conditions filters and paging',
	},
	'companies.create': {
		riskLevel: 'write',
		description: 'Create a company',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Read one company',
	},
	'companies.update': {
		riskLevel: 'write',
		description: 'Update a company',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		description: 'Delete a company',
	},
	'companies.autocomplete': {
		riskLevel: 'read',
		description: 'Search companies by text for autocomplete',
	},
	'companies.listPeople': {
		riskLevel: 'read',
		description: 'List the people of a company',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'List activities filtered by deal, company or person',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Create an activity on a record',
	},
	'notes.get': {
		riskLevel: 'read',
		description: 'Read one activity',
	},
	'notes.update': {
		riskLevel: 'write',
		description: 'Update an activity',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		description: 'Delete an activity',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List the visible users',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one visible user',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof pipelinecrmEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const pipelinecrmAuthConfig = {
	api_key: {
		// PipelineCrm issues one API key per key record in the dashboard; no
		// account-level field is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePipelineCrmPlugin<T extends PipelineCrmPluginOptions> =
	CorsairPlugin<
		'pipelinecrm',
		typeof PipelinecrmSchema,
		typeof pipelinecrmEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof pipelinecrmAuthConfig
	>;

export type InternalPipelineCrmPlugin =
	BasePipelineCrmPlugin<PipelineCrmPluginOptions>;

export type ExternalPipelineCrmPlugin<T extends PipelineCrmPluginOptions> =
	BasePipelineCrmPlugin<T>;

export function pipelinecrm<const T extends PipelineCrmPluginOptions>(
	incomingOptions: PipelineCrmPluginOptions &
		T = {} as PipelineCrmPluginOptions & T,
): ExternalPipelineCrmPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pipelinecrm',
		authConfig: pipelinecrmAuthConfig,
		schema: PipelinecrmSchema,
		options: options,
		hooks: options.hooks,
		endpoints: pipelinecrmEndpointsNested,
		webhooks: {},
		endpointMeta: pipelinecrmEndpointMeta,
		endpointSchemas: pipelinecrmEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PipelineCrmKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('pipelinecrm', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPipelineCrmPlugin;
}

export { PipelineCrmAPIError } from './client';

export type {
	Company,
	Deal,
	Note,
	PaginationMeta,
	Person,
	PipelineCrmEndpointInputs,
	PipelineCrmEndpointOutputs,
	PipelineUser,
	StageTotal,
	UserRef,
} from './endpoints/types';
