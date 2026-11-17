import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { GlobalpingContext } from './context';
import {
	createMeasurement,
	getHealth,
	getLimits,
	getMeasurement,
	listProbes,
} from './endpoints';
import {
	CreateInputSchema,
	EmptyInputSchema,
	GetInputSchema,
	HealthResponseSchema,
	LimitResponseSchema,
	MeasurementResponseSchema,
	ProbeListResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GlobalpingSchema } from './schema';

export type { GlobalpingContext };

export type GlobalpingPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGlobalpingPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof globalpingEndpointsNested>;
};

export type GlobalpingKeyBuilderContext =
	KeyBuilderContext<GlobalpingPluginOptions>;

const globalpingEndpointsNested = {
	probes: { list: listProbes },
	limits: { get: getLimits },
	health: { get: getHealth },
	measurements: { create: createMeasurement, get: getMeasurement },
} as const;

const globalpingWebhooksNested = {} as const;

export const globalpingEndpointSchemas = {
	'probes.list': { input: EmptyInputSchema, output: ProbeListResponseSchema },
	'limits.get': { input: EmptyInputSchema, output: LimitResponseSchema },
	'health.get': { input: EmptyInputSchema, output: HealthResponseSchema },
	'measurements.create': {
		input: CreateInputSchema,
		output: MeasurementResponseSchema,
	},
	'measurements.get': {
		input: GetInputSchema,
		output: MeasurementResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof globalpingEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const globalpingEndpointMeta = {
	'probes.list': read(
		'List online Globalping probes. Probe rows are not stored.',
	),
	'limits.get': read('Read the current measurement rate limit.'),
	'health.get': read('Read the Globalping health check.'),
	'measurements.create': {
		riskLevel: 'write',
		description:
			'Start a ping, traceroute, dns, mtr or http test from Globalping probes, picked by location. Uses the hourly measurement allowance, then account credits.',
	},
	'measurements.get': read(
		"Read a measurement by id with each probe's result. Poll until status is finished. Results are not stored.",
	),
} as const satisfies RequiredPluginEndpointMeta<
	typeof globalpingEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const globalpingAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseGlobalpingPlugin<T extends GlobalpingPluginOptions> =
	CorsairPlugin<
		'globalping',
		typeof GlobalpingSchema,
		typeof globalpingEndpointsNested,
		typeof globalpingWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGlobalpingPlugin =
	BaseGlobalpingPlugin<GlobalpingPluginOptions>;
export type ExternalGlobalpingPlugin<T extends GlobalpingPluginOptions> =
	BaseGlobalpingPlugin<T>;

export function globalping<const T extends GlobalpingPluginOptions>(
	incomingOptions: GlobalpingPluginOptions & T = {} as GlobalpingPluginOptions &
		T,
): ExternalGlobalpingPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'globalping',
		authConfig: globalpingAuthConfig,
		schema: GlobalpingSchema,
		options,
		hooks: options.hooks,
		endpoints: globalpingEndpointsNested,
		webhooks: globalpingWebhooksNested,
		endpointMeta: globalpingEndpointMeta,
		endpointSchemas: globalpingEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: GlobalpingKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalGlobalpingPlugin;
}
