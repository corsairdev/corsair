import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterEndpoints } from '../index';
import type { FetchOrgResourcesResponse, FetchOrgResponse } from './types';

export const fetch: PhantomBusterEndpoints['fetchOrg'] = async (ctx) => {
	const response = await makePhantomBusterRequest<FetchOrgResponse>(
		'/orgs/fetch',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'phantombuster.orgs.fetch', {}, 'completed');

	return response;
};

export const fetchResources: PhantomBusterEndpoints['fetchOrgResources'] =
	async (ctx) => {
		const response =
			await makePhantomBusterRequest<FetchOrgResourcesResponse>(
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
