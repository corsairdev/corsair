import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Request */
/** Official: POST /api/v2/dataSlices/ (`dataSlices_create`) */
export const dataSlicesCreate: DatarobotEndpoints['dataSlicesCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/dataSlices/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.dataSlicesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.dataSlices.dataSlicesCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete a data slice by data slice ID */
/** Official: DELETE /api/v2/dataSlices/{dataSliceId}/ (`dataSlices_delete`) */
export const dataSlicesDelete: DatarobotEndpoints['dataSlicesDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/dataSlices/{dataSliceId}/', input);
	const { query, body } = splitDatarobotInput(input, ['dataSliceId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.dataSlicesDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.dataSlices.dataSlicesDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Data slices bulk deletion. */
/** Official: DELETE /api/v2/dataSlices/ (`dataSlices_deleteMany`) */
export const dataSlicesDeleteMany: DatarobotEndpoints['dataSlicesDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/dataSlices/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataSlicesDeleteMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.dataSlices.dataSlicesDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a Data Slice by data slice ID */
/** Official: GET /api/v2/dataSlices/{dataSliceId}/ (`dataSlices_retrieve`) */
export const dataSlicesRetrieve: DatarobotEndpoints['dataSlicesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/dataSlices/{dataSliceId}/', input);
		const { query, body } = splitDatarobotInput(input, ['dataSliceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataSlicesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.dataSlices.dataSlicesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Compute the number of rows available after applying a data slice by data slice ID */
/** Official: POST /api/v2/dataSlices/{dataSliceId}/sliceSizes/ (`dataSlicesSliceSizes_create`) */
export const dataSlicesSliceSizesCreate: DatarobotEndpoints['dataSlicesSliceSizesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/dataSlices/{dataSliceId}/sliceSizes/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataSliceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataSlicesSliceSizesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.dataSlices.dataSlicesSliceSizesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Returns the number of rows available after applying a data slice by data slice ID */
/** Official: GET /api/v2/dataSlices/{dataSliceId}/sliceSizes/ (`dataSlicesSliceSizes_list`) */
export const dataSlicesSliceSizesList: DatarobotEndpoints['dataSlicesSliceSizesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/dataSlices/{dataSliceId}/sliceSizes/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['dataSliceId'],
			['projectId', 'source', 'externalDatasetId', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.dataSlicesSliceSizesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.dataSlices.dataSlicesSliceSizesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
