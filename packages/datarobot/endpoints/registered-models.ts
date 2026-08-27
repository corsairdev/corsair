import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Archive a registered model by registered model ID */
/** Official: DELETE /api/v2/registeredModels/{registeredModelId}/ (`registeredModels_delete`) */
export const registeredModelsDelete: DatarobotEndpoints['registeredModelsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['registeredModelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List deployments associated by registered model ID */
/** Official: GET /api/v2/registeredModels/{registeredModelId}/deployments/ (`registeredModelsDeployments_list`) */
export const registeredModelsDeploymentsList: DatarobotEndpoints['registeredModelsDeploymentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/deployments/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['registeredModelId'],
			['offset', 'limit', 'search', 'sortKey', 'sortDirection'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsDeploymentsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsDeploymentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List registered models. */
/** Official: GET /api/v2/registeredModels/ (`registeredModels_list`) */
export const registeredModelsList: DatarobotEndpoints['registeredModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/registeredModels/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'search',
				'createdAtStartTs',
				'createdAtEndTs',
				'modifiedAtStartTs',
				'modifiedAtEndTs',
				'targetName',
				'targetType',
				'createdBy',
				'sortKey',
				'sortDirection',
				'compatibleWithLeaderboardModelId',
				'compatibleWithModelPackageId',
				'forChallenger',
				'predictionThreshold',
				'imported',
				'predictionEnvironmentId',
				'modelKind',
				'buildStatus',
				'stage',
				'isGlobal',
				'tagKeys',
				'tagValues',
				'tagFilters',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a registered model by registered model ID */
/** Official: PATCH /api/v2/registeredModels/{registeredModelId}/ (`registeredModels_patch`) */
export const registeredModelsPatch: DatarobotEndpoints['registeredModelsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['registeredModelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve information about a registered model by registered model ID */
/** Official: GET /api/v2/registeredModels/{registeredModelId}/ (`registeredModels_retrieve`) */
export const registeredModelsRetrieve: DatarobotEndpoints['registeredModelsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['registeredModelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the registered model access control list by registered model ID */
/** Official: GET /api/v2/registeredModels/{registeredModelId}/sharedRoles/ (`registeredModelsSharedRoles_list`) */
export const registeredModelsSharedRolesList: DatarobotEndpoints['registeredModelsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['registeredModelId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the registered model controls by registered model ID */
/** Official: PATCH /api/v2/registeredModels/{registeredModelId}/sharedRoles/ (`registeredModelsSharedRoles_patchMany`) */
export const registeredModelsSharedRolesPatchMany: DatarobotEndpoints['registeredModelsSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['registeredModelId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all deployments associated by registered model ID */
/** Official: GET /api/v2/registeredModels/{registeredModelId}/versions/{versionId}/deployments/ (`registeredModelsVersionsDeployments_list`) */
export const registeredModelsVersionsDeploymentsList: DatarobotEndpoints['registeredModelsVersionsDeploymentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/versions/{versionId}/deployments/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['registeredModelId', 'versionId'],
			['offset', 'limit', 'search', 'sortKey', 'sortDirection'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsVersionsDeploymentsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsVersionsDeploymentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List the registered model's versions by registered model ID */
/** Official: GET /api/v2/registeredModels/{registeredModelId}/versions/ (`registeredModelsVersions_list`) */
export const registeredModelsVersionsList: DatarobotEndpoints['registeredModelsVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['registeredModelId'],
			[
				'offset',
				'limit',
				'sortKey',
				'sortDirection',
				'targetName',
				'targetType',
				'search',
				'compatibleWithLeaderboardModelId',
				'compatibleWithModelPackageId',
				'forChallenger',
				'predictionThreshold',
				'imported',
				'predictionEnvironmentId',
				'modelKind',
				'buildStatus',
				'stage',
				'useCaseId',
				'createdBy',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsVersionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the registered model's version by registered model ID */
/** Official: GET /api/v2/registeredModels/{registeredModelId}/versions/{versionId}/ (`registeredModelsVersions_retrieve`) */
export const registeredModelsVersionsRetrieve: DatarobotEndpoints['registeredModelsVersionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/registeredModels/{registeredModelId}/versions/{versionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['registeredModelId', 'versionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.registeredModelsVersionsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.registeredModels.registeredModelsVersionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
