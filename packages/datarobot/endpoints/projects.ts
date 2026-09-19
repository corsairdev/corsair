import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

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
