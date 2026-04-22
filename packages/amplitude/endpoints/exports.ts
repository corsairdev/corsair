import { logEventFromContext } from 'corsair/core';
import { makeAmplitudeRequest } from '../client';
import type { AmplitudeEndpoints } from '../index';
import type { AmplitudeEndpointOutputs } from './types';

export const getData: AmplitudeEndpoints['exportsGetData'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['exportsGetData']
	>('/api/2/export', ctx.key, {
		method: 'GET',
		query: {
			start: input.start,
			end: input.end,
		},
	});

	await logEventFromContext(
		ctx,
		'amplitude.exports.getData',
		{ ...input },
		'completed',
	);
	return result;
};
