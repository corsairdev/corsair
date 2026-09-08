import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

export const statusList: DatarobotEndpoints['statusList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/status/', input);
	const { query } = splitDatarobotInput(input, [], ['offset', 'limit']);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.statusList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.status.statusList',
		input ?? {},
		'completed',
	);
	return parsed;
};

export const statusRetrieve: DatarobotEndpoints['statusRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/status/{statusId}/', input);
	const { query, body } = splitDatarobotInput(input, ['statusId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.statusRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.status.statusRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};
