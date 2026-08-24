import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCICall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/** Reads the authenticated user's own profile. */
export const getCurrent: CircleCIEndpoints['userGetCurrent'] = async (ctx) => {
	const result = await circleCICall<CircleCIEndpointOutputs['userGetCurrent']>(
		ctx,
		'me',
	);

	await logEventFromContext(ctx, 'circleci.user.getCurrent', {}, 'completed');
	return result;
};

/** Reads another user's profile by id. */
export const getInfo: CircleCIEndpoints['userGetInfo'] = async (ctx, input) => {
	const result = await circleCICall<CircleCIEndpointOutputs['userGetInfo']>(
		ctx,
		`user/${input.userId}`,
	);

	await logEventFromContext(
		ctx,
		'circleci.user.getInfo',
		auditPayload(input, ['userId']),
		'completed',
	);
	return result;
};

/** Lists the organizations the caller belongs to or can collaborate on. */
export const listCollaborations: CircleCIEndpoints['userListCollaborations'] =
	async (ctx) => {
		const result = await circleCICall<
			CircleCIEndpointOutputs['userListCollaborations']
		>(ctx, 'me/collaborations');

		await logEventFromContext(
			ctx,
			'circleci.user.listCollaborations',
			{ returned: result.length },
			'completed',
		);
		return result;
	};
