import { logEventFromContext } from 'corsair/core';
import type { FacebookContext } from '../index';
import type { FacebookPageEntity } from '../schema/database';

export async function logFacebookEvent(
	ctx: FacebookContext,
	eventKey: string,
	input: Record<string, unknown>,
): Promise<void> {
	await logEventFromContext(ctx, eventKey, input, 'completed');
}

export function omitUndefined<T extends Record<string, unknown>>(
	obj: T,
): Partial<T> {
	// Strip undefined so Graph payloads and Zod partial merges stay clean.
	return Object.fromEntries(
		Object.entries(obj).filter(([, value]) => value !== undefined),
	) as Partial<T>;
}

export function buildPaginationQuery(input: {
	fields?: string;
	limit?: number;
	after?: string;
	before?: string;
}): Record<string, string | number | boolean | undefined> {
	return {
		fields: input.fields,
		limit: input.limit,
		after: input.after,
		before: input.before,
	};
}

export function formatMetric(metric: string | string[]): string {
	return Array.isArray(metric) ? metric.join(',') : metric;
}

type UpsertClient = {
	upsertByEntityId: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
};

/** Best-effort entity cache write — never fails the API call. */
export async function cacheUpsert(
	client: UpsertClient,
	entityId: string,
	data: Record<string, unknown>,
): Promise<void> {
	try {
		await client.upsertByEntityId(entityId, data);
	} catch {
		// Non-fatal cache write
	}
}

/**
 * Upsert a page entity while preserving a previously cached accessToken.
 * `upsertByEntityId` replaces the whole data blob, so callers must merge.
 */
export async function upsertPageEntity(
	ctx: FacebookContext,
	pageId: string,
	data: Partial<FacebookPageEntity>,
): Promise<void> {
	try {
		const existing = await ctx.db.pages.findByEntityId(pageId);
		await ctx.db.pages.upsertByEntityId(pageId, {
			...(existing?.data ?? {}),
			...omitUndefined(data as Record<string, unknown>),
			facebookId: pageId,
		});
	} catch {
		// Non-fatal cache write
	}
}

/** Persist insight time-series points without clobbering other buckets. */
export async function cacheInsightValues(
	ctx: FacebookContext,
	objectId: string,
	insight: {
		id?: string;
		name: string;
		period?: string;
		values?: Array<{
			value?: number | string | Record<string, unknown>;
			end_time?: string;
		}>;
	},
	fallbackPeriod?: string,
): Promise<void> {
	const period = insight.period ?? fallbackPeriod;
	const values = insight.values?.length
		? insight.values
		: [{ value: undefined, end_time: undefined }];

	for (const point of values) {
		// Graph's insight.id does not encode end_time / query windows, so only
		// use the bare id when there is no window-specific snapshot.
		const insightId =
			insight.id && !point.end_time
				? insight.id
				: [
						insight.id ??
							[objectId, insight.name, period ?? 'default'].join(':'),
						point.end_time ?? 'latest',
					].join(':');

		await cacheUpsert(ctx.db.insights, insightId, {
			insightId,
			objectId,
			name: insight.name,
			period,
			value: point.value,
			endTime: point.end_time,
		});
	}
}
