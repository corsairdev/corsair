import type { ClassmarkerEndpoints } from '..';
import { runClassmarkerEndpoint } from './helpers';
import {
	CategoryMutationOutputSchema,
	CreateCategoryInputSchema,
	CreateParentCategoryInputSchema,
	GetAllCategoriesInputSchema,
	GetAllCategoriesOutputSchema,
	ParentCategoryMutationOutputSchema,
	UpdateCategoryInputSchema,
	UpdateParentCategoryInputSchema,
} from './types';

export const getAllCategories: ClassmarkerEndpoints['getAllCategories'] =
	async (ctx, input) =>
		runClassmarkerEndpoint(ctx, {
			operation: 'getAllCategories',
			path: '/v1/categories.json',
			input,
			inputSchema: GetAllCategoriesInputSchema,
			outputSchema: GetAllCategoriesOutputSchema,
		});

export const createParentCategory: ClassmarkerEndpoints['createParentCategory'] =
	async (ctx, input) => {
		const parsedInput = CreateParentCategoryInputSchema.parse(input);
		return runClassmarkerEndpoint(ctx, {
			operation: 'createParentCategory',
			path: '/v1/categories/parent_category.json',
			method: 'POST',
			input: parsedInput,
			inputSchema: CreateParentCategoryInputSchema,
			outputSchema: ParentCategoryMutationOutputSchema,
			query: {
				verify_only: parsedInput.verify_only,
			},
			body: {
				parent_category_name: parsedInput.parent_category_name,
			},
		});
	};

export const updateParentCategory: ClassmarkerEndpoints['updateParentCategory'] =
	async (ctx, input) => {
		const parsedInput = UpdateParentCategoryInputSchema.parse(input);
		return runClassmarkerEndpoint(ctx, {
			operation: 'updateParentCategory',
			path: `/v1/categories/parent_category/${parsedInput.parent_category_id}.json`,
			method: 'PUT',
			input: parsedInput,
			inputSchema: UpdateParentCategoryInputSchema,
			outputSchema: ParentCategoryMutationOutputSchema,
			query: {
				verify_only: parsedInput.verify_only,
			},
			body: {
				parent_category_name: parsedInput.parent_category_name,
			},
			logPayload: {
				parent_category_id: parsedInput.parent_category_id,
				parent_category_name: parsedInput.parent_category_name,
				verify_only: parsedInput.verify_only,
			},
		});
	};

export const createCategory: ClassmarkerEndpoints['createCategory'] = async (
	ctx,
	input,
) => {
	const parsedInput = CreateCategoryInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'createCategory',
		path: '/v1/categories/category.json',
		method: 'POST',
		input: parsedInput,
		inputSchema: CreateCategoryInputSchema,
		outputSchema: CategoryMutationOutputSchema,
		query: {
			verify_only: parsedInput.verify_only,
		},
		body: {
			category_name: parsedInput.category_name,
			parent_category_id: parsedInput.parent_category_id,
		},
	});
};

export const updateCategory: ClassmarkerEndpoints['updateCategory'] = async (
	ctx,
	input,
) => {
	const parsedInput = UpdateCategoryInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'updateCategory',
		path: `/v1/categories/category/${parsedInput.category_id}.json`,
		method: 'PUT',
		input: parsedInput,
		inputSchema: UpdateCategoryInputSchema,
		outputSchema: CategoryMutationOutputSchema,
		query: {
			verify_only: parsedInput.verify_only,
		},
		body: {
			category_name: parsedInput.category_name,
			parent_category_id: parsedInput.parent_category_id,
		},
		logPayload: {
			category_id: parsedInput.category_id,
			category_name: parsedInput.category_name,
			parent_category_id: parsedInput.parent_category_id,
			verify_only: parsedInput.verify_only,
		},
	});
};
