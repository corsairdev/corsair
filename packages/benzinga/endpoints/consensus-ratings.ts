import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const getConsensusRatings: BenzingaEndpoints['getConsensusRatings'] =
	async (ctx, input) => {
		const response = await makeBenzingaRequest<
			BenzingaEndpointOutputs['getConsensusRatings']
		>('/api/v1/consensus-ratings', ctx.key, {
			'parameters[tickers]': input.ticker,
			pagesize: input.pagesize,
			'parameters[date_from]': input.dateFrom,
			'parameters[date_to]': input.dateTo,
			simplify: input.simplify,
			aggregate_type: input.aggregateType,
		});

		await logEventFromContext(
			ctx,
			'benzinga.calendar.getConsensusRatings',
			{ ...input },
			'completed',
		);

		return response;
	};
