import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const batchPredictionsCreate: DatarobotEndpoints['batchPredictionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/batchPredictions/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const batchPredictionsDelete: DatarobotEndpoints['batchPredictionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchPredictions/{predictionJobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['predictionJobId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const batchPredictionsFromExistingCreate: DatarobotEndpoints['batchPredictionsFromExistingCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchPredictions/fromExisting/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsFromExistingCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsFromExistingCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const batchPredictionsFromJobDefinitionCreate: DatarobotEndpoints['batchPredictionsFromJobDefinitionCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchPredictions/fromJobDefinition/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsFromJobDefinitionCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsFromJobDefinitionCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const batchPredictionsList: DatarobotEndpoints['batchPredictionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/batchPredictions/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'status',
				'source',
				'deploymentId',
				'modelId',
				'jobId',
				'orderBy',
				'allJobs',
				'cutoffHours',
				'startDateTime',
				'endDateTime',
				'batchPredictionJobDefinitionId',
				'hostname',
				'intakeType',
				'outputType',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

export const batchPredictionsRetrieve: DatarobotEndpoints['batchPredictionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchPredictions/{predictionJobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['predictionJobId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
