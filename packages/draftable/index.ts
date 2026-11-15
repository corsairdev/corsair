import type {
	AuthTypes,
	BindEndpoints,
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
import { Comparisons } from './endpoints';
import {
	ListComparisonsInputSchema,
	ListComparisonsResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DraftableSchema } from './schema';

export type DraftablePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDraftablePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof draftableEndpointsNested>;
};

export type DraftableContext = CorsairPluginContext<
	typeof DraftableSchema,
	DraftablePluginOptions
>;

export type DraftableKeyBuilderContext =
	KeyBuilderContext<DraftablePluginOptions>;

const draftableEndpointsNested = {
	comparisons: Comparisons,
} as const;

const draftableWebhooksNested = {} as const;

export type DraftableBoundEndpoints = BindEndpoints<
	typeof draftableEndpointsNested
>;

export const draftableEndpointSchemas = {
	'comparisons.list': {
		input: ListComparisonsInputSchema,
		output: ListComparisonsResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof draftableEndpointsNested
>;

const draftableEndpointMeta = {
	'comparisons.list': {
		riskLevel: 'read',
		description: 'Paginated list of document comparisons.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof draftableEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const draftableAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDraftablePlugin<T extends DraftablePluginOptions> =
	CorsairPlugin<
		'draftable',
		typeof DraftableSchema,
		typeof draftableEndpointsNested,
		typeof draftableWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDraftablePlugin =
	BaseDraftablePlugin<DraftablePluginOptions>;

export type ExternalDraftablePlugin<T extends DraftablePluginOptions> =
	BaseDraftablePlugin<T>;

export function draftable<const T extends DraftablePluginOptions>(
	incomingOptions: DraftablePluginOptions & T = {} as DraftablePluginOptions &
		T,
): ExternalDraftablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'draftable',
		authConfig: draftableAuthConfig,
		schema: DraftableSchema,
		options,
		hooks: options.hooks,
		endpoints: draftableEndpointsNested,
		webhooks: draftableWebhooksNested,
		endpointMeta: draftableEndpointMeta,
		endpointSchemas: draftableEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DraftableKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalDraftablePlugin;
}
