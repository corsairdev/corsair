import { logEventFromContext } from 'corsair/core';
import { makeBoxheroRequest } from '../client';
import type { BoxheroEndpoints } from '../index.ts';
import type { BoxheroEndpointOutputs } from './types';

export const listItems: BoxheroEndpoints['itemsList'] = async (ctx, input) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['itemsList']
	>('/v1/items', ctx.key, {
		method: 'GET',
		query: {
			item_ids: input?.item_ids,
			location_ids: input?.location_ids,
			cursor: input?.cursor,
			limit: input?.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'boxhero.items.list',
		input ?? {},
		'completed',
	);
	return response;
};

export const getItem: BoxheroEndpoints['itemsGet'] = async (ctx, input) => {
	const response = await makeBoxheroRequest<BoxheroEndpointOutputs['itemsGet']>(
		`/v1/items/${input.item_id}`,
		ctx.key,
		{
			method: 'GET',
			query: { location_ids: input.location_ids },
		},
	);

	await logEventFromContext(ctx, 'boxhero.items.get', input, 'completed');
	return response;
};

export const deleteItem: BoxheroEndpoints['itemsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['itemsDelete']
	>(`/v1/items/${input.item_id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(ctx, 'boxhero.items.delete', input, 'completed');
	return response;
};
