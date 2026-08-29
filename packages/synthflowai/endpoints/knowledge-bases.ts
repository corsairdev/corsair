import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const create: SynthflowAiEndpoints['knowledgeBasesCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['knowledgeBasesCreate']
	>('knowledge_base', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.knowledgeBases.create',
		{ name: input.name, rag_use_condition: input.rag_use_condition },
		'completed',
	);

	return response;
};

export const get: SynthflowAiEndpoints['knowledgeBasesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['knowledgeBasesGet']
	>(`knowledge_base/${input.knowledge_base_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.knowledgeBases.get',
		{ knowledge_base_id: input.knowledge_base_id },
		'completed',
	);

	return response;
};

export const update: SynthflowAiEndpoints['knowledgeBasesUpdate'] = async (
	ctx,
	input,
) => {
	const { knowledge_base_id, ...body } = input;
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['knowledgeBasesUpdate']
	>(`knowledge_base/${knowledge_base_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.knowledgeBases.update',
		{ knowledge_base_id },
		'completed',
	);

	return response;
};

export const deleteKnowledgeBase: SynthflowAiEndpoints['knowledgeBasesDelete'] =
	async (ctx, input) => {
		const response = await makeSynthflowAiRequest<
			SynthflowAiEndpointOutputs['knowledgeBasesDelete']
		>(`knowledge_base/${input.knowledge_base_id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'synthflowai.knowledgeBases.delete',
			{ knowledge_base_id: input.knowledge_base_id },
			'completed',
		);

		return response;
	};

export const attach: SynthflowAiEndpoints['knowledgeBasesAttach'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['knowledgeBasesAttach']
	>(`knowledge_base/${input.knowledge_base_id}/attach`, ctx.key, {
		method: 'POST',
		query: {
			model_id: input.model_id,
		},
	});

	await logEventFromContext(
		ctx,
		'synthflowai.knowledgeBases.attach',
		{
			knowledge_base_id: input.knowledge_base_id,
			model_id: input.model_id,
		},
		'completed',
	);

	return response;
};

export const detach: SynthflowAiEndpoints['knowledgeBasesDetach'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['knowledgeBasesDetach']
	>(`knowledge_base/${input.knowledge_base_id}/detach`, ctx.key, {
		method: 'POST',
		query: {
			model_id: input.model_id,
		},
	});

	await logEventFromContext(
		ctx,
		'synthflowai.knowledgeBases.detach',
		{
			knowledge_base_id: input.knowledge_base_id,
			model_id: input.model_id,
		},
		'completed',
	);

	return response;
};
