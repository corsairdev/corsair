import { z } from 'zod';
import type {
	BatchUpdateResponse,
	Document,
	DriveFile,
	DriveFileList,
	SpreadsheetChartsResponse,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

const LocationSchema = z.object({
	index: z.number(),
	segmentId: z.string().optional(),
	tabId: z.string().optional(),
});

const TableCellLocationSchema = z.object({
	tableStartLocation: LocationSchema,
	rowIndex: z.number(),
	columnIndex: z.number(),
});

const TableRangeSchema = z.object({
	tableCellLocation: TableCellLocationSchema,
	rowSpan: z.number(),
	columnSpan: z.number(),
});

const DimensionSchema = z.object({
	magnitude: z.number().optional(),
	unit: z.string().optional(),
});

const SizeSchema = z.object({
	height: DimensionSchema.optional(),
	width: DimensionSchema.optional(),
});

const HeaderFooterTypeSchema = z.enum(['DEFAULT', 'FIRST_PAGE', 'EVEN_PAGE']);

// ─────────────────────────────────────────────────────────────────────────────
// Input schemas
// ─────────────────────────────────────────────────────────────────────────────

const CreateDocumentInputSchema = z.object({
	title: z.string(),
	text: z.string().optional(),
});

const CreateBlankDocumentInputSchema = z.object({
	title: z.string(),
});

const CreateDocumentMarkdownInputSchema = z.object({
	title: z.string().optional(),
	markdown: z.string(),
});

const CopyDocumentInputSchema = z.object({
	fileId: z.string(),
	name: z.string().optional(),
	parents: z.array(z.string()).optional(),
});

const GetDocumentInputSchema = z.object({
	documentId: z.string(),
});

const GetDocumentPlaintextInputSchema = z.object({
	documentId: z.string(),
});

const UpdateDocumentMarkdownInputSchema = z.object({
	documentId: z.string(),
	markdown: z.string(),
});

const UpdateDocumentSectionMarkdownInputSchema = z.object({
	documentId: z.string(),
	markdown: z.string(),
	startIndex: z.number(),
	endIndex: z.number().optional(),
});

const UpdateDocumentStyleInputSchema = z.object({
	documentId: z.string(),
	documentStyle: z.record(z.string(), z.unknown()),
	fields: z.string(),
});

const UpdateExistingDocumentInputSchema = z.object({
	documentId: z.string(),
	requests: z.array(z.record(z.string(), z.unknown())),
	writeControl: z.record(z.string(), z.unknown()).optional(),
});

// GOOGLEDOCS_UPDATE_DOCUMENT_BATCH is deprecated upstream (see GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT).
const UpdateDocumentBatchInputSchema = UpdateExistingDocumentInputSchema;

const ExportDocumentAsPdfInputSchema = z.object({
	fileId: z.string(),
});

const SearchDocumentsInputSchema = z.object({
	q: z.string().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	orderBy: z.string().optional(),
});

const ListSpreadsheetChartsInputSchema = z.object({
	spreadsheetId: z.string(),
});

const InsertTextInputSchema = z.object({
	documentId: z.string(),
	text: z.string(),
	insertionIndex: z.number().optional(),
	appendToEnd: z.boolean().optional(),
});

const ReplaceAllTextInputSchema = z.object({
	documentId: z.string(),
	find: z.string(),
	replace: z.string(),
	matchCase: z.boolean().optional(),
});

const DeleteContentRangeInputSchema = z.object({
	documentId: z.string(),
	startIndex: z.number(),
	endIndex: z.number(),
});

const InsertInlineImageInputSchema = z.object({
	documentId: z.string(),
	uri: z.string(),
	insertionIndex: z.number().optional(),
	appendToEnd: z.boolean().optional(),
	size: SizeSchema.optional(),
});

const ReplaceImageInputSchema = z.object({
	documentId: z.string(),
	imageObjectId: z.string(),
	uri: z.string(),
	imageReplaceMethod: z.enum(['CENTER_CROP']).optional(),
});

const InsertPageBreakInputSchema = z.object({
	documentId: z.string(),
	insertionIndex: z.number().optional(),
	appendToEnd: z.boolean().optional(),
});

const CreateHeaderInputSchema = z.object({
	documentId: z.string(),
	type: HeaderFooterTypeSchema.optional(),
	sectionBreakLocation: LocationSchema.optional(),
});

const CreateFooterInputSchema = z.object({
	documentId: z.string(),
	type: HeaderFooterTypeSchema.optional(),
	sectionBreakLocation: LocationSchema.optional(),
});

const CreateFootnoteInputSchema = z.object({
	documentId: z.string(),
	location: LocationSchema.optional(),
	endOfSegmentLocation: z
		.object({
			segmentId: z.string().optional(),
			tabId: z.string().optional(),
		})
		.optional(),
});

const CreateNamedRangeInputSchema = z.object({
	documentId: z.string(),
	name: z.string(),
	startIndex: z.number(),
	endIndex: z.number(),
});

const CreateParagraphBulletsInputSchema = z.object({
	documentId: z.string(),
	startIndex: z.number(),
	endIndex: z.number(),
	bulletPreset: z.string().optional(),
});

const DeleteParagraphBulletsInputSchema = z.object({
	documentId: z.string(),
	startIndex: z.number(),
	endIndex: z.number(),
});

const DeleteHeaderInputSchema = z.object({
	documentId: z.string(),
	// Docs DeleteHeaderRequest requires the header id; omitting it 400s at runtime.
	headerId: z.string(),
	type: HeaderFooterTypeSchema.optional(),
});

const DeleteFooterInputSchema = z.object({
	documentId: z.string(),
	// Docs DeleteFooterRequest requires the footer id; omitting it 400s at runtime.
	footerId: z.string(),
	type: HeaderFooterTypeSchema.optional(),
});

const DeleteNamedRangeInputSchema = z
	.object({
		documentId: z.string(),
		namedRangeId: z.string().optional(),
		name: z.string().optional(),
	})
	.refine((data) => !!(data.namedRangeId || data.name), {
		message:
			'deleteNamedRange requires namedRangeId or name — Docs rejects an empty DeleteNamedRangeRequest',
	});

const InsertTableInputSchema = z.object({
	documentId: z.string(),
	rows: z.number(),
	columns: z.number(),
	insertionIndex: z.number().optional(),
	appendToEnd: z.boolean().optional(),
});

const InsertTableColumnInputSchema = z.object({
	documentId: z.string(),
	tableCellLocation: TableCellLocationSchema,
	insertRight: z.boolean().optional(),
});

const DeleteTableColumnInputSchema = z.object({
	documentId: z.string(),
	tableCellLocation: TableCellLocationSchema,
});

const DeleteTableRowInputSchema = z.object({
	documentId: z.string(),
	tableCellLocation: TableCellLocationSchema,
});

const UnmergeTableCellsInputSchema = z.object({
	documentId: z.string(),
	tableRange: TableRangeSchema,
});

const UpdateTableRowStyleInputSchema = z.object({
	documentId: z.string(),
	tableStartLocation: LocationSchema,
	rowIndices: z.array(z.number()),
	tableRowStyle: z
		.object({
			minRowHeight: DimensionSchema.optional(),
			tableHeader: z.boolean().optional(),
			preventOverflow: z.boolean().optional(),
		})
		.optional(),
	fields: z.string().optional(),
});

export const GoogleDocsEndpointInputSchemas = {
	createDocument: CreateDocumentInputSchema,
	createBlankDocument: CreateBlankDocumentInputSchema,
	createDocumentMarkdown: CreateDocumentMarkdownInputSchema,
	copyDocument: CopyDocumentInputSchema,
	getDocument: GetDocumentInputSchema,
	getDocumentPlaintext: GetDocumentPlaintextInputSchema,
	updateDocumentMarkdown: UpdateDocumentMarkdownInputSchema,
	updateDocumentSectionMarkdown: UpdateDocumentSectionMarkdownInputSchema,
	updateDocumentStyle: UpdateDocumentStyleInputSchema,
	updateExistingDocument: UpdateExistingDocumentInputSchema,
	updateDocumentBatch: UpdateDocumentBatchInputSchema,
	exportDocumentAsPdf: ExportDocumentAsPdfInputSchema,
	searchDocuments: SearchDocumentsInputSchema,
	listSpreadsheetCharts: ListSpreadsheetChartsInputSchema,
	insertText: InsertTextInputSchema,
	replaceAllText: ReplaceAllTextInputSchema,
	deleteContentRange: DeleteContentRangeInputSchema,
	insertInlineImage: InsertInlineImageInputSchema,
	replaceImage: ReplaceImageInputSchema,
	insertPageBreak: InsertPageBreakInputSchema,
	createHeader: CreateHeaderInputSchema,
	createFooter: CreateFooterInputSchema,
	createFootnote: CreateFootnoteInputSchema,
	createNamedRange: CreateNamedRangeInputSchema,
	createParagraphBullets: CreateParagraphBulletsInputSchema,
	deleteParagraphBullets: DeleteParagraphBulletsInputSchema,
	deleteHeader: DeleteHeaderInputSchema,
	deleteFooter: DeleteFooterInputSchema,
	deleteNamedRange: DeleteNamedRangeInputSchema,
	insertTable: InsertTableInputSchema,
	insertTableColumn: InsertTableColumnInputSchema,
	deleteTableColumn: DeleteTableColumnInputSchema,
	deleteTableRow: DeleteTableRowInputSchema,
	unmergeTableCells: UnmergeTableCellsInputSchema,
	updateTableRowStyle: UpdateTableRowStyleInputSchema,
} as const;

export type GoogleDocsEndpointInputs = {
	[K in keyof typeof GoogleDocsEndpointInputSchemas]: z.infer<
		(typeof GoogleDocsEndpointInputSchemas)[K]
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Output schemas
// ─────────────────────────────────────────────────────────────────────────────

// Loose top-level shape: the Docs API returns rich nested JSON that callers
// narrow themselves. Parsing only the top-level fields keeps the schema usable
// for response validation without mirroring the entire Document model.
const DocumentSchema = z.object({
	documentId: z.string().optional(),
	title: z.string().optional(),
	revisionId: z.string().optional(),
	body: z.unknown().optional(),
	headers: z.unknown().optional(),
	footers: z.unknown().optional(),
	footnotes: z.unknown().optional(),
	inlineObjects: z.unknown().optional(),
	positionedObjects: z.unknown().optional(),
	namedRanges: z.unknown().optional(),
	lists: z.unknown().optional(),
	documentStyle: z.unknown().optional(),
	suggestionsViewMode: z.string().optional(),
});

const BatchUpdateResponseSchema = z.object({
	documentId: z.string().optional(),
	replies: z.array(z.record(z.string(), z.unknown())).optional(),
	writeControl: z
		.object({
			requiredRevisionId: z.string().optional(),
			targetRevisionId: z.string().optional(),
		})
		.optional(),
});

const DriveFileSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	mimeType: z.string().optional(),
	parents: z.array(z.string()).optional(),
	trashed: z.boolean().optional(),
	createdTime: z.string().optional(),
	modifiedTime: z.string().optional(),
	webViewLink: z.string().optional(),
	size: z.string().optional(),
	owners: z.array(z.unknown()).optional(),
});

const DriveFileListSchema = z.object({
	kind: z.string().optional(),
	nextPageToken: z.string().optional(),
	incompleteSearch: z.boolean().optional(),
	files: z.array(DriveFileSchema).optional(),
});

const SpreadsheetChartsResponseSchema = z.object({
	spreadsheetId: z.string().optional(),
	sheets: z.array(z.unknown()).optional(),
});

const PlaintextResultSchema = z.object({
	documentId: z.string(),
	title: z.string().optional(),
	text: z.string(),
	wordCount: z.number(),
});

const ExportResultSchema = z.object({
	fileId: z.string(),
	mimeType: z.string(),
	data: z.string(),
});

export const GoogleDocsEndpointOutputSchemas = {
	createDocument: DocumentSchema,
	createBlankDocument: DocumentSchema,
	createDocumentMarkdown: DocumentSchema,
	copyDocument: DriveFileSchema,
	getDocument: DocumentSchema,
	getDocumentPlaintext: PlaintextResultSchema,
	updateDocumentMarkdown: BatchUpdateResponseSchema,
	updateDocumentSectionMarkdown: BatchUpdateResponseSchema,
	updateDocumentStyle: BatchUpdateResponseSchema,
	updateExistingDocument: BatchUpdateResponseSchema,
	updateDocumentBatch: BatchUpdateResponseSchema,
	exportDocumentAsPdf: ExportResultSchema,
	searchDocuments: DriveFileListSchema,
	listSpreadsheetCharts: SpreadsheetChartsResponseSchema,
	insertText: BatchUpdateResponseSchema,
	replaceAllText: BatchUpdateResponseSchema,
	deleteContentRange: BatchUpdateResponseSchema,
	insertInlineImage: BatchUpdateResponseSchema,
	replaceImage: BatchUpdateResponseSchema,
	insertPageBreak: BatchUpdateResponseSchema,
	createHeader: BatchUpdateResponseSchema,
	createFooter: BatchUpdateResponseSchema,
	createFootnote: BatchUpdateResponseSchema,
	createNamedRange: BatchUpdateResponseSchema,
	createParagraphBullets: BatchUpdateResponseSchema,
	deleteParagraphBullets: BatchUpdateResponseSchema,
	deleteHeader: BatchUpdateResponseSchema,
	deleteFooter: BatchUpdateResponseSchema,
	deleteNamedRange: BatchUpdateResponseSchema,
	insertTable: BatchUpdateResponseSchema,
	insertTableColumn: BatchUpdateResponseSchema,
	deleteTableColumn: BatchUpdateResponseSchema,
	deleteTableRow: BatchUpdateResponseSchema,
	unmergeTableCells: BatchUpdateResponseSchema,
	updateTableRowStyle: BatchUpdateResponseSchema,
} as const;

export type PlaintextResult = z.infer<typeof PlaintextResultSchema>;
export type ExportResult = z.infer<typeof ExportResultSchema>;

export type GoogleDocsEndpointOutputs = {
	createDocument: Document;
	createBlankDocument: Document;
	createDocumentMarkdown: Document;
	copyDocument: DriveFile;
	getDocument: Document;
	getDocumentPlaintext: PlaintextResult;
	updateDocumentMarkdown: BatchUpdateResponse;
	updateDocumentSectionMarkdown: BatchUpdateResponse;
	updateDocumentStyle: BatchUpdateResponse;
	updateExistingDocument: BatchUpdateResponse;
	updateDocumentBatch: BatchUpdateResponse;
	exportDocumentAsPdf: ExportResult;
	searchDocuments: DriveFileList;
	listSpreadsheetCharts: SpreadsheetChartsResponse;
	insertText: BatchUpdateResponse;
	replaceAllText: BatchUpdateResponse;
	deleteContentRange: BatchUpdateResponse;
	insertInlineImage: BatchUpdateResponse;
	replaceImage: BatchUpdateResponse;
	insertPageBreak: BatchUpdateResponse;
	createHeader: BatchUpdateResponse;
	createFooter: BatchUpdateResponse;
	createFootnote: BatchUpdateResponse;
	createNamedRange: BatchUpdateResponse;
	createParagraphBullets: BatchUpdateResponse;
	deleteParagraphBullets: BatchUpdateResponse;
	deleteHeader: BatchUpdateResponse;
	deleteFooter: BatchUpdateResponse;
	deleteNamedRange: BatchUpdateResponse;
	insertTable: BatchUpdateResponse;
	insertTableColumn: BatchUpdateResponse;
	deleteTableColumn: BatchUpdateResponse;
	deleteTableRow: BatchUpdateResponse;
	unmergeTableCells: BatchUpdateResponse;
	updateTableRowStyle: BatchUpdateResponse;
};
