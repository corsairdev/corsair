import { uploadMediaAsset } from './media';
import { listTemplates } from './templates';
import { unsubscribeWebhook } from './webhooks';
import {
	createWorkspace,
	deleteWorkspace,
	listWorkspaces,
	updateWorkspace,
} from './workspaces';

export const Workspaces = {
	list: listWorkspaces,
	create: createWorkspace,
	update: updateWorkspace,
	delete: deleteWorkspace,
};

export const Templates = {
	list: listTemplates,
};

export const Webhooks = {
	unsubscribe: unsubscribeWebhook,
};

export const Media = {
	upload: uploadMediaAsset,
};

export * from './types';
