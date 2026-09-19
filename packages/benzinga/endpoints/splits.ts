import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const listSplits: BenzingaEndpoints['listSplits'] = async (
	ctx,
	input,
) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listSplits']
	>('/api/v2.1/calendar/splits', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			pagesize: input.pagesize,
			'parameters[date]': input.date,
			'parameters[date_from]': input.dateFrom,
			'parameters[date_to]': input.dateTo,
			'parameters[date_search_field]': input.date_search_field,
			'parameters[importance]': input.importance,
			'parameters[tickers]': input.tickers,
			'parameters[updated]': input.updated,
		},
	});

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listSplits',
		{ ...input },
		'completed',
	);

	return response;
};
