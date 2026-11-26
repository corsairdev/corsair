import * as Analytics from './analytics';
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
	publish as publishBrandTemplate,
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
	getDataset as getDesignDataset,
	getExportFormats as getDesignExportFormats,
	getPages as getDesignPages,
	list as listDesigns,
} from './designs';
import {
	create as createExport,
	download as downloadExport,
	get as getExport,
} from './exports';
import {
	create as createFolder,
	deleteFolder as deleteFolderHandler,
	get as getFolder,
	listItems as listFolderItems,
	moveItem as moveFolderItem,
	update as updateFolder,
} from './folders';
import * as GenerationsModule from './generations';
import * as ImageGenerationsModule from './image-generations';
import * as ImageTransformationsModule from './image-transformations';
import {
	create as createImport,
	createFromImage as createImportFromImage,
	createFromUrl as createImportFromUrl,
	get as getImport,
	getFromImage as getImportFromImage,
	getFromUrl as getImportFromUrl,
} from './imports';
import { getAppJwks, listSigningKeys } from './keys';
import * as MergesModule from './merges';
import * as PrintPartnerModule from './print-partner';
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
	getDataset: getDesignDataset,
};

export const DesignAnalytics = {
	get: Analytics.get,
	listViewers: Analytics.listViewers,
	listViewsOverTime: Analytics.listViewsOverTime,
	listPageViews: Analytics.listPageViews,
	listLinks: Analytics.listLinks,
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
	download: downloadExport,
};

export const BrandTemplates = {
	list: listBrandTemplates,
	get: getBrandTemplate,
	getDataset: getBrandTemplateDataset,
	publish: publishBrandTemplate,
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
	createFromImage: createImportFromImage,
	getFromImage: getImportFromImage,
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

export const Generations = {
	create: GenerationsModule.create,
	get: GenerationsModule.get,
};

export const ImageGenerations = {
	create: ImageGenerationsModule.create,
	get: ImageGenerationsModule.get,
};

export const ImageTransformations = {
	create: ImageTransformationsModule.create,
	get: ImageTransformationsModule.get,
};

export const Merges = {
	create: MergesModule.create,
	get: MergesModule.get,
};

export const PrintPartner = {
	createDesign: PrintPartnerModule.createDesign,
	getDesign: PrintPartnerModule.getDesign,
	createExport: PrintPartnerModule.createExport,
};

export const Keys = {
	list: listSigningKeys,
};

export const Apps = {
	getJwks: getAppJwks,
};

export * from './types';
