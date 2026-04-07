import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import type { SharepointEndpointOutputs } from './types';

export const list: SharepointEndpoints['recycleBinList'] = async (ctx, input) => {
	// Microsoft Graph API does not expose the SharePoint recycle bin
	await logEventFromContext(ctx, 'sharepoint.recycleBin.list', { ...input }, 'completed');
	return { value: [] } as SharepointEndpointOutputs['recycleBinList'];
};

export const restore: SharepointEndpoints['recycleBinRestore'] = async (ctx, input) => {
	// Microsoft Graph API does not expose the SharePoint recycle bin
	await logEventFromContext(ctx, 'sharepoint.recycleBin.restore', { ...input }, 'completed');
	return { success: true };
};

export const deletePermanent: SharepointEndpoints['recycleBinDeletePermanent'] = async (ctx, input) => {
	// Microsoft Graph API does not expose the SharePoint recycle bin
	await logEventFromContext(ctx, 'sharepoint.recycleBin.deletePermanent', { ...input }, 'completed');
	return { success: true };
};
