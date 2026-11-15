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
import { Activities, Deals, Organizations, Persons, Tasks } from './endpoints';
import type {
	PipedriveEndpointInputs,
	PipedriveEndpointOutputs,
} from './endpoints/types';
import {
	PipedriveEndpointInputSchemas,
	PipedriveEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PipedriveSchema } from './schema';

export type PipedrivePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalPipedrivePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pipedriveEndpointsNested>;
};

export type PipedriveContext = CorsairPluginContext<
	typeof PipedriveSchema,
	PipedrivePluginOptions
>;
export type PipedriveKeyBuilderContext =
	KeyBuilderContext<PipedrivePluginOptions>;
export type PipedriveBoundEndpoints = BindEndpoints<
	typeof pipedriveEndpointsNested
>;

type PipedriveEndpoint<K extends keyof PipedriveEndpointOutputs> =
	CorsairEndpoint<
		PipedriveContext,
		PipedriveEndpointInputs[K],
		PipedriveEndpointOutputs[K]
	>;

export type PipedriveEndpoints = {
	dealList: PipedriveEndpoint<'dealList'>;
	dealGet: PipedriveEndpoint<'dealGet'>;
	dealCreate: PipedriveEndpoint<'dealCreate'>;
	dealUpdate: PipedriveEndpoint<'dealUpdate'>;
	dealDelete: PipedriveEndpoint<'dealDelete'>;
	personList: PipedriveEndpoint<'personList'>;
	personGet: PipedriveEndpoint<'personGet'>;
	personCreate: PipedriveEndpoint<'personCreate'>;
	personUpdate: PipedriveEndpoint<'personUpdate'>;
	personDelete: PipedriveEndpoint<'personDelete'>;
	organizationList: PipedriveEndpoint<'organizationList'>;
	organizationGet: PipedriveEndpoint<'organizationGet'>;
	organizationCreate: PipedriveEndpoint<'organizationCreate'>;
	organizationUpdate: PipedriveEndpoint<'organizationUpdate'>;
	organizationDelete: PipedriveEndpoint<'organizationDelete'>;
	activityList: PipedriveEndpoint<'activityList'>;
	activityGet: PipedriveEndpoint<'activityGet'>;
	activityCreate: PipedriveEndpoint<'activityCreate'>;
	activityUpdate: PipedriveEndpoint<'activityUpdate'>;
	activityDelete: PipedriveEndpoint<'activityDelete'>;
	taskList: PipedriveEndpoint<'taskList'>;
	taskGet: PipedriveEndpoint<'taskGet'>;
	taskCreate: PipedriveEndpoint<'taskCreate'>;
	taskUpdate: PipedriveEndpoint<'taskUpdate'>;
	taskDelete: PipedriveEndpoint<'taskDelete'>;
};

const pipedriveEndpointsNested = {
	deals: {
		list: Deals.list,
		get: Deals.get,
		create: Deals.create,
		update: Deals.update,
		delete: Deals.delete,
	},
	persons: {
		list: Persons.list,
		get: Persons.get,
		create: Persons.create,
		update: Persons.update,
		delete: Persons.delete,
	},
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
		create: Organizations.create,
		update: Organizations.update,
		delete: Organizations.delete,
	},
	activities: {
		list: Activities.list,
		get: Activities.get,
		create: Activities.create,
		update: Activities.update,
		delete: Activities.delete,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.delete,
	},
} as const;

export const pipedriveEndpointSchemas = {
	'deals.list': {
		input: PipedriveEndpointInputSchemas.dealList,
		output: PipedriveEndpointOutputSchemas.dealList,
	},
	'deals.get': {
		input: PipedriveEndpointInputSchemas.dealGet,
		output: PipedriveEndpointOutputSchemas.dealGet,
	},
	'deals.create': {
		input: PipedriveEndpointInputSchemas.dealCreate,
		output: PipedriveEndpointOutputSchemas.dealCreate,
	},
	'deals.update': {
		input: PipedriveEndpointInputSchemas.dealUpdate,
		output: PipedriveEndpointOutputSchemas.dealUpdate,
	},
	'deals.delete': {
		input: PipedriveEndpointInputSchemas.dealDelete,
		output: PipedriveEndpointOutputSchemas.dealDelete,
	},
	'persons.list': {
		input: PipedriveEndpointInputSchemas.personList,
		output: PipedriveEndpointOutputSchemas.personList,
	},
	'persons.get': {
		input: PipedriveEndpointInputSchemas.personGet,
		output: PipedriveEndpointOutputSchemas.personGet,
	},
	'persons.create': {
		input: PipedriveEndpointInputSchemas.personCreate,
		output: PipedriveEndpointOutputSchemas.personCreate,
	},
	'persons.update': {
		input: PipedriveEndpointInputSchemas.personUpdate,
		output: PipedriveEndpointOutputSchemas.personUpdate,
	},
	'persons.delete': {
		input: PipedriveEndpointInputSchemas.personDelete,
		output: PipedriveEndpointOutputSchemas.personDelete,
	},
	'organizations.list': {
		input: PipedriveEndpointInputSchemas.organizationList,
		output: PipedriveEndpointOutputSchemas.organizationList,
	},
	'organizations.get': {
		input: PipedriveEndpointInputSchemas.organizationGet,
		output: PipedriveEndpointOutputSchemas.organizationGet,
	},
	'organizations.create': {
		input: PipedriveEndpointInputSchemas.organizationCreate,
		output: PipedriveEndpointOutputSchemas.organizationCreate,
	},
	'organizations.update': {
		input: PipedriveEndpointInputSchemas.organizationUpdate,
		output: PipedriveEndpointOutputSchemas.organizationUpdate,
	},
	'organizations.delete': {
		input: PipedriveEndpointInputSchemas.organizationDelete,
		output: PipedriveEndpointOutputSchemas.organizationDelete,
	},
	'activities.list': {
		input: PipedriveEndpointInputSchemas.activityList,
		output: PipedriveEndpointOutputSchemas.activityList,
	},
	'activities.get': {
		input: PipedriveEndpointInputSchemas.activityGet,
		output: PipedriveEndpointOutputSchemas.activityGet,
	},
	'activities.create': {
		input: PipedriveEndpointInputSchemas.activityCreate,
		output: PipedriveEndpointOutputSchemas.activityCreate,
	},
	'activities.update': {
		input: PipedriveEndpointInputSchemas.activityUpdate,
		output: PipedriveEndpointOutputSchemas.activityUpdate,
	},
	'activities.delete': {
		input: PipedriveEndpointInputSchemas.activityDelete,
		output: PipedriveEndpointOutputSchemas.activityDelete,
	},
	'tasks.list': {
		input: PipedriveEndpointInputSchemas.taskList,
		output: PipedriveEndpointOutputSchemas.taskList,
	},
	'tasks.get': {
		input: PipedriveEndpointInputSchemas.taskGet,
		output: PipedriveEndpointOutputSchemas.taskGet,
	},
	'tasks.create': {
		input: PipedriveEndpointInputSchemas.taskCreate,
		output: PipedriveEndpointOutputSchemas.taskCreate,
	},
	'tasks.update': {
		input: PipedriveEndpointInputSchemas.taskUpdate,
		output: PipedriveEndpointOutputSchemas.taskUpdate,
	},
	'tasks.delete': {
		input: PipedriveEndpointInputSchemas.taskDelete,
		output: PipedriveEndpointOutputSchemas.taskDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pipedriveEndpointsNested
>;

const pipedriveEndpointMeta = {
	'deals.list': {
		riskLevel: 'read',
		description: 'List deals with cursor pagination and filters',
	},
	'deals.get': {
		riskLevel: 'read',
		description: 'Get a deal by its numeric ID',
	},
	'deals.create': { riskLevel: 'write', description: 'Create a deal' },
	'deals.update': { riskLevel: 'write', description: 'Update a deal' },
	'deals.delete': { riskLevel: 'destructive', description: 'Delete a deal' },
	'persons.list': {
		riskLevel: 'read',
		description: 'List persons with cursor pagination and filters',
	},
	'persons.get': {
		riskLevel: 'read',
		description: 'Get a person by its numeric ID',
	},
	'persons.create': { riskLevel: 'write', description: 'Create a person' },
	'persons.update': { riskLevel: 'write', description: 'Update a person' },
	'persons.delete': {
		riskLevel: 'destructive',
		description: 'Delete a person',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations with cursor pagination and filters',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization by its numeric ID',
	},
	'organizations.create': {
		riskLevel: 'write',
		description: 'Create an organization',
	},
	'organizations.update': {
		riskLevel: 'write',
		description: 'Update an organization',
	},
	'organizations.delete': {
		riskLevel: 'destructive',
		description: 'Delete an organization',
	},
	'activities.list': {
		riskLevel: 'read',
		description: 'List activities with cursor pagination and filters',
	},
	'activities.get': {
		riskLevel: 'read',
		description: 'Get an activity by its numeric ID',
	},
	'activities.create': {
		riskLevel: 'write',
		description: 'Create a calendar activity',
	},
	'activities.update': {
		riskLevel: 'write',
		description: 'Update a calendar activity',
	},
	'activities.delete': {
		riskLevel: 'destructive',
		description: 'Mark an activity deleted',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List project tasks with cursor pagination',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a task by its numeric ID',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task in a project',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update a project task',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project task and its subtasks',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof pipedriveEndpointsNested
>;

export const pipedriveAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key';

export type BasePipedrivePlugin<T extends PipedrivePluginOptions> =
	CorsairPlugin<
		'pipedrive',
		typeof PipedriveSchema,
		typeof pipedriveEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalPipedrivePlugin =
	BasePipedrivePlugin<PipedrivePluginOptions>;
export type ExternalPipedrivePlugin<T extends PipedrivePluginOptions> =
	BasePipedrivePlugin<T>;

export function pipedrive<const T extends PipedrivePluginOptions>(
	incomingOptions: PipedrivePluginOptions & T = {} as PipedrivePluginOptions &
		T,
): ExternalPipedrivePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
	return {
		id: 'pipedrive',
		authConfig: pipedriveAuthConfig,
		schema: PipedriveSchema,
		options,
		hooks: options.hooks,
		endpoints: pipedriveEndpointsNested,
		webhooks: {},
		endpointMeta: pipedriveEndpointMeta,
		endpointSchemas: pipedriveEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: PipedriveKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('pipedrive', ctx.authType);
			const credential =
				ctx.authType === 'oauth_2'
					? await ctx.keys.get_access_token()
					: await ctx.keys.get_api_key();
			if (!credential) throw new AuthMissingError('pipedrive', ctx.authType);
			return credential;
		},
	} satisfies InternalPipedrivePlugin;
}

export type {
	ActivityCreateInput,
	ActivityDeleteResponse,
	ActivityGetInput,
	ActivityListInput,
	ActivityListResponse,
	ActivityResponse,
	ActivityUpdateInput,
	DealCreateInput,
	DealDeleteResponse,
	DealGetInput,
	DealListInput,
	DealListResponse,
	DealResponse,
	DealUpdateInput,
	OrganizationCreateInput,
	OrganizationDeleteResponse,
	OrganizationGetInput,
	OrganizationIdInput,
	OrganizationListInput,
	OrganizationListResponse,
	OrganizationResponse,
	OrganizationUpdateInput,
	PersonCreateInput,
	PersonDeleteResponse,
	PersonGetInput,
	PersonListInput,
	PersonListResponse,
	PersonResponse,
	PersonUpdateInput,
	PipedriveEndpointInputs,
	PipedriveEndpointOutputs,
	TaskCreateInput,
	TaskDeleteResponse,
	TaskIdInput,
	TaskListInput,
	TaskListResponse,
	TaskResponse,
	TaskUpdateInput,
} from './endpoints/types';
