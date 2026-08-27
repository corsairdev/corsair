import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Archive a model package by model package ID */
/** Official: POST /api/v2/modelPackages/{modelPackageId}/archive/ (`modelPackagesArchive_create`) */
export const modelPackagesArchiveCreate: DatarobotEndpoints['modelPackagesArchiveCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/{modelPackageId}/archive/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['modelPackageId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesArchiveCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesArchiveCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve capabilities by model package ID */
/** Official: GET /api/v2/modelPackages/{modelPackageId}/capabilities/ (`modelPackagesCapabilities_list`) */
export const modelPackagesCapabilitiesList: DatarobotEndpoints['modelPackagesCapabilitiesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/{modelPackageId}/capabilities/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['modelPackageId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesCapabilitiesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesCapabilitiesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve feature list by model package ID */
/** Official: GET /api/v2/modelPackages/{modelPackageId}/features/ (`modelPackagesFeatures_list`) */
export const modelPackagesFeaturesList: DatarobotEndpoints['modelPackagesFeaturesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/{modelPackageId}/features/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['modelPackageId'],
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
			DatarobotEndpointOutputSchemas.modelPackagesFeaturesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesFeaturesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a model package */
/** Official: POST /api/v2/modelPackages/fromJSON/ (`modelPackagesFromJSON_create`) */
export const modelPackagesFromJSONCreate: DatarobotEndpoints['modelPackagesFromJSONCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/modelPackages/fromJSON/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesFromJSONCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesFromJSONCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create model package */
/** Official: POST /api/v2/modelPackages/fromLeaderboard/ (`modelPackagesFromLeaderboard_create`) */
export const modelPackagesFromLeaderboardCreate: DatarobotEndpoints['modelPackagesFromLeaderboardCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/fromLeaderboard/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesFromLeaderboardCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesFromLeaderboardCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a model packages from a learning model */
/** Official: POST /api/v2/modelPackages/fromLearningModel/ (`modelPackagesFromLearningModel_create`) */
export const modelPackagesFromLearningModelCreate: DatarobotEndpoints['modelPackagesFromLearningModelCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/fromLearningModel/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesFromLearningModelCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesFromLearningModelCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List model packages */
/** Official: GET /api/v2/modelPackages/ (`modelPackages_list`) */
export const modelPackagesList: DatarobotEndpoints['modelPackagesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/modelPackages/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'modelId',
				'similarTo',
				'forChallenger',
				'search',
				'predictionThreshold',
				'imported',
				'predictionEnvironmentId',
				'modelKind',
				'buildStatus',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of the model package's model logs by model package ID */
/** Official: GET /api/v2/modelPackages/{modelPackageId}/modelLogs/ (`modelPackagesModelLogs_list`) */
export const modelPackagesModelLogsList: DatarobotEndpoints['modelPackagesModelLogsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/{modelPackageId}/modelLogs/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['modelPackageId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesModelLogsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesModelLogsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve info about a model package by model package ID */
/** Official: GET /api/v2/modelPackages/{modelPackageId}/ (`modelPackages_retrieve`) */
export const modelPackagesRetrieve: DatarobotEndpoints['modelPackagesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/{modelPackageId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['modelPackageId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the model package's access control list by model package ID */
/** Official: GET /api/v2/modelPackages/{modelPackageId}/sharedRoles/ (`modelPackagesSharedRoles_list`) */
export const modelPackagesSharedRolesList: DatarobotEndpoints['modelPackagesSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/modelPackages/{modelPackageId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['modelPackageId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.modelPackagesSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.modelPackages.modelPackagesSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
