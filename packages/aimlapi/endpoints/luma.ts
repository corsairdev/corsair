import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';

function resolveGenerationId(input: {
	generationId?: string;
	ids?: string;
}): string {
	if (input.generationId) return input.generationId;
	// Composio-style comma-separated ids — use the first.
	return (input.ids ?? '').split(',')[0]?.trim() ?? '';
}

export const getGeneration: AimlApiEndpoints['lumaGetGeneration'] = async (
	ctx,
	input,
) => {
	const generationId = resolveGenerationId(input);
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['lumaGetGeneration']
	>(`/v2/video/generations`, ctx.key, {
		method: 'GET',
		query: {
			generation_id: generationId,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.luma.getGeneration',
		{ generationId },
		'completed',
	);

	return response;
};

export const listGenerations: AimlApiEndpoints['lumaListGenerations'] = async (
	ctx,
	input,
) => {
	// AIMLAPI documents poll-by-id only; claim keeps limit/offset for Composio parity.
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['lumaListGenerations']
	>(`/v2/video/generations`, ctx.key, {
		method: 'GET',
		query: {
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.luma.listGenerations',
		{ resultCount: Array.isArray(response) ? response.length : 0 },
		'completed',
	);

	return response;
};
