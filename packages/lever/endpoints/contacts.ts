import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';
export const retrieveContact: LeverEndpoints['retrieveContact'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['retrieveContact']
	>(
		ctx,
		leverPathParameter('/contacts/{contactId}', 'contactId', input.contactId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.contacts.retrieve', input, 'completed');
	return response;
};

export const updateContact: LeverEndpoints['updateContact'] = async (
	ctx,
	input,
) => {
	const { contactId, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['updateContact']
	>(ctx, leverPathParameter('/contacts/{contactId}', 'contactId', contactId), {
		method: 'PUT',
		body,
	});
	await logEventFromContext(ctx, 'lever.contacts.update', input, 'completed');
	return response;
};
