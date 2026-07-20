import { get as usageGet } from './example';
import { search as searchProducts } from './products';

export const Usage = {
	get: usageGet,
};

export const Products = {
	search: searchProducts,
};

export * from './types';
