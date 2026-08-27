import { logEventFromContext } from 'corsair/core';
import type { WakaTimeEndpoints } from '..';
import { makeWakaTimeRequest } from '../client';
import type { WakaTimeEndpointOutputs } from './types';
import { WakaTimeEndpointOutputSchemas } from './types';

/** Fetches and validates the authenticated WakaTime user response. */
export const getCurrentUser: WakaTimeEndpoints['getCurrentUser'] = async (
	ctx,
) => {
	const response = await makeWakaTimeRequest<
		WakaTimeEndpointOutputs['getCurrentUser']
	>('users/current', ctx.key);

	const validatedResponse =
		WakaTimeEndpointOutputSchemas.getCurrentUser.parse(response);

	await logEventFromContext(ctx, 'wakatime.users.current', {}, 'completed');

	return validatedResponse;
};
