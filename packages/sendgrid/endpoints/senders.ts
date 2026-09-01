import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';
import type { SendGridEndpointOutputs } from './types';

export const getAll: SendGridEndpoints['sendersGetAll'] = async (
	ctx,
	input,
) => {
	const response = await makeSendGridRequest<
		SendGridEndpointOutputs['sendersGetAll']
	>('verified_senders', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'sendgrid.senders.getAll',
		{ ...input },
		'completed',
	);
	return response;
};
