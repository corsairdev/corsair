import { logEventFromContext } from 'corsair/core';
import type { ConvexContext, ConvexEndpoints } from '..';
import { ConvexAPIError, makeConvexRequest } from '../client';
import type { ConvexEndpointOutputs } from './types';
import { CONVEX_SUBDOMAIN_PATTERN } from './types';

function normalizeSubdomain(subdomain: string): string {
	const normalized = subdomain.toLowerCase();
	if (!CONVEX_SUBDOMAIN_PATTERN.test(normalized)) {
		throw new ConvexAPIError(
			`Invalid Convex deployment name "${subdomain}": only lowercase letters, digits, hyphens, and dots are allowed`,
		);
	}
	return normalized;
}

function resolveConvexCloudUrl(raw: string): string {
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		throw new ConvexAPIError('Invalid Convex deployment URL');
	}
	if (parsed.protocol !== 'https:') {
		throw new ConvexAPIError('Invalid Convex deployment URL');
	}
	if (parsed.username || parsed.password || parsed.port) {
		throw new ConvexAPIError('Invalid Convex deployment URL');
	}
	if (parsed.search || parsed.hash) {
		throw new ConvexAPIError('Invalid Convex deployment URL');
	}
	const hostname = parsed.hostname.toLowerCase();
	if (!hostname.endsWith('.convex.cloud')) {
		throw new ConvexAPIError('Invalid Convex deployment URL');
	}
	const labels = hostname.slice(0, -'.convex.cloud'.length);
	if (!CONVEX_SUBDOMAIN_PATTERN.test(labels)) {
		throw new ConvexAPIError('Invalid Convex deployment URL');
	}
	const path = parsed.pathname.replace(/\/+$/, '');
	if (path !== '' && path !== '/api') {
		throw new ConvexAPIError('Invalid Convex deployment URL');
	}
	return `https://${hostname}/api`;
}

async function resolveDeploymentUrl(
	ctx: ConvexContext,
	inputSubdomain: string | undefined,
	inputDeploymentUrl?: string,
): Promise<string> {
	if (inputDeploymentUrl) {
		return resolveConvexCloudUrl(inputDeploymentUrl);
	}
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
	const baseUrl = await resolveDeploymentUrl(
		ctx,
		input.subdomain,
		input.deploymentUrl,
	);
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
	const baseUrl = await resolveDeploymentUrl(
		ctx,
		input.subdomain,
		input.deploymentUrl,
	);
	const deployKey = await resolveDeployKey(ctx, input.deployKey);

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['queryTimestamp']
	>('/query_ts', deployKey, {
		method: 'POST',
		baseUrl,
		authScheme: 'convex',
	});

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
	const baseUrl = await resolveDeploymentUrl(
		ctx,
		input.subdomain,
		input.deploymentUrl,
	);
	const deployKey = await resolveDeployKey(ctx, input.deployKey);

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
