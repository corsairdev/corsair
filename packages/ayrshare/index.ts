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
import { deletePost, history, list, set } from './endpoints/handlers';
import type {
	AyrshareEndpointInputs,
	AyrshareEndpointOutputs,
} from './endpoints/types';
import {
	AyrshareEndpointInputSchemas,
	AyrshareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AyrshareSchema } from './schema';

export type AyrsharePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Primary Profile API key, sent as `Authorization: Bearer <key>`. */
	key?: string;
	/**
	 * Business Plan User Profile key, sent as `Profile-Key`.
	 * When omitted the stored `profile_key` is used, if any.
	 */
	profileKey?: string;
	hooks?: InternalAyrsharePlugin['hooks'];
	webhookHooks?: InternalAyrsharePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ayrshareEndpointsNested>;
};

export const ayrshareAuthConfig = {
	api_key: {
		account: ['profile_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type AyrshareContext = CorsairPluginContext<
	typeof AyrshareSchema,
	AyrsharePluginOptions,
	undefined,
	typeof ayrshareAuthConfig
>;

export type AyrshareKeyBuilderContext = KeyBuilderContext<
	AyrsharePluginOptions,
	typeof ayrshareAuthConfig
>;

export type AyrshareBoundEndpoints = BindEndpoints<
	typeof ayrshareEndpointsNested
>;

type AyrshareEndpoint<K extends keyof AyrshareEndpointOutputs> =
	CorsairEndpoint<
		AyrshareContext,
		AyrshareEndpointInputs[K],
		AyrshareEndpointOutputs[K]
	>;

export type AyrshareEndpoints = {
	setAutoSchedule: AyrshareEndpoint<'setAutoSchedule'>;
	listAutoSchedules: AyrshareEndpoint<'listAutoSchedules'>;
	deletePost: AyrshareEndpoint<'deletePost'>;
	getPostHistory: AyrshareEndpoint<'getPostHistory'>;
};

/**
 * Ayrshare webhooks exist on the provider API but are not part of this
 * plugin's four-operation catalog (0 triggers).
 */
export type AyrshareWebhooks = Record<string, never>;

export type AyrshareBoundWebhooks = BindWebhooks<AyrshareWebhooks>;

const ayrshareEndpointsNested = {
	autoSchedule: {
		set,
		list,
	},
	posts: {
		delete: deletePost,
		history,
	},
} as const;

const ayrshareWebhooksNested = {} as const;

export const ayrshareEndpointSchemas = {
	'autoSchedule.set': {
		input: AyrshareEndpointInputSchemas.setAutoSchedule,
		output: AyrshareEndpointOutputSchemas.setAutoSchedule,
	},
	'autoSchedule.list': {
		input: AyrshareEndpointInputSchemas.listAutoSchedules,
		output: AyrshareEndpointOutputSchemas.listAutoSchedules,
	},
	'posts.delete': {
		input: AyrshareEndpointInputSchemas.deletePost,
		output: AyrshareEndpointOutputSchemas.deletePost,
	},
	'posts.history': {
		input: AyrshareEndpointInputSchemas.getPostHistory,
		output: AyrshareEndpointOutputSchemas.getPostHistory,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ayrshareEndpointsNested
>;

export const ayrshareWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof ayrshareWebhooksNested
	>;

export const ayrshareEndpointMeta = {
	'autoSchedule.set': {
		riskLevel: 'write',
		description:
			'Create or replace an auto-post schedule. Its case-sensitive title is the join key used by publish autoSchedule.title.',
	},
	'autoSchedule.list': {
		riskLevel: 'read',
		description:
			'List active auto-post schedules, including titles, UTC times, weekday filters, and exclude dates.',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Ayrshare post by id. Published Instagram and TikTok posts cannot be deleted via API; use markManualDeleted only after deleting them on the network.',
	},
	'posts.history': {
		riskLevel: 'read',
		description:
			'Fetch Ayrshare post history, filterable by date, status, network, and record count.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ayrshareEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseAyrsharePlugin<T extends AyrsharePluginOptions> = CorsairPlugin<
	'ayrshare',
	typeof AyrshareSchema,
	typeof ayrshareEndpointsNested,
	typeof ayrshareWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof ayrshareAuthConfig
>;

export type InternalAyrsharePlugin = BaseAyrsharePlugin<AyrsharePluginOptions>;

export type ExternalAyrsharePlugin<T extends AyrsharePluginOptions> =
	BaseAyrsharePlugin<T>;

/**
 * Builds the Ayrshare plugin.
 *
 * Auth is an API key (`Authorization: Bearer`). An optional Profile-Key
 * selects a Business Plan User Profile.
 */
export function ayrshare<const T extends AyrsharePluginOptions>(
	incomingOptions: AyrsharePluginOptions & T = {} as AyrsharePluginOptions & T,
): ExternalAyrsharePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ayrshare',
		authConfig: ayrshareAuthConfig,
		schema: AyrshareSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ayrshareEndpointsNested,
		webhooks: ayrshareWebhooksNested,
		endpointMeta: ayrshareEndpointMeta,
		endpointSchemas: ayrshareEndpointSchemas,
		webhookSchemas: ayrshareWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AyrshareKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('ayrshare', 'api_key');
			}
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('ayrshare', 'api_key');
			return key;
		},
	} satisfies InternalAyrsharePlugin;
}

export type {
	AyrshareEndpointInputs,
	AyrshareEndpointOutputs,
} from './endpoints/types';
export type { AyrshareAutoSchedule, AyrsharePost } from './schema/database';
