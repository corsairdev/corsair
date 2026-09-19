import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { bigmailerCall } from './shared';
import type { BigmailerEndpointOutputs } from './types';

/**
 * `GET /me` - a lightweight auth/configuration check, per
 * `docs.bigmailer.io/docs/getting-started-api`. Not part of the
 * OpenAPI-derived `llms.txt` endpoint index, so its response shape is
 * undocumented; returned as-is rather than parsed field by field, the same
 * treatment Doppler's `auth.me` (also undocumented) uses.
 */
export const me: BigmailerEndpoints['authMe'] = async (ctx) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['authMe']>(
		ctx,
		'me',
	);

	await logEventFromContext(ctx, 'bigmailer.auth.me', {}, 'completed');
	return result;
};
