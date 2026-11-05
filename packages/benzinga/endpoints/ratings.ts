import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './types';

export const listRatings: BenzingaEndpoints['listRatings'] = async (
	ctx,
	rawInput,
) => {
	const input = BenzingaEndpointInputSchemas.listRatings.parse(rawInput);
	const raw = await makeBenzingaRequest<BenzingaEndpointOutputs['listRatings']>(
		'/api/v2.1/calendar/ratings',
		ctx.key,
		{
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
	);
	const response = BenzingaEndpointOutputSchemas.listRatings.parse(raw);

	// A projected (`fields`) or simplified response is partial and must not
	// overwrite the full stored row.
	if (input.fields === undefined && !input.simplify) {
		await persistEntities(
			ctx.db.ratings,
			response.ratings.flatMap((r) =>
				r.id === undefined ? [] : [{ ...r, id: r.id }],
			),
			(r) => r.id,
		);
	}

	await logEventFromContext(
		ctx,
		'benzinga.calendar.listRatings',
		{ ...input },
		'completed',
	);

	return response;
};
