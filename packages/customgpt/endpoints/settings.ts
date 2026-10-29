import { logEventFromContext } from 'corsair/core';
import type { CustomGPTEndpoints } from '..';
import { makeCustomGPTRequest } from '../client';
import { omit } from './shared';
import type { CustomGPTEndpointOutputs } from './types';

export const getProjectSettings: CustomGPTEndpoints['getProjectSettings'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['getProjectSettings']
		>(`projects/${input.projectId}/settings`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'customgpt.settings.get',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateProjectSettings: CustomGPTEndpoints['updateProjectSettings'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['updateProjectSettings']
		>(`projects/${input.projectId}/settings`, ctx.key, {
			method: 'POST',
			formData: omit(input, ['projectId']),
		});

		await logEventFromContext(
			ctx,
			'customgpt.settings.update',
			{
				projectId: input.projectId,
				fields: Object.keys(omit(input, ['projectId'])),
			},
			'completed',
		);
		return response;
	};

export const listPersonas: CustomGPTEndpoints['listPersonas'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['listPersonas']
	>(`projects/${input.projectId}/settings/personas`, ctx.key, {
		method: 'GET',
		query: omit(input, ['projectId']),
	});

	await logEventFromContext(
		ctx,
		'customgpt.personas.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const activatePersonaVersion: CustomGPTEndpoints['activatePersonaVersion'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['activatePersonaVersion']
		>(
			`projects/${input.projectId}/settings/persona-activate/${input.version}`,
			ctx.key,
			{ method: 'PUT' },
		);

		await logEventFromContext(
			ctx,
			'customgpt.personas.activate',
			{ ...input },
			'completed',
		);
		return response;
	};
