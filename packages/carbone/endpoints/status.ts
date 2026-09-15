import { logEventFromContext } from 'corsair/core';
import { assertCarboneSuccess, makeCarboneRequest } from '../client';
import type { CarboneEndpoints } from '../index';
import type { GetStatusOutput } from './types';

export const getStatus: CarboneEndpoints['getStatus'] = async (ctx) => {
	const response = assertCarboneSuccess(
		await makeCarboneRequest<GetStatusOutput>('/status', {
			apiKey: ctx.key,
			method: 'GET',
		}),
	);

	await logEventFromContext(ctx, 'carbone.status.get', {}, 'completed');

	return response;
};
