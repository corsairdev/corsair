import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** The list of event types and groups the user can include */
/** Official: GET /api/v2/notificationEvents/ (`notificationEvents_list`) */
export const notificationEventsList: DatarobotEndpoints['notificationEventsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notificationEvents/', input);
		const { query } = splitDatarobotInput(input, [], ['relatedEntityType']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notificationEventsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notificationEvents.notificationEventsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
