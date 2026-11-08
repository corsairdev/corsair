import { defineEndpoint } from './factory';

export const productsList = defineEndpoint('products.list');
export const productsDelete = defineEndpoint('products.delete');
export const productsUndelete = defineEndpoint('products.undelete');
export const productsGet = defineEndpoint('products.get');

export const endpoints = {
	products: {
		list: productsList,
		delete: productsDelete,
		undelete: productsUndelete,
		get: productsGet,
	},
} as const;
