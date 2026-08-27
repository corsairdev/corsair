import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Request calculation of Confusion Matrix chart */
/** Official: POST /api/v2/insights/confusionMatrix/ (`insightsConfusionMatrix_create`) */
export const insightsConfusionMatrixCreate: DatarobotEndpoints['insightsConfusionMatrixCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/confusionMatrix/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsConfusionMatrixCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsConfusionMatrixCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated Confusion Matrix chart insights by entity ID */
/** Official: GET /api/v2/insights/confusionMatrix/models/{entityId}/ (`insightsConfusionMatrixModels_list`) */
export const insightsConfusionMatrixModelsList: DatarobotEndpoints['insightsConfusionMatrixModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/confusionMatrix/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			[
				'limit',
				'offset',
				'dataSliceId',
				'source',
				'unslicedOnly',
				'dataOrderBy',
				'orientation',
				'rowStart',
				'rowEnd',
				'colStart',
				'colEnd',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsConfusionMatrixModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsConfusionMatrixModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of Feature Effects */
/** Official: POST /api/v2/insights/featureEffects/ (`insightsFeatureEffects_create`) */
export const insightsFeatureEffectsCreate: DatarobotEndpoints['insightsFeatureEffectsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/featureEffects/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsFeatureEffectsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsFeatureEffectsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated Feature Effects insights by entity ID */
/** Official: GET /api/v2/insights/featureEffects/models/{entityId}/ (`insightsFeatureEffectsModels_list`) */
export const insightsFeatureEffectsModelsList: DatarobotEndpoints['insightsFeatureEffectsModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/featureEffects/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			['limit', 'offset', 'dataSliceId', 'source', 'unslicedOnly'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsFeatureEffectsModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsFeatureEffectsModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of Feature Impact */
/** Official: POST /api/v2/insights/featureImpact/ (`insightsFeatureImpact_create`) */
export const insightsFeatureImpactCreate: DatarobotEndpoints['insightsFeatureImpactCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/featureImpact/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsFeatureImpactCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsFeatureImpactCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated Feature Impact insights by entity ID */
/** Official: GET /api/v2/insights/featureImpact/models/{entityId}/ (`insightsFeatureImpactModels_list`) */
export const insightsFeatureImpactModelsList: DatarobotEndpoints['insightsFeatureImpactModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/featureImpact/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			['limit', 'offset', 'dataSliceId', 'source', 'unslicedOnly'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsFeatureImpactModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsFeatureImpactModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of Lift chart */
/** Official: POST /api/v2/insights/liftChart/ (`insightsLiftChart_create`) */
export const insightsLiftChartCreate: DatarobotEndpoints['insightsLiftChartCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/liftChart/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsLiftChartCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsLiftChartCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated lift chart insights by entity ID */
/** Official: GET /api/v2/insights/liftChart/models/{entityId}/ (`insightsLiftChartModels_list`) */
export const insightsLiftChartModelsList: DatarobotEndpoints['insightsLiftChartModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/liftChart/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			[
				'limit',
				'offset',
				'dataSliceId',
				'source',
				'unslicedOnly',
				'externalDatasetId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsLiftChartModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsLiftChartModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete insights by insightname */
/** Official: DELETE /api/v2/insights/{insightName}/models/{entityId}/ (`insightsModels_delete`) */
export const insightsModelsDelete: DatarobotEndpoints['insightsModelsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/{insightName}/models/{entityId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['insightName', 'entityId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsModelsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsModelsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of Residuals chart */
/** Official: POST /api/v2/insights/residuals/ (`insightsResiduals_create`) */
export const insightsResidualsCreate: DatarobotEndpoints['insightsResidualsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/residuals/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsResidualsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsResidualsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated Residuals insights by entity ID */
/** Official: GET /api/v2/insights/residuals/models/{entityId}/ (`insightsResidualsModels_list`) */
export const insightsResidualsModelsList: DatarobotEndpoints['insightsResidualsModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/residuals/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			[
				'limit',
				'offset',
				'dataSliceId',
				'source',
				'unslicedOnly',
				'externalDatasetId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsResidualsModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsResidualsModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of ROC curve */
/** Official: POST /api/v2/insights/rocCurve/ (`insightsRocCurve_create`) */
export const insightsRocCurveCreate: DatarobotEndpoints['insightsRocCurveCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/rocCurve/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsRocCurveCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsRocCurveCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated ROC curve insights by entity ID */
/** Official: GET /api/v2/insights/rocCurve/models/{entityId}/ (`insightsRocCurveModels_list`) */
export const insightsRocCurveModelsList: DatarobotEndpoints['insightsRocCurveModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/rocCurve/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			[
				'limit',
				'offset',
				'dataSliceId',
				'source',
				'unslicedOnly',
				'externalDatasetId',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsRocCurveModelsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsRocCurveModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of SHAP Distributions */
/** Official: POST /api/v2/insights/shapDistributions/ (`insightsShapDistributions_create`) */
export const insightsShapDistributionsCreate: DatarobotEndpoints['insightsShapDistributionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/shapDistributions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsShapDistributionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsShapDistributionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated SHAP Distributions insights by entity ID */
/** Official: GET /api/v2/insights/shapDistributions/models/{entityId}/ (`insightsShapDistributionsModels_list`) */
export const insightsShapDistributionsModelsList: DatarobotEndpoints['insightsShapDistributionsModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/shapDistributions/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			[
				'limit',
				'offset',
				'dataSliceId',
				'source',
				'unslicedOnly',
				'externalDatasetId',
				'predictionFilterRowCount',
				'featureFilterCount',
				'featureFilterName',
				'quickCompute',
				'seriesId',
				'forecastDistance',
				'featuresOrderBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsShapDistributionsModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsShapDistributionsModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of SHAP Impact */
/** Official: POST /api/v2/insights/shapImpact/ (`insightsShapImpact_create`) */
export const insightsShapImpactCreate: DatarobotEndpoints['insightsShapImpactCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/shapImpact/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsShapImpactCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsShapImpactCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated SHAP Impact insights by entity ID */
/** Official: GET /api/v2/insights/shapImpact/models/{entityId}/ (`insightsShapImpactModels_list`) */
export const insightsShapImpactModelsList: DatarobotEndpoints['insightsShapImpactModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/shapImpact/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			[
				'limit',
				'offset',
				'dataSliceId',
				'source',
				'unslicedOnly',
				'quickCompute',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsShapImpactModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsShapImpactModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of SHAP Matrix */
/** Official: POST /api/v2/insights/shapMatrix/ (`insightsShapMatrix_create`) */
export const insightsShapMatrixCreate: DatarobotEndpoints['insightsShapMatrixCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/shapMatrix/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsShapMatrixCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsShapMatrixCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated SHAP Matrix insights by entity ID */
/** Official: GET /api/v2/insights/shapMatrix/models/{entityId}/ (`insightsShapMatrixModels_list`) */
export const insightsShapMatrixModelsList: DatarobotEndpoints['insightsShapMatrixModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/shapMatrix/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			[
				'limit',
				'offset',
				'dataSliceId',
				'source',
				'unslicedOnly',
				'externalDatasetId',
				'quickCompute',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsShapMatrixModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsShapMatrixModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request calculation of SHAP Preview */
/** Official: POST /api/v2/insights/shapPreview/ (`insightsShapPreview_create`) */
export const insightsShapPreviewCreate: DatarobotEndpoints['insightsShapPreviewCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/insights/shapPreview/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsShapPreviewCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsShapPreviewCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of paginated SHAP Preview insights by entity ID */
/** Official: GET /api/v2/insights/shapPreview/models/{entityId}/ (`insightsShapPreviewModels_list`) */
export const insightsShapPreviewModelsList: DatarobotEndpoints['insightsShapPreviewModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/insights/shapPreview/models/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['entityId'],
			[
				'limit',
				'offset',
				'dataSliceId',
				'source',
				'unslicedOnly',
				'externalDatasetId',
				'predictionFilterRowCount',
				'predictionFilterPercentiles',
				'predictionFilterOperandFirst',
				'predictionFilterOperandSecond',
				'predictionFilterOperator',
				'featureFilterCount',
				'featureFilterName',
				'quickCompute',
				'seriesId',
				'forecastDistance',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.insightsShapPreviewModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.insights.insightsShapPreviewModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
