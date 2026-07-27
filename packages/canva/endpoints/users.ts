import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs } from './types';

export const getMe: CanvaEndpoints['usersGetMe'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['usersGetMe']>(
		'v1/users/me',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'canva.users.getMe',
		{ ...input },
		'completed',
	);
	return result;
};

export const getProfile: CanvaEndpoints['usersGetProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['usersGetProfile']
	>('v1/users/me/profile', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'canva.users.getProfile',
		{ ...input },
		'completed',
	);
	return result;
};
