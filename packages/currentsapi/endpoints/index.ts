import { get as categoriesGet } from './categories';
import { get as languagesGet } from './languages';
import { get as latestGet } from './latest';
import { get as regionsGet } from './regions';
import { get as searchGet } from './search';

export const Search = {
	get: searchGet,
};

export const Latest = {
	get: latestGet,
};

export const Languages = {
	get: languagesGet,
};

export const Regions = {
	get: regionsGet,
};

export const Categories = {
	get: categoriesGet,
};

export * from './types';
