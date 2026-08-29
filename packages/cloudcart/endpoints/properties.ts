import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateProductsPropertyOptionsInputSchema,
	CreatePropertyInputSchema,
	CreatePropertyOptionInputSchema,
	DeletePropertyInputSchema,
	DeletePropertyOptionInputSchema,
	GetPropertyInputSchema,
	GetPropertyOptionInputSchema,
	GetPropertyOptionsRelationshipInputSchema,
	ListPropertiesInputSchema,
	ListPropertyOptionsInputSchema,
	UpdatePropertyInputSchema,
	UpdatePropertyOptionInputSchema,
} from './types';

export const createProperty: CloudcartEndpoints['createProperty'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.properties.createProperty',
		inputSchema: CreatePropertyInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createProperty,
		method: 'POST',
		path: 'properties',
	});

export const getProperty: CloudcartEndpoints['getProperty'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.properties.getProperty',
		inputSchema: GetPropertyInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getProperty,
		path: (parsed) => `properties/${pathId(parsed.id)}`,
	});

export const listProperties: CloudcartEndpoints['listProperties'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.properties.listProperties',
		inputSchema: ListPropertiesInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listProperties,
		path: 'properties',
	});

export const updateProperty: CloudcartEndpoints['updateProperty'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.properties.updateProperty',
		inputSchema: UpdatePropertyInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateProperty,
		method: 'PATCH',
		path: (parsed) => `properties/${pathId(parsed.id)}`,
	});

export const deleteProperty: CloudcartEndpoints['deleteProperty'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.properties.deleteProperty',
		inputSchema: DeletePropertyInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteProperty,
		method: 'DELETE',
		path: (parsed) => `properties/${pathId(parsed.id)}`,
	});

export const createPropertyOption: CloudcartEndpoints['createPropertyOption'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.properties.createPropertyOption',
			inputSchema: CreatePropertyOptionInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.createPropertyOption,
			method: 'POST',
			path: (parsed) => `properties/${pathId(parsed.property_id)}/options`,
		});

export const getPropertyOption: CloudcartEndpoints['getPropertyOption'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.properties.getPropertyOption',
		inputSchema: GetPropertyOptionInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getPropertyOption,
		path: (parsed) => `properties/options/${pathId(parsed.id)}`,
	});

export const listPropertyOptions: CloudcartEndpoints['listPropertyOptions'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.properties.listPropertyOptions',
		inputSchema: ListPropertyOptionsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listPropertyOptions,
		path: 'properties/options',
	});

export const updatePropertyOption: CloudcartEndpoints['updatePropertyOption'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.properties.updatePropertyOption',
			inputSchema: UpdatePropertyOptionInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.updatePropertyOption,
			method: 'PATCH',
			path: (parsed) => `properties/options/${pathId(parsed.id)}`,
		});

export const deletePropertyOption: CloudcartEndpoints['deletePropertyOption'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.properties.deletePropertyOption',
			inputSchema: DeletePropertyOptionInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.deletePropertyOption,
			method: 'DELETE',
			path: (parsed) => `properties/options/${pathId(parsed.id)}`,
		});

export const createProductsPropertyOptions: CloudcartEndpoints['createProductsPropertyOptions'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.properties.createProductsPropertyOptions',
			inputSchema: CreateProductsPropertyOptionsInputSchema,
			outputSchema:
				CloudcartEndpointOutputSchemas.createProductsPropertyOptions,
			method: 'POST',
			path: (parsed) => `products/${pathId(parsed.id)}/property-options`,
		});

export const getPropertyOptionsRelationship: CloudcartEndpoints['getPropertyOptionsRelationship'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.properties.getPropertyOptionsRelationship',
			inputSchema: GetPropertyOptionsRelationshipInputSchema,
			outputSchema:
				CloudcartEndpointOutputSchemas.getPropertyOptionsRelationship,
			path: (parsed) => `products/${pathId(parsed.id)}/property-options`,
		});
