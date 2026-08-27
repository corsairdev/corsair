import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createVendor: CloudcartEndpoints['createVendor'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createVendor']>('vendors', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.createVendor', { ...input }, 'completed');
	return result;
};

export const getVendor: CloudcartEndpoints['getVendor'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getVendor']>(`vendors/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.getVendor', { ...input }, 'completed');
	return result;
};

export const listVendors: CloudcartEndpoints['listVendors'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listVendors']>('vendors', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.listVendors', { ...input }, 'completed');
	return result;
};

export const updateVendor: CloudcartEndpoints['updateVendor'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateVendor']>(`vendors/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.updateVendor', { ...input }, 'completed');
	return result;
};

export const deleteVendor: CloudcartEndpoints['deleteVendor'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteVendor']>(`vendors/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.misc.deleteVendor', { ...input }, 'completed');
	return result;
};

export const createRedirect: CloudcartEndpoints['createRedirect'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createRedirect']>('redirects', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.createRedirect', { ...input }, 'completed');
	return result;
};

export const listRedirects: CloudcartEndpoints['listRedirects'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listRedirects']>('redirects', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.listRedirects', { ...input }, 'completed');
	return result;
};

export const deleteRedirect: CloudcartEndpoints['deleteRedirect'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteRedirect']>(`redirects/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.misc.deleteRedirect', { ...input }, 'completed');
	return result;
};

export const getPaymentMethods: CloudcartEndpoints['getPaymentMethods'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getPaymentMethods']>('payment-methods', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.getPaymentMethods', { ...input }, 'completed');
	return result;
};

export const listPaymentProviders: CloudcartEndpoints['listPaymentProviders'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listPaymentProviders']>('payment-providers', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.listPaymentProviders', { ...input }, 'completed');
	return result;
};

export const getShippingMethods: CloudcartEndpoints['getShippingMethods'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getShippingMethods']>('shipping-methods', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.getShippingMethods', { ...input }, 'completed');
	return result;
};

export const listShippingProviders: CloudcartEndpoints['listShippingProviders'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listShippingProviders']>('shipping-providers', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.misc.listShippingProviders', { ...input }, 'completed');
	return result;
};
