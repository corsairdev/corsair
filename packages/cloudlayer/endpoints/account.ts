import { logEventFromContext } from 'corsair/core';
import type { CloudlayerEndpoints } from '..';
import { makeCloudlayerRequest } from '../client';
import type { AccountGetOutput } from './types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './types';

// https://cloudlayer.io/docs/account/ — GET /v2/account
export const accountGet: CloudlayerEndpoints['account']['get'] = async (
	ctx,
	input,
) => {
	// account.get takes no parameters; parsing still rejects an unexpected shape.
	CloudlayerEndpointInputSchemas['account.get'].parse(input);

	const response = await makeCloudlayerRequest<AccountGetOutput>(
		'/account',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = CloudlayerEndpointOutputSchemas['account.get'].parse(response);

	// The account payload holds the billing email and usage counters, so the
	// event records only that the account was read.
	await logEventFromContext(ctx, 'cloudlayer.account.get', {}, 'completed');

	return parsed;
};
