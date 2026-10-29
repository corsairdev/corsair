import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { compact, dopplerCall, seg } from './shared';
import type { DopplerEndpointOutputs } from './types';

/**
 * Not mirrored - a workplace user's real name and email are identity data,
 * not configuration, and are never persisted or logged. See
 * `endpoints/logging.ts` and `endpoints/types.ts`'s `WorkplaceUserSchema`
 * doc comment.
 */

/** Lists users in the workplace, optionally filtered by email. */
export const list: DopplerEndpoints['workplaceUsersList'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		workplace_users: DopplerEndpointOutputs['workplaceUsersList']['workplace_users'];
		page?: number | null;
	}>(ctx, 'workplace/users', {
		query: compact({ page: input.page, email: input.email }),
	});

	await logEventFromContext(
		ctx,
		'doppler.workplaceUsers.list',
		{ ...auditPayload(input, []), returned: result.workplace_users.length },
		'completed',
	);
	return result;
};

/** Retrieves a specific workplace user by id. */
export const get: DopplerEndpoints['workplaceUsersGet'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		workplace_user: DopplerEndpointOutputs['workplaceUsersGet'];
	}>(ctx, `workplace/users/${seg(input.slug)}`);

	await logEventFromContext(
		ctx,
		'doppler.workplaceUsers.get',
		auditPayload(input, ['slug']),
		'completed',
	);
	return result.workplace_user;
};
