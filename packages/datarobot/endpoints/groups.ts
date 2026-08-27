import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a user group. */
/** Official: POST /api/v2/groups/ (`groups_create`) */
export const groupsCreate: DatarobotEndpoints['groupsCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/groups/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.groupsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.groups.groupsCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete a user group by group ID */
/** Official: DELETE /api/v2/groups/{groupId}/ (`groups_delete`) */
export const groupsDelete: DatarobotEndpoints['groupsDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/groups/{groupId}/', input);
	const { query, body } = splitDatarobotInput(input, ['groupId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.groupsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.groups.groupsDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete multiple user groups. */
/** Official: DELETE /api/v2/groups/ (`groups_deleteMany`) */
export const groupsDeleteMany: DatarobotEndpoints['groupsDeleteMany'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/groups/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.groupsDeleteMany.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.groups.groupsDeleteMany',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** List user groups. */
/** Official: GET /api/v2/groups/ (`groups_list`) */
export const groupsList: DatarobotEndpoints['groupsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/groups/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'namePart',
			'groupIds',
			'orgId',
			'userId',
			'excludeUserMembership',
			'orderBy',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.groupsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.groups.groupsList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Update a user group by group ID */
/** Official: PATCH /api/v2/groups/{groupId}/ (`groups_patch`) */
export const groupsPatch: DatarobotEndpoints['groupsPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/groups/{groupId}/', input);
	const { query, body } = splitDatarobotInput(input, ['groupId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.groupsPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.groups.groupsPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve a user group by group ID */
/** Official: GET /api/v2/groups/{groupId}/ (`groups_retrieve`) */
export const groupsRetrieve: DatarobotEndpoints['groupsRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/groups/{groupId}/', input);
	const { query, body } = splitDatarobotInput(input, ['groupId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.groupsRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.groups.groupsRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Add users by group ID */
/** Official: POST /api/v2/groups/{groupId}/users/ (`groupsUsers_create`) */
export const groupsUsersCreate: DatarobotEndpoints['groupsUsersCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/groups/{groupId}/users/', input);
		const { query, body } = splitDatarobotInput(input, ['groupId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.groupsUsersCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.groups.groupsUsersCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Remove users by group ID */
/** Official: DELETE /api/v2/groups/{groupId}/users/ (`groupsUsers_deleteMany`) */
export const groupsUsersDeleteMany: DatarobotEndpoints['groupsUsersDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/groups/{groupId}/users/', input);
		const { query, body } = splitDatarobotInput(input, ['groupId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.groupsUsersDeleteMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.groups.groupsUsersDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List users by group ID */
/** Official: GET /api/v2/groups/{groupId}/users/ (`groupsUsers_list`) */
export const groupsUsersList: DatarobotEndpoints['groupsUsersList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/groups/{groupId}/users/', input);
	const { query } = splitDatarobotInput(
		input,
		['groupId'],
		['offset', 'limit', 'namePart', 'orderBy', 'isActive', 'isAdmin'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.groupsUsersList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.groups.groupsUsersList',
		input ?? {},
		'completed',
	);
	return parsed;
};
