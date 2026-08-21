import { logEventFromContext } from 'corsair/core';
import type { StudioByAI21LabsEndpoints } from '..';
import { makeStudioByAI21LabsRequest } from '../client';
import type { StudioByAI21LabsEndpointOutputs } from './types';

export const completions: StudioByAI21LabsEndpoints['chatCompletions'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['chatCompletions']
	>('chat/completions', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'studiobyai21labs.chat.completions',
		{ ...input },
		'completed',
	);
	return response;
};
