import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const getAnalytics: SharepointEndpoints['driveGetAnalytics'] = async (ctx, input) => {
	// Uses Microsoft Graph API
	const result = await makeGraphRequest<SharepointEndpointOutputs['driveGetAnalytics']>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}/analytics`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'sharepoint.drive.getAnalytics', { ...input }, 'completed');
	return result;
};

export const listRecentItems: SharepointEndpoints['driveListRecentItems'] = async (ctx, input) => {
	// Uses Microsoft Graph API
	const result = await makeGraphRequest<SharepointEndpointOutputs['driveListRecentItems']>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/recent`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'sharepoint.drive.listRecentItems', { ...input }, 'completed');
	return result;
};

export const restoreVersion: SharepointEndpoints['driveRestoreVersion'] = async (ctx, input) => {
	// Uses Microsoft Graph API
	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}/versions/${encodeURIComponent(input.version_id)}/restoreVersion`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(ctx, 'sharepoint.drive.restoreVersion', { ...input }, 'completed');
	return { success: true };
};

export const deleteVersion: SharepointEndpoints['driveDeleteVersion'] = async (ctx, input) => {
	// Uses Microsoft Graph API
	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}/versions/${encodeURIComponent(input.version_id)}/content`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'sharepoint.drive.deleteVersion', { ...input }, 'completed');
	return { success: true };
};

export const createSharingLink: SharepointEndpoints['driveCreateSharingLink'] = async (ctx, input) => {
	// Uses Microsoft Graph API
	const body: Record<string, unknown> = {
		type: input.type,
	};
	if (input.scope) body.scope = input.scope;
	if (input.expiration_date_time) body.expirationDateTime = input.expiration_date_time;
	if (input.password) body.password = input.password;

	const result = await makeGraphRequest<SharepointEndpointOutputs['driveCreateSharingLink']>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}/createLink`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(ctx, 'sharepoint.drive.createSharingLink', { ...input }, 'completed');
	return result;
};

export const updateItem: SharepointEndpoints['driveUpdateItem'] = async (ctx, input) => {
	// Uses Microsoft Graph API
	const body: Record<string, unknown> = {};
	if (input.name !== undefined) body.name = input.name;
	if (input.description !== undefined) body.description = input.description;
	if (input.parent_reference !== undefined) body.parentReference = input.parent_reference;

	const result = await makeGraphRequest<SharepointEndpointOutputs['driveUpdateItem']>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);

	await logEventFromContext(ctx, 'sharepoint.drive.updateItem', { ...input }, 'completed');
	return result;
};
