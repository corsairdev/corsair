import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** List dataset access by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/accessControl/ (`datasetsAccessControl_list`) */
export const datasetsAccessControlList: DatarobotEndpoints['datasetsAccessControlList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/accessControl/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['userId', 'username', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsAccessControlList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsAccessControlList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify dataset access by dataset ID */
/** Official: PATCH /api/v2/datasets/{datasetId}/accessControl/ (`datasetsAccessControl_patchMany`) */
export const datasetsAccessControlPatchMany: DatarobotEndpoints['datasetsAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get dataset features by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/allFeaturesDetails/ (`datasetsAllFeaturesDetails_list`) */
export const datasetsAllFeaturesDetailsList: DatarobotEndpoints['datasetsAllFeaturesDetailsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/allFeaturesDetails/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			[
				'limit',
				'offset',
				'orderBy',
				'includePlot',
				'searchFor',
				'featurelistId',
				'includeDataQuality',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsAllFeaturesDetailsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsAllFeaturesDetailsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete dataset by dataset ID */
/** Official: DELETE /api/v2/datasets/{datasetId}/ (`datasets_delete`) */
export const datasetsDelete: DatarobotEndpoints['datasetsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/{datasetId}/', input);
	const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.datasetsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Recover deleted dataset by dataset ID */
/** Official: PATCH /api/v2/datasets/{datasetId}/deleted/ (`datasetsDeleted_patchMany`) */
export const datasetsDeletedPatchMany: DatarobotEndpoints['datasetsDeletedPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/deleted/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsDeletedPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsDeletedPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a text file containing the documents data quality log by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/documentsDataQualityLog/file/ (`datasetsDocumentsDataQualityLogFile_list`) */
export const datasetsDocumentsDataQualityLogFileList: DatarobotEndpoints['datasetsDocumentsDataQualityLogFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/documentsDataQualityLog/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsDocumentsDataQualityLogFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsDocumentsDataQualityLogFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the documents data quality log content by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/documentsDataQualityLog/ (`datasetsDocumentsDataQualityLog_list`) */
export const datasetsDocumentsDataQualityLogList: DatarobotEndpoints['datasetsDocumentsDataQualityLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/documentsDataQualityLog/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsDocumentsDataQualityLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsDocumentsDataQualityLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get dataset feature histogram by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/featureHistograms/{featureName}/ (`datasetsFeatureHistograms_retrieve`) */
export const datasetsFeatureHistogramsRetrieve: DatarobotEndpoints['datasetsFeatureHistogramsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featureHistograms/{featureName}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId', 'featureName'],
			['binLimit', 'key', 'usePlot2'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeatureHistogramsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeatureHistogramsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create dataset feature transform by dataset ID */
/** Official: POST /api/v2/datasets/{datasetId}/featureTransforms/ (`datasetsFeatureTransforms_create`) */
export const datasetsFeatureTransformsCreate: DatarobotEndpoints['datasetsFeatureTransformsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featureTransforms/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeatureTransformsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeatureTransformsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List dataset feature transforms by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/featureTransforms/ (`datasetsFeatureTransforms_list`) */
export const datasetsFeatureTransformsList: DatarobotEndpoints['datasetsFeatureTransformsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featureTransforms/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['limit', 'offset'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeatureTransformsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeatureTransformsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get dataset feature transform by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/featureTransforms/{featureName}/ (`datasetsFeatureTransforms_retrieve`) */
export const datasetsFeatureTransformsRetrieve: DatarobotEndpoints['datasetsFeatureTransformsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featureTransforms/{featureName}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'featureName'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeatureTransformsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeatureTransformsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create dataset featurelist by dataset ID */
/** Official: POST /api/v2/datasets/{datasetId}/featurelists/ (`datasetsFeaturelists_create`) */
export const datasetsFeaturelistsCreate: DatarobotEndpoints['datasetsFeaturelistsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featurelists/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeaturelistsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeaturelistsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete dataset featurelist by dataset ID */
/** Official: DELETE /api/v2/datasets/{datasetId}/featurelists/{featurelistId}/ (`datasetsFeaturelists_delete`) */
export const datasetsFeaturelistsDelete: DatarobotEndpoints['datasetsFeaturelistsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featurelists/{featurelistId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'featurelistId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeaturelistsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeaturelistsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve dataset featurelists by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/featurelists/ (`datasetsFeaturelists_list`) */
export const datasetsFeaturelistsList: DatarobotEndpoints['datasetsFeaturelistsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featurelists/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['limit', 'offset', 'orderBy', 'searchFor'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeaturelistsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeaturelistsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update dataset featurelist by dataset ID */
/** Official: PATCH /api/v2/datasets/{datasetId}/featurelists/{featurelistId}/ (`datasetsFeaturelists_patch`) */
export const datasetsFeaturelistsPatch: DatarobotEndpoints['datasetsFeaturelistsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featurelists/{featurelistId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'featurelistId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeaturelistsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeaturelistsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get dataset featurelist by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/featurelists/{featurelistId}/ (`datasetsFeaturelists_retrieve`) */
export const datasetsFeaturelistsRetrieve: DatarobotEndpoints['datasetsFeaturelistsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/featurelists/{featurelistId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'featurelistId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFeaturelistsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFeaturelistsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve original dataset data by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/file/ (`datasetsFile_list`) */
export const datasetsFileList: DatarobotEndpoints['datasetsFileList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/{datasetId}/file/', input);
	const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.datasetsFileList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsFileList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create dataset */
/** Official: POST /api/v2/datasets/fromDataEngineWorkspaceState/ (`datasetsFromDataEngineWorkspaceState_create`) */
export const datasetsFromDataEngineWorkspaceStateCreate: DatarobotEndpoints['datasetsFromDataEngineWorkspaceStateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/fromDataEngineWorkspaceState/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromDataEngineWorkspaceStateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromDataEngineWorkspaceStateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a dataset from a data source */
/** Official: POST /api/v2/datasets/fromDataSource/ (`datasetsFromDataSource_create`) */
export const datasetsFromDataSourceCreate: DatarobotEndpoints['datasetsFromDataSourceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromDataSource/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromDataSourceCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromDataSourceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a dataset from a file */
/** Official: POST /api/v2/datasets/fromFile/ (`datasetsFromFile_create`) */
export const datasetsFromFileCreate: DatarobotEndpoints['datasetsFromFileCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromFile/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromFileCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromFileCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a dataset from a hdfs */
/** Official: POST /api/v2/datasets/fromHDFS/ (`datasetsFromHDFS_create`) */
export const datasetsFromHDFSCreate: DatarobotEndpoints['datasetsFromHDFSCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromHDFS/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromHDFSCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromHDFSCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a dataset from a recipe */
/** Official: POST /api/v2/datasets/fromRecipe/ (`datasetsFromRecipe_create`) */
export const datasetsFromRecipeCreate: DatarobotEndpoints['datasetsFromRecipeCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromRecipe/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromRecipeCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromRecipeCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a dataset from a stage */
/** Official: POST /api/v2/datasets/fromStage/ (`datasetsFromStage_create`) */
export const datasetsFromStageCreate: DatarobotEndpoints['datasetsFromStageCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromStage/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromStageCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromStageCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a dataset from an URL */
/** Official: POST /api/v2/datasets/fromURL/ (`datasetsFromURL_create`) */
export const datasetsFromURLCreate: DatarobotEndpoints['datasetsFromURLCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/fromURL/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsFromURLCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsFromURLCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a text file containing the images data quality log by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/imagesDataQualityLog/file/ (`datasetsImagesDataQualityLogFile_list`) */
export const datasetsImagesDataQualityLogFileList: DatarobotEndpoints['datasetsImagesDataQualityLogFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/imagesDataQualityLog/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsImagesDataQualityLogFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsImagesDataQualityLogFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the images data quality log content by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/imagesDataQualityLog/ (`datasetsImagesDataQualityLog_list`) */
export const datasetsImagesDataQualityLogList: DatarobotEndpoints['datasetsImagesDataQualityLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/imagesDataQualityLog/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsImagesDataQualityLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsImagesDataQualityLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List datasets */
/** Official: GET /api/v2/datasets/ (`datasets_list`) */
export const datasetsList: DatarobotEndpoints['datasetsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'category',
			'orderBy',
			'limit',
			'offset',
			'filterFailed',
			'datasetVersionIds',
			'useCaseIds',
			'vectorDatabaseEligibleOnly',
			'vectorDatabaseMetadataEligibleOnly',
			'isDeleted',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.datasetsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Modify dataset by dataset ID */
/** Official: PATCH /api/v2/datasets/{datasetId}/ (`datasets_patch`) */
export const datasetsPatch: DatarobotEndpoints['datasetsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/{datasetId}/', input);
	const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.datasetsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Execute bulk dataset action */
/** Official: PATCH /api/v2/datasets/ (`datasets_patchMany`) */
export const datasetsPatchMany: DatarobotEndpoints['datasetsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/datasets/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Describe dataset permissions by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/permissions/ (`datasetsPermissions_list`) */
export const datasetsPermissionsList: DatarobotEndpoints['datasetsPermissionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/permissions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsPermissionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsPermissionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get dataset projects by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/projects/ (`datasetsProjects_list`) */
export const datasetsProjectsList: DatarobotEndpoints['datasetsProjectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/projects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['limit', 'offset'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsProjectsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsProjectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Schedule dataset refresh by dataset ID */
/** Official: POST /api/v2/datasets/{datasetId}/refreshJobs/ (`datasetsRefreshJobs_create`) */
export const datasetsRefreshJobsCreate: DatarobotEndpoints['datasetsRefreshJobsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/refreshJobs/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRefreshJobsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRefreshJobsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Deletes an existing dataset refresh job by dataset ID */
/** Official: DELETE /api/v2/datasets/{datasetId}/refreshJobs/{jobId}/ (`datasetsRefreshJobs_delete`) */
export const datasetsRefreshJobsDelete: DatarobotEndpoints['datasetsRefreshJobsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/refreshJobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRefreshJobsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRefreshJobsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Results of dataset refresh job by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/refreshJobs/{jobId}/executionResults/ (`datasetsRefreshJobsExecutionResults_list`) */
export const datasetsRefreshJobsExecutionResultsList: DatarobotEndpoints['datasetsRefreshJobsExecutionResultsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/refreshJobs/{jobId}/executionResults/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId', 'jobId'],
			['limit', 'offset'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRefreshJobsExecutionResultsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRefreshJobsExecutionResultsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Information about scheduled jobs by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/refreshJobs/ (`datasetsRefreshJobs_list`) */
export const datasetsRefreshJobsList: DatarobotEndpoints['datasetsRefreshJobsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/refreshJobs/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['limit', 'offset'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRefreshJobsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRefreshJobsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a dataset refresh job by dataset ID */
/** Official: PATCH /api/v2/datasets/{datasetId}/refreshJobs/{jobId}/ (`datasetsRefreshJobs_patch`) */
export const datasetsRefreshJobsPatch: DatarobotEndpoints['datasetsRefreshJobsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/refreshJobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRefreshJobsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRefreshJobsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Gets configuration of a user scheduled dataset refresh job by job ID */
/** Official: GET /api/v2/datasets/{datasetId}/refreshJobs/{jobId}/ (`datasetsRefreshJobs_retrieve`) */
export const datasetsRefreshJobsRetrieve: DatarobotEndpoints['datasetsRefreshJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/refreshJobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'jobId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRefreshJobsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRefreshJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create dataset relationship by dataset ID */
/** Official: POST /api/v2/datasets/{datasetId}/relationships/ (`datasetsRelationships_create`) */
export const datasetsRelationshipsCreate: DatarobotEndpoints['datasetsRelationshipsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/relationships/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRelationshipsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRelationshipsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete dataset relationship by dataset ID */
/** Official: DELETE /api/v2/datasets/{datasetId}/relationships/{datasetRelationshipId}/ (`datasetsRelationships_delete`) */
export const datasetsRelationshipsDelete: DatarobotEndpoints['datasetsRelationshipsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/relationships/{datasetRelationshipId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetRelationshipId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRelationshipsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRelationshipsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List related datasets  by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/relationships/ (`datasetsRelationships_list`) */
export const datasetsRelationshipsList: DatarobotEndpoints['datasetsRelationshipsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/relationships/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['limit', 'offset', 'linkedDatasetId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRelationshipsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRelationshipsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update dataset relationship by dataset ID */
/** Official: PATCH /api/v2/datasets/{datasetId}/relationships/{datasetRelationshipId}/ (`datasetsRelationships_patch`) */
export const datasetsRelationshipsPatch: DatarobotEndpoints['datasetsRelationshipsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/relationships/{datasetRelationshipId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetRelationshipId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsRelationshipsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsRelationshipsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get dataset details by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/ (`datasets_retrieve`) */
export const datasetsRetrieve: DatarobotEndpoints['datasetsRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/datasets/{datasetId}/', input);
	const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.datasetsRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.datasets.datasetsRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** List dataset shared roles by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/sharedRoles/ (`datasetsSharedRoles_list`) */
export const datasetsSharedRolesList: DatarobotEndpoints['datasetsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['id', 'name', 'shareRecipientType', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsSharedRolesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify dataset shared roles by dataset ID */
/** Official: PATCH /api/v2/datasets/{datasetId}/sharedRoles/ (`datasetsSharedRoles_patchMany`) */
export const datasetsSharedRolesPatchMany: DatarobotEndpoints['datasetsSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve all features details by ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/allFeaturesDetails/ (`datasetsVersionsAllFeaturesDetails_list`) */
export const datasetsVersionsAllFeaturesDetailsList: DatarobotEndpoints['datasetsVersionsAllFeaturesDetailsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/allFeaturesDetails/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[
				'limit',
				'offset',
				'orderBy',
				'includePlot',
				'searchFor',
				'featurelistId',
				'includeDataQuality',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsAllFeaturesDetailsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsAllFeaturesDetailsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete dataset version by dataset ID */
/** Official: DELETE /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/ (`datasetsVersions_delete`) */
export const datasetsVersionsDelete: DatarobotEndpoints['datasetsVersionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Recover deleted dataset version by dataset ID */
/** Official: PATCH /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/deleted/ (`datasetsVersionsDeleted_patchMany`) */
export const datasetsVersionsDeletedPatchMany: DatarobotEndpoints['datasetsVersionsDeletedPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/deleted/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsDeletedPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsDeletedPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve file by ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/documentsDataQualityLog/file/ (`datasetsVersionsDocumentsDataQualityLogFile_list`) */
export const datasetsVersionsDocumentsDataQualityLogFileList: DatarobotEndpoints['datasetsVersionsDocumentsDataQualityLogFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/documentsDataQualityLog/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsDocumentsDataQualityLogFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsDocumentsDataQualityLogFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve documents data quality log by ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/documentsDataQualityLog/ (`datasetsVersionsDocumentsDataQualityLog_list`) */
export const datasetsVersionsDocumentsDataQualityLogList: DatarobotEndpoints['datasetsVersionsDocumentsDataQualityLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/documentsDataQualityLog/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsDocumentsDataQualityLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsDocumentsDataQualityLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve feature histograms by ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/featureHistograms/{featureName}/ (`datasetsVersionsFeatureHistograms_retrieve`) */
export const datasetsVersionsFeatureHistogramsRetrieve: DatarobotEndpoints['datasetsVersionsFeatureHistogramsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/featureHistograms/{featureName}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId', 'featureName'],
			['binLimit', 'key', 'usePlot2'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFeatureHistogramsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFeatureHistogramsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve featurelists by ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/featurelists/ (`datasetsVersionsFeaturelists_list`) */
export const datasetsVersionsFeaturelistsList: DatarobotEndpoints['datasetsVersionsFeaturelistsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/featurelists/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			['limit', 'offset', 'orderBy', 'searchFor'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFeaturelistsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFeaturelistsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve featurelists by ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/featurelists/{featurelistId}/ (`datasetsVersionsFeaturelists_retrieve`) */
export const datasetsVersionsFeaturelistsRetrieve: DatarobotEndpoints['datasetsVersionsFeaturelistsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/featurelists/{featurelistId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId', 'featurelistId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFeaturelistsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFeaturelistsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve file by ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/file/ (`datasetsVersionsFile_list`) */
export const datasetsVersionsFileList: DatarobotEndpoints['datasetsVersionsFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/file/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFileList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create dataset version by dataset ID */
/** Official: POST /api/v2/datasets/{datasetId}/versions/fromDataEngineWorkspaceState/ (`datasetsVersionsFromDataEngineWorkspaceState_create`) */
export const datasetsVersionsFromDataEngineWorkspaceStateCreate: DatarobotEndpoints['datasetsVersionsFromDataEngineWorkspaceStateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromDataEngineWorkspaceState/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromDataEngineWorkspaceStateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromDataEngineWorkspaceStateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a data source */
/** Official: POST /api/v2/datasets/{datasetId}/versions/fromDataSource/ (`datasetsVersionsFromDataSource_create`) */
export const datasetsVersionsFromDataSourceCreate: DatarobotEndpoints['datasetsVersionsFromDataSourceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromDataSource/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromDataSourceCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromDataSourceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a file */
/** Official: POST /api/v2/datasets/{datasetId}/versions/fromFile/ (`datasetsVersionsFromFile_create`) */
export const datasetsVersionsFromFileCreate: DatarobotEndpoints['datasetsVersionsFromFileCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromFile/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromFileCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromFileCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a hdfs */
/** Official: POST /api/v2/datasets/{datasetId}/versions/fromHDFS/ (`datasetsVersionsFromHDFS_create`) */
export const datasetsVersionsFromHDFSCreate: DatarobotEndpoints['datasetsVersionsFromHDFSCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromHDFS/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromHDFSCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromHDFSCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a latest version */
/** Official: POST /api/v2/datasets/{datasetId}/versions/fromLatestVersion/ (`datasetsVersionsFromLatestVersion_create`) */
export const datasetsVersionsFromLatestVersionCreate: DatarobotEndpoints['datasetsVersionsFromLatestVersionCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromLatestVersion/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromLatestVersionCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromLatestVersionCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a recipe */
/** Official: POST /api/v2/datasets/{datasetId}/versions/fromRecipe/ (`datasetsVersionsFromRecipe_create`) */
export const datasetsVersionsFromRecipeCreate: DatarobotEndpoints['datasetsVersionsFromRecipeCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromRecipe/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromRecipeCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromRecipeCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a stage */
/** Official: POST /api/v2/datasets/{datasetId}/versions/fromStage/ (`datasetsVersionsFromStage_create`) */
export const datasetsVersionsFromStageCreate: DatarobotEndpoints['datasetsVersionsFromStageCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromStage/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromStageCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromStageCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from an URL */
/** Official: POST /api/v2/datasets/{datasetId}/versions/fromURL/ (`datasetsVersionsFromURL_create`) */
export const datasetsVersionsFromURLCreate: DatarobotEndpoints['datasetsVersionsFromURLCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/fromURL/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['datasetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromURLCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromURLCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a version */
/** Official: POST /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/fromVersion/ (`datasetsVersionsFromVersion_create`) */
export const datasetsVersionsFromVersionCreate: DatarobotEndpoints['datasetsVersionsFromVersionCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/fromVersion/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsFromVersionCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsFromVersionCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List dataset versions by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/ (`datasetsVersions_list`) */
export const datasetsVersionsList: DatarobotEndpoints['datasetsVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId'],
			['category', 'orderBy', 'limit', 'offset', 'filterFailed'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get dataset projects by version by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/projects/ (`datasetsVersionsProjects_list`) */
export const datasetsVersionsProjectsList: DatarobotEndpoints['datasetsVersionsProjectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/projects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			['limit', 'offset'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsProjectsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsProjectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get dataset details by version by dataset ID */
/** Official: GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/ (`datasetsVersions_retrieve`) */
export const datasetsVersionsRetrieve: DatarobotEndpoints['datasetsVersionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/datasets/{datasetId}/versions/{datasetVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['datasetId', 'datasetVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.datasetsVersionsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.datasets.datasetsVersionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
