import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Delete user notification by user notification ID */
/** Official: DELETE /api/v2/userNotifications/{userNotificationId}/ (`userNotifications_delete`) */
export const userNotificationsDelete: DatarobotEndpoints['userNotificationsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userNotifications/{userNotificationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['userNotificationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userNotificationsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userNotifications.userNotificationsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete all user notifications */
/** Official: DELETE /api/v2/userNotifications/ (`userNotifications_deleteMany`) */
export const userNotificationsDeleteMany: DatarobotEndpoints['userNotificationsDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/userNotifications/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userNotificationsDeleteMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.userNotifications.userNotificationsDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of user notifications. */
/** Official: GET /api/v2/userNotifications/ (`userNotifications_list`) */
export const userNotificationsList: DatarobotEndpoints['userNotificationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/userNotifications/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'isRead'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userNotificationsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userNotifications.userNotificationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Mark as read by user notification ID */
/** Official: PATCH /api/v2/userNotifications/{userNotificationId}/ (`userNotifications_patch`) */
export const userNotificationsPatch: DatarobotEndpoints['userNotificationsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/userNotifications/{userNotificationId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['userNotificationId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userNotificationsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userNotifications.userNotificationsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Mark all as read */
/** Official: PATCH /api/v2/userNotifications/ (`userNotifications_patchMany`) */
export const userNotificationsPatchMany: DatarobotEndpoints['userNotificationsPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/userNotifications/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.userNotificationsPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.userNotifications.userNotificationsPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
