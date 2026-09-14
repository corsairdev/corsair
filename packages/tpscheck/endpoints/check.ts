import { logEventFromContext } from 'corsair/core';
import type { TpscheckEndpoints } from '..';
import { makeTpscheckRequest } from '../client';
import {
	TpscheckEndpointInputSchemas,
	TpscheckEndpointOutputSchemas,
} from './types';

export const check: TpscheckEndpoints['check'] = async (ctx, input) => {
	const parsedInput = TpscheckEndpointInputSchemas.check.parse(input);
	const response = await makeTpscheckRequest<unknown>('/check', ctx.key, {
		method: 'POST',
		body: parsedInput,
		query: { version: '2' },
	});

	const parsed = TpscheckEndpointOutputSchemas.check.parse(response);

	await logEventFromContext(
		ctx,
		'tpscheck.check',
		{ phone: parsedInput.phone },
		'completed',
	);

	return parsed;
};
