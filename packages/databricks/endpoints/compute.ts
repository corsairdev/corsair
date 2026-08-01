import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';

export const addComputeInstanceProfile: DatabricksEndpoints['addComputeInstanceProfile'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('instance-profiles/add', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.compute.add_instance_profile',
			input,
			'completed',
		);
		return { success: true };
	};

export const createComputeClusterPolicy: DatabricksEndpoints['createComputeClusterPolicy'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ policy_id: string }>(
			'policies/clusters/create',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.compute.create_cluster_policy',
			input,
			'completed',
		);
		return response;
	};

export const createComputeInstancePool: DatabricksEndpoints['createComputeInstancePool'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ instance_pool_id: string }>(
			'instance-pools/create',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.compute.create_instance_pool',
			input,
			'completed',
		);
		return response;
	};

export const createDatabricksCluster: DatabricksEndpoints['createDatabricksCluster'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ cluster_id: string }>(
			'clusters/create',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.compute.create_cluster',
			input,
			'completed',
		);
		return response;
	};

export const createGlobalInitScript: DatabricksEndpoints['createGlobalInitScript'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ script_id: string }>(
			'global-init-scripts',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.compute.create_global_init_script',
			input,
			'completed',
		);
		return response;
	};

export const deleteComputeClusterPolicy: DatabricksEndpoints['deleteComputeClusterPolicy'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('policies/clusters/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.compute.delete_cluster_policy',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteComputeInstancePool: DatabricksEndpoints['deleteComputeInstancePool'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('instance-pools/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.compute.delete_instance_pool',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteDatabricksCluster: DatabricksEndpoints['deleteDatabricksCluster'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>('clusters/delete', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.compute.delete_cluster',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteGlobalInitScript: DatabricksEndpoints['deleteGlobalInitScript'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`global-init-scripts/${input.script_id}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.compute.delete_global_init_script',
			input,
			'completed',
		);
		return { success: true };
	};
