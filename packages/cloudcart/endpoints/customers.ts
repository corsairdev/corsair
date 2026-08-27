import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createCustomer: CloudcartEndpoints['createCustomer'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createCustomer']>('customers', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.createCustomer', { ...input }, 'completed');
	return result;
};

export const getCustomer: CloudcartEndpoints['getCustomer'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getCustomer']>(`customers/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.getCustomer', { ...input }, 'completed');
	return result;
};

export const listCustomers: CloudcartEndpoints['listCustomers'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listCustomers']>('customers', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.listCustomers', { ...input }, 'completed');
	return result;
};

export const updateCustomer: CloudcartEndpoints['updateCustomer'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateCustomer']>(`customers/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.updateCustomer', { ...input }, 'completed');
	return result;
};

export const deleteCustomer: CloudcartEndpoints['deleteCustomer'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteCustomer']>(`customers/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.customers.deleteCustomer', { ...input }, 'completed');
	return result;
};

export const createCustomerGroup: CloudcartEndpoints['createCustomerGroup'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createCustomerGroup']>('customer-groups', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.createCustomerGroup', { ...input }, 'completed');
	return result;
};

export const getCustomerGroup: CloudcartEndpoints['getCustomerGroup'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getCustomerGroup']>(`customer-groups/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.getCustomerGroup', { ...input }, 'completed');
	return result;
};

export const listCustomerGroups: CloudcartEndpoints['listCustomerGroups'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listCustomerGroups']>('customer-groups', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.listCustomerGroups', { ...input }, 'completed');
	return result;
};

export const getCustomerGroupsCustomers: CloudcartEndpoints['getCustomerGroupsCustomers'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getCustomerGroupsCustomers']>(`customer-groups/${encodeURIComponent(String(id))}/customers`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.getCustomerGroupsCustomers', { ...input }, 'completed');
	return result;
};

export const updateCustomerGroup: CloudcartEndpoints['updateCustomerGroup'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateCustomerGroup']>(`customer-groups/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.updateCustomerGroup', { ...input }, 'completed');
	return result;
};

export const deleteCustomerGroup: CloudcartEndpoints['deleteCustomerGroup'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteCustomerGroup']>(`customer-groups/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.customers.deleteCustomerGroup', { ...input }, 'completed');
	return result;
};

export const createCustomerBillingAddress: CloudcartEndpoints['createCustomerBillingAddress'] = async (ctx, input) => {
	const { customer_id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createCustomerBillingAddress']>(`customers/${encodeURIComponent(String(customer_id))}/billing-addresses`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.createCustomerBillingAddress', { ...input }, 'completed');
	return result;
};

export const getCustomerBillingAddress: CloudcartEndpoints['getCustomerBillingAddress'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getCustomerBillingAddress']>(`customer-billing-addresses/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.getCustomerBillingAddress', { ...input }, 'completed');
	return result;
};

export const listCustomerBillingAddresses: CloudcartEndpoints['listCustomerBillingAddresses'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listCustomerBillingAddresses']>('customer-billing-addresses', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.listCustomerBillingAddresses', { ...input }, 'completed');
	return result;
};

export const updateCustomerBillingAddress: CloudcartEndpoints['updateCustomerBillingAddress'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateCustomerBillingAddress']>(`customer-billing-addresses/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.updateCustomerBillingAddress', { ...input }, 'completed');
	return result;
};

export const deleteCustomerBillingAddress: CloudcartEndpoints['deleteCustomerBillingAddress'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteCustomerBillingAddress']>(`customer-billing-addresses/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.customers.deleteCustomerBillingAddress', { ...input }, 'completed');
	return result;
};

export const createCustomerShippingAddress: CloudcartEndpoints['createCustomerShippingAddress'] = async (ctx, input) => {
	const { customer_id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createCustomerShippingAddress']>(`customers/${encodeURIComponent(String(customer_id))}/shipping-addresses`, ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.createCustomerShippingAddress', { ...input }, 'completed');
	return result;
};

export const getCustomerShippingAddress: CloudcartEndpoints['getCustomerShippingAddress'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getCustomerShippingAddress']>(`customer-shipping-addresses/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.getCustomerShippingAddress', { ...input }, 'completed');
	return result;
};

export const listCustomerShippingAddresses: CloudcartEndpoints['listCustomerShippingAddresses'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listCustomerShippingAddresses']>('customer-shipping-addresses', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.listCustomerShippingAddresses', { ...input }, 'completed');
	return result;
};

export const updateCustomerShippingAddress: CloudcartEndpoints['updateCustomerShippingAddress'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateCustomerShippingAddress']>(`customer-shipping-addresses/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.updateCustomerShippingAddress', { ...input }, 'completed');
	return result;
};

export const deleteCustomerShippingAddress: CloudcartEndpoints['deleteCustomerShippingAddress'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteCustomerShippingAddress']>(`customer-shipping-addresses/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.customers.deleteCustomerShippingAddress', { ...input }, 'completed');
	return result;
};

export const createCustomerTag: CloudcartEndpoints['createCustomerTag'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createCustomerTag']>('customer-tags', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.createCustomerTag', { ...input }, 'completed');
	return result;
};

export const getCustomerTag: CloudcartEndpoints['getCustomerTag'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getCustomerTag']>(`customer-tags/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.getCustomerTag', { ...input }, 'completed');
	return result;
};

export const listCustomerTags: CloudcartEndpoints['listCustomerTags'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listCustomerTags']>('customer-tags', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.listCustomerTags', { ...input }, 'completed');
	return result;
};

export const updateCustomerTag: CloudcartEndpoints['updateCustomerTag'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateCustomerTag']>(`customer-tags/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.customers.updateCustomerTag', { ...input }, 'completed');
	return result;
};

export const deleteCustomerTag: CloudcartEndpoints['deleteCustomerTag'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteCustomerTag']>(`customer-tags/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.customers.deleteCustomerTag', { ...input }, 'completed');
	return result;
};
