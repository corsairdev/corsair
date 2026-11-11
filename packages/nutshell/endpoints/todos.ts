import { defineEndpoint } from './factory';

export const todosList = defineEndpoint('todos.list');

export const endpoints = {
	todos: {
		list: todosList,
	},
} as const;
