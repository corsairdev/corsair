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

export const getCart: CloudcartEndpoints['getCart'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.cart.getCart',
		inputSchema: GetCartInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getCart,
		path: 'cart',
	});

export const addToCart: CloudcartEndpoints['addToCart'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.cart.addToCart',
		inputSchema: AddToCartInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.addToCart,
		method: 'POST',
		path: 'cart/items',
	});

export const updateCartItem: CloudcartEndpoints['updateCartItem'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.cart.updateCartItem',
		inputSchema: UpdateCartItemInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateCartItem,
		method: 'PATCH',
		path: (parsed) => `cart/items/${pathId(parsed.id)}`,
	});

export const removeFromCart: CloudcartEndpoints['removeFromCart'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.cart.removeFromCart',
		inputSchema: RemoveFromCartInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.removeFromCart,
		method: 'DELETE',
		path: (parsed) => `cart/items/${pathId(parsed.id)}`,
	});

export const clearCart: CloudcartEndpoints['clearCart'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.cart.clearCart',
		inputSchema: ClearCartInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.clearCart,
		method: 'DELETE',
		path: 'cart',
	});
