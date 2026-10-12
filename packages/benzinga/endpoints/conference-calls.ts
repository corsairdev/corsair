import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { ListConferenceCallsRawResponse } from './types';
import { ListConferenceCallsRawResponseSchema } from './types';

export const listConferenceCalls: BenzingaEndpoints['listConferenceCalls'] =
	async (ctx, input) => {
		const raw = await makeBenzingaRequest<ListConferenceCallsRawResponse>(
			'/api/v2.1/calendar/conference-calls',
			ctx.key,
			{
				page: input.page,
				pagesize: input.pagesize,
				'parameters[date]': input.date,
				'parameters[date_from]': input.dateFrom,
				'parameters[date_to]': input.dateTo,
				'parameters[tickers]': input.tickers,
				'parameters[updated]': input.updated,
			},
		);

		const parsed = ListConferenceCallsRawResponseSchema.parse(raw);
		const response = {
			conference: parsed.conference ?? parsed['conference-calls'] ?? [],
		};

		await logEventFromContext(
			ctx,
			'benzinga.calendar.listConferenceCalls',
			{ ...input },
			'completed',
		);

		return response;
	};
