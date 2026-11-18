import { defineEndpoint } from './factory';

export const industriesGet = defineEndpoint('industries.get');
export const industriesList = defineEndpoint('industries.list');

export const endpoints = {
	industries: {
		get: industriesGet,
		list: industriesList,
	},
} as const;
