import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const getCart: CloudcartEndpoints['getCart'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['getCart']
	>('cart', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.cart.getCart',
		{ ...input },
		'completed',
	);
	return result;
};

export const addToCart: CloudcartEndpoints['addToCart'] = async (
	ctx,
	input,
) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['addToCart']
	>('cart/items', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.cart.addToCart',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateCartItem: CloudcartEndpoints['updateCartItem'] = async (
	ctx,
	input,
) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['updateCartItem']
	>(`cart/items/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.cart.updateCartItem',
		{ ...input },
		'completed',
	);
	return result;
};

export const removeFromCart: CloudcartEndpoints['removeFromCart'] = async (
	ctx,
	input,
) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['removeFromCart']
	>(`cart/items/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'cloudcart.cart.removeFromCart',
		{ ...input },
		'completed',
	);
	return result;
};

export const clearCart: CloudcartEndpoints['clearCart'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['clearCart']
	>('cart', ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'cloudcart.cart.clearCart',
		{ ...input },
		'completed',
	);
	return result;
};
