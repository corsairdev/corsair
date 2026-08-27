import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Creates a new Batch Monitoring job */
/** Official: POST /api/v2/batchMonitoring/ (`batchMonitoring_create`) */
export const batchMonitoringCreate: DatarobotEndpoints['batchMonitoringCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/batchMonitoring/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.batchMonitoringCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.batchMonitoring.batchMonitoringCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
