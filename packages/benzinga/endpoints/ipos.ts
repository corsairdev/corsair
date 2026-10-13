import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs, ListIposRawResponse } from './types';
import { ListIposRawResponseSchema } from './types';

export const listIpos: BenzingaEndpoints['listIpos'] = async (ctx, input) => {
	const raw = await makeBenzingaRequest<ListIposRawResponse>(
		'/api/v2.1/calendar/ipos',
		ctx.key,
		{
			page: input.page,
			pagesize: input.pagesize,
			ipo_date: input.ipo_date,
			'parameters[date_from]': input.date_from,
			'parameters[date_to]': input.date_to,
			'parameters[tickers]': input.tickers,
			'parameters[ipo_type]': input.ipo_type,
			'parameters[updated]': input.updated,
		},
	);

	const parsed = ListIposRawResponseSchema.parse(raw);
	const response: BenzingaEndpointOutputs['listIpos'] = Array.isArray(parsed)
		? { ipos: parsed }
		: parsed;

	await persistEntities(ctx.db.ipos, response.ipos, (r) => r.id);

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listIpos',
		{ ...input },
		'completed',
	);

	return response;
};
