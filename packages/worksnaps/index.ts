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
import { Assignments, Projects, Tasks, TimeEntries, Users } from './endpoints';
import type {
	WorksnapsEndpointInputs,
	WorksnapsEndpointOutputs,
} from './endpoints/types';
import {
	WorksnapsEndpointInputSchemas,
	WorksnapsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { WorksnapsSchema } from './schema';

export type WorksnapsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWorksnapsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof worksnapsEndpointsNested>;
};

export type WorksnapsContext = CorsairPluginContext<
	typeof WorksnapsSchema,
	WorksnapsPluginOptions
>;

export type WorksnapsKeyBuilderContext =
	KeyBuilderContext<WorksnapsPluginOptions>;

export type WorksnapsBoundEndpoints = BindEndpoints<
	typeof worksnapsEndpointsNested
>;

type WorksnapsEndpoint<K extends keyof WorksnapsEndpointOutputs> =
	CorsairEndpoint<
		WorksnapsContext,
		WorksnapsEndpointInputs[K],
		WorksnapsEndpointOutputs[K]
	>;

export type WorksnapsEndpoints = {
	projectsList: WorksnapsEndpoint<'projectsList'>;
	projectsGet: WorksnapsEndpoint<'projectsGet'>;
	projectsCreate: WorksnapsEndpoint<'projectsCreate'>;
	projectsUpdate: WorksnapsEndpoint<'projectsUpdate'>;
	projectsDelete: WorksnapsEndpoint<'projectsDelete'>;
	tasksList: WorksnapsEndpoint<'tasksList'>;
	tasksGet: WorksnapsEndpoint<'tasksGet'>;
	tasksCreate: WorksnapsEndpoint<'tasksCreate'>;
	tasksUpdate: WorksnapsEndpoint<'tasksUpdate'>;
	tasksDelete: WorksnapsEndpoint<'tasksDelete'>;
	timeEntriesList: WorksnapsEndpoint<'timeEntriesList'>;
	timeEntriesByUser: WorksnapsEndpoint<'timeEntriesByUser'>;
	timeEntriesGet: WorksnapsEndpoint<'timeEntriesGet'>;
	timeEntriesCreate: WorksnapsEndpoint<'timeEntriesCreate'>;
	timeEntriesUpdate: WorksnapsEndpoint<'timeEntriesUpdate'>;
	timeEntriesDelete: WorksnapsEndpoint<'timeEntriesDelete'>;
	taskAssignmentsList: WorksnapsEndpoint<'taskAssignmentsList'>;
	taskAssignmentsCreate: WorksnapsEndpoint<'taskAssignmentsCreate'>;
	taskAssignmentsDelete: WorksnapsEndpoint<'taskAssignmentsDelete'>;
	userAssignmentsList: WorksnapsEndpoint<'userAssignmentsList'>;
	userAssignmentsGet: WorksnapsEndpoint<'userAssignmentsGet'>;
	userAssignmentsCreate: WorksnapsEndpoint<'userAssignmentsCreate'>;
	userAssignmentsUpdate: WorksnapsEndpoint<'userAssignmentsUpdate'>;
	usersList: WorksnapsEndpoint<'usersList'>;
	usersGet: WorksnapsEndpoint<'usersGet'>;
	usersCreate: WorksnapsEndpoint<'usersCreate'>;
	usersUpdate: WorksnapsEndpoint<'usersUpdate'>;
	meGet: WorksnapsEndpoint<'meGet'>;
	projectReport: WorksnapsEndpoint<'projectReport'>;
	summaryReport: WorksnapsEndpoint<'summaryReport'>;
};

const worksnapsEndpointsNested = {
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.remove,
	},
	timeEntries: {
		list: TimeEntries.list,
		byUser: TimeEntries.byUser,
		get: TimeEntries.get,
		create: TimeEntries.create,
		update: TimeEntries.update,
		delete: TimeEntries.remove,
	},
	taskAssignments: {
		list: Assignments.taskList,
		create: Assignments.taskCreate,
		delete: Assignments.taskRemove,
	},
	userAssignments: {
		list: Assignments.userList,
		get: Assignments.userGet,
		create: Assignments.userCreate,
		update: Assignments.userUpdate,
	},
	users: {
		list: Users.list,
		get: Users.get,
		create: Users.create,
		update: Users.update,
		me: Users.me,
	},
	reports: {
		project: Users.projectReport,
		summary: Users.summaryReport,
	},
} as const;

export const worksnapsEndpointSchemas = {
	'projects.list': {
		input: WorksnapsEndpointInputSchemas.projectsList,
		output: WorksnapsEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: WorksnapsEndpointInputSchemas.projectsGet,
		output: WorksnapsEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: WorksnapsEndpointInputSchemas.projectsCreate,
		output: WorksnapsEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: WorksnapsEndpointInputSchemas.projectsUpdate,
		output: WorksnapsEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: WorksnapsEndpointInputSchemas.projectsDelete,
		output: WorksnapsEndpointOutputSchemas.projectsDelete,
	},
	'tasks.list': {
		input: WorksnapsEndpointInputSchemas.tasksList,
		output: WorksnapsEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: WorksnapsEndpointInputSchemas.tasksGet,
		output: WorksnapsEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: WorksnapsEndpointInputSchemas.tasksCreate,
		output: WorksnapsEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: WorksnapsEndpointInputSchemas.tasksUpdate,
		output: WorksnapsEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: WorksnapsEndpointInputSchemas.tasksDelete,
		output: WorksnapsEndpointOutputSchemas.tasksDelete,
	},
	'timeEntries.list': {
		input: WorksnapsEndpointInputSchemas.timeEntriesList,
		output: WorksnapsEndpointOutputSchemas.timeEntriesList,
	},
	'timeEntries.byUser': {
		input: WorksnapsEndpointInputSchemas.timeEntriesByUser,
		output: WorksnapsEndpointOutputSchemas.timeEntriesByUser,
	},
	'timeEntries.get': {
		input: WorksnapsEndpointInputSchemas.timeEntriesGet,
		output: WorksnapsEndpointOutputSchemas.timeEntriesGet,
	},
	'timeEntries.create': {
		input: WorksnapsEndpointInputSchemas.timeEntriesCreate,
		output: WorksnapsEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.update': {
		input: WorksnapsEndpointInputSchemas.timeEntriesUpdate,
		output: WorksnapsEndpointOutputSchemas.timeEntriesUpdate,
	},
	'timeEntries.delete': {
		input: WorksnapsEndpointInputSchemas.timeEntriesDelete,
		output: WorksnapsEndpointOutputSchemas.timeEntriesDelete,
	},
	'taskAssignments.list': {
		input: WorksnapsEndpointInputSchemas.taskAssignmentsList,
		output: WorksnapsEndpointOutputSchemas.taskAssignmentsList,
	},
	'taskAssignments.create': {
		input: WorksnapsEndpointInputSchemas.taskAssignmentsCreate,
		output: WorksnapsEndpointOutputSchemas.taskAssignmentsCreate,
	},
	'taskAssignments.delete': {
		input: WorksnapsEndpointInputSchemas.taskAssignmentsDelete,
		output: WorksnapsEndpointOutputSchemas.taskAssignmentsDelete,
	},
	'userAssignments.list': {
		input: WorksnapsEndpointInputSchemas.userAssignmentsList,
		output: WorksnapsEndpointOutputSchemas.userAssignmentsList,
	},
	'userAssignments.get': {
		input: WorksnapsEndpointInputSchemas.userAssignmentsGet,
		output: WorksnapsEndpointOutputSchemas.userAssignmentsGet,
	},
	'userAssignments.create': {
		input: WorksnapsEndpointInputSchemas.userAssignmentsCreate,
		output: WorksnapsEndpointOutputSchemas.userAssignmentsCreate,
	},
	'userAssignments.update': {
		input: WorksnapsEndpointInputSchemas.userAssignmentsUpdate,
		output: WorksnapsEndpointOutputSchemas.userAssignmentsUpdate,
	},
	'users.list': {
		input: WorksnapsEndpointInputSchemas.usersList,
		output: WorksnapsEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: WorksnapsEndpointInputSchemas.usersGet,
		output: WorksnapsEndpointOutputSchemas.usersGet,
	},
	'users.create': {
		input: WorksnapsEndpointInputSchemas.usersCreate,
		output: WorksnapsEndpointOutputSchemas.usersCreate,
	},
	'users.update': {
		input: WorksnapsEndpointInputSchemas.usersUpdate,
		output: WorksnapsEndpointOutputSchemas.usersUpdate,
	},
	'users.me': {
		input: WorksnapsEndpointInputSchemas.meGet,
		output: WorksnapsEndpointOutputSchemas.meGet,
	},
	'reports.project': {
		input: WorksnapsEndpointInputSchemas.projectReport,
		output: WorksnapsEndpointOutputSchemas.projectReport,
	},
	'reports.summary': {
		input: WorksnapsEndpointInputSchemas.summaryReport,
		output: WorksnapsEndpointOutputSchemas.summaryReport,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof worksnapsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const worksnapsEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description:
			'List the projects the token is involved in, optionally with each project members',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project with its name and description',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project with a name and description',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			'Change a project name or description, or restore an archived project',
	},
	'projects.delete': {
		riskLevel: 'write',
		description:
			'Archive a project; it is not erased and projects.update with status active restores it',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List the tasks in a project',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Read one task',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task in a project',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Change a task name or description',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a task with the time logged against it; this cannot be undone',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description:
			'List the time some users logged on a project between two Unix timestamps',
	},
	'timeEntries.byUser': {
		riskLevel: 'read',
		description:
			'List the time one user logged on a project between two Unix timestamps',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description:
			'Read one time entry, optionally with full-resolution screenshot URLs',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description:
			'Log offline time for yourself on an assigned task, from a Unix start time and a duration in minutes',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description: 'Move a time entry to another task or change its comment',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		description: 'Delete a logged time entry; this cannot be undone',
	},
	'taskAssignments.list': {
		riskLevel: 'read',
		description: 'List which users are assigned to which tasks in a project',
	},
	'taskAssignments.create': {
		riskLevel: 'write',
		description: 'Assign a user to a task',
	},
	'taskAssignments.delete': {
		riskLevel: 'destructive',
		description: 'Remove a user from a task',
	},
	'userAssignments.list': {
		riskLevel: 'read',
		description: 'List the members of a project with their roles and rates',
	},
	'userAssignments.get': {
		riskLevel: 'read',
		description: 'Read one project membership',
	},
	'userAssignments.create': {
		riskLevel: 'write',
		description:
			'Add a member to a project with a role, rate and time-logging windows',
	},
	'userAssignments.update': {
		riskLevel: 'write',
		description: 'Change a member role, rate or time-logging windows',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List the users on the account',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one user',
	},
	'users.create': {
		riskLevel: 'write',
		description:
			'Create a user; a privileged call that needs the partner API token rather than a normal one',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Change a user email, name or timezone',
	},
	'users.me': {
		riskLevel: 'read',
		description:
			'Read the account behind the token (without the token itself), which is the cheapest way to check it',
	},
	'reports.project': {
		riskLevel: 'read',
		description:
			'Read time per user and task in one project over at most 30 days',
	},
	'reports.summary': {
		riskLevel: 'read',
		description:
			'Read time by user, project, task and day across the projects you manage, over at most 30 days',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof worksnapsEndpointsNested
>;

export type BaseWorksnapsPlugin<T extends WorksnapsPluginOptions> =
	CorsairPlugin<
		'worksnaps',
		typeof WorksnapsSchema,
		typeof worksnapsEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalWorksnapsPlugin =
	BaseWorksnapsPlugin<WorksnapsPluginOptions>;

export type ExternalWorksnapsPlugin<T extends WorksnapsPluginOptions> =
	BaseWorksnapsPlugin<T>;

export function worksnaps<const T extends WorksnapsPluginOptions>(
	incomingOptions: WorksnapsPluginOptions & T = {} as WorksnapsPluginOptions &
		T,
): ExternalWorksnapsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'worksnaps',
		schema: WorksnapsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: worksnapsEndpointsNested,
		webhooks: {},
		endpointMeta: worksnapsEndpointMeta,
		endpointSchemas: worksnapsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: WorksnapsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('worksnaps', ctx.authType ?? 'api_key');
		},
	} satisfies InternalWorksnapsPlugin;
}

export {
	basicAuthHeader,
	isWorksnapsFailure,
	segment,
	WORKSNAPS_AUTH_NOTE,
	WORKSNAPS_BASE,
	WorksnapsAPIError,
} from './client';
export type {
	DeleteResponse,
	MeInput,
	MeResponse,
	ProjectReportInput,
	ProjectReportResponse,
	ProjectResponse,
	ProjectsCreateInput,
	ProjectsDeleteInput,
	ProjectsGetInput,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsUpdateInput,
	SummaryReportInput,
	SummaryReportResponse,
	TaskAssignmentResponse,
	TaskAssignmentsCreateInput,
	TaskAssignmentsDeleteInput,
	TaskAssignmentsListInput,
	TaskAssignmentsListResponse,
	TaskResponse,
	TasksCreateInput,
	TasksDeleteInput,
	TasksGetInput,
	TasksListInput,
	TasksListResponse,
	TasksUpdateInput,
	TimeEntriesByUserInput,
	TimeEntriesCreateInput,
	TimeEntriesDeleteInput,
	TimeEntriesGetInput,
	TimeEntriesListInput,
	TimeEntriesListResponse,
	TimeEntriesUpdateInput,
	TimeEntryResponse,
	UserAssignmentResponse,
	UserAssignmentsCreateInput,
	UserAssignmentsGetInput,
	UserAssignmentsListInput,
	UserAssignmentsListResponse,
	UserAssignmentsUpdateInput,
	UserResponse,
	UsersCreateInput,
	UsersGetInput,
	UsersListInput,
	UsersListResponse,
	UsersUpdateInput,
	WorksnapsEndpointInputs,
	WorksnapsEndpointOutputs,
	WorksnapsProject,
	WorksnapsTask,
	WorksnapsTaskAssignment,
	WorksnapsTimeEntry,
	WorksnapsUser,
	WorksnapsUserAssignment,
} from './endpoints/types';

export type { XmlNode, XmlValue } from './xml';
export {
	decodeXmlText,
	escapeXmlAttribute,
	escapeXmlText,
	parseXml,
	parseXmlValue,
	toValue,
	toXml,
} from './xml';
