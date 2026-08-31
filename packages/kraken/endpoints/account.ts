import { logEventFromContext } from 'corsair/core';
import { makeKrakenRequest, parseKrakenCredentials } from '../client';
import type { KrakenEndpoints } from '../index';
import type { KrakenEndpointOutputs } from './types';

export const checkStatus: KrakenEndpoints['accountCheckStatus'] = async (
	ctx,
) => {
	const credentials = parseKrakenCredentials(ctx.key);

	const response = await makeKrakenRequest<
		KrakenEndpointOutputs['accountCheckStatus']
	>('user_status', credentials);

	await logEventFromContext(ctx, 'kraken.account.checkStatus', {}, 'completed');
	return response;
};
