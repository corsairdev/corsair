import { z } from 'zod';

export const Api2PdfJobResponseSchema = z
	.object({
		FileUrl: z.string().nullable().optional(),
		MbOut: z.number().nullable().optional(),
		Cost: z.number().nullable().optional(),
		Success: z.boolean(),
		Error: z.string().nullable().optional(),
		ResponseId: z.string().nullable().optional(),
	})
	.loose();

export type Api2PdfJobResponse = z.infer<typeof Api2PdfJobResponseSchema>;

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

export const MergePdfsInputSchema = z.object({
	urls: z
		.array(z.string().url())
		.min(2)
		.describe('Publicly accessible PDF URLs to merge in order'),
	inline: z.boolean().optional(),
	fileName: z.string().optional(),
});

export type MergePdfsInput = z.infer<typeof MergePdfsInputSchema>;

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
	displayHeaderFooter: z.boolean().optional(),
	inline: z.boolean().optional(),
	fileName: z.string().optional(),
});

export type AddHeaderFooterInput = z.infer<typeof AddHeaderFooterInputSchema>;

export const ExtractPagesInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	start: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based start page index (inclusive)'),
	end: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based end page index (exclusive)'),
	inline: z.boolean().optional(),
	fileName: z.string().optional(),
});

export type ExtractPagesInput = z.infer<typeof ExtractPagesInputSchema>;

export const ReorderPagesInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z
		.array(z.number().int().min(0))
		.min(1)
		.describe('Zero-based page indices in desired order, e.g. [2,0,1]'),
	inline: z.boolean().optional(),
	fileName: z.string().optional(),
});

export type ReorderPagesInput = z.infer<typeof ReorderPagesInputSchema>;

export const OptimizePdfInputSchema = z.object({
	url: z.string().url().describe('Public URL of the PDF to compress'),
	inline: z.boolean().optional(),
	fileName: z.string().optional(),
});

export type OptimizePdfInput = z.infer<typeof OptimizePdfInputSchema>;

export const GenerateBarcodeInputSchema = z.object({
	format: z.string().min(1).describe('Barcode format (e.g. QR_CODE, CODE_128)'),
	value: z.string().min(1).describe('Value to encode'),
	height: z.number().int().positive().optional(),
	width: z.number().int().positive().optional(),
	showLabel: z.boolean().optional(),
});

export type GenerateBarcodeInput = z.infer<typeof GenerateBarcodeInputSchema>;

export const LibreOfficeThumbnailInputSchema = z.object({
	url: z.string().url().describe('Public URL of PDF or Office document'),
	inline: z.boolean().optional(),
	fileName: z.string().optional(),
});

export type LibreOfficeThumbnailInput = z.infer<
	typeof LibreOfficeThumbnailInputSchema
>;

export const LibreOfficePdfToHtmlInputSchema = z.object({
	url: z.string().url().describe('Public URL of the PDF to convert'),
	inline: z.boolean().optional(),
	fileName: z.string().optional(),
});

export type LibreOfficePdfToHtmlInput = z.infer<
	typeof LibreOfficePdfToHtmlInputSchema
>;

export type Api2PdfEndpointInputs = {
	checkStatus: CheckStatusInput;
	deletePdf: DeletePdfInput;
	mergePdfs: MergePdfsInput;
	addHeaderFooter: AddHeaderFooterInput;
	extractPages: ExtractPagesInput;
	reorderPages: ReorderPagesInput;
	optimizePdf: OptimizePdfInput;
	generateBarcode: GenerateBarcodeInput;
	libreOfficeThumbnail: LibreOfficeThumbnailInput;
	libreOfficePdfToHtml: LibreOfficePdfToHtmlInput;
};

export type Api2PdfEndpointOutputs = {
	checkStatus: CheckStatusResponse;
	deletePdf: DeletePdfResponse;
	mergePdfs: Api2PdfJobResponse;
	addHeaderFooter: Api2PdfJobResponse;
	extractPages: Api2PdfJobResponse;
	reorderPages: Api2PdfJobResponse;
	optimizePdf: Api2PdfJobResponse;
	generateBarcode: Api2PdfJobResponse;
	libreOfficeThumbnail: Api2PdfJobResponse;
	libreOfficePdfToHtml: Api2PdfJobResponse;
};

export const Api2PdfEndpointInputSchemas = {
	checkStatus: CheckStatusInputSchema,
	deletePdf: DeletePdfInputSchema,
	mergePdfs: MergePdfsInputSchema,
	addHeaderFooter: AddHeaderFooterInputSchema,
	extractPages: ExtractPagesInputSchema,
	reorderPages: ReorderPagesInputSchema,
	optimizePdf: OptimizePdfInputSchema,
	generateBarcode: GenerateBarcodeInputSchema,
	libreOfficeThumbnail: LibreOfficeThumbnailInputSchema,
	libreOfficePdfToHtml: LibreOfficePdfToHtmlInputSchema,
} as const;

export const Api2PdfEndpointOutputSchemas = {
	checkStatus: CheckStatusResponseSchema,
	deletePdf: DeletePdfResponseSchema,
	mergePdfs: Api2PdfJobResponseSchema,
	addHeaderFooter: Api2PdfJobResponseSchema,
	extractPages: Api2PdfJobResponseSchema,
	reorderPages: Api2PdfJobResponseSchema,
	optimizePdf: Api2PdfJobResponseSchema,
	generateBarcode: Api2PdfJobResponseSchema,
	libreOfficeThumbnail: Api2PdfJobResponseSchema,
	libreOfficePdfToHtml: Api2PdfJobResponseSchema,
} as const;
