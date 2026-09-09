import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	FetchOrgInput,
	FetchOrgResourcesInput,
	FetchOrgResourcesResponse,
	FetchOrgResponse,
} from './types';

export const fetch = async (
	ctx: PhantomBusterContext,
	_input: FetchOrgInput,
): Promise<FetchOrgResponse> => {
	const response = await makePhantomBusterRequest<FetchOrgResponse>(
		'/orgs/fetch',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'phantombuster.orgs.fetch', {}, 'completed');

	return response;
};

export const fetchResources = async (
	ctx: PhantomBusterContext,
	_input: FetchOrgResourcesInput,
): Promise<FetchOrgResourcesResponse> => {
	const response = await makePhantomBusterRequest<FetchOrgResourcesResponse>(
		'/orgs/fetch-resources',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.orgs.fetchResources',
		{},
		'completed',
	);

	return response;
};
