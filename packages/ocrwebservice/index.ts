import type {
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

import { Account, Ocr } from './endpoints';

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
	getAccountCredentials: OcrWebServiceEndpoint<'getAccountCredentials'>;
	getAccountInformation: OcrWebServiceEndpoint<'getAccountInformation'>;
	log: OcrWebServiceEndpoint<'log'>;
	recognize: OcrWebServiceEndpoint<'recognize'>;
};

const ocrWebServiceEndpointsNested = {
	account: {
		getCredentials: Account.getCredentials,
		getInformation: Account.getInformation,
		log: Account.log,
	},
	ocr: {
		recognize: Ocr.recognize,
	},
} as const;

export const ocrWebServiceEndpointSchemas = {
	'account.getCredentials': {
		input: OcrWebServiceEndpointInputSchemas.getAccountCredentials,
		output: OcrWebServiceEndpointOutputSchemas.getAccountCredentials,
	},
	'account.getInformation': {
		input: OcrWebServiceEndpointInputSchemas.getAccountInformation,
		output: OcrWebServiceEndpointOutputSchemas.getAccountInformation,
	},
	'account.log': {
		input: OcrWebServiceEndpointInputSchemas.log,
		output: OcrWebServiceEndpointOutputSchemas.log,
	},
	'ocr.recognize': {
		input: OcrWebServiceEndpointInputSchemas.recognize,
		output: OcrWebServiceEndpointOutputSchemas.recognize,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ocrWebServiceEndpointsNested
>;

const ocrWebServiceEndpointMeta = {
	'account.getCredentials': {
		riskLevel: 'read',
		description: 'Extract the OCR Web Service username from stored credentials',
	},
	'account.getInformation': {
		riskLevel: 'read',
		description:
			'Retrieve remaining pages, subscription plan, and expiration date',
	},
	'account.log': {
		riskLevel: 'read',
		description: 'Retrieve OCR processing logs for a date range',
	},
	'ocr.recognize': {
		riskLevel: 'write',
		description: 'OCR an image or document via REST processDocument',
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
	GetAccountCredentialsInput,
	GetAccountCredentialsResponse,
	GetAccountInformationInput,
	GetAccountInformationResponse,
	LogInput,
	LogResponse,
	OcrWebServiceEndpointInputs,
	OcrWebServiceEndpointOutputs,
	ProcessDocumentInput,
	ProcessDocumentResponse,
	RecognizeInput,
	RecognizeResponse,
} from './endpoints/types';
