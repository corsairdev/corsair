import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createProduct: CloudcartEndpoints['createProduct'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createProduct']>('products', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.products.createProduct', { ...input }, 'completed');
	return result;
};

export const getProduct: CloudcartEndpoints['getProduct'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getProduct']>(`products/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.products.getProduct', { ...input }, 'completed');
	return result;
};

export const getProductWithRelations: CloudcartEndpoints['getProductWithRelations'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getProductWithRelations']>(`products/${encodeURIComponent(String(id))}/relations`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.products.getProductWithRelations', { ...input }, 'completed');
	return result;
};

export const listProducts: CloudcartEndpoints['listProducts'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listProducts']>('products', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.products.listProducts', { ...input }, 'completed');
	return result;
};

export const updateProduct: CloudcartEndpoints['updateProduct'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateProduct']>(`products/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.products.updateProduct', { ...input }, 'completed');
	return result;
};

export const deleteProduct: CloudcartEndpoints['deleteProduct'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteProduct']>(`products/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.products.deleteProduct', { ...input }, 'completed');
	return result;
};

export const createLinkedProducts: CloudcartEndpoints['createLinkedProducts'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createLinkedProducts']>(`products/${encodeURIComponent(String(id))}/linked-products`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.products.createLinkedProducts', { ...input }, 'completed');
	return result;
};

export const getProductsLinkedProduct: CloudcartEndpoints['getProductsLinkedProduct'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getProductsLinkedProduct']>(`products/${encodeURIComponent(String(id))}/linked-product`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.products.getProductsLinkedProduct', { ...input }, 'completed');
	return result;
};

export const getProductsLinkedProducts: CloudcartEndpoints['getProductsLinkedProducts'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getProductsLinkedProducts']>(`products/${encodeURIComponent(String(id))}/linked-products`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.products.getProductsLinkedProducts', { ...input }, 'completed');
	return result;
};

export const updateLinkedProduct: CloudcartEndpoints['updateLinkedProduct'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateLinkedProduct']>(`products/${encodeURIComponent(String(id))}/linked-products`, ctx.key, {
		method: 'PUT',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.products.updateLinkedProduct', { ...input }, 'completed');
	return result;
};

export const deleteLinkedProducts: CloudcartEndpoints['deleteLinkedProducts'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteLinkedProducts']>(`products/${encodeURIComponent(String(id))}/linked-products`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.products.deleteLinkedProducts', { ...input }, 'completed');
	return result;
};

export const createImage: CloudcartEndpoints['createImage'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createImage']>('images', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.products.createImage', { ...input }, 'completed');
	return result;
};

export const getImage: CloudcartEndpoints['getImage'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getImage']>(`images/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.products.getImage', { ...input }, 'completed');
	return result;
};

export const listImages: CloudcartEndpoints['listImages'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listImages']>('images', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.products.listImages', { ...input }, 'completed');
	return result;
};

export const deleteImage: CloudcartEndpoints['deleteImage'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteImage']>(`images/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.products.deleteImage', { ...input }, 'completed');
	return result;
};
