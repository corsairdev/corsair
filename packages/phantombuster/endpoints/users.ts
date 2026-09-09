import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterEndpoints } from '../index';
import type { FetchMeResponse } from './types';

export const fetchMe: PhantomBusterEndpoints['fetchMe'] = async (ctx) => {
	const response = await makePhantomBusterRequest<FetchMeResponse>(
		'/users/fetch-me',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'phantombuster.users.fetchMe', {}, 'completed');

	return response;
};
