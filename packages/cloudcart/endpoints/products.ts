import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateImageInputSchema,
	CreateLinkedProductsInputSchema,
	CreateProductInputSchema,
	DeleteImageInputSchema,
	DeleteLinkedProductsInputSchema,
	DeleteProductInputSchema,
	GetImageInputSchema,
	GetProductInputSchema,
	GetProductsLinkedProductInputSchema,
	GetProductsLinkedProductsInputSchema,
	GetProductWithRelationsInputSchema,
	ListImagesInputSchema,
	ListProductsInputSchema,
	UpdateLinkedProductInputSchema,
	UpdateProductInputSchema,
} from './types';

export const createProduct: CloudcartEndpoints['createProduct'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.createProduct',
		inputSchema: CreateProductInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createProduct,
		method: 'POST',
		path: 'products',
	});

export const getProduct: CloudcartEndpoints['getProduct'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.getProduct',
		inputSchema: GetProductInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getProduct,
		path: (parsed) => `products/${pathId(parsed.id)}`,
	});

export const getProductWithRelations: CloudcartEndpoints['getProductWithRelations'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.products.getProductWithRelations',
			inputSchema: GetProductWithRelationsInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.getProductWithRelations,
			path: (parsed) => `products/${pathId(parsed.id)}/relations`,
		});

export const listProducts: CloudcartEndpoints['listProducts'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.listProducts',
		inputSchema: ListProductsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listProducts,
		path: 'products',
	});

export const updateProduct: CloudcartEndpoints['updateProduct'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.updateProduct',
		inputSchema: UpdateProductInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateProduct,
		method: 'PATCH',
		path: (parsed) => `products/${pathId(parsed.id)}`,
	});

export const deleteProduct: CloudcartEndpoints['deleteProduct'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.deleteProduct',
		inputSchema: DeleteProductInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteProduct,
		method: 'DELETE',
		path: (parsed) => `products/${pathId(parsed.id)}`,
	});

export const createLinkedProducts: CloudcartEndpoints['createLinkedProducts'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.products.createLinkedProducts',
			inputSchema: CreateLinkedProductsInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.createLinkedProducts,
			method: 'POST',
			path: (parsed) => `products/${pathId(parsed.id)}/linked-products`,
		});

export const getProductsLinkedProduct: CloudcartEndpoints['getProductsLinkedProduct'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.products.getProductsLinkedProduct',
			inputSchema: GetProductsLinkedProductInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.getProductsLinkedProduct,
			path: (parsed) => `products/${pathId(parsed.id)}/linked-product`,
		});

export const getProductsLinkedProducts: CloudcartEndpoints['getProductsLinkedProducts'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.products.getProductsLinkedProducts',
			inputSchema: GetProductsLinkedProductsInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.getProductsLinkedProducts,
			path: (parsed) => `products/${pathId(parsed.id)}/linked-products`,
		});

export const updateLinkedProduct: CloudcartEndpoints['updateLinkedProduct'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.updateLinkedProduct',
		inputSchema: UpdateLinkedProductInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateLinkedProduct,
		method: 'PUT',
		path: (parsed) => `products/${pathId(parsed.id)}/linked-products`,
	});

export const deleteLinkedProducts: CloudcartEndpoints['deleteLinkedProducts'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.products.deleteLinkedProducts',
			inputSchema: DeleteLinkedProductsInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.deleteLinkedProducts,
			method: 'DELETE',
			path: (parsed) => `products/${pathId(parsed.id)}/linked-products`,
		});

export const createImage: CloudcartEndpoints['createImage'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.createImage',
		inputSchema: CreateImageInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createImage,
		method: 'POST',
		path: 'images',
	});

export const getImage: CloudcartEndpoints['getImage'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.getImage',
		inputSchema: GetImageInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getImage,
		path: (parsed) => `images/${pathId(parsed.id)}`,
	});

export const listImages: CloudcartEndpoints['listImages'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.listImages',
		inputSchema: ListImagesInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listImages,
		path: 'images',
	});

export const deleteImage: CloudcartEndpoints['deleteImage'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.products.deleteImage',
		inputSchema: DeleteImageInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteImage,
		method: 'DELETE',
		path: (parsed) => `images/${pathId(parsed.id)}`,
	});
