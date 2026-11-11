import { defineEndpoint } from './factory';

export const competitorsList = defineEndpoint('competitors.list');
export const competitorsGet = defineEndpoint('competitors.get');

export const endpoints = {
	competitors: {
		list: competitorsList,
		get: competitorsGet,
	},
} as const;
