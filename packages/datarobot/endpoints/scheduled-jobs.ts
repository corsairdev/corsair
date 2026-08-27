import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** List scheduled deployment batch prediction jobs a user can view */
/** Official: GET /api/v2/scheduledJobs/ (`scheduledJobs_list`) */
export const scheduledJobsList: DatarobotEndpoints['scheduledJobsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/scheduledJobs/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'orderBy',
				'search',
				'deploymentId',
				'typeId',
				'queryByUser',
				'filterEnabled',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.scheduledJobsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.scheduledJobs.scheduledJobsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
