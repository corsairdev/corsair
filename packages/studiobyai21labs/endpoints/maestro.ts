import { logEventFromContext } from 'corsair/core';
import type { StudioByAI21LabsEndpoints } from '..';
import { makeStudioByAI21LabsRequest } from '../client';
import type { StudioByAI21LabsEndpointOutputs } from './types';

export const createRun: StudioByAI21LabsEndpoints['createMaestroRun'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest<
		StudioByAI21LabsEndpointOutputs['createMaestroRun']
	>('maestro/runs', ctx.key, {
		method: 'POST',
		body: {
			input: input.input,
			system_prompt: input.system_prompt,
			requirements: input.requirements,
			tools: input.tools,
			models: input.models,
			budget: input.budget,
			include: input.include,
			response_language: input.response_language,
		},
	});

	await logEventFromContext(
		ctx,
		'studiobyai21labs.maestro.createRun',
		{
			budget: input.budget,
			models: input.models,
			hasRequirements: Boolean(input.requirements?.length),
		},
		'completed',
	);
	return response;
};

export const retrieveRun: StudioByAI21LabsEndpoints['retrieveMaestroRun'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest<
			StudioByAI21LabsEndpointOutputs['retrieveMaestroRun']
		>(`maestro/runs/${input.id}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'studiobyai21labs.maestro.retrieveRun',
			{ id: input.id },
			'completed',
		);
		return response;
	};
