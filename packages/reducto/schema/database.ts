import { z } from 'zod';

// SingleJob from the OpenAPI spec. raw_config is omitted on purpose:
// GET /jobs?exclude_configs=true exists so callers can leave that blob behind.
export const JobStatus = z.enum([
	'Pending',
	'Completed',
	'Failed',
	'Idle',
	'InProgress',
	'Completing',
	'Cancelled',
]);

export const JobType = z.enum([
	'Parse',
	'Extract',
	'Split',
	'Edit',
	'Pipeline',
	'Classify',
	'Chart',
]);

export const ParseResultKind = z.enum(['full', 'url']);

/** Normalized bounding box from Reducto parse blocks and OCR (0–1 page coordinates). */
export const Bbox = z.object({
	left: z.number(),
	top: z.number(),
	width: z.number(),
	height: z.number(),
	page: z.number().int(),
	originalPage: z.number().int().nullable().optional(),
});

export const GranularConfidence = z
	.object({
		parseConfidence: z.number().nullable().optional(),
		extractConfidence: z.number().nullable().optional(),
	})
	.loose();

export const DocumentProperties = z
	.object({
		title: z.string().nullable().optional(),
		author: z.string().nullable().optional(),
		subject: z.string().nullable().optional(),
		keywords: z.string().nullable().optional(),
		creator: z.string().nullable().optional(),
		producer: z.string().nullable().optional(),
		lastModifiedBy: z.string().nullable().optional(),
		createdAt: z.string().nullable().optional(),
		modifiedAt: z.string().nullable().optional(),
	})
	.loose();

export const JobUsage = z
	.object({
		numPages: z.number().optional(),
		credits: z.number().nullable().optional(),
		numFields: z.number().optional(),
		numCategories: z.number().optional(),
	})
	.loose();

export const RemoteResultKind = z.enum(['inline', 'url']);

/**
 * Job row (entity id = `jobId`). Metadata and pointers; operation payloads live
 * in the typed entity tables below.
 */
export const Job = z.object({
	jobId: z.string(),
	status: JobStatus.nullable().optional(),
	type: JobType.nullable().optional(),
	source: z.unknown().nullable().optional(),
	numPages: z.number().nullable().optional(),
	totalPages: z.number().nullable().optional(),
	duration: z.number().nullable().optional(),
	providerCreatedAt: z.string().nullable().optional(),
	bucket: z.unknown().nullable().optional(),
	studioLink: z.string().nullable().optional(),
	usage: JobUsage.nullable().optional(),
	documentProperties: DocumentProperties.nullable().optional(),
	responseType: z.string().nullable().optional(),
	pdfUrl: z.string().nullable().optional(),
	parseResultKind: ParseResultKind.nullable().optional(),
	parseResultUrl: z.string().nullable().optional(),
	parseResultId: z.string().nullable().optional(),
	extractResultKind: RemoteResultKind.nullable().optional(),
	splitResultKind: RemoteResultKind.nullable().optional(),
	splitResultUrl: z.string().nullable().optional(),
	splitResultId: z.string().nullable().optional(),
	classifyResultKind: RemoteResultKind.nullable().optional(),
	pipelineResultKind: RemoteResultKind.nullable().optional(),
	pipelineResultUrl: z.string().nullable().optional(),
	pipelineResultId: z.string().nullable().optional(),
	progress: z.number().nullable().optional(),
	reason: z.string().nullable().optional(),
	error: z.unknown().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

/** One parse chunk for a job (entity id = `{jobId}#c{chunkIndex}`). */
export const ParseChunk = z.object({
	id: z.string(),
	jobId: z.string(),
	chunkIndex: z.number().int().nonnegative(),
	content: z.string(),
	embed: z.string().nullable().optional(),
	enriched: z.string().nullable().optional(),
	enrichmentSuccess: z.boolean().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

/** One layout block inside a chunk (entity id = `{jobId}#c{chunkIndex}#b{blockIndex}`). */
export const ParseBlock = z.object({
	id: z.string(),
	jobId: z.string(),
	chunkIndex: z.number().int().nonnegative(),
	blockIndex: z.number().int().nonnegative(),
	type: z.string(),
	content: z.string().nullable().optional(),
	bbox: Bbox.nullable().optional(),
	confidence: z.string().nullable().optional(),
	granularConfidence: GranularConfidence.nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	chartData: z.array(z.string()).nullable().optional(),
	mergedTables: z.array(z.unknown()).nullable().optional(),
	extra: z.record(z.string(), z.unknown()).nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

export const ParseOcrKind = z.enum(['word', 'line']);

/** OCR word or line from `result.ocr` (entity id = `{jobId}#ocr#{kind}#{index}`). */
export const ParseOcrItem = z.object({
	id: z.string(),
	jobId: z.string(),
	kind: ParseOcrKind,
	ocrIndex: z.number().int().nonnegative(),
	text: z.string(),
	bbox: Bbox,
	confidence: z.number().nullable().optional(),
	chunkIndex: z.number().int().nullable().optional(),
	rotation: z.number().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

/** Extract object or URL pointer (entity id = `jobId`). */
export const ExtractOutput = z.object({
	id: z.string(),
	jobId: z.string(),
	resultKind: RemoteResultKind,
	data: z.record(z.string(), z.unknown()).nullable().optional(),
	resultUrl: z.string().nullable().optional(),
	resultId: z.string().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

/** One row from array extract (entity id = `{jobId}#r{recordIndex}`). */
export const ExtractRecord = z.object({
	id: z.string(),
	jobId: z.string(),
	recordIndex: z.number().int().nonnegative(),
	payload: z.unknown(),
	updatedAt: z.coerce.date().optional(),
});

/** One extract citation (entity id = `{jobId}#cite{citationIndex}`). */
export const ExtractCitation = z.object({
	id: z.string(),
	jobId: z.string(),
	citationIndex: z.number().int().nonnegative(),
	payload: z.unknown(),
	updatedAt: z.coerce.date().optional(),
});

/** One split segment (entity id = `{jobId}#split{splitIndex}`). */
export const SplitSegment = z.object({
	id: z.string(),
	jobId: z.string(),
	splitIndex: z.number().int().nonnegative(),
	name: z.string(),
	pages: z.array(z.number().int()),
	partitionKey: z.string().nullable().optional(),
	extra: z.record(z.string(), z.unknown()).nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

/** Classify result (entity id = `jobId`). */
export const ClassifyOutput = z.object({
	id: z.string(),
	jobId: z.string(),
	resultKind: RemoteResultKind,
	category: z.string().nullable().optional(),
	resultUrl: z.string().nullable().optional(),
	resultId: z.string().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

/** Edit output document (entity id = `jobId`). */
export const EditOutput = z.object({
	id: z.string(),
	jobId: z.string(),
	documentUrl: z.string(),
	updatedAt: z.coerce.date().optional(),
});

/** One returned form widget from edit (entity id = `{jobId}#form{fieldIndex}`). */
export const EditFormField = z.object({
	id: z.string(),
	jobId: z.string(),
	fieldIndex: z.number().int().nonnegative(),
	widget: z.unknown(),
	updatedAt: z.coerce.date().optional(),
});

/** Pipeline run payload (entity id = `jobId`). */
export const PipelineOutput = z.object({
	id: z.string(),
	jobId: z.string(),
	resultKind: RemoteResultKind,
	payload: z.unknown().nullable().optional(),
	resultUrl: z.string().nullable().optional(),
	resultId: z.string().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

export type BboxCoords = z.infer<typeof Bbox>;
export type Job = z.infer<typeof Job>;
export type ParseChunk = z.infer<typeof ParseChunk>;
export type ParseBlock = z.infer<typeof ParseBlock>;
export type ParseOcrItem = z.infer<typeof ParseOcrItem>;
export type ExtractOutput = z.infer<typeof ExtractOutput>;
export type ExtractRecord = z.infer<typeof ExtractRecord>;
export type ExtractCitation = z.infer<typeof ExtractCitation>;
export type SplitSegment = z.infer<typeof SplitSegment>;
export type ClassifyOutput = z.infer<typeof ClassifyOutput>;
export type EditOutput = z.infer<typeof EditOutput>;
export type EditFormField = z.infer<typeof EditFormField>;
export type PipelineOutput = z.infer<typeof PipelineOutput>;
