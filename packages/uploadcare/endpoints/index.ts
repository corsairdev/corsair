import {
	batchDelete as batchDeleteFiles,
	batchStore as batchStoreFiles,
	deleteFile,
	get as fileGet,
	list as filesList,
	store as fileStore,
} from './files';
import { get as groupGet, list as groupsList } from './groups';
import { get as projectGet } from './project';
import {
	create as webhookCreate,
	deleteWebhook,
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
