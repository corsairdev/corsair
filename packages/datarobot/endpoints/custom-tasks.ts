import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Update custom task version files by custom task ID */
/** Official: PATCH /api/v2/customTasks/{customTaskId}/versions/ (`customTaskVersion_createFromLatest`) */
export const customTaskVersionCreateFromLatest: DatarobotEndpoints['customTaskVersionCreateFromLatest'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTaskVersionCreateFromLatest.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTaskVersionCreateFromLatest',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of users who have access by custom task ID */
/** Official: GET /api/v2/customTasks/{customTaskId}/accessControl/ (`customTasksAccessControl_list`) */
export const customTasksAccessControlList: DatarobotEndpoints['customTasksAccessControlList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/accessControl/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customTaskId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksAccessControlList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksAccessControlList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Grant access or update roles by custom task ID */
/** Official: PATCH /api/v2/customTasks/{customTaskId}/accessControl/ (`customTasksAccessControl_patchMany`) */
export const customTasksAccessControlPatchMany: DatarobotEndpoints['customTasksAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a custom task */
/** Official: POST /api/v2/customTasks/ (`customTasks_create`) */
export const customTasksCreate: DatarobotEndpoints['customTasksCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/customTasks/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete custom task by custom task ID */
/** Official: DELETE /api/v2/customTasks/{customTaskId}/ (`customTasks_delete`) */
export const customTasksDelete: DatarobotEndpoints['customTasksDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download the latest custom task version content by custom task ID */
/** Official: GET /api/v2/customTasks/{customTaskId}/download/ (`customTasksDownload_list`) */
export const customTasksDownloadList: DatarobotEndpoints['customTasksDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/download/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksDownloadList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Clone custom task. */
/** Official: POST /api/v2/customTasks/fromCustomTask/ (`customTasksFromCustomTask_create`) */
export const customTasksFromCustomTaskCreate: DatarobotEndpoints['customTasksFromCustomTaskCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/fromCustomTask/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksFromCustomTaskCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksFromCustomTaskCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom tasks. */
/** Official: GET /api/v2/customTasks/ (`customTasks_list`) */
export const customTasksList: DatarobotEndpoints['customTasksList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/customTasks/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['offset', 'limit', 'orderBy', 'searchFor'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.customTasksList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.customTasks.customTasksList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update custom task by custom task ID */
/** Official: PATCH /api/v2/customTasks/{customTaskId}/ (`customTasks_patch`) */
export const customTasksPatch: DatarobotEndpoints['customTasksPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/customTasks/{customTaskId}/', input);
	const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.customTasksPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.customTasks.customTasksPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Get custom task by custom task ID */
/** Official: GET /api/v2/customTasks/{customTaskId}/ (`customTasks_retrieve`) */
export const customTasksRetrieve: DatarobotEndpoints['customTasksRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create custom task version by custom task ID */
/** Official: POST /api/v2/customTasks/{customTaskId}/versions/ (`customTasksVersions_create`) */
export const customTasksVersionsCreate: DatarobotEndpoints['customTasksVersionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Start a custom task version's dependency build by custom task ID */
/** Official: POST /api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/dependencyBuild/ (`customTasksVersionsDependencyBuild_create`) */
export const customTasksVersionsDependencyBuildCreate: DatarobotEndpoints['customTasksVersionsDependencyBuildCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/dependencyBuild/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customTaskId', 'customTaskVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsDependencyBuildCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsDependencyBuildCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Cancel dependency build by custom task ID */
/** Official: DELETE /api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/dependencyBuild/ (`customTasksVersionsDependencyBuild_deleteMany`) */
export const customTasksVersionsDependencyBuildDeleteMany: DatarobotEndpoints['customTasksVersionsDependencyBuildDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/dependencyBuild/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customTaskId', 'customTaskVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsDependencyBuildDeleteMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsDependencyBuildDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the custom task version's dependency build status by custom task ID */
/** Official: GET /api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/dependencyBuild/ (`customTasksVersionsDependencyBuild_list`) */
export const customTasksVersionsDependencyBuildList: DatarobotEndpoints['customTasksVersionsDependencyBuildList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/dependencyBuild/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customTaskId', 'customTaskVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsDependencyBuildList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsDependencyBuildList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the custom task version's dependency build log by custom task ID */
/** Official: GET /api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/dependencyBuildLog/ (`customTasksVersionsDependencyBuildLog_list`) */
export const customTasksVersionsDependencyBuildLogList: DatarobotEndpoints['customTasksVersionsDependencyBuildLogList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/dependencyBuildLog/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customTaskId', 'customTaskVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsDependencyBuildLogList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsDependencyBuildLogList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download custom task version content by custom task ID */
/** Official: GET /api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/download/ (`customTasksVersionsDownload_list`) */
export const customTasksVersionsDownloadList: DatarobotEndpoints['customTasksVersionsDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/download/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customTaskId', 'customTaskVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a version from a repository */
/** Official: POST /api/v2/customTasks/{customTaskId}/versions/fromRepository/ (`customTasksVersionsFromRepository_create`) */
export const customTasksVersionsFromRepositoryCreate: DatarobotEndpoints['customTasksVersionsFromRepositoryCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/fromRepository/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsFromRepositoryCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsFromRepositoryCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create custom task version from remote repository by custom task ID */
/** Official: PATCH /api/v2/customTasks/{customTaskId}/versions/fromRepository/ (`customTasksVersionsFromRepository_patchMany`) */
export const customTasksVersionsFromRepositoryPatchMany: DatarobotEndpoints['customTasksVersionsFromRepositoryPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/fromRepository/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['customTaskId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsFromRepositoryPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsFromRepositoryPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List custom task versions by custom task ID */
/** Official: GET /api/v2/customTasks/{customTaskId}/versions/ (`customTasksVersions_list`) */
export const customTasksVersionsList: DatarobotEndpoints['customTasksVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['customTaskId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update custom task version by custom task ID */
/** Official: PATCH /api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/ (`customTasksVersions_patch`) */
export const customTasksVersionsPatch: DatarobotEndpoints['customTasksVersionsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customTaskId', 'customTaskVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get custom task version by custom task ID */
/** Official: GET /api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/ (`customTasksVersions_retrieve`) */
export const customTasksVersionsRetrieve: DatarobotEndpoints['customTasksVersionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customTasks/{customTaskId}/versions/{customTaskVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['customTaskId', 'customTaskVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customTasksVersionsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customTasks.customTasksVersionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
