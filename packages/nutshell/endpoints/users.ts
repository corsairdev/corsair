import { defineEndpoint } from './factory';

export const usersGet = defineEndpoint('users.get');
export const usersList = defineEndpoint('users.list');

export const endpoints = {
	users: {
		get: usersGet,
		list: usersList,
	},
} as const;
