import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Delete a task by status ID */
/** Official: DELETE /api/v2/status/{statusId}/ (`status_delete`) */
export const statusDelete: DatarobotEndpoints['statusDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/status/{statusId}/', input);
	const { query, body } = splitDatarobotInput(input, ['statusId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.statusDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.status.statusDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** List tasks */
/** Official: GET /api/v2/status/ (`status_list`) */
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

/** Get task status by status ID */
/** Official: GET /api/v2/status/{statusId}/ (`status_retrieve`) */
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
