import { defineEndpoint } from './factory';

export const stageSetsList = defineEndpoint('stageSets.list');
export const stageSetsExport = defineEndpoint('stageSets.export');

export const endpoints = {
	stageSets: {
		list: stageSetsList,
		export: stageSetsExport,
	},
} as const;
