import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateCustomerBillingAddressInputSchema,
	CreateCustomerGroupInputSchema,
	CreateCustomerInputSchema,
	CreateCustomerShippingAddressInputSchema,
	CreateCustomerTagInputSchema,
	DeleteCustomerBillingAddressInputSchema,
	DeleteCustomerGroupInputSchema,
	DeleteCustomerInputSchema,
	DeleteCustomerShippingAddressInputSchema,
	DeleteCustomerTagInputSchema,
	GetCustomerBillingAddressInputSchema,
	GetCustomerGroupInputSchema,
	GetCustomerGroupsCustomersInputSchema,
	GetCustomerInputSchema,
	GetCustomerShippingAddressInputSchema,
	GetCustomerTagInputSchema,
	ListCustomerBillingAddressesInputSchema,
	ListCustomerGroupsInputSchema,
	ListCustomerShippingAddressesInputSchema,
	ListCustomersInputSchema,
	ListCustomerTagsInputSchema,
	UpdateCustomerBillingAddressInputSchema,
	UpdateCustomerGroupInputSchema,
	UpdateCustomerInputSchema,
	UpdateCustomerShippingAddressInputSchema,
	UpdateCustomerTagInputSchema,
} from './types';

export const createCustomer: CloudcartEndpoints['createCustomer'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.createCustomer',
		inputSchema: CreateCustomerInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createCustomer,
		method: 'POST',
		path: 'customers',
	});

export const getCustomer: CloudcartEndpoints['getCustomer'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.getCustomer',
		inputSchema: GetCustomerInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getCustomer,
		path: (parsed) => `customers/${pathId(parsed.id)}`,
	});

export const listCustomers: CloudcartEndpoints['listCustomers'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.listCustomers',
		inputSchema: ListCustomersInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listCustomers,
		path: 'customers',
	});

export const updateCustomer: CloudcartEndpoints['updateCustomer'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.updateCustomer',
		inputSchema: UpdateCustomerInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateCustomer,
		method: 'PATCH',
		path: (parsed) => `customers/${pathId(parsed.id)}`,
	});

export const deleteCustomer: CloudcartEndpoints['deleteCustomer'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.deleteCustomer',
		inputSchema: DeleteCustomerInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteCustomer,
		method: 'DELETE',
		path: (parsed) => `customers/${pathId(parsed.id)}`,
	});

export const createCustomerGroup: CloudcartEndpoints['createCustomerGroup'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.createCustomerGroup',
		inputSchema: CreateCustomerGroupInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createCustomerGroup,
		method: 'POST',
		path: 'customer-groups',
	});

export const getCustomerGroup: CloudcartEndpoints['getCustomerGroup'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.getCustomerGroup',
		inputSchema: GetCustomerGroupInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getCustomerGroup,
		path: (parsed) => `customer-groups/${pathId(parsed.id)}`,
	});

export const listCustomerGroups: CloudcartEndpoints['listCustomerGroups'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.listCustomerGroups',
		inputSchema: ListCustomerGroupsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listCustomerGroups,
		path: 'customer-groups',
	});

export const getCustomerGroupsCustomers: CloudcartEndpoints['getCustomerGroupsCustomers'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.getCustomerGroupsCustomers',
			inputSchema: GetCustomerGroupsCustomersInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.getCustomerGroupsCustomers,
			path: (parsed) => `customer-groups/${pathId(parsed.id)}/customers`,
		});

export const updateCustomerGroup: CloudcartEndpoints['updateCustomerGroup'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.updateCustomerGroup',
		inputSchema: UpdateCustomerGroupInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateCustomerGroup,
		method: 'PATCH',
		path: (parsed) => `customer-groups/${pathId(parsed.id)}`,
	});

export const deleteCustomerGroup: CloudcartEndpoints['deleteCustomerGroup'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.deleteCustomerGroup',
		inputSchema: DeleteCustomerGroupInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteCustomerGroup,
		method: 'DELETE',
		path: (parsed) => `customer-groups/${pathId(parsed.id)}`,
	});

export const createCustomerBillingAddress: CloudcartEndpoints['createCustomerBillingAddress'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.createCustomerBillingAddress',
			inputSchema: CreateCustomerBillingAddressInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.createCustomerBillingAddress,
			method: 'POST',
			path: (parsed) =>
				`customers/${pathId(parsed.customer_id)}/billing-addresses`,
		});

export const getCustomerBillingAddress: CloudcartEndpoints['getCustomerBillingAddress'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.getCustomerBillingAddress',
			inputSchema: GetCustomerBillingAddressInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.getCustomerBillingAddress,
			path: (parsed) => `customer-billing-addresses/${pathId(parsed.id)}`,
		});

export const listCustomerBillingAddresses: CloudcartEndpoints['listCustomerBillingAddresses'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.listCustomerBillingAddresses',
			inputSchema: ListCustomerBillingAddressesInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.listCustomerBillingAddresses,
			path: 'customer-billing-addresses',
		});

export const updateCustomerBillingAddress: CloudcartEndpoints['updateCustomerBillingAddress'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.updateCustomerBillingAddress',
			inputSchema: UpdateCustomerBillingAddressInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.updateCustomerBillingAddress,
			method: 'PATCH',
			path: (parsed) => `customer-billing-addresses/${pathId(parsed.id)}`,
		});

export const deleteCustomerBillingAddress: CloudcartEndpoints['deleteCustomerBillingAddress'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.deleteCustomerBillingAddress',
			inputSchema: DeleteCustomerBillingAddressInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.deleteCustomerBillingAddress,
			method: 'DELETE',
			path: (parsed) => `customer-billing-addresses/${pathId(parsed.id)}`,
		});

export const createCustomerShippingAddress: CloudcartEndpoints['createCustomerShippingAddress'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.createCustomerShippingAddress',
			inputSchema: CreateCustomerShippingAddressInputSchema,
			outputSchema:
				CloudcartEndpointOutputSchemas.createCustomerShippingAddress,
			method: 'POST',
			path: (parsed) =>
				`customers/${pathId(parsed.customer_id)}/shipping-addresses`,
		});

export const getCustomerShippingAddress: CloudcartEndpoints['getCustomerShippingAddress'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.getCustomerShippingAddress',
			inputSchema: GetCustomerShippingAddressInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.getCustomerShippingAddress,
			path: (parsed) => `customer-shipping-addresses/${pathId(parsed.id)}`,
		});

export const listCustomerShippingAddresses: CloudcartEndpoints['listCustomerShippingAddresses'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.listCustomerShippingAddresses',
			inputSchema: ListCustomerShippingAddressesInputSchema,
			outputSchema:
				CloudcartEndpointOutputSchemas.listCustomerShippingAddresses,
			path: 'customer-shipping-addresses',
		});

export const updateCustomerShippingAddress: CloudcartEndpoints['updateCustomerShippingAddress'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.updateCustomerShippingAddress',
			inputSchema: UpdateCustomerShippingAddressInputSchema,
			outputSchema:
				CloudcartEndpointOutputSchemas.updateCustomerShippingAddress,
			method: 'PATCH',
			path: (parsed) => `customer-shipping-addresses/${pathId(parsed.id)}`,
		});

export const deleteCustomerShippingAddress: CloudcartEndpoints['deleteCustomerShippingAddress'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.customers.deleteCustomerShippingAddress',
			inputSchema: DeleteCustomerShippingAddressInputSchema,
			outputSchema:
				CloudcartEndpointOutputSchemas.deleteCustomerShippingAddress,
			method: 'DELETE',
			path: (parsed) => `customer-shipping-addresses/${pathId(parsed.id)}`,
		});

export const createCustomerTag: CloudcartEndpoints['createCustomerTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.createCustomerTag',
		inputSchema: CreateCustomerTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createCustomerTag,
		method: 'POST',
		path: 'customer-tags',
	});

export const getCustomerTag: CloudcartEndpoints['getCustomerTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.getCustomerTag',
		inputSchema: GetCustomerTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getCustomerTag,
		path: (parsed) => `customer-tags/${pathId(parsed.id)}`,
	});

export const listCustomerTags: CloudcartEndpoints['listCustomerTags'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.listCustomerTags',
		inputSchema: ListCustomerTagsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listCustomerTags,
		path: 'customer-tags',
	});

export const updateCustomerTag: CloudcartEndpoints['updateCustomerTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.updateCustomerTag',
		inputSchema: UpdateCustomerTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateCustomerTag,
		method: 'PATCH',
		path: (parsed) => `customer-tags/${pathId(parsed.id)}`,
	});

export const deleteCustomerTag: CloudcartEndpoints['deleteCustomerTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.customers.deleteCustomerTag',
		inputSchema: DeleteCustomerTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteCustomerTag,
		method: 'DELETE',
		path: (parsed) => `customer-tags/${pathId(parsed.id)}`,
	});
