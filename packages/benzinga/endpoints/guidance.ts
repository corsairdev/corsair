import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';

export const listGuidance: BenzingaEndpoints['listGuidance'] = async (
	ctx,
	input,
) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listGuidance']
	>('/api/v2.1/calendar/guidance', ctx.key, {
		page: input.page,
		pagesize: input.pagesize,
		'parameters[date]': input.date,
		'parameters[date_from]': input.dateFrom,
		'parameters[date_to]': input.dateTo,
		'parameters[importance]': input.importance,
		'parameters[is_primary]': input.is_primary,
		'parameters[tickers]': input.tickers,
		'parameters[updated]': input.updated,
	});

	await persistEntities(ctx.db.guidance, response.guidance, (r) => r.id);

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listGuidance',
		{ ...input },
		'completed',
	);

	return response;
};
