import { logEventFromContext } from 'corsair/core';
import type { ConvexEndpoints } from '..';
import { makeConvexRequest } from '../client';

export const deleteCustomDomain: ConvexEndpoints['customDomainDelete'] = async (
	ctx,
	input,
) => {
	await makeConvexRequest<void>(
		'/deployments/{deployment_name}/delete_custom_domain',
		ctx.key,
		{
			path: { deployment_name: input.deployment_name },
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
	return { success: true };
};

export const CustomDomainsEndpoints = {
	delete: deleteCustomDomain,
} as const;
