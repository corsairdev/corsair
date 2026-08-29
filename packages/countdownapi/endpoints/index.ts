import { get as autocompleteGet } from './autocomplete';
import { get as productGet } from './product';
import { get as searchGet } from './search';

export const Autocomplete = {
	get: autocompleteGet,
};

export const Product = {
	get: productGet,
};

export const Search = {
	get: searchGet,
};

export * from './types';
