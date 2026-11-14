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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { ShipEngineRegion } from './client';
import type { ShipEngineNestedEndpoints } from './endpoints';
import { ShipEngine } from './endpoints';
import {
	shipEngineEndpointMeta,
	shipEngineEndpointSchemas,
} from './endpoints/config';
import type {
	ShipEngineEndpointInputs,
	ShipEngineEndpointOutputs,
	ShipEngineOperationName,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ShipEngineSchema } from './schema';

export type ShipEnginePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	apiRegion?: ShipEngineRegion;
	hooks?: InternalShipEnginePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<ShipEngineNestedEndpoints>;
};

export type ShipEngineContext = CorsairPluginContext<
	typeof ShipEngineSchema,
	ShipEnginePluginOptions
>;

export type ShipEngineKeyBuilderContext =
	KeyBuilderContext<ShipEnginePluginOptions>;
export type ShipEngineBoundEndpoints = BindEndpoints<ShipEngineNestedEndpoints>;
export type ShipEngineEndpoints = ShipEngineNestedEndpoints;

const defaultAuthType: AuthTypes = 'api_key';

export const shipEngineAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseShipEnginePlugin<T extends ShipEnginePluginOptions> =
	CorsairPlugin<
		'shipengine',
		typeof ShipEngineSchema,
		typeof ShipEngine,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalShipEnginePlugin =
	BaseShipEnginePlugin<ShipEnginePluginOptions>;
export type ExternalShipEnginePlugin<T extends ShipEnginePluginOptions> =
	BaseShipEnginePlugin<T>;

const endpointMeta =
	shipEngineEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof ShipEngine
	>;

export function shipengine<const T extends ShipEnginePluginOptions>(
	incomingOptions: ShipEnginePluginOptions & T = {} as ShipEnginePluginOptions &
		T,
): ExternalShipEnginePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		apiRegion: incomingOptions.apiRegion ?? 'us',
	};
	return {
		id: 'shipengine',
		authConfig: shipEngineAuthConfig,
		schema: ShipEngineSchema,
		options,
		hooks: options.hooks,
		endpoints: ShipEngine,
		webhooks: {},
		endpointMeta,
		endpointSchemas: shipEngineEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ShipEngineKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) {
				if (!options.key) throw new AuthMissingError('shipengine', 'api_key');
				return options.key;
			}
			if (!ctx.keys) throw new AuthMissingError('shipengine', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('shipengine', 'api_key');
			return apiKey;
		},
	} satisfies InternalShipEnginePlugin;
}

export type {
	ShipEngineEndpointInputs,
	ShipEngineEndpointOutputs,
	ShipEngineOperationName,
	ShipEngineRegion,
};
