import { logEventFromContext } from 'corsair/core';
import type { WhautomateHandler } from '../client';
import { makeWhautomateRequest, resolveApiHost } from '../client';

import type {
	WhautomateEndpointInputs,
	WhautomateEndpointOutputs,
} from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getAccountInfo: WhautomateHandler<
	WhautomateEndpointInputs['getAccountInfo'],
	WhautomateEndpointOutputs['getAccountInfo']
> = async (ctx) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getAccountInfo']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		'/account-info',
		WhautomateEndpointOutputSchemas.getAccountInfo,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'whautomate.account.info', {}, 'completed');
	return result;
};

export const Account = {
	getAccountInfo,
};
