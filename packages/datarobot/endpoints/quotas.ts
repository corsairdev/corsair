import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Create Quotas */
/** Official: POST /api/v2/quotas/ (`quotas_create`) */
export const quotasCreate: DatarobotEndpoints['quotasCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/quotas/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.quotasCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.quotas.quotasCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete Quotas by quota ID */
/** Official: DELETE /api/v2/quotas/{quotaId}/ (`quotas_delete`) */
export const quotasDelete: DatarobotEndpoints['quotasDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/quotas/{quotaId}/', input);
	const { query, body } = splitDatarobotInput(input, ['quotaId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.quotasDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.quotas.quotasDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve Quotas */
/** Official: GET /api/v2/quotas/ (`quotas_list`) */
export const quotasList: DatarobotEndpoints['quotasList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/quotas/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['resourceId', 'resourceType', 'offset', 'limit'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.quotasList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.quotas.quotasList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Modify Quotas by quota ID */
/** Official: PATCH /api/v2/quotas/{quotaId}/ (`quotas_patch`) */
export const quotasPatch: DatarobotEndpoints['quotasPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/quotas/{quotaId}/', input);
	const { query, body } = splitDatarobotInput(input, ['quotaId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.quotasPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.quotas.quotasPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve Quotas by quota ID */
/** Official: GET /api/v2/quotas/{quotaId}/ (`quotas_retrieve`) */
export const quotasRetrieve: DatarobotEndpoints['quotasRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/quotas/{quotaId}/', input);
	const { query, body } = splitDatarobotInput(input, ['quotaId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.quotasRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.quotas.quotasRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};
