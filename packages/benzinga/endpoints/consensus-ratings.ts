import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './types';

export const getConsensusRatings: BenzingaEndpoints['getConsensusRatings'] =
	async (ctx, rawInput) => {
		const input =
			BenzingaEndpointInputSchemas.getConsensusRatings.parse(rawInput);
		const raw = await makeBenzingaRequest<
			BenzingaEndpointOutputs['getConsensusRatings']
		>('/api/v1/consensus-ratings', ctx.key, {
			'parameters[tickers]': input.ticker,
			pagesize: input.pagesize,
			'parameters[date_from]': input.dateFrom,
			'parameters[date_to]': input.dateTo,
			simplify: input.simplify,
			aggregate_type: input.aggregateType,
		});
		const response =
			BenzingaEndpointOutputSchemas.getConsensusRatings.parse(raw);

		const ticker = input.ticker.toUpperCase();
		await persistEntities(
			ctx.db.consensusRatings,
			[{ ...response, ticker }],
			(r) => r.ticker,
		);

		await logEventFromContext(
			ctx,
			'benzinga.calendar.getConsensusRatings',
			{ ...input },
			'completed',
		);

		return response;
	};
