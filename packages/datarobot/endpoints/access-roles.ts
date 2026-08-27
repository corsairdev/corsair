import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a new custom access role. */
/** Official: POST /api/v2/accessRoles/ (`accessRoles_create`) */
export const accessRolesCreate: DatarobotEndpoints['accessRolesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/accessRoles/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.accessRolesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.accessRoles.accessRolesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a custom access role by role ID */
/** Official: DELETE /api/v2/accessRoles/{roleId}/ (`accessRoles_delete`) */
export const accessRolesDelete: DatarobotEndpoints['accessRolesDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/accessRoles/{roleId}/', input);
		const { query, body } = splitDatarobotInput(input, ['roleId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.accessRolesDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.accessRoles.accessRolesDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a list of access roles. */
/** Official: GET /api/v2/accessRoles/ (`accessRoles_list`) */
export const accessRolesList: DatarobotEndpoints['accessRolesList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/accessRoles/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['offset', 'limit', 'organizationId', 'globalRoles'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.accessRolesList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.accessRoles.accessRolesList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update a custom access role by role ID */
/** Official: PATCH /api/v2/accessRoles/{roleId}/ (`accessRoles_patch`) */
export const accessRolesPatch: DatarobotEndpoints['accessRolesPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/accessRoles/{roleId}/', input);
	const { query, body } = splitDatarobotInput(input, ['roleId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.accessRolesPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.accessRoles.accessRolesPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve an access role by role ID */
/** Official: GET /api/v2/accessRoles/{roleId}/ (`accessRoles_retrieve`) */
export const accessRolesRetrieve: DatarobotEndpoints['accessRolesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/accessRoles/{roleId}/', input);
		const { query, body } = splitDatarobotInput(input, ['roleId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.accessRolesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.accessRoles.accessRolesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a list of the users using this access role by role ID */
/** Official: GET /api/v2/accessRoles/{roleId}/users/ (`accessRolesUsers_list`) */
export const accessRolesUsersList: DatarobotEndpoints['accessRolesUsersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/accessRoles/{roleId}/users/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['roleId'],
			['offset', 'limit', 'namePart'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.accessRolesUsersList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.accessRoles.accessRolesUsersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
