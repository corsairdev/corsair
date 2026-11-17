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
import { getOcrUsage, getStatistics, readOcr, readPlate } from './endpoints';
import {
	GetStatisticsInputSchema,
	GetStatisticsResponseSchema,
	ReadOcrInputSchema,
	ReadOcrResponseSchema,
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
	ocr: { read: readOcr, getUsage: getOcrUsage },
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
	'ocr.read': {
		input: ReadOcrInputSchema,
		output: ReadOcrResponseSchema,
	},
	'ocr.getUsage': {
		input: GetStatisticsInputSchema,
		output: GetStatisticsResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof plateEndpointsNested>;

const plateEndpointMeta = {
	'usage.get': {
		riskLevel: 'read',
		description: 'Read the current Snapshot usage period.',
	},
	// Recognition counts against the plan's monthly lookups but only returns
	// data, so it stays `read`, like the Ahrefs plugin's metered reads.
	'plates.read': {
		riskLevel: 'read',
		description:
			'Read license plates (and optionally make, model and color) from an image. Uses one Snapshot lookup. Plate text is not stored.',
	},
	'ocr.read': {
		riskLevel: 'read',
		description:
			'Read a VIN, trailer id, odometer, shipping container, boat registration or C-TPAT seal from an image. Uses one OCR call; takes 20 to 30 s.',
	},
	'ocr.getUsage': {
		riskLevel: 'read',
		description: 'Read the OCR calls used this period and the plan limit.',
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
