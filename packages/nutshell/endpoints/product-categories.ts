import { defineEndpoint } from './factory';

export const productCategoriesCreate = defineEndpoint(
	'productCategories.create',
);
export const productCategoriesList = defineEndpoint('productCategories.list');
export const productCategoriesGet = defineEndpoint('productCategories.get');

export const endpoints = {
	productCategories: {
		create: productCategoriesCreate,
		list: productCategoriesList,
		get: productCategoriesGet,
	},
} as const;
