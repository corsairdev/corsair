import { logEventFromContext } from 'corsair/core';
import { makeKrakenRequest, parseKrakenCredentials } from '../client';
import type { KrakenEndpoints } from '../index';
import {
	KrakenEndpointInputSchemas,
	KrakenEndpointOutputSchemas,
} from './types';

export const checkStatus: KrakenEndpoints['accountCheckStatus'] = async (
	ctx,
	input,
) => {
	KrakenEndpointInputSchemas.accountCheckStatus.parse(input);
	const credentials = parseKrakenCredentials(ctx.key);

	const response = await makeKrakenRequest('user_status', credentials);
	const result = KrakenEndpointOutputSchemas.accountCheckStatus.parse(response);

	await logEventFromContext(ctx, 'kraken.account.checkStatus', {}, 'completed');
	return result;
};
