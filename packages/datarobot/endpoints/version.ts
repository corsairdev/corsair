import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const versionList: DatarobotEndpoints['versionList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/version/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.versionList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.version.versionList',
		input ?? {},
		'completed',
	);
	return parsed;
};
