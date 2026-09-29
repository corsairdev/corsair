import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGmailRequest } from '../client';
import type { GmailEndpoints } from '../index';
import type { GmailEndpointOutputs } from './types';

export const getProfile: GmailEndpoints['usersGetProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['usersGetProfile']
	>(`/users/${input.userId || 'me'}/profile`, ctx, {
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
