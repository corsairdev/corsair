import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './types';

export const listDividends: BenzingaEndpoints['listDividends'] = async (
	ctx,
	rawInput,
) => {
	const input = BenzingaEndpointInputSchemas.listDividends.parse(rawInput);
	const raw = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listDividends']
	>('/api/v2.2/calendar/dividends', ctx.key, {
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
	});
	const response = BenzingaEndpointOutputSchemas.listDividends.parse(raw);

	await persistEntities(ctx.db.dividends, response.dividends, (r) => r.id);

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listDividends',
		{ ...input },
		'completed',
	);

	return response;
};
