import { get as itemsGet, getWithId as itemsGetWithId, getMaxId as itemsGetMaxId } from './items';
import { getTop, getBest, getNew, getAsk, getShow, getJobs } from './stories';
import { get as usersGet, getByUsername as usersGetByUsername } from './users';
import { posts, getLatest, getFrontpage, getTodays } from './search';
import { get as updatesGet } from './updates';

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
