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
