import { logEventFromContext } from 'corsair/core';
import type { JungleScoutEndpoints } from '..';
import { makeJungleScoutRequest } from '../client';
import type { SalesEstimatesQueryResponse } from './types';
import {
	JungleScoutEndpointInputSchemas,
	JungleScoutEndpointOutputSchemas,
} from './types';

export const query: JungleScoutEndpoints['salesEstimates.query'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JungleScoutEndpointInputSchemas['salesEstimates.query'].parse(input);

	const queryParams: Record<string, string | number | boolean | undefined> = {
		marketplace: parsedInput.marketplace,
		asin: parsedInput.asin,
		start_date: parsedInput.start_date,
		end_date: parsedInput.end_date,
	};

	const response = await makeJungleScoutRequest<SalesEstimatesQueryResponse>(
		'/api/sales_estimates_query',
		ctx.key,
		{
			method: 'GET',
			query: queryParams,
			apiType: ctx.options?.apiType,
		},
	);

	const parsed =
		JungleScoutEndpointOutputSchemas['salesEstimates.query'].parse(response);

	await logEventFromContext(
		ctx,
		'junglescout.salesEstimates.query',
		{
			marketplace: parsedInput.marketplace,
		},
		'completed',
	);

	return parsed;
};

export const SalesEstimates = {
	query,
};
