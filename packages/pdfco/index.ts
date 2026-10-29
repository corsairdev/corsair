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
import { PdfcoEndpointsImpl } from './endpoints';
import type {
	PdfcoEndpointInputs,
	PdfcoEndpointOutputs,
} from './endpoints/types';
import {
	PdfcoEndpointInputSchemas,
	PdfcoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PdfcoSchema } from './schema';

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

type PdfcoEndpoint<K extends keyof PdfcoEndpointOutputs> = CorsairEndpoint<
	PdfcoContext,
	PdfcoEndpointInputs[K],
	PdfcoEndpointOutputs[K]
>;

export type PdfcoEndpoints = {
	fileUpload: PdfcoEndpoint<'fileUpload'>;
	fileUploadBase64: PdfcoEndpoint<'fileUploadBase64'>;
	pdfToJson: PdfcoEndpoint<'pdfToJson'>;
	pdfToCsv: PdfcoEndpoint<'pdfToCsv'>;
	pdfToHtml: PdfcoEndpoint<'pdfToHtml'>;
	pdfToImage: PdfcoEndpoint<'pdfToImage'>;
	pdfToText: PdfcoEndpoint<'pdfToText'>;
	pdfToXls: PdfcoEndpoint<'pdfToXls'>;
	pdfToXlsx: PdfcoEndpoint<'pdfToXlsx'>;
	pdfToXml: PdfcoEndpoint<'pdfToXml'>;
	excelToCsv: PdfcoEndpoint<'excelToCsv'>;
	excelToHtml: PdfcoEndpoint<'excelToHtml'>;
	excelToJson: PdfcoEndpoint<'excelToJson'>;
	excelToText: PdfcoEndpoint<'excelToText'>;
	excelToXml: PdfcoEndpoint<'excelToXml'>;
	pdfFromHtml: PdfcoEndpoint<'pdfFromHtml'>;
	pdfFromEmail: PdfcoEndpoint<'pdfFromEmail'>;
	pdfFromText: PdfcoEndpoint<'pdfFromText'>;
	pdfAdd: PdfcoEndpoint<'pdfAdd'>;
	pdfMerge: PdfcoEndpoint<'pdfMerge'>;
	pdfSplit: PdfcoEndpoint<'pdfSplit'>;
	pdfDeletePages: PdfcoEndpoint<'pdfDeletePages'>;
	pdfRotate: PdfcoEndpoint<'pdfRotate'>;
	pdfFind: PdfcoEndpoint<'pdfFind'>;
	pdfSearchAndReplaceText: PdfcoEndpoint<'pdfSearchAndReplaceText'>;
	pdfSearchAndDeleteText: PdfcoEndpoint<'pdfSearchAndDeleteText'>;
	pdfInfoReader: PdfcoEndpoint<'pdfInfoReader'>;
	pdfFormsInfoReader: PdfcoEndpoint<'pdfFormsInfoReader'>;
	pdfExtractAttachments: PdfcoEndpoint<'pdfExtractAttachments'>;
	pdfChangeTextSearchable: PdfcoEndpoint<'pdfChangeTextSearchable'>;
	documentParser: PdfcoEndpoint<'documentParser'>;
	jobCheck: PdfcoEndpoint<'jobCheck'>;
	barcodeGenerate: PdfcoEndpoint<'barcodeGenerate'>;
	accountBalance: PdfcoEndpoint<'accountBalance'>;
};

const pdfcoEndpointsNested = {
	fileUpload: PdfcoEndpointsImpl.fileUpload,
	fileUploadBase64: PdfcoEndpointsImpl.fileUploadBase64,
	pdfToJson: PdfcoEndpointsImpl.pdfToJson,
	pdfToCsv: PdfcoEndpointsImpl.pdfToCsv,
	pdfToHtml: PdfcoEndpointsImpl.pdfToHtml,
	pdfToImage: PdfcoEndpointsImpl.pdfToImage,
	pdfToText: PdfcoEndpointsImpl.pdfToText,
	pdfToXls: PdfcoEndpointsImpl.pdfToXls,
	pdfToXlsx: PdfcoEndpointsImpl.pdfToXlsx,
	pdfToXml: PdfcoEndpointsImpl.pdfToXml,
	excelToCsv: PdfcoEndpointsImpl.excelToCsv,
	excelToHtml: PdfcoEndpointsImpl.excelToHtml,
	excelToJson: PdfcoEndpointsImpl.excelToJson,
	excelToText: PdfcoEndpointsImpl.excelToText,
	excelToXml: PdfcoEndpointsImpl.excelToXml,
	pdfFromHtml: PdfcoEndpointsImpl.pdfFromHtml,
	pdfFromEmail: PdfcoEndpointsImpl.pdfFromEmail,
	pdfFromText: PdfcoEndpointsImpl.pdfFromText,
	pdfAdd: PdfcoEndpointsImpl.pdfAdd,
	pdfMerge: PdfcoEndpointsImpl.pdfMerge,
	pdfSplit: PdfcoEndpointsImpl.pdfSplit,
	pdfDeletePages: PdfcoEndpointsImpl.pdfDeletePages,
	pdfRotate: PdfcoEndpointsImpl.pdfRotate,
	pdfFind: PdfcoEndpointsImpl.pdfFind,
	pdfSearchAndReplaceText: PdfcoEndpointsImpl.pdfSearchAndReplaceText,
	pdfSearchAndDeleteText: PdfcoEndpointsImpl.pdfSearchAndDeleteText,
	pdfInfoReader: PdfcoEndpointsImpl.pdfInfoReader,
	pdfFormsInfoReader: PdfcoEndpointsImpl.pdfFormsInfoReader,
	pdfExtractAttachments: PdfcoEndpointsImpl.pdfExtractAttachments,
	pdfChangeTextSearchable: PdfcoEndpointsImpl.pdfChangeTextSearchable,
	documentParser: PdfcoEndpointsImpl.documentParser,
	jobCheck: PdfcoEndpointsImpl.jobCheck,
	barcodeGenerate: PdfcoEndpointsImpl.barcodeGenerate,
	accountBalance: PdfcoEndpointsImpl.accountBalance,
} as const;

export const pdfcoEndpointSchemas = {
	fileUpload: {
		input: PdfcoEndpointInputSchemas.fileUpload,
		output: PdfcoEndpointOutputSchemas.fileUpload,
	},
	fileUploadBase64: {
		input: PdfcoEndpointInputSchemas.fileUploadBase64,
		output: PdfcoEndpointOutputSchemas.fileUploadBase64,
	},
	pdfToJson: {
		input: PdfcoEndpointInputSchemas.pdfToJson,
		output: PdfcoEndpointOutputSchemas.pdfToJson,
	},
	pdfToCsv: {
		input: PdfcoEndpointInputSchemas.pdfToCsv,
		output: PdfcoEndpointOutputSchemas.pdfToCsv,
	},
	pdfToHtml: {
		input: PdfcoEndpointInputSchemas.pdfToHtml,
		output: PdfcoEndpointOutputSchemas.pdfToHtml,
	},
	pdfToImage: {
		input: PdfcoEndpointInputSchemas.pdfToImage,
		output: PdfcoEndpointOutputSchemas.pdfToImage,
	},
	pdfToText: {
		input: PdfcoEndpointInputSchemas.pdfToText,
		output: PdfcoEndpointOutputSchemas.pdfToText,
	},
	pdfToXls: {
		input: PdfcoEndpointInputSchemas.pdfToXls,
		output: PdfcoEndpointOutputSchemas.pdfToXls,
	},
	pdfToXlsx: {
		input: PdfcoEndpointInputSchemas.pdfToXlsx,
		output: PdfcoEndpointOutputSchemas.pdfToXlsx,
	},
	pdfToXml: {
		input: PdfcoEndpointInputSchemas.pdfToXml,
		output: PdfcoEndpointOutputSchemas.pdfToXml,
	},
	excelToCsv: {
		input: PdfcoEndpointInputSchemas.excelToCsv,
		output: PdfcoEndpointOutputSchemas.excelToCsv,
	},
	excelToHtml: {
		input: PdfcoEndpointInputSchemas.excelToHtml,
		output: PdfcoEndpointOutputSchemas.excelToHtml,
	},
	excelToJson: {
		input: PdfcoEndpointInputSchemas.excelToJson,
		output: PdfcoEndpointOutputSchemas.excelToJson,
	},
	excelToText: {
		input: PdfcoEndpointInputSchemas.excelToText,
		output: PdfcoEndpointOutputSchemas.excelToText,
	},
	excelToXml: {
		input: PdfcoEndpointInputSchemas.excelToXml,
		output: PdfcoEndpointOutputSchemas.excelToXml,
	},
	pdfFromHtml: {
		input: PdfcoEndpointInputSchemas.pdfFromHtml,
		output: PdfcoEndpointOutputSchemas.pdfFromHtml,
	},
	pdfFromEmail: {
		input: PdfcoEndpointInputSchemas.pdfFromEmail,
		output: PdfcoEndpointOutputSchemas.pdfFromEmail,
	},
	pdfFromText: {
		input: PdfcoEndpointInputSchemas.pdfFromText,
		output: PdfcoEndpointOutputSchemas.pdfFromText,
	},
	pdfAdd: {
		input: PdfcoEndpointInputSchemas.pdfAdd,
		output: PdfcoEndpointOutputSchemas.pdfAdd,
	},
	pdfMerge: {
		input: PdfcoEndpointInputSchemas.pdfMerge,
		output: PdfcoEndpointOutputSchemas.pdfMerge,
	},
	pdfSplit: {
		input: PdfcoEndpointInputSchemas.pdfSplit,
		output: PdfcoEndpointOutputSchemas.pdfSplit,
	},
	pdfDeletePages: {
		input: PdfcoEndpointInputSchemas.pdfDeletePages,
		output: PdfcoEndpointOutputSchemas.pdfDeletePages,
	},
	pdfRotate: {
		input: PdfcoEndpointInputSchemas.pdfRotate,
		output: PdfcoEndpointOutputSchemas.pdfRotate,
	},
	pdfFind: {
		input: PdfcoEndpointInputSchemas.pdfFind,
		output: PdfcoEndpointOutputSchemas.pdfFind,
	},
	pdfSearchAndReplaceText: {
		input: PdfcoEndpointInputSchemas.pdfSearchAndReplaceText,
		output: PdfcoEndpointOutputSchemas.pdfSearchAndReplaceText,
	},
	pdfSearchAndDeleteText: {
		input: PdfcoEndpointInputSchemas.pdfSearchAndDeleteText,
		output: PdfcoEndpointOutputSchemas.pdfSearchAndDeleteText,
	},
	pdfInfoReader: {
		input: PdfcoEndpointInputSchemas.pdfInfoReader,
		output: PdfcoEndpointOutputSchemas.pdfInfoReader,
	},
	pdfFormsInfoReader: {
		input: PdfcoEndpointInputSchemas.pdfFormsInfoReader,
		output: PdfcoEndpointOutputSchemas.pdfFormsInfoReader,
	},
	pdfExtractAttachments: {
		input: PdfcoEndpointInputSchemas.pdfExtractAttachments,
		output: PdfcoEndpointOutputSchemas.pdfExtractAttachments,
	},
	pdfChangeTextSearchable: {
		input: PdfcoEndpointInputSchemas.pdfChangeTextSearchable,
		output: PdfcoEndpointOutputSchemas.pdfChangeTextSearchable,
	},
	documentParser: {
		input: PdfcoEndpointInputSchemas.documentParser,
		output: PdfcoEndpointOutputSchemas.documentParser,
	},
	jobCheck: {
		input: PdfcoEndpointInputSchemas.jobCheck,
		output: PdfcoEndpointOutputSchemas.jobCheck,
	},
	barcodeGenerate: {
		input: PdfcoEndpointInputSchemas.barcodeGenerate,
		output: PdfcoEndpointOutputSchemas.barcodeGenerate,
	},
	accountBalance: {
		input: PdfcoEndpointInputSchemas.accountBalance,
		output: PdfcoEndpointOutputSchemas.accountBalance,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof pdfcoEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const pdfcoEndpointMeta = {
	fileUpload: {
		riskLevel: 'write',
		description: 'Upload a file URL to PDF.co storage',
	},
	fileUploadBase64: {
		riskLevel: 'write',
		description: 'Upload base64 content to PDF.co storage',
	},
	pdfToJson: { riskLevel: 'read', description: 'Convert PDF to JSON' },
	pdfToCsv: { riskLevel: 'read', description: 'Convert PDF to CSV' },
	pdfToHtml: { riskLevel: 'read', description: 'Convert PDF to HTML' },
	pdfToImage: { riskLevel: 'read', description: 'Convert PDF pages to images' },
	pdfToText: { riskLevel: 'read', description: 'Convert PDF to plain text' },
	pdfToXls: { riskLevel: 'read', description: 'Convert PDF to XLS' },
	pdfToXlsx: { riskLevel: 'read', description: 'Convert PDF to XLSX' },
	pdfToXml: { riskLevel: 'read', description: 'Convert PDF to XML' },
	excelToCsv: { riskLevel: 'read', description: 'Convert Excel to CSV' },
	excelToHtml: { riskLevel: 'read', description: 'Convert Excel to HTML' },
	excelToJson: { riskLevel: 'read', description: 'Convert Excel to JSON' },
	excelToText: {
		riskLevel: 'read',
		description: 'Convert Excel to plain text',
	},
	excelToXml: { riskLevel: 'read', description: 'Convert Excel to XML' },
	pdfFromHtml: {
		riskLevel: 'write',
		description: 'Generate PDF from HTML markup',
	},
	pdfFromEmail: {
		riskLevel: 'write',
		description: 'Convert an email file to PDF',
	},
	pdfFromText: {
		riskLevel: 'write',
		description: 'Convert a text document to PDF',
	},
	pdfAdd: {
		riskLevel: 'write',
		description: 'Overlay text, images, or form values on a PDF',
	},
	pdfMerge: { riskLevel: 'write', description: 'Merge multiple PDFs into one' },
	pdfSplit: {
		riskLevel: 'write',
		description: 'Split a PDF into multiple files',
	},
	pdfDeletePages: {
		riskLevel: 'write',
		description: 'Delete pages from a PDF',
	},
	pdfRotate: { riskLevel: 'write', description: 'Rotate selected PDF pages' },
	pdfFind: {
		riskLevel: 'read',
		description: 'Find text and coordinates in a PDF',
	},
	pdfSearchAndReplaceText: {
		riskLevel: 'write',
		description: 'Search and replace text in a PDF',
	},
	pdfSearchAndDeleteText: {
		riskLevel: 'write',
		description: 'Search and delete text in a PDF',
	},
	pdfInfoReader: {
		riskLevel: 'read',
		description: 'Read PDF metadata and properties',
	},
	pdfFormsInfoReader: {
		riskLevel: 'read',
		description: 'Read PDF form field info',
	},
	pdfExtractAttachments: {
		riskLevel: 'read',
		description: 'Extract embedded PDF attachments',
	},
	pdfChangeTextSearchable: {
		riskLevel: 'write',
		description: 'Make scanned PDF text searchable with OCR',
	},
	documentParser: {
		riskLevel: 'read',
		description: 'Extract structured data with a parser template',
	},
	jobCheck: { riskLevel: 'read', description: 'Check an async job status' },
	barcodeGenerate: {
		riskLevel: 'write',
		description: 'Generate a barcode image',
	},
	accountBalance: {
		riskLevel: 'read',
		description: 'Get remaining PDF.co credit balance',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pdfcoEndpointsNested>;

export const pdfcoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePdfcoPlugin<T extends PdfcoPluginOptions> = CorsairPlugin<
	'pdfco',
	typeof PdfcoSchema,
	typeof pdfcoEndpointsNested,
	// No webhook support in this plugin; the empty object keeps the
	// webhook surface explicitly closed.
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
		keyBuilder: async (
			ctx: PdfcoKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('pdfco', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('pdfco', 'api_key');
		},
	} satisfies InternalPdfcoPlugin;
}

export type {
	AccountBalanceInput,
	AccountBalanceResponse,
	BarcodeGenerateInput,
	BarcodeGenerateResponse,
	DocumentParserInput,
	DocumentParserResponse,
	ExcelToCsvInput,
	ExcelToCsvResponse,
	ExcelToHtmlInput,
	ExcelToHtmlResponse,
	ExcelToJsonInput,
	ExcelToJsonResponse,
	ExcelToTextInput,
	ExcelToTextResponse,
	ExcelToXmlInput,
	ExcelToXmlResponse,
	FileUploadBase64Input,
	FileUploadBase64Response,
	FileUploadInput,
	FileUploadResponse,
	JobCheckInput,
	JobCheckResponse,
	PdfAddInput,
	PdfAddResponse,
	PdfChangeTextSearchableInput,
	PdfChangeTextSearchableResponse,
	PdfcoEndpointInputs,
	PdfcoEndpointOutputs,
	PdfDeletePagesInput,
	PdfDeletePagesResponse,
	PdfExtractAttachmentsInput,
	PdfExtractAttachmentsResponse,
	PdfFindInput,
	PdfFindResponse,
	PdfFormsInfoReaderInput,
	PdfFormsInfoReaderResponse,
	PdfFromEmailInput,
	PdfFromEmailResponse,
	PdfFromHtmlInput,
	PdfFromHtmlResponse,
	PdfFromTextInput,
	PdfFromTextResponse,
	PdfInfoReaderInput,
	PdfInfoReaderResponse,
	PdfMergeInput,
	PdfMergeResponse,
	PdfRotateInput,
	PdfRotateResponse,
	PdfSearchAndDeleteTextInput,
	PdfSearchAndDeleteTextResponse,
	PdfSearchAndReplaceTextInput,
	PdfSearchAndReplaceTextResponse,
	PdfSplitInput,
	PdfSplitResponse,
	PdfToCsvInput,
	PdfToCsvResponse,
	PdfToHtmlInput,
	PdfToHtmlResponse,
	PdfToImageInput,
	PdfToImageResponse,
	PdfToJsonInput,
	PdfToJsonResponse,
	PdfToTextInput,
	PdfToTextResponse,
	PdfToXlsInput,
	PdfToXlsResponse,
	PdfToXlsxInput,
	PdfToXlsxResponse,
	PdfToXmlInput,
	PdfToXmlResponse,
} from './endpoints/types';
