import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Deletes the wrangling recipe by recipe ID */
/** Official: DELETE /api/v2/recipes/{recipeId}/ (`recipes_delete`) */
export const recipesDelete: DatarobotEndpoints['recipesDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/recipes/{recipeId}/', input);
	const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.recipesDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.recipes.recipesDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Updates the downsampling by recipe ID */
/** Official: PUT /api/v2/recipes/{recipeId}/downsampling/ (`recipesDownsampling_putMany`) */
export const recipesDownsamplingPutMany: DatarobotEndpoints['recipesDownsamplingPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/downsampling/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesDownsamplingPutMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesDownsamplingPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a recipe and a data source */
/** Official: POST /api/v2/recipes/fromDataStore/ (`recipesFromDataStore_create`) */
export const recipesFromDataStoreCreate: DatarobotEndpoints['recipesFromDataStoreCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/recipes/fromDataStore/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesFromDataStoreCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesFromDataStoreCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a recipe given dataset. */
/** Official: POST /api/v2/recipes/fromDataset/ (`recipesFromDataset_create`) */
export const recipesFromDatasetCreate: DatarobotEndpoints['recipesFromDatasetCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/recipes/fromDataset/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesFromDatasetCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesFromDatasetCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Clone given wrangling recipe. */
/** Official: POST /api/v2/recipes/fromRecipe/ (`recipesFromRecipe_create`) */
export const recipesFromRecipeCreate: DatarobotEndpoints['recipesFromRecipeCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/recipes/fromRecipe/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesFromRecipeCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesFromRecipeCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Gets inputs by recipe ID */
/** Official: GET /api/v2/recipes/{recipeId}/inputs/ (`recipesInputs_list`) */
export const recipesInputsList: DatarobotEndpoints['recipesInputsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/inputs/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesInputsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesInputsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Sets the input of the given recipe by recipe ID */
/** Official: PUT /api/v2/recipes/{recipeId}/inputs/ (`recipesInputs_putMany`) */
export const recipesInputsPutMany: DatarobotEndpoints['recipesInputsPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/inputs/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesInputsPutMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesInputsPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve recipe insights by recipe ID */
/** Official: GET /api/v2/recipes/{recipeId}/insights/ (`recipesInsights_list`) */
export const recipesInsightsList: DatarobotEndpoints['recipesInsightsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/insights/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['recipeId'],
			['limit', 'offset', 'numberOfOperationsToUse'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesInsightsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesInsightsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List recipes. */
/** Official: GET /api/v2/recipes/ (`recipes_list`) */
export const recipesList: DatarobotEndpoints['recipesList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/recipes/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'orderBy',
			'search',
			'dialect',
			'status',
			'recipeType',
			'creatorUserId',
			'creatorUsername',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.recipesList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.recipes.recipesList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update the operations by recipe ID */
/** Official: PUT /api/v2/recipes/{recipeId}/operations/ (`recipesOperations_putMany`) */
export const recipesOperationsPutMany: DatarobotEndpoints['recipesOperationsPutMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/operations/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PUT',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesOperationsPutMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesOperationsPutMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a recipe operation details by recipe ID */
/** Official: GET /api/v2/recipes/{recipeId}/operations/{operationIndex}/ (`recipesOperations_retrieve`) */
export const recipesOperationsRetrieve: DatarobotEndpoints['recipesOperationsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/operations/{operationIndex}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['recipeId', 'operationIndex'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesOperationsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesOperationsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Patched wrangling recipe by recipe ID */
/** Official: PATCH /api/v2/recipes/{recipeId}/ (`recipes_patch`) */
export const recipesPatch: DatarobotEndpoints['recipesPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/recipes/{recipeId}/', input);
	const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.recipesPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.recipes.recipesPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Start the job by recipe ID */
/** Official: POST /api/v2/recipes/{recipeId}/preview/ (`recipesPreview_create`) */
export const recipesPreviewCreate: DatarobotEndpoints['recipesPreviewCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/preview/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesPreviewCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesPreviewCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a wrangling preview by recipe ID */
/** Official: GET /api/v2/recipes/{recipeId}/preview/ (`recipesPreview_list`) */
export const recipesPreviewList: DatarobotEndpoints['recipesPreviewList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/preview/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['recipeId'],
			['offset', 'limit', 'numberOfOperationsToUse'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesPreviewList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesPreviewList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Submit a relationship quality assessment job by recipe ID */
/** Official: POST /api/v2/recipes/{recipeId}/relationshipQualityAssessments/ (`recipesRelationshipQualityAssessments_create`) */
export const recipesRelationshipQualityAssessmentsCreate: DatarobotEndpoints['recipesRelationshipQualityAssessmentsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/relationshipQualityAssessments/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesRelationshipQualityAssessmentsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesRelationshipQualityAssessmentsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a wrangling recipe by recipe ID */
/** Official: GET /api/v2/recipes/{recipeId}/ (`recipes_retrieve`) */
export const recipesRetrieve: DatarobotEndpoints['recipesRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/recipes/{recipeId}/', input);
	const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.recipesRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.recipes.recipesRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Updates recipe settings by recipe ID */
/** Official: PATCH /api/v2/recipes/{recipeId}/settings/ (`recipesSettings_patchMany`) */
export const recipesSettingsPatchMany: DatarobotEndpoints['recipesSettingsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/settings/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesSettingsPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesSettingsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Build SQL query by recipe ID */
/** Official: POST /api/v2/recipes/{recipeId}/sql/ (`recipesSql_create`) */
export const recipesSqlCreate: DatarobotEndpoints['recipesSqlCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/recipes/{recipeId}/sql/', input);
	const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.recipesSqlCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.recipes.recipesSqlCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Generate a time series transformation plan by recipe ID */
/** Official: POST /api/v2/recipes/{recipeId}/timeseriesTransformationPlans/ (`recipesTimeseriesTransformationPlans_create`) */
export const recipesTimeseriesTransformationPlansCreate: DatarobotEndpoints['recipesTimeseriesTransformationPlansCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/timeseriesTransformationPlans/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesTimeseriesTransformationPlansCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesTimeseriesTransformationPlansCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve generated time series transformation plan by recipe ID */
/** Official: GET /api/v2/recipes/{recipeId}/timeseriesTransformationPlans/{id}/ (`recipesTimeseriesTransformationPlans_retrieve`) */
export const recipesTimeseriesTransformationPlansRetrieve: DatarobotEndpoints['recipesTimeseriesTransformationPlansRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/recipes/{recipeId}/timeseriesTransformationPlans/{id}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['recipeId', 'id'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.recipesTimeseriesTransformationPlansRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.recipes.recipesTimeseriesTransformationPlansRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
