import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const getAnalytics: SharepointEndpoints['driveGetAnalytics'] = async (
	ctx,
	input,
) => {
	// Uses Microsoft Graph API
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['driveGetAnalytics']
	>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}/analytics`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.drive.getAnalytics',
		{ ...input },
		'completed',
	);
	return result;
};

export const listRecentItems: SharepointEndpoints['driveListRecentItems'] =
	async (ctx, input) => {
		// Uses Microsoft Graph API
		const result = await makeGraphRequest<
			SharepointEndpointOutputs['driveListRecentItems']
		>(`/sites/${encodeURIComponent(input.site_id)}/drive/recent`, ctx.key, {
			method: 'GET',
		});

		if (result.value && ctx.db.files) {
			try {
				for (const item of result.value) {
					if (item.id && item.file) {
						await ctx.db.files.upsertByEntityId(item.id, {
							id: item.id,
							name: item.name,
							serverRelativeUrl: item.webUrl,
							timeCreated: item.createdDateTime,
							timeLastModified: item.lastModifiedDateTime,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save recent drive items to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sharepoint.drive.listRecentItems',
			{ ...input },
			'completed',
		);
		return result;
	};

export const restoreVersion: SharepointEndpoints['driveRestoreVersion'] =
	async (ctx, input) => {
		// Uses Microsoft Graph API
		await makeGraphRequest<Record<string, unknown>>(
			`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}/versions/${encodeURIComponent(input.version_id)}/restoreVersion`,
			ctx.key,
			{ method: 'POST' },
		);

		await logEventFromContext(
			ctx,
			'sharepoint.drive.restoreVersion',
			{ ...input },
			'completed',
		);
		return { success: true };
	};

export const deleteVersion: SharepointEndpoints['driveDeleteVersion'] = async (
	ctx,
	input,
) => {
	// Uses Microsoft Graph API
	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}/versions/${encodeURIComponent(input.version_id)}/content`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.drive.deleteVersion',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const createSharingLink: SharepointEndpoints['driveCreateSharingLink'] =
	async (ctx, input) => {
		// Uses Microsoft Graph API
		const body: Record<string, unknown> = {
			type: input.type,
			...(input.scope !== undefined && { scope: input.scope }),
			...(input.expiration_date_time !== undefined && {
				expirationDateTime: input.expiration_date_time,
			}),
			...(input.password !== undefined && { password: input.password }),
		};

		const result = await makeGraphRequest<
			SharepointEndpointOutputs['driveCreateSharingLink']
		>(
			`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}/createLink`,
			ctx.key,
			{ method: 'POST', body },
		);

		await logEventFromContext(
			ctx,
			'sharepoint.drive.createSharingLink',
			{ ...input },
			'completed',
		);
		return result;
	};

export const updateItem: SharepointEndpoints['driveUpdateItem'] = async (
	ctx,
	input,
) => {
	// Uses Microsoft Graph API
	const body: Record<string, unknown> = {
		...(input.name !== undefined && { name: input.name }),
		...(input.description !== undefined && { description: input.description }),
		...(input.parent_reference !== undefined && {
			parentReference: input.parent_reference,
		}),
	};

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['driveUpdateItem']
	>(
		`/sites/${encodeURIComponent(input.site_id)}/drive/items/${encodeURIComponent(input.item_id)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);

	if (result.id && ctx.db.files) {
		try {
			const existing = await ctx.db.files.findByEntityId(result.id);
			await ctx.db.files.upsertByEntityId(result.id, {
				...(existing?.data ?? {}),
				id: result.id,
				name: result.name ?? input.name,
				serverRelativeUrl: result.webUrl,
				timeLastModified: result.lastModifiedDateTime,
				modifiedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to update drive item in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.drive.updateItem',
		{ ...input },
		'completed',
	);
	return result;
};
