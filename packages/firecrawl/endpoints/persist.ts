import { createHash } from 'node:crypto';

import type { FirecrawlContext } from '../plugin-context';

/** Deterministic id for map/search POST bodies so repeated calls refresh the same row. */
export function stableRequestId(
	prefix: string,
	body: Record<string, unknown>,
): string {
	const h = createHash('sha256')
		.update(JSON.stringify(body))
		.digest('hex');
	return `${prefix}:${h}`;
}

function asRecord(v: unknown): Record<string, unknown> {
	if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
		return v as Record<string, unknown>;
	}
	return {};
}

export async function persistScrape(
	ctx: FirecrawlContext,
	response: unknown,
): Promise<void> {
	if (!ctx.db.scrapes) return;

	const r = asRecord(response);
	const data = asRecord(r.data);
	const metadata = asRecord(data.metadata);
	const scrapeId = metadata.scrapeId;
	if (typeof scrapeId !== 'string') {
		return;
	}

	try {
		await ctx.db.scrapes.upsertByEntityId(scrapeId, {
			id: scrapeId,
			url: typeof metadata.url === 'string' ? metadata.url : undefined,
			sourceURL:
				typeof metadata.sourceURL === 'string'
					? metadata.sourceURL
					: undefined,
			success: typeof r.success === 'boolean' ? r.success : undefined,
			markdown: typeof data.markdown === 'string' ? data.markdown : undefined,
			metadata:
				Object.keys(metadata).length > 0 ? metadata : undefined,
			fetchedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save scrape to database:', error);
	}
}

export async function persistJob(
	ctx: FirecrawlContext,
	kind: 'crawl' | 'agent',
	jobId: string,
	response: unknown,
): Promise<void> {
	if (!ctx.db.jobs || !jobId) return;

	const snapshot = asRecord(response);
	try {
		await ctx.db.jobs.upsertByEntityId(jobId, {
			id: jobId,
			kind,
			success:
				typeof (response as { success?: boolean }).success === 'boolean'
					? (response as { success: boolean }).success
					: undefined,
			snapshot:
				Object.keys(snapshot).length > 0 ? snapshot : undefined,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn(`Failed to save ${kind} job to database:`, error);
	}
}

export async function persistSiteMap(
	ctx: FirecrawlContext,
	input: Record<string, unknown>,
	response: unknown,
): Promise<void> {
	if (!ctx.db.siteMaps) return;

	const id = stableRequestId('map', input);
	const r = asRecord(response);
	const baseUrl = typeof input.url === 'string' ? input.url : undefined;

	try {
		await ctx.db.siteMaps.upsertByEntityId(id, {
			id,
			baseUrl,
			success: typeof r.success === 'boolean' ? r.success : undefined,
			payload: Object.keys(r).length > 0 ? r : undefined,
			fetchedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save map result to database:', error);
	}
}

export async function persistSearch(
	ctx: FirecrawlContext,
	input: Record<string, unknown>,
	response: unknown,
): Promise<void> {
	if (!ctx.db.searches) return;

	const id = stableRequestId('search', input);
	const r = asRecord(response);

	try {
		await ctx.db.searches.upsertByEntityId(id, {
			id,
			success: typeof r.success === 'boolean' ? r.success : undefined,
			payload: Object.keys(r).length > 0 ? r : undefined,
			fetchedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save search result to database:', error);
	}
}
