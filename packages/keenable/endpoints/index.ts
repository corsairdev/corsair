import { fetch } from './fetch';
import { search } from './search';

export const Search = {
	post: search,
};

export const Fetch = {
	get: fetch,
};

export * from './types';
