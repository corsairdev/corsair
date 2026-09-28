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
	bulkRun,
	createMonitor,
	createWebhook,
	deleteMonitor,
	getStatus,
	getTask,
	listRobots,
	listTasks,
	listWebhooks,
	runRobot,
} from './endpoints';
import type {
	BrowseaiEndpointInputs,
	BrowseaiEndpointOutputs,
} from './endpoints/types';
import {
	BrowseaiEndpointInputSchemas,
	BrowseaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrowseaiSchema } from './schema';

export type BrowseaiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBrowseaiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browseaiEndpointsNested>;
};

/**
 * Browse AI authenticates with an API key as `Authorization: Bearer`.
 *
 * @see https://docs.browse.ai/api/
 */
export const browseaiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BrowseaiContext = CorsairPluginContext<
	typeof BrowseaiSchema,
	BrowseaiPluginOptions,
	undefined,
	typeof browseaiAuthConfig
>;

export type BrowseaiKeyBuilderContext =
	KeyBuilderContext<BrowseaiPluginOptions>;

export type BrowseaiBoundEndpoints = BindEndpoints<
	typeof browseaiEndpointsNested
>;

type BrowseaiEndpoint<K extends keyof BrowseaiEndpointOutputs> =
	CorsairEndpoint<
		BrowseaiContext,
		BrowseaiEndpointInputs[K],
		BrowseaiEndpointOutputs[K]
	>;

export type BrowseaiEndpoints = {
	systemGetStatus: BrowseaiEndpoint<'systemGetStatus'>;
	robotsList: BrowseaiEndpoint<'robotsList'>;
	robotsRun: BrowseaiEndpoint<'robotsRun'>;
	robotsBulkRun: BrowseaiEndpoint<'robotsBulkRun'>;
	tasksList: BrowseaiEndpoint<'tasksList'>;
	tasksGet: BrowseaiEndpoint<'tasksGet'>;
	monitorsCreate: BrowseaiEndpoint<'monitorsCreate'>;
	monitorsDelete: BrowseaiEndpoint<'monitorsDelete'>;
	webhooksCreate: BrowseaiEndpoint<'webhooksCreate'>;
	webhooksList: BrowseaiEndpoint<'webhooksList'>;
};

const browseaiEndpointsNested = {
	system: {
		getStatus,
	},
	robots: {
		list: listRobots,
		run: runRobot,
		bulkRun,
	},
	tasks: {
		list: listTasks,
		get: getTask,
	},
	monitors: {
		create: createMonitor,
		delete: deleteMonitor,
	},
	webhooks: {
		create: createWebhook,
		list: listWebhooks,
	},
} as const;

export const browseaiEndpointSchemas = {
	'system.getStatus': {
		input: BrowseaiEndpointInputSchemas.systemGetStatus,
		output: BrowseaiEndpointOutputSchemas.systemGetStatus,
	},
	'robots.list': {
		input: BrowseaiEndpointInputSchemas.robotsList,
		output: BrowseaiEndpointOutputSchemas.robotsList,
	},
	'robots.run': {
		input: BrowseaiEndpointInputSchemas.robotsRun,
		output: BrowseaiEndpointOutputSchemas.robotsRun,
	},
	'robots.bulkRun': {
		input: BrowseaiEndpointInputSchemas.robotsBulkRun,
		output: BrowseaiEndpointOutputSchemas.robotsBulkRun,
	},
	'tasks.list': {
		input: BrowseaiEndpointInputSchemas.tasksList,
		output: BrowseaiEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: BrowseaiEndpointInputSchemas.tasksGet,
		output: BrowseaiEndpointOutputSchemas.tasksGet,
	},
	'monitors.create': {
		input: BrowseaiEndpointInputSchemas.monitorsCreate,
		output: BrowseaiEndpointOutputSchemas.monitorsCreate,
	},
	'monitors.delete': {
		input: BrowseaiEndpointInputSchemas.monitorsDelete,
		output: BrowseaiEndpointOutputSchemas.monitorsDelete,
	},
	'webhooks.create': {
		input: BrowseaiEndpointInputSchemas.webhooksCreate,
		output: BrowseaiEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.list': {
		input: BrowseaiEndpointInputSchemas.webhooksList,
		output: BrowseaiEndpointOutputSchemas.webhooksList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof browseaiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const browseaiEndpointMeta = {
	'system.getStatus': {
		riskLevel: 'read',
		description: 'Check Browse AI task-queue status',
	},
	'robots.list': {
		riskLevel: 'read',
		description: 'List robots on the account',
	},
	'robots.run': {
		riskLevel: 'write',
		description: 'Start a robot task',
	},
	'robots.bulkRun': {
		riskLevel: 'write',
		description: 'Start a bulk run of robot tasks',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks for a robot',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a robot task by id',
	},
	'monitors.create': {
		riskLevel: 'write',
		description: 'Create a robot monitor',
	},
	'monitors.delete': {
		riskLevel: 'write',
		description: 'Delete a robot monitor',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a robot webhook',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhooks for a robot',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof browseaiEndpointsNested>;

export type BaseBrowseaiPlugin<T extends BrowseaiPluginOptions> = CorsairPlugin<
	'browseai',
	typeof BrowseaiSchema,
	typeof browseaiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalBrowseaiPlugin = BaseBrowseaiPlugin<BrowseaiPluginOptions>;

export type ExternalBrowseaiPlugin<T extends BrowseaiPluginOptions> =
	BaseBrowseaiPlugin<T>;

/**
 * Browse AI plugin.
 *
 * **No inbound webhooks.** Browse AI calls URLs you register on a robot;
 * it does not POST events into Corsair.
 */
export function browseai<const T extends BrowseaiPluginOptions>(
	incomingOptions: BrowseaiPluginOptions & T = {} as BrowseaiPluginOptions & T,
): ExternalBrowseaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'browseai',
		authConfig: browseaiAuthConfig,
		schema: BrowseaiSchema,
		options,
		hooks: options.hooks,
		endpoints: browseaiEndpointsNested,
		webhooks: {},
		endpointMeta: browseaiEndpointMeta,
		endpointSchemas: browseaiEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BrowseaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('browseai', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('browseai', ctx.authType);
		},
	} satisfies InternalBrowseaiPlugin;
}

export type {
	BrowseaiEndpointInputs,
	BrowseaiEndpointOutputs,
} from './endpoints/types';
