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
import { Endpoints } from './endpoints';
import type {
	TeamcampEndpointInputs,
	TeamcampEndpointOutputs,
} from './endpoints/types';
import {
	TeamcampEndpointInputSchemas,
	TeamcampEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TeamcampSchema } from './schema';

export type TeamcampPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTeamcampPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof teamcampEndpointsNested>;
};

export type TeamcampContext = CorsairPluginContext<
	typeof TeamcampSchema,
	TeamcampPluginOptions
>;

export type TeamcampKeyBuilderContext =
	KeyBuilderContext<TeamcampPluginOptions>;

export type TeamcampBoundEndpoints = BindEndpoints<
	typeof teamcampEndpointsNested
>;

type TeamcampEndpoint<K extends keyof TeamcampEndpointOutputs> =
	CorsairEndpoint<
		TeamcampContext,
		TeamcampEndpointInputs[K],
		TeamcampEndpointOutputs[K]
	>;

export type TeamcampEndpoints = {
	accountVerify: TeamcampEndpoint<'accountVerify'>;
	usersList: TeamcampEndpoint<'usersList'>;
	customersList: TeamcampEndpoint<'customersList'>;
	projectsList: TeamcampEndpoint<'projectsList'>;
	projectsGet: TeamcampEndpoint<'projectsGet'>;
	projectsCreate: TeamcampEndpoint<'projectsCreate'>;
	projectsUpdate: TeamcampEndpoint<'projectsUpdate'>;
	projectsDelete: TeamcampEndpoint<'projectsDelete'>;
	groupsList: TeamcampEndpoint<'groupsList'>;
	tasksList: TeamcampEndpoint<'tasksList'>;
	tasksGet: TeamcampEndpoint<'tasksGet'>;
	tasksCreate: TeamcampEndpoint<'tasksCreate'>;
};

const teamcampEndpointsNested = {
	account: {
		verify: Endpoints.accountVerify,
	},
	users: {
		list: Endpoints.usersList,
	},
	customers: {
		list: Endpoints.customersList,
	},
	projects: {
		list: Endpoints.projectsList,
		get: Endpoints.projectsGet,
		create: Endpoints.projectsCreate,
		update: Endpoints.projectsUpdate,
		delete: Endpoints.projectsDelete,
	},
	groups: {
		list: Endpoints.groupsList,
	},
	tasks: {
		list: Endpoints.tasksList,
		get: Endpoints.tasksGet,
		create: Endpoints.tasksCreate,
	},
} as const;

export const teamcampEndpointSchemas = {
	'account.verify': {
		input: TeamcampEndpointInputSchemas.accountVerify,
		output: TeamcampEndpointOutputSchemas.accountVerify,
	},
	'users.list': {
		input: TeamcampEndpointInputSchemas.usersList,
		output: TeamcampEndpointOutputSchemas.usersList,
	},
	'customers.list': {
		input: TeamcampEndpointInputSchemas.customersList,
		output: TeamcampEndpointOutputSchemas.customersList,
	},
	'projects.list': {
		input: TeamcampEndpointInputSchemas.projectsList,
		output: TeamcampEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: TeamcampEndpointInputSchemas.projectsGet,
		output: TeamcampEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: TeamcampEndpointInputSchemas.projectsCreate,
		output: TeamcampEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: TeamcampEndpointInputSchemas.projectsUpdate,
		output: TeamcampEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: TeamcampEndpointInputSchemas.projectsDelete,
		output: TeamcampEndpointOutputSchemas.projectsDelete,
	},
	'groups.list': {
		input: TeamcampEndpointInputSchemas.groupsList,
		output: TeamcampEndpointOutputSchemas.groupsList,
	},
	'tasks.list': {
		input: TeamcampEndpointInputSchemas.tasksList,
		output: TeamcampEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: TeamcampEndpointInputSchemas.tasksGet,
		output: TeamcampEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: TeamcampEndpointInputSchemas.tasksCreate,
		output: TeamcampEndpointOutputSchemas.tasksCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof teamcampEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const teamcampEndpointMeta = {
	'account.verify': {
		riskLevel: 'read',
		description:
			'Read the workspace the key belongs to, which also confirms the key is valid',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List the workspace members, with their role, timezone and last seen time',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'List the customers a project can be billed to, with their clients',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects in the workspace, by id and name',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Read one project: its members, owner, dates and workflow statuses, which a task create needs for its status id',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project, optionally from a template and with a customer and dates',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Change a project name, description, dates or customer',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a project. It is archived rather than erased: it leaves the project list, but a read by id still returns it marked archived',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List the task groups of a project, by id and name',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List the tasks of a project, optionally only the completed or only the open ones',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Read one task, with its assignees, labels, files and comments',
	},
	'tasks.create': {
		riskLevel: 'write',
		description:
			'Create a task in a project, with a priority, due date, assignees, group, status, milestone, estimate and attachments',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof teamcampEndpointsNested>;

export type BaseTeamcampPlugin<T extends TeamcampPluginOptions> = CorsairPlugin<
	'teamcamp',
	typeof TeamcampSchema,
	typeof teamcampEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTeamcampPlugin = BaseTeamcampPlugin<TeamcampPluginOptions>;

export type ExternalTeamcampPlugin<T extends TeamcampPluginOptions> =
	BaseTeamcampPlugin<T>;

export function teamcamp<const T extends TeamcampPluginOptions>(
	incomingOptions: TeamcampPluginOptions & T = {} as TeamcampPluginOptions & T,
): ExternalTeamcampPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'teamcamp',
		schema: TeamcampSchema,
		options: options,
		hooks: options.hooks,
		endpoints: teamcampEndpointsNested,
		webhooks: {},
		endpointMeta: teamcampEndpointMeta,
		endpointSchemas: teamcampEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TeamcampKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('teamcamp', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTeamcampPlugin;
}

export { TeamcampAPIError } from './client';

export type {
	CreateProjectInput,
	CreateTaskInput,
	DeleteProjectInput,
	DeleteProjectResponse,
	ListCustomersInput,
	ListGroupsInput,
	ListProjectsInput,
	ListTasksInput,
	ListUsersInput,
	TeamcampCustomer,
	TeamcampEndpointInputs,
	TeamcampEndpointOutputs,
	TeamcampError,
	TeamcampGroup,
	TeamcampProject,
	TeamcampProjectSummary,
	TeamcampTask,
	TeamcampTaskComment,
	TeamcampTaskSummary,
	TeamcampUser,
	TeamcampWorkspace,
	UpdateProjectInput,
	VerifyKeyInput,
} from './endpoints/types';
