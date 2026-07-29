import {
	create as createAssetUpload,
	createFromUrl as createAssetUploadFromUrl,
	get as getAssetUpload,
	getFromUrl as getAssetUploadFromUrl,
} from './asset-uploads';
import {
	deleteAsset as deleteAssetHandler,
	get as getAsset,
	update as updateAsset,
} from './assets';
import { create as createAutofill, get as getAutofill } from './autofills';
import {
	get as getBrandTemplate,
	getDataset as getBrandTemplateDataset,
	list as listBrandTemplates,
} from './brand-templates';
import {
	createReply,
	createThread,
	getReply,
	getThread,
	listReplies,
} from './comments';
import {
	create as createDesign,
	get as getDesign,
	getExportFormats as getDesignExportFormats,
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
import {
	create as createImport,
	createFromUrl as createImportFromUrl,
	get as getImport,
	getFromUrl as getImportFromUrl,
} from './imports';
import { create as createResize, get as getResize } from './resizes';
import { getCapabilities, getMe, getProfile } from './users';

export const Users = {
	getMe,
	getProfile,
	getCapabilities,
};

export const Designs = {
	list: listDesigns,
	get: getDesign,
	create: createDesign,
	getPages: getDesignPages,
	getExportFormats: getDesignExportFormats,
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

export const BrandTemplates = {
	list: listBrandTemplates,
	get: getBrandTemplate,
	getDataset: getBrandTemplateDataset,
};

export const AssetUploads = {
	create: createAssetUpload,
	get: getAssetUpload,
	createFromUrl: createAssetUploadFromUrl,
	getFromUrl: getAssetUploadFromUrl,
};

export const Imports = {
	create: createImport,
	get: getImport,
	createFromUrl: createImportFromUrl,
	getFromUrl: getImportFromUrl,
};

export const Resizes = {
	create: createResize,
	get: getResize,
};

export const Autofills = {
	create: createAutofill,
	get: getAutofill,
};

export const Comments = {
	createThread,
	getThread,
	createReply,
	listReplies,
	getReply,
};

export * from './types';
