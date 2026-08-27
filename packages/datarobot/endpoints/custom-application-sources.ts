import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a custom application source. */
/** Official: POST /api/v2/customApplicationSources/ (`customApplicationSources_create`) */
export const customApplicationSourcesCreate: DatarobotEndpoints['customApplicationSourcesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/customApplicationSources/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a custom application source by app source ID */
/** Official: DELETE /api/v2/customApplicationSources/{appSourceId}/ (`customApplicationSources_delete`) */
export const customApplicationSourcesDelete: DatarobotEndpoints['customApplicationSourcesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['appSourceId'],
			['hardDelete'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a custom application source */
/** Official: POST /api/v2/customApplicationSources/fromCustomTemplate/ (`customApplicationSourcesFromCustomTemplate_create`) */
export const customApplicationSourcesFromCustomTemplateCreate: DatarobotEndpoints['customApplicationSourcesFromCustomTemplateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/fromCustomTemplate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesFromCustomTemplateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesFromCustomTemplateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of custom application sources created */
/** Official: GET /api/v2/customApplicationSources/ (`customApplicationSources_list`) */
export const customApplicationSourcesList: DatarobotEndpoints['customApplicationSourcesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/customApplicationSources/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'orderBy',
				'name',
				'createdBy',
				'updatedAtStartTs',
				'updatedAtEndTs',
				'createdAtStartTs',
				'createdAtEndTs',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a custom application source's name by app source ID */
/** Official: PATCH /api/v2/customApplicationSources/{appSourceId}/ (`customApplicationSources_patch`) */
export const customApplicationSourcesPatch: DatarobotEndpoints['customApplicationSourcesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['appSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a custom application source by app source ID */
/** Official: GET /api/v2/customApplicationSources/{appSourceId}/ (`customApplicationSources_retrieve`) */
export const customApplicationSourcesRetrieve: DatarobotEndpoints['customApplicationSourcesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['appSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of users, groups, and organizations with access by app source ID */
/** Official: GET /api/v2/customApplicationSources/{appSourceId}/sharedRoles/ (`customApplicationSourcesSharedRoles_list`) */
export const customApplicationSourcesSharedRolesList: DatarobotEndpoints['customApplicationSourcesSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['appSourceId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Share an application source by app source ID */
/** Official: PATCH /api/v2/customApplicationSources/{appSourceId}/sharedRoles/ (`customApplicationSourcesSharedRoles_patchMany`) */
export const customApplicationSourcesSharedRolesPatchMany: DatarobotEndpoints['customApplicationSourcesSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['appSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download Custom Application Source version files as a zip archive by app source ID */
/** Official: GET /api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/archive/ (`customApplicationSourcesVersionsArchive_list`) */
export const customApplicationSourcesVersionsArchiveList: DatarobotEndpoints['customApplicationSourcesVersionsArchiveList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/archive/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['appSourceId', 'appSourceVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsArchiveList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsArchiveList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a custom application source version by app source ID */
/** Official: POST /api/v2/customApplicationSources/{appSourceId}/versions/ (`customApplicationSourcesVersions_create`) */
export const customApplicationSourcesVersionsCreate: DatarobotEndpoints['customApplicationSourcesVersionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['appSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a custom application source version if it is still mutable by app source ID */
/** Official: DELETE /api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/ (`customApplicationSourcesVersions_delete`) */
export const customApplicationSourcesVersionsDelete: DatarobotEndpoints['customApplicationSourcesVersionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['appSourceId', 'appSourceVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the custom application source version by app source ID */
/** Official: POST /api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/fromCodespace/ (`customApplicationSourcesVersionsFromCodespace_create`) */
export const customApplicationSourcesVersionsFromCodespaceCreate: DatarobotEndpoints['customApplicationSourcesVersionsFromCodespaceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/fromCodespace/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['appSourceId', 'appSourceVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsFromCodespaceCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsFromCodespaceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a file by app source ID */
/** Official: GET /api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/items/{itemId}/ (`customApplicationSourcesVersionsItems_retrieve`) */
export const customApplicationSourcesVersionsItemsRetrieve: DatarobotEndpoints['customApplicationSourcesVersionsItemsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/items/{itemId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['appSourceId', 'appSourceVersionId', 'itemId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsItemsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsItemsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Paginated list of custom application source versions of the specified by app source ID */
/** Official: GET /api/v2/customApplicationSources/{appSourceId}/versions/ (`customApplicationSourcesVersions_list`) */
export const customApplicationSourcesVersionsList: DatarobotEndpoints['customApplicationSourcesVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['appSourceId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a custom application source version by app source ID */
/** Official: PATCH /api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/ (`customApplicationSourcesVersions_patch`) */
export const customApplicationSourcesVersionsPatch: DatarobotEndpoints['customApplicationSourcesVersionsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['appSourceId', 'appSourceVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a custom application source version by app source ID */
/** Official: GET /api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/ (`customApplicationSourcesVersions_retrieve`) */
export const customApplicationSourcesVersionsRetrieve: DatarobotEndpoints['customApplicationSourcesVersionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['appSourceId', 'appSourceVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a codespace by app source ID */
/** Official: POST /api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/toCodespace/ (`customApplicationSourcesVersionsToCodespace_create`) */
export const customApplicationSourcesVersionsToCodespaceCreate: DatarobotEndpoints['customApplicationSourcesVersionsToCodespaceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplicationSources/{appSourceId}/versions/{appSourceVersionId}/toCodespace/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['appSourceId', 'appSourceVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsToCodespaceCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplicationSources.customApplicationSourcesVersionsToCodespaceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
