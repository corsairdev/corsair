import { defineEndpoint } from './factory';

export const marketsGet = defineEndpoint('markets.get');
export const marketsList = defineEndpoint('markets.list');

export const endpoints = {
	markets: {
		get: marketsGet,
		list: marketsList,
	},
} as const;
