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
import { packAmbientWeatherCredentials } from './client';
import { Devices } from './endpoints';
import type {
	AmbientWeatherEndpointInputs,
	AmbientWeatherEndpointOutputs,
} from './endpoints/types';
import {
	AmbientWeatherEndpointInputSchemas,
	AmbientWeatherEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AmbientWeatherSchema } from './schema';

export type AmbientWeatherPluginOptions = {
	authType?: PickAuth<'api_key'>;
	hooks?: InternalAmbientWeatherPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ambientweatherEndpointsNested>;
};

export type AmbientWeatherContext = CorsairPluginContext<
	typeof AmbientWeatherSchema,
	AmbientWeatherPluginOptions,
	undefined,
	typeof ambientweatherAuthConfig
>;

export type AmbientWeatherKeyBuilderContext = KeyBuilderContext<
	AmbientWeatherPluginOptions,
	typeof ambientweatherAuthConfig
>;

export type AmbientWeatherBoundEndpoints = BindEndpoints<
	typeof ambientweatherEndpointsNested
>;

type AmbientWeatherEndpoint<K extends keyof AmbientWeatherEndpointOutputs> =
	CorsairEndpoint<
		AmbientWeatherContext,
		AmbientWeatherEndpointInputs[K],
		AmbientWeatherEndpointOutputs[K]
	>;

export type AmbientWeatherEndpoints = {
	devicesList: AmbientWeatherEndpoint<'devicesList'>;
	devicesGetData: AmbientWeatherEndpoint<'devicesGetData'>;
};

const ambientweatherEndpointsNested = {
	devices: {
		list: Devices.list,
		getData: Devices.getData,
	},
} as const;

const ambientweatherWebhooksNested = {} as const;

export const ambientweatherEndpointSchemas = {
	'devices.list': {
		input: AmbientWeatherEndpointInputSchemas.devicesList,
		output: AmbientWeatherEndpointOutputSchemas.devicesList,
	},
	'devices.getData': {
		input: AmbientWeatherEndpointInputSchemas.devicesGetData,
		output: AmbientWeatherEndpointOutputSchemas.devicesGetData,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ambientweatherEndpointsNested
>;

const ambientweatherEndpointMeta = {
	'devices.list': {
		riskLevel: 'read',
		description:
			'List all Ambient Weather devices for the connected account with their latest readings',
	},
	'devices.getData': {
		riskLevel: 'read',
		description:
			'Fetch historical weather data for a specific Ambient Weather device',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof ambientweatherEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const ambientweatherAuthConfig = {
	api_key: {
		account: ['applicationKey'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAmbientWeatherPlugin<T extends AmbientWeatherPluginOptions> =
	CorsairPlugin<
		'ambientweather',
		typeof AmbientWeatherSchema,
		typeof ambientweatherEndpointsNested,
		typeof ambientweatherWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof ambientweatherAuthConfig
	>;

export type InternalAmbientWeatherPlugin =
	BaseAmbientWeatherPlugin<AmbientWeatherPluginOptions>;

export type ExternalAmbientWeatherPlugin<
	T extends AmbientWeatherPluginOptions,
> = BaseAmbientWeatherPlugin<T>;

export function ambientweather<const T extends AmbientWeatherPluginOptions>(
	incomingOptions: AmbientWeatherPluginOptions &
		T = {} as AmbientWeatherPluginOptions & T,
): ExternalAmbientWeatherPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'ambientweather',
		authConfig: ambientweatherAuthConfig,
		schema: AmbientWeatherSchema,
		options,
		hooks: options.hooks,
		endpoints: ambientweatherEndpointsNested,
		webhooks: ambientweatherWebhooksNested,
		endpointMeta: ambientweatherEndpointMeta,
		endpointSchemas: ambientweatherEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AmbientWeatherKeyBuilderContext) => {
			if (ctx.authType !== 'api_key') {
				throw new AuthMissingError('ambientweather', 'api_key');
			}

			const [apiKey, applicationKey] = await Promise.all([
				ctx.keys.get_api_key(),
				ctx.keys.get_applicationKey(),
			]);

			if (!apiKey || !applicationKey) {
				throw new AuthMissingError('ambientweather', 'api_key');
			}

			return packAmbientWeatherCredentials({ apiKey, applicationKey });
		},
	} satisfies InternalAmbientWeatherPlugin;
}

export {
	AmbientWeatherAPIError,
	AmbientWeatherCredentialsSchema,
	AmbientWeatherRateLimitError,
	makeAmbientWeatherRequest,
	packAmbientWeatherCredentials,
	parseAmbientWeatherKey,
} from './client';
export type {
	AmbientWeatherDataPoint,
	AmbientWeatherDeviceInfo,
	AmbientWeatherDeviceListItem,
	AmbientWeatherDeviceListResponse,
	AmbientWeatherDevicesGetDataInput,
	AmbientWeatherDevicesListInput,
	AmbientWeatherEndpointInputs,
	AmbientWeatherEndpointOutputs,
} from './endpoints/types';
