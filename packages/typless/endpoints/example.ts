import { logEventFromContext } from 'corsair/core';
import type { TyplessEndpoints } from '..';
import { makeTyplessRequest } from '../client';
import type { TyplessEndpointOutputs } from './types';

export const get: TyplessEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTyplessRequest<
		TyplessEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'typless.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
