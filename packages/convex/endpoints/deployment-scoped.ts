import { logEventFromContext } from 'corsair/core';
import type { ConvexContext, ConvexEndpoints } from '..';
import { makeConvexRequest } from '../client';
import type { ConvexEndpointOutputs } from './types';

async function resolveDeploymentUrl(
	ctx: ConvexContext,
	inputSubdomain: string | undefined,
): Promise<string> {
	const subdomain =
		inputSubdomain ??
		ctx.options.subdomain ??
		(await ctx.keys.get_subdomain()) ??
		'';
	if (!subdomain) {
		throw new Error(
			'Convex deployment name (subdomain) is required for deployment-scoped operations',
		);
	}
	return `https://${subdomain}.convex.cloud/api`;
}

export const executeQueryBatch: ConvexEndpoints['executeQueryBatch'] = async (
	ctx,
	input,
) => {
	const baseUrl = await resolveDeploymentUrl(ctx, input.subdomain);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['executeQueryBatch']
	>('/query_batch', ctx.key, {
		method: 'POST',
		baseUrl,
		authScheme: 'convex',
		body: {
			format: input.format ?? 'json',
			queries: input.queries.map((query) => ({
				path: query.path,
				args: query.args,
				...(query.format ? { format: query.format } : {}),
			})),
		},
	});

	await logEventFromContext(
		ctx,
		'convex.deployment.executeQueryBatch',
		{ queries: input.queries.map((query) => query.path) },
		'completed',
	);
	return response;
};

export const getQueryTimestamp: ConvexEndpoints['queryTimestamp'] = async (
	ctx,
	input,
) => {
	const baseUrl = await resolveDeploymentUrl(ctx, input.subdomain);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['queryTimestamp']
	>('/query_timestamp', ctx.key, {
		method: 'GET',
		baseUrl,
		authScheme: 'convex',
	});

	await logEventFromContext(
		ctx,
		'convex.deployment.queryTimestamp',
		{ ...input },
		'completed',
	);
	return response;
};

export const listLogStreams: ConvexEndpoints['logStreamsList'] = async (
	ctx,
	input,
) => {
	const baseUrl = await resolveDeploymentUrl(ctx, input.subdomain);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['logStreamsList']
	>('/list_log_streams', ctx.key, {
		method: 'GET',
		baseUrl,
		authScheme: 'convex',
	});

	await logEventFromContext(
		ctx,
		'convex.deployment.logStreams',
		{ ...input },
		'completed',
	);
	return response;
};

export const DeploymentScopedEndpoints = {
	executeQueryBatch,
	getQueryTimestamp,
	listLogStreams,
} as const;
