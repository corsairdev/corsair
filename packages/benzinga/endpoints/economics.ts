import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';

export const listEconomics: BenzingaEndpoints['listEconomics'] = async (
	ctx,
	input,
) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listEconomics']
	>('/api/v2.1/calendar/economics', ctx.key, {
		page: input.page,
		pagesize: input.pagesize,
		'parameters[date]': input.date,
		'parameters[date_from]': input.dateFrom,
		'parameters[date_to]': input.dateTo,
		'parameters[importance]': input.importance,
		'parameters[updated]': input.updated,
		country: input.country,
		event_name: input.event_name,
		event_category: input.event_category,
	});

	await persistEntities(ctx.db.economics, response.economics, (r) => r.id);

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listEconomics',
		{ ...input },
		'completed',
	);

	return response;
};
