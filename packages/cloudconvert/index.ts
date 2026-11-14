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
import {
	DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS,
	MAX_CLOUDCONVERT_SYNC_TIMEOUT_MS,
} from './client';
import { Formats, Jobs, Operations, Tasks, Users } from './endpoints';
import type {
	CloudConvertEndpointInputs,
	CloudConvertEndpointOutputs,
} from './endpoints/types';
import {
	CloudConvertEndpointInputSchemas,
	CloudConvertEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CloudConvertSchema } from './schema';

export const cloudConvertAuthConfig = {
	api_key: {
		account: [
			'export_gcs_project_id',
			'export_gcs_client_email',
			'export_gcs_private_key',
			'export_s3_access_key_id',
			'export_s3_secret_access_key',
			'export_s3_session_token',
		] as const,
	},
} as const satisfies PluginAuthConfig;

type CloudConvertAuthConfig = typeof cloudConvertAuthConfig;

export type CloudConvertPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Per-request timeout for sync endpoints, bounded to 10 minutes. */
	syncTimeoutMs?: number;
	hooks?: InternalCloudConvertPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudConvertEndpointsNested>;
};

export type CloudConvertContext = CorsairPluginContext<
	typeof CloudConvertSchema,
	CloudConvertPluginOptions,
	undefined,
	CloudConvertAuthConfig
>;

export type CloudConvertKeyBuilderContext =
	KeyBuilderContext<CloudConvertPluginOptions>;

export type CloudConvertBoundEndpoints = BindEndpoints<
	typeof cloudConvertEndpointsNested
>;

type CloudConvertEndpoint<K extends keyof CloudConvertEndpointOutputs> =
	CorsairEndpoint<
		CloudConvertContext,
		CloudConvertEndpointInputs[K],
		CloudConvertEndpointOutputs[K]
	>;

export type CloudConvertEndpoints = {
	jobsCreate: CloudConvertEndpoint<'jobsCreate'>;
	jobsCreateAndWait: CloudConvertEndpoint<'jobsCreateAndWait'>;
	jobsGet: CloudConvertEndpoint<'jobsGet'>;
	jobsWait: CloudConvertEndpoint<'jobsWait'>;
	jobsList: CloudConvertEndpoint<'jobsList'>;
	jobsRemove: CloudConvertEndpoint<'jobsRemove'>;
	tasksCreateExportGoogleCloudStorage: CloudConvertEndpoint<'tasksCreateExportGoogleCloudStorage'>;
	tasksCreateExportS3: CloudConvertEndpoint<'tasksCreateExportS3'>;
	tasksList: CloudConvertEndpoint<'tasksList'>;
	tasksGet: CloudConvertEndpoint<'tasksGet'>;
	tasksWait: CloudConvertEndpoint<'tasksWait'>;
	tasksCancel: CloudConvertEndpoint<'tasksCancel'>;
	tasksRetry: CloudConvertEndpoint<'tasksRetry'>;
	tasksRemove: CloudConvertEndpoint<'tasksRemove'>;
	operationsList: CloudConvertEndpoint<'operationsList'>;
	formatsListSupported: CloudConvertEndpoint<'formatsListSupported'>;
	usersShow: CloudConvertEndpoint<'usersShow'>;
};

const cloudConvertEndpointsNested = {
	jobs: {
		create: Jobs.create,
		createAndWait: Jobs.createAndWait,
		get: Jobs.get,
		wait: Jobs.wait,
		list: Jobs.list,
		remove: Jobs.remove,
	},
	tasks: {
		createExportGoogleCloudStorage: Tasks.createExportGoogleCloudStorage,
		createExportS3: Tasks.createExportS3,
		list: Tasks.list,
		get: Tasks.get,
		wait: Tasks.wait,
		cancel: Tasks.cancel,
		retry: Tasks.retry,
		remove: Tasks.remove,
	},
	operations: {
		list: Operations.list,
	},
	formats: {
		listSupported: Formats.listSupported,
	},
	users: {
		show: Users.show,
	},
} as const;

export const cloudConvertEndpointSchemas = {
	'jobs.create': {
		input: CloudConvertEndpointInputSchemas.jobsCreate,
		output: CloudConvertEndpointOutputSchemas.jobsCreate,
	},
	'jobs.createAndWait': {
		input: CloudConvertEndpointInputSchemas.jobsCreateAndWait,
		output: CloudConvertEndpointOutputSchemas.jobsCreateAndWait,
	},
	'jobs.get': {
		input: CloudConvertEndpointInputSchemas.jobsGet,
		output: CloudConvertEndpointOutputSchemas.jobsGet,
	},
	'jobs.wait': {
		input: CloudConvertEndpointInputSchemas.jobsWait,
		output: CloudConvertEndpointOutputSchemas.jobsWait,
	},
	'jobs.list': {
		input: CloudConvertEndpointInputSchemas.jobsList,
		output: CloudConvertEndpointOutputSchemas.jobsList,
	},
	'jobs.remove': {
		input: CloudConvertEndpointInputSchemas.jobsRemove,
		output: CloudConvertEndpointOutputSchemas.jobsRemove,
	},
	'tasks.createExportGoogleCloudStorage': {
		input: CloudConvertEndpointInputSchemas.tasksCreateExportGoogleCloudStorage,
		output:
			CloudConvertEndpointOutputSchemas.tasksCreateExportGoogleCloudStorage,
	},
	'tasks.createExportS3': {
		input: CloudConvertEndpointInputSchemas.tasksCreateExportS3,
		output: CloudConvertEndpointOutputSchemas.tasksCreateExportS3,
	},
	'tasks.list': {
		input: CloudConvertEndpointInputSchemas.tasksList,
		output: CloudConvertEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: CloudConvertEndpointInputSchemas.tasksGet,
		output: CloudConvertEndpointOutputSchemas.tasksGet,
	},
	'tasks.wait': {
		input: CloudConvertEndpointInputSchemas.tasksWait,
		output: CloudConvertEndpointOutputSchemas.tasksWait,
	},
	'tasks.cancel': {
		input: CloudConvertEndpointInputSchemas.tasksCancel,
		output: CloudConvertEndpointOutputSchemas.tasksCancel,
	},
	'tasks.retry': {
		input: CloudConvertEndpointInputSchemas.tasksRetry,
		output: CloudConvertEndpointOutputSchemas.tasksRetry,
	},
	'tasks.remove': {
		input: CloudConvertEndpointInputSchemas.tasksRemove,
		output: CloudConvertEndpointOutputSchemas.tasksRemove,
	},
	'operations.list': {
		input: CloudConvertEndpointInputSchemas.operationsList,
		output: CloudConvertEndpointOutputSchemas.operationsList,
	},
	'formats.listSupported': {
		input: CloudConvertEndpointInputSchemas.formatsListSupported,
		output: CloudConvertEndpointOutputSchemas.formatsListSupported,
	},
	'users.show': {
		input: CloudConvertEndpointInputSchemas.usersShow,
		output: CloudConvertEndpointOutputSchemas.usersShow,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cloudConvertEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudConvertEndpointMeta = {
	'jobs.create': {
		riskLevel: 'destructive',
		description:
			'Create an asynchronous job from a task graph. CloudConvert limits job task names to alphanumeric characters, hyphens and underscores, with at most 2000 tasks. Docs: https://cloudconvert.com/docs/api-reference/jobs#create-job',
	},
	'jobs.createAndWait': {
		riskLevel: 'destructive',
		description:
			'Create a job and wait for completion on CloudConvert’s synchronous API. Prefer jobs.create for long-running work because clients and network stacks may time out. redirect=true is rejected because it returns raw file bytes unsupported by this JSON endpoint. Docs: https://cloudconvert.com/docs/api-reference/jobs#create-job-and-wait',
	},
	'jobs.get': {
		riskLevel: 'read',
		description:
			'Get job status and its tasks. redirect=true is rejected because it returns raw file bytes unsupported by this JSON endpoint. Docs: https://cloudconvert.com/docs/api-reference/jobs#show-job',
	},
	'jobs.wait': {
		riskLevel: 'read',
		description:
			'Wait for job completion on CloudConvert’s synchronous API. Prefer jobs.get for long-running work because clients and network stacks may time out. redirect=true is rejected because it returns raw file bytes unsupported by this JSON endpoint. Docs: https://cloudconvert.com/docs/api-reference/jobs#wait-for-job',
	},
	'jobs.list': {
		riskLevel: 'read',
		description:
			'List jobs with documented status, tag and access-token filters and page-based pagination. Docs: https://cloudconvert.com/docs/api-reference/jobs#list-jobs',
	},
	'jobs.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a job, including all of its tasks and data. Docs: https://cloudconvert.com/docs/api-reference/jobs#delete-job',
	},
	'tasks.createExportGoogleCloudStorage': {
		riskLevel: 'destructive',
		description:
			'Create a Google Cloud Storage export task in a new job; CloudConvert task creation is part of POST /jobs. Docs: https://cloudconvert.com/docs/import-export/export-files#google-cloud-storage and https://cloudconvert.com/docs/api-reference/jobs#create-job',
	},
	'tasks.createExportS3': {
		riskLevel: 'destructive',
		description:
			'Create an S3 export task in a new job; CloudConvert task creation is part of POST /jobs. Docs: https://cloudconvert.com/docs/import-export/export-files#s3 and https://cloudconvert.com/docs/api-reference/jobs#create-job',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List and filter CloudConvert tasks with page-based pagination. Docs: https://cloudconvert.com/docs/api-reference/tasks#list-tasks',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Get task status and optionally include retries, dependencies, payload and parent job. Docs: https://cloudconvert.com/docs/api-reference/tasks#show-task',
	},
	'tasks.wait': {
		riskLevel: 'read',
		description:
			'Wait for task completion on CloudConvert’s synchronous API. Prefer tasks.get for long-running work because clients and network stacks may time out. Docs: https://cloudconvert.com/docs/api-reference/tasks#wait-for-task',
	},
	'tasks.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a task that is waiting or processing. Docs: https://cloudconvert.com/docs/api-reference/tasks#cancel-task',
	},
	'tasks.retry': {
		riskLevel: 'destructive',
		description:
			'Create a new task using the payload of an existing task. Docs: https://cloudconvert.com/docs/api-reference/tasks#retry-task',
	},
	'tasks.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a task, including its data. Docs: https://cloudconvert.com/docs/api-reference/tasks#delete-task',
	},
	'operations.list': {
		riskLevel: 'read',
		description:
			'List available CloudConvert operations, formats, engines and options. Docs: https://cloudconvert.com/docs/api-reference/operations#list-operations',
	},
	'formats.listSupported': {
		riskLevel: 'read',
		description:
			'List supported conversion formats, engines, options and engine versions through CloudConvert GET /operations. Docs: https://cloudconvert.com/docs/api-reference/operations#list-operations',
	},
	'users.show': {
		riskLevel: 'read',
		description:
			'Read the authenticated CloudConvert user and remaining credits. Docs: https://cloudconvert.com/docs/api-reference/users#show-user',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cloudConvertEndpointsNested
>;

export type BaseCloudConvertPlugin<T extends CloudConvertPluginOptions> =
	CorsairPlugin<
		'cloudconvert',
		typeof CloudConvertSchema,
		typeof cloudConvertEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		CloudConvertAuthConfig
	>;

export type InternalCloudConvertPlugin =
	BaseCloudConvertPlugin<CloudConvertPluginOptions>;

export type ExternalCloudConvertPlugin<T extends CloudConvertPluginOptions> =
	BaseCloudConvertPlugin<T>;

export function cloudconvert<const T extends CloudConvertPluginOptions>(
	incomingOptions: CloudConvertPluginOptions &
		T = {} as CloudConvertPluginOptions & T,
): ExternalCloudConvertPlugin<T> {
	const syncTimeoutMs =
		incomingOptions.syncTimeoutMs ?? DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS;
	if (
		!Number.isSafeInteger(syncTimeoutMs) ||
		syncTimeoutMs <= 0 ||
		syncTimeoutMs > MAX_CLOUDCONVERT_SYNC_TIMEOUT_MS
	) {
		throw new RangeError(
			`syncTimeoutMs must be a positive integer no greater than ${MAX_CLOUDCONVERT_SYNC_TIMEOUT_MS}.`,
		);
	}

	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		syncTimeoutMs,
	};

	return {
		id: 'cloudconvert',
		authConfig: cloudConvertAuthConfig,
		schema: CloudConvertSchema,
		options,
		hooks: options.hooks,
		endpoints: cloudConvertEndpointsNested,
		// CloudConvert sends outbound notifications; this plugin does not receive webhooks.
		webhooks: {},
		endpointMeta: cloudConvertEndpointMeta,
		endpointSchemas: cloudConvertEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudConvertKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				return (await ctx.keys.get_api_key()) ?? '';
			}

			return '';
		},
	} satisfies InternalCloudConvertPlugin;
}

export type {
	CloudConvertEndpointInputs,
	CloudConvertEndpointOutputs,
	CloudConvertJsonValue,
	FormatsListSupportedInput,
	JobsCreateAndWaitInput,
	JobsCreateInput,
	JobsGetInput,
	JobsListInput,
	JobsRemoveInput,
	JobsWaitInput,
	OperationsListInput,
	TasksCancelInput,
	TasksCreateExportGoogleCloudStorageInput,
	TasksCreateExportS3Input,
	TasksGetInput,
	TasksListInput,
	TasksRemoveInput,
	TasksRetryInput,
	TasksWaitInput,
	UsersShowInput,
} from './endpoints/types';
