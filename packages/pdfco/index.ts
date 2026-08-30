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
import type { AuthTypes } from 'corsair/core';
import type { PdfcoEndpointInputs, PdfcoEndpointOutputs } from './endpoints/types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './endpoints/types';
import { PdfcoEndpointsImpl } from './endpoints';
import { PdfcoSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type PdfcoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPdfcoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pdfcoEndpointsNested>;
};

export type PdfcoContext = CorsairPluginContext<
	typeof PdfcoSchema,
	PdfcoPluginOptions
>;

export type PdfcoKeyBuilderContext = KeyBuilderContext<PdfcoPluginOptions>;

export type PdfcoBoundEndpoints = BindEndpoints<typeof pdfcoEndpointsNested>;

type PdfcoEndpoint<
	K extends keyof PdfcoEndpointOutputs,
> = CorsairEndpoint<
	PdfcoContext,
	PdfcoEndpointInputs[K],
	PdfcoEndpointOutputs[K]
>;

export type PdfcoEndpoints = {
	fileUpload: PdfcoEndpoint<'fileUpload'>;
	pdfToJson: PdfcoEndpoint<'pdfToJson'>;
	pdfMerge: PdfcoEndpoint<'pdfMerge'>;
	pdfSplit: PdfcoEndpoint<'pdfSplit'>;
	documentParser: PdfcoEndpoint<'documentParser'>;
};

const pdfcoEndpointsNested = {
	fileUpload: PdfcoEndpointsImpl.fileUpload,
	pdfToJson: PdfcoEndpointsImpl.pdfToJson,
	pdfMerge: PdfcoEndpointsImpl.pdfMerge,
	pdfSplit: PdfcoEndpointsImpl.pdfSplit,
	documentParser: PdfcoEndpointsImpl.documentParser,
} as const;

export const pdfcoEndpointSchemas = {
	fileUpload: {
		input: PdfcoEndpointInputSchemas.fileUpload,
		output: PdfcoEndpointOutputSchemas.fileUpload,
	},
	pdfToJson: {
		input: PdfcoEndpointInputSchemas.pdfToJson,
		output: PdfcoEndpointOutputSchemas.pdfToJson,
	},
	pdfMerge: {
		input: PdfcoEndpointInputSchemas.pdfMerge,
		output: PdfcoEndpointOutputSchemas.pdfMerge,
	},
	pdfSplit: {
		input: PdfcoEndpointInputSchemas.pdfSplit,
		output: PdfcoEndpointOutputSchemas.pdfSplit,
	},
	documentParser: {
		input: PdfcoEndpointInputSchemas.documentParser,
		output: PdfcoEndpointOutputSchemas.documentParser,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof pdfcoEndpointsNested>;


const defaultAuthType: AuthTypes = 'api_key' as const;

const pdfcoEndpointMeta = {
	fileUpload: { riskLevel: 'write', description: 'Upload file or URL' },
	pdfToJson: { riskLevel: 'read', description: 'Convert PDF to JSON' },
	pdfMerge: { riskLevel: 'write', description: 'Merge PDFs' },
	pdfSplit: { riskLevel: 'write', description: 'Split PDFs' },
	documentParser: { riskLevel: 'read', description: 'Parse documents' },
} as const satisfies RequiredPluginEndpointMeta<typeof pdfcoEndpointsNested>;

export const pdfcoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	}
} as const satisfies PluginAuthConfig;

export type BasePdfcoPlugin<T extends PdfcoPluginOptions> = CorsairPlugin<
	'pdfco',
	typeof PdfcoSchema,
	typeof pdfcoEndpointsNested,
	// Use an empty object type for webhooks
	{},
	T,
	typeof defaultAuthType
>;

export type InternalPdfcoPlugin = BasePdfcoPlugin<PdfcoPluginOptions>;

export type ExternalPdfcoPlugin<T extends PdfcoPluginOptions> =
	BasePdfcoPlugin<T>;

export function pdfco<const T extends PdfcoPluginOptions>(
	incomingOptions: PdfcoPluginOptions & T = {} as PdfcoPluginOptions & T,
): ExternalPdfcoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pdfco',
		authConfig: pdfcoAuthConfig,
		schema: PdfcoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: pdfcoEndpointsNested,
		webhooks: {},
		endpointMeta: pdfcoEndpointMeta,
		endpointSchemas: pdfcoEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PdfcoKeyBuilderContext, source: 'endpoint' | 'webhook') => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalPdfcoPlugin;
}

export type {
	PdfcoEndpointInputs,
	PdfcoEndpointOutputs,
	FileUploadInput,
	FileUploadResponse,
	PdfToJsonInput,
	PdfToJsonResponse,
	PdfMergeInput,
	PdfMergeResponse,
	PdfSplitInput,
	PdfSplitResponse,
	DocumentParserInput,
	DocumentParserResponse,
} from './endpoints/types';
