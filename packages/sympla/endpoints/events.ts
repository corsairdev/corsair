import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { SymplaContext } from '..';
import { makeSymplaRequest } from '../client';
import type { ListEventsInput, ListEventsResponse } from './types';
import { ListEventsInputSchema, ListEventsResponseSchema } from './types';

export const listEvents: CorsairEndpoint<
	SymplaContext,
	ListEventsInput,
	ListEventsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('sympla', 'api_key');
	}

	const parsed = ListEventsInputSchema.parse(input ?? {});
	const body = await makeSymplaRequest<unknown>(ctx.key, {
		page: parsed.page,
		page_size: parsed.page_size,
		published: parsed.published,
		from: parsed.from,
		to: parsed.to,
		field_sort: parsed.field_sort,
		sort: parsed.sort,
	});
	const result = ListEventsResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'sympla.events.list',
		{ page: parsed.page ?? 1 },
		'completed',
	);
	return result;
};

export const Events = { list: listEvents };
