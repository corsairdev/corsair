import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	AddCategoryPropertiesInputSchema,
	CloudcartEndpointOutputSchemas,
	CreateCategoryInputSchema,
	DeleteCategoryInputSchema,
	GetCategoryInputSchema,
	GetCategoryPropertiesInputSchema,
	ListCategoriesInputSchema,
	UpdateCategoryInputSchema,
} from './types';

export const createCategory: CloudcartEndpoints['createCategory'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.categories.createCategory',
		inputSchema: CreateCategoryInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createCategory,
		method: 'POST',
		path: 'categories',
	});

export const getCategory: CloudcartEndpoints['getCategory'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.categories.getCategory',
		inputSchema: GetCategoryInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getCategory,
		path: (parsed) => `categories/${pathId(parsed.id)}`,
	});

export const listCategories: CloudcartEndpoints['listCategories'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.categories.listCategories',
		inputSchema: ListCategoriesInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listCategories,
		path: 'categories',
	});

export const updateCategory: CloudcartEndpoints['updateCategory'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.categories.updateCategory',
		inputSchema: UpdateCategoryInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateCategory,
		method: 'PATCH',
		path: (parsed) => `categories/${pathId(parsed.id)}`,
	});

export const deleteCategory: CloudcartEndpoints['deleteCategory'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.categories.deleteCategory',
		inputSchema: DeleteCategoryInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteCategory,
		method: 'DELETE',
		path: (parsed) => `categories/${pathId(parsed.id)}`,
	});

export const getCategoryProperties: CloudcartEndpoints['getCategoryProperties'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.categories.getCategoryProperties',
			inputSchema: GetCategoryPropertiesInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.getCategoryProperties,
			path: (parsed) => `categories/${pathId(parsed.id)}/properties`,
		});

export const addCategoryProperties: CloudcartEndpoints['addCategoryProperties'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.categories.addCategoryProperties',
			inputSchema: AddCategoryPropertiesInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.addCategoryProperties,
			method: 'POST',
			path: (parsed) => `categories/${pathId(parsed.id)}/properties`,
		});
