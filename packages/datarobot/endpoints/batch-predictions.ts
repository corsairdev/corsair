import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Creates a new Batch Prediction job */
/** Official: POST /api/v2/batchPredictions/ (`batchPredictions_create`) */
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

/** Finalize a multipart upload by prediction job ID */
/** Official: POST /api/v2/batchPredictions/{predictionJobId}/csvUpload/finalizeMultipart/ (`batchPredictionsCsvUploadFinalizeMultipart_create`) */
export const batchPredictionsCsvUploadFinalizeMultipartCreate: DatarobotEndpoints['batchPredictionsCsvUploadFinalizeMultipartCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchPredictions/{predictionJobId}/csvUpload/finalizeMultipart/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['predictionJobId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsCsvUploadFinalizeMultipartCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsCsvUploadFinalizeMultipartCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Upload CSV data by prediction job ID */
/** Official: PUT /api/v2/batchPredictions/{predictionJobId}/csvUpload/part/{partNumber}/ (`batchPredictionsCsvUploadPart_put`) */
export const batchPredictionsCsvUploadPartPut: DatarobotEndpoints['batchPredictionsCsvUploadPartPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchPredictions/{predictionJobId}/csvUpload/part/{partNumber}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['predictionJobId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsCsvUploadPartPut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsCsvUploadPartPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Creates a new_model_id Batch Prediction job by prediction job ID */
/** Official: PUT /api/v2/batchPredictions/{predictionJobId}/csvUpload/ (`batchPredictionsCsvUpload_putMany`) */
export const batchPredictionsCsvUploadPutMany: DatarobotEndpoints['batchPredictionsCsvUploadPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchPredictions/{predictionJobId}/csvUpload/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['predictionJobId', 'partNumber'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsCsvUploadPutMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsCsvUploadPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Cancel a Batch Prediction job by prediction job ID */
/** Official: DELETE /api/v2/batchPredictions/{predictionJobId}/ (`batchPredictions_delete`) */
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

/** Download the scored data set of a batch prediction job by prediction job ID */
/** Official: GET /api/v2/batchPredictions/{predictionJobId}/download/ (`batchPredictionsDownload_list`) */
export const batchPredictionsDownloadList: DatarobotEndpoints['batchPredictionsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/batchPredictions/{predictionJobId}/download/',
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
			DatarobotEndpointOutputSchemas.batchPredictionsDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new a Batch Prediction job based */
/** Official: POST /api/v2/batchPredictions/fromExisting/ (`batchPredictionsFromExisting_create`) */
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

/** Launch a Batch Prediction job */
/** Official: POST /api/v2/batchPredictions/fromJobDefinition/ (`batchPredictionsFromJobDefinition_create`) */
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

/** List batch prediction jobs */
/** Official: GET /api/v2/batchPredictions/ (`batchPredictions_list`) */
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

/** Update a Batch Prediction job by prediction job ID */
/** Official: PATCH /api/v2/batchPredictions/{predictionJobId}/ (`batchPredictions_patch`) */
export const batchPredictionsPatch: DatarobotEndpoints['batchPredictionsPatch'] =
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
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchPredictionsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchPredictions.batchPredictionsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Batch Prediction job by prediction job ID */
/** Official: GET /api/v2/batchPredictions/{predictionJobId}/ (`batchPredictions_retrieve`) */
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
