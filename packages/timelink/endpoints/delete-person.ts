import { logEventFromContext } from 'corsair/core';
import type { TimelinkEndpoints } from '..';
import { makeTimelinkRequest } from '../client';
import type { TimelinkEndpointOutputs } from './types';

export const deletePerson: TimelinkEndpoints['deletePerson'] = async (
	ctx,
	input,
) => {
	const response = await makeTimelinkRequest<
		TimelinkEndpointOutputs['deletePerson']
	>(`clients/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'timelink.delete.person',
		{ ...input },
		'completed',
	);

	return response;
};
