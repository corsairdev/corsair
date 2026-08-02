import { logEventFromContext } from 'corsair/core';
import type { ConvexEndpoints } from '..';
import { makeConvexRequest } from '../client';
import type { ConvexEndpointOutputs } from './types';

export const create: ConvexEndpoints['deployKeyCreate'] = async (
	ctx,
	input,
) => {
	const body: Record<string, unknown> = { name: input.name };
	if (input.allowedActions !== undefined) {
		body.allowedActions = input.allowedActions;
	}
	if (input.expiresAt !== undefined) body.expiresAt = input.expiresAt;

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['deployKeyCreate']
	>(`/deployments/${input.deployment_name}/create_deploy_key`, ctx.key, {
		method: 'POST',
		body,
	});

	// The deploy key secret is shown once at creation and never returned
	// again — do NOT cache the plaintext `deployKey` secret, only non-secret
	// metadata (name, expiry, allowed actions). The create response contains
	// only `{ deployKey }`, so we cache the request-provided metadata keyed by
	// deployment name (matching what the list operation upserts by `id`).
	if (ctx.db.deployKeys) {
		await ctx.db.deployKeys.upsertByEntityId(input.deployment_name, {
			id: input.deployment_name,
			deploymentName: input.deployment_name,
			name: input.name,
			expiresAt: input.expiresAt ?? null,
			allowedActions: input.allowedActions ?? [],
		});
	}

	await logEventFromContext(
		ctx,
		'convex.deployKeys.create',
		{ deployment_name: input.deployment_name, name: input.name },
		'completed',
	);
	return response;
};

export const list: ConvexEndpoints['deployKeysList'] = async (ctx, input) => {
	const response = await makeConvexRequest<
		ConvexEndpointOutputs['deployKeysList']
	>(`/deployments/${input.deployment_name}/list_deploy_keys`, ctx.key, {
		method: 'GET',
	});

	if (response && ctx.db.deployKeys) {
		for (const deployKey of response) {
			await ctx.db.deployKeys.upsertByEntityId(deployKey.id, {
				deploymentName: input.deployment_name,
				...deployKey,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'convex.deployKeys.list',
		{ deployment_name: input.deployment_name },
		'completed',
	);
	return response;
};

export const DeployKeysEndpoints = {
	create,
	list,
} as const;
