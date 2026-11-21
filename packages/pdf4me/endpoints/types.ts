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

/** Pages as numbers or the API's own "1,3,5-7" string; sent as the string. */
const pageNumbers = z.union([
	z.array(z.number().int().min(1)).min(1),
	z
		.string()
		.regex(
			/^\s*\d+(\s*-\s*\d+)?(\s*,\s*\d+(\s*-\s*\d+)?)*\s*$/,
			'Expected pages like 1,3,5-7',
		),
]);

/** The API takes pages as one "1,3,5-7" string. */
export function pageList(
	pages: number[] | string | undefined,
): string | undefined {
	if (pages === undefined) return undefined;
	return Array.isArray(pages) ? pages.join(',') : pages.replace(/\s+/g, '');
}

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

/** The job fields an async answer (202) and GetActionStatus carry. */
const jobFields = {
	jobId: z.string().nullish().describe('Job id; poll it with jobs.status'),
	status: z
		.string()
		.nullish()
		.describe('Job state the API reports, e.g. Accepted'),
	statusUrl: z.string().nullish().describe('GetActionStatus URL for this job'),
	message: z.string().nullish().describe('The API message about the job'),
};

/** A produced document, one part of a split. */
export const FilePartSchema = z
	.object({
		fileName: z.string().nullish().describe('File name of this part'),
		fileContent: z.string().nullish().describe('This part, base64-encoded'),
	})
	.loose()
	.describe('One produced document');

/**
 * What a processing call answers: the produced file (base64), the parts of
 * a split, or, when isAsync was set, the job to poll.
 */
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
		documents: z
			.array(FilePartSchema)
			.optional()
			.describe('The produced documents, when the action makes several'),
		...jobFields,
	})
	.loose()
	.describe('A produced document, or the job when isAsync was set');
export type FileOutput = z.infer<typeof FileOutputSchema>;

/** The async job status answer, as GetActionStatus returns it. */
export const JobStatusSchema = z
	.object({
		...jobFields,
		isFinished: z
			.boolean()
			.nullish()
			.describe('True once GetActionStatus answered the finished file'),
		fileName: z
			.string()
			.nullish()
			.describe('File name of the result, once finished'),
		fileContent: z
			.string()
			.nullish()
			.describe('The result document, base64-encoded, once finished'),
	})
	.loose()
	.describe('An asynchronous processing job status');
export type JobStatus = z.infer<typeof JobStatusSchema>;

// unknown: a JSON answer of any action, narrowed by asRecord.
function fileFromRecord(record: Record<string, unknown>): unknown {
	// Most actions: { "File Name", "File Content" }. OCR: { docName, docContent }.
	// Split parts: { fileName, streamFile } (live, 2026-11-21).
	const content =
		record['File Content'] ??
		record.fileContent ??
		record.docContent ??
		record.streamFile;
	const name = record['File Name'] ?? record.fileName ?? record.docName;
	const parts = record['splited Documents'] ?? record['splitedDocuments'];
	const out: Record<string, unknown> = {};
	if (typeof content === 'string') out.fileContent = content;
	if (typeof name === 'string') out.fileName = name;
	if (Array.isArray(parts)) {
		out.documents = parts.map((part) => {
			const partRecord = asRecord(part);
			return partRecord ? fileFromRecord(partRecord) : part;
		});
	}
	for (const key of ['jobId', 'status', 'statusUrl', 'message'] as const) {
		if (record[key] !== undefined) out[key] = record[key];
	}
	return Object.keys(out).length > 0 ? out : record;
}

/** Decodes a binary-mode answer: JSON when the bytes are JSON, else the file. */
// unknown: raw is the untouched response body (binary bytes, JSON or text).
function decodeAnswer(
	raw: unknown,
): { json: unknown } | { file: string } | { other: unknown } {
	const file = asRecord(raw) as {
		bytes?: Uint8Array;
		contentType?: string | null;
	} | null;
	if (file?.bytes instanceof Uint8Array) {
		// An empty answer is no file; never report one.
		if (file.bytes.byteLength === 0) return { other: {} };
		const text = Buffer.from(file.bytes).toString('utf8');
		const looksJson =
			(file.contentType ?? '').includes('json') || /^\s*[{[]/.test(text);
		if (looksJson) {
			try {
				return { json: JSON.parse(text) as unknown };
			} catch {
				// Not JSON after all; it is the produced file.
			}
		}
		return { file: Buffer.from(file.bytes).toString('base64') };
	}
	if (typeof raw === 'string' && raw.length > 0) return { file: raw };
	return asRecord(raw) ? { json: raw } : { other: raw };
}

/**
 * Shapes a processing answer into the FileOutput contract: the raw file
 * (merge, finished jobs), the documented JSON file shapes, the parts of a
 * split, or the 202 job answer when isAsync was set (all seen live).
 */
// unknown: raw is the untouched response body; the output schema checks the result.
export function shapeBinaryFile(raw: unknown): unknown {
	const answer = decodeAnswer(raw);
	if ('file' in answer) return { fileContent: answer.file };
	if ('json' in answer) {
		const record = asRecord(answer.json);
		return record ? fileFromRecord(record) : answer.json;
	}
	return answer.other;
}

/**
 * Shapes a GetActionStatus answer: JSON while the job runs, the produced
 * file itself once it has finished (seen live).
 */
// unknown: raw is the untouched response body; the output schema checks the result.
export function shapeJobStatus(raw: unknown, jobId: string): unknown {
	const answer = decodeAnswer(raw);
	if ('file' in answer) {
		return { jobId, isFinished: true, fileContent: answer.file };
	}
	if ('json' in answer) {
		const record = asRecord(answer.json);
		if (!record) return answer.json;
		const shaped = asRecord(fileFromRecord(record)) ?? {};
		return {
			jobId,
			...record,
			...shaped,
			isFinished:
				typeof record.isFinished === 'boolean'
					? record.isFinished
					: typeof shaped.fileContent === 'string',
		};
	}
	return answer.other;
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
		splitAction: z
			.enum([
				'SplitAfterPage',
				'RecurringSplitAfterPage',
				'SplitSequence',
				'SplitRanges',
			])
			.optional()
			.describe('How to split'),
		splitActionNumber: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe(
				'Page to split after (SplitAfterPage) or every N pages (RecurringSplitAfterPage)',
			),
		splitSequence: z
			.array(z.number().int().min(1))
			.optional()
			.describe('Pages to split after (SplitSequence)'),
		splitRanges: z
			.string()
			.optional()
			.describe('Page ranges, one document each, e.g. "1-2,3" (SplitRanges)'),
		fileNaming: z
			.string()
			.optional()
			.describe('How parts are named, e.g. NameAsPerOrder'),
		...sharedParams,
	})
	.describe('Split a PDF into multiple documents');
export type SplitPdfInput = z.infer<typeof SplitPdfInputSchema>;

export const SplitPdfOutputSchema = FileOutputSchema.describe(
	'The split result; the parts are in documents',
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
		pageNumbers: pageNumbers.describe('Pages to extract: [1, 3] or "1,3,5-7"'),
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
		pageNumbers: pageNumbers.describe('Pages to delete: [1, 3] or "1,3,5-7"'),
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
	.object({
		title: z.string().nullish().describe('Document title'),
		subject: z.string().nullish().describe('Document subject'),
		author: z.string().nullish().describe('Document author'),
		creator: z.string().nullish().describe('Creating application'),
		producer: z.string().nullish().describe('Producing application'),
		keywords: z.string().nullish().describe('Document keywords'),
		pageCount: z.number().nullish().describe('Number of pages'),
		size: z.number().nullish().describe('File size in bytes'),
		pdfVersion: z.string().nullish().describe('PDF version, e.g. 1.4'),
		pdfCompliance: z.string().nullish().describe('PDF/A compliance, if any'),
		documentId: z.string().nullish().describe('PDF document id'),
		isEncrypted: z.boolean().nullish().describe('Whether the PDF is encrypted'),
		isLinearized: z
			.boolean()
			.nullish()
			.describe('Whether the PDF is linearized'),
		isSigned: z.boolean().nullish().describe('Whether the PDF is signed'),
		creationDate: z.string().nullish().describe('Creation date'),
		modDate: z.string().nullish().describe('Last modification date'),
		pageHeightInMM: z.number().nullish().describe('First page height, mm'),
		pageWidthInMM: z.number().nullish().describe('First page width, mm'),
		orientation: z
			.string()
			.nullish()
			.describe('Orientation as the API spells it (Potrait, Landscape)'),
	})
	.loose()
	.describe('PDF metadata: page count, dimensions, author and more');
export type GetPdfInfoOutput = z.infer<typeof GetPdfInfoOutputSchema>;

// ── convert ────────────────────────────────────────────────────────────────

export const ConvertPdfToWordInputSchema = z
	.object({
		docContent: docContent,
		docName: docName,
		qualityType: z
			.enum(['Draft', 'High'])
			.optional()
			.describe('Conversion quality; other values are refused'),
		ocrWhenNeeded: z.boolean().optional().describe('Run OCR on scanned pages'),
		language: z
			.string()
			.optional()
			.describe('Document language for OCR, e.g. English'),
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
			.describe('HTML to render into a PDF; the plugin base64-encodes it'),
		docName: z
			.string()
			.min(1)
			.describe('Name of the HTML source including .html, e.g. page.html'),
		layout: z
			.enum(['Portrait', 'Landscape'])
			.optional()
			.describe('Page layout'),
		format: z
			.enum([
				'A0',
				'A1',
				'A2',
				'A3',
				'A4',
				'A5',
				'A6',
				'A7',
				'A8',
				'Legal',
				'Tabloid',
				'Statement',
				'Executive',
			])
			.optional()
			.describe('Page format; A4 when unset'),
		scale: z
			.number()
			.positive()
			.optional()
			.describe('Render scale; 0.8 when unset'),
		topMargin: z.string().optional().describe('CSS length, e.g. 40px'),
		bottomMargin: z.string().optional().describe('CSS length, e.g. 40px'),
		leftMargin: z.string().optional().describe('CSS length, e.g. 40px'),
		rightMargin: z.string().optional().describe('CSS length, e.g. 40px'),
		printBackground: z
			.boolean()
			.optional()
			.describe('Print CSS backgrounds; true when unset'),
		displayHeaderFooter: z
			.boolean()
			.optional()
			.describe('Show the header and footer; false when unset'),
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
		qualityType: z.enum(['Draft', 'High']).optional().describe('OCR quality'),
		ocrWhenNeeded: z
			.boolean()
			.optional()
			.describe('Run OCR only when the document needs it'),
		language: z.string().optional().describe('Document language, e.g. English'),
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
	.object({
		// unknown: cells are whatever the table holds (text, numbers, nulls).
		// The docs show { tables }; the API answers { tableList } (live).
		tableList: z
			.array(
				z
					.object({
						pageNumber: z.number().nullish().describe('Page the table is on'),
						// unknown: rows of cells holding text, numbers or nulls.
						table: z.array(z.unknown()).nullish().describe('The table rows'),
					})
					.loose(),
			)
			.nullish()
			.describe('One entry per page with its table rows'),
	})
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
	.object({
		// The docs show { formFields }; the API answers { formData }, keyed by
		// field name (live).
		formData: z
			// unknown: a field value is text, a checkbox state or a list.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Form field values keyed by field name'),
	})
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
