import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGmailRequest } from '../client';
import type { GmailEndpoints } from '../index';
import type { GmailEndpointOutputs } from './types';

export const getProfile: GmailEndpoints['usersGetProfile'] = async (
	ctx,
	input,
) => {
	// Encode the path segment so a userId cannot add or change path segments.
	const userId = encodeURIComponent(input.userId || 'me');
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['usersGetProfile']
	>(`/users/${userId}/profile`, ctx, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'gmail.users.getProfile',
		{ ...input },
		'completed',
	);
	return result;
};
