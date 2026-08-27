import { z } from 'zod';

const PdfcoStandardResponseSchema = z.object({
	url: z.string().optional(),
	urls: z.array(z.string()).optional(),
	pageCount: z.number().optional(),
	error: z.boolean().default(false),
	message: z.string().optional(),
	status: z.number().optional(),
	body: z.any().optional(),
});

// File Upload
const FileUploadInputSchema = z.object({
	url: z.string().url().describe("Remote URL of the file to upload"),
	name: z.string().optional().describe("Destination file name"),
});
export type FileUploadInput = z.infer<typeof FileUploadInputSchema>;
export type FileUploadResponse = z.infer<typeof PdfcoStandardResponseSchema>;

// PDF to JSON
const PdfToJsonInputSchema = z.object({
	url: z.string().url().describe("Remote URL of the PDF to convert"),
	inline: z.boolean().optional().describe("Return JSON inline in the body"),
});
export type PdfToJsonInput = z.infer<typeof PdfToJsonInputSchema>;
export type PdfToJsonResponse = z.infer<typeof PdfcoStandardResponseSchema>;

// PDF Merge
const PdfMergeInputSchema = z.object({
	url: z.string().describe("Comma-separated list of PDF URLs to merge"),
	name: z.string().optional().describe("Result file name"),
});
export type PdfMergeInput = z.infer<typeof PdfMergeInputSchema>;
export type PdfMergeResponse = z.infer<typeof PdfcoStandardResponseSchema>;

// PDF Split
const PdfSplitInputSchema = z.object({
	url: z.string().url().describe("Remote URL of the PDF to split"),
	pages: z.string().describe("Comma-separated list of page numbers or ranges (e.g., '1,3-5,7-')"),
});
export type PdfSplitInput = z.infer<typeof PdfSplitInputSchema>;
export type PdfSplitResponse = z.infer<typeof PdfcoStandardResponseSchema>;

// Document Parser
const DocumentParserInputSchema = z.object({
	url: z.string().url().describe("Remote URL of the PDF document"),
	templateId: z.string().describe("ID of the template created in PDF.co"),
});
export type DocumentParserInput = z.infer<typeof DocumentParserInputSchema>;
export type DocumentParserResponse = z.infer<typeof PdfcoStandardResponseSchema>;

export type PdfcoEndpointInputs = {
	fileUpload: FileUploadInput;
	pdfToJson: PdfToJsonInput;
	pdfMerge: PdfMergeInput;
	pdfSplit: PdfSplitInput;
	documentParser: DocumentParserInput;
};

export type PdfcoEndpointOutputs = {
	fileUpload: FileUploadResponse;
	pdfToJson: PdfToJsonResponse;
	pdfMerge: PdfMergeResponse;
	pdfSplit: PdfSplitResponse;
	documentParser: DocumentParserResponse;
};

export const PdfcoEndpointInputSchemas = {
	fileUpload: FileUploadInputSchema,
	pdfToJson: PdfToJsonInputSchema,
	pdfMerge: PdfMergeInputSchema,
	pdfSplit: PdfSplitInputSchema,
	documentParser: DocumentParserInputSchema,
} as const;

export const PdfcoEndpointOutputSchemas = {
	fileUpload: PdfcoStandardResponseSchema,
	pdfToJson: PdfcoStandardResponseSchema,
	pdfMerge: PdfcoStandardResponseSchema,
	pdfSplit: PdfcoStandardResponseSchema,
	documentParser: PdfcoStandardResponseSchema,
} as const;
