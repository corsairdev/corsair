import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a secure configuration. */
/** Official: POST /api/v2/secureConfigs/ (`secureConfigs_create`) */
export const secureConfigsCreate: DatarobotEndpoints['secureConfigsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/secureConfigs/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.secureConfigsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.secureConfigs.secureConfigsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete secure configuration by secure config ID */
/** Official: DELETE /api/v2/secureConfigs/{secureConfigId}/ (`secureConfigs_delete`) */
export const secureConfigsDelete: DatarobotEndpoints['secureConfigsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/secureConfigs/{secureConfigId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['secureConfigId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.secureConfigsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.secureConfigs.secureConfigsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a list of secure configurations. */
/** Official: GET /api/v2/secureConfigs/ (`secureConfigs_list`) */
export const secureConfigsList: DatarobotEndpoints['secureConfigsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/secureConfigs/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'orderBy', 'name', 'namePart', 'schemas'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.secureConfigsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.secureConfigs.secureConfigsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a secure configuration by secure config ID */
/** Official: PATCH /api/v2/secureConfigs/{secureConfigId}/ (`secureConfigs_patch`) */
export const secureConfigsPatch: DatarobotEndpoints['secureConfigsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/secureConfigs/{secureConfigId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['secureConfigId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.secureConfigsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.secureConfigs.secureConfigsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a secure configuration by secure config ID */
/** Official: GET /api/v2/secureConfigs/{secureConfigId}/ (`secureConfigs_retrieve`) */
export const secureConfigsRetrieve: DatarobotEndpoints['secureConfigsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/secureConfigs/{secureConfigId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['secureConfigId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.secureConfigsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.secureConfigs.secureConfigsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of users, groups, and organizations that have access by secure config ID */
/** Official: GET /api/v2/secureConfigs/{secureConfigId}/sharedRoles/ (`secureConfigsSharedRoles_list`) */
export const secureConfigsSharedRolesList: DatarobotEndpoints['secureConfigsSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/secureConfigs/{secureConfigId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['secureConfigId'],
			['offset', 'limit', 'name', 'id', 'shareRecipientType'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.secureConfigsSharedRolesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.secureConfigs.secureConfigsSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Share a secure configuration by secure config ID */
/** Official: PATCH /api/v2/secureConfigs/{secureConfigId}/sharedRoles/ (`secureConfigsSharedRoles_patchMany`) */
export const secureConfigsSharedRolesPatchMany: DatarobotEndpoints['secureConfigsSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/secureConfigs/{secureConfigId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['secureConfigId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.secureConfigsSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.secureConfigs.secureConfigsSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a list of values by secure config ID */
/** Official: GET /api/v2/secureConfigs/{secureConfigId}/values/ (`secureConfigsValues_list`) */
export const secureConfigsValuesList: DatarobotEndpoints['secureConfigsValuesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/secureConfigs/{secureConfigId}/values/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['secureConfigId'],
			['consumer'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.secureConfigsValuesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.secureConfigs.secureConfigsValuesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
