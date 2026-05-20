import { logEventFromContext } from 'corsair/core';
import type { TallyEndpoints } from '..';
import { makeTallyRequest } from '../client';
import type { TallyEndpointOutputs } from './types';

export const getMe: TallyEndpoints['usersGetMe'] = async (ctx, _input) => {
	const result = await makeTallyRequest<TallyEndpointOutputs['usersGetMe']>(
		'users/me',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'tally.users.getMe', {}, 'completed');
	return result;
};
