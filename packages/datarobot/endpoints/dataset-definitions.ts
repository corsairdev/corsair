import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Analyze a dataset definition by dataset definition ID */
/** Official: POST /api/v2/datasetDefinitions/{datasetDefinitionId}/analyze/ (`datasetDefinitionsAnalyze_create`) */
export const datasetDefinitionsAnalyzeCreate: DatarobotEndpoints['datasetDefinitionsAnalyzeCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/analyze/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetDefinitionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsAnalyzeCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsAnalyzeCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Analyze a chunk definition by dataset definition ID */
/** Official: POST /api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/{chunkDefinitionId}/analyze/ (`datasetDefinitionsChunkDefinitionsAnalyze_create`) */
export const datasetDefinitionsChunkDefinitionsAnalyzeCreate: DatarobotEndpoints['datasetDefinitionsChunkDefinitionsAnalyzeCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/{chunkDefinitionId}/analyze/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetDefinitionId', 'chunkDefinitionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsAnalyzeCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsChunkDefinitionsAnalyzeCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a chunk definition based by dataset definition ID */
/** Official: POST /api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/ (`datasetDefinitionsChunkDefinitions_create`) */
export const datasetDefinitionsChunkDefinitionsCreate: DatarobotEndpoints['datasetDefinitionsChunkDefinitionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetDefinitionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsChunkDefinitionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Soft delete a chunk definition based by dataset definition ID */
/** Official: DELETE /api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/{chunkDefinitionId}/ (`datasetDefinitionsChunkDefinitions_delete`) */
export const datasetDefinitionsChunkDefinitionsDelete: DatarobotEndpoints['datasetDefinitionsChunkDefinitionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/{chunkDefinitionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetDefinitionId', 'chunkDefinitionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsChunkDefinitionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a list chunk definitions by dataset definition ID */
/** Official: GET /api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/ (`datasetDefinitionsChunkDefinitions_list`) */
export const datasetDefinitionsChunkDefinitionsList: DatarobotEndpoints['datasetDefinitionsChunkDefinitionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetDefinitionId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsChunkDefinitionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a chunk definition based by dataset definition ID */
/** Official: PATCH /api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/{chunkDefinitionId}/ (`datasetDefinitionsChunkDefinitions_patch`) */
export const datasetDefinitionsChunkDefinitionsPatch: DatarobotEndpoints['datasetDefinitionsChunkDefinitionsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/{chunkDefinitionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetDefinitionId', 'chunkDefinitionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsChunkDefinitionsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a chunk definition based by dataset definition ID */
/** Official: GET /api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/{chunkDefinitionId}/ (`datasetDefinitionsChunkDefinitions_retrieve`) */
export const datasetDefinitionsChunkDefinitionsRetrieve: DatarobotEndpoints['datasetDefinitionsChunkDefinitionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/chunkDefinitions/{chunkDefinitionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetDefinitionId', 'chunkDefinitionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsChunkDefinitionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a dataset definition. */
/** Official: POST /api/v2/datasetDefinitions/ (`datasetDefinitions_create`) */
export const datasetDefinitionsCreate: DatarobotEndpoints['datasetDefinitionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasetDefinitions/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Soft delete a dataset definition based by dataset definition ID */
/** Official: DELETE /api/v2/datasetDefinitions/{datasetDefinitionId}/ (`datasetDefinitions_delete`) */
export const datasetDefinitionsDelete: DatarobotEndpoints['datasetDefinitionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetDefinitionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all dataset definitions */
/** Official: GET /api/v2/datasetDefinitions/ (`datasetDefinitions_list`) */
export const datasetDefinitionsList: DatarobotEndpoints['datasetDefinitionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasetDefinitions/', input);
		const { query } = splitDatarobotInput(input, [], ['offset', 'limit']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a dataset definition based by dataset definition ID */
/** Official: GET /api/v2/datasetDefinitions/{datasetDefinitionId}/ (`datasetDefinitions_retrieve`) */
export const datasetDefinitionsRetrieve: DatarobotEndpoints['datasetDefinitionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetDefinitionId'],
			['version'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all dataset definition versions by dataset definition ID */
/** Official: GET /api/v2/datasetDefinitions/{datasetDefinitionId}/versions/ (`datasetDefinitionsVersions_list`) */
export const datasetDefinitionsVersionsList: DatarobotEndpoints['datasetDefinitionsVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasetDefinitions/{datasetDefinitionId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetDefinitionId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetDefinitionsVersionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasetDefinitions.datasetDefinitionsVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
