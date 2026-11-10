import { defineEndpoint } from './factory';

export const create = defineEndpoint('hooks.create');
export const deleteHook = defineEndpoint('hooks.delete');

export const endpoints = {
	create,
	delete: deleteHook,
} as const;
