import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const listRatings: BenzingaEndpoints['listRatings'] = async (
	ctx,
	input,
) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listRatings']
	>('/api/v2.1/calendar/ratings', ctx.key, {
		method: 'GET',
		query: {
			fields: input.fields,
			page: input.page,
			pagesize: input.pagesize,
			'parameters[date]': input.date,
			'parameters[date_from]': input.dateFrom,
			'parameters[date_to]': input.dateTo,
			'parameters[importance]': input.importance,
			'parameters[tickers]': input.tickers,
			'parameters[updated]': input.updated,
			'parameters[analyst_id]': input.analyst_id,
			'parameters[firm_id]': input.firm_id,
			'parameters[action]': input.action,
			analyst: input.analyst,
			firm: input.firm,
			simplify: input.simplify,
		},
	});

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listRatings',
		{ ...input },
		'completed',
	);

	return response;
};
