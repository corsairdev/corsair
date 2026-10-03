import type { ReductoContext } from '../index';
import type { Job } from '../schema/database';
import { JobStatus, JobType } from '../schema/database';

type JobRow = {
	jobId: string;
	status?: string | null;
	type?: string | null;
	// unknown: OpenAPI types source as an unconstrained object or null.
	source?: unknown;
	numPages?: number | null;
	totalPages?: number | null;
	duration?: number | null;
	providerCreatedAt?: string | null;
	// unknown: OpenAPI types bucket as an unconstrained object or null.
	bucket?: unknown;
	studioLink?: string | null;
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

function rowFromRecord(
	record: Record<string, unknown>,
	fallbackJobId?: string,
): JobRow | undefined {
	const jobId = stringField(record, 'job_id') ?? fallbackJobId;
	if (!jobId) return undefined;

	const usage = isRecord(record.usage) ? record.usage : undefined;
	const row: JobRow = { jobId };
	const status = stringField(record, 'status');
	const type = stringField(record, 'type');
	const source = 'source' in record ? record.source : undefined;
	const numPages =
		numberField(record, 'num_pages') ??
		(usage ? numberField(usage, 'num_pages') : undefined);
	const totalPages = numberField(record, 'total_pages');
	const duration = numberField(record, 'duration');
	const providerCreatedAt = stringField(record, 'created_at');
	const bucket = 'bucket' in record ? record.bucket : undefined;
	const studioLink = stringField(record, 'studio_link');

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

async function upsert(ctx: ReductoContext, row: JobRow): Promise<void> {
	try {
		// upsertByEntityId replaces the stored JSON. Read the row first so a
		// later {job_id} or status update does not drop type, pages, or created time.
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

		await ctx.db.jobs.upsertByEntityId(row.jobId, data);
	} catch (error) {
		console.warn(`[reducto] Failed to cache job ${row.jobId}:`, error);
	}
}

export async function forgetJob(
	ctx: ReductoContext,
	jobId: string,
): Promise<void> {
	try {
		await ctx.db.jobs.deleteByEntityId(jobId);
	} catch (error) {
		console.warn(`[reducto] Failed to drop cached job ${jobId}:`, error);
	}
}

export async function rememberJob(
	ctx: ReductoContext,
	// unknown: the parsed response is one of several operation payloads. Only job fields are read.
	response: unknown,
	fallbackJobId?: string,
): Promise<void> {
	if (!isRecord(response)) return;

	const jobs = response.jobs;
	if (Array.isArray(jobs)) {
		for (const job of jobs) {
			if (!isRecord(job)) continue;
			const row = rowFromRecord(job);
			if (row) await upsert(ctx, row);
		}
		return;
	}

	const row = rowFromRecord(response, fallbackJobId);
	if (row) await upsert(ctx, row);
}

export async function rememberJobStatus(
	ctx: ReductoContext,
	jobId: string,
	status: string,
): Promise<void> {
	await upsert(ctx, { jobId, status });
}
