import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '..';
import { makeCollegeFootballDataRequest } from '../client';
import type { CollegeFootballDataEndpointOutputs } from './types';

export const get: CollegeFootballDataEndpoints['exampleGet'] = async (
	ctx,
	input,
) => {
	const response = await makeCollegeFootballDataRequest<
		CollegeFootballDataEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'collegefootballdata.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
