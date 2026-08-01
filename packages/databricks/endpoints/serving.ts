import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const createProvisionedThroughputEndpoint: DatabricksEndpoints['createProvisionedThroughputEndpoint'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'serving-endpoints',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.serving.create_provisioned_throughput_endpoint',
			input,
			'completed',
		);
		return response;
	};

export const createVectorSearchEndpoint: DatabricksEndpoints['createVectorSearchEndpoint'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ name: string }>(
			'vector-search/endpoints',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.serving.create_vector_search_endpoint',
			input,
			'completed',
		);
		return response;
	};

export const deleteServingEndpoint: DatabricksEndpoints['deleteServingEndpoint'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`serving-endpoints/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.serving.delete_serving_endpoint',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteVectorSearchIndex: DatabricksEndpoints['deleteVectorSearchIndex'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`vector-search/indexes/${safeEncode(input.name)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.serving.delete_vector_search_index',
			input,
			'completed',
		);
		return { success: true };
	};
