import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve accuracy metric by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/accuracy/ (`deploymentsAccuracy_list`) */
export const deploymentsAccuracyList: DatarobotEndpoints['deploymentsAccuracyList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/accuracy/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'modelId',
				'batchId',
				'segmentAttribute',
				'segmentValue',
				'targetClass',
				'metric',
				'baselineModelId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAccuracyList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAccuracyList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Endpoint by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/accuracyMetrics/ (`deploymentsAccuracyMetrics_list`) */
export const deploymentsAccuracyMetricsList: DatarobotEndpoints['deploymentsAccuracyMetricsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/accuracyMetrics/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAccuracyMetricsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAccuracyMetricsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update deployment accuracy metrics settings by deployment ID */
/** Official: PUT /api/v2/deployments/{deploymentId}/accuracyMetrics/ (`deploymentsAccuracyMetrics_putMany`) */
export const deploymentsAccuracyMetricsPutMany: DatarobotEndpoints['deploymentsAccuracyMetricsPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/accuracyMetrics/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAccuracyMetricsPutMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAccuracyMetricsPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Accuracy over batch by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/accuracyOverBatch/ (`deploymentsAccuracyOverBatch_list`) */
export const deploymentsAccuracyOverBatchList: DatarobotEndpoints['deploymentsAccuracyOverBatchList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/accuracyOverBatch/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['segmentAttribute', 'segmentValue', 'modelId', 'batchId', 'metric'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAccuracyOverBatchList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAccuracyOverBatchList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve accuracy over space by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/accuracyOverSpace/ (`deploymentsAccuracyOverSpace_list`) */
export const deploymentsAccuracyOverSpaceList: DatarobotEndpoints['deploymentsAccuracyOverSpaceList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/accuracyOverSpace/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['start', 'end', 'modelId', 'metric', 'geoFeatureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAccuracyOverSpaceList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAccuracyOverSpaceList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve accuracy over time by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/accuracyOverTime/ (`deploymentsAccuracyOverTime_list`) */
export const deploymentsAccuracyOverTimeList: DatarobotEndpoints['deploymentsAccuracyOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/accuracyOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'modelId',
				'metric',
				'segmentAttribute',
				'segmentValue',
				'targetClass',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAccuracyOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAccuracyOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a deployment actuals data export by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/actualsDataExports/ (`deploymentsActualsDataExports_create`) */
export const deploymentsActualsDataExportsCreate: DatarobotEndpoints['deploymentsActualsDataExportsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/actualsDataExports/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsActualsDataExportsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an actual export by deployment ID */
/** Official: DELETE /api/v2/deployments/{deploymentId}/actualsDataExports/{exportId}/ (`deploymentsActualsDataExports_delete`) */
export const deploymentsActualsDataExportsDelete: DatarobotEndpoints['deploymentsActualsDataExportsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/actualsDataExports/{exportId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'exportId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsActualsDataExportsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a list of asynchronous actuals data exports by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/actualsDataExports/ (`deploymentsActualsDataExports_list`) */
export const deploymentsActualsDataExportsList: DatarobotEndpoints['deploymentsActualsDataExportsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/actualsDataExports/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit', 'status'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsActualsDataExportsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update actuals data export by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/actualsDataExports/{exportId}/ (`deploymentsActualsDataExports_patch`) */
export const deploymentsActualsDataExportsPatch: DatarobotEndpoints['deploymentsActualsDataExportsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/actualsDataExports/{exportId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'exportId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsActualsDataExportsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a single actuals data export by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/actualsDataExports/{exportId}/ (`deploymentsActualsDataExports_retrieve`) */
export const deploymentsActualsDataExportsRetrieve: DatarobotEndpoints['deploymentsActualsDataExportsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/actualsDataExports/{exportId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'exportId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsActualsDataExportsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Submit actuals values by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/actuals/fromDataset/ (`deploymentsActualsFromDataset_create`) */
export const deploymentsActualsFromDatasetCreate: DatarobotEndpoints['deploymentsActualsFromDatasetCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/actuals/fromDataset/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsActualsFromDatasetCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsActualsFromDatasetCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a actuals from a JSON */
/** Official: POST /api/v2/deployments/{deploymentId}/actuals/fromJSON/ (`deploymentsActualsFromJSON_create`) */
export const deploymentsActualsFromJSONCreate: DatarobotEndpoints['deploymentsActualsFromJSONCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/actuals/fromJSON/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsActualsFromJSONCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsActualsFromJSONCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete the agent card by deployment ID */
/** Official: DELETE /api/v2/deployments/{deploymentId}/agentCard/ (`deploymentsAgentCard_deleteMany`) */
export const deploymentsAgentCardDeleteMany: DatarobotEndpoints['deploymentsAgentCardDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/agentCard/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAgentCardDeleteMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAgentCardDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the agent card by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/agentCard/ (`deploymentsAgentCard_list`) */
export const deploymentsAgentCardList: DatarobotEndpoints['deploymentsAgentCardList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/agentCard/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAgentCardList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAgentCardList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create by deployment ID */
/** Official: PUT /api/v2/deployments/{deploymentId}/agentCard/ (`deploymentsAgentCard_putMany`) */
export const deploymentsAgentCardPutMany: DatarobotEndpoints['deploymentsAgentCardPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/agentCard/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsAgentCardPutMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsAgentCardPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve service health metrics by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/batchServiceStats/ (`deploymentsBatchServiceStats_list`) */
export const deploymentsBatchServiceStatsList: DatarobotEndpoints['deploymentsBatchServiceStatsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/batchServiceStats/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'executionTimeQuantile',
				'responseTimeQuantile',
				'slowRequestsThreshold',
				'segmentAttribute',
				'segmentValue',
				'batchId',
				'modelId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsBatchServiceStatsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsBatchServiceStatsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve capabilities by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/capabilities/ (`deploymentsCapabilities_list`) */
export const deploymentsCapabilitiesList: DatarobotEndpoints['deploymentsCapabilitiesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/capabilities/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCapabilitiesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCapabilitiesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Score challenger models by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/challengerPredictions/ (`deploymentsChallengerPredictions_create`) */
export const deploymentsChallengerPredictionsCreate: DatarobotEndpoints['deploymentsChallengerPredictionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/challengerPredictions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChallengerPredictionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChallengerPredictionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve challenger replay settings by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/challengerReplaySettings/ (`deploymentsChallengerReplaySettings_list`) */
export const deploymentsChallengerReplaySettingsList: DatarobotEndpoints['deploymentsChallengerReplaySettingsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/challengerReplaySettings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChallengerReplaySettingsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChallengerReplaySettingsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update challenger replay settings by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/challengerReplaySettings/ (`deploymentsChallengerReplaySettings_patchMany`) */
export const deploymentsChallengerReplaySettingsPatchMany: DatarobotEndpoints['deploymentsChallengerReplaySettingsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/challengerReplaySettings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChallengerReplaySettingsPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChallengerReplaySettingsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create challenger model by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/challengers/ (`deploymentsChallengers_create`) */
export const deploymentsChallengersCreate: DatarobotEndpoints['deploymentsChallengersCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/challengers/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChallengersCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChallengersCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete challenger model by deployment ID */
/** Official: DELETE /api/v2/deployments/{deploymentId}/challengers/{challengerId}/ (`deploymentsChallengers_delete`) */
export const deploymentsChallengersDelete: DatarobotEndpoints['deploymentsChallengersDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/challengers/{challengerId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'challengerId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChallengersDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChallengersDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List challenger models by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/challengers/ (`deploymentsChallengers_list`) */
export const deploymentsChallengersList: DatarobotEndpoints['deploymentsChallengersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/challengers/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChallengersList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChallengersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update challenger model by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/challengers/{challengerId}/ (`deploymentsChallengers_patch`) */
export const deploymentsChallengersPatch: DatarobotEndpoints['deploymentsChallengersPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/challengers/{challengerId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'challengerId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChallengersPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChallengersPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get challenger model by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/challengers/{challengerId}/ (`deploymentsChallengers_retrieve`) */
export const deploymentsChallengersRetrieve: DatarobotEndpoints['deploymentsChallengersRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/challengers/{challengerId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'challengerId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChallengersRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChallengersRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve information about the champion model package by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/championModelPackage/ (`deploymentsChampionModelPackage_list`) */
export const deploymentsChampionModelPackageList: DatarobotEndpoints['deploymentsChampionModelPackageList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/championModelPackage/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsChampionModelPackageList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsChampionModelPackageList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the summary of deployment batch custom metric by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/batchSummary/ (`deploymentsCustomMetricsBatchSummary_retrieve`) */
export const deploymentsCustomMetricsBatchSummaryRetrieve: DatarobotEndpoints['deploymentsCustomMetricsBatchSummaryRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/batchSummary/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[
				'start',
				'end',
				'modelPackageId',
				'modelId',
				'segmentAttribute',
				'segmentValue',
				'batchId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsBatchSummaryRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsBatchSummaryRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the bulk summary of deployment batch custom metrics by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetricsBatchSummary/ (`deploymentsCustomMetricsBulkBatchSummary_retrieve`) */
export const deploymentsCustomMetricsBulkBatchSummaryRetrieve: DatarobotEndpoints['deploymentsCustomMetricsBulkBatchSummaryRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetricsBatchSummary/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'modelPackageId',
				'modelId',
				'segmentAttribute',
				'segmentValue',
				'batchId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsBulkBatchSummaryRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsBulkBatchSummaryRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the bulk summary of deployment custom metrics by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetricsSummary/ (`deploymentsCustomMetricsBulkSummary_retrieve`) */
export const deploymentsCustomMetricsBulkSummaryRetrieve: DatarobotEndpoints['deploymentsCustomMetricsBulkSummaryRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetricsSummary/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'modelPackageId',
				'modelId',
				'segmentAttribute',
				'segmentValue',
				'batchId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsBulkSummaryRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsBulkSummaryRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Bulk upload custom metric values by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/customMetrics/bulkUpload/ (`deploymentsCustomMetricsBulkUpload_create`) */
export const deploymentsCustomMetricsBulkUploadCreate: DatarobotEndpoints['deploymentsCustomMetricsBulkUploadCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/bulkUpload/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsBulkUploadCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsBulkUploadCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a deployment custom metric by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/customMetrics/ (`deploymentsCustomMetrics_create`) */
export const deploymentsCustomMetricsCreate: DatarobotEndpoints['deploymentsCustomMetricsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a custom metric by deployment ID */
/** Official: DELETE /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/ (`deploymentsCustomMetrics_delete`) */
export const deploymentsCustomMetricsDelete: DatarobotEndpoints['deploymentsCustomMetricsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a custom metrics from a custom job */
/** Official: POST /api/v2/deployments/{deploymentId}/customMetrics/fromCustomJob/ (`deploymentsCustomMetricsFromCustomJob_create`) */
export const deploymentsCustomMetricsFromCustomJobCreate: DatarobotEndpoints['deploymentsCustomMetricsFromCustomJobCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/fromCustomJob/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsFromCustomJobCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsFromCustomJobCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Upload custom metric values by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/fromDataset/ (`deploymentsCustomMetricsFromDataset_create`) */
export const deploymentsCustomMetricsFromDatasetCreate: DatarobotEndpoints['deploymentsCustomMetricsFromDatasetCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/fromDataset/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsFromDatasetCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsFromDatasetCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a custom metrics from a JSON */
/** Official: POST /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/fromJSON/ (`deploymentsCustomMetricsFromJSON_create`) */
export const deploymentsCustomMetricsFromJSONCreate: DatarobotEndpoints['deploymentsCustomMetricsFromJSONCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/fromJSON/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsFromJSONCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsFromJSONCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a list of custom metrics by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetrics/ (`deploymentsCustomMetrics_list`) */
export const deploymentsCustomMetricsList: DatarobotEndpoints['deploymentsCustomMetricsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update given custom metric settings by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/ (`deploymentsCustomMetrics_patch`) */
export const deploymentsCustomMetricsPatch: DatarobotEndpoints['deploymentsCustomMetricsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a single custom metric metadata by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/ (`deploymentsCustomMetrics_retrieve`) */
export const deploymentsCustomMetricsRetrieve: DatarobotEndpoints['deploymentsCustomMetricsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the summary of deployment custom metric by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/summary/ (`deploymentsCustomMetricsSummary_retrieve`) */
export const deploymentsCustomMetricsSummaryRetrieve: DatarobotEndpoints['deploymentsCustomMetricsSummaryRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/summary/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[
				'start',
				'end',
				'modelPackageId',
				'modelId',
				'segmentAttribute',
				'segmentValue',
				'batchId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsSummaryRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsSummaryRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom metric values over batch by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/valuesOverBatch/ (`deploymentsCustomMetricsValuesOverBatch_list`) */
export const deploymentsCustomMetricsValuesOverBatchList: DatarobotEndpoints['deploymentsCustomMetricsValuesOverBatchList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/valuesOverBatch/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[
				'modelPackageId',
				'modelId',
				'batchId',
				'segmentAttribute',
				'segmentValue',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsValuesOverBatchList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsValuesOverBatchList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom metric values over space by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/valuesOverSpace/ (`deploymentsCustomMetricsValuesOverSpace_list`) */
export const deploymentsCustomMetricsValuesOverSpaceList: DatarobotEndpoints['deploymentsCustomMetricsValuesOverSpaceList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/valuesOverSpace/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			['start', 'end', 'modelPackageId', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsValuesOverSpaceList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsValuesOverSpaceList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve custom metric values over time by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/valuesOverTime/ (`deploymentsCustomMetricsValuesOverTime_list`) */
export const deploymentsCustomMetricsValuesOverTimeList: DatarobotEndpoints['deploymentsCustomMetricsValuesOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/customMetrics/{customMetricId}/valuesOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId', 'customMetricId'],
			[
				'start',
				'end',
				'modelPackageId',
				'modelId',
				'bucketSize',
				'segmentAttribute',
				'segmentValue',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsValuesOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsCustomMetricsValuesOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metadata of the data by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/dataQualityView/ (`deploymentsDataQualityView_list`) */
export const deploymentsDataQualityViewList: DatarobotEndpoints['deploymentsDataQualityViewList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/dataQualityView/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'offset',
				'limit',
				'start',
				'end',
				'modelId',
				'predictionPattern',
				'promptPattern',
				'actualPattern',
				'orderBy',
				'orderMetric',
				'filterMetric',
				'filterValue',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsDataQualityViewList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsDataQualityViewList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete deployment by deployment ID */
/** Official: DELETE /api/v2/deployments/{deploymentId}/ (`deployments_delete`) */
export const deploymentsDelete: DatarobotEndpoints['deploymentsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['ignoreManagementAgent'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve fairness over time info of the deployment by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/fairnessScoresOverTime/ (`deploymentsFairnessScoresOverTime_list`) */
export const deploymentsFairnessScoresOverTimeList: DatarobotEndpoints['deploymentsFairnessScoresOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/fairnessScoresOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'modelId',
				'fairnessMetric',
				'protectedFeature',
				'orderBy',
				'includePrivilegedClass',
				'onlyStatisticallySignificant',
				'limit',
				'offset',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFairnessScoresOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFairnessScoresOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve feature drift scores by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/featureDrift/ (`deploymentsFeatureDrift_list`) */
export const deploymentsFeatureDriftList: DatarobotEndpoints['deploymentsFeatureDriftList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/featureDrift/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'modelId',
				'metric',
				'offset',
				'limit',
				'segmentAttribute',
				'segmentValue',
				'batchId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFeatureDriftList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFeatureDriftList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve drift over batch info by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/featureDriftOverBatch/ (`deploymentsFeatureDriftOverBatch_list`) */
export const deploymentsFeatureDriftOverBatchList: DatarobotEndpoints['deploymentsFeatureDriftOverBatchList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/featureDriftOverBatch/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'segmentAttribute',
				'segmentValue',
				'batchId',
				'featureNames',
				'driftMetric',
				'modelId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFeatureDriftOverBatchList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFeatureDriftOverBatchList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve feature drift scores over space through geospatial monitoring by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/featureDriftOverSpace/ (`deploymentsFeatureDriftOverSpace_list`) */
export const deploymentsFeatureDriftOverSpaceList: DatarobotEndpoints['deploymentsFeatureDriftOverSpaceList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/featureDriftOverSpace/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['start', 'end', 'geoFeatureName', 'featureName', 'modelId', 'metric'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFeatureDriftOverSpaceList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFeatureDriftOverSpaceList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve drift over time info by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/featureDriftOverTime/ (`deploymentsFeatureDriftOverTime_list`) */
export const deploymentsFeatureDriftOverTimeList: DatarobotEndpoints['deploymentsFeatureDriftOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/featureDriftOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'modelId',
				'featureNames',
				'metric',
				'segmentAttribute',
				'segmentValue',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFeatureDriftOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFeatureDriftOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get deployment features by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/features/ (`deploymentsFeatures_list`) */
export const deploymentsFeaturesList: DatarobotEndpoints['deploymentsFeaturesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/features/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'offset',
				'limit',
				'includeNonPredictionFeatures',
				'forSegmentedAnalysis',
				'search',
				'orderBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFeaturesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFeaturesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create deployment */
/** Official: POST /api/v2/deployments/fromLearningModel/ (`deploymentsFromLearningModel_create`) */
export const deploymentsFromLearningModelCreate: DatarobotEndpoints['deploymentsFromLearningModelCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/fromLearningModel/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFromLearningModelCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFromLearningModelCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a deployment from a model package */
/** Official: POST /api/v2/deployments/fromModelPackage/ (`deploymentsFromModelPackage_create`) */
export const deploymentsFromModelPackageCreate: DatarobotEndpoints['deploymentsFromModelPackageCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/fromModelPackage/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsFromModelPackageCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsFromModelPackageCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve default deployment health settings by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/healthSettings/defaults/ (`deploymentsHealthSettingsDefaults_list`) */
export const deploymentsHealthSettingsDefaultsList: DatarobotEndpoints['deploymentsHealthSettingsDefaultsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/healthSettings/defaults/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsHealthSettingsDefaultsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsHealthSettingsDefaultsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve deployment health settings by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/healthSettings/ (`deploymentsHealthSettings_list`) */
export const deploymentsHealthSettingsList: DatarobotEndpoints['deploymentsHealthSettingsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/healthSettings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsHealthSettingsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsHealthSettingsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update deployment health settings by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/healthSettings/ (`deploymentsHealthSettings_patchMany`) */
export const deploymentsHealthSettingsPatchMany: DatarobotEndpoints['deploymentsHealthSettingsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/healthSettings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsHealthSettingsPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsHealthSettingsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve humility stats by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/humilityStats/ (`deploymentsHumilityStats_list`) */
export const deploymentsHumilityStatsList: DatarobotEndpoints['deploymentsHumilityStatsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/humilityStats/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'modelId',
				'segmentAttribute',
				'segmentValue',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsHumilityStatsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsHumilityStatsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve humility stats over time by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/humilityStatsOverTime/ (`deploymentsHumilityStatsOverTime_list`) */
export const deploymentsHumilityStatsOverTimeList: DatarobotEndpoints['deploymentsHumilityStatsOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/humilityStatsOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'modelId',
				'segmentAttribute',
				'segmentValue',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsHumilityStatsOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsHumilityStatsOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get deployment limits. */
/** Official: GET /api/v2/deployments/limits/ (`deploymentsLimits_list`) */
export const deploymentsLimitsList: DatarobotEndpoints['deploymentsLimitsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/deployments/limits/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsLimitsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsLimitsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List deployments */
/** Official: GET /api/v2/deployments/ (`deployments_list`) */
export const deploymentsList: DatarobotEndpoints['deploymentsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/deployments/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'orderBy',
			'search',
			'serviceHealth',
			'modelHealth',
			'accuracyHealth',
			'role',
			'status',
			'importance',
			'lastPredictionTimestampStart',
			'lastPredictionTimestampEnd',
			'predictionUsageDailyAvgGreaterThan',
			'predictionUsageDailyAvgLessThan',
			'defaultPredictionServerId',
			'buildEnvironmentType',
			'executionEnvironmentType',
			'predictionEnvironmentPlatform',
			'createdByMe',
			'createdBy',
			'championModelExecutionType',
			'championModelTargetType',
			'tagKeys',
			'tagValues',
			'isA2AAgent',
			'predictionEnvironmentTagKeys',
			'predictionEnvironmentTagValues',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.deploymentsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.deployments.deploymentsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update a deployment's prediction environment from dedicated */
/** Official: POST /api/v2/deployments/migrateDPStoServerless/ (`deploymentsMigrateDPStoServerless_create`) */
export const deploymentsMigrateDPStoServerlessCreate: DatarobotEndpoints['deploymentsMigrateDPStoServerlessCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/migrateDPStoServerless/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMigrateDPStoServerlessCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMigrateDPStoServerlessCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve champion model history of deployment by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/modelHistory/ (`deploymentsModelHistory_list`) */
export const deploymentsModelHistoryList: DatarobotEndpoints['deploymentsModelHistoryList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/modelHistory/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsModelHistoryList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsModelHistoryList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Model Replacement by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/model/ (`deploymentsModel_patchMany`) */
export const deploymentsModelPatchMany: DatarobotEndpoints['deploymentsModelPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/model/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsModelPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsModelPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List the secondary datasets configuration history by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/model/secondaryDatasetConfigurationHistory/ (`deploymentsModelSecondaryDatasetConfigurationHistory_list`) */
export const deploymentsModelSecondaryDatasetConfigurationHistoryList: DatarobotEndpoints['deploymentsModelSecondaryDatasetConfigurationHistoryList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/model/secondaryDatasetConfigurationHistory/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsModelSecondaryDatasetConfigurationHistoryList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsModelSecondaryDatasetConfigurationHistoryList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve secondary datasets configuration by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/model/secondaryDatasetConfiguration/ (`deploymentsModelSecondaryDatasetConfiguration_list`) */
export const deploymentsModelSecondaryDatasetConfigurationList: DatarobotEndpoints['deploymentsModelSecondaryDatasetConfigurationList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/model/secondaryDatasetConfiguration/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsModelSecondaryDatasetConfigurationList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsModelSecondaryDatasetConfigurationList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the secondary datasets configuration by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/model/secondaryDatasetConfiguration/ (`deploymentsModelSecondaryDatasetConfiguration_patchMany`) */
export const deploymentsModelSecondaryDatasetConfigurationPatchMany: DatarobotEndpoints['deploymentsModelSecondaryDatasetConfigurationPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/model/secondaryDatasetConfiguration/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsModelSecondaryDatasetConfigurationPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsModelSecondaryDatasetConfigurationPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Model Replacement Validation by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/model/validation/ (`deploymentsModelValidation_create`) */
export const deploymentsModelValidationCreate: DatarobotEndpoints['deploymentsModelValidationCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/model/validation/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsModelValidationCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsModelValidationCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the limits related by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/monitoringBatchLimits/ (`deploymentsMonitoringBatchLimits_list`) */
export const deploymentsMonitoringBatchLimitsList: DatarobotEndpoints['deploymentsMonitoringBatchLimitsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatchLimits/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchLimitsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchLimitsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a monitoring batch by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/monitoringBatches/ (`deploymentsMonitoringBatches_create`) */
export const deploymentsMonitoringBatchesCreate: DatarobotEndpoints['deploymentsMonitoringBatchesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatches/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a monitoring batch by deployment ID */
/** Official: DELETE /api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/ (`deploymentsMonitoringBatches_delete`) */
export const deploymentsMonitoringBatchesDelete: DatarobotEndpoints['deploymentsMonitoringBatchesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'monitoringBatchId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List monitoring batches by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/monitoringBatches/ (`deploymentsMonitoringBatches_list`) */
export const deploymentsMonitoringBatchesList: DatarobotEndpoints['deploymentsMonitoringBatchesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatches/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'offset',
				'limit',
				'createdBy',
				'search',
				'orderBy',
				'createdAfter',
				'createdBefore',
				'startAfter',
				'endBefore',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List information about models that have data by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/models/ (`deploymentsMonitoringBatchesModels_list`) */
export const deploymentsMonitoringBatchesModelsList: DatarobotEndpoints['deploymentsMonitoringBatchesModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/models/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId', 'monitoringBatchId'],
			['offset', 'limit', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchesModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update information about model data by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/models/{modelId}/ (`deploymentsMonitoringBatchesModels_patch`) */
export const deploymentsMonitoringBatchesModelsPatch: DatarobotEndpoints['deploymentsMonitoringBatchesModelsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/models/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'monitoringBatchId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesModelsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchesModelsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get information about a model that has data by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/models/{modelId}/ (`deploymentsMonitoringBatchesModels_retrieve`) */
export const deploymentsMonitoringBatchesModelsRetrieve: DatarobotEndpoints['deploymentsMonitoringBatchesModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/models/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'monitoringBatchId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesModelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchesModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a monitoring batch by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/ (`deploymentsMonitoringBatches_patch`) */
export const deploymentsMonitoringBatchesPatch: DatarobotEndpoints['deploymentsMonitoringBatchesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'monitoringBatchId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a monitoring batch by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/ (`deploymentsMonitoringBatches_retrieve`) */
export const deploymentsMonitoringBatchesRetrieve: DatarobotEndpoints['deploymentsMonitoringBatchesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringBatches/{monitoringBatchId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'monitoringBatchId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringBatchesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Endpoint by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/monitoringDataDeletions/ (`deploymentsMonitoringDataDeletions_create`) */
export const deploymentsMonitoringDataDeletionsCreate: DatarobotEndpoints['deploymentsMonitoringDataDeletionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/monitoringDataDeletions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsMonitoringDataDeletionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsMonitoringDataDeletionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Add report by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/onDemandReports/ (`deploymentsOnDemandReports_create`) */
export const deploymentsOnDemandReportsCreate: DatarobotEndpoints['deploymentsOnDemandReportsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/onDemandReports/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsOnDemandReportsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsOnDemandReportsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update deployment by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/ (`deployments_patch`) */
export const deploymentsPatch: DatarobotEndpoints['deploymentsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/deployments/{deploymentId}/', input);
	const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.deploymentsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.deployments.deploymentsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create a deployment prediction data export by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/predictionDataExports/ (`deploymentsPredictionDataExports_create`) */
export const deploymentsPredictionDataExportsCreate: DatarobotEndpoints['deploymentsPredictionDataExportsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionDataExports/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionDataExportsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionDataExportsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** A list prediction data exports by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionDataExports/ (`deploymentsPredictionDataExports_list`) */
export const deploymentsPredictionDataExportsList: DatarobotEndpoints['deploymentsPredictionDataExportsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionDataExports/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit', 'status', 'modelId', 'batch'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionDataExportsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionDataExportsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update prediction data export by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/predictionDataExports/{exportId}/ (`deploymentsPredictionDataExports_patch`) */
export const deploymentsPredictionDataExportsPatch: DatarobotEndpoints['deploymentsPredictionDataExportsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionDataExports/{exportId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'exportId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionDataExportsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionDataExportsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a single prediction data export by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionDataExports/{exportId}/ (`deploymentsPredictionDataExports_retrieve`) */
export const deploymentsPredictionDataExportsRetrieve: DatarobotEndpoints['deploymentsPredictionDataExportsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionDataExports/{exportId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'exportId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionDataExportsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionDataExportsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Submit external deployment prediction data by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/predictionInputs/fromDataset/ (`deploymentsPredictionInputsFromDataset_create`) */
export const deploymentsPredictionInputsFromDatasetCreate: DatarobotEndpoints['deploymentsPredictionInputsFromDatasetCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionInputs/fromDataset/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionInputsFromDatasetCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionInputsFromDatasetCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve predictions results by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionResults/ (`deploymentsPredictionResults_list`) */
export const deploymentsPredictionResultsList: DatarobotEndpoints['deploymentsPredictionResultsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionResults/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'offset',
				'limit',
				'modelId',
				'start',
				'end',
				'batchId',
				'actualsPresent',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionResultsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionResultsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve prediction metadata over batches by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionsOverBatch/ (`deploymentsPredictionsOverBatch_list`) */
export const deploymentsPredictionsOverBatchList: DatarobotEndpoints['deploymentsPredictionsOverBatchList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionsOverBatch/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'segmentAttribute',
				'segmentValue',
				'batchId',
				'modelId',
				'includePercentiles',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionsOverBatchList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionsOverBatchList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve predictions stats over space through geospatial monitoring by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionsOverSpace/ (`deploymentsPredictionsOverSpace_list`) */
export const deploymentsPredictionsOverSpaceList: DatarobotEndpoints['deploymentsPredictionsOverSpaceList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionsOverSpace/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'geoFeatureName',
				'modelId',
				'targetClass',
				'includePercentiles',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionsOverSpaceList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionsOverSpaceList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metrics about predictions over time by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionsOverTime/ (`deploymentsPredictionsOverTime_list`) */
export const deploymentsPredictionsOverTimeList: DatarobotEndpoints['deploymentsPredictionsOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionsOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'segmentAttribute',
				'segmentValue',
				'modelId',
				'targetClass',
				'includePercentiles',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionsOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionsOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metrics about predictions and actuals, such as mean predicted & actual value, predicted & by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionsVsActualsOverBatch/ (`deploymentsPredictionsVsActualsOverBatch_list`) */
export const deploymentsPredictionsVsActualsOverBatchList: DatarobotEndpoints['deploymentsPredictionsVsActualsOverBatchList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionsVsActualsOverBatch/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['segmentAttribute', 'segmentValue', 'modelId', 'batchId', 'targetClass'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionsVsActualsOverBatchList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionsVsActualsOverBatchList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve predictions vs by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionsVsActualsOverSpace/ (`deploymentsPredictionsVsActualsOverSpace_list`) */
export const deploymentsPredictionsVsActualsOverSpaceList: DatarobotEndpoints['deploymentsPredictionsVsActualsOverSpaceList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionsVsActualsOverSpace/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['start', 'end', 'modelId', 'geoFeatureName', 'targetClass'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionsVsActualsOverSpaceList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionsVsActualsOverSpaceList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve predictions vs actuals over time info by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/predictionsVsActualsOverTime/ (`deploymentsPredictionsVsActualsOverTime_list`) */
export const deploymentsPredictionsVsActualsOverTimeList: DatarobotEndpoints['deploymentsPredictionsVsActualsOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/predictionsVsActualsOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'segmentAttribute',
				'segmentValue',
				'modelId',
				'targetClass',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsPredictionsVsActualsOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsPredictionsVsActualsOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve deployment consumers by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/quotaConsumers/ (`deploymentsQuotaConsumers_list`) */
export const deploymentsQuotaConsumersList: DatarobotEndpoints['deploymentsQuotaConsumersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/quotaConsumers/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsQuotaConsumersList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsQuotaConsumersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create retraining policies by ID */
/** Official: POST /api/v2/deployments/{deploymentId}/retrainingPolicies/ (`deploymentsRetrainingPolicies_create`) */
export const deploymentsRetrainingPoliciesCreate: DatarobotEndpoints['deploymentsRetrainingPoliciesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete retraining policies by ID */
/** Official: DELETE /api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/ (`deploymentsRetrainingPolicies_delete`) */
export const deploymentsRetrainingPoliciesDelete: DatarobotEndpoints['deploymentsRetrainingPoliciesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'retrainingPolicyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Endpoint by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/retrainingPolicies/ (`deploymentsRetrainingPolicies_list`) */
export const deploymentsRetrainingPoliciesList: DatarobotEndpoints['deploymentsRetrainingPoliciesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify retraining policies by ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/ (`deploymentsRetrainingPolicies_patch`) */
export const deploymentsRetrainingPoliciesPatch: DatarobotEndpoints['deploymentsRetrainingPoliciesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'retrainingPolicyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve retraining policies by ID */
/** Official: GET /api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/ (`deploymentsRetrainingPolicies_retrieve`) */
export const deploymentsRetrainingPoliciesRetrieve: DatarobotEndpoints['deploymentsRetrainingPoliciesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'retrainingPolicyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create runs by ID */
/** Official: POST /api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/runs/ (`deploymentsRetrainingPoliciesRuns_create`) */
export const deploymentsRetrainingPoliciesRunsCreate: DatarobotEndpoints['deploymentsRetrainingPoliciesRunsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/runs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'retrainingPolicyId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRunsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesRunsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve runs by ID */
/** Official: GET /api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/runs/ (`deploymentsRetrainingPoliciesRuns_list`) */
export const deploymentsRetrainingPoliciesRunsList: DatarobotEndpoints['deploymentsRetrainingPoliciesRunsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/runs/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId', 'retrainingPolicyId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRunsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesRunsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify runs by ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/runs/{runId}/ (`deploymentsRetrainingPoliciesRuns_patch`) */
export const deploymentsRetrainingPoliciesRunsPatch: DatarobotEndpoints['deploymentsRetrainingPoliciesRunsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/runs/{runId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'retrainingPolicyId', 'runId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRunsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesRunsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve runs by ID */
/** Official: GET /api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/runs/{runId}/ (`deploymentsRetrainingPoliciesRuns_retrieve`) */
export const deploymentsRetrainingPoliciesRunsRetrieve: DatarobotEndpoints['deploymentsRetrainingPoliciesRunsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingPolicies/{retrainingPolicyId}/runs/{runId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'retrainingPolicyId', 'runId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRunsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingPoliciesRunsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve retraining settings by ID */
/** Official: GET /api/v2/deployments/{deploymentId}/retrainingSettings/ (`deploymentsRetrainingSettings_list`) */
export const deploymentsRetrainingSettingsList: DatarobotEndpoints['deploymentsRetrainingSettingsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingSettings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingSettingsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingSettingsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify retraining settings by ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/retrainingSettings/ (`deploymentsRetrainingSettings_patchMany`) */
export const deploymentsRetrainingSettingsPatchMany: DatarobotEndpoints['deploymentsRetrainingSettingsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/retrainingSettings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrainingSettingsPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrainingSettingsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve deployment by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/ (`deployments_retrieve`) */
export const deploymentsRetrieve: DatarobotEndpoints['deploymentsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List runtime parameters by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/runtimeParameters/ (`deploymentsRuntimeParameters_list`) */
export const deploymentsRuntimeParametersList: DatarobotEndpoints['deploymentsRuntimeParametersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/runtimeParameters/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRuntimeParametersList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRuntimeParametersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update runtime parameters by deployment ID */
/** Official: PUT /api/v2/deployments/{deploymentId}/runtimeParameters/ (`deploymentsRuntimeParameters_putMany`) */
export const deploymentsRuntimeParametersPutMany: DatarobotEndpoints['deploymentsRuntimeParametersPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/runtimeParameters/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsRuntimeParametersPutMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsRuntimeParametersPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Build Java package containing Scoring Code by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/scoringCodeBuilds/ (`deploymentsScoringCodeBuilds_create`) */
export const deploymentsScoringCodeBuildsCreate: DatarobotEndpoints['deploymentsScoringCodeBuildsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/scoringCodeBuilds/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsScoringCodeBuildsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsScoringCodeBuildsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Scoring Code by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/scoringCode/ (`deploymentsScoringCode_list`) */
export const deploymentsScoringCodeList: DatarobotEndpoints['deploymentsScoringCodeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/scoringCode/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'sourceCode',
				'includeAgent',
				'includePe',
				'includePredictionExplanations',
				'includePredictionIntervals',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsScoringCodeList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsScoringCodeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Segment attributes by ID */
/** Official: GET /api/v2/deployments/{deploymentId}/segmentAttributes/ (`deploymentsSegmentAttributes_list`) */
export const deploymentsSegmentAttributesList: DatarobotEndpoints['deploymentsSegmentAttributesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/segmentAttributes/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['monitoringType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSegmentAttributesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSegmentAttributesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Segment values by ID */
/** Official: GET /api/v2/deployments/{deploymentId}/segmentValues/ (`deploymentsSegmentValues_list`) */
export const deploymentsSegmentValuesList: DatarobotEndpoints['deploymentsSegmentValuesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/segmentValues/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit', 'segmentAttribute', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSegmentValuesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSegmentValuesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve service stats by ID */
/** Official: GET /api/v2/deployments/{deploymentId}/serviceStats/ (`deploymentsServiceStats_list`) */
export const deploymentsServiceStatsList: DatarobotEndpoints['deploymentsServiceStatsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/serviceStats/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'executionTimeQuantile',
				'responseTimeQuantile',
				'slowRequestsThreshold',
				'segmentAttribute',
				'segmentValue',
				'modelId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsServiceStatsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsServiceStatsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve service health metric over batch by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/serviceStatsOverBatch/ (`deploymentsServiceStatsOverBatch_list`) */
export const deploymentsServiceStatsOverBatchList: DatarobotEndpoints['deploymentsServiceStatsOverBatchList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/serviceStatsOverBatch/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'segmentAttribute',
				'segmentValue',
				'batchId',
				'modelId',
				'metric',
				'quantile',
				'threshold',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsServiceStatsOverBatchList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsServiceStatsOverBatchList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve service health metric over time by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/serviceStatsOverTime/ (`deploymentsServiceStatsOverTime_list`) */
export const deploymentsServiceStatsOverTimeList: DatarobotEndpoints['deploymentsServiceStatsOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/serviceStatsOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'bucketSize',
				'segmentAttribute',
				'segmentValue',
				'modelId',
				'metric',
				'quantile',
				'threshold',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsServiceStatsOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsServiceStatsOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve deployment settings checklist by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/settings/checklist/ (`deploymentsSettingsChecklist_list`) */
export const deploymentsSettingsChecklistList: DatarobotEndpoints['deploymentsSettingsChecklistList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/settings/checklist/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSettingsChecklistList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSettingsChecklistList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve deployment settings by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/settings/ (`deploymentsSettings_list`) */
export const deploymentsSettingsList: DatarobotEndpoints['deploymentsSettingsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/settings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSettingsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSettingsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update deployment settings by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/settings/ (`deploymentsSettings_patchMany`) */
export const deploymentsSettingsPatchMany: DatarobotEndpoints['deploymentsSettingsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/settings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSettingsPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSettingsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the model deployment access control list by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/sharedRoles/ (`deploymentsSharedRoles_list`) */
export const deploymentsSharedRolesList: DatarobotEndpoints['deploymentsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSharedRolesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the model deployment access controls by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/sharedRoles/ (`deploymentsSharedRoles_patchMany`) */
export const deploymentsSharedRolesPatchMany: DatarobotEndpoints['deploymentsSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Change deployment status by deployment ID */
/** Official: PATCH /api/v2/deployments/{deploymentId}/status/ (`deploymentsStatus_patchMany`) */
export const deploymentsStatusPatchMany: DatarobotEndpoints['deploymentsStatusPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/status/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsStatusPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsStatusPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve target drift by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/targetDrift/ (`deploymentsTargetDrift_list`) */
export const deploymentsTargetDriftList: DatarobotEndpoints['deploymentsTargetDriftList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/targetDrift/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			[
				'start',
				'end',
				'modelId',
				'metric',
				'segmentAttribute',
				'segmentValue',
				'batchId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsTargetDriftList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsTargetDriftList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a deployment training data export by deployment ID */
/** Official: POST /api/v2/deployments/{deploymentId}/trainingDataExports/ (`deploymentsTrainingDataExports_create`) */
export const deploymentsTrainingDataExportsCreate: DatarobotEndpoints['deploymentsTrainingDataExportsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/trainingDataExports/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['deploymentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsTrainingDataExportsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsTrainingDataExportsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of training data exports by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/trainingDataExports/ (`deploymentsTrainingDataExports_list`) */
export const deploymentsTrainingDataExportsList: DatarobotEndpoints['deploymentsTrainingDataExportsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/trainingDataExports/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['deploymentId'],
			['offset', 'limit', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsTrainingDataExportsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsTrainingDataExportsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve details by deployment ID */
/** Official: GET /api/v2/deployments/{deploymentId}/trainingDataExports/{exportId}/ (`deploymentsTrainingDataExports_retrieve`) */
export const deploymentsTrainingDataExportsRetrieve: DatarobotEndpoints['deploymentsTrainingDataExportsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/deployments/{deploymentId}/trainingDataExports/{exportId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['deploymentId', 'exportId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deploymentsTrainingDataExportsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.deployments.deploymentsTrainingDataExportsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
