import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Stop wrangling session. */
/** Official: DELETE /api/v2/sparkSessions/ (`sparkSessions_deleteMany`) */
export const sparkSessionsDeleteMany: DatarobotEndpoints['sparkSessionsDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/sparkSessions/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.sparkSessionsDeleteMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.sparkSessions.sparkSessionsDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};
