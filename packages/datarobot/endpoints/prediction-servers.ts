import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const predictionServersList: DatarobotEndpoints['predictionServersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/predictionServers/', input);
		const { query } = splitDatarobotInput(input, [], ['offset', 'limit']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.predictionServersList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.predictionServers.predictionServersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
