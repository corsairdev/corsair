import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import { makeCampaynRequest } from '../client';
import { GetReportsInputSchema, GetReportsResponseSchema } from './types';

export const getReports: CampaynEndpoints['getReports'] = async (
	ctx,
	rawInput,
) => {
	const input = GetReportsInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>(
		'reports/calendar.json',
		ctx.key,
		{
			method: 'GET',
			query: {
				from: input.from,
				to: input.to,
			},
		},
	);
	const response = GetReportsResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.reports.getReports',
		input,
		'completed',
	);
	return response;
};
