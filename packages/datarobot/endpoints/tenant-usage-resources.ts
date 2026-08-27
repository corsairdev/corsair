import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get active tenants */
/** Official: GET /api/v2/tenantUsageResources/activeTenants/ (`tenantUsageResourcesActiveTenants_list`) */
export const tenantUsageResourcesActiveTenantsList: DatarobotEndpoints['tenantUsageResourcesActiveTenantsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenantUsageResources/activeTenants/',
			input,
		);
		const { query } = splitDatarobotInput(input, [], ['start', 'end']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantUsageResourcesActiveTenantsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenantUsageResources.tenantUsageResourcesActiveTenantsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get active users */
/** Official: GET /api/v2/tenantUsageResources/activeUsers/ (`tenantUsageResourcesActiveUsers_list`) */
export const tenantUsageResourcesActiveUsersList: DatarobotEndpoints['tenantUsageResourcesActiveUsersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenantUsageResources/activeUsers/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['start', 'end', 'tenantId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantUsageResourcesActiveUsersList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenantUsageResources.tenantUsageResourcesActiveUsersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the available resource categories. */
/** Official: GET /api/v2/tenantUsageResources/categories/ (`tenantUsageResourcesCategories_list`) */
export const tenantUsageResourcesCategoriesList: DatarobotEndpoints['tenantUsageResourcesCategoriesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenantUsageResources/categories/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantUsageResourcesCategoriesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenantUsageResources.tenantUsageResourcesCategoriesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get usage resources grouped by deployment ID. */
/** Official: GET /api/v2/tenantUsageResources/deployments/ (`tenantUsageResourcesDeployments_list`) */
export const tenantUsageResourcesDeploymentsList: DatarobotEndpoints['tenantUsageResourcesDeploymentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenantUsageResources/deployments/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['start', 'end', 'tenantId', 'workloadCategory', 'deploymentId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantUsageResourcesDeploymentsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenantUsageResources.tenantUsageResourcesDeploymentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Export usage */
/** Official: GET /api/v2/tenantUsageResources/export/ (`tenantUsageResourcesExport_list`) */
export const tenantUsageResourcesExportList: DatarobotEndpoints['tenantUsageResourcesExportList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenantUsageResources/export/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['start', 'end', 'userId', 'workloadCategory', 'tenantId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantUsageResourcesExportList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenantUsageResources.tenantUsageResourcesExportList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get usage resources */
/** Official: GET /api/v2/tenantUsageResources/ (`tenantUsageResources_list`) */
export const tenantUsageResourcesList: DatarobotEndpoints['tenantUsageResourcesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/tenantUsageResources/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['start', 'end', 'tenantId', 'userId', 'workloadCategory'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantUsageResourcesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.tenantUsageResources.tenantUsageResourcesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get daily usage over time */
/** Official: GET /api/v2/tenantUsageResources/usageOverTime/ (`tenantUsageResourcesUsageOverTime_list`) */
export const tenantUsageResourcesUsageOverTimeList: DatarobotEndpoints['tenantUsageResourcesUsageOverTimeList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/tenantUsageResources/usageOverTime/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			[],
			['start', 'end', 'tenantId', 'workloadCategory'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.tenantUsageResourcesUsageOverTimeList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.tenantUsageResources.tenantUsageResourcesUsageOverTimeList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
