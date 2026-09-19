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
import {
	ChromeEndpoints,
	LibreOfficeEndpoints,
	PdfSharpEndpoints,
	UtilityEndpoints,
	ZebraEndpoints,
} from './endpoints';
import type {
	Api2PdfEndpointInputs,
	Api2PdfEndpointOutputs,
} from './endpoints/types';
import {
	Api2PdfEndpointInputSchemas,
	Api2PdfEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { Api2PdfSchema } from './schema';

export type Api2PdfPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalApi2PdfPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof api2pdfEndpointsNested>;
};

export type Api2PdfContext = CorsairPluginContext<
	typeof Api2PdfSchema,
	Api2PdfPluginOptions
>;

export type Api2PdfKeyBuilderContext = KeyBuilderContext<Api2PdfPluginOptions>;

export type Api2PdfBoundEndpoints = BindEndpoints<
	typeof api2pdfEndpointsNested
>;

type Api2PdfEndpoint<K extends keyof Api2PdfEndpointOutputs> = CorsairEndpoint<
	Api2PdfContext,
	Api2PdfEndpointInputs[K],
	Api2PdfEndpointOutputs[K]
>;

export type Api2PdfEndpoints = {
	checkStatus: Api2PdfEndpoint<'checkStatus'>;
	deletePdf: Api2PdfEndpoint<'deletePdf'>;
	mergePdfs: Api2PdfEndpoint<'mergePdfs'>;
	addHeaderFooter: Api2PdfEndpoint<'addHeaderFooter'>;
	extractPages: Api2PdfEndpoint<'extractPages'>;
	optimizePdf: Api2PdfEndpoint<'optimizePdf'>;
	watermarkPdf: Api2PdfEndpoint<'watermarkPdf'>;
	generateBarcode: Api2PdfEndpoint<'generateBarcode'>;
	libreOfficeThumbnail: Api2PdfEndpoint<'libreOfficeThumbnail'>;
	libreOfficePdfToHtml: Api2PdfEndpoint<'libreOfficePdfToHtml'>;
};

const api2pdfEndpointsNested = {
	utility: {
		checkStatus: UtilityEndpoints.checkStatus,
		deletePdf: UtilityEndpoints.deletePdf,
	},
	pdfsharp: {
		mergePdfs: PdfSharpEndpoints.mergePdfs,
		extractPages: PdfSharpEndpoints.extractPages,
		optimizePdf: PdfSharpEndpoints.optimizePdf,
		watermarkPdf: PdfSharpEndpoints.watermarkPdf,
	},
	chrome: {
		addHeaderFooter: ChromeEndpoints.addHeaderFooter,
	},
	libreoffice: {
		libreOfficeThumbnail: LibreOfficeEndpoints.thumbnail,
		libreOfficePdfToHtml: LibreOfficeEndpoints.pdfToHtml,
	},
	zebra: {
		generateBarcode: ZebraEndpoints.generateBarcode,
	},
} as const;

const api2pdfWebhooksNested = {} as const;

export const api2pdfEndpointSchemas = {
	'utility.checkStatus': {
		input: Api2PdfEndpointInputSchemas.checkStatus,
		output: Api2PdfEndpointOutputSchemas.checkStatus,
	},
	'utility.deletePdf': {
		input: Api2PdfEndpointInputSchemas.deletePdf,
		output: Api2PdfEndpointOutputSchemas.deletePdf,
	},
	'pdfsharp.mergePdfs': {
		input: Api2PdfEndpointInputSchemas.mergePdfs,
		output: Api2PdfEndpointOutputSchemas.mergePdfs,
	},
	'chrome.addHeaderFooter': {
		input: Api2PdfEndpointInputSchemas.addHeaderFooter,
		output: Api2PdfEndpointOutputSchemas.addHeaderFooter,
	},
	'pdfsharp.extractPages': {
		input: Api2PdfEndpointInputSchemas.extractPages,
		output: Api2PdfEndpointOutputSchemas.extractPages,
	},
	'pdfsharp.watermarkPdf': {
		input: Api2PdfEndpointInputSchemas.watermarkPdf,
		output: Api2PdfEndpointOutputSchemas.watermarkPdf,
	},
	'pdfsharp.optimizePdf': {
		input: Api2PdfEndpointInputSchemas.optimizePdf,
		output: Api2PdfEndpointOutputSchemas.optimizePdf,
	},
	'zebra.generateBarcode': {
		input: Api2PdfEndpointInputSchemas.generateBarcode,
		output: Api2PdfEndpointOutputSchemas.generateBarcode,
	},
	'libreoffice.libreOfficeThumbnail': {
		input: Api2PdfEndpointInputSchemas.libreOfficeThumbnail,
		output: Api2PdfEndpointOutputSchemas.libreOfficeThumbnail,
	},
	'libreoffice.libreOfficePdfToHtml': {
		input: Api2PdfEndpointInputSchemas.libreOfficePdfToHtml,
		output: Api2PdfEndpointOutputSchemas.libreOfficePdfToHtml,
	},
} satisfies RequiredPluginEndpointSchemas<typeof api2pdfEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const api2pdfEndpointMeta = {
	'utility.checkStatus': {
		riskLevel: 'read',
		description: 'Check API2PDF service health status',
	},
	'utility.deletePdf': {
		riskLevel: 'write',
		description: 'Delete a previously generated PDF by response ID',
	},
	'pdfsharp.mergePdfs': {
		riskLevel: 'write',
		description: 'Merge multiple PDF URLs into a single document',
	},
	'chrome.addHeaderFooter': {
		riskLevel: 'write',
		description: 'Render HTML to PDF with custom headers and footers',
	},
	'pdfsharp.extractPages': {
		riskLevel: 'write',
		description: 'Extract a page range from a PDF',
	},
	'pdfsharp.watermarkPdf': {
		riskLevel: 'write',
		description: 'Stamp a text watermark onto every page of a PDF',
	},
	'pdfsharp.optimizePdf': {
		riskLevel: 'write',
		description: 'Compress a PDF to reduce file size',
	},
	'zebra.generateBarcode': {
		riskLevel: 'write',
		description: 'Generate a barcode or QR code image',
	},
	'libreoffice.libreOfficeThumbnail': {
		riskLevel: 'write',
		description: 'Generate a thumbnail preview of a document',
	},
	'libreoffice.libreOfficePdfToHtml': {
		riskLevel: 'write',
		description: 'Convert a PDF to HTML using LibreOffice',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof api2pdfEndpointsNested>;

export const api2pdfAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseApi2PdfPlugin<T extends Api2PdfPluginOptions> = CorsairPlugin<
	'api2pdf',
	typeof Api2PdfSchema,
	typeof api2pdfEndpointsNested,
	typeof api2pdfWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalApi2PdfPlugin = BaseApi2PdfPlugin<Api2PdfPluginOptions>;

export type ExternalApi2PdfPlugin<T extends Api2PdfPluginOptions> =
	BaseApi2PdfPlugin<T>;

export function api2pdf<const T extends Api2PdfPluginOptions>(
	incomingOptions: Api2PdfPluginOptions & T = {} as Api2PdfPluginOptions & T,
): ExternalApi2PdfPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'api2pdf',
		authConfig: api2pdfAuthConfig,
		schema: Api2PdfSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: api2pdfEndpointsNested,
		webhooks: api2pdfWebhooksNested,
		endpointMeta: api2pdfEndpointMeta,
		endpointSchemas: api2pdfEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: Api2PdfKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('api2pdf', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('api2pdf', 'api_key');
		},
	} satisfies InternalApi2PdfPlugin;
}

export type {
	AddHeaderFooterInput,
	Api2PdfEndpointInputs,
	Api2PdfEndpointOutputs,
	Api2PdfJobResponse,
	CheckStatusResponse,
	DeletePdfInput,
	ExtractPagesInput,
	GenerateBarcodeInput,
	LibreOfficePdfToHtmlInput,
	LibreOfficeThumbnailInput,
	MergePdfsInput,
	OptimizePdfInput,
	WatermarkPdfInput,
} from './endpoints/types';

export {
	Api2PdfEndpointInputSchemas,
	Api2PdfEndpointOutputSchemas,
	Api2PdfJobResponseSchema,
	CheckStatusResponseSchema,
} from './endpoints/types';
