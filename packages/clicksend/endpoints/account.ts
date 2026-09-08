import { logEventFromContext } from 'corsair/core';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendEndpoints } from '../index';
import type { ClickSendEndpointOutputs } from './types';

export const get: ClickSendEndpoints['accountGet'] = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['accountGet']
	>('account', username, apiKey, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'clicksend.account.get',
		{ ...input },
		'completed',
	);

	return response;
};
