import { goatPrices } from './goat';
import { search as searchProducts } from './products';
import { stockxProduct, stockxSearch, stockxTrends } from './stockx';
import { get as usageGet } from './usage';

export const Usage = {
	get: usageGet,
};

export const Products = {
	search: searchProducts,
};

export const StockX = {
	trends: stockxTrends,
	search: stockxSearch,
	product: stockxProduct,
};

export const Goat = {
	prices: goatPrices,
};

export * from './types';
