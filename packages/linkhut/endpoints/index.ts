import {
	add,
	all,
	dates,
	get,
	lastUpdated,
	recent,
	remove,
	suggest,
} from './posts';
import { get as getTags, remove as removeTag, rename } from './tags';

export const Posts = {
	lastUpdated,
	add,
	remove,
	get,
	recent,
	dates,
	all,
	suggest,
};

export const Tags = { get: getTags, remove: removeTag, rename };

export * from './types';
