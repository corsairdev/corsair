import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** List deleted custom jobs. */
/** Official: GET /api/v2/deletedCustomJobs/ (`deletedCustomJobs_list`) */
export const deletedCustomJobsList: DatarobotEndpoints['deletedCustomJobsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/deletedCustomJobs/', input);
		const { query } = splitDatarobotInput(input, [], ['offset', 'limit']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.deletedCustomJobsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.deletedCustomJobs.deletedCustomJobsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
