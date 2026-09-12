import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const listDividends: BenzingaEndpoints['listDividends'] = async (
	ctx,
	input,
) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listDividends']
	>('/api/v2.2/calendar/dividends', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			pagesize: input.pagesize,
			'parameters[date]': input.date,
			'parameters[date_from]': input.dateFrom,
			'parameters[date_to]': input.dateTo,
			'parameters[date_sort]': input.dateSort,
			'parameters[dividend_yield]': input.dividend_yield,
			'parameters[dividend_yield_operation]': input.dividend_yield_operation,
			'parameters[importance]': input.importance,
			'parameters[tickers]': input.tickers,
			'parameters[updated]': input.updated,
		},
	});

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listDividends',
		{ ...input },
		'completed',
	);

	return response;
};
