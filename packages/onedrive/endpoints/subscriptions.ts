import { logEventFromContext } from 'corsair/core';
import type { OnedriveEndpoints } from '..';
import { makeOnedriveRequest } from '../client';
import type { OnedriveEndpointOutputs } from './types';

export const list: OnedriveEndpoints['subscriptionsList'] = async (
	ctx,
	_input,
) => {
	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['subscriptionsList']
	>('subscriptions', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'onedrive.subscriptions.list',
		{},
		'completed',
	);
	return result;
};
