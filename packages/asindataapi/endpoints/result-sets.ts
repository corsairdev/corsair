import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import { upsertEntity } from './persist';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

export const listResultSets: AsinDataApiEndpoints['resultSetsList'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(input.collection_id)}/results`,
		ctx.key,
		{ method: 'GET' },
	);

	const response = AsinDataApiEndpointOutputSchemas.resultSetsList.parse(raw);

	if (response.results) {
		for (const result of response.results) {
			await upsertEntity(ctx.db.resultSets, String(result.id), {
				...result,
				collection_id: input.collection_id,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'asindataapi.resultSets.list',
		{ collection_id: input.collection_id },
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['resultSetsList'];
};

export const getResultSet: AsinDataApiEndpoints['resultSetsGet'] = async (
	ctx,
	input,
) => {
	const raw = await makeAsinDataApiRequest<unknown>(
		`collections/${encodeURIComponent(input.collection_id)}/results/${input.result_set_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	const response = AsinDataApiEndpointOutputSchemas.resultSetsGet.parse(raw);

	await upsertEntity(ctx.db.resultSets, String(response.result.id), {
		...response.result,
		collection_id: input.collection_id,
	});

	await logEventFromContext(
		ctx,
		'asindataapi.resultSets.get',
		{
			collection_id: input.collection_id,
			result_set_id: input.result_set_id,
		},
		'completed',
	);
	return response as AsinDataApiEndpointOutputs['resultSetsGet'];
};

export const ResultSets = {
	list: listResultSets,
	get: getResultSet,
};
