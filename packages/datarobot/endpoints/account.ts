import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve rate limit resource usage. */
/** Official: GET /api/v2/account/rateLimitUsage/ (`accountRateLimitUsage_list`) */
export const accountRateLimitUsageList: DatarobotEndpoints['accountRateLimitUsageList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/account/rateLimitUsage/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.accountRateLimitUsageList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.account.accountRateLimitUsageList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
