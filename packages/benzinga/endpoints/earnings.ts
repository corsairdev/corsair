import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';

export const listEarnings: BenzingaEndpoints['listEarnings'] = async (
	ctx,
	input,
) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listEarnings']
	>('/api/v2.1/calendar/earnings', ctx.key, {
		page: input.page,
		pagesize: input.pagesize,
		'parameters[date]': input.date,
		'parameters[date_from]': input.dateFrom,
		'parameters[date_to]': input.dateTo,
		'parameters[date_sort]': input.dateSort,
		'parameters[importance]': input.importance,
		'parameters[tickers]': input.tickers,
		'parameters[updated]': input.updated,
	});

	await persistEntities(ctx.db.earnings, response.earnings, (r) => r.id);

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listEarnings',
		{ ...input },
		'completed',
	);

	return response;
};
