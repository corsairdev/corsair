import { logEventFromContext } from 'corsair/core';
import type { TallyEndpoints } from '..';
import type { TallyEndpointOutputs } from './types';
import { makeTallyRequest } from '../client';

export const getMe: TallyEndpoints['usersGetMe'] = async (ctx, _input) => {
	const result = await makeTallyRequest<TallyEndpointOutputs['usersGetMe']>(
		'users/me',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'tally.users.getMe', {}, 'completed');
	return result;
};
