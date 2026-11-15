import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Directory, Projects, Tasks, TimeEntries } from './endpoints';
import type {
	RocketlaneEndpointInputs,
	RocketlaneEndpointOutputs,
} from './endpoints/types';
import {
	RocketlaneEndpointInputSchemas,
	RocketlaneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RocketlaneSchema } from './schema';

export type RocketlanePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRocketlanePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof rocketlaneEndpointsNested>;
};

export type RocketlaneContext = CorsairPluginContext<
	typeof RocketlaneSchema,
	RocketlanePluginOptions
>;

export type RocketlaneKeyBuilderContext =
	KeyBuilderContext<RocketlanePluginOptions>;

export type RocketlaneBoundEndpoints = BindEndpoints<
	typeof rocketlaneEndpointsNested
>;

type RocketlaneEndpoint<K extends keyof RocketlaneEndpointOutputs> =
	CorsairEndpoint<
		RocketlaneContext,
		RocketlaneEndpointInputs[K],
		RocketlaneEndpointOutputs[K]
	>;

export type RocketlaneEndpoints = {
	tasksList: RocketlaneEndpoint<'tasksList'>;
	tasksGet: RocketlaneEndpoint<'tasksGet'>;
	tasksCreate: RocketlaneEndpoint<'tasksCreate'>;
	tasksUpdate: RocketlaneEndpoint<'tasksUpdate'>;
	tasksDelete: RocketlaneEndpoint<'tasksDelete'>;
	projectsList: RocketlaneEndpoint<'projectsList'>;
	projectsGet: RocketlaneEndpoint<'projectsGet'>;
	projectsCreate: RocketlaneEndpoint<'projectsCreate'>;
	projectsUpdate: RocketlaneEndpoint<'projectsUpdate'>;
	projectsDelete: RocketlaneEndpoint<'projectsDelete'>;
	projectsArchive: RocketlaneEndpoint<'projectsArchive'>;
	companiesList: RocketlaneEndpoint<'companiesList'>;
	companiesGet: RocketlaneEndpoint<'companiesGet'>;
	companiesCreate: RocketlaneEndpoint<'companiesCreate'>;
	companiesUpdate: RocketlaneEndpoint<'companiesUpdate'>;
	companiesDelete: RocketlaneEndpoint<'companiesDelete'>;
	usersList: RocketlaneEndpoint<'usersList'>;
	usersGet: RocketlaneEndpoint<'usersGet'>;
	timeEntriesList: RocketlaneEndpoint<'timeEntriesList'>;
	timeEntriesGet: RocketlaneEndpoint<'timeEntriesGet'>;
	timeEntriesCreate: RocketlaneEndpoint<'timeEntriesCreate'>;
	timeEntriesDelete: RocketlaneEndpoint<'timeEntriesDelete'>;
};

const rocketlaneEndpointsNested = {
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.remove,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
		archive: Projects.archive,
	},
	companies: {
		list: Directory.companiesList,
		get: Directory.companiesGet,
		create: Directory.companiesCreate,
		update: Directory.companiesUpdate,
		delete: Directory.companiesDelete,
	},
	users: {
		list: Directory.usersList,
		get: Directory.usersGet,
	},
	timeEntries: {
		list: TimeEntries.list,
		get: TimeEntries.get,
		create: TimeEntries.create,
		delete: TimeEntries.remove,
	},
} as const;

export const rocketlaneEndpointSchemas = {
	'tasks.list': {
		input: RocketlaneEndpointInputSchemas.tasksList,
		output: RocketlaneEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: RocketlaneEndpointInputSchemas.tasksGet,
		output: RocketlaneEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: RocketlaneEndpointInputSchemas.tasksCreate,
		output: RocketlaneEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: RocketlaneEndpointInputSchemas.tasksUpdate,
		output: RocketlaneEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: RocketlaneEndpointInputSchemas.tasksDelete,
		output: RocketlaneEndpointOutputSchemas.tasksDelete,
	},
	'projects.list': {
		input: RocketlaneEndpointInputSchemas.projectsList,
		output: RocketlaneEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: RocketlaneEndpointInputSchemas.projectsGet,
		output: RocketlaneEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: RocketlaneEndpointInputSchemas.projectsCreate,
		output: RocketlaneEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: RocketlaneEndpointInputSchemas.projectsUpdate,
		output: RocketlaneEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: RocketlaneEndpointInputSchemas.projectsDelete,
		output: RocketlaneEndpointOutputSchemas.projectsDelete,
	},
	'projects.archive': {
		input: RocketlaneEndpointInputSchemas.projectsArchive,
		output: RocketlaneEndpointOutputSchemas.projectsArchive,
	},
	'companies.list': {
		input: RocketlaneEndpointInputSchemas.companiesList,
		output: RocketlaneEndpointOutputSchemas.companiesList,
	},
	'companies.get': {
		input: RocketlaneEndpointInputSchemas.companiesGet,
		output: RocketlaneEndpointOutputSchemas.companiesGet,
	},
	'companies.create': {
		input: RocketlaneEndpointInputSchemas.companiesCreate,
		output: RocketlaneEndpointOutputSchemas.companiesCreate,
	},
	'companies.update': {
		input: RocketlaneEndpointInputSchemas.companiesUpdate,
		output: RocketlaneEndpointOutputSchemas.companiesUpdate,
	},
	'companies.delete': {
		input: RocketlaneEndpointInputSchemas.companiesDelete,
		output: RocketlaneEndpointOutputSchemas.companiesDelete,
	},
	'users.list': {
		input: RocketlaneEndpointInputSchemas.usersList,
		output: RocketlaneEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: RocketlaneEndpointInputSchemas.usersGet,
		output: RocketlaneEndpointOutputSchemas.usersGet,
	},
	'timeEntries.list': {
		input: RocketlaneEndpointInputSchemas.timeEntriesList,
		output: RocketlaneEndpointOutputSchemas.timeEntriesList,
	},
	'timeEntries.get': {
		input: RocketlaneEndpointInputSchemas.timeEntriesGet,
		output: RocketlaneEndpointOutputSchemas.timeEntriesGet,
	},
	'timeEntries.create': {
		input: RocketlaneEndpointInputSchemas.timeEntriesCreate,
		output: RocketlaneEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.delete': {
		input: RocketlaneEndpointInputSchemas.timeEntriesDelete,
		output: RocketlaneEndpointOutputSchemas.timeEntriesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof rocketlaneEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const rocketlaneEndpointMeta = {
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List tasks with filters for project, phase, status, assignee and date ranges, plus token paging',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Fetch one task by id with its project, phase, status, assignees, followers and custom fields',
	},
	'tasks.create': {
		riskLevel: 'write',
		description:
			'Create a task in a project with its dates, effort, status, phase, assignees and custom fields',
	},
	'tasks.update': {
		riskLevel: 'write',
		description:
			'Update a task: its name, description, dates, effort, progress, status or custom fields',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a task permanently; the API answers 204',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List projects with filters for company, customer, team member, status and financial ranges, plus token paging',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Fetch one project with its customer, owner, team members, status and financial fields',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project from a customer and an owner, with its dates, visibility and financial details; Rocketlane emails an invite to each team member added',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			'Update a project: its name, dates, visibility, owner, custom fields or financial figures',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project permanently; the API answers 204',
	},
	'projects.archive': {
		riskLevel: 'write',
		description:
			'Archive a project, which keeps its records but removes it from active lists',
	},
	'companies.list': {
		riskLevel: 'read',
		description: 'List customer companies with search and token paging',
	},
	'companies.get': {
		riskLevel: 'read',
		description:
			'Fetch one company with its owner, url, description and custom fields',
	},
	'companies.create': {
		riskLevel: 'write',
		description:
			'Create a customer company with its account owner, url and description',
	},
	'companies.update': {
		riskLevel: 'write',
		description: 'Update a company: its name, owner, url or description',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a company permanently; the API answers 204',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List the team members on the instance with token paging',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Fetch one user with their role, company, capacity and custom fields',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description:
			'List time entries with filters for date, project, task, user, billable and approval status',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description:
			'Fetch one time entry with its project, task, user, rates and approval state',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description:
			'Log time against a project or task: the date and minutes are required',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a time entry permanently; the API answers 204',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof rocketlaneEndpointsNested
>;

export type BaseRocketlanePlugin<T extends RocketlanePluginOptions> =
	CorsairPlugin<
		'rocketlane',
		typeof RocketlaneSchema,
		typeof rocketlaneEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalRocketlanePlugin =
	BaseRocketlanePlugin<RocketlanePluginOptions>;

export type ExternalRocketlanePlugin<T extends RocketlanePluginOptions> =
	BaseRocketlanePlugin<T>;

export function rocketlane<const T extends RocketlanePluginOptions>(
	incomingOptions: RocketlanePluginOptions & T = {} as RocketlanePluginOptions &
		T,
): ExternalRocketlanePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'rocketlane',
		schema: RocketlaneSchema,
		options: options,
		hooks: options.hooks,
		endpoints: rocketlaneEndpointsNested,
		webhooks: {},
		endpointMeta: rocketlaneEndpointMeta,
		endpointSchemas: rocketlaneEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RocketlaneKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('rocketlane', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRocketlanePlugin;
}

export { RocketlaneAPIError } from './client';

export type {
	CompaniesCreateInput,
	CompaniesCreateResponse,
	CompaniesDeleteInput,
	CompaniesDeleteResponse,
	CompaniesGetInput,
	CompaniesGetResponse,
	CompaniesListInput,
	CompaniesListResponse,
	CompaniesUpdateInput,
	CompaniesUpdateResponse,
	ProjectsArchiveInput,
	ProjectsArchiveResponse,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsDeleteInput,
	ProjectsDeleteResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsUpdateInput,
	ProjectsUpdateResponse,
	RocketlaneCompany,
	RocketlaneEndpointInputs,
	RocketlaneEndpointOutputs,
	RocketlaneFieldValue,
	RocketlaneProject,
	RocketlaneTask,
	RocketlaneTimeEntry,
	RocketlaneUser,
	RocketlaneUserRef,
	TasksCreateInput,
	TasksCreateResponse,
	TasksDeleteInput,
	TasksDeleteResponse,
	TasksGetInput,
	TasksGetResponse,
	TasksListInput,
	TasksListResponse,
	TasksUpdateInput,
	TasksUpdateResponse,
	TimeEntriesCreateInput,
	TimeEntriesCreateResponse,
	TimeEntriesDeleteInput,
	TimeEntriesDeleteResponse,
	TimeEntriesGetInput,
	TimeEntriesGetResponse,
	TimeEntriesListInput,
	TimeEntriesListResponse,
	UsersGetInput,
	UsersGetResponse,
	UsersListInput,
	UsersListResponse,
} from './endpoints/types';
