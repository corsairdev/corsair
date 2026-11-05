import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/**
 * Not mirrored - each pending invite carries the invitee's real email
 * (confirmed live). Never logged, never mirrored. See
 * `endpoints/logging.ts`.
 */

/** Lists pending workplace invites, paginated. */
export const list: DopplerEndpoints['invitesList'] = async (ctx, input) => {
	const result = await dopplerCall<{
		page: number;
		invites: DopplerEndpointOutputs['invitesList']['invites'];
	}>(ctx, 'workplace/invites', {
		query: compact({ page: input.page, per_page: input.perPage }),
	});

	await logEventFromContext(
		ctx,
		'doppler.invites.list',
		{ returned: result.invites.length },
		'completed',
	);
	return result;
};
