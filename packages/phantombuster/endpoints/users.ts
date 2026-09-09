import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type { FetchMeInput, FetchMeResponse } from './types';

export const fetchMe = async (
	ctx: PhantomBusterContext,
	_input: FetchMeInput,
): Promise<FetchMeResponse> => {
	const response = await makePhantomBusterRequest<FetchMeResponse>(
		'/users/fetch-me',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'phantombuster.users.fetchMe', {}, 'completed');

	return response;
};
