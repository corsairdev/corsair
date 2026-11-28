import { FileOutputSchema } from 'corsair/http';
import { z } from 'zod';

// Inputs use DocRaptor's own parameter names. Outputs are `.loose()` and
// their optional fields nullish, because the status endpoint sends fields
// conditionally: download_url and number_of_pages exist only on completed,
// validation_errors only on failed, and message only when there is one.
// Field reference: https://docraptor.com/documentation/api

// ── shared document create input ──────────────────────────────────────────

const DOCUMENT_TYPES = ['pdf', 'xls', 'xlsx'] as const;

const PrinceOptionsSchema = z.object({
	baseurl: z
		.string()
		.optional()
		.describe('The base URL for assets referenced by the document.'),
	no_xinclude: z.boolean().optional().describe('Disable XML inclusion.'),
	no_network: z.boolean().optional().describe('Disable network access.'),
	no_parallel_downloads: z
		.boolean()
		.optional()
		.describe(
			'Disable parallel fetching of assets. Useful when the asset host rate-limits hard.',
		),
	http_user: z
		.string()
		.optional()
		.describe('The user for HTTP authentication while fetching assets.'),
	http_password: z
		.string()
		.optional()
		.describe('The password for HTTP authentication while fetching assets.'),
	http_proxy: z.string().optional().describe('The HTTP proxy server.'),
	http_timeout: z
		.number()
		.int()
		.optional()
		.describe('The HTTP request timeout while fetching assets, in seconds.'),
	insecure: z.boolean().optional().describe('Disable SSL verification.'),
	media: z
		.string()
		.optional()
		.describe('The CSS media type. Defaults to print; screen for web styles.'),
	no_author_style: z
		.boolean()
		.optional()
		.describe('Ignore author stylesheets.'),
	no_default_style: z
		.boolean()
		.optional()
		.describe('Ignore default stylesheets.'),
	no_embed_fonts: z.boolean().optional().describe('Disable font embedding.'),
	no_subset_fonts: z
		.boolean()
		.optional()
		.describe('Disable font subsetting in PDFs.'),
	no_compress: z.boolean().optional().describe('Disable PDF compression.'),
	encrypt: z.boolean().optional().describe('Encrypt PDF output.'),
	key_bits: z
		.union([z.literal(40), z.literal(128)])
		.optional()
		.describe('The encryption key size.'),
	user_password: z
		.string()
		.optional()
		.describe('The PDF user password, used with `encrypt`.'),
	owner_password: z
		.string()
		.optional()
		.describe('The PDF owner password, used with `encrypt`.'),
	disallow_print: z.boolean().optional().describe('Disallow printing.'),
	disallow_copy: z.boolean().optional().describe('Disallow copying.'),
	disallow_annotate: z.boolean().optional().describe('Disallow annotation.'),
	disallow_modify: z.boolean().optional().describe('Disallow modification.'),
	debug: z.boolean().optional().describe('Enable Prince debug mode.'),
	input: z
		.enum(['html', 'xml', 'auto'])
		.optional()
		.describe('The input format. Defaults to html.'),
	javascript: z
		.boolean()
		.optional()
		.describe('Enable PrinceXML JavaScript parsing.'),
	css_dpi: z
		.number()
		.int()
		.optional()
		.describe('The DPI when rendering CSS. Defaults to 96.'),
	profile: z.string().optional().describe('The PDF profile (PDF/A etc.).'),
	pdf_title: z.string().optional().describe('The PDF title metadata.'),
	iframes: z.boolean().nullish().describe('Enable loading of iframes.'),
	page_margin: z.string().optional().describe('The page margin distance.'),
	pdf_forms: z
		.boolean()
		.optional()
		.describe('Make PDF form fields editable by default.'),
});

// The schema requires `name`, but the live docs make it optional and their
// own minimal example omits it, so it stays optional here.
const DocCreateBaseSchema = z.object({
	type: z
		.enum(DOCUMENT_TYPES)
		.describe(
			'The document type. Excel types expect XML content and validate it strictly.',
		),
	name: z.string().optional().describe('A name for identifying the document.'),
	document_content: z
		.string()
		.optional()
		.describe('The HTML or XML content to transform.'),
	document_url: z
		.string()
		.min(1)
		.optional()
		.describe('A URL whose content is fetched and transformed.'),
	// Sent on every create: DocRaptor's own default is false (billed), so
	// the plugin fills in true unless the caller asks for a real document.
	test: z
		.boolean()
		.default(true)
		.describe(
			'Test mode: not charged, watermarked (PDF) or cut to 20 rows (Excel). Defaults to true; set false to make a billed document.',
		),
	strict: z
		.enum(['none', 'html'])
		.optional()
		.describe('Force strict HTML validation.'),
	javascript: z
		.boolean()
		.optional()
		.describe('Enable DocRaptor JavaScript parsing.'),
	ignore_resource_errors: z
		.boolean()
		.optional()
		.describe(
			'Failed loading of images, stylesheets and scripts does not stop rendering. Defaults to true.',
		),
	ignore_console_messages: z
		.boolean()
		.optional()
		.describe(
			'Prevent console.log from stopping rendering during JavaScript execution. Defaults to true on Pipeline 7 and later, false on older pipelines.',
		),
	tag: z
		.string()
		.optional()
		.describe('A small amount of metadata stored with the document.'),
	help: z
		.boolean()
		.optional()
		.describe('Request support help with this request if it succeeds.'),
	pipeline: z
		.string()
		.optional()
		.describe('A specific DocRaptor Pipeline version to use.'),
	referrer: z
		.string()
		.optional()
		.describe('The HTTP referrer set while generating.'),
	callback_url: z
		.string()
		.optional()
		.describe(
			'Receives a POST with download_url and download_id after an asynchronous document succeeds; never called on failure.',
		),
	prince_options: PrinceOptionsSchema.optional(),
});

// The API requires exactly one content source and rejects both-or-neither.
function refineDocumentSource(
	value: { document_content?: string; document_url?: string },
	issue: { addIssue: (input: { code: 'custom'; message: string }) => void },
): void {
	if (!!value.document_content === !!value.document_url) {
		issue.addIssue({
			code: 'custom',
			message: 'Exactly one of document_content or document_url is required',
		});
	}
}

export const DocCreateInputSchema =
	DocCreateBaseSchema.superRefine(refineDocumentSource);

export type DocCreateInput = z.input<typeof DocCreateInputSchema>;

// Hosted documents take two extra parameters: how many times the public URL
// can be fetched, and when it stops being available.
const HostedDocCreateBaseSchema = DocCreateBaseSchema.extend({
	hosted_download_limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'How many times the hosted document can be downloaded. Unlimited when omitted.',
		),
	hosted_expires_at: z
		.string()
		.datetime({ offset: true, local: true })
		.optional()
		.describe(
			'When the hosted document is removed, as an ISO 8601 datetime, like 1981-01-23T08:02:30-05:00; without an offset DocRaptor reads it as UTC.',
		),
});

export const HostedDocCreateInputSchema =
	HostedDocCreateBaseSchema.superRefine(refineDocumentSource);

export type HostedDocCreateInput = z.input<typeof HostedDocCreateInputSchema>;

// ── documents.createAsync / createHostedAsync ─────────────────────────────

const AsyncDocResponseSchema = z
	.object({
		status_id: z.string().describe('The id to poll with `documents.status`.'),
	})
	.loose();

export type AsyncDocResponse = z.infer<typeof AsyncDocResponseSchema>;

// ── documents.status ──────────────────────────────────────────────────────

const StatusInputSchema = z.object({
	statusId: z
		.string()
		.min(1)
		.describe('The `status_id` returned by an async create.'),
});

export type StatusInput = z.input<typeof StatusInputSchema>;

// `status` is the only field always present; the rest appear conditionally.
// download_id and status_id are kept apart on purpose even though they have
// matched in practice.
const DocStatusSchema = z
	.object({
		status: z.string().describe('One of queued, working, completed or failed.'),
		download_id: z
			.string()
			.nullish()
			.describe('The id for downloading, present when completed.'),
		download_url: z
			.string()
			.nullish()
			.describe(
				'Where the document can be fetched, present when completed. Limited fetches; do not cache.',
			),
		number_of_pages: z
			.number()
			.int()
			.nullish()
			.describe('PDF pages, present when completed.'),
		message: z.string().nullish().describe('Additional information.'),
		validation_errors: z
			.string()
			.nullish()
			.describe('Error information, present when failed.'),
	})
	.loose();

export type DocStatus = z.infer<typeof DocStatusSchema>;

// ── documents.createHosted ────────────────────────────────────────────────

// Hosted creation generates synchronously and answers the finished
// document's public URL directly. Unverified against a real hosted account.
const HostedDocResponseSchema = z
	.object({
		download_id: z.string(),
		download_url: z.string(),
		number_of_pages: z.number().int().nullish(),
	})
	.loose();

export type HostedDocResponse = z.infer<typeof HostedDocResponseSchema>;

// ── documents.list ────────────────────────────────────────────────────────

export const DOCRAPTOR_DEFAULT_PER_PAGE = 100;

const DocumentsListInputSchema = z.object({
	page: z.number().int().positive().optional().describe('1-based page.'),
	per_page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(`Defaults to ${DOCRAPTOR_DEFAULT_PER_PAGE}.`),
});

export type DocumentsListInput = z.input<typeof DocumentsListInputSchema>;

// The listing's record fields are unverified: DocRaptor denies GET /docs.json
// to test-mode keys with an empty 403 body, so the row shape comes from no
// probe. Rows pass through as whatever the account sends.
const DocumentListRecordSchema = z.record(z.string(), z.unknown());

const DocumentsListResponseSchema = z.object({
	documents: z.array(DocumentListRecordSchema),
	page: z.number(),
	per_page: z.number(),
	next_page: z
		.number()
		.nullable()
		.describe(
			'The next page while this one is full; null once a page comes back short. A full last page leads to one empty page.',
		),
});

export type DocumentsListResponse = z.infer<typeof DocumentsListResponseSchema>;

// ── documents.expire ──────────────────────────────────────────────────────

const ExpireInputSchema = z.object({
	downloadId: z
		.string()
		.min(1)
		.describe("The hosted document's `download_id`."),
});

export type ExpireInput = z.input<typeof ExpireInputSchema>;

// Success is documented as an empty 200, so the endpoint builds the answer.
const ExpireResponseSchema = z.object({
	success: z.literal(true),
});

export type ExpireResponse = z.infer<typeof ExpireResponseSchema>;

// ── ips.list ──────────────────────────────────────────────────────────────

const IpsListInputSchema = z.object({});

export type IpsListInput = z.input<typeof IpsListInputSchema>;

const IpsListResponseSchema = z.object({
	ips: z.array(z.string()),
});

export type IpsListResponse = z.infer<typeof IpsListResponseSchema>;

// ── documents.create / documents.download ─────────────────────────────────

// POST /docs and GET /download/{id} answer with the document itself
// (application/pdf, or an Excel type). The bytes come back as core's file
// output: base64 under the inline limit, else a host-kept fileId.
const DocumentFileSchema = FileOutputSchema;

export type DocumentFile = z.infer<typeof DocumentFileSchema>;

const DownloadInputSchema = z.object({
	downloadId: z
		.string()
		.min(1)
		.describe(
			'The `download_id` from documents.status once an async document has completed.',
		),
});

export type DownloadInput = z.input<typeof DownloadInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type DocRaptorEndpointInputs = {
	documentsCreate: DocCreateInput;
	documentsDownload: DownloadInput;
	documentsCreateAsync: DocCreateInput;
	documentsCreateHosted: HostedDocCreateInput;
	documentsCreateHostedAsync: HostedDocCreateInput;
	documentsStatus: StatusInput;
	documentsList: DocumentsListInput;
	documentsExpire: ExpireInput;
	ipsList: IpsListInput;
};

export type DocRaptorEndpointOutputs = {
	documentsCreate: DocumentFile;
	documentsDownload: DocumentFile;
	documentsCreateAsync: AsyncDocResponse;
	documentsCreateHosted: HostedDocResponse;
	documentsCreateHostedAsync: AsyncDocResponse;
	documentsStatus: DocStatus;
	documentsList: DocumentsListResponse;
	documentsExpire: ExpireResponse;
	ipsList: IpsListResponse;
};

export const DocRaptorEndpointInputSchemas = {
	documentsCreate: DocCreateInputSchema,
	documentsDownload: DownloadInputSchema,
	documentsCreateAsync: DocCreateInputSchema,
	documentsCreateHosted: HostedDocCreateInputSchema,
	documentsCreateHostedAsync: HostedDocCreateInputSchema,
	documentsStatus: StatusInputSchema,
	documentsList: DocumentsListInputSchema,
	documentsExpire: ExpireInputSchema,
	ipsList: IpsListInputSchema,
} as const;

export const DocRaptorEndpointOutputSchemas = {
	documentsCreate: DocumentFileSchema,
	documentsDownload: DocumentFileSchema,
	documentsCreateAsync: AsyncDocResponseSchema,
	documentsCreateHosted: HostedDocResponseSchema,
	documentsCreateHostedAsync: AsyncDocResponseSchema,
	documentsStatus: DocStatusSchema,
	documentsList: DocumentsListResponseSchema,
	documentsExpire: ExpireResponseSchema,
	ipsList: IpsListResponseSchema,
} as const;
