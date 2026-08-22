import { logEventFromContext } from 'corsair/core';
import type { ConvexEndpoints } from '..';
import { makeConvexRequest, managementPath } from '../client';
import type { ConvexEndpointOutputs } from './types';

export const deleteCustomDomain: ConvexEndpoints['customDomainDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeConvexRequest<
		ConvexEndpointOutputs['customDomainDelete']
	>(
		`/deployments/${managementPath(input.deployment_name)}/delete_custom_domain`,
		ctx.key,
		{
			method: 'POST',
			body: {
				requestDestination: input.requestDestination,
				domain: input.domain,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'convex.customDomains.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const CustomDomainsEndpoints = {
	delete: deleteCustomDomain,
} as const;
