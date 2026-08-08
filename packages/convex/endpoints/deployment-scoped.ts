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
 * deployment admin deploy key — the plugin credential (a Management API access
 * token) is never a valid deploy key. One may be supplied per call via
 * `deployKey` or stored on the connection as `deploy_key`.
 */
async function resolveDeployKey(
	ctx: ConvexContext,
	inputDeployKey: string | undefined,
): Promise<string> {
	const deployKey = inputDeployKey ?? (await ctx.keys.get_deploy_key()) ?? '';
	if (!deployKey) {
		throw new ConvexAPIError(
			'Deployment-scoped operations require a deployment admin deploy key; provide one via the deployKey input or store it as the connection deploy key',
		);
	}
	return deployKey;
}

export const executeQueryBatch: ConvexEndpoints['executeQueryBatch'] = async (
	ctx,
	input,
) => {
	const baseUrl = await resolveDeploymentUrl(ctx, input.subdomain);
	const deployKey = await resolveDeployKey(ctx, input.deployKey);

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
	const deployKey = await resolveDeployKey(ctx, input.deployKey);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['queryTimestamp']
	>('/query_timestamp', deployKey, {
		method: 'GET',
		baseUrl,
		authScheme: 'convex',
	});

	// Never spread the full input here: it contains the plaintext `deployKey`,
	// which must not be persisted into event records.
	await logEventFromContext(
		ctx,
		'convex.deployment.queryTimestamp',
		{ subdomain: input.subdomain },
		'completed',
	);
	return response;
};

export const listLogStreams: ConvexEndpoints['logStreamsList'] = async (
	ctx,
	input,
) => {
	const baseUrl = await resolveDeploymentUrl(ctx, input.subdomain);
	const deployKey = await resolveDeployKey(ctx, input.deployKey);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['logStreamsList']
	>('/list_log_streams', deployKey, {
		method: 'GET',
		baseUrl,
		authScheme: 'convex',
	});

	// Never spread the full input here: it contains the plaintext `deployKey`,
	// which must not be persisted into event records.
	await logEventFromContext(
		ctx,
		'convex.deployment.logStreams',
		{ subdomain: input.subdomain },
		'completed',
	);
	return response;
};

export const DeploymentScopedEndpoints = {
	executeQueryBatch,
	getQueryTimestamp,
	listLogStreams,
} as const;
