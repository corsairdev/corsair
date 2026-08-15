import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';

/**
 * List all Result Sets for a Collection.
 *
 * Result Sets are retained for 14 days. Download within that window.
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/results/list
 */
export const listResultSets: AsinDataApiEndpoints['resultSetsList'] = async (
	ctx,
	input,
) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['resultSetsList']
	>(`collections/${input.collectionId}/results`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'asindataapi.resultSets.list',
		{ collectionId: input.collectionId },
		'completed',
	);
	return response;
};

/**
 * Get a specific Result Set with download links.
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/results/get
 */
export const getResultSet: AsinDataApiEndpoints['resultSetsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['resultSetsGet']
	>(`collections/${input.collectionId}/results/${input.resultSetId}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'asindataapi.resultSets.get',
		{
			collectionId: input.collectionId,
			resultSetId: input.resultSetId,
		},
		'completed',
	);
	return response;
};

export const ResultSets = {
	list: listResultSets,
	get: getResultSet,
};
