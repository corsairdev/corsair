import { z } from 'zod';

/**
 * Shape returned by every job-producing API2PDF endpoint.
 *
 * Verified against a live v2.api2pdf.com response, which returns
 * `{ ResponseId, MbOut, Cost, Seconds, Error, Success, FileUrl }`.
 * Kept loose so additive upstream fields do not break parsing.
 */
export const Api2PdfJobResponseSchema = z
	.object({
		FileUrl: z.string().nullable().optional(),
		MbOut: z.number().nullable().optional(),
		Cost: z.number().nullable().optional(),
		Seconds: z.number().nullable().optional(),
		Success: z.boolean(),
		Error: z.string().nullable().optional(),
		ResponseId: z.string().nullable().optional(),
	})
	.loose();

export type Api2PdfJobResponse = z.infer<typeof Api2PdfJobResponseSchema>;

/** Options accepted by every POST endpoint (see the SDK `_createBaseOptions`). */
const inlineField = z
	.boolean()
	.optional()
	.describe(
		'Serve the file inline rather than as an attachment (default true)',
	);

const fileNameField = z
	.string()
	.optional()
	.describe('Name for the generated file');

export const CheckStatusInputSchema = z.object({});

export type CheckStatusInput = z.infer<typeof CheckStatusInputSchema>;

export const CheckStatusResponseSchema = z.object({
	status: z.string(),
});

export type CheckStatusResponse = z.infer<typeof CheckStatusResponseSchema>;

export const DeletePdfInputSchema = z.object({
	responseId: z.string().min(1).describe('ResponseId from a prior API2PDF job'),
});

export type DeletePdfInput = z.infer<typeof DeletePdfInputSchema>;

export const DeletePdfResponseSchema = z
	.object({
		Success: z.boolean().optional(),
		Error: z.string().nullable().optional(),
	})
	.loose();

export type DeletePdfResponse = z.infer<typeof DeletePdfResponseSchema>;

/** POST /pdfsharp/merge — `Urls` */
export const MergePdfsInputSchema = z.object({
	urls: z
		.array(z.string().url())
		.min(2)
		.describe('Publicly accessible PDF URLs to merge in order'),
	inline: inlineField,
	fileName: fileNameField,
});

export type MergePdfsInput = z.infer<typeof MergePdfsInputSchema>;

/**
 * POST /pdfsharp/extract-pages — `Url`, `Start`, `End`.
 *
 * The spec types Start/End as plain integers with no minimum, and negative
 * offsets count back from the end (-1 is the last page), so no lower bound is
 * imposed here.
 */
export const ExtractPagesInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	start: z
		.number()
		.int()
		.optional()
		.describe(
			'Zero-based index of the first page to extract; negative counts back from the end',
		),
	end: z
		.number()
		.int()
		.optional()
		.describe(
			'Zero-based index of the last page to extract, inclusive; negative counts back from the end',
		),
	inline: inlineField,
	fileName: fileNameField,
});

export type ExtractPagesInput = z.infer<typeof ExtractPagesInputSchema>;

/** POST /pdfsharp/compress — `Url` */
export const OptimizePdfInputSchema = z.object({
	url: z.string().url().describe('Public URL of the PDF to compress'),
	inline: inlineField,
	fileName: fileNameField,
});

export type OptimizePdfInput = z.infer<typeof OptimizePdfInputSchema>;

/**
 * POST /pdfsharp/watermark — `Url`, `Text`, `FontSize`, `Color`, `Opacity`,
 * `Rotation` (field set taken from WatermarkRequestInputDto in the official
 * OpenAPI spec).
 */
export const WatermarkPdfInputSchema = z.object({
	url: z.string().url().describe('Public URL of the PDF to watermark'),
	text: z.string().min(1).describe('Watermark text to stamp on each page'),
	fontSize: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Watermark font size in points'),
	color: z.string().optional().describe('Watermark colour, e.g. "#FF0000"'),
	opacity: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe('Watermark opacity between 0 and 1'),
	rotation: z
		.number()
		.int()
		.optional()
		.describe('Watermark rotation in degrees'),
	inline: inlineField,
	fileName: fileNameField,
});

export type WatermarkPdfInput = z.infer<typeof WatermarkPdfInputSchema>;

/**
 * POST /chrome/pdf/html — `Html` plus an `Options` bag. The three fields used
 * here are documented on HtmlToPdfRequestOptionsInputDto.
 */
export const AddHeaderFooterInputSchema = z.object({
	html: z.string().min(1).describe('HTML content to render as PDF'),
	headerTemplate: z
		.string()
		.optional()
		.describe('HTML template for page header (Headless Chrome)'),
	footerTemplate: z
		.string()
		.optional()
		.describe('HTML template for page footer (Headless Chrome)'),
	displayHeaderFooter: z
		.boolean()
		.optional()
		.describe('Render the header/footer templates (default true)'),
	inline: inlineField,
	fileName: fileNameField,
});

export type AddHeaderFooterInput = z.infer<typeof AddHeaderFooterInputSchema>;

/** POST /libreoffice/thumbnail — `Url` */
export const LibreOfficeThumbnailInputSchema = z.object({
	url: z.string().url().describe('Public URL of PDF or Office document'),
	inline: inlineField,
	fileName: fileNameField,
});

export type LibreOfficeThumbnailInput = z.infer<
	typeof LibreOfficeThumbnailInputSchema
>;

/** POST /libreoffice/pdf-to-html — `Url` */
export const LibreOfficePdfToHtmlInputSchema = z.object({
	url: z.string().url().describe('Public URL of the PDF to convert'),
	inline: inlineField,
	fileName: fileNameField,
});

export type LibreOfficePdfToHtmlInput = z.infer<
	typeof LibreOfficePdfToHtmlInputSchema
>;

/** GET /zebra — `format`, `value`, `height`, `width`, `showlabel` */
export const GenerateBarcodeInputSchema = z.object({
	format: z
		.string()
		.min(1)
		.describe('ZXING barcode format, e.g. QR_CODE, CODE_128, EAN_13'),
	value: z.string().min(1).describe('Value to encode'),
	height: z.number().int().positive().optional(),
	width: z.number().int().positive().optional(),
	showLabel: z
		.boolean()
		.optional()
		.describe('Render the encoded value beneath the barcode'),
});

export type GenerateBarcodeInput = z.infer<typeof GenerateBarcodeInputSchema>;

export type Api2PdfEndpointInputs = {
	checkStatus: CheckStatusInput;
	deletePdf: DeletePdfInput;
	mergePdfs: MergePdfsInput;
	extractPages: ExtractPagesInput;
	optimizePdf: OptimizePdfInput;
	watermarkPdf: WatermarkPdfInput;
	addHeaderFooter: AddHeaderFooterInput;
	libreOfficeThumbnail: LibreOfficeThumbnailInput;
	libreOfficePdfToHtml: LibreOfficePdfToHtmlInput;
	generateBarcode: GenerateBarcodeInput;
};

export type Api2PdfEndpointOutputs = {
	checkStatus: CheckStatusResponse;
	deletePdf: DeletePdfResponse;
	mergePdfs: Api2PdfJobResponse;
	extractPages: Api2PdfJobResponse;
	optimizePdf: Api2PdfJobResponse;
	watermarkPdf: Api2PdfJobResponse;
	addHeaderFooter: Api2PdfJobResponse;
	libreOfficeThumbnail: Api2PdfJobResponse;
	libreOfficePdfToHtml: Api2PdfJobResponse;
	generateBarcode: Api2PdfJobResponse;
};

export const Api2PdfEndpointInputSchemas = {
	checkStatus: CheckStatusInputSchema,
	deletePdf: DeletePdfInputSchema,
	mergePdfs: MergePdfsInputSchema,
	extractPages: ExtractPagesInputSchema,
	optimizePdf: OptimizePdfInputSchema,
	watermarkPdf: WatermarkPdfInputSchema,
	addHeaderFooter: AddHeaderFooterInputSchema,
	libreOfficeThumbnail: LibreOfficeThumbnailInputSchema,
	libreOfficePdfToHtml: LibreOfficePdfToHtmlInputSchema,
	generateBarcode: GenerateBarcodeInputSchema,
} as const;

export const Api2PdfEndpointOutputSchemas = {
	checkStatus: CheckStatusResponseSchema,
	deletePdf: DeletePdfResponseSchema,
	mergePdfs: Api2PdfJobResponseSchema,
	extractPages: Api2PdfJobResponseSchema,
	optimizePdf: Api2PdfJobResponseSchema,
	watermarkPdf: Api2PdfJobResponseSchema,
	addHeaderFooter: Api2PdfJobResponseSchema,
	libreOfficeThumbnail: Api2PdfJobResponseSchema,
	libreOfficePdfToHtml: Api2PdfJobResponseSchema,
	generateBarcode: Api2PdfJobResponseSchema,
} as const;
