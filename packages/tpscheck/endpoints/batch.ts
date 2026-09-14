import { logEventFromContext } from 'corsair/core';
import type { TpscheckEndpoints } from '..';
import { makeTpscheckRequest } from '../client';
import {
	TpscheckEndpointInputSchemas,
	TpscheckEndpointOutputSchemas,
} from './types';

export const batch: TpscheckEndpoints['batch'] = async (ctx, input) => {
	const parsedInput = TpscheckEndpointInputSchemas.batch.parse(input);
	const response = await makeTpscheckRequest<unknown>('/batch', ctx.key, {
		method: 'POST',
		body: parsedInput,
		query: { version: '2' },
	});

	const parsed = TpscheckEndpointOutputSchemas.batch.parse(response);

	await logEventFromContext(
		ctx,
		'tpscheck.batch',
		{ count: parsedInput.phones.length },
		'completed',
	);

	return parsed;
};
