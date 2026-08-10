import type {
	BindEndpoints, CorsairEndpoint, CorsairErrorHandler, CorsairPlugin,
	CorsairPluginContext, KeyBuilderContext, PickAuth, PluginAuthConfig,
	PluginPermissionsConfig, RequiredPluginEndpointMeta, RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { AutoScheduleEndpoints, PostsEndpoints } from './endpoints';
import { AyrshareEndpointInputSchemas, AyrshareEndpointOutputSchemas } from './endpoints/types';
import type { AyrshareEndpointInputs, AyrshareEndpointOutputs } from './endpoints/types';
import { AyrshareSchema } from './schema';
import { errorHandlers } from './error-handlers';

export const ayrshareAuthConfig = {
	api_key: { account: ['profile_key'] as const },
} as const satisfies PluginAuthConfig;

export type AyrsharePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Optional Business Plan profile key sent as Profile-Key. */
	profileKey?: string;
	hooks?: InternalAyrsharePlugin['hooks'];
	webhookHooks?: InternalAyrsharePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ayrshareEndpointsNested>;
};
export type AyrshareContext = CorsairPluginContext<typeof AyrshareSchema, AyrsharePluginOptions, undefined, typeof ayrshareAuthConfig>;
export type AyrshareKeyBuilderContext = KeyBuilderContext<AyrsharePluginOptions, typeof ayrshareAuthConfig>;
type AyrshareEndpoint<K extends keyof AyrshareEndpointOutputs> = CorsairEndpoint<
	AyrshareContext, AyrshareEndpointInputs[K], AyrshareEndpointOutputs[K]
>;
export type AyrshareEndpoints = {
	setAutoSchedule: AyrshareEndpoint<'setAutoSchedule'>;
	deletePost: AyrshareEndpoint<'deletePost'>;
	getPostHistory: AyrshareEndpoint<'getPostHistory'>;
	listAutoSchedules: AyrshareEndpoint<'listAutoSchedules'>;
};
export type AyrshareBoundEndpoints = BindEndpoints<typeof ayrshareEndpointsNested>;

const ayrshareEndpointsNested = {
	autoSchedule: { set: AutoScheduleEndpoints.set, list: AutoScheduleEndpoints.list },
	posts: { delete: PostsEndpoints.deletePost, history: PostsEndpoints.history },
} as const;

export const ayrshareEndpointSchemas = {
	'autoSchedule.set': { input: AyrshareEndpointInputSchemas.setAutoSchedule, output: AyrshareEndpointOutputSchemas.setAutoSchedule },
	'autoSchedule.list': { input: AyrshareEndpointInputSchemas.listAutoSchedules, output: AyrshareEndpointOutputSchemas.listAutoSchedules },
	'posts.delete': { input: AyrshareEndpointInputSchemas.deletePost, output: AyrshareEndpointOutputSchemas.deletePost },
	'posts.history': { input: AyrshareEndpointInputSchemas.getPostHistory, output: AyrshareEndpointOutputSchemas.getPostHistory },
} as const satisfies RequiredPluginEndpointSchemas<typeof ayrshareEndpointsNested>;

const ayrshareEndpointMeta = {
	'autoSchedule.set': { riskLevel: 'write', description: 'Create or replace an Ayrshare auto-post schedule. Its case-sensitive title is the join key used by publish autoSchedule.title.' },
	'autoSchedule.list': { riskLevel: 'read', description: 'List active Ayrshare auto-post schedules, including their titles, UTC times, and weekday filters.' },
	'posts.delete': { riskLevel: 'destructive', irreversible: true, description: 'Delete an Ayrshare post. Published Instagram and TikTok posts cannot be deleted through their APIs; use markManualDeleted only after manual platform deletion to flag the Ayrshare record without a platform-side delete.' },
	'posts.history': { riskLevel: 'read', description: 'Fetch live Ayrshare post history with statuses, platform post IDs, and metrics-related post details.' },
} as const satisfies RequiredPluginEndpointMeta<typeof ayrshareEndpointsNested>;

const defaultAuthType = 'api_key' as const;
export type BaseAyrsharePlugin<T extends AyrsharePluginOptions> = CorsairPlugin<'ayrshare', typeof AyrshareSchema, typeof ayrshareEndpointsNested, {}, T, typeof defaultAuthType, typeof ayrshareAuthConfig>;
export type InternalAyrsharePlugin = BaseAyrsharePlugin<AyrsharePluginOptions>;
export type ExternalAyrsharePlugin<T extends AyrsharePluginOptions> = BaseAyrsharePlugin<T>;

export function ayrshare<const T extends AyrsharePluginOptions>(incomingOptions: AyrsharePluginOptions & T = {} as AyrsharePluginOptions & T): ExternalAyrsharePlugin<T> {
	const options = { ...incomingOptions, authType: incomingOptions.authType ?? defaultAuthType };
	return {
		id: 'ayrshare', schema: AyrshareSchema, options, hooks: options.hooks, webhookHooks: options.webhookHooks,
		endpoints: ayrshareEndpointsNested, webhooks: {}, authConfig: ayrshareAuthConfig,
		endpointMeta: ayrshareEndpointMeta, endpointSchemas: ayrshareEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: AyrshareKeyBuilderContext, source) => {
			if (source !== 'endpoint') throw new AuthMissingError('ayrshare', 'api_key');
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('ayrshare', 'api_key');
			return key;
		},
	} satisfies InternalAyrsharePlugin;
}

export type { AyrshareAutoSchedule } from './schema';
export type { AyrshareEndpointInputs, AyrshareEndpointOutputs } from './endpoints/types';
