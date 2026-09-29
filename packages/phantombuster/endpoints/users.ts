import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	FetchMeInput,
	FetchMeResponse,
	UpdateMeInput,
	UpdateMeResponse,
} from './types';

export const fetchMe = async (
	ctx: PhantomBusterContext,
	input: FetchMeInput,
): Promise<FetchMeResponse> => {
	const response = await makePhantomBusterRequest<FetchMeResponse>(
		'/users/fetch-me',
		ctx.key,
		{
			method: 'GET',
			query: {
				detailedOrgId: input.detailedOrgId,
				withCustomPrompts: input.withCustomPrompts,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.users.fetchMe',
		{},
		'completed',
	);

	return response;
};

export const updateMe = async (
	ctx: PhantomBusterContext,
	input: UpdateMeInput,
): Promise<UpdateMeResponse> => {
	const response = await makePhantomBusterRequest<UpdateMeResponse>(
		'/users/update-me',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.users.updateMe',
		{},
		'completed',
	);

	return response;
};
