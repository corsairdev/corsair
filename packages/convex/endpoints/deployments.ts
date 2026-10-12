import { logEventFromContext } from 'corsair/core';
import type { ConvexEndpoints } from '..';
import { makeConvexRequest, managementPath, tryCacheWrite } from '../client';
import type { ConvexEndpointOutputs } from './types';

export const list: ConvexEndpoints['deploymentsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.includeLocal !== undefined) query.includeLocal = input.includeLocal;
	if (input.isDefault !== undefined && input.isDefault !== null) {
		query.isDefault = input.isDefault;
	}
	if (input.deploymentType !== undefined) {
		query.deploymentType = input.deploymentType;
	}

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['deploymentsList']
	>(`/projects/${managementPath(input.project_id)}/list_deployments`, ctx.key, {
		method: 'GET',
		query,
	});

	const deployments = ctx.db.deployments;
	if (response && deployments) {
		await tryCacheWrite(async () => {
			for (const deployment of response) {
				await deployments.upsertByEntityId(deployment.name, {
					...deployment,
				});
			}
		});
	}

	await logEventFromContext(
		ctx,
		'convex.deployments.list',
		{ project_id: input.project_id },
		'completed',
	);
	return response;
};

export const get: ConvexEndpoints['deploymentGet'] = async (ctx, input) => {
	const response = await makeConvexRequest<
		ConvexEndpointOutputs['deploymentGet']
	>(`/deployments/${managementPath(input.deployment_name)}`, ctx.key, {
		method: 'GET',
	});

	const deployments = ctx.db.deployments;
	if (response && deployments) {
		await tryCacheWrite(() =>
			deployments.upsertByEntityId(response.name, { ...response }),
		);
	}

	await logEventFromContext(
		ctx,
		'convex.deployments.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: ConvexEndpoints['deploymentCreate'] = async (
	ctx,
	input,
) => {
	const { project_id, ...body } = input;

	const response = await makeConvexRequest<
		ConvexEndpointOutputs['deploymentCreate']
	>(`/projects/${managementPath(project_id)}/create_deployment`, ctx.key, {
		method: 'POST',
		body,
	});

	// The deployment was created upstream — a cache failure must not turn this
	// successful non-idempotent call into an endpoint error.
	const deployments = ctx.db.deployments;
	if (response && deployments) {
		await tryCacheWrite(() =>
			deployments.upsertByEntityId(response.name, { ...response }),
		);
	}

	await logEventFromContext(
		ctx,
		'convex.deployments.create',
		{ project_id: input.project_id, type: input.type },
		'completed',
	);
	return response;
};

export const update: ConvexEndpoints['deploymentUpdate'] = async (
	ctx,
	input,
) => {
	const { deployment_name, ...body } = input;

	await makeConvexRequest<void>(
		`/deployments/${managementPath(deployment_name)}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
		},
	);

	// The PATCH response does not include the updated deployment record, so
	// fetch it to keep the local cache fresh. A refresh failure is diagnosed but
	// never fails the already-succeeded update; only the cache write itself is
	// best-effort.
	const deployments = ctx.db.deployments;
	if (deployments) {
		try {
			const refreshed = await makeConvexRequest<
				ConvexEndpointOutputs['deploymentGet']
			>(`/deployments/${managementPath(input.deployment_name)}`, ctx.key, {
				method: 'GET',
			});
			if (refreshed.name) {
				await tryCacheWrite(() =>
					deployments.upsertByEntityId(refreshed.name, {
						...refreshed,
					}),
				);
			}
		} catch {
			// Intentionally swallowed — PATCH already succeeded; cache refresh is best-effort.
		}
	}

	await logEventFromContext(
		ctx,
		'convex.deployments.update',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const deleteDeployment: ConvexEndpoints['deploymentDelete'] = async (
	ctx,
	input,
) => {
	await makeConvexRequest<void>(
		`/deployments/${managementPath(input.deployment_name)}/delete`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	// The deployment was deleted upstream — best-effort cache cleanup only. Also
	// remove cached deploy keys for this deployment, since deleting a deployment
	// invalidates its deploy keys.
	const { deployments, deployKeys } = ctx.db;
	if (deployments) {
		await tryCacheWrite(() =>
			deployments.deleteByEntityId(input.deployment_name),
		);
	}
	if (deployKeys) {
		await tryCacheWrite(async () => {
			const cached = await deployKeys.list();
			for (const key of cached) {
				if (key.data.deploymentName === input.deployment_name) {
					await deployKeys.deleteByEntityId(key.entity_id);
				}
			}
		});
	}

	await logEventFromContext(
		ctx,
		'convex.deployments.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const DeploymentsEndpoints = {
	list,
	get,
	create,
	update,
	delete: deleteDeployment,
} as const;
