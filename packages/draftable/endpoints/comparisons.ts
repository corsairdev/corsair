import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { DraftableContext } from '..';
import { makeDraftableRequest } from '../client';
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
	await logEventFromContext(
		ctx,
		'draftable.comparisons.list',
		{ offset: parsed.offset ?? 0 },
		'completed',
	);
	return result;
};

export const Comparisons = { list: listComparisons };
