import { logEventFromContext } from 'corsair/core';
import { makeFalRequest } from '../client';
import type { FalEndpoints } from '../index';
import { FalEndpointInputSchemas, FalEndpointOutputSchemas } from './types';

/** Needs a key with billing read permission (fal's BILLING, READONLY or FULL presets). */
export const billing: FalEndpoints['accountBilling'] = async (
	ctx,
	rawInput,
) => {
	FalEndpointInputSchemas.accountBilling.parse(rawInput ?? {});
	const response = FalEndpointOutputSchemas.accountBilling.parse(
		await makeFalRequest('api', '/account/billing', ctx.key, {
			method: 'GET',
			query: { expand: 'credits' },
		}),
	);
	await logEventFromContext(ctx, 'fal.account.billing', {}, 'completed');
	return response;
};
