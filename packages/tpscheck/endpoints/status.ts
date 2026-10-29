import { logEventFromContext } from 'corsair/core';
import type { TpscheckEndpoints } from '..';
import { makeTpscheckRequest } from '../client';
import type { StatusResponse } from './types';
import {
	TpscheckEndpointInputSchemas,
	TpscheckEndpointOutputSchemas,
} from './types';

export const status: TpscheckEndpoints['status'] = async (ctx, input) => {
	const parsedInput = TpscheckEndpointInputSchemas.status.parse(input);
	// Docs §4 marks /status as public: no API key is sent here.
	const response = await makeTpscheckRequest<StatusResponse>(
		'/status',
		undefined,
		{
			method: 'GET',
		},
	);

	const parsed = TpscheckEndpointOutputSchemas.status.parse(response);

	await logEventFromContext(ctx, 'tpscheck.status', {}, 'completed');

	return parsed;
};
