import { createWorkspace } from './create-workspace';
import { deleteWorkspace } from './delete-workspace';
import { listTemplates } from './list-templates';
import { listWorkspaces } from './list-workspaces';
import { unsubscribeWebhook } from './unsubscribe-webhook';
import { updateWorkspace } from './update-workspace';
import { uploadMediaAsset } from './upload-media-asset';

export const DynapicturesEndpoints = {
	createWorkspace,
	deleteWorkspace,
	listTemplates,
	listWorkspaces,
	unsubscribeWebhook,
	updateWorkspace,
	uploadMediaAsset,
};

export * from './types';
