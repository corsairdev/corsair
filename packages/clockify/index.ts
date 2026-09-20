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
import { Projects, Tasks, TimeEntries, Workspaces } from './endpoints';
import type {
	ClockifyEndpointInputs,
	ClockifyEndpointOutputs,
} from './endpoints/types';
import {
	ClockifyEndpointInputSchemas,
	ClockifyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClockifySchema } from './schema';

export type ClockifyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clockifyEndpointsNested>;
};

export type ClockifyContext = CorsairPluginContext<
	typeof ClockifySchema,
	ClockifyPluginOptions
>;

export type ClockifyKeyBuilderContext =
	KeyBuilderContext<ClockifyPluginOptions>;

export type ClockifyBoundEndpoints = BindEndpoints<
	typeof clockifyEndpointsNested
>;

type ClockifyEndpoint<K extends keyof ClockifyEndpointOutputs> =
	CorsairEndpoint<
		ClockifyContext,
		ClockifyEndpointInputs[K],
		ClockifyEndpointOutputs[K]
	>;

export type ClockifyEndpoints = {
	workspacesList: ClockifyEndpoint<'workspacesList'>;
	projectsList: ClockifyEndpoint<'projectsList'>;
	tasksList: ClockifyEndpoint<'tasksList'>;
	timeEntriesCreate: ClockifyEndpoint<'timeEntriesCreate'>;
	timeEntriesList: ClockifyEndpoint<'timeEntriesList'>;
};

const clockifyEndpointsNested = {
	workspaces: {
		list: Workspaces.list,
	},
	projects: {
		list: Projects.list,
	},
	tasks: {
		list: Tasks.list,
	},
	timeEntries: {
		create: TimeEntries.create,
		list: TimeEntries.list,
	},
} as const;

export const clockifyEndpointSchemas = {
	'workspaces.list': {
		input: ClockifyEndpointInputSchemas.workspacesList,
		output: ClockifyEndpointOutputSchemas.workspacesList,
	},
	'projects.list': {
		input: ClockifyEndpointInputSchemas.projectsList,
		output: ClockifyEndpointOutputSchemas.projectsList,
	},
	'tasks.list': {
		input: ClockifyEndpointInputSchemas.tasksList,
		output: ClockifyEndpointOutputSchemas.tasksList,
	},
	'timeEntries.create': {
		input: ClockifyEndpointInputSchemas.timeEntriesCreate,
		output: ClockifyEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.list': {
		input: ClockifyEndpointInputSchemas.timeEntriesList,
		output: ClockifyEndpointOutputSchemas.timeEntriesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clockifyEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const clockifyEndpointMeta = {
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List all workspaces',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects in a workspace',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks for a project in a workspace',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description: 'Create a new time entry',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description: 'List time entries for a user in a workspace',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof clockifyEndpointsNested>;

export const clockifyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseClockifyPlugin<T extends ClockifyPluginOptions> = CorsairPlugin<
	'clockify',
	typeof ClockifySchema,
	typeof clockifyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalClockifyPlugin = BaseClockifyPlugin<ClockifyPluginOptions>;

export type ExternalClockifyPlugin<T extends ClockifyPluginOptions> =
	BaseClockifyPlugin<T>;

export function clockify<const T extends ClockifyPluginOptions>(
	incomingOptions: ClockifyPluginOptions & T = {} as ClockifyPluginOptions & T,
): ExternalClockifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'clockify',
		authConfig: clockifyAuthConfig,
		schema: ClockifySchema,
		options: options,
		endpoints: clockifyEndpointsNested,
		webhooks: {},
		endpointMeta: clockifyEndpointMeta,
		endpointSchemas: clockifyEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClockifyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				if (!res) {
					throw new AuthMissingError('clockify', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('clockify', 'api_key');
		},
	} satisfies InternalClockifyPlugin;
}

export type {
	ClockifyEndpointInputs,
	ClockifyEndpointOutputs,
	ProjectsListInput,
	ProjectsListOutput,
	TasksListInput,
	TasksListOutput,
	TimeEntriesCreateInput,
	TimeEntriesCreateOutput,
	TimeEntriesListInput,
	TimeEntriesListOutput,
	WorkspacesListInput,
	WorkspacesListOutput,
} from './endpoints/types';
