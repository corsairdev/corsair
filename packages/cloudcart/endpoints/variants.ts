import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateVariantInputSchema,
	CreateVariantOptionInputSchema,
	CreateVariantOptionsInputSchema,
	CreateVariantParameterForVariantInputSchema,
	CreateVariantParameterInputSchema,
	DeleteVariantInputSchema,
	DeleteVariantOptionInputSchema,
	DeleteVariantParameterInputSchema,
	GetVariantInputSchema,
	GetVariantOptionInputSchema,
	GetVariantParameterInputSchema,
	ListVariantOptionsInputSchema,
	ListVariantParametersInputSchema,
	ListVariantsInputSchema,
	UpdateVariantInputSchema,
	UpdateVariantOptionInputSchema,
	UpdateVariantParameterInputSchema,
} from './types';

export const createVariant: CloudcartEndpoints['createVariant'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.createVariant',
		inputSchema: CreateVariantInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createVariant,
		method: 'POST',
		path: (parsed) => `products/${pathId(parsed.product_id)}/variants`,
	});

export const getVariant: CloudcartEndpoints['getVariant'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.getVariant',
		inputSchema: GetVariantInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getVariant,
		path: (parsed) => `variants/${pathId(parsed.id)}`,
	});

export const listVariants: CloudcartEndpoints['listVariants'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.listVariants',
		inputSchema: ListVariantsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listVariants,
		path: 'variants',
	});

export const updateVariant: CloudcartEndpoints['updateVariant'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.updateVariant',
		inputSchema: UpdateVariantInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateVariant,
		method: 'PATCH',
		path: (parsed) => `variants/${pathId(parsed.id)}`,
	});

export const deleteVariant: CloudcartEndpoints['deleteVariant'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.deleteVariant',
		inputSchema: DeleteVariantInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteVariant,
		method: 'DELETE',
		path: (parsed) => `variants/${pathId(parsed.id)}`,
	});

export const createVariantOption: CloudcartEndpoints['createVariantOption'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.createVariantOption',
		inputSchema: CreateVariantOptionInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createVariantOption,
		method: 'POST',
		path: (parsed) => `variants/${pathId(parsed.id)}/options`,
	});

export const createVariantOptions: CloudcartEndpoints['createVariantOptions'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.variants.createVariantOptions',
			inputSchema: CreateVariantOptionsInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.createVariantOptions,
			method: 'POST',
			path: (parsed) => `variant-parameters/${pathId(parsed.id)}/options`,
		});

export const getVariantOption: CloudcartEndpoints['getVariantOption'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.getVariantOption',
		inputSchema: GetVariantOptionInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getVariantOption,
		path: (parsed) => `variant-options/${pathId(parsed.id)}`,
	});

export const listVariantOptions: CloudcartEndpoints['listVariantOptions'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.listVariantOptions',
		inputSchema: ListVariantOptionsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listVariantOptions,
		path: 'variant-options',
	});

export const updateVariantOption: CloudcartEndpoints['updateVariantOption'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.updateVariantOption',
		inputSchema: UpdateVariantOptionInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateVariantOption,
		method: 'PATCH',
		path: (parsed) => `variant-options/${pathId(parsed.id)}`,
	});

export const deleteVariantOption: CloudcartEndpoints['deleteVariantOption'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.deleteVariantOption',
		inputSchema: DeleteVariantOptionInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteVariantOption,
		method: 'DELETE',
		path: (parsed) => `variant-options/${pathId(parsed.id)}`,
	});

export const createVariantParameter: CloudcartEndpoints['createVariantParameter'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.variants.createVariantParameter',
			inputSchema: CreateVariantParameterInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.createVariantParameter,
			method: 'POST',
			path: 'variant-parameters',
		});

export const createVariantParameterForVariant: CloudcartEndpoints['createVariantParameterForVariant'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.variants.createVariantParameterForVariant',
			inputSchema: CreateVariantParameterForVariantInputSchema,
			outputSchema:
				CloudcartEndpointOutputSchemas.createVariantParameterForVariant,
			method: 'POST',
			path: (parsed) => `variants/${pathId(parsed.id)}/parameters`,
		});

export const getVariantParameter: CloudcartEndpoints['getVariantParameter'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.variants.getVariantParameter',
		inputSchema: GetVariantParameterInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getVariantParameter,
		path: (parsed) => `variant-parameters/${pathId(parsed.id)}`,
	});

export const listVariantParameters: CloudcartEndpoints['listVariantParameters'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.variants.listVariantParameters',
			inputSchema: ListVariantParametersInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.listVariantParameters,
			path: 'variant-parameters',
		});

export const updateVariantParameter: CloudcartEndpoints['updateVariantParameter'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.variants.updateVariantParameter',
			inputSchema: UpdateVariantParameterInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.updateVariantParameter,
			method: 'PATCH',
			path: (parsed) => `variant-parameters/${pathId(parsed.id)}`,
		});

export const deleteVariantParameter: CloudcartEndpoints['deleteVariantParameter'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.variants.deleteVariantParameter',
			inputSchema: DeleteVariantParameterInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.deleteVariantParameter,
			method: 'DELETE',
			path: (parsed) => `variant-parameters/${pathId(parsed.id)}`,
		});
