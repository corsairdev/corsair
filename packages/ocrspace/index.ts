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
import { Account, Ocr } from './endpoints';
import type {
	OcrSpaceEndpointInputs,
	OcrSpaceEndpointOutputs,
} from './endpoints/types';
import {
	OcrSpaceEndpointInputSchemas,
	OcrSpaceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OcrSpaceSchema } from './schema';

export type OcrSpacePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Base URL for the OCR parse endpoints (`ocr.parseImageUrl`, `ocr.parse`).
	 * Defaults to the shared free-plan host, `https://api.ocr.space`. PRO and
	 * PRO PDF accounts are issued dedicated, redundant parse endpoints by email
	 * on sign-up; set that host here to use them.
	 *
	 * This deliberately does not apply to `account.conversions`: conversion
	 * statistics are served by a separate host (`https://myapi.ocr.space`) that
	 * is the same for free and paid accounts. Routing that call to a dedicated
	 * parse host would request a path the host does not serve.
	 */
	baseUrl?: string;
	hooks?: InternalOcrSpacePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ocrSpaceEndpointsNested>;
};

export type OcrSpaceContext = CorsairPluginContext<
	typeof OcrSpaceSchema,
	OcrSpacePluginOptions
>;

export type OcrSpaceKeyBuilderContext =
	KeyBuilderContext<OcrSpacePluginOptions>;

export type OcrSpaceBoundEndpoints = BindEndpoints<
	typeof ocrSpaceEndpointsNested
>;

type OcrSpaceEndpoint<K extends keyof OcrSpaceEndpointOutputs> =
	CorsairEndpoint<
		OcrSpaceContext,
		OcrSpaceEndpointInputs[K],
		OcrSpaceEndpointOutputs[K]
	>;

export type OcrSpaceEndpoints = {
	parseImageUrl: OcrSpaceEndpoint<'parseImageUrl'>;
	parse: OcrSpaceEndpoint<'parse'>;
	conversions: OcrSpaceEndpoint<'conversions'>;
};

const ocrSpaceEndpointsNested = {
	ocr: {
		parseImageUrl: Ocr.parseImageUrl,
		parse: Ocr.parse,
	},
	account: {
		conversions: Account.conversions,
	},
} as const;

export const ocrSpaceEndpointSchemas = {
	'ocr.parseImageUrl': {
		input: OcrSpaceEndpointInputSchemas.parseImageUrl,
		output: OcrSpaceEndpointOutputSchemas.parseImageUrl,
	},
	'ocr.parse': {
		input: OcrSpaceEndpointInputSchemas.parse,
		output: OcrSpaceEndpointOutputSchemas.parse,
	},
	'account.conversions': {
		input: OcrSpaceEndpointInputSchemas.conversions,
		output: OcrSpaceEndpointOutputSchemas.conversions,
	},
} satisfies RequiredPluginEndpointSchemas<typeof ocrSpaceEndpointsNested>;

const ocrSpaceEndpointMeta = {
	'ocr.parseImageUrl': {
		riskLevel: 'read',
		description:
			'Extract text from an image at a public URL using the simplified GET endpoint',
	},
	'ocr.parse': {
		riskLevel: 'read',
		description:
			'Extract text from an image or PDF supplied as exactly one of a URL, a file upload (pass a File so the filename is sent, or set filetype), or a base64 data URI',
	},
	'account.conversions': {
		riskLevel: 'read',
		description:
			'Retrieve conversion counts for the current month per OCR engine, updated once a day',
	},
} satisfies RequiredPluginEndpointMeta<typeof ocrSpaceEndpointsNested>;

// `handleCorsairError` selects the first handler whose `match` returns true,
// walking keys in insertion order. DEFAULT matches everything, so it has to be
// last: spreading caller-supplied handlers after it would leave them
// unreachable.
function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	overrides?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInRest } = builtIn;
	const { DEFAULT: overrideDefault, ...overrideRest } = overrides ?? {};

	return {
		...builtInRest,
		...overrideRest,
		DEFAULT: overrideDefault ?? builtInDefault,
	};
}

const defaultAuthType: AuthTypes = 'api_key' as const;

export const ocrSpaceAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOcrSpacePlugin<T extends OcrSpacePluginOptions> = CorsairPlugin<
	'ocrspace',
	typeof OcrSpaceSchema,
	typeof ocrSpaceEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof ocrSpaceAuthConfig
>;

export type InternalOcrSpacePlugin = BaseOcrSpacePlugin<OcrSpacePluginOptions>;

export type ExternalOcrSpacePlugin<T extends OcrSpacePluginOptions> =
	BaseOcrSpacePlugin<T>;

// The assertion is safe: OcrSpacePluginOptions has no required fields, so an
// empty object satisfies the constraint at runtime even though TypeScript
// cannot verify it without the assertion.
export function ocrspace<const T extends OcrSpacePluginOptions>(
	incomingOptions: OcrSpacePluginOptions & T = {} as OcrSpacePluginOptions & T,
): ExternalOcrSpacePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'ocrspace',
		schema: OcrSpaceSchema,
		options,
		hooks: options.hooks,
		endpoints: ocrSpaceEndpointsNested,
		webhooks: {},
		endpointMeta: ocrSpaceEndpointMeta,
		endpointSchemas: ocrSpaceEndpointSchemas,
		authConfig: ocrSpaceAuthConfig,
		// OCR.space is a request/response API with no webhook support.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: OcrSpaceKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('ocrspace', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('ocrspace', 'api_key');
		},
	} satisfies InternalOcrSpacePlugin;
}

export { assertOcrSuccess, OcrSpaceAPIError } from './client';
export type {
	ConversionsInput,
	ConversionsResponse,
	OcrLine,
	OcrParsedResult,
	OcrResponse,
	OcrSpaceEndpointInputs,
	OcrSpaceEndpointOutputs,
	OcrTextOverlay,
	OcrWord,
	ParseImageUrlInput,
	ParseImageUrlResponse,
	ParseInput,
	ParseResponse,
} from './endpoints/types';
export {
	ConversionsInputSchema,
	ConversionsResponseSchema,
	OcrResponseSchema,
	OcrSpaceEndpointInputSchemas,
	OcrSpaceEndpointOutputSchemas,
	ParseImageUrlInputSchema,
	ParseImageUrlResponseSchema,
	ParseInputSchema,
	ParseResponseSchema,
} from './endpoints/types';
