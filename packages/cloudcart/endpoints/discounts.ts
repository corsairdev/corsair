import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateDiscountCodeInputSchema,
	CreateDiscountInputSchema,
	CreateProductToDiscountInputSchema,
	DeleteDiscountCodeInputSchema,
	DeleteDiscountInputSchema,
	DeleteProductToDiscountInputSchema,
	GenerateDiscountCodesInputSchema,
	ListDiscountCodesInputSchema,
	UpdateDiscountCodeInputSchema,
} from './types';

export const createDiscount: CloudcartEndpoints['createDiscount'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.discounts.createDiscount',
		inputSchema: CreateDiscountInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createDiscount,
		method: 'POST',
		path: 'discounts',
	});

export const deleteDiscount: CloudcartEndpoints['deleteDiscount'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.discounts.deleteDiscount',
		inputSchema: DeleteDiscountInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteDiscount,
		method: 'DELETE',
		path: (parsed) => `discounts/${pathId(parsed.id)}`,
	});

export const createDiscountCode: CloudcartEndpoints['createDiscountCode'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.discounts.createDiscountCode',
		inputSchema: CreateDiscountCodeInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createDiscountCode,
		method: 'POST',
		path: 'discount-codes',
	});

export const listDiscountCodes: CloudcartEndpoints['listDiscountCodes'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.discounts.listDiscountCodes',
		inputSchema: ListDiscountCodesInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listDiscountCodes,
		path: 'discount-codes',
	});

export const updateDiscountCode: CloudcartEndpoints['updateDiscountCode'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.discounts.updateDiscountCode',
		inputSchema: UpdateDiscountCodeInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateDiscountCode,
		method: 'PATCH',
		path: (parsed) => `discount-codes/${pathId(parsed.id)}`,
	});

export const deleteDiscountCode: CloudcartEndpoints['deleteDiscountCode'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.discounts.deleteDiscountCode',
		inputSchema: DeleteDiscountCodeInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteDiscountCode,
		method: 'DELETE',
		path: (parsed) => `discount-codes/${pathId(parsed.id)}`,
	});

export const generateDiscountCodes: CloudcartEndpoints['generateDiscountCodes'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.discounts.generateDiscountCodes',
			inputSchema: GenerateDiscountCodesInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.generateDiscountCodes,
			method: 'POST',
			path: 'discount-codes/generate',
		});

export const createProductToDiscount: CloudcartEndpoints['createProductToDiscount'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.discounts.createProductToDiscount',
			inputSchema: CreateProductToDiscountInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.createProductToDiscount,
			method: 'POST',
			path: (parsed) => `products/${pathId(parsed.id)}/discounts`,
		});

export const deleteProductToDiscount: CloudcartEndpoints['deleteProductToDiscount'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.discounts.deleteProductToDiscount',
			inputSchema: DeleteProductToDiscountInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.deleteProductToDiscount,
			method: 'DELETE',
			path: (parsed) =>
				`products/${pathId(parsed.id)}/discounts/${pathId(parsed.discount_id)}`,
		});
