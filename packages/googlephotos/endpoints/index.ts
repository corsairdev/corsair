import * as Albums from './albums';
import * as MediaItems from './media-items';

export const AlbumsEndpoints = {
	list: Albums.list,
	get: Albums.get,
	create: Albums.create,
	update: Albums.update,
	addEnrichment: Albums.addEnrichment,
	batchAddMediaItems: Albums.batchAddMediaItems,
	batchRemoveMediaItems: Albums.batchRemoveMediaItems,
} as const;

export const MediaItemsEndpoints = {
	search: MediaItems.search,
	list: MediaItems.list,
	get: MediaItems.get,
	batchGet: MediaItems.batchGet,
	update: MediaItems.update,
	create: MediaItems.create,
} as const;

export * from './types';
