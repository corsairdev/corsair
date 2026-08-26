import { logEventFromContext } from 'corsair/core';
import { makeBoxheroRequest } from '../client';
import type { BoxheroEndpoints } from '../index.ts';
import type { BoxheroEndpointOutputs } from './types';

export const listItemAttributes: BoxheroEndpoints['itemAttributesList'] =
	async (ctx, input) => {
		const response = await makeBoxheroRequest<
			BoxheroEndpointOutputs['itemAttributesList']
		>('/v1/item-attrs', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'boxhero.itemAttributes.list',
			input,
			'completed',
		);
		return response;
	};

export const getItemAttribute: BoxheroEndpoints['itemAttributesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['itemAttributesGet']
	>(`/v1/item-attrs/${input.attr_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'boxhero.itemAttributes.get',
		input,
		'completed',
	);
	return response;
};
