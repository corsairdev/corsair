import { logEventFromContext } from 'corsair/core';
import type { AmbientWeatherEndpoints } from '..';
import { makeAmbientWeatherRequest } from '../client';
import type { AmbientWeatherEndpointOutputs } from './types';

export const get: AmbientWeatherEndpoints['exampleGet'] = async (
	ctx,
	input,
) => {
	const response = await makeAmbientWeatherRequest<
		AmbientWeatherEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'ambientweather.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
