import {
	batchDelete as batchDeleteFiles,
	batchStore as batchStoreFiles,
	deleteFile,
	get as fileGet,
	store as fileStore,
	list as filesList,
} from './files';
import { get as groupGet, list as groupsList } from './groups';
import { get as projectGet } from './project';
import {
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
	batchStore: batchStoreFiles,
	batchDelete: batchDeleteFiles,
};

export const Groups = {
	list: groupsList,
	get: groupGet,
};

export const Project = {
	get: projectGet,
};

export const Webhooks = {
	list: webhooksList,
	create: webhookCreate,
	update: webhookUpdate,
	delete: deleteWebhook,
};

export * from './types';
