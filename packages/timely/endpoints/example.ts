import { logEventFromContext } from 'corsair/core';
import type { TimelyEndpoints } from '..';
import { makeTimelyRequest } from '../client';
import type { TimelyEndpointOutputs } from './types';

export const get: TimelyEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTimelyRequest<TimelyEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'timely.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
