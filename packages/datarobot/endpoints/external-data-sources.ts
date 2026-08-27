import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get the data source's access control list by data source ID */
/** Official: GET /api/v2/externalDataSources/{dataSourceId}/accessControl/ (`externalDataSourcesAccessControl_list`) */
export const externalDataSourcesAccessControlList: DatarobotEndpoints['externalDataSourcesAccessControlList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataSources/{dataSourceId}/accessControl/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['dataSourceId'],
			['offset', 'limit', 'username', 'userId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesAccessControlList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesAccessControlList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the data source's access controls by data source ID */
/** Official: PATCH /api/v2/externalDataSources/{dataSourceId}/accessControl/ (`externalDataSourcesAccessControl_patchMany`) */
export const externalDataSourcesAccessControlPatchMany: DatarobotEndpoints['externalDataSourcesAccessControlPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataSources/{dataSourceId}/accessControl/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesAccessControlPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesAccessControlPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a data source. */
/** Official: POST /api/v2/externalDataSources/ (`externalDataSources_create`) */
export const externalDataSourcesCreate: DatarobotEndpoints['externalDataSourcesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/externalDataSources/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete the data source by data source ID */
/** Official: DELETE /api/v2/externalDataSources/{dataSourceId}/ (`externalDataSources_delete`) */
export const externalDataSourcesDelete: DatarobotEndpoints['externalDataSourcesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataSources/{dataSourceId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List data sources. */
/** Official: GET /api/v2/externalDataSources/ (`externalDataSources_list`) */
export const externalDataSourcesList: DatarobotEndpoints['externalDataSourcesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/externalDataSources/', input);
		const { query } = splitDatarobotInput(input, [], ['type']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the data source by data source ID */
/** Official: PATCH /api/v2/externalDataSources/{dataSourceId}/ (`externalDataSources_patch`) */
export const externalDataSourcesPatch: DatarobotEndpoints['externalDataSourcesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataSources/{dataSourceId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Describe data source permissions by data source ID */
/** Official: GET /api/v2/externalDataSources/{dataSourceId}/permissions/ (`externalDataSourcesPermissions_list`) */
export const externalDataSourcesPermissionsList: DatarobotEndpoints['externalDataSourcesPermissionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataSources/{dataSourceId}/permissions/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesPermissionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesPermissionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Data source details by data source ID */
/** Official: GET /api/v2/externalDataSources/{dataSourceId}/ (`externalDataSources_retrieve`) */
export const externalDataSourcesRetrieve: DatarobotEndpoints['externalDataSourcesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataSources/{dataSourceId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve shared roles by ID */
/** Official: GET /api/v2/externalDataSources/{dataSourceId}/sharedRoles/ (`externalDataSourcesSharedRoles_list`) */
export const externalDataSourcesSharedRolesList: DatarobotEndpoints['externalDataSourcesSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataSources/{dataSourceId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['dataSourceId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify data source shared roles by data source ID */
/** Official: PATCH /api/v2/externalDataSources/{dataSourceId}/sharedRoles/ (`externalDataSourcesSharedRoles_patchMany`) */
export const externalDataSourcesSharedRolesPatchMany: DatarobotEndpoints['externalDataSourcesSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalDataSources/{dataSourceId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['dataSourceId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalDataSourcesSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalDataSources.externalDataSourcesSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
