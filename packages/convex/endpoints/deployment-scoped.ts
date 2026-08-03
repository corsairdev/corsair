import { logEventFromContext } from 'corsair/core';
import type { ConvexContext, ConvexEndpoints } from '..';
import { ConvexAPIError, makeConvexRequest } from '../client';
import type { ConvexEndpointOutputs } from './types';
import { CONVEX_SUBDOMAIN_PATTERN } from './types';

/**
 * Normalizes and validates a Convex deployment name (subdomain) before it is
 * interpolated into a deployment-scoped base URL. Only DNS-label characters
 * (lowercase letters, digits, hyphens) are accepted so crafted values such as
 * `attacker.example:443/` cannot redirect the authenticated request — which
 * carries `Authorization: Convex <deploy-key>` — to another host.
 */
function normalizeSubdomain(subdomain: string): string {
	const normalized = subdomain.toLowerCase();
	if (!CONVEX_SUBDOMAIN_PATTERN.test(normalized)) {
		throw new ConvexAPIError(
			`Invalid Convex deployment name "${subdomain}": only lowercase letters, digits, and hyphens are allowed`,
		);
	}
	return normalized;
}

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
		throw new ConvexAPIError(
			'Convex deployment name (subdomain) is required for deployment-scoped operations',
		);
	}
	return `https://${normalizeSubdomain(subdomain)}.convex.cloud/api`;
}

/**
 * Resolves the deploy key for a deployment-scoped operation. Deployment-scoped
 * endpoints authenticate as `Authorization: Convex <key>` and require a
 * deployment admin deploy key — an OAuth/access-token connection must supply
 * one explicitly via `deployKey`; otherwise the plugin-wide credential is used.
 */
function resolveDeployKey(
	ctx: ConvexContext,
	inputDeployKey: string | undefined,
): string {
	return inputDeployKey ?? ctx.key;
}

export const executeQueryBatch: ConvexEndpoints['executeQueryBatch'] = async (
	ctx,
	input,
) => {
	const baseUrl = await resolveDeploymentUrl(ctx, input.subdomain);
	const deployKey = resolveDeployKey(ctx, input.deployKey);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['executeQueryBatch']
	>('/query_batch', deployKey, {
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
	const deployKey = resolveDeployKey(ctx, input.deployKey);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['queryTimestamp']
	>('/query_timestamp', deployKey, {
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
	const deployKey = resolveDeployKey(ctx, input.deployKey);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['logStreamsList']
	>('/list_log_streams', deployKey, {
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
