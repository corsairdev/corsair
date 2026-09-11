import { z } from 'zod';

// Minimal context surface used by endpoint implementations. The framework
// passes the full plugin context at runtime; `CorsairEndpoint` is bivariant
// in its context parameter, so this narrow structural type keeps both the
// implementation and unit tests free of type assertions.
export type PdfcoEndpointContext = {
	readonly key: string;
};

// Recursive JSON value: PDF.co documents `profiles` as an object with
// nested values (arrays like ExtractionArea, nested objects) or as a
// serialized JSON string. The recursive union covers both shapes
// without `unknown` or `any`.
export type PdfcoJsonValue =
	| string
	| number
	| boolean
	| null
	| PdfcoJsonValue[]
	| { [key: string]: PdfcoJsonValue };

const PdfcoJsonValueSchema: z.ZodType<PdfcoJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(PdfcoJsonValueSchema),
		z.record(z.string(), PdfcoJsonValueSchema),
	]),
);

const PdfcoProfilesSchema = z
	.union([z.string(), z.record(z.string(), PdfcoJsonValueSchema)])
	.optional()
	.describe(
		'Advanced profiles object or serialized JSON string, see https://developer.pdf.co/api/profiles',
	);

const PdfcoAsyncSchema = z
	.boolean()
	.optional()
	.describe('Run in background and return a jobId for PDF_CO_JOB_CHECK');

const PdfcoNameSchema = z.string().optional().describe('Output file name');

const PdfcoExpirationSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe('Output link lifetime in minutes');

// ─────────────────────────────────────────────────────────────────────────────
// Shared response envelopes (match https://developer.pdf.co/api response tables)
// ─────────────────────────────────────────────────────────────────────────────

const PdfcoBaseResponseSchema = z.object({
	error: z.boolean().default(false),
	message: z.string().optional(),
	status: z.number().optional(),
	name: z.string().optional(),
	credits: z.number().optional(),
	remainingCredits: z.number().optional(),
	jobId: z.string().optional(),
});

const PdfcoFileResponseSchema = PdfcoBaseResponseSchema.extend({
	url: z.string().optional(),
	outputLinkValidTill: z.string().optional(),
	pageCount: z.number().optional(),
});

const PdfcoFilesResponseSchema = PdfcoBaseResponseSchema.extend({
	urls: z.array(z.string()).optional(),
	outputLinkValidTill: z.string().optional(),
	pageCount: z.number().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// File upload
// POST /v1/file/upload/url — https://developer.pdf.co/api/file-upload/upload-url-post
// ─────────────────────────────────────────────────────────────────────────────

const FileUploadInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source file to store'),
	name: z.string().optional().describe('Destination file name'),
});

const FileUploadOutputSchema = PdfcoFileResponseSchema;

export type FileUploadInput = z.infer<typeof FileUploadInputSchema>;
export type FileUploadResponse = z.infer<typeof FileUploadOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// File upload from base64
// POST /v1/file/upload/base64 — https://developer.pdf.co/api/file-upload/upload-base64
// ─────────────────────────────────────────────────────────────────────────────

const FileUploadBase64InputSchema = z.object({
	file: z.string().min(1).describe('Base64-encoded file content'),
	name: z.string().optional().describe('Destination file name'),
	expiration: PdfcoExpirationSchema,
});

const FileUploadBase64OutputSchema = PdfcoFileResponseSchema;

export type FileUploadBase64Input = z.infer<typeof FileUploadBase64InputSchema>;
export type FileUploadBase64Response = z.infer<
	typeof FileUploadBase64OutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF to JSON
// POST /v1/pdf/convert/to/json — https://developer.pdf.co/api/pdf-to-json/basic
// ─────────────────────────────────────────────────────────────────────────────

const PdfToJsonInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z.string().optional().describe('Page indices, e.g. "0,1,2-"'),
	inline: z.boolean().optional().describe('Return JSON inline in body'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfToJsonOutputSchema = PdfcoFileResponseSchema.extend({
	body: z.string().optional(),
});

export type PdfToJsonInput = z.infer<typeof PdfToJsonInputSchema>;
export type PdfToJsonResponse = z.infer<typeof PdfToJsonOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF to CSV
// POST /v1/pdf/convert/to/csv — https://developer.pdf.co/api/pdf-to-csv
// ─────────────────────────────────────────────────────────────────────────────

const PdfToCsvInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z.string().optional().describe('Page indices, e.g. "0,1,2-"'),
	inline: z.boolean().optional().describe('Return CSV inline in body'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfToCsvOutputSchema = PdfcoFileResponseSchema.extend({
	body: z.string().optional(),
});

export type PdfToCsvInput = z.infer<typeof PdfToCsvInputSchema>;
export type PdfToCsvResponse = z.infer<typeof PdfToCsvOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF to HTML
// POST /v1/pdf/convert/to/html — https://developer.pdf.co/api/pdf-to-html
// ─────────────────────────────────────────────────────────────────────────────

const PdfToHtmlInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z.string().optional().describe('Page indices, e.g. "0,1,2-"'),
	inline: z.boolean().optional().describe('Return HTML inline in body'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfToHtmlOutputSchema = PdfcoFileResponseSchema.extend({
	body: z.string().optional(),
});

export type PdfToHtmlInput = z.infer<typeof PdfToHtmlInputSchema>;
export type PdfToHtmlResponse = z.infer<typeof PdfToHtmlOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF to image
// POST /v1/pdf/convert/to/{jpg,png,tiff} — https://developer.pdf.co/api/pdf-to-image/png
// ─────────────────────────────────────────────────────────────────────────────

const PdfToImageInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	format: z
		.enum(['jpg', 'png', 'tiff'])
		.optional()
		.describe(
			'Output image format; selects the /to/jpg, /to/png, or /to/tiff endpoint',
		),
	pages: z.string().optional().describe('Page indices, e.g. "0,1,2-"'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfToImageOutputSchema = PdfcoFilesResponseSchema;

export type PdfToImageInput = z.infer<typeof PdfToImageInputSchema>;
export type PdfToImageResponse = z.infer<typeof PdfToImageOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF to text
// POST /v1/pdf/convert/to/text — https://developer.pdf.co/api/pdf-to-text/basic
// ─────────────────────────────────────────────────────────────────────────────

const PdfToTextInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z.string().optional().describe('Page indices, e.g. "0,1,2-"'),
	inline: z.boolean().optional().describe('Return text inline in body'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfToTextOutputSchema = PdfcoFileResponseSchema.extend({
	body: z.string().optional(),
});

export type PdfToTextInput = z.infer<typeof PdfToTextInputSchema>;
export type PdfToTextResponse = z.infer<typeof PdfToTextOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF to XLS / XLSX
// POST /v1/pdf/convert/to/xls — https://developer.pdf.co/api/pdf-to-excel/xls
// POST /v1/pdf/convert/to/xlsx — https://developer.pdf.co/api/pdf-to-excel/xlsx
// ─────────────────────────────────────────────────────────────────────────────

const PdfToSpreadsheetInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z.string().optional().describe('Page indices, e.g. "0,1,2-"'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfToSpreadsheetOutputSchema = PdfcoFileResponseSchema;

const PdfToXlsInputSchema = PdfToSpreadsheetInputSchema;
const PdfToXlsOutputSchema = PdfToSpreadsheetOutputSchema;
const PdfToXlsxInputSchema = PdfToSpreadsheetInputSchema;
const PdfToXlsxOutputSchema = PdfToSpreadsheetOutputSchema;

export type PdfToXlsInput = z.infer<typeof PdfToXlsInputSchema>;
export type PdfToXlsResponse = z.infer<typeof PdfToXlsOutputSchema>;
export type PdfToXlsxInput = z.infer<typeof PdfToXlsxInputSchema>;
export type PdfToXlsxResponse = z.infer<typeof PdfToXlsxOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF to XML
// POST /v1/pdf/convert/to/xml — https://developer.pdf.co/api/pdf-to-xml
// ─────────────────────────────────────────────────────────────────────────────

const PdfToXmlInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z.string().optional().describe('Page indices, e.g. "0,1,2-"'),
	inline: z.boolean().optional().describe('Return XML inline in body'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfToXmlOutputSchema = PdfcoFileResponseSchema.extend({
	body: z.string().optional(),
});

export type PdfToXmlInput = z.infer<typeof PdfToXmlInputSchema>;
export type PdfToXmlResponse = z.infer<typeof PdfToXmlOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Excel conversions
// POST /v1/xls/convert/to/{csv,html,json,txt,xml}
// https://developer.pdf.co/api/convert-from-excel/csv
// ─────────────────────────────────────────────────────────────────────────────

const ExcelConvertInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source xls/xlsx/csv file'),
	inline: z.boolean().optional().describe('Return converted content inline'),
	worksheetIndex: z.string().optional().describe('Worksheet index, 1-based'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const ExcelConvertOutputSchema = PdfcoFileResponseSchema.extend({
	body: z.string().optional(),
});

const ExcelToCsvInputSchema = ExcelConvertInputSchema;
const ExcelToCsvOutputSchema = ExcelConvertOutputSchema;
const ExcelToHtmlInputSchema = ExcelConvertInputSchema;
const ExcelToHtmlOutputSchema = ExcelConvertOutputSchema;
const ExcelToJsonInputSchema = ExcelConvertInputSchema;
const ExcelToJsonOutputSchema = ExcelConvertOutputSchema;
const ExcelToTextInputSchema = ExcelConvertInputSchema;
const ExcelToTextOutputSchema = ExcelConvertOutputSchema;
const ExcelToXmlInputSchema = ExcelConvertInputSchema;
const ExcelToXmlOutputSchema = ExcelConvertOutputSchema;

export type ExcelToCsvInput = z.infer<typeof ExcelToCsvInputSchema>;
export type ExcelToCsvResponse = z.infer<typeof ExcelToCsvOutputSchema>;
export type ExcelToHtmlInput = z.infer<typeof ExcelToHtmlInputSchema>;
export type ExcelToHtmlResponse = z.infer<typeof ExcelToHtmlOutputSchema>;
export type ExcelToJsonInput = z.infer<typeof ExcelToJsonInputSchema>;
export type ExcelToJsonResponse = z.infer<typeof ExcelToJsonOutputSchema>;
export type ExcelToTextInput = z.infer<typeof ExcelToTextInputSchema>;
export type ExcelToTextResponse = z.infer<typeof ExcelToTextOutputSchema>;
export type ExcelToXmlInput = z.infer<typeof ExcelToXmlInputSchema>;
export type ExcelToXmlResponse = z.infer<typeof ExcelToXmlOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF from HTML
// POST /v1/pdf/convert/from/html — https://developer.pdf.co/api/pdf-from-html/convert
// ─────────────────────────────────────────────────────────────────────────────

const PdfFromHtmlInputSchema = z.object({
	html: z.string().min(1).describe('Raw HTML markup to render as PDF'),
	margins: z
		.string()
		.optional()
		.describe('Margins, e.g. "10px 10px 10px 10px"'),
	paperSize: z
		.string()
		.optional()
		.describe('Paper size, e.g. "A4" or "Letter"'),
	orientation: z
		.enum(['Portrait', 'Landscape'])
		.optional()
		.describe('Page orientation'),
	printBackground: z.boolean().optional().describe('Print CSS backgrounds'),
	header: z.string().optional().describe('HTML header template'),
	footer: z.string().optional().describe('HTML footer template'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfFromHtmlOutputSchema = PdfcoFileResponseSchema;

export type PdfFromHtmlInput = z.infer<typeof PdfFromHtmlInputSchema>;
export type PdfFromHtmlResponse = z.infer<typeof PdfFromHtmlOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF from email
// POST /v1/pdf/convert/from/email — https://developer.pdf.co/api/pdf-from-email
// ─────────────────────────────────────────────────────────────────────────────

const PdfFromEmailInputSchema = z.object({
	url: z.string().url().describe('Public URL of the .msg or .eml file'),
	embedAttachments: z
		.boolean()
		.optional()
		.describe('Embed email attachments into the PDF'),
	convertAttachments: z
		.boolean()
		.optional()
		.describe('Convert convertible attachments to PDF pages'),
	margins: z
		.string()
		.optional()
		.describe('Margins, e.g. "10px 10px 10px 10px"'),
	paperSize: z
		.string()
		.optional()
		.describe('Paper size, e.g. "A4" or "Letter"'),
	orientation: z
		.enum(['Portrait', 'Landscape'])
		.optional()
		.describe('Page orientation'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfFromEmailOutputSchema = PdfcoFileResponseSchema;

export type PdfFromEmailInput = z.infer<typeof PdfFromEmailInputSchema>;
export type PdfFromEmailResponse = z.infer<typeof PdfFromEmailOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Text (DOC/TXT/RTF/PPT) to PDF
// POST /v1/pdf/convert/from/doc — https://developer.pdf.co/api/pdf-from-document/doc
// ─────────────────────────────────────────────────────────────────────────────

const PdfFromTextInputSchema = z.object({
	url: z
		.string()
		.url()
		.describe('Public URL of the TXT/DOC/DOCX/RTF/PPT source file'),
	pages: z.string().optional().describe('Page indices, e.g. "0-"'),
	autosize: z.boolean().optional().describe('Autosize pages to content'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfFromTextOutputSchema = PdfcoFileResponseSchema;

export type PdfFromTextInput = z.infer<typeof PdfFromTextInputSchema>;
export type PdfFromTextResponse = z.infer<typeof PdfFromTextOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Add content to PDF
// POST /v1/pdf/edit/add — https://developer.pdf.co/api/pdf-add
// ─────────────────────────────────────────────────────────────────────────────

const PdfAddAnnotationSchema = z.object({
	text: z
		.string()
		.describe('Text to overlay; supports macros like {{$$PageNumber}}'),
	x: z.number().describe('X coordinate in PDF points from the top-left corner'),
	y: z.number().describe('Y coordinate in PDF points from the top-left corner'),
	type: z.string().optional().describe('text, textField, checkbox, ...'),
	id: z.string().optional().describe('Form field id when type is not text'),
	pages: z.string().optional().describe('Page indices, e.g. "0-"'),
	size: z.number().optional().describe('Font size'),
	color: z.string().optional().describe('Text color in RRGGBB or AARRGGBB'),
	link: z.string().optional().describe('Clickable link for the text'),
	fontName: z.string().optional().describe('Font name, e.g. "Arial"'),
	width: z.number().optional().describe('Text box width in PDF points'),
	height: z.number().optional().describe('Text box height in PDF points'),
	alignment: z.enum(['left', 'center', 'right']).optional(),
});

const PdfAddImageSchema = z.object({
	url: z.string().describe('Image or PDF URL, file token, or datauri: URL'),
	x: z.number().describe('X coordinate in PDF points from the top-left corner'),
	y: z.number().describe('Y coordinate in PDF points from the top-left corner'),
	pages: z.string().optional().describe('Page indices, e.g. "0-"'),
	width: z.number().optional().describe('Image width in PDF points'),
	height: z.number().optional().describe('Image height in PDF points'),
	link: z.string().optional().describe('Clickable link for the image'),
});

const PdfAddFieldSchema = z.object({
	fieldName: z.string().describe('Name of the fillable form field'),
	text: z.string().describe('Value to set for the field'),
	pages: z.string().optional().describe('Page indices, e.g. "0-"'),
});

const PdfAddInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	annotations: z
		.array(PdfAddAnnotationSchema)
		.optional()
		.describe('Text annotations to overlay'),
	images: z.array(PdfAddImageSchema).optional().describe('Images to overlay'),
	fields: z
		.array(PdfAddFieldSchema)
		.optional()
		.describe('Fillable form field values to set'),
	annotationsString: z
		.string()
		.optional()
		.describe('Compact ";"-separated text object notation'),
	imagesString: z
		.string()
		.optional()
		.describe('Compact ";"-separated image object notation'),
	fieldsString: z
		.string()
		.optional()
		.describe('Compact ";"-separated fillable field notation'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfAddOutputSchema = PdfcoFileResponseSchema;

export type PdfAddInput = z.infer<typeof PdfAddInputSchema>;
export type PdfAddResponse = z.infer<typeof PdfAddOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Merge PDFs
// POST /v1/pdf/merge — https://developer.pdf.co/api/merge/pdf
// ─────────────────────────────────────────────────────────────────────────────

const PdfMergeInputSchema = z.object({
	url: z
		.string()
		.refine(
			(value: string) =>
				value
					.split(',')
					.every(
						(part: string) => z.string().url().safeParse(part.trim()).success,
					),
			{ message: 'Must be a comma-separated list of valid URLs' },
		)
		.describe('Comma-separated list of PDF URLs to merge'),
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	async: PdfcoAsyncSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfMergeOutputSchema = PdfcoFileResponseSchema;

export type PdfMergeInput = z.infer<typeof PdfMergeInputSchema>;
export type PdfMergeResponse = z.infer<typeof PdfMergeOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Split PDF
// POST /v1/pdf/split — https://developer.pdf.co/api/pdf-split/by-pages
// ─────────────────────────────────────────────────────────────────────────────

const PdfSplitInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z
		.string()
		.min(1)
		.describe("1-based pages or ranges to keep, e.g. '1-2,3-'"),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfSplitOutputSchema = PdfcoFilesResponseSchema;

export type PdfSplitInput = z.infer<typeof PdfSplitInputSchema>;
export type PdfSplitResponse = z.infer<typeof PdfSplitOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Delete PDF pages
// POST /v1/pdf/edit/delete-pages — https://developer.pdf.co/api/pdf-delete-pages
// ─────────────────────────────────────────────────────────────────────────────

const PdfDeletePagesInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z.string().min(1).describe("1-based pages to delete, e.g. '1-2'"),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfDeletePagesOutputSchema = PdfcoFileResponseSchema;

export type PdfDeletePagesInput = z.infer<typeof PdfDeletePagesInputSchema>;
export type PdfDeletePagesResponse = z.infer<typeof PdfDeletePagesOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Rotate PDF pages
// POST /v1/pdf/edit/rotate — https://developer.pdf.co/api/pdf-rotate/basic
// ─────────────────────────────────────────────────────────────────────────────

const PdfRotateInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	pages: z
		.string()
		.optional()
		.describe('0-based pages to rotate, e.g. "0-2,4"; default all pages'),
	angle: z
		.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)])
		.optional()
		.describe('Clockwise rotation angle in degrees'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfRotateOutputSchema = PdfcoFileResponseSchema.extend({
	fileSize: z.number().optional(),
});

export type PdfRotateInput = z.infer<typeof PdfRotateInputSchema>;
export type PdfRotateResponse = z.infer<typeof PdfRotateOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Find text in PDF
// POST /v1/pdf/find — https://developer.pdf.co/api/pdf-find/basic
// ─────────────────────────────────────────────────────────────────────────────

const PdfFindInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	searchString: z.string().min(1).describe('Text or regex pattern to find'),
	pages: z.string().optional().describe('0-based pages to search; default all'),
	regexSearch: z.boolean().optional().describe('Treat searchString as regex'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfFindMatchSchema = z.object({
	text: z.string().optional(),
	pageIndex: z.number().optional(),
	left: z.number().optional(),
	top: z.number().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
});

const PdfFindOutputSchema = PdfcoBaseResponseSchema.extend({
	body: z.array(PdfFindMatchSchema).optional(),
	pageCount: z.number().optional(),
});

export type PdfFindInput = z.infer<typeof PdfFindInputSchema>;
export type PdfFindResponse = z.infer<typeof PdfFindOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Search and replace text in PDF
// POST /v1/pdf/edit/replace-text
// https://developer.pdf.co/api/pdf-search-text-and-replace/text
// ─────────────────────────────────────────────────────────────────────────────

const PdfSearchAndReplaceTextInputSchema = z
	.object({
		url: z.string().url().describe('Public URL of the source PDF'),
		searchString: z.string().optional().describe('Single text to search for'),
		replaceString: z.string().optional().describe('Replacement text'),
		searchStrings: z
			.array(z.string())
			.optional()
			.describe('Multiple texts to search for, in order'),
		replaceStrings: z
			.array(z.string())
			.optional()
			.describe('Replacements aligned with searchStrings'),
		caseSensitive: z.boolean().optional().describe('Case-sensitive match'),
		regex: z.boolean().optional().describe('Treat search strings as regex'),
		replacementLimit: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe('Max replacements per string; 0 means all'),
		pages: z.string().optional().describe('0-based pages; default all'),
		password: z.string().optional().describe('PDF password if protected'),
		async: PdfcoAsyncSchema,
		name: PdfcoNameSchema,
		expiration: PdfcoExpirationSchema,
		profiles: PdfcoProfilesSchema,
	})
	.refine(
		(value) =>
			(value.searchString !== undefined &&
				value.replaceString !== undefined) ||
			(value.searchStrings !== undefined &&
				value.replaceStrings !== undefined &&
				value.searchStrings.length > 0 &&
				value.searchStrings.length === value.replaceStrings.length),
		{
			message:
				'Provide searchString with replaceString, or non-empty searchStrings with equal-length replaceStrings',
		},
	);

const PdfSearchAndReplaceTextOutputSchema = PdfcoFileResponseSchema;

export type PdfSearchAndReplaceTextInput = z.infer<
	typeof PdfSearchAndReplaceTextInputSchema
>;
export type PdfSearchAndReplaceTextResponse = z.infer<
	typeof PdfSearchAndReplaceTextOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Search and delete text in PDF
// POST /v1/pdf/edit/delete-text
// https://developer.pdf.co/api/pdf-search-text-and-delete
// ─────────────────────────────────────────────────────────────────────────────

const PdfSearchAndDeleteTextInputSchema = z
	.object({
		url: z.string().url().describe('Public URL of the source PDF'),
		searchString: z.string().optional().describe('Single text to delete'),
		searchStrings: z
			.array(z.string())
			.optional()
			.describe('Multiple texts to delete'),
		caseSensitive: z.boolean().optional().describe('Case-sensitive match'),
		regex: z.boolean().optional().describe('Treat search strings as regex'),
		replacementLimit: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe('Max deletions per string; 0 means all'),
		pages: z.string().optional().describe('0-based pages; default all'),
		password: z.string().optional().describe('PDF password if protected'),
		async: PdfcoAsyncSchema,
		name: PdfcoNameSchema,
		expiration: PdfcoExpirationSchema,
		profiles: PdfcoProfilesSchema,
	})
	.refine(
		(value) =>
			value.searchString !== undefined || value.searchStrings !== undefined,
		{ message: 'Provide searchString or searchStrings' },
	);

const PdfSearchAndDeleteTextOutputSchema = PdfcoFileResponseSchema;

export type PdfSearchAndDeleteTextInput = z.infer<
	typeof PdfSearchAndDeleteTextInputSchema
>;
export type PdfSearchAndDeleteTextResponse = z.infer<
	typeof PdfSearchAndDeleteTextOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF info reader
// POST /v1/pdf/info — https://developer.pdf.co/api/pdf-info-reader
// ─────────────────────────────────────────────────────────────────────────────

const PdfInfoReaderInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfDocumentInfoSchema = z.object({
	PageCount: z.number().optional(),
	Author: z.string().optional(),
	Title: z.string().optional(),
	Subject: z.string().optional(),
	Keywords: z.string().optional(),
	Creator: z.string().optional(),
	Producer: z.string().optional(),
	CreationDate: z.string().optional(),
	ModificationDate: z.string().optional(),
	Encrypted: z.boolean().optional(),
});

const PdfInfoReaderOutputSchema = PdfcoBaseResponseSchema.extend({
	info: PdfDocumentInfoSchema.optional(),
});

export type PdfInfoReaderInput = z.infer<typeof PdfInfoReaderInputSchema>;
export type PdfInfoReaderResponse = z.infer<typeof PdfInfoReaderOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PDF forms info reader
// POST /v1/pdf/info/fields — https://developer.pdf.co/api/forms/info-reader
// ─────────────────────────────────────────────────────────────────────────────

const PdfFormsInfoReaderInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfFormFieldSchema = z.object({
	PageIndex: z.number().optional(),
	Type: z.string().optional(),
	FieldName: z.string().optional(),
	Value: z.string().optional(),
	Left: z.number().optional(),
	Top: z.number().optional(),
	Width: z.number().optional(),
	Height: z.number().optional(),
});

const PdfFormsInfoReaderOutputSchema = PdfcoBaseResponseSchema.extend({
	info: PdfDocumentInfoSchema.optional(),
	fields: z.array(PdfFormFieldSchema).optional(),
});

export type PdfFormsInfoReaderInput = z.infer<
	typeof PdfFormsInfoReaderInputSchema
>;
export type PdfFormsInfoReaderResponse = z.infer<
	typeof PdfFormsInfoReaderOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Extract PDF attachments
// POST /v1/pdf/attachments/extract
// https://developer.pdf.co/api/pdf-extract-attachments
// ─────────────────────────────────────────────────────────────────────────────

const PdfExtractAttachmentsInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	inline: z.boolean().optional().describe('Return attachments inline'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfExtractAttachmentsOutputSchema = PdfcoFilesResponseSchema;

export type PdfExtractAttachmentsInput = z.infer<
	typeof PdfExtractAttachmentsInputSchema
>;
export type PdfExtractAttachmentsResponse = z.infer<
	typeof PdfExtractAttachmentsOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Make PDF text searchable (OCR)
// POST /v1/pdf/makesearchable
// https://developer.pdf.co/api/pdf-change-text-searchable/searchable
// ─────────────────────────────────────────────────────────────────────────────

const PdfChangeTextSearchableInputSchema = z.object({
	url: z.string().url().describe('Public URL of the scanned PDF or image'),
	lang: z.string().optional().describe('OCR language, e.g. "eng" or "eng+deu"'),
	pages: z.string().optional().describe('Page indices, e.g. "0,1,2-"'),
	password: z.string().optional().describe('PDF password if protected'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const PdfChangeTextSearchableOutputSchema = PdfcoFileResponseSchema;

export type PdfChangeTextSearchableInput = z.infer<
	typeof PdfChangeTextSearchableInputSchema
>;
export type PdfChangeTextSearchableResponse = z.infer<
	typeof PdfChangeTextSearchableOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Document parser
// POST /v1/pdf/documentparser — https://developer.pdf.co/api/documentparser/parser
// ─────────────────────────────────────────────────────────────────────────────

const DocumentParserInputSchema = z.object({
	url: z.string().url().describe('Public URL of the source PDF'),
	templateId: z.string().optional().describe('Parser template id from PDF.co'),
	template: z.string().optional().describe('Inline YAML parser template'),
	password: z.string().optional().describe('PDF password if protected'),
	inline: z.boolean().optional().describe('Return parsed data inline in body'),
	pages: z.string().optional().describe('Page indices; default all'),
	outputFormat: z
		.enum(['JSON', 'CSV', 'XML'])
		.optional()
		.describe('Parsed output format'),
	async: PdfcoAsyncSchema,
	name: PdfcoNameSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const DocumentParserBodySchema = z.object({
	objects: z.array(z.record(z.string(), PdfcoJsonValueSchema)).optional(),
	elapsed: z.number().optional(),
	templateName: z.string().optional(),
	templateVersion: z.string().optional(),
	timestamp: z.string().optional(),
});

const DocumentParserOutputSchema = PdfcoFileResponseSchema.extend({
	body: DocumentParserBodySchema.optional(),
});

export type DocumentParserInput = z.infer<typeof DocumentParserInputSchema>;
export type DocumentParserResponse = z.infer<typeof DocumentParserOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Check job status
// POST /v1/job/check — https://developer.pdf.co/api/job-check
// ─────────────────────────────────────────────────────────────────────────────

const JobCheckInputSchema = z.object({
	jobId: z.string().min(1).describe('Background job id from an async call'),
});

const JobCheckOutputSchema = PdfcoBaseResponseSchema.extend({
	status: z.enum(['working', 'success', 'failed', 'aborted']).optional(),
	url: z.string().optional(),
	outputLinkValidTill: z.string().optional(),
	pageCount: z.number().optional(),
	jobDuration: z.number().optional(),
	duration: z.number().optional(),
});

export type JobCheckInput = z.infer<typeof JobCheckInputSchema>;
export type JobCheckResponse = z.infer<typeof JobCheckOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Generate barcode
// POST /v1/barcode/generate — https://developer.pdf.co/api/barcode/generate
// ─────────────────────────────────────────────────────────────────────────────

const BarcodeGenerateInputSchema = z.object({
	type: z.string().min(1).describe('Barcode type, e.g. "QRCode" or "Code128"'),
	value: z.string().min(1).describe('Value to encode inside the barcode'),
	name: PdfcoNameSchema,
	inline: z.boolean().optional().describe('Return image inline'),
	decorationImage: z
		.string()
		.optional()
		.describe('Logo image URL embedded inside QR-Code barcodes'),
	async: PdfcoAsyncSchema,
	expiration: PdfcoExpirationSchema,
	profiles: PdfcoProfilesSchema,
});

const BarcodeGenerateOutputSchema = PdfcoFileResponseSchema;

export type BarcodeGenerateInput = z.infer<typeof BarcodeGenerateInputSchema>;
export type BarcodeGenerateResponse = z.infer<
	typeof BarcodeGenerateOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Get account balance
// GET /v1/account/credit/balance
// https://developer.pdf.co/api/account-balance-info
// ─────────────────────────────────────────────────────────────────────────────

const AccountBalanceInputSchema = z.object({});

const AccountBalanceOutputSchema = PdfcoBaseResponseSchema.extend({
	remainingCredits: z.number(),
});

export type AccountBalanceInput = z.infer<typeof AccountBalanceInputSchema>;
export type AccountBalanceResponse = z.infer<typeof AccountBalanceOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint maps
// ─────────────────────────────────────────────────────────────────────────────

export type PdfcoEndpointInputs = {
	fileUpload: FileUploadInput;
	fileUploadBase64: FileUploadBase64Input;
	pdfToJson: PdfToJsonInput;
	pdfToCsv: PdfToCsvInput;
	pdfToHtml: PdfToHtmlInput;
	pdfToImage: PdfToImageInput;
	pdfToText: PdfToTextInput;
	pdfToXls: PdfToXlsInput;
	pdfToXlsx: PdfToXlsxInput;
	pdfToXml: PdfToXmlInput;
	excelToCsv: ExcelToCsvInput;
	excelToHtml: ExcelToHtmlInput;
	excelToJson: ExcelToJsonInput;
	excelToText: ExcelToTextInput;
	excelToXml: ExcelToXmlInput;
	pdfFromHtml: PdfFromHtmlInput;
	pdfFromEmail: PdfFromEmailInput;
	pdfFromText: PdfFromTextInput;
	pdfAdd: PdfAddInput;
	pdfMerge: PdfMergeInput;
	pdfSplit: PdfSplitInput;
	pdfDeletePages: PdfDeletePagesInput;
	pdfRotate: PdfRotateInput;
	pdfFind: PdfFindInput;
	pdfSearchAndReplaceText: PdfSearchAndReplaceTextInput;
	pdfSearchAndDeleteText: PdfSearchAndDeleteTextInput;
	pdfInfoReader: PdfInfoReaderInput;
	pdfFormsInfoReader: PdfFormsInfoReaderInput;
	pdfExtractAttachments: PdfExtractAttachmentsInput;
	pdfChangeTextSearchable: PdfChangeTextSearchableInput;
	documentParser: DocumentParserInput;
	jobCheck: JobCheckInput;
	barcodeGenerate: BarcodeGenerateInput;
	accountBalance: AccountBalanceInput;
};

export type PdfcoEndpointOutputs = {
	fileUpload: FileUploadResponse;
	fileUploadBase64: FileUploadBase64Response;
	pdfToJson: PdfToJsonResponse;
	pdfToCsv: PdfToCsvResponse;
	pdfToHtml: PdfToHtmlResponse;
	pdfToImage: PdfToImageResponse;
	pdfToText: PdfToTextResponse;
	pdfToXls: PdfToXlsResponse;
	pdfToXlsx: PdfToXlsxResponse;
	pdfToXml: PdfToXmlResponse;
	excelToCsv: ExcelToCsvResponse;
	excelToHtml: ExcelToHtmlResponse;
	excelToJson: ExcelToJsonResponse;
	excelToText: ExcelToTextResponse;
	excelToXml: ExcelToXmlResponse;
	pdfFromHtml: PdfFromHtmlResponse;
	pdfFromEmail: PdfFromEmailResponse;
	pdfFromText: PdfFromTextResponse;
	pdfAdd: PdfAddResponse;
	pdfMerge: PdfMergeResponse;
	pdfSplit: PdfSplitResponse;
	pdfDeletePages: PdfDeletePagesResponse;
	pdfRotate: PdfRotateResponse;
	pdfFind: PdfFindResponse;
	pdfSearchAndReplaceText: PdfSearchAndReplaceTextResponse;
	pdfSearchAndDeleteText: PdfSearchAndDeleteTextResponse;
	pdfInfoReader: PdfInfoReaderResponse;
	pdfFormsInfoReader: PdfFormsInfoReaderResponse;
	pdfExtractAttachments: PdfExtractAttachmentsResponse;
	pdfChangeTextSearchable: PdfChangeTextSearchableResponse;
	documentParser: DocumentParserResponse;
	jobCheck: JobCheckResponse;
	barcodeGenerate: BarcodeGenerateResponse;
	accountBalance: AccountBalanceResponse;
};

export const PdfcoEndpointInputSchemas = {
	fileUpload: FileUploadInputSchema,
	fileUploadBase64: FileUploadBase64InputSchema,
	pdfToJson: PdfToJsonInputSchema,
	pdfToCsv: PdfToCsvInputSchema,
	pdfToHtml: PdfToHtmlInputSchema,
	pdfToImage: PdfToImageInputSchema,
	pdfToText: PdfToTextInputSchema,
	pdfToXls: PdfToXlsInputSchema,
	pdfToXlsx: PdfToXlsxInputSchema,
	pdfToXml: PdfToXmlInputSchema,
	excelToCsv: ExcelToCsvInputSchema,
	excelToHtml: ExcelToHtmlInputSchema,
	excelToJson: ExcelToJsonInputSchema,
	excelToText: ExcelToTextInputSchema,
	excelToXml: ExcelToXmlInputSchema,
	pdfFromHtml: PdfFromHtmlInputSchema,
	pdfFromEmail: PdfFromEmailInputSchema,
	pdfFromText: PdfFromTextInputSchema,
	pdfAdd: PdfAddInputSchema,
	pdfMerge: PdfMergeInputSchema,
	pdfSplit: PdfSplitInputSchema,
	pdfDeletePages: PdfDeletePagesInputSchema,
	pdfRotate: PdfRotateInputSchema,
	pdfFind: PdfFindInputSchema,
	pdfSearchAndReplaceText: PdfSearchAndReplaceTextInputSchema,
	pdfSearchAndDeleteText: PdfSearchAndDeleteTextInputSchema,
	pdfInfoReader: PdfInfoReaderInputSchema,
	pdfFormsInfoReader: PdfFormsInfoReaderInputSchema,
	pdfExtractAttachments: PdfExtractAttachmentsInputSchema,
	pdfChangeTextSearchable: PdfChangeTextSearchableInputSchema,
	documentParser: DocumentParserInputSchema,
	jobCheck: JobCheckInputSchema,
	barcodeGenerate: BarcodeGenerateInputSchema,
	accountBalance: AccountBalanceInputSchema,
} as const;

export const PdfcoEndpointOutputSchemas = {
	fileUpload: FileUploadOutputSchema,
	fileUploadBase64: FileUploadBase64OutputSchema,
	pdfToJson: PdfToJsonOutputSchema,
	pdfToCsv: PdfToCsvOutputSchema,
	pdfToHtml: PdfToHtmlOutputSchema,
	pdfToImage: PdfToImageOutputSchema,
	pdfToText: PdfToTextOutputSchema,
	pdfToXls: PdfToXlsOutputSchema,
	pdfToXlsx: PdfToXlsxOutputSchema,
	pdfToXml: PdfToXmlOutputSchema,
	excelToCsv: ExcelToCsvOutputSchema,
	excelToHtml: ExcelToHtmlOutputSchema,
	excelToJson: ExcelToJsonOutputSchema,
	excelToText: ExcelToTextOutputSchema,
	excelToXml: ExcelToXmlOutputSchema,
	pdfFromHtml: PdfFromHtmlOutputSchema,
	pdfFromEmail: PdfFromEmailOutputSchema,
	pdfFromText: PdfFromTextOutputSchema,
	pdfAdd: PdfAddOutputSchema,
	pdfMerge: PdfMergeOutputSchema,
	pdfSplit: PdfSplitOutputSchema,
	pdfDeletePages: PdfDeletePagesOutputSchema,
	pdfRotate: PdfRotateOutputSchema,
	pdfFind: PdfFindOutputSchema,
	pdfSearchAndReplaceText: PdfSearchAndReplaceTextOutputSchema,
	pdfSearchAndDeleteText: PdfSearchAndDeleteTextOutputSchema,
	pdfInfoReader: PdfInfoReaderOutputSchema,
	pdfFormsInfoReader: PdfFormsInfoReaderOutputSchema,
	pdfExtractAttachments: PdfExtractAttachmentsOutputSchema,
	pdfChangeTextSearchable: PdfChangeTextSearchableOutputSchema,
	documentParser: DocumentParserOutputSchema,
	jobCheck: JobCheckOutputSchema,
	barcodeGenerate: BarcodeGenerateOutputSchema,
	accountBalance: AccountBalanceOutputSchema,
} as const;
