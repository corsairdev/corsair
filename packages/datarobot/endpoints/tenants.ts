import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get tenant active users by tenant ID */
/** Official: GET /api/v2/tenants/{tenantId}/activeUsers/ (`tenantsActiveUsers_list`) */
export const tenantsActiveUsersList: DatarobotEndpoints['tenantsActiveUsersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenants/{tenantId}/activeUsers/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['tenantId'],
			['start', 'end'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantsActiveUsersList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.tenants.tenantsActiveUsersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the available resource categories by tenant ID */
/** Official: GET /api/v2/tenants/{tenantId}/resourceCategories/ (`tenantsResourceCategories_list`) */
export const tenantsResourceCategoriesList: DatarobotEndpoints['tenantsResourceCategoriesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenants/{tenantId}/resourceCategories/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['tenantId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantsResourceCategoriesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenants.tenantsResourceCategoriesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Export tenant usage by tenant ID */
/** Official: GET /api/v2/tenants/{tenantId}/usageExport/ (`tenantsUsageExport_list`) */
export const tenantsUsageExportList: DatarobotEndpoints['tenantsUsageExportList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenants/{tenantId}/usageExport/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['tenantId'],
			['start', 'end', 'userId', 'workloadCategory'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantsUsageExportList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.tenants.tenantsUsageExportList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get tenant usage by tenant ID */
/** Official: GET /api/v2/tenants/{tenantId}/usage/ (`tenantsUsage_list`) */
export const tenantsUsageList: DatarobotEndpoints['tenantsUsageList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/tenants/{tenantId}/usage/', input);
	const { query } = splitDatarobotInput(
		input,
		['tenantId'],
		['start', 'end', 'userId', 'workloadCategory'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.tenantsUsageList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.tenants.tenantsUsageList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Export CPU/GPU resource utilization. */
/** Official: GET /api/v2/tenants/utilizationResources/export/ (`tenantsUtilizationResourcesExport_list`) */
export const tenantsUtilizationResourcesExportList: DatarobotEndpoints['tenantsUtilizationResourcesExportList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenants/utilizationResources/export/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['start', 'end', 'resolution', 'filename'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantsUtilizationResourcesExportList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenants.tenantsUtilizationResourcesExportList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get CPU/GPU resource utilization. */
/** Official: GET /api/v2/tenants/utilizationResources/ (`tenantsUtilizationResources_list`) */
export const tenantsUtilizationResourcesList: DatarobotEndpoints['tenantsUtilizationResourcesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenants/utilizationResources/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantsUtilizationResourcesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenants.tenantsUtilizationResourcesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get CPU/GPU resource utilization by resourcetype */
/** Official: GET /api/v2/tenants/utilizationResources/{resourceType}/ (`tenantsUtilizationResources_retrieve`) */
export const tenantsUtilizationResourcesRetrieve: DatarobotEndpoints['tenantsUtilizationResourcesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenants/utilizationResources/{resourceType}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['resourceType'],
			['start', 'end', 'resolution'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantsUtilizationResourcesRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenants.tenantsUtilizationResourcesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
