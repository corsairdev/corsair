import { logEventFromContext } from 'corsair/core';
import { makeSynthflowRequest } from '../client';
import type { SynthflowEndpoints } from '../index';
import type { SynthflowEndpointOutputs } from './types';

export const attach: SynthflowEndpoints['knowledgeBasesAttach'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowRequest<
		SynthflowEndpointOutputs['knowledgeBasesAttach']
	>(`knowledge_base/${input.knowledge_base_id}/attach`, ctx.key, {
		method: 'POST',
		query: {
			model_id: input.model_id,
		},
	});

	await logEventFromContext(
		ctx,
		'synthflow.knowledgeBases.attach',
		{
			knowledge_base_id: input.knowledge_base_id,
			model_id: input.model_id,
		},
		'completed',
	);

	return response;
};
