import { logEventFromContext } from 'corsair/core';
import type { StudioByAI21LabsEndpoints } from '..';
import { makeStudioByAI21LabsRequest } from '../client';
import type { StudioByAI21LabsEndpointOutputs } from './types';

export const get: StudioByAI21LabsEndpoints['exampleGet'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'studiobyai21labs.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
