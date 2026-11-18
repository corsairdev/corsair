import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import type { LeverEndpointOutputs } from './types';
export const retrieveEeoResponsesWithPii: LeverEndpoints['retrieveEeoResponsesWithPii'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveEeoResponsesWithPii']
		>(ctx, '/eeo/responses/pii', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'lever.eeo.retrieveWithPii',
			input,
			'completed',
		);
		return response;
	};

export const retrieveEeoResponsesAnonymous: LeverEndpoints['retrieveEeoResponsesAnonymous'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveEeoResponsesAnonymous']
		>(ctx, '/eeo/responses', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'lever.eeo.retrieveAnonymous',
			input,
			'completed',
		);
		return response;
	};
