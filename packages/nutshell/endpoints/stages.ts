import { defineEndpoint } from './factory';

export const stagesList = defineEndpoint('stages.list');

export const endpoints = {
	stages: {
		list: stagesList,
	},
} as const;
