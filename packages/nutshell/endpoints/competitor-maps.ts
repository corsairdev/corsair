import { defineEndpoint } from './factory';

export const competitorMapsDelete = defineEndpoint('competitorMaps.delete');
export const competitorMapsGet = defineEndpoint('competitorMaps.get');
export const competitorMapsUpdate = defineEndpoint('competitorMaps.update');
export const competitorMapsList = defineEndpoint('competitorMaps.list');

export const endpoints = {
	competitorMaps: {
		delete: competitorMapsDelete,
		get: competitorMapsGet,
		update: competitorMapsUpdate,
		list: competitorMapsList,
	},
} as const;
