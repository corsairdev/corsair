import { logEventFromContext } from 'corsair/core';
import type { TpscheckEndpoints } from '..';
import { makeTpscheckRequest } from '../client';
import {
	TpscheckEndpointInputSchemas,
	TpscheckEndpointOutputSchemas,
} from './types';

export const credits: TpscheckEndpoints['credits'] = async (ctx, input) => {
	const parsedInput = TpscheckEndpointInputSchemas.credits.parse(input);
	const response = await makeTpscheckRequest<unknown>('/credits', ctx.key, {
		method: 'GET',
	});

	const parsed = TpscheckEndpointOutputSchemas.credits.parse(response);

	await logEventFromContext(ctx, 'tpscheck.credits', {}, 'completed');

	return parsed;
};
