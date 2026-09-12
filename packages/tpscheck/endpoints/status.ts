import { logEventFromContext } from 'corsair/core';
import type { TpscheckEndpoints } from '..';
import { makeTpscheckRequest } from '../client';
import {
	TpscheckEndpointInputSchemas,
	TpscheckEndpointOutputSchemas,
} from './types';

export const status: TpscheckEndpoints['status'] = async (ctx, input) => {
	const parsedInput = TpscheckEndpointInputSchemas.status.parse(input);
	const response = await makeTpscheckRequest<unknown>('/status', undefined, {
		method: 'GET',
	});

	const parsed = TpscheckEndpointOutputSchemas.status.parse(response);

	await logEventFromContext(ctx, 'tpscheck.status', {}, 'completed');

	return parsed;
};
