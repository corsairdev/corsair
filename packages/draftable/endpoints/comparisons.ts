import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeDraftableRequest } from '../client';
import type { DraftableContext } from '../context';
import { DraftableComparisonEntity } from '../schema/database';
import type { ListComparisonsInput, ListComparisonsResponse } from './types';
import {
	ListComparisonsInputSchema,
	ListComparisonsResponseSchema,
} from './types';

export const listComparisons: CorsairEndpoint<
	DraftableContext,
	ListComparisonsInput,
	ListComparisonsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('draftable', 'api_key');
	}

	const parsed = ListComparisonsInputSchema.parse(input ?? {});
	const body = await makeDraftableRequest<unknown>(ctx.key, {
		limit: parsed.limit,
		offset: parsed.offset,
	});
	const result = ListComparisonsResponseSchema.parse(body);
	await storeComparisons(ctx, result.results);
	await logEventFromContext(
		ctx,
		'draftable.comparisons.list',
		{ offset: parsed.offset ?? 0 },
		'completed',
	);
	return result;
};

async function storeComparisons(
	ctx: DraftableContext,
	results: unknown[],
): Promise<void> {
	if (!ctx.db?.comparisons) return;
	for (const item of results) {
		const row = DraftableComparisonEntity.safeParse(item);
		if (!row.success) continue;
		try {
			await ctx.db.comparisons.upsertByEntityId(row.data.identifier, row.data);
		} catch {
			console.warn('Failed to save Draftable comparison');
		}
	}
}

export const Comparisons = { list: listComparisons };
