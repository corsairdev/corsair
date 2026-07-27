import {
	deleteAsset as deleteAssetHandler,
	get as getAsset,
	update as updateAsset,
} from './assets';
import {
	create as createDesign,
	get as getDesign,
	getPages as getDesignPages,
	list as listDesigns,
} from './designs';
import { create as createExport, get as getExport } from './exports';
import {
	create as createFolder,
	deleteFolder as deleteFolderHandler,
	get as getFolder,
	listItems as listFolderItems,
	moveItem as moveFolderItem,
	update as updateFolder,
} from './folders';
import { getMe, getProfile } from './users';

export const Users = {
	getMe,
	getProfile,
};

export const Designs = {
	list: listDesigns,
	get: getDesign,
	create: createDesign,
	getPages: getDesignPages,
};

export const Assets = {
	get: getAsset,
	update: updateAsset,
	delete: deleteAssetHandler,
};

export const Folders = {
	create: createFolder,
	get: getFolder,
	update: updateFolder,
	delete: deleteFolderHandler,
	listItems: listFolderItems,
	moveItem: moveFolderItem,
};

export const Exports = {
	create: createExport,
	get: getExport,
};

export * from './types';
