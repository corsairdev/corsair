import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createProperty: CloudcartEndpoints['createProperty'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createProperty']>('properties', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.createProperty', { ...input }, 'completed');
	return result;
};

export const getProperty: CloudcartEndpoints['getProperty'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getProperty']>(`properties/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.getProperty', { ...input }, 'completed');
	return result;
};

export const listProperties: CloudcartEndpoints['listProperties'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listProperties']>('properties', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.listProperties', { ...input }, 'completed');
	return result;
};

export const updateProperty: CloudcartEndpoints['updateProperty'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateProperty']>(`properties/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.updateProperty', { ...input }, 'completed');
	return result;
};

export const deleteProperty: CloudcartEndpoints['deleteProperty'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteProperty']>(`properties/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.properties.deleteProperty', { ...input }, 'completed');
	return result;
};

export const createPropertyOption: CloudcartEndpoints['createPropertyOption'] = async (ctx, input) => {
	const { property_id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createPropertyOption']>(`properties/${encodeURIComponent(String(property_id))}/options`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.createPropertyOption', { ...input }, 'completed');
	return result;
};

export const getPropertyOption: CloudcartEndpoints['getPropertyOption'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getPropertyOption']>(`properties/options/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.getPropertyOption', { ...input }, 'completed');
	return result;
};

export const listPropertyOptions: CloudcartEndpoints['listPropertyOptions'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listPropertyOptions']>('properties/options', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.listPropertyOptions', { ...input }, 'completed');
	return result;
};

export const updatePropertyOption: CloudcartEndpoints['updatePropertyOption'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updatePropertyOption']>(`properties/options/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.updatePropertyOption', { ...input }, 'completed');
	return result;
};

export const deletePropertyOption: CloudcartEndpoints['deletePropertyOption'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deletePropertyOption']>(`properties/options/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.properties.deletePropertyOption', { ...input }, 'completed');
	return result;
};

export const createProductsPropertyOptions: CloudcartEndpoints['createProductsPropertyOptions'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createProductsPropertyOptions']>(`products/${encodeURIComponent(String(id))}/property-options`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.createProductsPropertyOptions', { ...input }, 'completed');
	return result;
};

export const getPropertyOptionsRelationship: CloudcartEndpoints['getPropertyOptionsRelationship'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getPropertyOptionsRelationship']>(`products/${encodeURIComponent(String(id))}/property-options`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.properties.getPropertyOptionsRelationship', { ...input }, 'completed');
	return result;
};
