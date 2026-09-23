import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const get: XeroEndpoints['connectionsGet'] = async (ctx, input) => {
	const response = await makeXeroRequest<XeroEndpointOutputs['connectionsGet']>(
		'https://api.xero.com/connections',
		ctx.key,
		{
			method: 'GET',
			isRawUrl: true,
		},
	);

	await logEventFromContext(
		ctx,
		'xero.connections.get',
		{ count: response.length },
		'completed',
	);
	return response;
};

export const Connections = {
	get,
};
