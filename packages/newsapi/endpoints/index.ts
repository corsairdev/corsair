import { getEverything } from './articles';
import { getTop } from './headlines';
import { get } from './sources';

export const Articles = {
	getEverything,
};

export const Headlines = {
	getTop,
};

export const Sources = {
	get,
};

export * from './types';
