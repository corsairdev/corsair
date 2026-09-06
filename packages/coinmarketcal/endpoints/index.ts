import { list as categoriesList } from './categories';
import { list as eventsList } from './events';
import { get as coinsList } from './example';

export const Example = {
	get: coinsList,
};

export const Events = {
	list: eventsList,
};

export const Categories = {
	list: categoriesList,
};

export * from './types';
