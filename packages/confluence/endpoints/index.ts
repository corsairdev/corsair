import { get as pagesGet } from './pages';
import { search as pagesSearch } from './search';
import { list as spacesList } from './spaces';

export const Pages = {
	get: pagesGet,
	search: pagesSearch,
};

export const Spaces = {
	list: spacesList,
};

export * from './types';
