import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a custom application */
/** Official: POST /api/v2/customApplications/ (`customApplications_create`) */
export const customApplicationsCreate: DatarobotEndpoints['customApplicationsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/customApplications/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete an application by application ID */
/** Official: DELETE /api/v2/customApplications/{applicationId}/ (`customApplications_delete`) */
export const customApplicationsDelete: DatarobotEndpoints['customApplicationsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['applicationId'],
			['hardDelete'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an application's publication history by application ID */
/** Official: GET /api/v2/customApplications/{applicationId}/history/ (`customApplicationsHistory_list`) */
export const customApplicationsHistoryList: DatarobotEndpoints['customApplicationsHistoryList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/history/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['applicationId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsHistoryList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsHistoryList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of applications created by the currently authenticated user. */
/** Official: GET /api/v2/customApplications/ (`customApplications_list`) */
export const customApplicationsList: DatarobotEndpoints['customApplicationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/customApplications/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'orderBy',
				'name',
				'customApplicationSourceId',
				'includeSourceLabels',
				'requireSource',
				'createdBy',
				'status',
				'updatedAtStartTs',
				'updatedAtEndTs',
				'externalAccessEnabled',
				'resourceLabel',
				'replicasMin',
				'replicasMax',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an application's logs by application ID */
/** Official: GET /api/v2/customApplications/{applicationId}/logs/ (`customApplicationsLogs_list`) */
export const customApplicationsLogsList: DatarobotEndpoints['customApplicationsLogsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/logs/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsLogsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsLogsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Migrate To Workload by application ID */
/** Official: POST /api/v2/customApplications/{applicationId}/migrateToWorkload/ (`customApplicationsMigrateToWorkload_create`) */
export const customApplicationsMigrateToWorkloadCreate: DatarobotEndpoints['customApplicationsMigrateToWorkloadCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/migrateToWorkload/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsMigrateToWorkloadCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsMigrateToWorkloadCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update an application's name by application ID */
/** Official: PATCH /api/v2/customApplications/{applicationId}/ (`customApplications_patch`) */
export const customApplicationsPatch: DatarobotEndpoints['customApplicationsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an application by application ID */
/** Official: GET /api/v2/customApplications/{applicationId}/ (`customApplications_retrieve`) */
export const customApplicationsRetrieve: DatarobotEndpoints['customApplicationsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['applicationId'],
			['includeSourceLabels'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of users, groups and organizations that have an access by application ID */
/** Official: GET /api/v2/customApplications/{applicationId}/sharedRoles/ (`customApplicationsSharedRoles_list`) */
export const customApplicationsSharedRolesList: DatarobotEndpoints['customApplicationsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['applicationId'],
			['id', 'offset', 'limit', 'name', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Share an application by application ID */
/** Official: PATCH /api/v2/customApplications/{applicationId}/sharedRoles/ (`customApplicationsSharedRoles_patchMany`) */
export const customApplicationsSharedRolesPatchMany: DatarobotEndpoints['customApplicationsSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['applicationId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download an application's access logs by application ID */
/** Official: GET /api/v2/customApplications/{applicationId}/usages/download/ (`customApplicationsUsagesDownload_list`) */
export const customApplicationsUsagesDownloadList: DatarobotEndpoints['customApplicationsUsagesDownloadList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/usages/download/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['applicationId'],
			['start', 'end'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsUsagesDownloadList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsUsagesDownloadList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve an application's usages by application ID */
/** Official: GET /api/v2/customApplications/{applicationId}/usages/ (`customApplicationsUsages_list`) */
export const customApplicationsUsagesList: DatarobotEndpoints['customApplicationsUsagesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/customApplications/{applicationId}/usages/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['applicationId'],
			['offset', 'limit', 'start', 'end'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.customApplicationsUsagesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.customApplications.customApplicationsUsagesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
