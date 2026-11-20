import { asRecord } from 'corsair/core';
import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** The source document: base64 content, a blob reference or an HTTPS URL. */
const docContent = z
	.string()
	.min(1)
	.describe(
		'Source file: base64 content, a pdf4meblobid://<id> reference, or an https URL',
	);

const docName = z
	.string()
	.min(1)
	.describe(
		'Source file name including its extension; the API dispatches on it',
	);

/** Parameters every processing action accepts, as the docs document them. */
const sharedParams = {
	jobIdExt: z
		.string()
		.optional()
		.describe('Your own reference for this call, stored with the API call log'),
	isAsync: z
		.boolean()
		.optional()
		.describe(
			'Process asynchronously and return a job to poll at jobs.status (only honoured by actions that support it)',
		),
	callBackUrl: z
		.string()
		.url()
		.optional()
		.describe('URL notified when an asynchronous job completes'),
};

/** The async job status answer, as GetActionStatus returns it. */
export const JobStatusSchema = z
	.object({
		jobId: z.string().nullish().describe('Job id'),
		isSuccess: z
			.boolean()
			.nullish()
			.describe('Whether the job finished successfully'),
		isWorking: z
			.boolean()
			.nullish()
			.describe('Whether the job is still running'),
		isFinished: z
			.boolean()
			.nullish()
			.describe('Whether the job reached a terminal state'),
		hasFailed: z.boolean().nullish().describe('Whether the job failed'),
		jobStatusText: z.string().nullish().describe('Human-readable job status'),
		blobId: z.string().nullish().describe('Blob id of the result document'),
	})
	.loose()
	.describe('An asynchronous processing job status');
export type JobStatus = z.infer<typeof JobStatusSchema>;

/** A processed file the API answers with, per the docs' JSON response shape. */
export const FileOutputSchema = z
	.object({
		fileName: z
			.string()
			.nullish()
			.describe('File name of the produced document'),
		fileContent: z
			.string()
			.nullish()
			.describe('The produced document, base64-encoded'),
	})
	.loose()
	.describe('A produced document');
export type FileOutput = z.infer<typeof FileOutputSchema>;

/**
 * Shapes a binary answer (the raw merged PDF) or a JSON file answer into
 * the FileOutput contract.
 */
// unknown: raw is the untouched response body — binary bytes, the docs'
// JSON file shape or plain text — so the shaper stays untyped.
export function shapeBinaryFile(raw: unknown): unknown {
	// Binary mode hands back { bytes, contentType } even when the API answers
	// its documented JSON shape ({ "File Content", "File Name" }), so JSON
	// bytes are decoded before anything else.
	const file = (raw ?? {}) as {
		bytes?: Uint8Array;
		contentType?: string | null;
	} | null;
	if (file?.bytes && file.bytes.byteLength > 0) {
		const contentType = file.contentType ?? '';
		if (contentType.includes('json')) {
			try {
				const parsed = JSON.parse(
					Buffer.from(file.bytes).toString('utf8'),
				) as unknown;
				const record = asRecord(parsed);
				if (record && typeof record['File Content'] === 'string') {
					return {
						fileName:
							typeof record['File Name'] === 'string'
								? record['File Name']
								: undefined,
						fileContent: record['File Content'],
					};
				}
			} catch {
				// unknown: JSON.parse throws with any value; falling through to
				// the file interpretation is correct either way.
			}
		}
		return {
			fileName: undefined,
			fileContent: Buffer.from(file.bytes).toString('base64'),
		};
	}
	// Some actions answer the JSON shape without binary mode at all.
	const record = asRecord(raw);
	if (record && typeof record['File Content'] === 'string') {
		return {
			fileName:
				typeof record['File Name'] === 'string'
					? record['File Name']
					: undefined,
			fileContent: record['File Content'],
		};
	}
	if (typeof raw === 'string' && raw.length > 0) {
		// A bare base64 answer, as some actions return.
		return { fileName: undefined, fileContent: raw };
	}
	return raw;
}

// ── pdf ────────────────────────────────────────────────────────────────────

export const MergePdfsInputSchema = z
	.object({
		docContent: z
			.array(docContent)
			.min(2)
			.describe(
				'The PDFs to merge, base64-encoded; array order is the merge order',
			),
		docName: docName,
		...sharedParams,
	})
	.describe('Merge multiple PDFs into one; the API answers the merged PDF');
export type MergePdfsInput = z.infer<typeof MergePdfsInputSchema>;

export const MergePdfsOutputSchema = FileOutputSchema.describe(
	'The merged PDF, base64-encoded (the API answers raw binary)',
);
export type MergePdfsOutput = z.infer<typeof MergePdfsOutputSchema>;

export const SplitPdfInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		splitMode: z
			.enum(['pages', 'text', 'barcode', 'swissQr'])
			.optional()
			.describe('Splitting strategy the API applies'),
		splitPageNr: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Split before this page number (pages mode)'),
		textSeparator: z
			.string()
			.optional()
			.describe('Text the API splits on (text mode)'),
		...sharedParams,
	})
	.describe('Split a PDF into multiple documents');
export type SplitPdfInput = z.infer<typeof SplitPdfInputSchema>;

export const SplitPdfOutputSchema = FileOutputSchema.describe(
	'The split result; a zip of the parts when the API answers a file',
);
export type SplitPdfOutput = z.infer<typeof SplitPdfOutputSchema>;

export const CompressPdfInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		optimizeProfile: z
			.enum(['Max', 'Web', 'Print', 'Default'])
			.optional()
			.describe(
				'Compression profile; Default is mapped to Max server-side; an unknown value fails with 400',
			),
		...sharedParams,
	})
	.describe('Compress a PDF; the API answers the compressed PDF');
export type CompressPdfInput = z.infer<typeof CompressPdfInputSchema>;

export const CompressPdfOutputSchema = FileOutputSchema.describe(
	'The compressed PDF, base64-encoded',
);
export type CompressPdfOutput = z.infer<typeof CompressPdfOutputSchema>;

export const ExtractPagesInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		pageNumbers: z
			.array(z.number().int().min(1))
			.min(1)
			.optional()
			.describe('Page numbers to extract'),
		...sharedParams,
	})
	.describe('Extract pages from a PDF');
export type ExtractPagesInput = z.infer<typeof ExtractPagesInputSchema>;

export const ExtractPagesOutputSchema = FileOutputSchema.describe(
	'The PDF holding the extracted pages',
);
export type ExtractPagesOutput = z.infer<typeof ExtractPagesOutputSchema>;

export const DeletePagesInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		pageNumbers: z
			.array(z.number().int().min(1))
			.min(1)
			.optional()
			.describe('Page numbers to delete'),
		...sharedParams,
	})
	.describe('Delete pages from a PDF');
export type DeletePagesInput = z.infer<typeof DeletePagesInputSchema>;

export const DeletePagesOutputSchema = FileOutputSchema.describe(
	'The PDF without the deleted pages',
);
export type DeletePagesOutput = z.infer<typeof DeletePagesOutputSchema>;

export const GetPdfInfoInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
	})
	.describe('Read the metadata of a PDF');
export type GetPdfInfoInput = z.infer<typeof GetPdfInfoInputSchema>;

export const GetPdfInfoOutputSchema = z
	.object({})
	.loose()
	.describe('PDF metadata: page count, dimensions, author and more');
export type GetPdfInfoOutput = z.infer<typeof GetPdfInfoOutputSchema>;

// ── convert ────────────────────────────────────────────────────────────────

export const ConvertPdfToWordInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		docType: z
			.enum(['docx', 'doc', 'rtf', 'text'])
			.optional()
			.describe('Word format the API produces'),
		...sharedParams,
	})
	.describe('Convert a PDF to a Word document');
export type ConvertPdfToWordInput = z.infer<typeof ConvertPdfToWordInputSchema>;

export const ConvertPdfToWordOutputSchema = FileOutputSchema.describe(
	'The produced Word document, base64-encoded',
);
export type ConvertPdfToWordOutput = z.infer<
	typeof ConvertPdfToWordOutputSchema
>;

export const ConvertHtmlToPdfInputSchema = z
	.object({
		htmlContent: z
			.string()
			.min(1)
			.describe('HTML content to render into a PDF'),
		docName: docName,
		...sharedParams,
	})
	.describe('Render HTML into a PDF');
export type ConvertHtmlToPdfInput = z.infer<typeof ConvertHtmlToPdfInputSchema>;

export const ConvertHtmlToPdfOutputSchema = FileOutputSchema.describe(
	'The rendered PDF, base64-encoded',
);
export type ConvertHtmlToPdfOutput = z.infer<
	typeof ConvertHtmlToPdfOutputSchema
>;

// ── convert: OCR ───────────────────────────────────────────────────────────

export const OcrPdfInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		ocrWhenNeeded: z
			.boolean()
			.optional()
			.describe(
				'Run OCR only when the document needs it (documented mixed field type)',
			),
		ocrLang: z.string().optional().describe('OCR language code, e.g. eng'),
		...sharedParams,
	})
	.describe('Run OCR on a scanned PDF to make its text editable');
export type OcrPdfInput = z.infer<typeof OcrPdfInputSchema>;

export const OcrPdfOutputSchema = FileOutputSchema.describe(
	'The OCR-processed PDF, base64-encoded',
);
export type OcrPdfOutput = z.infer<typeof OcrPdfOutputSchema>;

// ── extract ────────────────────────────────────────────────────────────────

export const ExtractTableInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		...sharedParams,
	})
	.describe('Extract tables from a PDF');
export type ExtractTableInput = z.infer<typeof ExtractTableInputSchema>;

export const ExtractTableOutputSchema = z
	.object({})
	.loose()
	.describe('The extracted tables');
export type ExtractTableOutput = z.infer<typeof ExtractTableOutputSchema>;

export const ExtractFormFieldsInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		...sharedParams,
	})
	.describe('Extract the values of filled PDF form fields');
export type ExtractFormFieldsInput = z.infer<
	typeof ExtractFormFieldsInputSchema
>;

export const ExtractFormFieldsOutputSchema = z
	.object({})
	.loose()
	.describe('The extracted form field values');
export type ExtractFormFieldsOutput = z.infer<
	typeof ExtractFormFieldsOutputSchema
>;

// ── jobs ───────────────────────────────────────────────────────────────────

export const GetJobStatusInputSchema = z
	.object({
		jobId: z.string().min(1).describe('Job id the async answer returned'),
	})
	.describe('Read the status of an asynchronous processing job');
export type GetJobStatusInput = z.infer<typeof GetJobStatusInputSchema>;

export const GetJobStatusOutputSchema = JobStatusSchema;
export type GetJobStatusOutput = z.infer<typeof GetJobStatusOutputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const Pdf4meEndpointInputSchemas = {
	pdfMerge: MergePdfsInputSchema,
	pdfSplit: SplitPdfInputSchema,
	pdfCompress: CompressPdfInputSchema,
	pdfExtractPages: ExtractPagesInputSchema,
	pdfDeletePages: DeletePagesInputSchema,
	pdfGetInfo: GetPdfInfoInputSchema,
	convertPdfToWord: ConvertPdfToWordInputSchema,
	convertHtmlToPdf: ConvertHtmlToPdfInputSchema,
	convertOcrPdf: OcrPdfInputSchema,
	extractTableFromPdf: ExtractTableInputSchema,
	extractPdfFormData: ExtractFormFieldsInputSchema,
	jobsStatus: GetJobStatusInputSchema,
};

export const Pdf4meEndpointOutputSchemas = {
	pdfMerge: MergePdfsOutputSchema,
	pdfSplit: SplitPdfOutputSchema,
	pdfCompress: CompressPdfOutputSchema,
	pdfExtractPages: ExtractPagesOutputSchema,
	pdfDeletePages: DeletePagesOutputSchema,
	pdfGetInfo: GetPdfInfoOutputSchema,
	convertPdfToWord: ConvertPdfToWordOutputSchema,
	convertHtmlToPdf: ConvertHtmlToPdfOutputSchema,
	convertOcrPdf: OcrPdfOutputSchema,
	extractTableFromPdf: ExtractTableOutputSchema,
	extractPdfFormData: ExtractFormFieldsOutputSchema,
	jobsStatus: GetJobStatusOutputSchema,
};

export type Pdf4meEndpointInputs = {
	[K in keyof typeof Pdf4meEndpointInputSchemas]: z.input<
		(typeof Pdf4meEndpointInputSchemas)[K]
	>;
};

export type Pdf4meEndpointOutputs = {
	[K in keyof typeof Pdf4meEndpointOutputSchemas]: z.infer<
		(typeof Pdf4meEndpointOutputSchemas)[K]
	>;
};
