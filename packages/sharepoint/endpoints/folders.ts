import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest, resolveSiteGuid } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const create: SharepointEndpoints['foldersCreate'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);

	const parts = input.server_relative_url.replace(/^\/+/, '').split('/');
	const folderName = parts[parts.length - 1];
	const parentPath = parts.slice(0, -1).join('/');

	const parentEndpoint = parentPath
		? `/sites/${siteId}/drive/root:/${parentPath}:/children`
		: `/sites/${siteId}/drive/root/children`;

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['foldersCreate']
	>(parentEndpoint, ctx.key, {
		method: 'POST',
		body: {
			name: folderName,
			folder: {},
			'@microsoft.graph.conflictBehavior': 'rename',
		},
	});

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				serverRelativeUrl: result.webUrl,
				timeCreated: result.createdDateTime,
				timeLastModified: result.lastModifiedDateTime,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save created folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.folders.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: SharepointEndpoints['foldersGet'] = async (ctx, input) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_url.replace(/^\/+/, '');

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['foldersGet']
	>(`/sites/${siteId}/drive/root:/${drivePath}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				serverRelativeUrl: result.webUrl,
				timeCreated: result.createdDateTime,
				timeLastModified: result.lastModifiedDateTime,
			});
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.folders.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getAll: SharepointEndpoints['foldersGetAll'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);

	let endpoint: string;
	if (input.server_relative_url) {
		const drivePath = input.server_relative_url.replace(/^\/+/, '');
		endpoint = `/sites/${siteId}/drive/root:/${drivePath}:/children`;
	} else {
		endpoint = `/sites/${siteId}/drive/root/children`;
	}

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['foldersGetAll']
	>(endpoint, ctx.key, { method: 'GET', query: { $filter: 'folder ne null' } });

	if (result.value && ctx.db.folders) {
		try {
			for (const folder of result.value) {
				if (folder.id) {
					await ctx.db.folders.upsertByEntityId(folder.id, {
						id: folder.id,
						name: folder.name,
						serverRelativeUrl: folder.webUrl,
						timeCreated: folder.createdDateTime,
						timeLastModified: folder.lastModifiedDateTime,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save folders to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.folders.getAll',
		{ ...input },
		'completed',
	);
	return result;
};

export const listSubfolders: SharepointEndpoints['foldersListSubfolders'] =
	async (ctx, input) => {
		const siteId = await resolveSiteGuid(
			(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
			ctx.key,
		);
		const drivePath = input.server_relative_url.replace(/^\/+/, '');

		const result = await makeGraphRequest<
			SharepointEndpointOutputs['foldersListSubfolders']
		>(`/sites/${siteId}/drive/root:/${drivePath}:/children`, ctx.key, {
			method: 'GET',
			query: { $filter: 'folder ne null' },
		});

		if (result.value && ctx.db.folders) {
			try {
				for (const folder of result.value) {
					if (folder.id) {
						await ctx.db.folders.upsertByEntityId(folder.id, {
							id: folder.id,
							name: folder.name,
							serverRelativeUrl: folder.webUrl,
							timeCreated: folder.createdDateTime,
							timeLastModified: folder.lastModifiedDateTime,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save subfolders to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sharepoint.folders.listSubfolders',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteFolder: SharepointEndpoints['foldersDelete'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_url.replace(/^\/+/, '');

	// Resolve folder ID before deletion so we can remove the DB record by entity ID
	const folder = await makeGraphRequest<{ id?: string }>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'GET', query: { $select: 'id' } },
	);

	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.folders && folder.id) {
		try {
			await ctx.db.folders.deleteByEntityId(folder.id);
		} catch (error) {
			console.warn('Failed to delete folder from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.folders.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const rename: SharepointEndpoints['foldersRename'] = async (
	ctx,
	input,
) => {
	const siteId = await resolveSiteGuid(
		(await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '',
		ctx.key,
	);
	const drivePath = input.server_relative_url.replace(/^\/+/, '');

	const result = await makeGraphRequest<{ id?: string; webUrl?: string }>(
		`/sites/${siteId}/drive/root:/${drivePath}`,
		ctx.key,
		{ method: 'PATCH', body: { name: input.new_name } },
	);

	const parts = input.server_relative_url.split('/');
	parts[parts.length - 1] = input.new_name;
	const newServerRelativeUrl = parts.join('/');

	if (result.id && ctx.db.folders) {
		try {
			const existing = await ctx.db.folders.findByEntityId(result.id);
			await ctx.db.folders.upsertByEntityId(result.id, {
				...(existing?.data ?? {}),
				id: result.id,
				name: input.new_name,
				serverRelativeUrl: newServerRelativeUrl,
				modifiedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to update renamed folder in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.folders.rename',
		{ ...input },
		'completed',
	);
	return { success: true, new_server_relative_url: newServerRelativeUrl };
};
