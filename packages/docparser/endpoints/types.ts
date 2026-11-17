import { z } from 'zod';
import {
	DocparserModelEntity,
	DocparserParserEntity,
	DocparserPingEntity,
} from '../schema/database';

// ── Inputs ──────────────────────────────────────────────────────────────────

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

const ParserId = z
	.string()
	.regex(/^[A-Za-z0-9]+$/)
	.describe('Parser id from parsers.list.');
const DocumentId = z
	.string()
	.regex(/^[A-Za-z0-9]+$/)
	.describe('Document id from documents.fetch, documents.upload or results.');

export const ParserIdInputSchema = z.object({ parserId: ParserId });
export type ParserIdInput = z.infer<typeof ParserIdInputSchema>;

const Format = z
	.enum(['object', 'flat'])
	.optional()
	.describe(
		'object (default) keeps nested fields; flat returns key/value pairs.',
	);

export const ResultsInputSchema = z.object({
	parserId: ParserId,
	format: Format,
	list: z
		.enum(['last_uploaded', 'uploaded_after', 'processed_after'])
		.optional()
		.describe(
			'last_uploaded (default) returns the newest documents; the other two need date.',
		),
	date: z
		.union([z.string().min(1), z.number().int().nonnegative()])
		.optional()
		.describe(
			'ISO 8601 date or UNIX time. Required with uploaded_after or processed_after.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(10000)
		.optional()
		.describe('Documents to return. Docparser defaults to 100.'),
	offset: z.number().int().min(0).optional(),
	remoteId: z
		.string()
		.min(1)
		.optional()
		.describe('Only documents imported with this remote id.'),
	includeProcessingQueue: z
		.boolean()
		.optional()
		.describe('Also return documents that are not fully processed yet.'),
	sortBy: z
		.enum([
			'parsed_at',
			'processed_at',
			'uploaded_at',
			'first_processed_at',
			'imported_at',
			'integrated_at',
			'dispatched_webhook_at',
			'preprocessed_at',
		])
		.optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
export type ResultsInput = z.infer<typeof ResultsInputSchema>;

export const ResultInputSchema = z.object({
	parserId: ParserId,
	documentId: DocumentId,
	format: Format,
	includeChildren: z
		.boolean()
		.optional()
		.describe('Also return documents split off this one during preprocessing.'),
});
export type ResultInput = z.infer<typeof ResultInputSchema>;

export const DocumentInputSchema = z.object({
	parserId: ParserId,
	documentId: DocumentId,
});
export type DocumentInput = z.infer<typeof DocumentInputSchema>;

const RemoteId = z
	.string()
	.min(1)
	.max(255)
	.optional()
	.describe('Your own id for the document; it comes back with the results.');

export const FetchDocumentInputSchema = z.object({
	parserId: ParserId,
	url: z
		.string()
		.url()
		.describe(
			'Publicly reachable URL of the document (PDF, image, Word, ...).',
		),
	remoteId: RemoteId,
});
export type FetchDocumentInput = z.infer<typeof FetchDocumentInputSchema>;

export const UploadDocumentInputSchema = z.object({
	parserId: ParserId,
	fileContent: z.string().min(1).describe('The file, base64-encoded.'),
	fileName: z
		.string()
		.min(1)
		.optional()
		.describe('File name with extension, e.g. invoice.pdf.'),
	remoteId: RemoteId,
});
export type UploadDocumentInput = z.infer<typeof UploadDocumentInputSchema>;

export const DocumentIdsInputSchema = z.object({
	parserId: ParserId,
	documentIds: z.array(DocumentId).min(1).max(100),
});
export type DocumentIdsInput = z.infer<typeof DocumentIdsInputSchema>;

// ── Outputs ─────────────────────────────────────────────────────────────────

/**
 * One parsed document. The parsed fields depend on each parser's rules, so the
 * object is loose: the standard fields are typed and the rest pass through.
 */
export const ResultSchema = z
	.object({
		id: z.string(),
		document_id: z.string().optional(),
		remote_id: z.string().nullable().optional(),
		file_name: z.string().nullable().optional(),
		page_count: z.number().nullable().optional(),
		uploaded_at: z.string().nullable().optional(),
		processed_at: z.string().nullable().optional(),
	})
	.loose();

export const PingResponseSchema = z.object({ ping: DocparserPingEntity });
export type PingResponse = z.infer<typeof PingResponseSchema>;

export const ParserListResponseSchema = z.object({
	parsers: z.array(DocparserParserEntity),
});
export type ParserListResponse = z.infer<typeof ParserListResponseSchema>;

export const ModelListResponseSchema = z.object({
	models: z.array(DocparserModelEntity),
});
export type ModelListResponse = z.infer<typeof ModelListResponseSchema>;

export const ResultListResponseSchema = z.object({
	results: z.array(ResultSchema),
});
export type ResultListResponse = z.infer<typeof ResultListResponseSchema>;

export const DocumentStatusResponseSchema = z.object({
	status: z
		.object({
			remote_id: z.string().nullable().optional(),
			filename: z.string().nullable().optional(),
			pages: z.number().nullable().optional(),
			supported: z.boolean().optional(),
			importing_in_progress: z.boolean().optional(),
			processing_in_progress: z.boolean().optional(),
			uploaded_at: z.number().nullable().optional(),
			processed_at: z.number().nullable().optional(),
			failed_jobs: z.array(z.string()).optional(),
		})
		.loose(),
	done: z
		.boolean()
		.describe(
			'True once the document is imported and parsed with no job running.',
		),
});
export type DocumentStatusResponse = z.infer<
	typeof DocumentStatusResponseSchema
>;

export const ImportResponseSchema = z.object({
	documentId: z.string(),
	quotaUsed: z.number().optional(),
	quotaLeft: z.number().optional(),
	quotaRefill: z.string().optional(),
});
export type ImportResponse = z.infer<typeof ImportResponseSchema>;

export const ScheduledResponseSchema = z.object({
	scheduled: z.number().describe('How many documents Docparser queued.'),
});
export type ScheduledResponse = z.infer<typeof ScheduledResponseSchema>;

export const EndpointInputSchemas = {
	ping: EmptyInputSchema,
	'parsers.list': EmptyInputSchema,
	'models.list': ParserIdInputSchema,
	'results.list': ResultsInputSchema,
	'results.get': ResultInputSchema,
	'documents.fetch': FetchDocumentInputSchema,
	'documents.upload': UploadDocumentInputSchema,
	'documents.status': DocumentInputSchema,
	'documents.reparse': DocumentIdsInputSchema,
	'documents.reintegrate': DocumentIdsInputSchema,
};

export const EndpointOutputSchemas = {
	ping: PingResponseSchema,
	'parsers.list': ParserListResponseSchema,
	'models.list': ModelListResponseSchema,
	'results.list': ResultListResponseSchema,
	'results.get': ResultListResponseSchema,
	'documents.fetch': ImportResponseSchema,
	'documents.upload': ImportResponseSchema,
	'documents.status': DocumentStatusResponseSchema,
	'documents.reparse': ScheduledResponseSchema,
	'documents.reintegrate': ScheduledResponseSchema,
};
