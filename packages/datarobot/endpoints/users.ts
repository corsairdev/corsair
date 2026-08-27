import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create a User and add them */
/** Official: POST /api/v2/users/ (`users_create`) */
export const usersCreate: DatarobotEndpoints['usersCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/users/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.usersCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.users.usersCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Invite multiple users by email */
/** Official: POST /api/v2/users/invite/ (`usersInvite_create`) */
export const usersInviteCreate: DatarobotEndpoints['usersInviteCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/users/invite/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.usersInviteCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.users.usersInviteCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a list of existing users. */
/** Official: GET /api/v2/users/ (`users_list`) */
export const usersList: DatarobotEndpoints['usersList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/users/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'namePart',
			'username',
			'expirationDateLte',
			'activated',
			'invited',
			'orderBy',
			'tenantId',
			'attributionId',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.usersList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.users.usersList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete rate limit usage by ID */
/** Official: DELETE /api/v2/users/{userId}/rateLimitUsage/{resourceName}/ (`usersRateLimitUsage_delete`) */
export const usersRateLimitUsageDelete: DatarobotEndpoints['usersRateLimitUsageDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/users/{userId}/rateLimitUsage/{resourceName}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['userId', 'resourceName'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.usersRateLimitUsageDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.users.usersRateLimitUsageDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Reset resource usage by user ID */
/** Official: DELETE /api/v2/users/{userId}/rateLimitUsage/ (`usersRateLimitUsage_deleteMany`) */
export const usersRateLimitUsageDeleteMany: DatarobotEndpoints['usersRateLimitUsageDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/users/{userId}/rateLimitUsage/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['userId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.usersRateLimitUsageDeleteMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.users.usersRateLimitUsageDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List resource usage by user ID */
/** Official: GET /api/v2/users/{userId}/rateLimitUsage/ (`usersRateLimitUsage_list`) */
export const usersRateLimitUsageList: DatarobotEndpoints['usersRateLimitUsageList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/users/{userId}/rateLimitUsage/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['userId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.usersRateLimitUsageList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.users.usersRateLimitUsageList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve a single user by id by user ID */
/** Official: GET /api/v2/users/{userId}/ (`users_retrieve`) */
export const usersRetrieve: DatarobotEndpoints['usersRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/users/{userId}/', input);
	const { query, body } = splitDatarobotInput(input, ['userId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.usersRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.users.usersRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};
