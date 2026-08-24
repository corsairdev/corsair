import { logEventFromContext } from 'corsair/core';
import type { CustomGPTEndpoints } from '..';
import { makeCustomGPTRequest } from '../client';
import { toUploadFile } from './shared';
import type { CustomGPTEndpointOutputs } from './types';

export const getUsageLimits: CustomGPTEndpoints['getUsageLimits'] = async (
	ctx,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getUsageLimits']
	>('limits/usage', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'customgpt.limits.usage', {}, 'completed');
	return response;
};

export const getUserProfile: CustomGPTEndpoints['getUserProfile'] = async (
	ctx,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getUserProfile']
	>('user', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'customgpt.user.get', {}, 'completed');
	return response;
};

export const updateUserProfile: CustomGPTEndpoints['updateUserProfile'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['updateUserProfile']
		>('user', ctx.key, {
			method: 'POST',
			formData: {
				...(input.name === undefined ? {} : { name: input.name }),
				...(input.profile_photo
					? { profile_photo: toUploadFile(input.profile_photo) }
					: {}),
			},
		});

		await logEventFromContext(
			ctx,
			'customgpt.user.update',
			{ updated_name: input.name !== undefined },
			'completed',
		);
		return response;
	};

export const searchTeamMembers: CustomGPTEndpoints['searchTeamMembers'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['searchTeamMembers']
		>('user/search-team-member', ctx.key, {
			method: 'GET',
			query: { email: input.email, user_id: input.user_id },
		});

		await logEventFromContext(
			ctx,
			'customgpt.user.search-team-member',
			{ by: input.email ? 'email' : 'user_id' },
			'completed',
		);
		return response;
	};
