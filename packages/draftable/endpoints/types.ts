import { z } from 'zod';

// ── Shared pieces ───────────────────────────────────────────────────────────

const ComparisonId = z
	.string()
	.min(1)
	.describe(
		'Comparison identifier from comparisons.list or comparisons.create.',
	);

const FileType = z
	.enum(['pdf', 'docx', 'docm', 'doc', 'rtf', 'pptx', 'pptm', 'ppt', 'txt'])
	.describe('File type of the document.');

const SideInput = z.object({
	source_url: z
		.string()
		.url()
		.describe('Public URL Draftable downloads the document from.'),
	file_type: FileType,
	display_name: z
		.string()
		.min(1)
		.optional()
		.describe('Name shown in the comparison viewer.'),
});

const Text = z.string().nullable().optional();
const Num = z.number().nullable().optional();

const SideSchema = z
	.object({
		file_type: Text,
		source_url: Text,
		display_name: Text,
		page_count: Num,
		original_document_size_bytes: Num,
		highlighted_document_size_bytes: Num,
	})
	.passthrough();

export const ComparisonSchema = z
	.object({
		identifier: z.string(),
		comparison_type: Text,
		viewer_url: Text,
		left: SideSchema.nullable().optional(),
		right: SideSchema.nullable().optional(),
		creation_time: Text,
		expiry_time: Text,
		public: z.boolean().nullable().optional(),
		ready: z.boolean().nullable().optional(),
		ready_time: Text,
		failed: z.boolean().nullable().optional(),
		error_message: Text,
	})
	.passthrough();

export type DraftableComparison = z.infer<typeof ComparisonSchema>;

const ExportKind = z
	.enum(['single_page', 'combined', 'left', 'right'])
	.describe(
		'single_page: the right document only, with highlights and deletion markers showing the changes; combined: both documents side by side; left or right: that document only.',
	);

const ExportSchema = z
	.object({
		identifier: z.string(),
		comparison: Text,
		kind: Text,
		ready: z.boolean().nullable().optional(),
		failed: z.boolean().nullable().optional(),
		url: Text,
		error_message: Text,
		include_cover_page: z.boolean().nullable().optional(),
	})
	.passthrough();

// ── comparisons ─────────────────────────────────────────────────────────────

export const ListComparisonsInputSchema = z.object({
	limit: z.number().int().positive().optional().describe('Page size.'),
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Number of comparisons to skip.'),
});

export const ListComparisonsResponseSchema = z
	.object({
		count: z.number(),
		limit: Num,
		offset: Num,
		results: z.array(ComparisonSchema),
	})
	.passthrough();

export const GetComparisonInputSchema = z.object({ identifier: ComparisonId });
export const GetComparisonResponseSchema = ComparisonSchema;

export const CreateComparisonInputSchema = z.object({
	left: SideInput.describe('The original document.'),
	right: SideInput.describe('The new document.'),
	identifier: z
		.string()
		.min(1)
		.max(1024)
		.regex(/^[A-Za-z0-9_.-]+$/)
		.optional()
		.describe(
			'Your own unique id for the comparison. Draftable makes one when omitted.',
		),
	public: z
		.boolean()
		.optional()
		.describe(
			'Let anyone with the viewer link see it. Default false (signed links only).',
		),
	expiry_time: z
		.string()
		.datetime({ offset: true })
		.optional()
		.describe('ISO-8601 time after which Draftable deletes the comparison.'),
});
export const CreateComparisonResponseSchema = ComparisonSchema;

export const DeleteComparisonInputSchema = z.object({
	identifier: ComparisonId,
});
export const DeleteComparisonResponseSchema = z.object({
	identifier: z.string(),
	deleted: z.literal(true),
});

export const GetViewerUrlInputSchema = z.object({
	identifier: ComparisonId,
	valid_for_minutes: z
		.number()
		.int()
		.min(1)
		.max(60 * 24 * 30)
		.optional()
		.describe(
			'How long a signed link stays valid. Default 30 minutes. Ignored for public comparisons.',
		),
	wait: z
		.boolean()
		.optional()
		.describe(
			'Show a loading page until the comparison is ready instead of an error.',
		),
});
export const GetViewerUrlResponseSchema = z.object({
	identifier: z.string(),
	url: z.string(),
	signed: z.boolean(),
	valid_until: z.string().nullable(),
});

// ── exports ─────────────────────────────────────────────────────────────────

export const CreateExportInputSchema = z.object({
	comparison: ComparisonId,
	kind: ExportKind,
	include_cover_page: z
		.boolean()
		.optional()
		.describe('Add a cover page (combined exports only).'),
});
export const CreateExportResponseSchema = ExportSchema;

export const GetExportInputSchema = z.object({
	identifier: z
		.string()
		.min(1)
		.describe('Export identifier from exports.create.'),
});
export const GetExportResponseSchema = ExportSchema;

// ── Types ───────────────────────────────────────────────────────────────────

export type ListComparisonsInput = z.infer<typeof ListComparisonsInputSchema>;
export type ListComparisonsResponse = z.infer<
	typeof ListComparisonsResponseSchema
>;
export type GetComparisonInput = z.infer<typeof GetComparisonInputSchema>;
export type GetComparisonResponse = z.infer<typeof GetComparisonResponseSchema>;
export type CreateComparisonInput = z.infer<typeof CreateComparisonInputSchema>;
export type CreateComparisonResponse = z.infer<
	typeof CreateComparisonResponseSchema
>;
export type DeleteComparisonInput = z.infer<typeof DeleteComparisonInputSchema>;
export type DeleteComparisonResponse = z.infer<
	typeof DeleteComparisonResponseSchema
>;
export type GetViewerUrlInput = z.infer<typeof GetViewerUrlInputSchema>;
export type GetViewerUrlResponse = z.infer<typeof GetViewerUrlResponseSchema>;
export type CreateExportInput = z.infer<typeof CreateExportInputSchema>;
export type CreateExportResponse = z.infer<typeof CreateExportResponseSchema>;
export type GetExportInput = z.infer<typeof GetExportInputSchema>;
export type GetExportResponse = z.infer<typeof GetExportResponseSchema>;

export const DraftableEndpointInputSchemas = {
	listComparisons: ListComparisonsInputSchema,
	getComparison: GetComparisonInputSchema,
	createComparison: CreateComparisonInputSchema,
	deleteComparison: DeleteComparisonInputSchema,
	getViewerUrl: GetViewerUrlInputSchema,
	createExport: CreateExportInputSchema,
	getExport: GetExportInputSchema,
} as const;

export const DraftableEndpointOutputSchemas = {
	listComparisons: ListComparisonsResponseSchema,
	getComparison: GetComparisonResponseSchema,
	createComparison: CreateComparisonResponseSchema,
	deleteComparison: DeleteComparisonResponseSchema,
	getViewerUrl: GetViewerUrlResponseSchema,
	createExport: CreateExportResponseSchema,
	getExport: GetExportResponseSchema,
} as const;
