import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	AddToCartInputSchema,
	ClearCartInputSchema,
	CloudcartEndpointOutputSchemas,
	GetCartInputSchema,
	RemoveFromCartInputSchema,
	UpdateCartItemInputSchema,
} from './types';

export const addToCart: CloudcartEndpoints['addToCart'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.carts.addToCart',
		inputSchema: AddToCartInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.addToCart,
		method: 'POST',
		path: 'carts',
	});

export const getCart: CloudcartEndpoints['getCart'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.carts.getCart',
		inputSchema: GetCartInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getCart,
		path: (parsed) =>
			parsed.cart_id ? `carts/${pathId(parsed.cart_id)}` : 'carts',
	});

export const updateCartItem: CloudcartEndpoints['updateCartItem'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.carts.updateCartItem',
		inputSchema: UpdateCartItemInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateCartItem,
		method: 'PATCH',
		path: (parsed) => `carts/${pathId(parsed.product_id)}`,
	});

export const removeFromCart: CloudcartEndpoints['removeFromCart'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.carts.removeFromCart',
		inputSchema: RemoveFromCartInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.removeFromCart,
		method: 'DELETE',
		path: (parsed) => `carts/${pathId(parsed.product_id)}`,
	});

export const clearCart: CloudcartEndpoints['clearCart'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.carts.clearCart',
		inputSchema: ClearCartInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.clearCart,
		method: 'DELETE',
		path: 'carts',
	});
