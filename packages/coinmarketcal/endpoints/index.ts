import { list as categoriesList } from './categories';
import { get as coinsGet, list as coinsList } from './coins';
import { get as eventsGet, list as eventsList } from './events';

export const Coins = {
	list: coinsList,
	get: coinsGet,
};

export const Events = {
	list: eventsList,
	get: eventsGet,
};

export const Categories = {
	list: categoriesList,
};

export * from './types';
