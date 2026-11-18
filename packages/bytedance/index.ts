import type {
	AuthTypes,
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
import { Video } from './endpoints';
import type {
	BytedanceEndpointInputs,
	BytedanceEndpointOutputs,
} from './endpoints/types';
import {
	BytedanceEndpointInputSchemas,
	BytedanceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BytedanceSchema } from './schema';

export type BytedancePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * ModelArk API origin. Defaults to ap-southeast-1
	 * (`https://ark.ap-southeast.bytepluses.com`).
	 */
	baseUrl?: string;
	hooks?: InternalBytedancePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bytedanceEndpointsNested>;
};

export type BytedanceContext = CorsairPluginContext<
	typeof BytedanceSchema,
	BytedancePluginOptions
>;

export type BytedanceKeyBuilderContext =
	KeyBuilderContext<BytedancePluginOptions>;

export type BytedanceBoundEndpoints = BindEndpoints<
	typeof bytedanceEndpointsNested
>;

type BytedanceEndpoint<K extends keyof BytedanceEndpointOutputs> =
	CorsairEndpoint<
		BytedanceContext,
		BytedanceEndpointInputs[K],
		BytedanceEndpointOutputs[K]
	>;

export type BytedanceEndpoints = {
	videoCreate: BytedanceEndpoint<'videoCreate'>;
	tasksGet: BytedanceEndpoint<'tasksGet'>;
	tasksList: BytedanceEndpoint<'tasksList'>;
	tasksDelete: BytedanceEndpoint<'tasksDelete'>;
};

const bytedanceEndpointsNested = {
	video: {
		create: Video.create,
	},
	tasks: {
		get: Video.get,
		list: Video.list,
		delete: Video.remove,
	},
} as const;

export const bytedanceEndpointSchemas = {
	'video.create': {
		input: BytedanceEndpointInputSchemas.videoCreate,
		output: BytedanceEndpointOutputSchemas.videoCreate,
	},
	'tasks.get': {
		input: BytedanceEndpointInputSchemas.tasksGet,
		output: BytedanceEndpointOutputSchemas.tasksGet,
	},
	'tasks.list': {
		input: BytedanceEndpointInputSchemas.tasksList,
		output: BytedanceEndpointOutputSchemas.tasksList,
	},
	'tasks.delete': {
		input: BytedanceEndpointInputSchemas.tasksDelete,
		output: BytedanceEndpointOutputSchemas.tasksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bytedanceEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bytedanceEndpointMeta = {
	'video.create': {
		riskLevel: 'write',
		description:
			'Start a Seedance video generation task from text, frames, or reference media; returns a task id',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Get a video generation task: status, video URL (valid 24h), and token usage',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List video generation tasks from the past 7 days, filtered by status, model, or ids',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Cancel a queued video task, or delete a finished task record',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof bytedanceEndpointsNested
>;

export type BaseBytedancePlugin<T extends BytedancePluginOptions> =
	CorsairPlugin<
		'bytedance',
		typeof BytedanceSchema,
		typeof bytedanceEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalBytedancePlugin =
	BaseBytedancePlugin<BytedancePluginOptions>;

export type ExternalBytedancePlugin<T extends BytedancePluginOptions> =
	BaseBytedancePlugin<T>;

export function bytedance<const T extends BytedancePluginOptions>(
	incomingOptions: BytedancePluginOptions & T = {} as BytedancePluginOptions &
		T,
): ExternalBytedancePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bytedance',
		schema: BytedanceSchema,
		options: options,
		hooks: options.hooks,
		endpoints: bytedanceEndpointsNested,
		webhooks: {},
		endpointMeta: bytedanceEndpointMeta,
		endpointSchemas: bytedanceEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BytedanceKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('bytedance', 'api_key');
		},
	} satisfies InternalBytedancePlugin;
}

export type {
	BytedanceEndpointInputs,
	BytedanceEndpointOutputs,
	ContentItem,
	TaskDeleteResponse,
	TaskIdInput,
	TasksListInput,
	TasksListResponse,
	VideoCreateInput,
	VideoCreateResponse,
	VideoTask,
} from './endpoints/types';
export { SEEDANCE_MODELS } from './endpoints/types';
