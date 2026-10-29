import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/** Returns information about the authenticated token - workplace, permissions, token type. */
export const me: DopplerEndpoints['authMe'] = async (ctx) => {
	const result = await dopplerCall<DopplerEndpointOutputs['authMe']>(ctx, 'me');

	await logEventFromContext(ctx, 'doppler.auth.me', {}, 'completed');
	return result;
};
