import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get a list of users who have access by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/accessControl/ (`customModelsAccessControl_list`) */
export const customModelsAccessControlList: DatarobotEndpoints['customModelsAccessControlList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/accessControl/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customModelId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsAccessControlList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsAccessControlList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Grant access or update roles by custom model ID */
/** Official: PATCH /api/v2/customModels/{customModelId}/accessControl/ (`customModelsAccessControl_patchMany`) */
export const customModelsAccessControlPatchMany: DatarobotEndpoints['customModelsAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create custom model. */
/** Official: POST /api/v2/customModels/ (`customModels_create`) */
export const customModelsCreate: DatarobotEndpoints['customModelsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/customModels/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete custom model by custom model ID */
/** Official: DELETE /api/v2/customModels/{customModelId}/ (`customModels_delete`) */
export const customModelsDelete: DatarobotEndpoints['customModelsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download the latest custom model version content by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/download/ (`customModelsDownload_list`) */
export const customModelsDownloadList: DatarobotEndpoints['customModelsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/download/',
			input,
		);
		const { query } = splitDatarobotInput(input, ['customModelId'], ['pps']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsDownloadList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Clone custom model. */
/** Official: POST /api/v2/customModels/fromCustomModel/ (`customModelsFromCustomModel_create`) */
export const customModelsFromCustomModelCreate: DatarobotEndpoints['customModelsFromCustomModelCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/fromCustomModel/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsFromCustomModelCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsFromCustomModelCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a custom model */
/** Official: POST /api/v2/customModels/fromModelTemplate/ (`customModelsFromModelTemplate_create`) */
export const customModelsFromModelTemplateCreate: DatarobotEndpoints['customModelsFromModelTemplateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/fromModelTemplate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsFromModelTemplateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsFromModelTemplateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom models. */
/** Official: GET /api/v2/customModels/ (`customModels_list`) */
export const customModelsList: DatarobotEndpoints['customModelsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/customModels/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'customModelType',
			'targetType',
			'isDeployed',
			'orderBy',
			'searchFor',
			'tagKeys',
			'tagValues',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.customModelsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.customModels.customModelsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update custom model by custom model ID */
/** Official: PATCH /api/v2/customModels/{customModelId}/ (`customModels_patch`) */
export const customModelsPatch: DatarobotEndpoints['customModelsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new prediction explanations initialization */
/** Official: POST /api/v2/customModels/predictionExplanationsInitialization/ (`customModelsPredictionExplanationsInitialization_create`) */
export const customModelsPredictionExplanationsInitializationCreate: DatarobotEndpoints['customModelsPredictionExplanationsInitializationCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/predictionExplanationsInitialization/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsPredictionExplanationsInitializationCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsPredictionExplanationsInitializationCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get custom model by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/ (`customModels_retrieve`) */
export const customModelsRetrieve: DatarobotEndpoints['customModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Assign training data by custom model ID */
/** Official: PATCH /api/v2/customModels/{customModelId}/trainingData/ (`customModelsTrainingData_patchMany`) */
export const customModelsTrainingDataPatchMany: DatarobotEndpoints['customModelsTrainingDataPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/trainingData/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsTrainingDataPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsTrainingDataPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update custom model version files by custom model ID */
/** Official: PATCH /api/v2/customModels/{customModelId}/versions/ (`customModelsVersion_createFromLatest`) */
export const customModelsVersionCreateFromLatest: DatarobotEndpoints['customModelsVersionCreateFromLatest'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionCreateFromLatest.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionCreateFromLatest',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Generates JAR file by custom model ID */
/** Official: POST /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/conversions/ (`customModelsVersionsConversions_create`) */
export const customModelsVersionsConversionsCreate: DatarobotEndpoints['customModelsVersionsConversionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/conversions/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsConversionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsConversionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Stop a given custom model conversion by custom model ID */
/** Official: DELETE /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/conversions/{conversionId}/ (`customModelsVersionsConversions_delete`) */
export const customModelsVersionsConversionsDelete: DatarobotEndpoints['customModelsVersionsConversionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/conversions/{conversionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId', 'conversionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsConversionsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsConversionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/conversions/ (`customModelsVersionsConversions_list`) */
export const customModelsVersionsConversionsList: DatarobotEndpoints['customModelsVersionsConversionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/conversions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			['offset', 'limit', 'isLatest'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsConversionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsConversionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a given custom model conversion by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/conversions/{conversionId}/ (`customModelsVersionsConversions_retrieve`) */
export const customModelsVersionsConversionsRetrieve: DatarobotEndpoints['customModelsVersionsConversionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/conversions/{conversionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId', 'conversionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsConversionsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsConversionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create custom model version by custom model ID */
/** Official: POST /api/v2/customModels/{customModelId}/versions/ (`customModelsVersions_create`) */
export const customModelsVersionsCreate: DatarobotEndpoints['customModelsVersionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Start a custom model version's dependency build by custom model ID */
/** Official: POST /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/dependencyBuild/ (`customModelsVersionsDependencyBuild_create`) */
export const customModelsVersionsDependencyBuildCreate: DatarobotEndpoints['customModelsVersionsDependencyBuildCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/dependencyBuild/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsDependencyBuildCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsDependencyBuildCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Cancel dependency build by custom model ID */
/** Official: DELETE /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/dependencyBuild/ (`customModelsVersionsDependencyBuild_deleteMany`) */
export const customModelsVersionsDependencyBuildDeleteMany: DatarobotEndpoints['customModelsVersionsDependencyBuildDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/dependencyBuild/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsDependencyBuildDeleteMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsDependencyBuildDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the custom model version's dependency build status by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/dependencyBuild/ (`customModelsVersionsDependencyBuild_list`) */
export const customModelsVersionsDependencyBuildList: DatarobotEndpoints['customModelsVersionsDependencyBuildList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/dependencyBuild/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsDependencyBuildList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsDependencyBuildList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the custom model version's dependency build log by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/dependencyBuildLog/ (`customModelsVersionsDependencyBuildLog_list`) */
export const customModelsVersionsDependencyBuildLogList: DatarobotEndpoints['customModelsVersionsDependencyBuildLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/dependencyBuildLog/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsDependencyBuildLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsDependencyBuildLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download custom model version content by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/download/ (`customModelsVersionsDownload_list`) */
export const customModelsVersionsDownloadList: DatarobotEndpoints['customModelsVersionsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/download/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			['pps'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create custom model feature impact by custom model ID */
/** Official: POST /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/featureImpact/ (`customModelsVersionsFeatureImpact_create`) */
export const customModelsVersionsFeatureImpactCreate: DatarobotEndpoints['customModelsVersionsFeatureImpactCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/featureImpact/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsFeatureImpactCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsFeatureImpactCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get custom model feature impact by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/featureImpact/ (`customModelsVersionsFeatureImpact_list`) */
export const customModelsVersionsFeatureImpactList: DatarobotEndpoints['customModelsVersionsFeatureImpactList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/featureImpact/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsFeatureImpactList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsFeatureImpactList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new custom model version by custom model ID */
/** Official: POST /api/v2/customModels/{customModelId}/versions/fromCodespace/ (`customModelsVersionsFromCodespace_create`) */
export const customModelsVersionsFromCodespaceCreate: DatarobotEndpoints['customModelsVersionsFromCodespaceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/fromCodespace/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsFromCodespaceCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsFromCodespaceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a repository */
/** Official: POST /api/v2/customModels/{customModelId}/versions/fromRepository/ (`customModelsVersionsFromRepository_create`) */
export const customModelsVersionsFromRepositoryCreate: DatarobotEndpoints['customModelsVersionsFromRepositoryCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/fromRepository/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsFromRepositoryCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsFromRepositoryCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create custom model version from remote repository by custom model ID */
/** Official: PATCH /api/v2/customModels/{customModelId}/versions/fromRepository/ (`customModelsVersionsFromRepository_patchMany`) */
export const customModelsVersionsFromRepositoryPatchMany: DatarobotEndpoints['customModelsVersionsFromRepositoryPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/fromRepository/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsFromRepositoryPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsFromRepositoryPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom model versions by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/versions/ (`customModelsVersions_list`) */
export const customModelsVersionsList: DatarobotEndpoints['customModelsVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customModelId'],
			['offset', 'limit', 'mainBranchCommitSha'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update custom model version by custom model ID */
/** Official: PATCH /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/ (`customModelsVersions_patch`) */
export const customModelsVersionsPatch: DatarobotEndpoints['customModelsVersionsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a new prediction explanations initialization by custom model ID */
/** Official: POST /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/predictionExplanationsInitialization/ (`customModelsVersionsPredictionExplanationsInitialization_create`) */
export const customModelsVersionsPredictionExplanationsInitializationCreate: DatarobotEndpoints['customModelsVersionsPredictionExplanationsInitializationCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/predictionExplanationsInitialization/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsPredictionExplanationsInitializationCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsPredictionExplanationsInitializationCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get custom model version by custom model ID */
/** Official: GET /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/ (`customModelsVersions_retrieve`) */
export const customModelsVersionsRetrieve: DatarobotEndpoints['customModelsVersionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a codespace by custom model ID */
/** Official: POST /api/v2/customModels/{customModelId}/versions/{customModelVersionId}/toCodespace/ (`customModelsVersionsToCodespace_create`) */
export const customModelsVersionsToCodespaceCreate: DatarobotEndpoints['customModelsVersionsToCodespaceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/{customModelVersionId}/toCodespace/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customModelId', 'customModelVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsToCodespaceCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsToCodespaceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Add or replace training and holdout data by custom model ID */
/** Official: PATCH /api/v2/customModels/{customModelId}/versions/withTrainingData/ (`customModelsVersionsWithTrainingData_patchMany`) */
export const customModelsVersionsWithTrainingDataPatchMany: DatarobotEndpoints['customModelsVersionsWithTrainingDataPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customModels/{customModelId}/versions/withTrainingData/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customModelId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customModelsVersionsWithTrainingDataPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customModels.customModelsVersionsWithTrainingDataPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
