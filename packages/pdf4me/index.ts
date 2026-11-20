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
import { Convert, Extract, Jobs, Pdf } from './endpoints';
import type {
	Pdf4meEndpointInputs,
	Pdf4meEndpointOutputs,
} from './endpoints/types';
import {
	Pdf4meEndpointInputSchemas,
	Pdf4meEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { Pdf4meSchema } from './schema';

export type Pdf4mePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPdf4mePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pdf4meEndpointsNested>;
};

export type Pdf4meContext = CorsairPluginContext<
	typeof Pdf4meSchema,
	Pdf4mePluginOptions,
	undefined,
	typeof pdf4meAuthConfig
>;

export type Pdf4meKeyBuilderContext = KeyBuilderContext<
	Pdf4mePluginOptions,
	typeof pdf4meAuthConfig
>;

export type Pdf4meBoundEndpoints = BindEndpoints<typeof pdf4meEndpointsNested>;

type Pdf4meEndpoint<K extends keyof Pdf4meEndpointOutputs> = CorsairEndpoint<
	Pdf4meContext,
	Pdf4meEndpointInputs[K],
	Pdf4meEndpointOutputs[K]
>;

export type Pdf4meEndpoints = {
	[K in keyof Pdf4meEndpointOutputs]: Pdf4meEndpoint<K>;
};

const pdf4meEndpointsNested = {
	pdf: {
		merge: Pdf.merge,
		split: Pdf.split,
		compress: Pdf.compress,
		extractPages: Pdf.extractPages,
		deletePages: Pdf.deletePages,
		getInfo: Pdf.getInfo,
	},
	convert: {
		pdfToWord: Convert.pdfToWord,
		htmlToPdf: Convert.htmlToPdf,
		ocrPdf: Convert.ocrPdf,
	},
	extract: {
		tableFromPdf: Extract.tableFromPdf,
		pdfFormData: Extract.pdfFormData,
	},
	jobs: {
		status: Jobs.status,
	},
} as const;

export const pdf4meEndpointSchemas = {
	'pdf.merge': {
		input: Pdf4meEndpointInputSchemas.pdfMerge,
		output: Pdf4meEndpointOutputSchemas.pdfMerge,
	},
	'pdf.split': {
		input: Pdf4meEndpointInputSchemas.pdfSplit,
		output: Pdf4meEndpointOutputSchemas.pdfSplit,
	},
	'pdf.compress': {
		input: Pdf4meEndpointInputSchemas.pdfCompress,
		output: Pdf4meEndpointOutputSchemas.pdfCompress,
	},
	'pdf.extractPages': {
		input: Pdf4meEndpointInputSchemas.pdfExtractPages,
		output: Pdf4meEndpointOutputSchemas.pdfExtractPages,
	},
	'pdf.deletePages': {
		input: Pdf4meEndpointInputSchemas.pdfDeletePages,
		output: Pdf4meEndpointOutputSchemas.pdfDeletePages,
	},
	'pdf.getInfo': {
		input: Pdf4meEndpointInputSchemas.pdfGetInfo,
		output: Pdf4meEndpointOutputSchemas.pdfGetInfo,
	},
	'convert.pdfToWord': {
		input: Pdf4meEndpointInputSchemas.convertPdfToWord,
		output: Pdf4meEndpointOutputSchemas.convertPdfToWord,
	},
	'convert.htmlToPdf': {
		input: Pdf4meEndpointInputSchemas.convertHtmlToPdf,
		output: Pdf4meEndpointOutputSchemas.convertHtmlToPdf,
	},
	'convert.ocrPdf': {
		input: Pdf4meEndpointInputSchemas.convertOcrPdf,
		output: Pdf4meEndpointOutputSchemas.convertOcrPdf,
	},
	'extract.tableFromPdf': {
		input: Pdf4meEndpointInputSchemas.extractTableFromPdf,
		output: Pdf4meEndpointOutputSchemas.extractTableFromPdf,
	},
	'extract.pdfFormData': {
		input: Pdf4meEndpointInputSchemas.extractPdfFormData,
		output: Pdf4meEndpointOutputSchemas.extractPdfFormData,
	},
	'jobs.status': {
		input: Pdf4meEndpointInputSchemas.jobsStatus,
		output: Pdf4meEndpointOutputSchemas.jobsStatus,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pdf4meEndpointsNested
>;

const pdf4meEndpointMeta = {
	'pdf.merge': {
		riskLevel: 'write',
		description: 'Merge multiple PDFs into one; array order is the merge order',
	},
	'pdf.split': {
		riskLevel: 'write',
		description:
			'Split a PDF by pages, text separator, barcode or Swiss QR code',
	},
	'pdf.compress': {
		riskLevel: 'write',
		description:
			'Compress a PDF with a documented profile (Max, Web, Print, Default)',
	},
	'pdf.extractPages': {
		riskLevel: 'write',
		description: 'Extract the given pages into a new PDF',
	},
	'pdf.deletePages': {
		riskLevel: 'destructive',
		description:
			'Delete the given pages from a PDF; the original document is not recoverable from the result',
		irreversible: true,
	},
	'pdf.getInfo': {
		riskLevel: 'read',
		description: 'Read PDF metadata: page count, dimensions, author and more',
	},
	'convert.pdfToWord': {
		riskLevel: 'write',
		description: 'Convert a PDF to a Word document',
	},
	'convert.htmlToPdf': {
		riskLevel: 'write',
		description: 'Render HTML content into a PDF',
	},
	'convert.ocrPdf': {
		riskLevel: 'write',
		description: 'Run OCR on a scanned PDF to make its text editable',
	},
	'extract.tableFromPdf': {
		riskLevel: 'read',
		description: 'Extract tables from a PDF',
	},
	'extract.pdfFormData': {
		riskLevel: 'read',
		description: 'Extract the values of filled PDF form fields',
	},
	'jobs.status': {
		riskLevel: 'read',
		description: 'Poll an asynchronous processing job started with isAsync',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pdf4meEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const pdf4meAuthConfig = {
	api_key: {
		// PDF4me issues one API key per account; no account-level field is
		// needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePdf4mePlugin<T extends Pdf4mePluginOptions> = CorsairPlugin<
	'pdf4me',
	typeof Pdf4meSchema,
	typeof pdf4meEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof pdf4meAuthConfig
>;

export type InternalPdf4mePlugin = BasePdf4mePlugin<Pdf4mePluginOptions>;

export type ExternalPdf4mePlugin<T extends Pdf4mePluginOptions> =
	BasePdf4mePlugin<T>;

export function pdf4me<const T extends Pdf4mePluginOptions>(
	incomingOptions: Pdf4mePluginOptions & T = {} as Pdf4mePluginOptions & T,
): ExternalPdf4mePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pdf4me',
		authConfig: pdf4meAuthConfig,
		schema: Pdf4meSchema,
		options: options,
		hooks: options.hooks,
		endpoints: pdf4meEndpointsNested,
		webhooks: {},
		endpointMeta: pdf4meEndpointMeta,
		endpointSchemas: pdf4meEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: Pdf4meKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('pdf4me', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPdf4mePlugin;
}

export { Pdf4meAPIError } from './client';

export type {
	FileOutput,
	JobStatus,
	Pdf4meEndpointInputs,
	Pdf4meEndpointOutputs,
} from './endpoints/types';
export { shapeBinaryFile } from './endpoints/types';
