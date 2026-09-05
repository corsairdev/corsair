import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getAccountInfo: WhautomateEndpoints['getAccountInfo'] = async (
	ctx,
) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getAccountInfo']
	>(
		ctx.options.apiHost!,
		ctx.key,
		'/account',
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
