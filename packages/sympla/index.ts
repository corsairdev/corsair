import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { SymplaContext } from './context';
import { Events } from './endpoints';
import {
	ListEventsInputSchema,
	ListEventsResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SymplaSchema } from './schema';

export type { SymplaContext };

export type SymplaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSymplaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof symplaEndpointsNested>;
};

export type SymplaKeyBuilderContext = KeyBuilderContext<SymplaPluginOptions>;

const symplaEndpointsNested = {
	events: Events,
} as const;

const symplaWebhooksNested = {} as const;

export type SymplaBoundEndpoints = BindEndpoints<typeof symplaEndpointsNested>;

export const symplaEndpointSchemas = {
	'events.list': {
		input: ListEventsInputSchema,
		output: ListEventsResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof symplaEndpointsNested
>;

const symplaEndpointMeta = {
	'events.list': {
		riskLevel: 'read',
		description: 'List events for the authenticated organizer.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof symplaEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const symplaAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSymplaPlugin<T extends SymplaPluginOptions> = CorsairPlugin<
	'sympla',
	typeof SymplaSchema,
	typeof symplaEndpointsNested,
	typeof symplaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSymplaPlugin = BaseSymplaPlugin<SymplaPluginOptions>;

export type ExternalSymplaPlugin<T extends SymplaPluginOptions> =
	BaseSymplaPlugin<T>;

export function sympla<const T extends SymplaPluginOptions>(
	incomingOptions: SymplaPluginOptions & T = {} as SymplaPluginOptions & T,
): ExternalSymplaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'sympla',
		authConfig: symplaAuthConfig,
		schema: SymplaSchema,
		options,
		hooks: options.hooks,
		endpoints: symplaEndpointsNested,
		webhooks: symplaWebhooksNested,
		endpointMeta: symplaEndpointMeta,
		endpointSchemas: symplaEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SymplaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalSymplaPlugin;
}
