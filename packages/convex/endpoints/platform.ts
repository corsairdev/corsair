import { logEventFromContext } from 'corsair/core';
import type { ConvexEndpoints } from '..';
import { makeConvexRequest, managementPath } from '../client';
import type { ConvexEndpointOutputs } from './types';

export const getTokenDetails: ConvexEndpoints['tokenDetails'] = async (
	ctx,
	input,
) => {
	const response = await makeConvexRequest<
		ConvexEndpointOutputs['tokenDetails']
	>('/token_details', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'convex.platform.tokenDetails',
		{ ...input },
		'completed',
	);
	return response;
};

export const listDeploymentClasses: ConvexEndpoints['deploymentClassesList'] =
	async (ctx, input) => {
		const response = await makeConvexRequest<
			ConvexEndpointOutputs['deploymentClassesList']
		>(
			`/teams/${managementPath(input.team_id)}/list_deployment_classes`,
			ctx.key,
			{
				method: 'GET',
			},
		);

		await logEventFromContext(
			ctx,
			'convex.platform.deploymentClasses',
			{ team_id: input.team_id },
			'completed',
		);
		return response;
	};

export const listDeploymentRegions: ConvexEndpoints['deploymentRegionsList'] =
	async (ctx, input) => {
		const response = await makeConvexRequest<
			ConvexEndpointOutputs['deploymentRegionsList']
		>(
			`/teams/${managementPath(input.team_id)}/list_deployment_regions`,
			ctx.key,
			{
				method: 'GET',
			},
		);

		await logEventFromContext(
			ctx,
			'convex.platform.deploymentRegions',
			{ team_id: input.team_id },
			'completed',
		);
		return response;
	};

export const PlatformEndpoints = {
	getTokenDetails,
	listDeploymentClasses,
	listDeploymentRegions,
} as const;
