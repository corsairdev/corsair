import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createCategory: CloudcartEndpoints['createCategory'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createCategory']>('categories', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.categories.createCategory', { ...input }, 'completed');
	return result;
};

export const getCategory: CloudcartEndpoints['getCategory'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getCategory']>(`categories/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.categories.getCategory', { ...input }, 'completed');
	return result;
};

export const listCategories: CloudcartEndpoints['listCategories'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listCategories']>('categories', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.categories.listCategories', { ...input }, 'completed');
	return result;
};

export const updateCategory: CloudcartEndpoints['updateCategory'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateCategory']>(`categories/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.categories.updateCategory', { ...input }, 'completed');
	return result;
};

export const deleteCategory: CloudcartEndpoints['deleteCategory'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteCategory']>(`categories/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.categories.deleteCategory', { ...input }, 'completed');
	return result;
};

export const getCategoryProperties: CloudcartEndpoints['getCategoryProperties'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getCategoryProperties']>(`categories/${encodeURIComponent(String(id))}/properties`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.categories.getCategoryProperties', { ...input }, 'completed');
	return result;
};

export const addCategoryProperties: CloudcartEndpoints['addCategoryProperties'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['addCategoryProperties']>(`categories/${encodeURIComponent(String(id))}/properties`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.categories.addCategoryProperties', { ...input }, 'completed');
	return result;
};
