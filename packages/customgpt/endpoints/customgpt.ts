import { logEventFromContext } from 'corsair/core';
import type { CustomGPTEndpoints } from '..';
import { makeCustomGPTRequest } from '../client';
import type { CustomGPTEndpointOutputs } from './types';

export const listProjects: CustomGPTEndpoints['listProjects'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['listProjects']
	>('projects', ctx.key, {
		method: 'GET',
		query: input.page ? { page: input.page } : undefined,
	});

	await logEventFromContext(
		ctx,
		'customgpt.projects.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const createConversation: CustomGPTEndpoints['createConversation'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['createConversation']
		>(`projects/${input.projectId}/conversations`, ctx.key, {
			method: 'POST',
			body: input.name ? { name: input.name } : undefined,
		});

		await logEventFromContext(
			ctx,
			'customgpt.conversations.create',
			{ ...input },
			'completed',
		);
		return response;
	};

export const sendMessage: CustomGPTEndpoints['sendMessage'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['sendMessage']
	>(
		`projects/${input.projectId}/conversations/${input.sessionId}/messages`,
		ctx.key,
		{
			method: 'POST',
			body: { prompt: input.prompt },
			isModelCall: true,
		},
	);

	await logEventFromContext(
		ctx,
		'customgpt.messages.send',
		{
			projectId: input.projectId,
			sessionId: input.sessionId,
		},
		'completed',
	);
	return response;
};

export const getMessages: CustomGPTEndpoints['getMessages'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getMessages']
	>(
		`projects/${input.projectId}/conversations/${input.sessionId}/messages`,
		ctx.key,
		{
			method: 'GET',
			query: input.page ? { page: input.page } : undefined,
		},
	);

	await logEventFromContext(
		ctx,
		'customgpt.messages.get',
		{ ...input },
		'completed',
	);
	return response;
};
