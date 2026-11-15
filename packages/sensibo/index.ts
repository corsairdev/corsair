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
import { Devices } from './endpoints';
import {
	ListDevicesInputSchema,
	ListDevicesResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SensiboSchema } from './schema';

export type SensiboPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSensiboPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sensiboEndpointsNested>;
};

export type SensiboContext = CorsairPluginContext<
	typeof SensiboSchema,
	SensiboPluginOptions
>;

export type SensiboKeyBuilderContext = KeyBuilderContext<SensiboPluginOptions>;

const sensiboEndpointsNested = {
	devices: Devices,
} as const;

const sensiboWebhooksNested = {} as const;

export type SensiboBoundEndpoints = BindEndpoints<
	typeof sensiboEndpointsNested
>;

export const sensiboEndpointSchemas = {
	'devices.list': {
		input: ListDevicesInputSchema,
		output: ListDevicesResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sensiboEndpointsNested
>;

const sensiboEndpointMeta = {
	'devices.list': {
		riskLevel: 'read',
		description: 'List every Sensibo pod on the authenticated account.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof sensiboEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const sensiboAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSensiboPlugin<T extends SensiboPluginOptions> = CorsairPlugin<
	'sensibo',
	typeof SensiboSchema,
	typeof sensiboEndpointsNested,
	typeof sensiboWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSensiboPlugin = BaseSensiboPlugin<SensiboPluginOptions>;

export type ExternalSensiboPlugin<T extends SensiboPluginOptions> =
	BaseSensiboPlugin<T>;

export function sensibo<const T extends SensiboPluginOptions>(
	incomingOptions: SensiboPluginOptions & T = {} as SensiboPluginOptions & T,
): ExternalSensiboPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'sensibo',
		authConfig: sensiboAuthConfig,
		schema: SensiboSchema,
		options,
		hooks: options.hooks,
		endpoints: sensiboEndpointsNested,
		webhooks: sensiboWebhooksNested,
		endpointMeta: sensiboEndpointMeta,
		endpointSchemas: sensiboEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SensiboKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalSensiboPlugin;
}
