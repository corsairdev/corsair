import { defineEndpoint } from './factory';

export const outcomesList = defineEndpoint('outcomes.list');
export const outcomesGet = defineEndpoint('outcomes.get');

export const endpoints = {
	outcomes: {
		list: outcomesList,
		get: outcomesGet,
	},
} as const;
