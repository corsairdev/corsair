import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve training predictions by project ID */
/** Official: GET /api/v2/projects/{projectId}/trainingPredictions/{predictionId}/ (`computedTrainingPredictions_list`) */
export const computedTrainingPredictionsList: DatarobotEndpoints['computedTrainingPredictionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/trainingPredictions/{predictionId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'predictionId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.computedTrainingPredictionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.computedTrainingPredictionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Start modeling by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/aim/ (`configure_and_start_autopilot`) */
export const configureAndStartAutopilot: DatarobotEndpoints['configureAndStartAutopilot'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/projects/{projectId}/aim/', input);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.configureAndStartAutopilot.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.configureAndStartAutopilot',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the project access control list by project ID */
/** Official: GET /api/v2/projects/{projectId}/accessControl/ (`projectsAccessControl_list`) */
export const projectsAccessControlList: DatarobotEndpoints['projectsAccessControlList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/accessControl/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'username', 'userId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsAccessControlList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsAccessControlList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the project's access controls by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/accessControl/ (`projectsAccessControl_patchMany`) */
export const projectsAccessControlPatchMany: DatarobotEndpoints['projectsAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete the anomaly assessment record by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/anomalyAssessmentRecords/{recordId}/ (`projectsAnomalyAssessmentRecords_delete`) */
export const projectsAnomalyAssessmentRecordsDelete: DatarobotEndpoints['projectsAnomalyAssessmentRecordsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/anomalyAssessmentRecords/{recordId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'recordId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsAnomalyAssessmentRecordsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsAnomalyAssessmentRecordsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve anomaly assessment record by project ID */
/** Official: GET /api/v2/projects/{projectId}/anomalyAssessmentRecords/{recordId}/explanations/ (`projectsAnomalyAssessmentRecordsExplanations_list`) */
export const projectsAnomalyAssessmentRecordsExplanationsList: DatarobotEndpoints['projectsAnomalyAssessmentRecordsExplanationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/anomalyAssessmentRecords/{recordId}/explanations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'recordId'],
			['startDate', 'endDate', 'pointsCount'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsAnomalyAssessmentRecordsExplanationsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsAnomalyAssessmentRecordsExplanationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve anomaly assessment records by project ID */
/** Official: GET /api/v2/projects/{projectId}/anomalyAssessmentRecords/ (`projectsAnomalyAssessmentRecords_list`) */
export const projectsAnomalyAssessmentRecordsList: DatarobotEndpoints['projectsAnomalyAssessmentRecordsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/anomalyAssessmentRecords/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'modelId', 'backtest', 'source', 'seriesId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsAnomalyAssessmentRecordsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsAnomalyAssessmentRecordsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve predictions preview by project ID */
/** Official: GET /api/v2/projects/{projectId}/anomalyAssessmentRecords/{recordId}/predictionsPreview/ (`projectsAnomalyAssessmentRecordsPredictionsPreview_list`) */
export const projectsAnomalyAssessmentRecordsPredictionsPreviewList: DatarobotEndpoints['projectsAnomalyAssessmentRecordsPredictionsPreviewList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/anomalyAssessmentRecords/{recordId}/predictionsPreview/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'recordId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsAnomalyAssessmentRecordsPredictionsPreviewList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsAnomalyAssessmentRecordsPredictionsPreviewList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Pause by project ID */
/** Official: POST /api/v2/projects/{projectId}/autopilot/ (`projectsAutopilot_create`) */
export const projectsAutopilotCreate: DatarobotEndpoints['projectsAutopilotCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/autopilot/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsAutopilotCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsAutopilotCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Start autopilot by project ID */
/** Official: POST /api/v2/projects/{projectId}/autopilots/ (`projectsAutopilots_create`) */
export const projectsAutopilotsCreate: DatarobotEndpoints['projectsAutopilotsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/autopilots/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsAutopilotsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsAutopilotsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create multiple new features by changing the type of existing features by project ID */
/** Official: POST /api/v2/projects/{projectId}/batchTypeTransformFeatures/ (`projectsBatchTypeTransformFeatures_create`) */
export const projectsBatchTypeTransformFeaturesCreate: DatarobotEndpoints['projectsBatchTypeTransformFeaturesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/batchTypeTransformFeatures/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBatchTypeTransformFeaturesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBatchTypeTransformFeaturesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the result of a batch variable type transformation by project ID */
/** Official: GET /api/v2/projects/{projectId}/batchTypeTransformFeaturesResult/{jobId}/ (`projectsBatchTypeTransformFeaturesResult_retrieve`) */
export const projectsBatchTypeTransformFeaturesResultRetrieve: DatarobotEndpoints['projectsBatchTypeTransformFeaturesResultRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/batchTypeTransformFeaturesResult/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBatchTypeTransformFeaturesResultRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBatchTypeTransformFeaturesResultRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Add a request by project ID */
/** Official: POST /api/v2/projects/{projectId}/biasMitigatedModels/ (`projectsBiasMitigatedModels_create`) */
export const projectsBiasMitigatedModelsCreate: DatarobotEndpoints['projectsBiasMitigatedModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/biasMitigatedModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBiasMitigatedModelsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBiasMitigatedModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List of bias mitigated models by project ID */
/** Official: GET /api/v2/projects/{projectId}/biasMitigatedModels/ (`projectsBiasMitigatedModels_list`) */
export const projectsBiasMitigatedModelsList: DatarobotEndpoints['projectsBiasMitigatedModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/biasMitigatedModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'parentModelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBiasMitigatedModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBiasMitigatedModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Submit a job by project ID */
/** Official: POST /api/v2/projects/{projectId}/biasMitigationFeatureInfo/{featureName}/ (`projectsBiasMitigationFeatureInfo_createOne`) */
export const projectsBiasMitigationFeatureInfoCreateOne: DatarobotEndpoints['projectsBiasMitigationFeatureInfoCreateOne'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/biasMitigationFeatureInfo/{featureName}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featureName'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBiasMitigationFeatureInfoCreateOne.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBiasMitigationFeatureInfoCreateOne',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get bias mitigation data quality information by project ID */
/** Official: GET /api/v2/projects/{projectId}/biasMitigationFeatureInfo/ (`projectsBiasMitigationFeatureInfo_list`) */
export const projectsBiasMitigationFeatureInfoList: DatarobotEndpoints['projectsBiasMitigationFeatureInfoList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/biasMitigationFeatureInfo/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['featureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBiasMitigationFeatureInfoList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBiasMitigationFeatureInfoList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List Bias vs Accuracy insights by project ID */
/** Official: GET /api/v2/projects/{projectId}/biasVsAccuracyInsights/ (`projectsBiasVsAccuracyInsights_list`) */
export const projectsBiasVsAccuracyInsightsList: DatarobotEndpoints['projectsBiasVsAccuracyInsightsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/biasVsAccuracyInsights/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['accuracyMetric', 'protectedFeature', 'fairnessMetric'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBiasVsAccuracyInsightsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBiasVsAccuracyInsightsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Check if models can be blended by project ID */
/** Official: POST /api/v2/projects/{projectId}/blenderModels/blendCheck/ (`projectsBlenderModelsBlendCheck_create`) */
export const projectsBlenderModelsBlendCheckCreate: DatarobotEndpoints['projectsBlenderModelsBlendCheckCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blenderModels/blendCheck/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlenderModelsBlendCheckCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlenderModelsBlendCheckCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a blender by project ID */
/** Official: POST /api/v2/projects/{projectId}/blenderModels/ (`projectsBlenderModels_create`) */
export const projectsBlenderModelsCreate: DatarobotEndpoints['projectsBlenderModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blenderModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlenderModelsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlenderModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all blenders by project ID */
/** Official: GET /api/v2/projects/{projectId}/blenderModels/ (`projectsBlenderModels_list`) */
export const projectsBlenderModelsList: DatarobotEndpoints['projectsBlenderModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blenderModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlenderModelsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlenderModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a blender by project ID */
/** Official: GET /api/v2/projects/{projectId}/blenderModels/{modelId}/ (`projectsBlenderModels_retrieve`) */
export const projectsBlenderModelsRetrieve: DatarobotEndpoints['projectsBlenderModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blenderModels/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlenderModelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlenderModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a blueprint chart by blueprint id. */
/** Official: GET /api/v2/projects/{projectId}/blueprints/{blueprintId}/blueprintChart/ (`projectsBlueprintsBlueprintChart_list`) */
export const projectsBlueprintsBlueprintChartList: DatarobotEndpoints['projectsBlueprintsBlueprintChartList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blueprints/{blueprintId}/blueprintChart/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'blueprintId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlueprintsBlueprintChartList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlueprintsBlueprintChartList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve blueprint tasks documentation by project ID */
/** Official: GET /api/v2/projects/{projectId}/blueprints/{blueprintId}/blueprintDocs/ (`projectsBlueprintsBlueprintDocs_list`) */
export const projectsBlueprintsBlueprintDocsList: DatarobotEndpoints['projectsBlueprintsBlueprintDocsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blueprints/{blueprintId}/blueprintDocs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'blueprintId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlueprintsBlueprintDocsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlueprintsBlueprintDocsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the JSON representation of a datarobot blueprint by project ID */
/** Official: GET /api/v2/projects/{projectId}/blueprints/{blueprintId}/json/ (`projectsBlueprintsJson_list`) */
export const projectsBlueprintsJsonList: DatarobotEndpoints['projectsBlueprintsJsonList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blueprints/{blueprintId}/json/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'blueprintId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlueprintsJsonList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlueprintsJsonList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List blueprints by project ID */
/** Official: GET /api/v2/projects/{projectId}/blueprints/ (`projectsBlueprints_list`) */
export const projectsBlueprintsList: DatarobotEndpoints['projectsBlueprintsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blueprints/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlueprintsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlueprintsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a blueprint by its ID. */
/** Official: GET /api/v2/projects/{projectId}/blueprints/{blueprintId}/ (`projectsBlueprints_retrieve`) */
export const projectsBlueprintsRetrieve: DatarobotEndpoints['projectsBlueprintsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/blueprints/{blueprintId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'blueprintId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsBlueprintsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsBlueprintsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List available calendar events by project ID */
/** Official: GET /api/v2/projects/{projectId}/calendarEvents/ (`projectsCalendarEvents_list`) */
export const projectsCalendarEventsList: DatarobotEndpoints['projectsCalendarEventsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/calendarEvents/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['seriesId', 'startDate', 'endDate', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsCalendarEventsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsCalendarEventsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve all existing combined models by project ID */
/** Official: GET /api/v2/projects/{projectId}/combinedModels/ (`projectsCombinedModels_list`) */
export const projectsCombinedModelsList: DatarobotEndpoints['projectsCombinedModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/combinedModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsCombinedModelsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsCombinedModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an existing combined model by project ID */
/** Official: GET /api/v2/projects/{projectId}/combinedModels/{combinedModelId}/ (`projectsCombinedModels_retrieve`) */
export const projectsCombinedModelsRetrieve: DatarobotEndpoints['projectsCombinedModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/combinedModels/{combinedModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'combinedModelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsCombinedModelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsCombinedModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download Combined Model segments info by project ID */
/** Official: GET /api/v2/projects/{projectId}/combinedModels/{combinedModelId}/segments/download/ (`projectsCombinedModelsSegmentsDownload_list`) */
export const projectsCombinedModelsSegmentsDownloadList: DatarobotEndpoints['projectsCombinedModelsSegmentsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/combinedModels/{combinedModelId}/segments/download/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'combinedModelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsCombinedModelsSegmentsDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsCombinedModelsSegmentsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Combined Model segments info by project ID */
/** Official: GET /api/v2/projects/{projectId}/combinedModels/{combinedModelId}/segments/ (`projectsCombinedModelsSegments_list`) */
export const projectsCombinedModelsSegmentsList: DatarobotEndpoints['projectsCombinedModelsSegmentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/combinedModels/{combinedModelId}/segments/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'combinedModelId'],
			['offset', 'limit', 'searchSegmentName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsCombinedModelsSegmentsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsCombinedModelsSegmentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a project. */
/** Official: POST /api/v2/projects/ (`projects_create`) */
export const projectsCreate: DatarobotEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/projects/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.projectsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.projects.projectsCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Validate columns by project ID */
/** Official: POST /api/v2/projects/{projectId}/crossSeriesProperties/ (`projectsCrossSeriesProperties_create`) */
export const projectsCrossSeriesPropertiesCreate: DatarobotEndpoints['projectsCrossSeriesPropertiesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/crossSeriesProperties/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsCrossSeriesPropertiesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsCrossSeriesPropertiesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List paginated Data Slices by project ID */
/** Official: GET /api/v2/projects/{projectId}/dataSlices/ (`projectsDataSlices_list`) */
export const projectsDataSlicesList: DatarobotEndpoints['projectsDataSlicesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/dataSlices/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['limit', 'offset', 'searchQuery'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDataSlicesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDataSlicesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the data by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/accuracyOverTimePlots/ (`projectsDatetimeModelsAccuracyOverTimePlots_list`) */
export const projectsDatetimeModelsAccuracyOverTimePlotsList: DatarobotEndpoints['projectsDatetimeModelsAccuracyOverTimePlotsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/accuracyOverTimePlots/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[
				'seriesId',
				'backtest',
				'source',
				'forecastDistance',
				'resolution',
				'maxBinSize',
				'startDate',
				'endDate',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsAccuracyOverTimePlotsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the metadata by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/accuracyOverTimePlots/metadata/ (`projectsDatetimeModelsAccuracyOverTimePlotsMetadata_list`) */
export const projectsDatetimeModelsAccuracyOverTimePlotsMetadataList: DatarobotEndpoints['projectsDatetimeModelsAccuracyOverTimePlotsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/accuracyOverTimePlots/metadata/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['forecastDistance', 'seriesId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsAccuracyOverTimePlotsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the preview by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/accuracyOverTimePlots/preview/ (`projectsDatetimeModelsAccuracyOverTimePlotsPreview_list`) */
export const projectsDatetimeModelsAccuracyOverTimePlotsPreviewList: DatarobotEndpoints['projectsDatetimeModelsAccuracyOverTimePlotsPreviewList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/accuracyOverTimePlots/preview/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['seriesId', 'backtest', 'source', 'forecastDistance'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsPreviewList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsAccuracyOverTimePlotsPreviewList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve anomaly over time plots by ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/anomalyOverTimePlots/ (`projectsDatetimeModelsAnomalyOverTimePlots_list`) */
export const projectsDatetimeModelsAnomalyOverTimePlotsList: DatarobotEndpoints['projectsDatetimeModelsAnomalyOverTimePlotsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/anomalyOverTimePlots/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[
				'seriesId',
				'backtest',
				'source',
				'resolution',
				'maxBinSize',
				'startDate',
				'endDate',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsAnomalyOverTimePlotsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metadata by ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/anomalyOverTimePlots/metadata/ (`projectsDatetimeModelsAnomalyOverTimePlotsMetadata_list`) */
export const projectsDatetimeModelsAnomalyOverTimePlotsMetadataList: DatarobotEndpoints['projectsDatetimeModelsAnomalyOverTimePlotsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/anomalyOverTimePlots/metadata/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['seriesId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsAnomalyOverTimePlotsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve preview by ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/anomalyOverTimePlots/preview/ (`projectsDatetimeModelsAnomalyOverTimePlotsPreview_list`) */
export const projectsDatetimeModelsAnomalyOverTimePlotsPreviewList: DatarobotEndpoints['projectsDatetimeModelsAnomalyOverTimePlotsPreviewList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/anomalyOverTimePlots/preview/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['seriesId', 'backtest', 'source', 'predictionThreshold'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsPreviewList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsAnomalyOverTimePlotsPreviewList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a plot displaying the stability of the datetime model across by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/backtestStabilityPlot/ (`projectsDatetimeModelsBacktestStabilityPlot_list`) */
export const projectsDatetimeModelsBacktestStabilityPlotList: DatarobotEndpoints['projectsDatetimeModelsBacktestStabilityPlotList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/backtestStabilityPlot/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['metricName', 'forecastDistance'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsBacktestStabilityPlotList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsBacktestStabilityPlotList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Score all the available backtests of a datetime model by project ID */
/** Official: POST /api/v2/projects/{projectId}/datetimeModels/{modelId}/backtests/ (`projectsDatetimeModelsBacktests_create`) */
export const projectsDatetimeModelsBacktestsCreate: DatarobotEndpoints['projectsDatetimeModelsBacktestsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/backtests/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsBacktestsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsBacktestsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Train a new datetime model by project ID */
/** Official: POST /api/v2/projects/{projectId}/datetimeModels/ (`projectsDatetimeModels_create`) */
export const projectsDatetimeModelsCreate: DatarobotEndpoints['projectsDatetimeModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the metadata of the Accuracy Over Time (AOT) chart by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/datasetAccuracyOverTimePlots/{datasetId}/metadata/ (`projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadata_list`) */
export const projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList: DatarobotEndpoints['projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/datasetAccuracyOverTimePlots/{datasetId}/metadata/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'datasetId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a preview of the Accuracy Over Time (AOT) chart by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/datasetAccuracyOverTimePlots/{datasetId}/preview/ (`projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreview_list`) */
export const projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList: DatarobotEndpoints['projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/datasetAccuracyOverTimePlots/{datasetId}/preview/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'datasetId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the Accuracy Over Time (AOT) chart data by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/datasetAccuracyOverTimePlots/{datasetId}/ (`projectsDatetimeModelsDatasetAccuracyOverTimePlots_retrieve`) */
export const projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve: DatarobotEndpoints['projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/datasetAccuracyOverTimePlots/{datasetId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'datasetId'],
			['maxBinSize', 'startDate', 'endDate', 'resolution'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Computes Datetime Trend plots by project ID */
/** Official: POST /api/v2/projects/{projectId}/datetimeModels/{modelId}/datetimeTrendPlots/ (`projectsDatetimeModelsDatetimeTrendPlots_create`) */
export const projectsDatetimeModelsDatetimeTrendPlotsCreate: DatarobotEndpoints['projectsDatetimeModelsDatetimeTrendPlotsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/datetimeTrendPlots/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsDatetimeTrendPlotsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsDatetimeTrendPlotsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Add a request by project ID */
/** Official: POST /api/v2/projects/{projectId}/datetimeModels/{modelId}/featureEffects/ (`projectsDatetimeModelsFeatureEffects_create`) */
export const projectsDatetimeModelsFeatureEffectsCreate: DatarobotEndpoints['projectsDatetimeModelsFeatureEffectsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/featureEffects/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsFeatureEffectsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsFeatureEffectsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Feature Effects by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/featureEffects/ (`projectsDatetimeModelsFeatureEffects_list`) */
export const projectsDatetimeModelsFeatureEffectsList: DatarobotEndpoints['projectsDatetimeModelsFeatureEffectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/featureEffects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['source', 'backtestIndex'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsFeatureEffectsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsFeatureEffectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Feature Effects metadata for each backtest by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/featureEffectsMetadata/ (`projectsDatetimeModelsFeatureEffectsMetadata_list`) */
export const projectsDatetimeModelsFeatureEffectsMetadataList: DatarobotEndpoints['projectsDatetimeModelsFeatureEffectsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/featureEffectsMetadata/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsFeatureEffectsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsFeatureEffectsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a plot displaying the stability of the time series model across by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/forecastDistanceStabilityPlot/ (`projectsDatetimeModelsForecastDistanceStabilityPlot_list`) */
export const projectsDatetimeModelsForecastDistanceStabilityPlotList: DatarobotEndpoints['projectsDatetimeModelsForecastDistanceStabilityPlotList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/forecastDistanceStabilityPlot/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['metricName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsForecastDistanceStabilityPlotList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsForecastDistanceStabilityPlotList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve forecast vs actual plots by ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/forecastVsActualPlots/ (`projectsDatetimeModelsForecastVsActualPlots_list`) */
export const projectsDatetimeModelsForecastVsActualPlotsList: DatarobotEndpoints['projectsDatetimeModelsForecastVsActualPlotsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/forecastVsActualPlots/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[
				'seriesId',
				'backtest',
				'source',
				'resolution',
				'forecastDistanceStart',
				'forecastDistanceEnd',
				'maxBinSize',
				'startDate',
				'endDate',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsForecastVsActualPlotsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsForecastVsActualPlotsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metadata by ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/forecastVsActualPlots/metadata/ (`projectsDatetimeModelsForecastVsActualPlotsMetadata_list`) */
export const projectsDatetimeModelsForecastVsActualPlotsMetadataList: DatarobotEndpoints['projectsDatetimeModelsForecastVsActualPlotsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/forecastVsActualPlots/metadata/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['seriesId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsForecastVsActualPlotsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsForecastVsActualPlotsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve preview by ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/forecastVsActualPlots/preview/ (`projectsDatetimeModelsForecastVsActualPlotsPreview_list`) */
export const projectsDatetimeModelsForecastVsActualPlotsPreviewList: DatarobotEndpoints['projectsDatetimeModelsForecastVsActualPlotsPreviewList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/forecastVsActualPlots/preview/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['seriesId', 'backtest', 'source'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsForecastVsActualPlotsPreviewList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsForecastVsActualPlotsPreviewList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrain an existing datetime model by project ID */
/** Official: POST /api/v2/projects/{projectId}/datetimeModels/fromModel/ (`projectsDatetimeModelsFromModel_create`) */
export const projectsDatetimeModelsFromModelCreate: DatarobotEndpoints['projectsDatetimeModelsFromModelCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/fromModel/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsFromModelCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsFromModelCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List datetime partitioned project models by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/ (`projectsDatetimeModels_list`) */
export const projectsDatetimeModelsList: DatarobotEndpoints['projectsDatetimeModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'bulkOperationId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Compute feature effects by project ID */
/** Official: POST /api/v2/projects/{projectId}/datetimeModels/{modelId}/multiclassFeatureEffects/ (`projectsDatetimeModelsMulticlassFeatureEffects_create`) */
export const projectsDatetimeModelsMulticlassFeatureEffectsCreate: DatarobotEndpoints['projectsDatetimeModelsMulticlassFeatureEffectsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/multiclassFeatureEffects/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMulticlassFeatureEffectsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsMulticlassFeatureEffectsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve feature effects by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/multiclassFeatureEffects/ (`projectsDatetimeModelsMulticlassFeatureEffects_list`) */
export const projectsDatetimeModelsMulticlassFeatureEffectsList: DatarobotEndpoints['projectsDatetimeModelsMulticlassFeatureEffectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/multiclassFeatureEffects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['source', 'backtestIndex', 'offset', 'limit', 'class'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMulticlassFeatureEffectsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsMulticlassFeatureEffectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the histograms by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/multiseriesHistograms/ (`projectsDatetimeModelsMultiseriesHistograms_list`) */
export const projectsDatetimeModelsMultiseriesHistogramsList: DatarobotEndpoints['projectsDatetimeModelsMultiseriesHistogramsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/multiseriesHistograms/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['attribute', 'metric', 'bins'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMultiseriesHistogramsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsMultiseriesHistogramsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request the computation of per-series scores by project ID */
/** Official: POST /api/v2/projects/{projectId}/datetimeModels/{modelId}/multiseriesScores/ (`projectsDatetimeModelsMultiseriesScores_create`) */
export const projectsDatetimeModelsMultiseriesScoresCreate: DatarobotEndpoints['projectsDatetimeModelsMultiseriesScoresCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/multiseriesScores/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMultiseriesScoresCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsMultiseriesScoresCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the CSV file by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/multiseriesScores/file/ (`projectsDatetimeModelsMultiseriesScoresFile_list`) */
export const projectsDatetimeModelsMultiseriesScoresFileList: DatarobotEndpoints['projectsDatetimeModelsMultiseriesScoresFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/multiseriesScores/file/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['multiseriesValue', 'metric'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMultiseriesScoresFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsMultiseriesScoresFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List the scores per individual series by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/multiseriesScores/ (`projectsDatetimeModelsMultiseriesScores_list`) */
export const projectsDatetimeModelsMultiseriesScoresList: DatarobotEndpoints['projectsDatetimeModelsMultiseriesScoresList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/multiseriesScores/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[
				'multiseriesValue',
				'offset',
				'limit',
				'metric',
				'orderBy',
				'filterBy',
				'numberOfBins',
				'filterByBins',
				'clusterNames',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMultiseriesScoresList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsMultiseriesScoresList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get datetime model by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimeModels/{modelId}/ (`projectsDatetimeModels_retrieve`) */
export const projectsDatetimeModelsRetrieve: DatarobotEndpoints['projectsDatetimeModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimeModels/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimeModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Preview the fully specified datetime partitioning generated by the requested configuration by project ID */
/** Official: POST /api/v2/projects/{projectId}/datetimePartitioning/ (`projectsDatetimePartitioning_create`) */
export const projectsDatetimePartitioningCreate: DatarobotEndpoints['projectsDatetimePartitioningCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimePartitioning/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimePartitioningCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimePartitioningCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve datetime partitioning configuration by project ID */
/** Official: GET /api/v2/projects/{projectId}/datetimePartitioning/ (`projectsDatetimePartitioning_list`) */
export const projectsDatetimePartitioningList: DatarobotEndpoints['projectsDatetimePartitioningList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/datetimePartitioning/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDatetimePartitioningList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDatetimePartitioningList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a project by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/ (`projects_delete`) */
export const projectsDelete: DatarobotEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/projects/{projectId}/', input);
	const { query, body } = splitDatarobotInput(input, ['projectId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.projectsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.projects.projectsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Prepare a model by project ID */
/** Official: POST /api/v2/projects/{projectId}/deploymentReadyModels/ (`projectsDeploymentReadyModels_create`) */
export const projectsDeploymentReadyModelsCreate: DatarobotEndpoints['projectsDeploymentReadyModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/deploymentReadyModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDeploymentReadyModelsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDeploymentReadyModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get discarded features by project ID */
/** Official: GET /api/v2/projects/{projectId}/discardedFeatures/ (`projectsDiscardedFeatures_list`) */
export const projectsDiscardedFeaturesList: DatarobotEndpoints['projectsDiscardedFeaturesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/discardedFeatures/',
			input,
		);
		const { query } = splitDatarobotInput(input, ['projectId'], ['search']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDiscardedFeaturesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDiscardedFeaturesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Returns a file by project ID */
/** Official: GET /api/v2/projects/{projectId}/documentPages/{documentPageId}/file/ (`projectsDocumentPagesFile_list`) */
export const projectsDocumentPagesFileList: DatarobotEndpoints['projectsDocumentPagesFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/documentPages/{documentPageId}/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'documentPageId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDocumentPagesFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDocumentPagesFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Lists metadata on all computed document text extraction samples by project ID */
/** Official: GET /api/v2/projects/{projectId}/documentTextExtractionSamples/ (`projectsDocumentTextExtractionSamples_list`) */
export const projectsDocumentTextExtractionSamplesList: DatarobotEndpoints['projectsDocumentTextExtractionSamplesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/documentTextExtractionSamples/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDocumentTextExtractionSamplesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDocumentTextExtractionSamplesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Lists document thumbnail bins for every target value or range including the metadata for one by project ID */
/** Official: GET /api/v2/projects/{projectId}/documentThumbnailBins/ (`projectsDocumentThumbnailBins_list`) */
export const projectsDocumentThumbnailBinsList: DatarobotEndpoints['projectsDocumentThumbnailBinsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/documentThumbnailBins/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'featureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDocumentThumbnailBinsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDocumentThumbnailBinsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all metadata by project ID */
/** Official: GET /api/v2/projects/{projectId}/documentThumbnailSamples/ (`projectsDocumentThumbnailSamples_list`) */
export const projectsDocumentThumbnailSamplesList: DatarobotEndpoints['projectsDocumentThumbnailSamplesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/documentThumbnailSamples/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'featureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDocumentThumbnailSamplesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDocumentThumbnailSamplesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Returns a list of document thumbnail metadata elements by project ID */
/** Official: GET /api/v2/projects/{projectId}/documentThumbnails/ (`projectsDocumentThumbnails_list`) */
export const projectsDocumentThumbnailsList: DatarobotEndpoints['projectsDocumentThumbnailsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/documentThumbnails/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			[
				'featureName',
				'targetValue',
				'targetBinStart',
				'targetBinEnd',
				'offset',
				'limit',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDocumentThumbnailsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDocumentThumbnailsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a text file containing the documents data quality log by project ID */
/** Official: GET /api/v2/projects/{projectId}/documentsDataQualityLog/file/ (`projectsDocumentsDataQualityLogFile_list`) */
export const projectsDocumentsDataQualityLogFileList: DatarobotEndpoints['projectsDocumentsDataQualityLogFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/documentsDataQualityLog/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDocumentsDataQualityLogFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDocumentsDataQualityLogFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the documents data quality log content by project ID */
/** Official: GET /api/v2/projects/{projectId}/documentsDataQualityLog/ (`projectsDocumentsDataQualityLog_list`) */
export const projectsDocumentsDataQualityLogList: DatarobotEndpoints['projectsDocumentsDataQualityLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/documentsDataQualityLog/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDocumentsDataQualityLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDocumentsDataQualityLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of duplicate images containing the number of occurrences of each by project ID */
/** Official: GET /api/v2/projects/{projectId}/duplicateImages/{column}/ (`projectsDuplicateImages_list`) */
export const projectsDuplicateImagesList: DatarobotEndpoints['projectsDuplicateImagesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/duplicateImages/{column}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'column'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsDuplicateImagesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsDuplicateImagesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Eureqa model details plot by project ID */
/** Official: GET /api/v2/projects/{projectId}/eureqaDistributionPlot/{solutionId}/ (`projectsEureqaDistributionPlot_retrieve`) */
export const projectsEureqaDistributionPlotRetrieve: DatarobotEndpoints['projectsEureqaDistributionPlotRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/eureqaDistributionPlot/{solutionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'solutionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsEureqaDistributionPlotRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsEureqaDistributionPlotRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve eureqa model detail by ID */
/** Official: GET /api/v2/projects/{projectId}/eureqaModelDetail/{solutionId}/ (`projectsEureqaModelDetail_retrieve`) */
export const projectsEureqaModelDetailRetrieve: DatarobotEndpoints['projectsEureqaModelDetailRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/eureqaModelDetail/{solutionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'solutionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsEureqaModelDetailRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsEureqaModelDetailRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new model by project ID */
/** Official: POST /api/v2/projects/{projectId}/eureqaModels/ (`projectsEureqaModels_create`) */
export const projectsEureqaModelsCreate: DatarobotEndpoints['projectsEureqaModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/eureqaModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsEureqaModelsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsEureqaModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the pareto front by project ID */
/** Official: GET /api/v2/projects/{projectId}/eureqaModels/{modelId}/ (`projectsEureqaModels_retrieve`) */
export const projectsEureqaModelsRetrieve: DatarobotEndpoints['projectsEureqaModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/eureqaModels/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsEureqaModelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsEureqaModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Compute model scores by project ID */
/** Official: POST /api/v2/projects/{projectId}/externalScores/ (`projectsExternalScores_create`) */
export const projectsExternalScoresCreate: DatarobotEndpoints['projectsExternalScoresCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/externalScores/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsExternalScoresCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsExternalScoresCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of scores on prediction datasets by project ID */
/** Official: GET /api/v2/projects/{projectId}/externalScores/ (`projectsExternalScores_list`) */
export const projectsExternalScoresList: DatarobotEndpoints['projectsExternalScoresList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/externalScores/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'datasetId', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsExternalScoresList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsExternalScoresList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Validate baseline data by project ID */
/** Official: POST /api/v2/projects/{projectId}/externalTimeSeriesBaselineDataValidationJobs/ (`projectsExternalTimeSeriesBaselineDataValidationJobs_create`) */
export const projectsExternalTimeSeriesBaselineDataValidationJobsCreate: DatarobotEndpoints['projectsExternalTimeSeriesBaselineDataValidationJobsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/externalTimeSeriesBaselineDataValidationJobs/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsExternalTimeSeriesBaselineDataValidationJobsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsExternalTimeSeriesBaselineDataValidationJobsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the baseline validation job by project ID */
/** Official: GET /api/v2/projects/{projectId}/externalTimeSeriesBaselineDataValidationJobs/{baselineValidationJobId}/ (`projectsExternalTimeSeriesBaselineDataValidationJobs_retrieve`) */
export const projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve: DatarobotEndpoints['projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/externalTimeSeriesBaselineDataValidationJobs/{baselineValidationJobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'baselineValidationJobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all featurelists with feature association matrix availability flags by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureAssociationFeaturelists/ (`projectsFeatureAssociationFeaturelists_list`) */
export const projectsFeatureAssociationFeaturelistsList: DatarobotEndpoints['projectsFeatureAssociationFeaturelistsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureAssociationFeaturelists/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureAssociationFeaturelistsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureAssociationFeaturelistsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Compute the feature association matrix by project ID */
/** Official: POST /api/v2/projects/{projectId}/featureAssociationMatrix/ (`projectsFeatureAssociationMatrix_create`) */
export const projectsFeatureAssociationMatrixCreate: DatarobotEndpoints['projectsFeatureAssociationMatrixCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureAssociationMatrix/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureAssociationMatrixCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureAssociationMatrixCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieval by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureAssociationMatrixDetails/ (`projectsFeatureAssociationMatrixDetails_list`) */
export const projectsFeatureAssociationMatrixDetailsList: DatarobotEndpoints['projectsFeatureAssociationMatrixDetailsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureAssociationMatrixDetails/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['feature1', 'feature2', 'featurelistId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureAssociationMatrixDetailsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureAssociationMatrixDetailsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve pairwise feature association statistics by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureAssociationMatrix/ (`projectsFeatureAssociationMatrix_list`) */
export const projectsFeatureAssociationMatrixList: DatarobotEndpoints['projectsFeatureAssociationMatrixList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureAssociationMatrix/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['type', 'metric', 'featurelistId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureAssociationMatrixList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureAssociationMatrixList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download the project dataset by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureDiscoveryDatasetDownload/ (`projectsFeatureDiscoveryDatasetDownload_list`) */
export const projectsFeatureDiscoveryDatasetDownloadList: DatarobotEndpoints['projectsFeatureDiscoveryDatasetDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureDiscoveryDatasetDownload/',
			input,
		);
		const { query } = splitDatarobotInput(input, ['projectId'], ['datasetId']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryDatasetDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureDiscoveryDatasetDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a text file containing the feature discovery log by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureDiscoveryLogs/download/ (`projectsFeatureDiscoveryLogsDownload_list`) */
export const projectsFeatureDiscoveryLogsDownloadList: DatarobotEndpoints['projectsFeatureDiscoveryLogsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureDiscoveryLogs/download/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryLogsDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureDiscoveryLogsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the feature discovery log content by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureDiscoveryLogs/ (`projectsFeatureDiscoveryLogs_list`) */
export const projectsFeatureDiscoveryLogsList: DatarobotEndpoints['projectsFeatureDiscoveryLogsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureDiscoveryLogs/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryLogsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureDiscoveryLogsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download the feature discovery SQL recipe by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureDiscoveryRecipeSQLs/download/ (`projectsFeatureDiscoveryRecipeSQLsDownload_list`) */
export const projectsFeatureDiscoveryRecipeSQLsDownloadList: DatarobotEndpoints['projectsFeatureDiscoveryRecipeSQLsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureDiscoveryRecipeSQLs/download/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['modelId', 'statusOnly', 'asText'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryRecipeSQLsDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureDiscoveryRecipeSQLsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Generate the feature discovery SQL recipe by project ID */
/** Official: POST /api/v2/projects/{projectId}/featureDiscoveryRecipeSqlExports/ (`projectsFeatureDiscoveryRecipeSqlExports_create`) */
export const projectsFeatureDiscoveryRecipeSqlExportsCreate: DatarobotEndpoints['projectsFeatureDiscoveryRecipeSqlExportsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureDiscoveryRecipeSqlExports/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryRecipeSqlExportsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureDiscoveryRecipeSqlExportsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the feature histogram by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureHistograms/{featureName}/ (`projectsFeatureHistograms_retrieve`) */
export const projectsFeatureHistogramsRetrieve: DatarobotEndpoints['projectsFeatureHistogramsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureHistograms/{featureName}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'featureName'],
			['binLimit', 'key'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureHistogramsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureHistogramsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the Feature Discovery lineage by project ID */
/** Official: GET /api/v2/projects/{projectId}/featureLineages/{featureLineageId}/ (`projectsFeatureLineages_retrieve`) */
export const projectsFeatureLineagesRetrieve: DatarobotEndpoints['projectsFeatureLineagesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featureLineages/{featureLineageId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featureLineageId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeatureLineagesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeatureLineagesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new featurelist by project ID */
/** Official: POST /api/v2/projects/{projectId}/featurelists/ (`projectsFeaturelists_create`) */
export const projectsFeaturelistsCreate: DatarobotEndpoints['projectsFeaturelistsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featurelists/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturelistsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturelistsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a specified featurelist by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/featurelists/{featurelistId}/ (`projectsFeaturelists_delete`) */
export const projectsFeaturelistsDelete: DatarobotEndpoints['projectsFeaturelistsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featurelists/{featurelistId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'featurelistId'],
			['dryRun', 'deleteDependencies'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturelistsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturelistsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List featurelists by project ID */
/** Official: GET /api/v2/projects/{projectId}/featurelists/ (`projectsFeaturelists_list`) */
export const projectsFeaturelistsList: DatarobotEndpoints['projectsFeaturelistsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featurelists/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['sortBy', 'searchFor'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturelistsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturelistsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an existing featurelist by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/featurelists/{featurelistId}/ (`projectsFeaturelists_patch`) */
export const projectsFeaturelistsPatch: DatarobotEndpoints['projectsFeaturelistsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featurelists/{featurelistId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featurelistId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturelistsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturelistsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a feature list by project ID */
/** Official: GET /api/v2/projects/{projectId}/featurelists/{featurelistId}/ (`projectsFeaturelists_retrieve`) */
export const projectsFeaturelistsRetrieve: DatarobotEndpoints['projectsFeaturelistsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/featurelists/{featurelistId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featurelistId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturelistsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturelistsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the frequent values information by project ID */
/** Official: GET /api/v2/projects/{projectId}/features/{featureName}/frequentValues/ (`projectsFeaturesFrequentValues_list`) */
export const projectsFeaturesFrequentValuesList: DatarobotEndpoints['projectsFeaturesFrequentValuesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/features/{featureName}/frequentValues/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featureName'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturesFrequentValuesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturesFrequentValuesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List project features by project ID */
/** Official: GET /api/v2/projects/{projectId}/features/ (`projectsFeatures_list`) */
export const projectsFeaturesList: DatarobotEndpoints['projectsFeaturesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/features/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['sortBy', 'searchFor', 'featurelistId', 'forSegmentedAnalysis'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List feature metrics by project ID */
/** Official: GET /api/v2/projects/{projectId}/features/metrics/ (`projectsFeaturesMetrics_list`) */
export const projectsFeaturesMetricsList: DatarobotEndpoints['projectsFeaturesMetricsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/features/metrics/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['featureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturesMetricsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturesMetricsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve potential multiseries ID columns by project ID */
/** Official: GET /api/v2/projects/{projectId}/features/{featureName}/multiseriesProperties/ (`projectsFeaturesMultiseriesProperties_list`) */
export const projectsFeaturesMultiseriesPropertiesList: DatarobotEndpoints['projectsFeaturesMultiseriesPropertiesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/features/{featureName}/multiseriesProperties/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featureName'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturesMultiseriesPropertiesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturesMultiseriesPropertiesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a project feature by project ID */
/** Official: GET /api/v2/projects/{projectId}/features/{featureName}/ (`projectsFeatures_retrieve`) */
export const projectsFeaturesRetrieve: DatarobotEndpoints['projectsFeaturesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/features/{featureName}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featureName'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFeaturesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFeaturesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Train a frozen datetime model by project ID */
/** Official: POST /api/v2/projects/{projectId}/frozenDatetimeModels/ (`projectsFrozenDatetimeModels_create`) */
export const projectsFrozenDatetimeModelsCreate: DatarobotEndpoints['projectsFrozenDatetimeModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/frozenDatetimeModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFrozenDatetimeModelsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFrozenDatetimeModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Train a new frozen model by project ID */
/** Official: POST /api/v2/projects/{projectId}/frozenModels/ (`projectsFrozenModels_create`) */
export const projectsFrozenModelsCreate: DatarobotEndpoints['projectsFrozenModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/frozenModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFrozenModelsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFrozenModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all frozen models by project ID */
/** Official: GET /api/v2/projects/{projectId}/frozenModels/ (`projectsFrozenModels_list`) */
export const projectsFrozenModelsList: DatarobotEndpoints['projectsFrozenModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/frozenModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'withMetric'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFrozenModelsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFrozenModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Look up a particular frozen model by project ID */
/** Official: GET /api/v2/projects/{projectId}/frozenModels/{modelId}/ (`projectsFrozenModels_retrieve`) */
export const projectsFrozenModelsRetrieve: DatarobotEndpoints['projectsFrozenModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/frozenModels/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsFrozenModelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsFrozenModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a map of one location feature by project ID */
/** Official: POST /api/v2/projects/{projectId}/geometryFeaturePlots/ (`projectsGeometryFeaturePlots_create`) */
export const projectsGeometryFeaturePlotsCreate: DatarobotEndpoints['projectsGeometryFeaturePlotsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/geometryFeaturePlots/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsGeometryFeaturePlotsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsGeometryFeaturePlotsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a map of one location feature by project ID */
/** Official: GET /api/v2/projects/{projectId}/geometryFeaturePlots/{featureName}/ (`projectsGeometryFeaturePlots_retrieve`) */
export const projectsGeometryFeaturePlotsRetrieve: DatarobotEndpoints['projectsGeometryFeaturePlotsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/geometryFeaturePlots/{featureName}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featureName'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsGeometryFeaturePlotsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsGeometryFeaturePlotsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all Image Activation Maps by project ID */
/** Official: GET /api/v2/projects/{projectId}/imageActivationMaps/ (`projectsImageActivationMaps_list`) */
export const projectsImageActivationMapsList: DatarobotEndpoints['projectsImageActivationMapsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/imageActivationMaps/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImageActivationMapsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImageActivationMapsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List image bins and covers by project ID */
/** Official: GET /api/v2/projects/{projectId}/imageBins/ (`projectsImageBins_list`) */
export const projectsImageBinsList: DatarobotEndpoints['projectsImageBinsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/imageBins/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'featureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImageBinsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImageBinsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all Image Embeddings by project ID */
/** Official: GET /api/v2/projects/{projectId}/imageEmbeddings/ (`projectsImageEmbeddings_list`) */
export const projectsImageEmbeddingsList: DatarobotEndpoints['projectsImageEmbeddingsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/imageEmbeddings/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImageEmbeddingsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImageEmbeddingsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve image samples by ID */
/** Official: GET /api/v2/projects/{projectId}/imageSamples/ (`projectsImageSamples_list`) */
export const projectsImageSamplesList: DatarobotEndpoints['projectsImageSamplesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/imageSamples/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'featureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImageSamplesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImageSamplesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a text file containing the images data quality log by project ID */
/** Official: GET /api/v2/projects/{projectId}/imagesDataQualityLog/file/ (`projectsImagesDataQualityLogFile_list`) */
export const projectsImagesDataQualityLogFileList: DatarobotEndpoints['projectsImagesDataQualityLogFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/imagesDataQualityLog/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImagesDataQualityLogFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImagesDataQualityLogFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the images data quality log content by project ID */
/** Official: GET /api/v2/projects/{projectId}/imagesDataQualityLog/ (`projectsImagesDataQualityLog_list`) */
export const projectsImagesDataQualityLogList: DatarobotEndpoints['projectsImagesDataQualityLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/imagesDataQualityLog/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImagesDataQualityLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImagesDataQualityLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve file by ID */
/** Official: GET /api/v2/projects/{projectId}/images/{imageId}/file/ (`projectsImagesFile_list`) */
export const projectsImagesFileList: DatarobotEndpoints['projectsImagesFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/images/{imageId}/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'imageId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImagesFileList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImagesFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Returns a list of image metadata elements by project ID */
/** Official: GET /api/v2/projects/{projectId}/images/ (`projectsImages_list`) */
export const projectsImagesList: DatarobotEndpoints['projectsImagesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/images/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			[
				'column',
				'targetValue',
				'targetBinStart',
				'targetBinEnd',
				'offset',
				'limit',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImagesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImagesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Returns a single image metadata by project ID */
/** Official: GET /api/v2/projects/{projectId}/images/{imageId}/ (`projectsImages_retrieve`) */
export const projectsImagesRetrieve: DatarobotEndpoints['projectsImagesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/images/{imageId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'imageId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsImagesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsImagesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Train a new incremental learning model based on an existing model and external data, that was not by project ID */
/** Official: POST /api/v2/projects/{projectId}/incrementalLearningModels/fromModel/ (`projectsIncrementalLearningModelsFromModel_create`) */
export const projectsIncrementalLearningModelsFromModelCreate: DatarobotEndpoints['projectsIncrementalLearningModelsFromModelCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/incrementalLearningModels/fromModel/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsIncrementalLearningModelsFromModelCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsIncrementalLearningModelsFromModelCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Cancel a job by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/jobs/{jobId}/ (`projectsJobs_delete`) */
export const projectsJobsDelete: DatarobotEndpoints['projectsJobsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/jobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsJobsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsJobsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List project jobs by project ID */
/** Official: GET /api/v2/projects/{projectId}/jobs/ (`projectsJobs_list`) */
export const projectsJobsList: DatarobotEndpoints['projectsJobsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/projects/{projectId}/jobs/', input);
	const { query } = splitDatarobotInput(input, ['projectId'], ['status']);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.projectsJobsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.projects.projectsJobsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Get a job by project ID */
/** Official: GET /api/v2/projects/{projectId}/jobs/{jobId}/ (`projectsJobs_retrieve`) */
export const projectsJobsRetrieve: DatarobotEndpoints['projectsJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/jobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsJobsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List projects. */
/** Official: GET /api/v2/projects/ (`projects_list`) */
export const projectsList: DatarobotEndpoints['projectsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/projects/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'projectName',
			'projectId',
			'orderBy',
			'featureDiscovery',
			'offset',
			'limit',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.projectsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.projects.projectsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Cancel a modeling job by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/modelJobs/{jobId}/ (`projectsModelJobs_delete`) */
export const projectsModelJobsDelete: DatarobotEndpoints['projectsModelJobsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelJobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelJobsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelJobsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List modeling jobs by project ID */
/** Official: GET /api/v2/projects/{projectId}/modelJobs/ (`projectsModelJobs_list`) */
export const projectsModelJobsList: DatarobotEndpoints['projectsModelJobsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelJobs/',
			input,
		);
		const { query } = splitDatarobotInput(input, ['projectId'], ['status']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelJobsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelJobsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Look up a specific modeling job by project ID */
/** Official: GET /api/v2/projects/{projectId}/modelJobs/{jobId}/ (`projectsModelJobs_retrieve`) */
export const projectsModelJobsRetrieve: DatarobotEndpoints['projectsModelJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelJobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelJobsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve model records, supports filtering by project ID */
/** Official: GET /api/v2/projects/{projectId}/modelRecords/ (`projectsModelRecords_list`) */
export const projectsModelRecordsList: DatarobotEndpoints['projectsModelRecordsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelRecords/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			[
				'withMetric',
				'showInSampleScores',
				'characteristics',
				'searchTerm',
				'labels',
				'blueprints',
				'families',
				'featurelists',
				'trainingFilters',
				'numberOfClusters',
				'sortByMetric',
				'sortByPartition',
				'offset',
				'limit',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelRecordsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelRecordsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new modeling featurelist by project ID */
/** Official: POST /api/v2/projects/{projectId}/modelingFeaturelists/ (`projectsModelingFeaturelists_create`) */
export const projectsModelingFeaturelistsCreate: DatarobotEndpoints['projectsModelingFeaturelistsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelingFeaturelists/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelingFeaturelistsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a specified modeling featurelist by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/modelingFeaturelists/{featurelistId}/ (`projectsModelingFeaturelists_delete`) */
export const projectsModelingFeaturelistsDelete: DatarobotEndpoints['projectsModelingFeaturelistsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelingFeaturelists/{featurelistId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'featurelistId'],
			['dryRun', 'deleteDependencies'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelingFeaturelistsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all modeling featurelists by project ID */
/** Official: GET /api/v2/projects/{projectId}/modelingFeaturelists/ (`projectsModelingFeaturelists_list`) */
export const projectsModelingFeaturelistsList: DatarobotEndpoints['projectsModelingFeaturelistsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelingFeaturelists/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['sortBy', 'searchFor', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelingFeaturelistsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an existing modeling featurelist by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/modelingFeaturelists/{featurelistId}/ (`projectsModelingFeaturelists_patch`) */
export const projectsModelingFeaturelistsPatch: DatarobotEndpoints['projectsModelingFeaturelistsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelingFeaturelists/{featurelistId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featurelistId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelingFeaturelistsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a single modeling featurelist by ID by project ID */
/** Official: GET /api/v2/projects/{projectId}/modelingFeaturelists/{featurelistId}/ (`projectsModelingFeaturelists_retrieve`) */
export const projectsModelingFeaturelistsRetrieve: DatarobotEndpoints['projectsModelingFeaturelistsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelingFeaturelists/{featurelistId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featurelistId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelingFeaturelistsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Restore discarded time series features by project ID */
/** Official: POST /api/v2/projects/{projectId}/modelingFeatures/fromDiscardedFeatures/ (`projectsModelingFeaturesFromDiscardedFeatures_create`) */
export const projectsModelingFeaturesFromDiscardedFeaturesCreate: DatarobotEndpoints['projectsModelingFeaturesFromDiscardedFeaturesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelingFeatures/fromDiscardedFeatures/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelingFeaturesFromDiscardedFeaturesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelingFeaturesFromDiscardedFeaturesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List project modeling features by project ID */
/** Official: GET /api/v2/projects/{projectId}/modelingFeatures/ (`projectsModelingFeatures_list`) */
export const projectsModelingFeaturesList: DatarobotEndpoints['projectsModelingFeaturesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelingFeatures/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['sortBy', 'searchFor', 'featurelistId', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelingFeaturesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelingFeaturesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve project modeling feature by project ID */
/** Official: GET /api/v2/projects/{projectId}/modelingFeatures/{featureName}/ (`projectsModelingFeatures_retrieve`) */
export const projectsModelingFeaturesRetrieve: DatarobotEndpoints['projectsModelingFeaturesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/modelingFeatures/{featureName}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'featureName'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelingFeaturesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelingFeaturesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create advanced tuning by ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/advancedTuning/ (`projectsModelsAdvancedTuning_create`) */
export const projectsModelsAdvancedTuningCreate: DatarobotEndpoints['projectsModelsAdvancedTuningCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/advancedTuning/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsAdvancedTuningCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsAdvancedTuningCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve information about all advanced tuning parameters available by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/advancedTuning/parameters/ (`projectsModelsAdvancedTuningParameters_list`) */
export const projectsModelsAdvancedTuningParametersList: DatarobotEndpoints['projectsModelsAdvancedTuningParametersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/advancedTuning/parameters/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsAdvancedTuningParametersList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsAdvancedTuningParametersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Calculate the anomaly assessment insight by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/anomalyAssessmentInitialization/ (`projectsModelsAnomalyAssessmentInitialization_create`) */
export const projectsModelsAnomalyAssessmentInitializationCreate: DatarobotEndpoints['projectsModelsAnomalyAssessmentInitializationCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/anomalyAssessmentInitialization/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsAnomalyAssessmentInitializationCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsAnomalyAssessmentInitializationCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a CSV file of the raw data displayed by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/anomalyInsightsFile/ (`projectsModelsAnomalyInsightsFile_list`) */
export const projectsModelsAnomalyInsightsFileList: DatarobotEndpoints['projectsModelsAnomalyInsightsFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/anomalyInsightsFile/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['filename'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsAnomalyInsightsFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsAnomalyInsightsFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a table of the raw data displayed by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/anomalyInsightsTable/ (`projectsModelsAnomalyInsightsTable_list`) */
export const projectsModelsAnomalyInsightsTableList: DatarobotEndpoints['projectsModelsAnomalyInsightsTableList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/anomalyInsightsTable/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['anomalyScoreRounding'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsAnomalyInsightsTableList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsAnomalyInsightsTableList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a reduced model blueprint chart by model id. */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/blueprintChart/ (`projectsModelsBlueprintChart_list`) */
export const projectsModelsBlueprintChartList: DatarobotEndpoints['projectsModelsBlueprintChartList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/blueprintChart/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsBlueprintChartList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsBlueprintChartList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve task documentation by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/blueprintDocs/ (`projectsModelsBlueprintDocs_list`) */
export const projectsModelsBlueprintDocsList: DatarobotEndpoints['projectsModelsBlueprintDocsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/blueprintDocs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsBlueprintDocsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsBlueprintDocsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Compute Cluster Insights by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/clusterInsights/ (`projectsModelsClusterInsights_create`) */
export const projectsModelsClusterInsightsCreate: DatarobotEndpoints['projectsModelsClusterInsightsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/clusterInsights/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsClusterInsightsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsClusterInsightsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download Cluster Insights result by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/clusterInsights/download/ (`projectsModelsClusterInsightsDownload_list`) */
export const projectsModelsClusterInsightsDownloadList: DatarobotEndpoints['projectsModelsClusterInsightsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/clusterInsights/download/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['format', 'featurelistId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsClusterInsightsDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsClusterInsightsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Cluster Insights by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/clusterInsights/ (`projectsModelsClusterInsights_list`) */
export const projectsModelsClusterInsightsList: DatarobotEndpoints['projectsModelsClusterInsightsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/clusterInsights/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit', 'orderBy', 'searchFor'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsClusterInsightsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsClusterInsightsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve cluster names assigned by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/clusterNames/ (`projectsModelsClusterNames_list`) */
export const projectsModelsClusterNamesList: DatarobotEndpoints['projectsModelsClusterNamesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/clusterNames/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsClusterNamesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsClusterNamesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update cluster names assigned by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/models/{modelId}/clusterNames/ (`projectsModelsClusterNames_patchMany`) */
export const projectsModelsClusterNamesPatchMany: DatarobotEndpoints['projectsModelsClusterNamesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/clusterNames/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsClusterNamesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsClusterNamesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Calculates and sends frequency of class in distributed among other classes by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/confusionCharts/{source}/classDetails/ (`projectsModelsConfusionChartsClassDetails_list`) */
export const projectsModelsConfusionChartsClassDetailsList: DatarobotEndpoints['projectsModelsConfusionChartsClassDetailsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/confusionCharts/{source}/classDetails/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			['className'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsConfusionChartsClassDetailsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsConfusionChartsClassDetailsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve all available confusion charts by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/confusionCharts/ (`projectsModelsConfusionCharts_list`) */
export const projectsModelsConfusionChartsList: DatarobotEndpoints['projectsModelsConfusionChartsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/confusionCharts/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsConfusionChartsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsConfusionChartsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metadata by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/confusionCharts/{source}/metadata/ (`projectsModelsConfusionChartsMetadata_list`) */
export const projectsModelsConfusionChartsMetadataList: DatarobotEndpoints['projectsModelsConfusionChartsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/confusionCharts/{source}/metadata/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			['orderBy', 'orientation', 'thumbnailCellSize'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsConfusionChartsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsConfusionChartsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the confusion chart data by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/confusionCharts/{source}/ (`projectsModelsConfusionCharts_retrieve`) */
export const projectsModelsConfusionChartsRetrieve: DatarobotEndpoints['projectsModelsConfusionChartsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/confusionCharts/{source}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			['orderBy', 'orientation', 'rowStart', 'rowEnd', 'colStart', 'colEnd'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsConfusionChartsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsConfusionChartsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Train a new model by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/ (`projectsModels_create`) */
export const projectsModelsCreate: DatarobotEndpoints['projectsModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Start Cross Class Accuracy calculations by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/crossClassAccuracyScores/ (`projectsModelsCrossClassAccuracyScores_create`) */
export const projectsModelsCrossClassAccuracyScoresCreate: DatarobotEndpoints['projectsModelsCrossClassAccuracyScoresCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/crossClassAccuracyScores/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsCrossClassAccuracyScoresCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsCrossClassAccuracyScoresCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List Cross Class Accuracy scores by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/crossClassAccuracyScores/ (`projectsModelsCrossClassAccuracyScores_list`) */
export const projectsModelsCrossClassAccuracyScoresList: DatarobotEndpoints['projectsModelsCrossClassAccuracyScoresList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/crossClassAccuracyScores/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsCrossClassAccuracyScoresList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsCrossClassAccuracyScoresList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Run cross validation by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/crossValidation/ (`projectsModelsCrossValidation_create`) */
export const projectsModelsCrossValidationCreate: DatarobotEndpoints['projectsModelsCrossValidationCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/crossValidation/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsCrossValidationCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsCrossValidationCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get cross validation scores by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/crossValidationScores/ (`projectsModelsCrossValidationScores_list`) */
export const projectsModelsCrossValidationScoresList: DatarobotEndpoints['projectsModelsCrossValidationScoresList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/crossValidationScores/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['metric', 'partition'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsCrossValidationScoresList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsCrossValidationScoresList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Start insight calculations by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/dataDisparityInsights/ (`projectsModelsDataDisparityInsights_create`) */
export const projectsModelsDataDisparityInsightsCreate: DatarobotEndpoints['projectsModelsDataDisparityInsightsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/dataDisparityInsights/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDataDisparityInsightsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDataDisparityInsightsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get Cross Class Data Disparity results by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/dataDisparityInsights/ (`projectsModelsDataDisparityInsights_list`) */
export const projectsModelsDataDisparityInsightsList: DatarobotEndpoints['projectsModelsDataDisparityInsightsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/dataDisparityInsights/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit', 'feature', 'className1', 'className2'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDataDisparityInsightsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDataDisparityInsightsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Calculate and sends frequency of class in distributed among other classes by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/datasetConfusionCharts/{datasetId}/classDetails/ (`projectsModelsDatasetConfusionChartsClassDetails_list`) */
export const projectsModelsDatasetConfusionChartsClassDetailsList: DatarobotEndpoints['projectsModelsDatasetConfusionChartsClassDetailsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/datasetConfusionCharts/{datasetId}/classDetails/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'datasetId'],
			['className'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDatasetConfusionChartsClassDetailsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDatasetConfusionChartsClassDetailsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List of Confusion Charts objects on external datasets by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/datasetConfusionCharts/ (`projectsModelsDatasetConfusionCharts_list`) */
export const projectsModelsDatasetConfusionChartsList: DatarobotEndpoints['projectsModelsDatasetConfusionChartsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/datasetConfusionCharts/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[
				'offset',
				'limit',
				'orderBy',
				'orientation',
				'rowStart',
				'rowEnd',
				'colStart',
				'colEnd',
				'datasetId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDatasetConfusionChartsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDatasetConfusionChartsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metadata by ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/datasetConfusionCharts/{datasetId}/metadata/ (`projectsModelsDatasetConfusionChartsMetadata_list`) */
export const projectsModelsDatasetConfusionChartsMetadataList: DatarobotEndpoints['projectsModelsDatasetConfusionChartsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/datasetConfusionCharts/{datasetId}/metadata/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'datasetId'],
			['orderBy', 'orientation', 'thumbnailCellSize'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDatasetConfusionChartsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDatasetConfusionChartsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Confusion Chart objects on external datasets by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/datasetConfusionCharts/{datasetId}/ (`projectsModelsDatasetConfusionCharts_retrieve`) */
export const projectsModelsDatasetConfusionChartsRetrieve: DatarobotEndpoints['projectsModelsDatasetConfusionChartsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/datasetConfusionCharts/{datasetId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'datasetId'],
			['orderBy', 'orientation', 'rowStart', 'rowEnd', 'colStart', 'colEnd'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDatasetConfusionChartsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDatasetConfusionChartsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve List of Lift chart data on prediction datasets by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/datasetLiftCharts/ (`projectsModelsDatasetLiftCharts_list`) */
export const projectsModelsDatasetLiftChartsList: DatarobotEndpoints['projectsModelsDatasetLiftChartsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/datasetLiftCharts/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit', 'datasetId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDatasetLiftChartsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDatasetLiftChartsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve List of Multiclass Lift chart data on prediction datasets by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/datasetMulticlassLiftCharts/ (`projectsModelsDatasetMulticlassLiftCharts_list`) */
export const projectsModelsDatasetMulticlassLiftChartsList: DatarobotEndpoints['projectsModelsDatasetMulticlassLiftChartsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/datasetMulticlassLiftCharts/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit', 'datasetId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDatasetMulticlassLiftChartsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDatasetMulticlassLiftChartsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of residuals chart objects by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/datasetResidualsCharts/ (`projectsModelsDatasetResidualsCharts_list`) */
export const projectsModelsDatasetResidualsChartsList: DatarobotEndpoints['projectsModelsDatasetResidualsChartsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/datasetResidualsCharts/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit', 'datasetId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDatasetResidualsChartsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDatasetResidualsChartsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List of ROC curve objects on prediction datasets for a project with filtering option by DEPRECATED by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/datasetRocCurves/ (`projectsModelsDatasetRocCurves_list`) */
export const projectsModelsDatasetRocCurvesList: DatarobotEndpoints['projectsModelsDatasetRocCurvesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/datasetRocCurves/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit', 'datasetId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDatasetRocCurvesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDatasetRocCurvesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a model by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/models/{modelId}/ (`projectsModels_delete`) */
export const projectsModelsDelete: DatarobotEndpoints['projectsModelsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create fairness insights by ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/fairnessInsights/ (`projectsModelsFairnessInsights_create`) */
export const projectsModelsFairnessInsightsCreate: DatarobotEndpoints['projectsModelsFairnessInsightsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/fairnessInsights/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFairnessInsightsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFairnessInsightsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List calculated Per Class Bias insights by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/fairnessInsights/ (`projectsModelsFairnessInsights_list`) */
export const projectsModelsFairnessInsightsList: DatarobotEndpoints['projectsModelsFairnessInsightsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/fairnessInsights/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit', 'fairnessMetricsSet'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFairnessInsightsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFairnessInsightsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create feature effects by ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/featureEffects/ (`projectsModelsFeatureEffects_create`) */
export const projectsModelsFeatureEffectsCreate: DatarobotEndpoints['projectsModelsFeatureEffectsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/featureEffects/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFeatureEffectsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFeatureEffectsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve feature effects by ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/featureEffects/ (`projectsModelsFeatureEffects_list`) */
export const projectsModelsFeatureEffectsList: DatarobotEndpoints['projectsModelsFeatureEffectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/featureEffects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['source'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFeatureEffectsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFeatureEffectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Feature Effects metadata by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/featureEffectsMetadata/ (`projectsModelsFeatureEffectsMetadata_list`) */
export const projectsModelsFeatureEffectsMetadataList: DatarobotEndpoints['projectsModelsFeatureEffectsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/featureEffectsMetadata/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFeatureEffectsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFeatureEffectsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create feature impact by ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/featureImpact/ (`projectsModelsFeatureImpact_create`) */
export const projectsModelsFeatureImpactCreate: DatarobotEndpoints['projectsModelsFeatureImpactCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/featureImpact/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFeatureImpactCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFeatureImpactCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve feature impact scores by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/featureImpact/ (`projectsModelsFeatureImpact_list`) */
export const projectsModelsFeatureImpactList: DatarobotEndpoints['projectsModelsFeatureImpactList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/featureImpact/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['backtest'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFeatureImpactList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFeatureImpactList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve cluster insights by ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/featureLists/{datasetId}/clusterInsights/ (`projectsModelsFeatureListsClusterInsights_list`) */
export const projectsModelsFeatureListsClusterInsightsList: DatarobotEndpoints['projectsModelsFeatureListsClusterInsightsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/featureLists/{datasetId}/clusterInsights/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'datasetId'],
			['offset', 'limit', 'orderBy', 'searchFor'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFeatureListsClusterInsightsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFeatureListsClusterInsightsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List the features used by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/features/ (`projectsModelsFeatures_list`) */
export const projectsModelsFeaturesList: DatarobotEndpoints['projectsModelsFeaturesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/features/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFeaturesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFeaturesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrain a model by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/fromModel/ (`projectsModelsFromModel_create`) */
export const projectsModelsFromModelCreate: DatarobotEndpoints['projectsModelsFromModelCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/fromModel/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsFromModelCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsFromModelCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve grid search scores by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/gridSearchScores/ (`projectsModelsGridSearchScores_list`) */
export const projectsModelsGridSearchScoresList: DatarobotEndpoints['projectsModelsGridSearchScoresList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/gridSearchScores/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit', 'source'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsGridSearchScoresList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsGridSearchScoresList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request the computation of image activation maps by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/imageActivationMaps/ (`projectsModelsImageActivationMaps_create`) */
export const projectsModelsImageActivationMapsCreate: DatarobotEndpoints['projectsModelsImageActivationMapsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/imageActivationMaps/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsImageActivationMapsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsImageActivationMapsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Image Activation Maps by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/imageActivationMaps/ (`projectsModelsImageActivationMaps_list`) */
export const projectsModelsImageActivationMapsList: DatarobotEndpoints['projectsModelsImageActivationMapsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/imageActivationMaps/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['featureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsImageActivationMapsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsImageActivationMapsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request the computation of image embeddings by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/imageEmbeddings/ (`projectsModelsImageEmbeddings_create`) */
export const projectsModelsImageEmbeddingsCreate: DatarobotEndpoints['projectsModelsImageEmbeddingsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/imageEmbeddings/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsImageEmbeddingsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsImageEmbeddingsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve ImageEmbeddings by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/imageEmbeddings/ (`projectsModelsImageEmbeddings_list`) */
export const projectsModelsImageEmbeddingsList: DatarobotEndpoints['projectsModelsImageEmbeddingsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/imageEmbeddings/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['featureName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsImageEmbeddingsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsImageEmbeddingsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve labelwise ROC curves by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/labelwiseRocCurves/{source}/ (`projectsModelsLabelwiseRocCurves_list`) */
export const projectsModelsLabelwiseRocCurvesList: DatarobotEndpoints['projectsModelsLabelwiseRocCurvesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/labelwiseRocCurves/{source}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			[
				'labels',
				'searchQuery',
				'sortBy',
				'sortOrder',
				'threshold',
				'offset',
				'limit',
				'includeModelAverage',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsLabelwiseRocCurvesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsLabelwiseRocCurvesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve all available lift charts by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/liftChart/ (`projectsModelsLiftChart_list`) */
export const projectsModelsLiftChartList: DatarobotEndpoints['projectsModelsLiftChartList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/liftChart/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsLiftChartList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsLiftChartList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the lift chart data by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/liftChart/{source}/ (`projectsModelsLiftChart_retrieve`) */
export const projectsModelsLiftChartRetrieve: DatarobotEndpoints['projectsModelsLiftChartRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/liftChart/{source}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsLiftChartRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsLiftChartRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List project models by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/ (`projectsModels_list`) */
export const projectsModelsList: DatarobotEndpoints['projectsModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			[
				'withMetric',
				'showInSampleScores',
				'name',
				'samplePct',
				'isStarred',
				'orderBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an archive (tar by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/logs/ (`projectsModelsLogs_list`) */
export const projectsModelsLogsList: DatarobotEndpoints['projectsModelsLogsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/logs/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsLogsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsLogsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a summary of how the model's subtasks handle missing values by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/missingReport/ (`projectsModelsMissingReport_list`) */
export const projectsModelsMissingReportList: DatarobotEndpoints['projectsModelsMissingReportList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/missingReport/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsMissingReportList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsMissingReportList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create multiclass feature effects by ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/multiclassFeatureEffects/ (`projectsModelsMulticlassFeatureEffects_create`) */
export const projectsModelsMulticlassFeatureEffectsCreate: DatarobotEndpoints['projectsModelsMulticlassFeatureEffectsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/multiclassFeatureEffects/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassFeatureEffectsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsMulticlassFeatureEffectsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve multiclass feature effects by ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/multiclassFeatureEffects/ (`projectsModelsMulticlassFeatureEffects_list`) */
export const projectsModelsMulticlassFeatureEffectsList: DatarobotEndpoints['projectsModelsMulticlassFeatureEffectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/multiclassFeatureEffects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['source', 'offset', 'limit', 'class'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassFeatureEffectsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsMulticlassFeatureEffectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve multiclass feature impact by ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/multiclassFeatureImpact/ (`projectsModelsMulticlassFeatureImpact_list`) */
export const projectsModelsMulticlassFeatureImpactList: DatarobotEndpoints['projectsModelsMulticlassFeatureImpactList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/multiclassFeatureImpact/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassFeatureImpactList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsMulticlassFeatureImpactList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve multiclass lift chart by ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/multiclassLiftChart/ (`projectsModelsMulticlassLiftChart_list`) */
export const projectsModelsMulticlassLiftChartList: DatarobotEndpoints['projectsModelsMulticlassLiftChartList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/multiclassLiftChart/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassLiftChartList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsMulticlassLiftChartList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the multiclass lift chart data by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/multiclassLiftChart/{source}/ (`projectsModelsMulticlassLiftChart_retrieve`) */
export const projectsModelsMulticlassLiftChartRetrieve: DatarobotEndpoints['projectsModelsMulticlassLiftChartRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/multiclassLiftChart/{source}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassLiftChartRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsMulticlassLiftChartRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve labelwise lift charts by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/multilabelLiftCharts/{source}/ (`projectsModelsMultilabelLiftCharts_retrieve`) */
export const projectsModelsMultilabelLiftChartsRetrieve: DatarobotEndpoints['projectsModelsMultilabelLiftChartsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/multilabelLiftCharts/{source}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			['labels'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsMultilabelLiftChartsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsMultilabelLiftChartsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get number of iterations trained by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/numIterationsTrained/ (`projectsModelsNumIterationsTrained_list`) */
export const projectsModelsNumIterationsTrainedList: DatarobotEndpoints['projectsModelsNumIterationsTrainedList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/numIterationsTrained/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsNumIterationsTrainedList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsNumIterationsTrainedList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve model parameters by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/parameters/ (`projectsModelsParameters_list`) */
export const projectsModelsParametersList: DatarobotEndpoints['projectsModelsParametersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/parameters/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsParametersList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsParametersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a model's attributes by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/models/{modelId}/ (`projectsModels_patch`) */
export const projectsModelsPatch: DatarobotEndpoints['projectsModelsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new prediction explanations initialization by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/predictionExplanationsInitialization/ (`projectsModelsPredictionExplanationsInitialization_create`) */
export const projectsModelsPredictionExplanationsInitializationCreate: DatarobotEndpoints['projectsModelsPredictionExplanationsInitializationCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/predictionExplanationsInitialization/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPredictionExplanationsInitializationCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPredictionExplanationsInitializationCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an existing PredictionExplanationsInitialization by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/models/{modelId}/predictionExplanationsInitialization/ (`projectsModelsPredictionExplanationsInitialization_deleteMany`) */
export const projectsModelsPredictionExplanationsInitializationDeleteMany: DatarobotEndpoints['projectsModelsPredictionExplanationsInitializationDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/predictionExplanationsInitialization/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPredictionExplanationsInitializationDeleteMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPredictionExplanationsInitializationDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the current PredictionExplanationsInitialization by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/predictionExplanationsInitialization/ (`projectsModelsPredictionExplanationsInitialization_list`) */
export const projectsModelsPredictionExplanationsInitializationList: DatarobotEndpoints['projectsModelsPredictionExplanationsInitializationList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/predictionExplanationsInitialization/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['excludeAdjustedPredictions'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPredictionExplanationsInitializationList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPredictionExplanationsInitializationList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Calculate prediction intervals by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/predictionIntervals/ (`projectsModelsPredictionIntervals_create`) */
export const projectsModelsPredictionIntervalsCreate: DatarobotEndpoints['projectsModelsPredictionIntervalsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/predictionIntervals/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPredictionIntervalsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPredictionIntervalsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve prediction intervals that are already calculated by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/predictionIntervals/ (`projectsModelsPredictionIntervals_list`) */
export const projectsModelsPredictionIntervalsList: DatarobotEndpoints['projectsModelsPredictionIntervalsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/predictionIntervals/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPredictionIntervalsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPredictionIntervalsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Check a Model for Prime Eligibility by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/primeInfo/ (`projectsModelsPrimeInfo_list`) */
export const projectsModelsPrimeInfoList: DatarobotEndpoints['projectsModelsPrimeInfoList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/primeInfo/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPrimeInfoList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPrimeInfoList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Rulesets by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/primeRulesets/ (`projectsModelsPrimeRulesets_create`) */
export const projectsModelsPrimeRulesetsCreate: DatarobotEndpoints['projectsModelsPrimeRulesetsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/primeRulesets/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPrimeRulesetsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPrimeRulesetsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List rulesets by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/primeRulesets/ (`projectsModelsPrimeRulesets_list`) */
export const projectsModelsPrimeRulesetsList: DatarobotEndpoints['projectsModelsPrimeRulesetsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/primeRulesets/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsPrimeRulesetsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsPrimeRulesetsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve all residuals charts by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/residuals/ (`projectsModelsResiduals_list`) */
export const projectsModelsResidualsList: DatarobotEndpoints['projectsModelsResidualsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/residuals/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsResidualsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsResidualsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the residuals chart data by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/residuals/{source}/ (`projectsModelsResiduals_retrieve`) */
export const projectsModelsResidualsRetrieve: DatarobotEndpoints['projectsModelsResidualsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/residuals/{source}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsResidualsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsResidualsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get model by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/ (`projectsModels_retrieve`) */
export const projectsModelsRetrieve: DatarobotEndpoints['projectsModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve all available ROC curves by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/rocCurve/ (`projectsModelsRocCurve_list`) */
export const projectsModelsRocCurveList: DatarobotEndpoints['projectsModelsRocCurveList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/rocCurve/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsRocCurveList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsRocCurveList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the ROC curve data by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/rocCurve/{source}/ (`projectsModelsRocCurve_retrieve`) */
export const projectsModelsRocCurveRetrieve: DatarobotEndpoints['projectsModelsRocCurveRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/rocCurve/{source}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId', 'source'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsRocCurveRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsRocCurveRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve scoring code by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/scoringCode/ (`projectsModelsScoringCode_list`) */
export const projectsModelsScoringCodeList: DatarobotEndpoints['projectsModelsScoringCodeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/scoringCode/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['sourceCode'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsScoringCodeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsScoringCodeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create SHAP-based Feature Impact by project ID */
/** Official: POST /api/v2/projects/{projectId}/models/{modelId}/shapImpact/ (`projectsModelsShapImpact_create`) */
export const projectsModelsShapImpactCreate: DatarobotEndpoints['projectsModelsShapImpactCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/shapImpact/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsShapImpactCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsShapImpactCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Feature Impact for a model by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/shapImpact/ (`projectsModelsShapImpact_list`) */
export const projectsModelsShapImpactList: DatarobotEndpoints['projectsModelsShapImpactList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/shapImpact/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsShapImpactList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsShapImpactList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get supported capabilities by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/supportedCapabilities/ (`projectsModelsSupportedCapabilities_list`) */
export const projectsModelsSupportedCapabilitiesList: DatarobotEndpoints['projectsModelsSupportedCapabilitiesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/supportedCapabilities/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsSupportedCapabilitiesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsSupportedCapabilitiesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve training artifact by ID by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/trainingArtifact/ (`projectsModelsTrainingArtifact_list`) */
export const projectsModelsTrainingArtifactList: DatarobotEndpoints['projectsModelsTrainingArtifactList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/trainingArtifact/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsTrainingArtifactList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsTrainingArtifactList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve word cloud data by project ID */
/** Official: GET /api/v2/projects/{projectId}/models/{modelId}/wordCloud/ (`projectsModelsWordCloud_list`) */
export const projectsModelsWordCloudList: DatarobotEndpoints['projectsModelsWordCloudList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/models/{modelId}/wordCloud/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			['excludeStopWords'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsModelsWordCloudList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsModelsWordCloudList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get file by project ID */
/** Official: GET /api/v2/projects/{projectId}/multicategoricalInvalidFormat/file/ (`projectsMulticategoricalInvalidFormatFile_list`) */
export const projectsMulticategoricalInvalidFormatFileList: DatarobotEndpoints['projectsMulticategoricalInvalidFormatFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/multicategoricalInvalidFormat/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsMulticategoricalInvalidFormatFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsMulticategoricalInvalidFormatFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve multicategorical data quality log by project ID */
/** Official: GET /api/v2/projects/{projectId}/multicategoricalInvalidFormat/ (`projectsMulticategoricalInvalidFormat_list`) */
export const projectsMulticategoricalInvalidFormatList: DatarobotEndpoints['projectsMulticategoricalInvalidFormatList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/multicategoricalInvalidFormat/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsMulticategoricalInvalidFormatList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsMulticategoricalInvalidFormatList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve eligible cross-series group-by columns by project ID */
/** Official: GET /api/v2/projects/{projectId}/multiseriesIds/{multiseriesId}/crossSeriesProperties/ (`projectsMultiseriesIdsCrossSeriesProperties_list`) */
export const projectsMultiseriesIdsCrossSeriesPropertiesList: DatarobotEndpoints['projectsMultiseriesIdsCrossSeriesPropertiesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/multiseriesIds/{multiseriesId}/crossSeriesProperties/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'multiseriesId'],
			['crossSeriesGroupByColumns'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsMultiseriesIdsCrossSeriesPropertiesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsMultiseriesIdsCrossSeriesPropertiesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List the names of a multiseries project by project ID */
/** Official: GET /api/v2/projects/{projectId}/multiseriesNames/ (`projectsMultiseriesNames_list`) */
export const projectsMultiseriesNamesList: DatarobotEndpoints['projectsMultiseriesNamesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/multiseriesNames/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsMultiseriesNamesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsMultiseriesNamesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Detect multiseries properties by project ID */
/** Official: POST /api/v2/projects/{projectId}/multiseriesProperties/ (`projectsMultiseriesProperties_create`) */
export const projectsMultiseriesPropertiesCreate: DatarobotEndpoints['projectsMultiseriesPropertiesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/multiseriesProperties/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsMultiseriesPropertiesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsMultiseriesPropertiesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create an optimized datetime partitioning configuration using the target by project ID */
/** Official: POST /api/v2/projects/{projectId}/optimizedDatetimePartitionings/ (`projectsOptimizedDatetimePartitionings_create`) */
export const projectsOptimizedDatetimePartitioningsCreate: DatarobotEndpoints['projectsOptimizedDatetimePartitioningsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/optimizedDatetimePartitionings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsOptimizedDatetimePartitioningsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the optimized datetime partitioning input by project ID */
/** Official: GET /api/v2/projects/{projectId}/optimizedDatetimePartitionings/{datetimePartitioningId}/datetimePartitioningInput/ (`projectsOptimizedDatetimePartitioningsDatetimePartitioningInput_list`) */
export const projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList: DatarobotEndpoints['projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/optimizedDatetimePartitionings/{datetimePartitioningId}/datetimePartitioningInput/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'datetimePartitioningId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a text file containing the datetime partitioning log by project ID */
/** Official: GET /api/v2/projects/{projectId}/optimizedDatetimePartitionings/{datetimePartitioningId}/datetimePartitioningLog/file/ (`projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFile_list`) */
export const projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList: DatarobotEndpoints['projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/optimizedDatetimePartitionings/{datetimePartitioningId}/datetimePartitioningLog/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'datetimePartitioningId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the datetime partitioning log by project ID */
/** Official: GET /api/v2/projects/{projectId}/optimizedDatetimePartitionings/{datetimePartitioningId}/datetimePartitioningLog/ (`projectsOptimizedDatetimePartitioningsDatetimePartitioningLog_list`) */
export const projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList: DatarobotEndpoints['projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/optimizedDatetimePartitionings/{datetimePartitioningId}/datetimePartitioningLog/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'datetimePartitioningId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Lists all created optimized datetime partitioning configurations by project ID */
/** Official: GET /api/v2/projects/{projectId}/optimizedDatetimePartitionings/ (`projectsOptimizedDatetimePartitionings_list`) */
export const projectsOptimizedDatetimePartitioningsList: DatarobotEndpoints['projectsOptimizedDatetimePartitioningsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/optimizedDatetimePartitionings/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsOptimizedDatetimePartitioningsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the optimized datetime partitioning configuration by project ID */
/** Official: GET /api/v2/projects/{projectId}/optimizedDatetimePartitionings/{datetimePartitioningId}/ (`projectsOptimizedDatetimePartitionings_retrieve`) */
export const projectsOptimizedDatetimePartitioningsRetrieve: DatarobotEndpoints['projectsOptimizedDatetimePartitioningsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/optimizedDatetimePartitionings/{datetimePartitioningId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'datetimePartitioningId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsOptimizedDatetimePartitioningsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a project by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/ (`projects_patch`) */
export const projectsPatch: DatarobotEndpoints['projectsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/projects/{projectId}/', input);
	const { query, body } = splitDatarobotInput(input, ['projectId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.projectsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.projects.projectsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create a payoff matrix by project ID */
/** Official: POST /api/v2/projects/{projectId}/payoffMatrices/ (`projectsPayoffMatrices_create`) */
export const projectsPayoffMatricesCreate: DatarobotEndpoints['projectsPayoffMatricesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/payoffMatrices/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPayoffMatricesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPayoffMatricesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a payoff matrix by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/payoffMatrices/{payoffMatrixId}/ (`projectsPayoffMatrices_delete`) */
export const projectsPayoffMatricesDelete: DatarobotEndpoints['projectsPayoffMatricesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/payoffMatrices/{payoffMatrixId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'payoffMatrixId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPayoffMatricesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPayoffMatricesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all payoff matrices by project ID */
/** Official: GET /api/v2/projects/{projectId}/payoffMatrices/ (`projectsPayoffMatrices_list`) */
export const projectsPayoffMatricesList: DatarobotEndpoints['projectsPayoffMatricesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/payoffMatrices/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPayoffMatricesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPayoffMatricesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a payoff matrix by project ID */
/** Official: PUT /api/v2/projects/{projectId}/payoffMatrices/{payoffMatrixId}/ (`projectsPayoffMatrices_put`) */
export const projectsPayoffMatricesPut: DatarobotEndpoints['projectsPayoffMatricesPut'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/payoffMatrices/{payoffMatrixId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'payoffMatrixId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPayoffMatricesPut.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPayoffMatricesPut',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Cancel a queued prediction job by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/predictJobs/{jobId}/ (`projectsPredictJobs_delete`) */
export const projectsPredictJobsDelete: DatarobotEndpoints['projectsPredictJobsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictJobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictJobsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictJobsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all prediction jobs by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictJobs/ (`projectsPredictJobs_list`) */
export const projectsPredictJobsList: DatarobotEndpoints['projectsPredictJobsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictJobs/',
			input,
		);
		const { query } = splitDatarobotInput(input, ['projectId'], ['status']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictJobsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictJobsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Look up a particular prediction job by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictJobs/{jobId}/ (`projectsPredictJobs_retrieve`) */
export const projectsPredictJobsRetrieve: DatarobotEndpoints['projectsPredictJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictJobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictJobsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Upload a dataset by project ID */
/** Official: POST /api/v2/projects/{projectId}/predictionDatasets/dataSourceUploads/ (`projectsPredictionDatasetsDataSourceUploads_create`) */
export const projectsPredictionDatasetsDataSourceUploadsCreate: DatarobotEndpoints['projectsPredictionDatasetsDataSourceUploadsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionDatasets/dataSourceUploads/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsDataSourceUploadsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionDatasetsDataSourceUploadsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create prediction dataset by project ID */
/** Official: POST /api/v2/projects/{projectId}/predictionDatasets/datasetUploads/ (`projectsPredictionDatasetsDatasetUploads_create`) */
export const projectsPredictionDatasetsDatasetUploadsCreate: DatarobotEndpoints['projectsPredictionDatasetsDatasetUploadsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionDatasets/datasetUploads/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsDatasetUploadsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionDatasetsDatasetUploadsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a dataset that was uploaded by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/predictionDatasets/{datasetId}/ (`projectsPredictionDatasets_delete`) */
export const projectsPredictionDatasetsDelete: DatarobotEndpoints['projectsPredictionDatasetsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionDatasets/{datasetId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'datasetId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionDatasetsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Upload a file by project ID */
/** Official: POST /api/v2/projects/{projectId}/predictionDatasets/fileUploads/ (`projectsPredictionDatasetsFileUploads_create`) */
export const projectsPredictionDatasetsFileUploadsCreate: DatarobotEndpoints['projectsPredictionDatasetsFileUploadsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionDatasets/fileUploads/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsFileUploadsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionDatasetsFileUploadsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List prediction datasets uploaded by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictionDatasets/ (`projectsPredictionDatasets_list`) */
export const projectsPredictionDatasetsList: DatarobotEndpoints['projectsPredictionDatasetsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionDatasets/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionDatasetsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the metadata of a specific dataset by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictionDatasets/{datasetId}/ (`projectsPredictionDatasets_retrieve`) */
export const projectsPredictionDatasetsRetrieve: DatarobotEndpoints['projectsPredictionDatasetsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionDatasets/{datasetId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'datasetId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionDatasetsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create URL uploads by ID */
/** Official: POST /api/v2/projects/{projectId}/predictionDatasets/urlUploads/ (`projectsPredictionDatasetsUrlUploads_create`) */
export const projectsPredictionDatasetsUrlUploadsCreate: DatarobotEndpoints['projectsPredictionDatasetsUrlUploadsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionDatasets/urlUploads/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsUrlUploadsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionDatasetsUrlUploadsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new PredictionExplanations object ( by project ID */
/** Official: POST /api/v2/projects/{projectId}/predictionExplanations/ (`projectsPredictionExplanations_create`) */
export const projectsPredictionExplanationsCreate: DatarobotEndpoints['projectsPredictionExplanationsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionExplanations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionExplanationsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionExplanationsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve stored Prediction Explanations by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictionExplanations/{predictionExplanationsId}/ (`projectsPredictionExplanations_list`) */
export const projectsPredictionExplanationsList: DatarobotEndpoints['projectsPredictionExplanationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionExplanations/{predictionExplanationsId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'predictionExplanationsId'],
			['offset', 'limit', 'excludeAdjustedPredictions'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionExplanationsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionExplanationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete saved Prediction Explanations by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/predictionExplanationsRecords/{predictionExplanationsId}/ (`projectsPredictionExplanationsRecords_delete`) */
export const projectsPredictionExplanationsRecordsDelete: DatarobotEndpoints['projectsPredictionExplanationsRecordsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionExplanationsRecords/{predictionExplanationsId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'predictionExplanationsId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionExplanationsRecordsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionExplanationsRecordsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List PredictionExplanationsRecord objects by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictionExplanationsRecords/ (`projectsPredictionExplanationsRecords_list`) */
export const projectsPredictionExplanationsRecordsList: DatarobotEndpoints['projectsPredictionExplanationsRecordsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionExplanationsRecords/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionExplanationsRecordsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionExplanationsRecordsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a PredictionExplanationsRecord object by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictionExplanationsRecords/{predictionExplanationsId}/ (`projectsPredictionExplanationsRecords_retrieve`) */
export const projectsPredictionExplanationsRecordsRetrieve: DatarobotEndpoints['projectsPredictionExplanationsRecordsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionExplanationsRecords/{predictionExplanationsId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'predictionExplanationsId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionExplanationsRecordsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionExplanationsRecordsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Make new predictions by project ID */
/** Official: POST /api/v2/projects/{projectId}/predictions/ (`projectsPredictions_create`) */
export const projectsPredictionsCreate: DatarobotEndpoints['projectsPredictionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of prediction records by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictions/ (`projectsPredictions_list`) */
export const projectsPredictionsList: DatarobotEndpoints['projectsPredictionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'datasetId', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of prediction metadata records by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictionsMetadata/ (`projectsPredictionsMetadata_list`) */
export const projectsPredictionsMetadataList: DatarobotEndpoints['projectsPredictionsMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionsMetadata/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'predictionDatasetId', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionsMetadataList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionsMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metadata by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictionsMetadata/{predictionId}/ (`projectsPredictionsMetadata_retrieve`) */
export const projectsPredictionsMetadataRetrieve: DatarobotEndpoints['projectsPredictionsMetadataRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictionsMetadata/{predictionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'predictionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionsMetadataRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionsMetadataRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a completed set of predictions by project ID */
/** Official: GET /api/v2/projects/{projectId}/predictions/{predictionId}/ (`projectsPredictions_retrieve`) */
export const projectsPredictionsRetrieve: DatarobotEndpoints['projectsPredictionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/predictions/{predictionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'predictionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPredictionsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPredictionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a Prime File by project ID */
/** Official: POST /api/v2/projects/{projectId}/primeFiles/ (`projectsPrimeFiles_create`) */
export const projectsPrimeFilesCreate: DatarobotEndpoints['projectsPrimeFilesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/primeFiles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPrimeFilesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPrimeFilesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download code by project ID */
/** Official: GET /api/v2/projects/{projectId}/primeFiles/{primeFileId}/download/ (`projectsPrimeFilesDownload_list`) */
export const projectsPrimeFilesDownloadList: DatarobotEndpoints['projectsPrimeFilesDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/primeFiles/{primeFileId}/download/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'primeFileId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPrimeFilesDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPrimeFilesDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get Prime files by project ID */
/** Official: GET /api/v2/projects/{projectId}/primeFiles/ (`projectsPrimeFiles_list`) */
export const projectsPrimeFilesList: DatarobotEndpoints['projectsPrimeFilesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/primeFiles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit', 'parentModelId', 'modelId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPrimeFilesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPrimeFilesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve metadata about a DataRobot Prime file by project ID */
/** Official: GET /api/v2/projects/{projectId}/primeFiles/{primeFileId}/ (`projectsPrimeFiles_retrieve`) */
export const projectsPrimeFilesRetrieve: DatarobotEndpoints['projectsPrimeFilesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/primeFiles/{primeFileId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'primeFileId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPrimeFilesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPrimeFilesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a Prime Model from a Ruleset by project ID */
/** Official: POST /api/v2/projects/{projectId}/primeModels/ (`projectsPrimeModels_create`) */
export const projectsPrimeModelsCreate: DatarobotEndpoints['projectsPrimeModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/primeModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPrimeModelsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPrimeModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all Prime models by project ID */
/** Official: GET /api/v2/projects/{projectId}/primeModels/ (`projectsPrimeModels_list`) */
export const projectsPrimeModelsList: DatarobotEndpoints['projectsPrimeModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/primeModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPrimeModelsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPrimeModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Prime model details by project ID */
/** Official: GET /api/v2/projects/{projectId}/primeModels/{modelId}/ (`projectsPrimeModels_retrieve`) */
export const projectsPrimeModelsRetrieve: DatarobotEndpoints['projectsPrimeModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/primeModels/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsPrimeModelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsPrimeModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create new models by project ID */
/** Official: POST /api/v2/projects/{projectId}/ratingTableModels/ (`projectsRatingTableModels_create`) */
export const projectsRatingTableModelsCreate: DatarobotEndpoints['projectsRatingTableModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ratingTableModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRatingTableModelsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRatingTableModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List rating table models by project ID */
/** Official: GET /api/v2/projects/{projectId}/ratingTableModels/ (`projectsRatingTableModels_list`) */
export const projectsRatingTableModelsList: DatarobotEndpoints['projectsRatingTableModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ratingTableModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			[
				'withMetric',
				'showInSampleScores',
				'name',
				'samplePct',
				'isStarred',
				'orderBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRatingTableModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRatingTableModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a rating table model by project ID */
/** Official: GET /api/v2/projects/{projectId}/ratingTableModels/{modelId}/ (`projectsRatingTableModels_retrieve`) */
export const projectsRatingTableModelsRetrieve: DatarobotEndpoints['projectsRatingTableModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ratingTableModels/{modelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'modelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRatingTableModelsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRatingTableModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Upload a modified rating table file by project ID */
/** Official: POST /api/v2/projects/{projectId}/ratingTables/ (`projectsRatingTables_create`) */
export const projectsRatingTablesCreate: DatarobotEndpoints['projectsRatingTablesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ratingTables/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRatingTablesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRatingTablesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the rating table file by project ID */
/** Official: GET /api/v2/projects/{projectId}/ratingTables/{ratingTableId}/file/ (`projectsRatingTablesFile_list`) */
export const projectsRatingTablesFileList: DatarobotEndpoints['projectsRatingTablesFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ratingTables/{ratingTableId}/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'ratingTableId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRatingTablesFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRatingTablesFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List rating tables by project ID */
/** Official: GET /api/v2/projects/{projectId}/ratingTables/ (`projectsRatingTables_list`) */
export const projectsRatingTablesList: DatarobotEndpoints['projectsRatingTablesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ratingTables/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['parentModelId', 'modelId', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRatingTablesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRatingTablesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an uploaded rating table by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/ratingTables/{ratingTableId}/ (`projectsRatingTables_patch`) */
export const projectsRatingTablesPatch: DatarobotEndpoints['projectsRatingTablesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ratingTables/{ratingTableId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'ratingTableId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRatingTablesPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRatingTablesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve rating table information by project ID */
/** Official: GET /api/v2/projects/{projectId}/ratingTables/{ratingTableId}/ (`projectsRatingTables_retrieve`) */
export const projectsRatingTablesRetrieve: DatarobotEndpoints['projectsRatingTablesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ratingTables/{ratingTableId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'ratingTableId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRatingTablesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRatingTablesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List recommended models by project ID */
/** Official: GET /api/v2/projects/{projectId}/recommendedModels/ (`projectsRecommendedModels_list`) */
export const projectsRecommendedModelsList: DatarobotEndpoints['projectsRecommendedModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/recommendedModels/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRecommendedModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRecommendedModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the recommended model by project ID */
/** Official: GET /api/v2/projects/{projectId}/recommendedModels/recommendedModel/ (`projectsRecommendedModelsRecommendedModel_list`) */
export const projectsRecommendedModelsRecommendedModelList: DatarobotEndpoints['projectsRecommendedModelsRecommendedModelList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/recommendedModels/recommendedModel/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRecommendedModelsRecommendedModelList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRecommendedModelsRecommendedModelList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Submit a relationship quality assessment job by project ID */
/** Official: POST /api/v2/projects/{projectId}/relationshipQualityAssessments/ (`projectsRelationshipQualityAssessments_create`) */
export const projectsRelationshipQualityAssessmentsCreate: DatarobotEndpoints['projectsRelationshipQualityAssessmentsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/relationshipQualityAssessments/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRelationshipQualityAssessmentsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRelationshipQualityAssessmentsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve relationships configuration by project ID */
/** Official: GET /api/v2/projects/{projectId}/relationshipsConfiguration/ (`projectsRelationshipsConfiguration_list`) */
export const projectsRelationshipsConfigurationList: DatarobotEndpoints['projectsRelationshipsConfigurationList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/relationshipsConfiguration/',
			input,
		);
		const { query } = splitDatarobotInput(input, ['projectId'], ['configId']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRelationshipsConfigurationList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRelationshipsConfigurationList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get project by project ID */
/** Official: GET /api/v2/projects/{projectId}/ (`projects_retrieve`) */
export const projectsRetrieve: DatarobotEndpoints['projectsRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/projects/{projectId}/', input);
	const { query, body } = splitDatarobotInput(input, ['projectId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.projectsRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.projects.projectsRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create a RuleFit code file by project ID */
/** Official: POST /api/v2/projects/{projectId}/ruleFitFiles/ (`projectsRuleFitFiles_create`) */
export const projectsRuleFitFilesCreate: DatarobotEndpoints['projectsRuleFitFilesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ruleFitFiles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRuleFitFilesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRuleFitFilesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download RuleFit code by project ID */
/** Official: GET /api/v2/projects/{projectId}/ruleFitFiles/{ruleFitFileId}/download/ (`projectsRuleFitFilesDownload_list`) */
export const projectsRuleFitFilesDownloadList: DatarobotEndpoints['projectsRuleFitFilesDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ruleFitFiles/{ruleFitFileId}/download/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'ruleFitFileId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRuleFitFilesDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRuleFitFilesDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get RuleFit code files by project ID */
/** Official: GET /api/v2/projects/{projectId}/ruleFitFiles/ (`projectsRuleFitFiles_list`) */
export const projectsRuleFitFilesList: DatarobotEndpoints['projectsRuleFitFilesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ruleFitFiles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['modelId', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRuleFitFilesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRuleFitFilesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get RuleFit code file information by project ID */
/** Official: GET /api/v2/projects/{projectId}/ruleFitFiles/{ruleFitFileId}/ (`projectsRuleFitFiles_retrieve`) */
export const projectsRuleFitFilesRetrieve: DatarobotEndpoints['projectsRuleFitFilesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/ruleFitFiles/{ruleFitFileId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'ruleFitFileId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsRuleFitFilesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsRuleFitFilesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create secondary dataset configurations by project ID */
/** Official: POST /api/v2/projects/{projectId}/secondaryDatasetsConfigurations/ (`projectsSecondaryDatasetsConfigurations_create`) */
export const projectsSecondaryDatasetsConfigurationsCreate: DatarobotEndpoints['projectsSecondaryDatasetsConfigurationsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/secondaryDatasetsConfigurations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSecondaryDatasetsConfigurationsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSecondaryDatasetsConfigurationsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Soft-delete a secondary dataset configuration by project ID */
/** Official: DELETE /api/v2/projects/{projectId}/secondaryDatasetsConfigurations/{secondaryDatasetConfigId}/ (`projectsSecondaryDatasetsConfigurations_delete`) */
export const projectsSecondaryDatasetsConfigurationsDelete: DatarobotEndpoints['projectsSecondaryDatasetsConfigurationsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/secondaryDatasetsConfigurations/{secondaryDatasetConfigId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'secondaryDatasetConfigId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSecondaryDatasetsConfigurationsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSecondaryDatasetsConfigurationsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all secondary dataset configurations by project ID */
/** Official: GET /api/v2/projects/{projectId}/secondaryDatasetsConfigurations/ (`projectsSecondaryDatasetsConfigurations_list`) */
export const projectsSecondaryDatasetsConfigurationsList: DatarobotEndpoints['projectsSecondaryDatasetsConfigurationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/secondaryDatasetsConfigurations/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['featurelistId', 'modelId', 'offset', 'limit', 'includeDeleted'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSecondaryDatasetsConfigurationsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSecondaryDatasetsConfigurationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve secondary dataset configuration by ID by project ID */
/** Official: GET /api/v2/projects/{projectId}/secondaryDatasetsConfigurations/{secondaryDatasetConfigId}/ (`projectsSecondaryDatasetsConfigurations_retrieve`) */
export const projectsSecondaryDatasetsConfigurationsRetrieve: DatarobotEndpoints['projectsSecondaryDatasetsConfigurationsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/secondaryDatasetsConfigurations/{secondaryDatasetConfigId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'secondaryDatasetConfigId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSecondaryDatasetsConfigurationsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSecondaryDatasetsConfigurationsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update champion model by project ID */
/** Official: PUT /api/v2/projects/{projectId}/segmentChampion/ (`projectsSegmentChampion_putMany`) */
export const projectsSegmentChampionPutMany: DatarobotEndpoints['projectsSegmentChampionPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/segmentChampion/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSegmentChampionPutMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSegmentChampionPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve segmentation task statuses by project ID */
/** Official: GET /api/v2/projects/{projectId}/segmentationTaskJobResults/{segmentationTaskId}/ (`projectsSegmentationTaskJobResults_retrieve`) */
export const projectsSegmentationTaskJobResultsRetrieve: DatarobotEndpoints['projectsSegmentationTaskJobResultsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/segmentationTaskJobResults/{segmentationTaskId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'segmentationTaskId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSegmentationTaskJobResultsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSegmentationTaskJobResultsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create segmentation tasks by project ID */
/** Official: POST /api/v2/projects/{projectId}/segmentationTasks/ (`projectsSegmentationTasks_create`) */
export const projectsSegmentationTasksCreate: DatarobotEndpoints['projectsSegmentationTasksCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/segmentationTasks/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSegmentationTasksCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSegmentationTasksCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List segmentation tasks by project ID */
/** Official: GET /api/v2/projects/{projectId}/segmentationTasks/ (`projectsSegmentationTasks_list`) */
export const projectsSegmentationTasksList: DatarobotEndpoints['projectsSegmentationTasksList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/segmentationTasks/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSegmentationTasksList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSegmentationTasksList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve series ID by project ID */
/** Official: GET /api/v2/projects/{projectId}/segmentationTasks/{segmentationTaskId}/mappings/ (`projectsSegmentationTasksMappings_list`) */
export const projectsSegmentationTasksMappingsList: DatarobotEndpoints['projectsSegmentationTasksMappingsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/segmentationTasks/{segmentationTaskId}/mappings/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId', 'segmentationTaskId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSegmentationTasksMappingsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSegmentationTasksMappingsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve segmentation task by project ID */
/** Official: GET /api/v2/projects/{projectId}/segmentationTasks/{segmentationTaskId}/ (`projectsSegmentationTasks_retrieve`) */
export const projectsSegmentationTasksRetrieve: DatarobotEndpoints['projectsSegmentationTasksRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/segmentationTasks/{segmentationTaskId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'segmentationTaskId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSegmentationTasksRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSegmentationTasksRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update child segment project by project ID */
/** Official: PATCH /api/v2/projects/{projectId}/segments/{segmentId}/ (`projectsSegments_patch`) */
export const projectsSegmentsPatch: DatarobotEndpoints['projectsSegmentsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/segments/{segmentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'segmentId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsSegmentsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsSegmentsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Calculate a matrix with SHAP-based prediction explanations scores by project ID */
/** Official: POST /api/v2/projects/{projectId}/shapMatrices/ (`projectsShapMatrices_create`) */
export const projectsShapMatricesCreate: DatarobotEndpoints['projectsShapMatricesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/shapMatrices/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsShapMatricesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsShapMatricesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List SHAP matrix records by project ID */
/** Official: GET /api/v2/projects/{projectId}/shapMatrices/ (`projectsShapMatrices_list`) */
export const projectsShapMatricesList: DatarobotEndpoints['projectsShapMatricesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/shapMatrices/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsShapMatricesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsShapMatricesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Return matrix with SHAP-based prediction explanations scores by project ID */
/** Official: GET /api/v2/projects/{projectId}/shapMatrices/{shapMatrixId}/ (`projectsShapMatrices_retrieve`) */
export const projectsShapMatricesRetrieve: DatarobotEndpoints['projectsShapMatricesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/shapMatrices/{shapMatrixId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['projectId', 'shapMatrixId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsShapMatricesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsShapMatricesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Check project status by project ID */
/** Official: GET /api/v2/projects/{projectId}/status/ (`projectsStatus_list`) */
export const projectsStatusList: DatarobotEndpoints['projectsStatusList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/status/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsStatusList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsStatusList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a text file containing the time series project feature log by project ID */
/** Official: GET /api/v2/projects/{projectId}/timeSeriesFeatureLog/file/ (`projectsTimeSeriesFeatureLogFile_list`) */
export const projectsTimeSeriesFeatureLogFileList: DatarobotEndpoints['projectsTimeSeriesFeatureLogFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/timeSeriesFeatureLog/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsTimeSeriesFeatureLogFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsTimeSeriesFeatureLogFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the feature derivation log content and log length by project ID */
/** Official: GET /api/v2/projects/{projectId}/timeSeriesFeatureLog/ (`projectsTimeSeriesFeatureLog_list`) */
export const projectsTimeSeriesFeatureLogList: DatarobotEndpoints['projectsTimeSeriesFeatureLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/timeSeriesFeatureLog/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsTimeSeriesFeatureLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsTimeSeriesFeatureLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Submits a job by project ID */
/** Official: POST /api/v2/projects/{projectId}/trainingPredictions/ (`projectsTrainingPredictions_create`) */
export const projectsTrainingPredictionsCreate: DatarobotEndpoints['projectsTrainingPredictionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/trainingPredictions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsTrainingPredictionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsTrainingPredictionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new feature by changing the type of an existing one by project ID */
/** Official: POST /api/v2/projects/{projectId}/typeTransformFeatures/ (`projectsTypeTransformFeatures_create`) */
export const projectsTypeTransformFeaturesCreate: DatarobotEndpoints['projectsTypeTransformFeaturesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/typeTransformFeatures/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['projectId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.projectsTypeTransformFeaturesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.projects.projectsTypeTransformFeaturesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List training prediction jobs by project ID */
/** Official: GET /api/v2/projects/{projectId}/trainingPredictions/ (`trainingPredictions_list`) */
export const trainingPredictionsList: DatarobotEndpoints['trainingPredictionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/projects/{projectId}/trainingPredictions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['projectId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.trainingPredictionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.projects.trainingPredictionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
