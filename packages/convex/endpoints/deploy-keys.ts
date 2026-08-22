import { logEventFromContext } from 'corsair/core';
import type { ConvexEndpoints } from '..';
import { makeConvexRequest, managementPath, tryCacheWrite } from '../client';
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
	>(
		`/deployments/${managementPath(input.deployment_name)}/create_deploy_key`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	// The deploy key secret is shown once at creation and never returned again
	// — do NOT cache the plaintext `deployKey` secret. The create response only
	// contains `{ deployKey }` with no durable ID, so we intentionally do not
	// write a cache row here: `list` populates the cache under each key's real
	// `id`, and caching under the deployment name (or a fabricated composite ID)
	// would collide across keys and never reconcile with `list`.

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
	>(
		`/deployments/${managementPath(input.deployment_name)}/list_deploy_keys`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const deployKeys = ctx.db.deployKeys;
	if (response && deployKeys) {
		await tryCacheWrite(async () => {
			for (const deployKey of response) {
				await deployKeys.upsertByEntityId(deployKey.id, {
					deploymentName: input.deployment_name,
					...deployKey,
				});
			}
		});
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
