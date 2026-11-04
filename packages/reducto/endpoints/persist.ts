import type { ReductoContext } from '../index';
import type {
	BboxCoords,
	ClassifyOutput,
	EditFormField,
	EditOutput,
	ExtractCitation,
	ExtractOutput,
	ExtractRecord,
	Job,
	ParseBlock,
	ParseChunk,
	ParseOcrItem,
	PipelineOutput,
	SplitSegment,
} from '../schema/database';
import { JobStatus, JobType } from '../schema/database';

type JobRow = {
	jobId: string;
	status?: string | null;
	type?: string | null;
	source?: unknown;
	numPages?: number | null;
	totalPages?: number | null;
	duration?: number | null;
	providerCreatedAt?: string | null;
	bucket?: unknown;
	studioLink?: string | null;
	usage?: Job['usage'];
	documentProperties?: Job['documentProperties'];
	responseType?: string | null;
	pdfUrl?: string | null;
	documentUrl?: string | null;
	formSchema?: unknown;
	progress?: number | null;
	reason?: string | null;
	error?: unknown;
	result?: unknown;
	citations?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function stringField(
	record: Record<string, unknown>,
	key: string,
): string | null | undefined {
	const value = record[key];
	if (typeof value === 'string') return value;
	if (value === null) return null;
	return undefined;
}

function numberField(
	record: Record<string, unknown>,
	key: string,
): number | null | undefined {
	const value = record[key];
	if (typeof value === 'number') return value;
	if (value === null) return null;
	return undefined;
}

function unknownField(
	record: Record<string, unknown>,
	key: string,
): unknown | undefined {
	if (!(key in record)) return undefined;
	return record[key];
}

function isUrlResult(value: unknown): value is Record<string, unknown> {
	return isRecord(value) && stringField(value, 'type') === 'url';
}

function isFullParseResult(value: unknown): value is Record<string, unknown> {
	return (
		isRecord(value) &&
		(stringField(value, 'type') === 'full' || Array.isArray(value.chunks))
	);
}

function bboxFromRecord(record: unknown): BboxCoords | undefined {
	if (!isRecord(record)) return undefined;
	const left = numberField(record, 'left');
	const top = numberField(record, 'top');
	const width = numberField(record, 'width');
	const height = numberField(record, 'height');
	const page = numberField(record, 'page');
	if (
		left == null ||
		top == null ||
		width == null ||
		height == null ||
		page == null
	) {
		return undefined;
	}
	return {
		left,
		top,
		width,
		height,
		page,
		originalPage:
			numberField(record, 'original_page') ??
			numberField(record, 'originalPage') ??
			null,
	};
}

function usageFromRecord(record: unknown): Job['usage'] | undefined {
	if (!isRecord(record)) return undefined;
	const usage: NonNullable<Job['usage']> = {};
	const numPages = numberField(record, 'num_pages');
	const credits = numberField(record, 'credits');
	const numFields = numberField(record, 'num_fields');
	const numCategories = numberField(record, 'num_categories');
	if (numPages != null) usage.numPages = numPages;
	if (credits !== undefined) usage.credits = credits;
	if (numFields != null) usage.numFields = numFields;
	if (numCategories != null) usage.numCategories = numCategories;
	return Object.keys(usage).length > 0 ? usage : undefined;
}

function documentPropertiesFromRecord(
	record: unknown,
): Job['documentProperties'] | undefined {
	if (!isRecord(record)) return undefined;
	return {
		title: stringField(record, 'title') ?? undefined,
		author: stringField(record, 'author') ?? undefined,
		subject: stringField(record, 'subject') ?? undefined,
		keywords: stringField(record, 'keywords') ?? undefined,
		creator: stringField(record, 'creator') ?? undefined,
		producer: stringField(record, 'producer') ?? undefined,
		lastModifiedBy: stringField(record, 'last_modified_by') ?? undefined,
		createdAt: stringField(record, 'created_at') ?? undefined,
		modifiedAt: stringField(record, 'modified_at') ?? undefined,
	};
}

function chunkEntityId(jobId: string, chunkIndex: number): string {
	return `${jobId}#c${chunkIndex}`;
}

function blockEntityId(
	jobId: string,
	chunkIndex: number,
	blockIndex: number,
): string {
	return `${jobId}#c${chunkIndex}#b${blockIndex}`;
}

function ocrEntityId(
	jobId: string,
	kind: ParseOcrItem['kind'],
	ocrIndex: number,
): string {
	return `${jobId}#ocr#${kind}#${ocrIndex}`;
}

function rowFromRecord(
	record: Record<string, unknown>,
	fallbackJobId?: string,
): JobRow | undefined {
	const jobId = stringField(record, 'job_id') ?? fallbackJobId;
	if (!jobId) return undefined;

	const usageFromTopLevel = usageFromRecord(record.usage);
	const row: JobRow = { jobId };
	const status = stringField(record, 'status');
	const type = stringField(record, 'type');
	const source = unknownField(record, 'source');
	const numPages =
		numberField(record, 'num_pages') ?? usageFromTopLevel?.numPages;
	const totalPages = numberField(record, 'total_pages');
	const duration = numberField(record, 'duration');
	const providerCreatedAt = stringField(record, 'created_at');
	const bucket = unknownField(record, 'bucket');
	const studioLink = stringField(record, 'studio_link');
	const result = unknownField(record, 'result');
	const citations = unknownField(record, 'citations');
	const pdfUrl = stringField(record, 'pdf_url');
	const documentUrl = stringField(record, 'document_url');
	const formSchema = unknownField(record, 'form_schema');
	const documentProperties = documentPropertiesFromRecord(
		record.document_properties,
	);
	const responseType = stringField(record, 'response_type');
	const progress = numberField(record, 'progress');
	const reason = stringField(record, 'reason');
	const error = unknownField(record, 'error');

	if (status !== undefined) row.status = status;
	if (type !== undefined) row.type = type;
	if (source !== undefined) row.source = source;
	if (numPages !== undefined) row.numPages = numPages;
	if (totalPages !== undefined) row.totalPages = totalPages;
	if (duration !== undefined) row.duration = duration;
	if (providerCreatedAt !== undefined)
		row.providerCreatedAt = providerCreatedAt;
	if (bucket !== undefined) row.bucket = bucket;
	if (studioLink !== undefined) row.studioLink = studioLink;
	if (usageFromTopLevel !== undefined) row.usage = usageFromTopLevel;
	if (citations !== undefined) row.citations = citations;
	if (pdfUrl !== undefined) row.pdfUrl = pdfUrl;
	if (documentUrl !== undefined) row.documentUrl = documentUrl;
	if (formSchema !== undefined) row.formSchema = formSchema;
	if (documentProperties !== undefined)
		row.documentProperties = documentProperties;
	if (responseType !== undefined) row.responseType = responseType;
	if (progress !== undefined) row.progress = progress;
	if (reason !== undefined) row.reason = reason;
	if (error !== undefined) row.error = error;
	if (result !== undefined) row.result = result;
	return row;
}

function statusValue(value: string | null): Job['status'] {
	if (value === null) return null;
	const parsed = JobStatus.safeParse(value);
	return parsed.success ? parsed.data : undefined;
}

function typeValue(value: string | null): Job['type'] {
	if (value === null) return null;
	const parsed = JobType.safeParse(value);
	return parsed.success ? parsed.data : undefined;
}

async function persistParseLayout(
	ctx: ReductoContext,
	jobId: string,
	result: Record<string, unknown>,
): Promise<void> {
	const now = new Date();
	const chunks = result.chunks;
	if (!Array.isArray(chunks)) return;

	if (ctx.db.parseChunks) {
		for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
			const chunk = chunks[chunkIndex];
			if (!isRecord(chunk)) continue;
			const content = stringField(chunk, 'content');
			if (content == null) continue;
			const row: ParseChunk = {
				id: chunkEntityId(jobId, chunkIndex),
				jobId,
				chunkIndex,
				content,
				embed: stringField(chunk, 'embed') ?? undefined,
				enriched: stringField(chunk, 'enriched') ?? undefined,
				enrichmentSuccess:
					typeof chunk.enrichment_success === 'boolean'
						? chunk.enrichment_success
						: undefined,
				updatedAt: now,
			};
			try {
				await ctx.db.parseChunks.upsertByEntityId(row.id, row);
			} catch (error) {
				console.warn(`[reducto] Failed to save parse chunk ${row.id}:`, error);
			}

			const blocks = chunk.blocks;
			if (!Array.isArray(blocks) || !ctx.db.parseBlocks) continue;
			for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
				const block = blocks[blockIndex];
				if (!isRecord(block)) continue;
				const blockType = stringField(block, 'type');
				if (!blockType) continue;
				const granular = isRecord(block.granular_confidence)
					? {
							parseConfidence:
								numberField(block.granular_confidence, 'parse_confidence') ??
								undefined,
							extractConfidence:
								numberField(block.granular_confidence, 'extract_confidence') ??
								undefined,
						}
					: undefined;
				const blockRow: ParseBlock = {
					id: blockEntityId(jobId, chunkIndex, blockIndex),
					jobId,
					chunkIndex,
					blockIndex,
					type: blockType,
					content: stringField(block, 'content') ?? undefined,
					bbox: bboxFromRecord(block.bbox) ?? undefined,
					confidence: stringField(block, 'confidence') ?? undefined,
					granularConfidence: granular,
					imageUrl: stringField(block, 'image_url') ?? undefined,
					chartData: Array.isArray(block.chart_data)
						? block.chart_data.filter(
								(item): item is string => typeof item === 'string',
							)
						: undefined,
					mergedTables: Array.isArray(block.merged_tables)
						? block.merged_tables
						: undefined,
					extra: isRecord(block.extra) ? block.extra : undefined,
					updatedAt: now,
				};
				try {
					await ctx.db.parseBlocks.upsertByEntityId(blockRow.id, blockRow);
				} catch (error) {
					console.warn(
						`[reducto] Failed to save parse block ${blockRow.id}:`,
						error,
					);
				}
			}
		}
	}

	const ocr = result.ocr;
	if (!isRecord(ocr) || !ctx.db.parseOcrItems) return;

	const persistOcrList = async (kind: ParseOcrItem['kind'], items: unknown) => {
		if (!Array.isArray(items)) return;
		for (let ocrIndex = 0; ocrIndex < items.length; ocrIndex++) {
			const item = items[ocrIndex];
			if (!isRecord(item)) continue;
			const text = stringField(item, 'text');
			const bbox = bboxFromRecord(item.bbox);
			if (!text || !bbox) continue;
			const ocrRow: ParseOcrItem = {
				id: ocrEntityId(jobId, kind, ocrIndex),
				jobId,
				kind,
				ocrIndex,
				text,
				bbox,
				confidence: numberField(item, 'confidence') ?? undefined,
				chunkIndex: numberField(item, 'chunk_index') ?? undefined,
				rotation: numberField(item, 'rotation') ?? undefined,
				updatedAt: now,
			};
			try {
				await ctx.db.parseOcrItems.upsertByEntityId(ocrRow.id, ocrRow);
			} catch (error) {
				console.warn(`[reducto] Failed to save OCR ${ocrRow.id}:`, error);
			}
		}
	};

	await persistOcrList('word', ocr.words);
	await persistOcrList('line', ocr.lines);
}

async function persistExtractCitations(
	ctx: ReductoContext,
	jobId: string,
	citations: unknown,
): Promise<void> {
	if (!ctx.db.extractCitations) return;
	const now = new Date();
	if (isUrlResult(citations)) {
		if (!ctx.db.extractOutputs) return;
		const row: ExtractOutput = {
			id: jobId,
			jobId,
			resultKind: 'url',
			resultUrl: stringField(citations, 'url') ?? undefined,
			resultId: stringField(citations, 'result_id') ?? undefined,
			updatedAt: now,
		};
		try {
			await ctx.db.extractOutputs.upsertByEntityId(jobId, row);
		} catch (error) {
			console.warn(`[reducto] Failed to save extract output ${jobId}:`, error);
		}
		return;
	}
	if (!Array.isArray(citations)) return;
	for (
		let citationIndex = 0;
		citationIndex < citations.length;
		citationIndex++
	) {
		const payload = citations[citationIndex];
		const row: ExtractCitation = {
			id: `${jobId}#cite${citationIndex}`,
			jobId,
			citationIndex,
			payload,
			updatedAt: now,
		};
		try {
			await ctx.db.extractCitations.upsertByEntityId(row.id, row);
		} catch (error) {
			console.warn(`[reducto] Failed to save citation ${row.id}:`, error);
		}
	}
}

async function persistExtractResult(
	ctx: ReductoContext,
	jobId: string,
	result: unknown,
): Promise<'inline' | 'url' | 'array' | undefined> {
	if (result === undefined) return undefined;
	const now = new Date();

	if (Array.isArray(result)) {
		if (!ctx.db.extractRecords) return 'array';
		for (let recordIndex = 0; recordIndex < result.length; recordIndex++) {
			const row: ExtractRecord = {
				id: `${jobId}#r${recordIndex}`,
				jobId,
				recordIndex,
				payload: result[recordIndex],
				updatedAt: now,
			};
			try {
				await ctx.db.extractRecords.upsertByEntityId(row.id, row);
			} catch (error) {
				console.warn(
					`[reducto] Failed to save extract record ${row.id}:`,
					error,
				);
			}
		}
		return 'array';
	}

	if (!ctx.db.extractOutputs) return undefined;

	if (isUrlResult(result)) {
		const row: ExtractOutput = {
			id: jobId,
			jobId,
			resultKind: 'url',
			resultUrl: stringField(result, 'url') ?? undefined,
			resultId: stringField(result, 'result_id') ?? undefined,
			updatedAt: now,
		};
		try {
			await ctx.db.extractOutputs.upsertByEntityId(jobId, row);
		} catch (error) {
			console.warn(`[reducto] Failed to save extract output ${jobId}:`, error);
		}
		return 'url';
	}

	if (isRecord(result)) {
		const row: ExtractOutput = {
			id: jobId,
			jobId,
			resultKind: 'inline',
			data: result,
			updatedAt: now,
		};
		try {
			await ctx.db.extractOutputs.upsertByEntityId(jobId, row);
		} catch (error) {
			console.warn(`[reducto] Failed to save extract output ${jobId}:`, error);
		}
		return 'inline';
	}

	return undefined;
}

async function persistSplitResult(
	ctx: ReductoContext,
	jobId: string,
	result: unknown,
): Promise<'inline' | 'url' | undefined> {
	if (result === undefined) return undefined;
	const now = new Date();

	if (isUrlResult(result)) {
		return 'url';
	}

	if (!isRecord(result) || !ctx.db.splitSegments) return undefined;

	const splits = result.splits;
	if (Array.isArray(splits)) {
		for (let splitIndex = 0; splitIndex < splits.length; splitIndex++) {
			const split = splits[splitIndex];
			if (!isRecord(split)) continue;
			const name = stringField(split, 'name');
			const pages = split.pages;
			if (name == null || !Array.isArray(pages)) continue;
			const numericPages = pages.filter(
				(page): page is number => typeof page === 'number',
			);
			const extra: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(split)) {
				if (key === 'name' || key === 'pages' || key === 'partition_key') {
					continue;
				}
				extra[key] = value;
			}
			const row: SplitSegment = {
				id: `${jobId}#split${splitIndex}`,
				jobId,
				splitIndex,
				name,
				pages: numericPages,
				partitionKey: stringField(split, 'partition_key') ?? undefined,
				extra: Object.keys(extra).length > 0 ? extra : undefined,
				updatedAt: now,
			};
			try {
				await ctx.db.splitSegments.upsertByEntityId(row.id, row);
			} catch (error) {
				console.warn(
					`[reducto] Failed to save split segment ${row.id}:`,
					error,
				);
			}
		}
		return 'inline';
	}

	return 'inline';
}

async function persistClassifyResult(
	ctx: ReductoContext,
	jobId: string,
	result: unknown,
): Promise<'inline' | 'url' | undefined> {
	if (result === undefined || !ctx.db.classifyOutputs) return undefined;
	const now = new Date();

	if (isUrlResult(result)) {
		const row: ClassifyOutput = {
			id: jobId,
			jobId,
			resultKind: 'url',
			resultUrl: stringField(result, 'url') ?? undefined,
			resultId: stringField(result, 'result_id') ?? undefined,
			updatedAt: now,
		};
		try {
			await ctx.db.classifyOutputs.upsertByEntityId(jobId, row);
		} catch (error) {
			console.warn(`[reducto] Failed to save classify output ${jobId}:`, error);
		}
		return 'url';
	}

	if (isRecord(result)) {
		const row: ClassifyOutput = {
			id: jobId,
			jobId,
			resultKind: 'inline',
			category: stringField(result, 'category') ?? undefined,
			updatedAt: now,
		};
		try {
			await ctx.db.classifyOutputs.upsertByEntityId(jobId, row);
		} catch (error) {
			console.warn(`[reducto] Failed to save classify output ${jobId}:`, error);
		}
		return 'inline';
	}

	return undefined;
}

async function persistEditResult(
	ctx: ReductoContext,
	row: JobRow,
): Promise<void> {
	if (row.documentUrl == null) return;
	const now = new Date();
	const jobId = row.jobId;

	if (ctx.db.editOutputs) {
		const editRow: EditOutput = {
			id: jobId,
			jobId,
			documentUrl: row.documentUrl,
			updatedAt: now,
		};
		try {
			await ctx.db.editOutputs.upsertByEntityId(jobId, editRow);
		} catch (error) {
			console.warn(`[reducto] Failed to save edit output ${jobId}:`, error);
		}
	}

	const formSchema = row.formSchema;
	if (!Array.isArray(formSchema) || !ctx.db.editFormFields) return;
	for (let fieldIndex = 0; fieldIndex < formSchema.length; fieldIndex++) {
		const fieldRow: EditFormField = {
			id: `${jobId}#form${fieldIndex}`,
			jobId,
			fieldIndex,
			widget: formSchema[fieldIndex],
			updatedAt: now,
		};
		try {
			await ctx.db.editFormFields.upsertByEntityId(fieldRow.id, fieldRow);
		} catch (error) {
			console.warn(
				`[reducto] Failed to save edit form field ${fieldRow.id}:`,
				error,
			);
		}
	}
}

async function persistPipelineResult(
	ctx: ReductoContext,
	jobId: string,
	result: unknown,
): Promise<'inline' | 'url' | undefined> {
	if (result === undefined || !ctx.db.pipelineOutputs) return undefined;
	const now = new Date();

	if (isUrlResult(result)) {
		const row: PipelineOutput = {
			id: jobId,
			jobId,
			resultKind: 'url',
			resultUrl: stringField(result, 'url') ?? undefined,
			resultId: stringField(result, 'result_id') ?? undefined,
			updatedAt: now,
		};
		try {
			await ctx.db.pipelineOutputs.upsertByEntityId(jobId, row);
		} catch (error) {
			console.warn(`[reducto] Failed to save pipeline output ${jobId}:`, error);
		}
		return 'url';
	}

	const row: PipelineOutput = {
		id: jobId,
		jobId,
		resultKind: 'inline',
		payload: result,
		updatedAt: now,
	};
	try {
		await ctx.db.pipelineOutputs.upsertByEntityId(jobId, row);
	} catch (error) {
		console.warn(`[reducto] Failed to save pipeline output ${jobId}:`, error);
	}
	return 'inline';
}

async function persistOperationResults(
	ctx: ReductoContext,
	row: JobRow,
	data: Job,
): Promise<void> {
	const jobId = row.jobId;
	const jobType = row.type ?? data.type;
	const result = row.result;

	if (isFullParseResult(result)) {
		data.parseResultKind = 'full';
		data.parseResultUrl = null;
		data.parseResultId = null;
		await persistParseLayout(ctx, jobId, result);
		return;
	}

	if (isUrlResult(result) && (jobType === 'Parse' || jobType === undefined)) {
		data.parseResultKind = 'url';
		data.parseResultUrl = stringField(result, 'url') ?? undefined;
		data.parseResultId = stringField(result, 'result_id') ?? undefined;
		return;
	}

	await persistEditResult(ctx, row);

	if (
		isRecord(result) &&
		(Array.isArray(result.splits) || 'splits' in result)
	) {
		const splitKind = await persistSplitResult(ctx, jobId, result);
		if (splitKind === 'url' && isUrlResult(result)) {
			data.splitResultKind = 'url';
			data.splitResultUrl = stringField(result, 'url') ?? undefined;
			data.splitResultId = stringField(result, 'result_id') ?? undefined;
		} else if (splitKind === 'inline') {
			data.splitResultKind = 'inline';
		}
		return;
	}

	if (isRecord(result) && 'category' in result) {
		const classifyKind = await persistClassifyResult(ctx, jobId, result);
		if (classifyKind === 'url') data.classifyResultKind = 'url';
		else if (classifyKind === 'inline') data.classifyResultKind = 'inline';
		return;
	}

	if (row.citations !== undefined) {
		await persistExtractCitations(ctx, jobId, row.citations);
	}

	const shouldPersistExtract =
		Array.isArray(result) ||
		isUrlResult(result) ||
		jobType === 'Extract' ||
		row.citations !== undefined ||
		(isRecord(result) &&
			!isFullParseResult(result) &&
			jobType !== 'Pipeline' &&
			jobType !== 'Split' &&
			jobType !== 'Classify');

	let extractKind: Awaited<ReturnType<typeof persistExtractResult>>;
	if (shouldPersistExtract) {
		extractKind = await persistExtractResult(ctx, jobId, result);
		if (extractKind === 'array' || extractKind === 'inline') {
			data.extractResultKind = 'inline';
		} else if (extractKind === 'url') {
			data.extractResultKind = 'url';
		}
		if (extractKind !== undefined) return;
	}

	if (result === undefined) return;

	const shouldPersistPipeline =
		jobType === 'Pipeline' ||
		(jobType !== 'Parse' &&
			jobType !== 'Extract' &&
			jobType !== 'Split' &&
			jobType !== 'Classify' &&
			jobType !== 'Edit');

	if (shouldPersistPipeline) {
		const pipelineKind = await persistPipelineResult(ctx, jobId, result);
		if (pipelineKind === 'url' && isUrlResult(result)) {
			data.pipelineResultKind = 'url';
			data.pipelineResultUrl = stringField(result, 'url') ?? undefined;
			data.pipelineResultId = stringField(result, 'result_id') ?? undefined;
		} else if (pipelineKind === 'inline') {
			data.pipelineResultKind = 'inline';
		}
	}
}

async function upsertJob(ctx: ReductoContext, row: JobRow): Promise<void> {
	if (!ctx.db.jobs) return;

	try {
		const existing = await ctx.db.jobs.findByEntityId(row.jobId);
		const data: Job = {
			...(existing?.data ?? {}),
			jobId: row.jobId,
			updatedAt: new Date(),
		};
		if (row.status !== undefined) data.status = statusValue(row.status);
		if (row.type !== undefined) data.type = typeValue(row.type);
		if (row.source !== undefined) data.source = row.source;
		if (row.numPages !== undefined) data.numPages = row.numPages;
		if (row.totalPages !== undefined) data.totalPages = row.totalPages;
		if (row.duration !== undefined) data.duration = row.duration;
		if (row.providerCreatedAt !== undefined) {
			data.providerCreatedAt = row.providerCreatedAt;
		}
		if (row.bucket !== undefined) data.bucket = row.bucket;
		if (row.studioLink !== undefined) data.studioLink = row.studioLink;
		if (row.usage !== undefined) data.usage = row.usage;
		if (row.pdfUrl !== undefined) data.pdfUrl = row.pdfUrl;
		if (row.documentProperties !== undefined) {
			data.documentProperties = row.documentProperties;
		}
		if (row.responseType !== undefined) data.responseType = row.responseType;
		if (row.progress !== undefined) data.progress = row.progress;
		if (row.reason !== undefined) data.reason = row.reason;
		if (row.error !== undefined) data.error = row.error;

		await persistOperationResults(ctx, row, data);
		await ctx.db.jobs.upsertByEntityId(row.jobId, data);
	} catch (error) {
		console.warn(`[reducto] Failed to save job ${row.jobId}:`, error);
	}
}

export async function forgetJob(
	ctx: ReductoContext,
	jobId: string,
): Promise<void> {
	try {
		await ctx.db.jobs?.deleteByEntityId(jobId);
	} catch (error) {
		console.warn(`[reducto] Failed to drop job ${jobId}:`, error);
	}
}

export async function rememberJob(
	ctx: ReductoContext,
	response: unknown,
	fallbackJobId?: string,
): Promise<void> {
	if (!isRecord(response)) return;

	const jobs = response.jobs;
	if (Array.isArray(jobs)) {
		for (const job of jobs) {
			if (!isRecord(job)) continue;
			const row = rowFromRecord(job);
			if (row) await upsertJob(ctx, row);
		}
		return;
	}

	const row = rowFromRecord(response, fallbackJobId);
	if (row) await upsertJob(ctx, row);
}

export async function rememberJobStatus(
	ctx: ReductoContext,
	jobId: string,
	status: string,
): Promise<void> {
	await upsertJob(ctx, { jobId, status });
}
