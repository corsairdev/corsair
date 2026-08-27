import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createVariant: CloudcartEndpoints['createVariant'] = async (ctx, input) => {
	const { product_id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createVariant']>(`products/${encodeURIComponent(String(product_id))}/variants`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.createVariant', { ...input }, 'completed');
	return result;
};

export const getVariant: CloudcartEndpoints['getVariant'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getVariant']>(`variants/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.getVariant', { ...input }, 'completed');
	return result;
};

export const listVariants: CloudcartEndpoints['listVariants'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listVariants']>('variants', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.listVariants', { ...input }, 'completed');
	return result;
};

export const updateVariant: CloudcartEndpoints['updateVariant'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateVariant']>(`variants/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.updateVariant', { ...input }, 'completed');
	return result;
};

export const deleteVariant: CloudcartEndpoints['deleteVariant'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteVariant']>(`variants/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.variants.deleteVariant', { ...input }, 'completed');
	return result;
};

export const createVariantOption: CloudcartEndpoints['createVariantOption'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createVariantOption']>(`variants/${encodeURIComponent(String(id))}/options`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.createVariantOption', { ...input }, 'completed');
	return result;
};

export const createVariantOptions: CloudcartEndpoints['createVariantOptions'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createVariantOptions']>(`variant-parameters/${encodeURIComponent(String(id))}/options`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.createVariantOptions', { ...input }, 'completed');
	return result;
};

export const getVariantOption: CloudcartEndpoints['getVariantOption'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getVariantOption']>(`variant-options/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.getVariantOption', { ...input }, 'completed');
	return result;
};

export const listVariantOptions: CloudcartEndpoints['listVariantOptions'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listVariantOptions']>('variant-options', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.listVariantOptions', { ...input }, 'completed');
	return result;
};

export const updateVariantOption: CloudcartEndpoints['updateVariantOption'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateVariantOption']>(`variant-options/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.updateVariantOption', { ...input }, 'completed');
	return result;
};

export const deleteVariantOption: CloudcartEndpoints['deleteVariantOption'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteVariantOption']>(`variant-options/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.variants.deleteVariantOption', { ...input }, 'completed');
	return result;
};

export const createVariantParameter: CloudcartEndpoints['createVariantParameter'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createVariantParameter']>('variant-parameters', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.createVariantParameter', { ...input }, 'completed');
	return result;
};

export const createVariantParameterForVariant: CloudcartEndpoints['createVariantParameterForVariant'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createVariantParameterForVariant']>(`variants/${encodeURIComponent(String(id))}/parameters`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.createVariantParameterForVariant', { ...input }, 'completed');
	return result;
};

export const getVariantParameter: CloudcartEndpoints['getVariantParameter'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getVariantParameter']>(`variant-parameters/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.getVariantParameter', { ...input }, 'completed');
	return result;
};

export const listVariantParameters: CloudcartEndpoints['listVariantParameters'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listVariantParameters']>('variant-parameters', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.listVariantParameters', { ...input }, 'completed');
	return result;
};

export const updateVariantParameter: CloudcartEndpoints['updateVariantParameter'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateVariantParameter']>(`variant-parameters/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.variants.updateVariantParameter', { ...input }, 'completed');
	return result;
};

export const deleteVariantParameter: CloudcartEndpoints['deleteVariantParameter'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteVariantParameter']>(`variant-parameters/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.variants.deleteVariantParameter', { ...input }, 'completed');
	return result;
};
