import { get as usageGet } from './example';
import { search as searchProducts } from './products';
import { stockxSearch, stockxTrends } from './stockx';

export const Usage = {
	get: usageGet,
};

export const Products = {
	search: searchProducts,
};

export const StockX = {
	trends: stockxTrends,
	search: stockxSearch,
};

export * from './types';
