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
import type { PlateRecognizerContext } from './context';
import { getStatistics, readPlate } from './endpoints';
import {
	GetStatisticsInputSchema,
	GetStatisticsResponseSchema,
	ReadPlateInputSchema,
	ReadPlateResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PlateRecognizerSchema } from './schema';

export type { PlateRecognizerContext };

export type PlateRecognizerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPlateRecognizerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof plateEndpointsNested>;
};

export type PlateRecognizerKeyBuilderContext =
	KeyBuilderContext<PlateRecognizerPluginOptions>;

const plateEndpointsNested = {
	usage: { get: getStatistics },
	plates: { read: readPlate },
} as const;

const plateWebhooksNested = {} as const;

export const plateEndpointSchemas = {
	'usage.get': {
		input: GetStatisticsInputSchema,
		output: GetStatisticsResponseSchema,
	},
	'plates.read': {
		input: ReadPlateInputSchema,
		output: ReadPlateResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof plateEndpointsNested>;

const plateEndpointMeta = {
	'usage.get': {
		riskLevel: 'read',
		description: 'Read the current Snapshot usage period.',
	},
	'plates.read': {
		riskLevel: 'destructive',
		description:
			'Read plates from a base64 image. Snapshot charges a lookup. Plate text is not stored.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof plateEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const plateAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePlateRecognizerPlugin<T extends PlateRecognizerPluginOptions> =
	CorsairPlugin<
		'platerecognizer',
		typeof PlateRecognizerSchema,
		typeof plateEndpointsNested,
		typeof plateWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalPlateRecognizerPlugin =
	BasePlateRecognizerPlugin<PlateRecognizerPluginOptions>;

export type ExternalPlateRecognizerPlugin<
	T extends PlateRecognizerPluginOptions,
> = BasePlateRecognizerPlugin<T>;

export function platerecognizer<const T extends PlateRecognizerPluginOptions>(
	incomingOptions: PlateRecognizerPluginOptions &
		T = {} as PlateRecognizerPluginOptions & T,
): ExternalPlateRecognizerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'platerecognizer',
		authConfig: plateAuthConfig,
		schema: PlateRecognizerSchema,
		options,
		hooks: options.hooks,
		endpoints: plateEndpointsNested,
		webhooks: plateWebhooksNested,
		endpointMeta: plateEndpointMeta,
		endpointSchemas: plateEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PlateRecognizerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalPlateRecognizerPlugin;
}
