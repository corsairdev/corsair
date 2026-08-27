import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get a list of users who have access by environment ID */
/** Official: GET /api/v2/executionEnvironments/{environmentId}/accessControl/ (`executionEnvironmentsAccessControl_list`) */
export const executionEnvironmentsAccessControlList: DatarobotEndpoints['executionEnvironmentsAccessControlList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/accessControl/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['environmentId'],
			['offset', 'limit', 'username', 'userId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsAccessControlList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsAccessControlList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Grant access by environment ID */
/** Official: PATCH /api/v2/executionEnvironments/{environmentId}/accessControl/ (`executionEnvironmentsAccessControl_patchMany`) */
export const executionEnvironmentsAccessControlPatchMany: DatarobotEndpoints['executionEnvironmentsAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['environmentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create an execution environment. */
/** Official: POST /api/v2/executionEnvironments/ (`executionEnvironments_create`) */
export const executionEnvironmentsCreate: DatarobotEndpoints['executionEnvironmentsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/executionEnvironments/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Destroy an execution environment by environment ID */
/** Official: DELETE /api/v2/executionEnvironments/{environmentId}/ (`executionEnvironments_delete`) */
export const executionEnvironmentsDelete: DatarobotEndpoints['executionEnvironmentsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['environmentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List execution environments. */
/** Official: GET /api/v2/executionEnvironments/ (`executionEnvironments_list`) */
export const executionEnvironmentsList: DatarobotEndpoints['executionEnvironmentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/executionEnvironments/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'searchFor', 'useCases', 'isPublic'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an execution environment by environment ID */
/** Official: PATCH /api/v2/executionEnvironments/{environmentId}/ (`executionEnvironments_patch`) */
export const executionEnvironmentsPatch: DatarobotEndpoints['executionEnvironmentsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['environmentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get an execution environment by environment ID */
/** Official: GET /api/v2/executionEnvironments/{environmentId}/ (`executionEnvironments_retrieve`) */
export const executionEnvironmentsRetrieve: DatarobotEndpoints['executionEnvironmentsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['environmentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download the execution environment build log by environment ID */
/** Official: GET /api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/buildLog/ (`executionEnvironmentsVersionsBuildLog_list`) */
export const executionEnvironmentsVersionsBuildLogList: DatarobotEndpoints['executionEnvironmentsVersionsBuildLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/buildLog/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['environmentId', 'environmentVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsBuildLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsVersionsBuildLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Stop the execution environment build by environment ID */
/** Official: PATCH /api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/cancelBuild/ (`executionEnvironmentsVersionsCancelBuild_patchMany`) */
export const executionEnvironmentsVersionsCancelBuildPatchMany: DatarobotEndpoints['executionEnvironmentsVersionsCancelBuildPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/cancelBuild/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['environmentId', 'environmentVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsCancelBuildPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsVersionsCancelBuildPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create an execution environment version by environment ID */
/** Official: POST /api/v2/executionEnvironments/{environmentId}/versions/ (`executionEnvironmentsVersions_create`) */
export const executionEnvironmentsVersionsCreate: DatarobotEndpoints['executionEnvironmentsVersionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['environmentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsVersionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Request on-demand image build by environment ID */
/** Official: POST /api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/download/ (`executionEnvironmentsVersionsDownload_create`) */
export const executionEnvironmentsVersionsDownloadCreate: DatarobotEndpoints['executionEnvironmentsVersionsDownloadCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/download/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['environmentId', 'environmentVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsDownloadCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsVersionsDownloadCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Submit image tarball build by environment ID */
/** Official: GET /api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/download/ (`executionEnvironmentsVersionsDownload_list`) */
export const executionEnvironmentsVersionsDownloadList: DatarobotEndpoints['executionEnvironmentsVersionsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/download/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['environmentId', 'environmentVersionId'],
			['imageFile'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsVersionsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List execution environment versions by environment ID */
/** Official: GET /api/v2/executionEnvironments/{environmentId}/versions/ (`executionEnvironmentsVersions_list`) */
export const executionEnvironmentsVersionsList: DatarobotEndpoints['executionEnvironmentsVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['environmentId'],
			['offset', 'limit', 'buildStatus', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get an execution environment version by environment ID */
/** Official: GET /api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/ (`executionEnvironmentsVersions_retrieve`) */
export const executionEnvironmentsVersionsRetrieve: DatarobotEndpoints['executionEnvironmentsVersionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/executionEnvironments/{environmentId}/versions/{environmentVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['environmentId', 'environmentVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.executionEnvironments.executionEnvironmentsVersionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
