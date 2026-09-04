import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';

import { BrowserTool } from './endpoints';
import type {
	BrowserToolEndpointInputs,
	BrowserToolEndpointOutputs,
} from './endpoints/types';
import {
	BrowserToolEndpointInputSchemas,
	BrowserToolEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrowserToolSchema } from './schema';

export type BrowserToolPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBrowserToolPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browserToolEndpointsNested>;
};

export type BrowserToolContext = CorsairPluginContext<
	typeof BrowserToolSchema,
	BrowserToolPluginOptions
>;

export type BrowserToolKeyBuilderContext =
	KeyBuilderContext<BrowserToolPluginOptions>;

export type BrowserToolBoundEndpoints = BindEndpoints<
	typeof browserToolEndpointsNested
>;

type BrowserToolEndpoint<K extends keyof BrowserToolEndpointOutputs> =
	CorsairEndpoint<
		BrowserToolContext,
		BrowserToolEndpointInputs[K],
		BrowserToolEndpointOutputs[K]
	>;

export type BrowserToolEndpoints = {
	createTask: BrowserToolEndpoint<'createTask'>;
	watchTask: BrowserToolEndpoint<'watchTask'>;
	stopTask: BrowserToolEndpoint<'stopTask'>;
	getSession: BrowserToolEndpoint<'getSession'>;
	getOutputFile: BrowserToolEndpoint<'getOutputFile'>;
};

export type BrowserToolWebhooks = {};
export type BrowserToolBoundWebhooks = BindWebhooks<BrowserToolWebhooks>;

const browserToolEndpointsNested = {
	tasks: {
		create: BrowserTool.createTask,
		watch: BrowserTool.watchTask,
		stop: BrowserTool.stopTask,
	},
	sessions: {
		get: BrowserTool.getSession,
	},
	files: {
		get: BrowserTool.getOutputFile,
	},
} as const;

const browserToolWebhooksNested = {};

export const browserToolEndpointSchemas = {
	'tasks.create': {
		input: BrowserToolEndpointInputSchemas.createTask,
		output: BrowserToolEndpointOutputSchemas.createTask,
	},
	'tasks.watch': {
		input: BrowserToolEndpointInputSchemas.watchTask,
		output: BrowserToolEndpointOutputSchemas.watchTask,
	},
	'tasks.stop': {
		input: BrowserToolEndpointInputSchemas.stopTask,
		output: BrowserToolEndpointOutputSchemas.stopTask,
	},
	'sessions.get': {
		input: BrowserToolEndpointInputSchemas.getSession,
		output: BrowserToolEndpointOutputSchemas.getSession,
	},
	'files.get': {
		input: BrowserToolEndpointInputSchemas.getOutputFile,
		output: BrowserToolEndpointOutputSchemas.getOutputFile,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof browserToolEndpointsNested
>;

const browserToolWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof browserToolWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const browserToolEndpointMeta = {
	'tasks.create': {
		riskLevel: 'write',
		description: 'Run an AI-powered browser automation task',
	},
	'tasks.watch': {
		riskLevel: 'read',
		description: 'Poll a browser task for progress and results',
	},
	'tasks.stop': {
		riskLevel: 'write',
		description: 'Stop a running browser task and its session',
	},
	'sessions.get': {
		riskLevel: 'read',
		description: 'Get the live URL for a browser session',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Get a download URL for a task output file',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof browserToolEndpointsNested
>;

export const browserToolAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseBrowserToolPlugin<T extends BrowserToolPluginOptions> =
	CorsairPlugin<
		'browsertool',
		typeof BrowserToolSchema,
		typeof browserToolEndpointsNested,
		typeof browserToolWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBrowserToolPlugin =
	BaseBrowserToolPlugin<BrowserToolPluginOptions>;

export type ExternalBrowserToolPlugin<T extends BrowserToolPluginOptions> =
	BaseBrowserToolPlugin<T>;

export function browsertool<const T extends BrowserToolPluginOptions>(
	incomingOptions: BrowserToolPluginOptions &
		T = {} as BrowserToolPluginOptions & T,
): ExternalBrowserToolPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'browsertool',
		authConfig: browserToolAuthConfig,
		schema: BrowserToolSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: browserToolEndpointsNested,
		webhooks: browserToolWebhooksNested,
		endpointMeta: browserToolEndpointMeta,
		endpointSchemas: browserToolEndpointSchemas,
		webhookSchemas: browserToolWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: BrowserToolKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('browsertool', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('browsertool', 'api_key');
		},
	} satisfies InternalBrowserToolPlugin;
}

export type {
	BrowserToolEndpointInputs,
	BrowserToolEndpointOutputs,
	CreateTaskInput,
	CreateTaskOutput,
	GetOutputFileInput,
	GetOutputFileOutput,
	GetSessionInput,
	GetSessionOutput,
	StopTaskInput,
	StopTaskOutput,
	WatchTaskInput,
	WatchTaskOutput,
} from './endpoints/types';
