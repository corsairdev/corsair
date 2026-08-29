import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateRedirectInputSchema,
	CreateVendorInputSchema,
	DeleteRedirectInputSchema,
	DeleteVendorInputSchema,
	GetPaymentMethodsInputSchema,
	GetShippingMethodsInputSchema,
	GetVendorInputSchema,
	ListPaymentProvidersInputSchema,
	ListRedirectsInputSchema,
	ListShippingProvidersInputSchema,
	ListVendorsInputSchema,
	UpdateVendorInputSchema,
} from './types';

export const createVendor: CloudcartEndpoints['createVendor'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.createVendor',
		inputSchema: CreateVendorInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createVendor,
		method: 'POST',
		path: 'vendors',
	});

export const getVendor: CloudcartEndpoints['getVendor'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.getVendor',
		inputSchema: GetVendorInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getVendor,
		path: (parsed) => `vendors/${pathId(parsed.id)}`,
	});

export const listVendors: CloudcartEndpoints['listVendors'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.listVendors',
		inputSchema: ListVendorsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listVendors,
		path: 'vendors',
	});

export const updateVendor: CloudcartEndpoints['updateVendor'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.updateVendor',
		inputSchema: UpdateVendorInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateVendor,
		method: 'PATCH',
		path: (parsed) => `vendors/${pathId(parsed.id)}`,
	});

export const deleteVendor: CloudcartEndpoints['deleteVendor'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.deleteVendor',
		inputSchema: DeleteVendorInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteVendor,
		method: 'DELETE',
		path: (parsed) => `vendors/${pathId(parsed.id)}`,
	});

export const createRedirect: CloudcartEndpoints['createRedirect'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.createRedirect',
		inputSchema: CreateRedirectInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createRedirect,
		method: 'POST',
		path: 'redirects',
	});

export const listRedirects: CloudcartEndpoints['listRedirects'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.listRedirects',
		inputSchema: ListRedirectsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listRedirects,
		path: 'redirects',
	});

export const deleteRedirect: CloudcartEndpoints['deleteRedirect'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.deleteRedirect',
		inputSchema: DeleteRedirectInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteRedirect,
		method: 'DELETE',
		path: (parsed) => `redirects/${pathId(parsed.id)}`,
	});

export const getPaymentMethods: CloudcartEndpoints['getPaymentMethods'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.getPaymentMethods',
		inputSchema: GetPaymentMethodsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getPaymentMethods,
		path: 'payment-methods',
	});

export const listPaymentProviders: CloudcartEndpoints['listPaymentProviders'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.misc.listPaymentProviders',
			inputSchema: ListPaymentProvidersInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.listPaymentProviders,
			path: 'payment-providers',
		});

export const getShippingMethods: CloudcartEndpoints['getShippingMethods'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.misc.getShippingMethods',
		inputSchema: GetShippingMethodsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getShippingMethods,
		path: 'shipping-methods',
	});

export const listShippingProviders: CloudcartEndpoints['listShippingProviders'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.misc.listShippingProviders',
			inputSchema: ListShippingProvidersInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.listShippingProviders,
			path: 'shipping-providers',
		});
