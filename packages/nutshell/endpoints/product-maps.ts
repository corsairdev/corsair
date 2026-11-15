import { defineEndpoint } from './factory';

export const productMapsUpdate = defineEndpoint('productMaps.update');
export const productMapsList = defineEndpoint('productMaps.list');
export const productMapsGet = defineEndpoint('productMaps.get');
export const productMapsDelete = defineEndpoint('productMaps.delete');

export const endpoints = {
	productMaps: {
		update: productMapsUpdate,
		list: productMapsList,
		get: productMapsGet,
		delete: productMapsDelete,
	},
} as const;
