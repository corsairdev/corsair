import {
	get as itemsGet,
	getMaxId as itemsGetMaxId,
	getWithId as itemsGetWithId,
} from './items';
import { getFrontpage, getLatest, getTodays, posts } from './search';
import { getAsk, getBest, getJobs, getNew, getShow, getTop } from './stories';
import { get as updatesGet } from './updates';
import { get as usersGet, getByUsername as usersGetByUsername } from './users';

export const Items = {
	get: itemsGet,
	getWithId: itemsGetWithId,
	getMaxId: itemsGetMaxId,
};

export const Stories = {
	getTop,
	getBest,
	getNew,
	getAsk,
	getShow,
	getJobs,
};

export const Users = {
	get: usersGet,
	getByUsername: usersGetByUsername,
};

export const Search = {
	posts,
	getLatest,
	getFrontpage,
	getTodays,
};

export const Updates = {
	get: updatesGet,
};

export * from './types';
