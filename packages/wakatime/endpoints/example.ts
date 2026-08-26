import { logEventFromContext } from 'corsair/core';
import type { WakaTimeEndpoints } from '..';
import { makeWakaTimeRequest } from '../client';
import type { WakaTimeEndpointOutputs } from './types';

export const getCurrentUser: WakaTimeEndpoints['getCurrentUser'] = async (
	ctx,
) => {
	const response = await makeWakaTimeRequest<
		WakaTimeEndpointOutputs['getCurrentUser']
	>('users/current', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'wakatime.users.current', {}, 'completed');

	return response;
};
