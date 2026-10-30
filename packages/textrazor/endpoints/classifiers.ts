import type { TextrazorEndpoints } from '../index';
import { textrazorCall } from './call';
import {
	DeleteClassifierCategoryInputSchema,
	DeleteClassifierCategoryOutputSchema,
	DeleteClassifierInputSchema,
	DeleteClassifierOutputSchema,
	GetClassifierCategoryInputSchema,
	GetClassifierCategoryOutputSchema,
	ListClassifierCategoriesInputSchema,
	ListClassifierCategoriesOutputSchema,
	PutClassifierInputSchema,
	PutClassifierOutputSchema,
} from './types';

function classifierPath(id: string): string {
	return `categories/${encodeURIComponent(id)}`;
}

export const put: TextrazorEndpoints['putClassifier'] = async (ctx, input) => {
	const parsed = PutClassifierInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.classifiers.put',
		classifierPath(parsed.id),
		'PUT',
		parsed,
		{ json: parsed.categories },
	);
	const output = PutClassifierOutputSchema.parse(result);
	for (const category of parsed.categories) {
		try {
			await ctx.db.categories.upsertByEntityId(
				`${parsed.id}:${category.categoryId}`,
				{
					id: `${parsed.id}:${category.categoryId}`,
					categoryId: category.categoryId,
					label: category.label,
					query: category.query,
					classifierId: parsed.id,
					fetchedAt: new Date(),
				},
			);
		} catch (error) {
			console.warn('[textrazor] Failed to cache category:', error);
		}
	}
	return output;
};

export const remove: TextrazorEndpoints['deleteClassifier'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteClassifierInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.classifiers.delete',
		classifierPath(parsed.id),
		'DELETE',
		parsed,
	);
	return DeleteClassifierOutputSchema.parse(result);
};

export const listCategories: TextrazorEndpoints['listClassifierCategories'] =
	async (ctx, input) => {
		const parsed = ListClassifierCategoriesInputSchema.parse(input);
		const result = await textrazorCall(
			ctx,
			'textrazor.classifiers.listCategories',
			`${classifierPath(parsed.id)}/_all`,
			'GET',
			parsed,
			{
				query: {
					limit: parsed.limit,
					offset: parsed.offset,
				},
			},
		);
		return ListClassifierCategoriesOutputSchema.parse(result);
	};

export const getCategory: TextrazorEndpoints['getClassifierCategory'] = async (
	ctx,
	input,
) => {
	const parsed = GetClassifierCategoryInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.classifiers.getCategory',
		`${classifierPath(parsed.id)}/${encodeURIComponent(parsed.categoryId)}`,
		'GET',
		parsed,
	);
	return GetClassifierCategoryOutputSchema.parse(result);
};

export const deleteCategory: TextrazorEndpoints['deleteClassifierCategory'] =
	async (ctx, input) => {
		const parsed = DeleteClassifierCategoryInputSchema.parse(input);
		const result = await textrazorCall(
			ctx,
			'textrazor.classifiers.deleteCategory',
			`${classifierPath(parsed.id)}/${encodeURIComponent(parsed.categoryId)}`,
			'DELETE',
			parsed,
		);
		return DeleteClassifierCategoryOutputSchema.parse(result);
	};
