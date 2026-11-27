import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGmailRequest } from '../client';
import type { GmailEndpoints } from '../index';
import type { GmailEndpointOutputs } from './types';
import { GmailEndpointInputSchemas, GmailEndpointOutputSchemas } from './types';

export const getProfile: GmailEndpoints['usersGetProfile'] = async (
	ctx,
	input,
) => {
	const parsed = GmailEndpointInputSchemas.usersGetProfile.parse(input);
	// Encode the path segment so a userId cannot add or change path segments.
	const userId = encodeURIComponent(parsed.userId || 'me');
	const response = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['usersGetProfile']
	>(`/users/${userId}/profile`, ctx, {
		method: 'GET',
	});
	const validated = GmailEndpointOutputSchemas.usersGetProfile.parse(response);

	await logEventFromContext(
		ctx,
		'gmail.users.getProfile',
		{ ...parsed },
		'completed',
	);
	return validated;
};
