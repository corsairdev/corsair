import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

export const collectionsList: HexEndpoints['collectionsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.collectionsList.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['collectionsList']>(
		`/v1/collections`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				after: parsedInput.after,
				before: parsedInput.before,
				limit: parsedInput.limit,
				sortBy: parsedInput.sortBy,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.collectionsList.parse(response);
	await logEventFromContext(
		ctx,
		'hex.collections.list',
		{ operation: 'collections.list' },
		'completed',
	);
	return parsed;
};

export const collectionsCreate: HexEndpoints['collectionsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.collectionsCreate.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['collectionsCreate']
	>(`/v1/collections`, ctx.key, {
		method: 'POST',
		body: {
			sharing: parsedInput.sharing,
			description: parsedInput.description,
			name: parsedInput.name,
		},
	});
	const parsed = HexEndpointOutputSchemas.collectionsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.collections.create',
		{ operation: 'collections.create' },
		'completed',
	);
	return parsed;
};

export const collectionsGet: HexEndpoints['collectionsGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.collectionsGet.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['collectionsGet']>(
		`/v1/collections/${encodeURIComponent(String(parsedInput.collectionId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HexEndpointOutputSchemas.collectionsGet.parse(response);
	await logEventFromContext(
		ctx,
		'hex.collections.get',
		{ operation: 'collections.get' },
		'completed',
	);
	return parsed;
};

export const collectionsUpdate: HexEndpoints['collectionsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.collectionsUpdate.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['collectionsUpdate']
	>(
		`/v1/collections/${encodeURIComponent(String(parsedInput.collectionId))}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				sharing: parsedInput.sharing,
				description: parsedInput.description,
				name: parsedInput.name,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.collectionsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.collections.update',
		{ operation: 'collections.update' },
		'completed',
	);
	return parsed;
};
