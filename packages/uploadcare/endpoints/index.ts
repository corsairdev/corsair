import {
	clamavStatus,
	executeClamav,
	rekognitionModerationStatus,
	rekognitionStatus,
	removeBgStatus,
} from './addons';
import { mirror, rotate } from './cdn';
import {
	batchDelete,
	batchStore,
	copyLocal,
	deleteFile,
	deleteMetadataKey,
	get as fileGet,
	store as fileStore,
	list as filesList,
	getMetadata,
	getMetadataKey,
	updateMetadataKey,
} from './files';
import { deleteGroup, get as groupGet, list as groupsList } from './groups';
import { get as projectGet } from './project';
import {
	createGroup,
	fileInfo,
	fromUrl,
	fromUrlStatus,
	groupInfo,
	startMultipart,
} from './upload';
import {
	deleteByUrl,
	deleteWebhook,
	create as webhookCreate,
	list as webhooksList,
	update as webhookUpdate,
} from './webhooks';

export const Files = {
	list: filesList,
	get: fileGet,
	store: fileStore,
	delete: deleteFile,
	batchStore,
	batchDelete,
	copyLocal,
	getMetadata,
	getMetadataKey,
	updateMetadataKey,
	deleteMetadataKey,
};

export const Groups = {
	list: groupsList,
	get: groupGet,
	delete: deleteGroup,
};

export const Project = {
	get: projectGet,
};

export const Webhooks = {
	list: webhooksList,
	create: webhookCreate,
	update: webhookUpdate,
	delete: deleteWebhook,
	deleteByUrl,
};

export const Upload = {
	fromUrl,
	fromUrlStatus,
	fileInfo,
	createGroup,
	groupInfo,
	startMultipart,
};

export const Addons = {
	executeClamav,
	clamavStatus,
	rekognitionStatus,
	rekognitionModerationStatus,
	removeBgStatus,
};

export const Cdn = {
	mirror,
	rotate,
};

export * from './types';
