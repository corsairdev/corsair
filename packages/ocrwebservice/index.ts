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

import { Ocr } from './endpoints';

import type {
	OcrWebServiceEndpointInputs,
	OcrWebServiceEndpointOutputs,
} from './endpoints/types';

import {
	OcrWebServiceEndpointInputSchemas,
	OcrWebServiceEndpointOutputSchemas,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';

import { OcrWebServiceSchema } from './schema';

export type OcrWebServicePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;

	hooks?: InternalOcrWebServicePlugin['hooks'];

	errorHandlers?: CorsairErrorHandler;

	permissions?: PluginPermissionsConfig<typeof ocrWebServiceEndpointsNested>;
};

export type OcrWebServiceContext = CorsairPluginContext<
	typeof OcrWebServiceSchema,
	OcrWebServicePluginOptions
>;

export type OcrWebServiceKeyBuilderContext =
	KeyBuilderContext<OcrWebServicePluginOptions>;

export type OcrWebServiceBoundEndpoints = BindEndpoints<
	typeof ocrWebServiceEndpointsNested
>;

type OcrWebServiceEndpoint<K extends keyof OcrWebServiceEndpointOutputs> =
	CorsairEndpoint<
		OcrWebServiceContext,
		OcrWebServiceEndpointInputs[K],
		OcrWebServiceEndpointOutputs[K]
	>;

export type OcrWebServiceEndpoints = {
	processDocument: OcrWebServiceEndpoint<'processDocument'>;
};

const ocrWebServiceEndpointsNested = {
	ocr: {
		processDocument: Ocr.processDocument,
	},
} as const;

export const ocrWebServiceEndpointSchemas = {
	'ocr.processDocument': {
		input: OcrWebServiceEndpointInputSchemas.processDocument,
		output: OcrWebServiceEndpointOutputSchemas.processDocument,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ocrWebServiceEndpointsNested
>;

const ocrWebServiceEndpointMeta = {
	'ocr.processDocument': {
		riskLevel: 'write',
		description: 'Process an image or document using OCR Web Service',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof ocrWebServiceEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const ocrWebServiceAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOcrWebServicePlugin<T extends OcrWebServicePluginOptions> =
	CorsairPlugin<
		'ocrwebservice',
		typeof OcrWebServiceSchema,
		typeof ocrWebServiceEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalOcrWebServicePlugin =
	BaseOcrWebServicePlugin<OcrWebServicePluginOptions>;

export type ExternalOcrWebServicePlugin<T extends OcrWebServicePluginOptions> =
	BaseOcrWebServicePlugin<T>;

export function ocrwebservice<const T extends OcrWebServicePluginOptions>(
	incomingOptions: OcrWebServicePluginOptions &
		T = {} as OcrWebServicePluginOptions & T,
): ExternalOcrWebServicePlugin<T> {
	const options: OcrWebServicePluginOptions & T = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'ocrwebservice',

		authConfig: ocrWebServiceAuthConfig,

		schema: OcrWebServiceSchema,

		options,

		hooks: options.hooks,

		endpoints: ocrWebServiceEndpointsNested,

		endpointMeta: ocrWebServiceEndpointMeta,

		endpointSchemas: ocrWebServiceEndpointSchemas,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: OcrWebServiceKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('ocrwebservice', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('ocrwebservice', 'api_key');
		},
	} satisfies InternalOcrWebServicePlugin;
}

export type {
	OcrWebServiceEndpointInputs,
	OcrWebServiceEndpointOutputs,
	ProcessDocumentInput,
	ProcessDocumentResponse,
} from './endpoints/types';
