import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Post a remote deployment event. */
/** Official: POST /api/v2/remoteEvents/ (`remoteEvents_create`) */
export const remoteEventsCreate: DatarobotEndpoints['remoteEventsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/remoteEvents/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.remoteEventsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.remoteEvents.remoteEventsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
