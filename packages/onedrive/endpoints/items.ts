import { logEventFromContext } from 'corsair/core';
import type { OnedriveEndpoints } from '..';
import { makeOnedriveRequest } from '../client';
import type { OnedriveEndpointOutputs } from './types';

function buildItemUrl(
	item_id: string,
	drive_id?: string,
	site_id?: string,
	user_id?: string,
	group_id?: string,
): string {
	if (site_id && drive_id)
		return `sites/${site_id}/drives/${drive_id}/items/${item_id}`;
	if (site_id) return `sites/${site_id}/drive/items/${item_id}`;
	if (group_id) return `groups/${group_id}/drive/items/${item_id}`;
	if (user_id) return `users/${user_id}/drive/items/${item_id}`;
	if (drive_id) return `drives/${drive_id}/items/${item_id}`;
	return `me/drive/items/${item_id}`;
}

function buildDriveRootUrl(
	drive_id?: string,
	site_id?: string,
	user_id?: string,
	group_id?: string,
): string {
	if (site_id && drive_id) return `sites/${site_id}/drives/${drive_id}`;
	if (site_id) return `sites/${site_id}/drive`;
	if (group_id) return `groups/${group_id}/drive`;
	if (user_id) return `users/${user_id}/drive`;
	if (drive_id) return `drives/${drive_id}`;
	return 'me/drive';
}

export const get: OnedriveEndpoints['itemsGet'] = async (ctx, input) => {
	const { item_id, drive_id, select_fields, expand_relations } = input;
	const query: Record<string, string | undefined> = {};
	if (select_fields?.length) query['$select'] = select_fields.join(',');
	if (expand_relations?.length) query['$expand'] = expand_relations.join(',');

	const url = buildItemUrl(item_id, drive_id);
	const result = await makeOnedriveRequest<OnedriveEndpointOutputs['itemsGet']>(
		url,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.id && ctx.db.driveItems) {
		try {
			// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.driveItems.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save drive item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.items.get',
		{ item_id },
		'completed',
	);
	return result;
};

export const updateMetadata: OnedriveEndpoints['itemsUpdateMetadata'] = async (
	ctx,
	input,
) => {
	const {
		item_id,
		drive_id,
		site_id,
		user_id,
		group_id,
		name,
		description,
		ifMatch,
		fileSystemInfo,
		parent_reference_id,
		parent_reference_drive_id,
		additional_properties,
	} = input;

	const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
	const body: Record<string, unknown> = {};
	if (name) body.name = name;
	if (description) body.description = description;
	if (fileSystemInfo) body.fileSystemInfo = fileSystemInfo;
	if (parent_reference_id || parent_reference_drive_id) {
		body.parentReference = {
			...(parent_reference_id && { id: parent_reference_id }),
			...(parent_reference_drive_id && { driveId: parent_reference_drive_id }),
		};
	}
	if (additional_properties) {
		Object.assign(body, additional_properties);
	}

	const query: Record<string, string | undefined> = {};
	if (ifMatch) query['if-match'] = ifMatch;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsUpdateMetadata']
	>(url, ctx.key, { method: 'PATCH', body, query });

	if (result.id && ctx.db.driveItems) {
		try {
			// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.driveItems.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to update drive item in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.items.updateMetadata',
		{ item_id },
		'completed',
	);
	return result;
};

export const deleteItem: OnedriveEndpoints['itemsDelete'] = async (
	ctx,
	input,
) => {
	const { item_id, if_match } = input;
	const query: Record<string, string | undefined> = {};
	if (if_match) query['if-match'] = if_match;

	await makeOnedriveRequest<void>(`me/drive/items/${item_id}`, ctx.key, {
		method: 'DELETE',
		query,
	});

	await logEventFromContext(
		ctx,
		'onedrive.items.delete',
		{ item_id },
		'completed',
	);
	return { message: `Item ${item_id} deleted successfully` };
};

export const deletePermanently: OnedriveEndpoints['itemsDeletePermanently'] =
	async (ctx, input) => {
		const { item_id, drive_id } = input;

		await makeOnedriveRequest<void>(
			`drives/${drive_id}/items/${item_id}/permanentDelete`,
			ctx.key,
			{ method: 'POST' },
		);

		await logEventFromContext(
			ctx,
			'onedrive.items.deletePermanently',
			{ item_id, drive_id },
			'completed',
		);
		return { message: `Item ${item_id} permanently deleted successfully` };
	};

export const copy: OnedriveEndpoints['itemsCopy'] = async (ctx, input) => {
	const {
		item_id,
		name,
		site_id,
		user_id,
		drive_id,
		group_id,
		children_only,
		parent_reference,
		conflict_behavior,
		include_all_version_history,
	} = input;

	const driveRoot = buildDriveRootUrl(drive_id, site_id, user_id, group_id);
	const body: Record<string, unknown> = {};
	if (name) body.name = name;
	if (parent_reference) body.parentReference = parent_reference;
	if (children_only !== undefined) body.childrenOnly = children_only;
	if (conflict_behavior)
		body['@microsoft.graph.conflictBehavior'] = conflict_behavior;
	if (include_all_version_history !== undefined)
		body.includeAllVersionHistory = include_all_version_history;

	const response = await makeOnedriveRequest<{ location?: string }>(
		`${driveRoot}/items/${item_id}/copy`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'onedrive.items.copy',
		{ item_id },
		'completed',
	);

	// Copy returns 202 Accepted with a monitor URL in the Location header
	// any/unknown for response since copy returns async response object
	const responseObj = response as Record<string, unknown>;
	return {
		message: 'Copy operation initiated',
		status_code: 202,
		monitor_url: responseObj.location as string | undefined,
	};
};

export const move: OnedriveEndpoints['itemsMove'] = async (ctx, input) => {
	const {
		itemId,
		parentReference,
		name,
		siteId,
		userId,
		driveId,
		groupId,
		description,
	} = input;

	const url = buildItemUrl(itemId, driveId, siteId, userId, groupId);
	const body: Record<string, unknown> = { parentReference };
	if (name) body.name = name;
	if (description) body.description = description;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsMove']
	>(url, ctx.key, { method: 'PATCH', body });

	if (result.id && ctx.db.driveItems) {
		try {
			// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.driveItems.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to update moved drive item in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.items.move',
		{ itemId },
		'completed',
	);
	return result;
};

export const restore: OnedriveEndpoints['itemsRestore'] = async (
	ctx,
	input,
) => {
	const { item_id, name, parent_reference_id } = input;

	const body: Record<string, unknown> = {};
	if (name) body.name = name;
	if (parent_reference_id) body.parentReference = { id: parent_reference_id };

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsRestore']
	>(`me/drive/items/${item_id}/restore`, ctx.key, { method: 'POST', body });

	if (result.id && ctx.db.driveItems) {
		try {
			// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.driveItems.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save restored drive item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.items.restore',
		{ item_id },
		'completed',
	);
	return result;
};

export const search: OnedriveEndpoints['itemsSearch'] = async (ctx, input) => {
	const { q, top, expand, select, orderby, drive_id, skip_token } = input;

	const query: Record<string, string | number | undefined> = {};
	if (top !== undefined) query['$top'] = top;
	if (expand) query['$expand'] = expand;
	if (select) query['$select'] = select;
	if (orderby) query['$orderby'] = orderby;
	if (skip_token) query['$skiptoken'] = skip_token;

	const searchUrl = drive_id
		? `drives/${drive_id}/root/search(q='${encodeURIComponent(q)}')`
		: `me/drive/root/search(q='${encodeURIComponent(q)}')`;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsSearch']
	>(searchUrl, ctx.key, { method: 'GET', query });

	if (result.value?.length && ctx.db.driveItems) {
		try {
			for (const item of result.value) {
				// any/unknown for item since search results are untyped array elements
				const driveItem = item as Record<string, unknown>;
				if (driveItem.id && typeof driveItem.id === 'string') {
					// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
					await ctx.db.driveItems.upsertByEntityId(driveItem.id, {
						...driveItem,
					} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
				}
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(ctx, 'onedrive.items.search', { q }, 'completed');
	return result;
};

export const checkin: OnedriveEndpoints['itemsCheckin'] = async (
	ctx,
	input,
) => {
	const { drive_id, driveItem_id, comment, checkInAs } = input;

	const body: Record<string, unknown> = {};
	if (comment) body.comment = comment;
	if (checkInAs) body.checkInAs = checkInAs;

	await makeOnedriveRequest<void>(
		`drives/${drive_id}/items/${driveItem_id}/checkin`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'onedrive.items.checkin',
		{ drive_id, driveItem_id },
		'completed',
	);
	return { message: `Item ${driveItem_id} checked in successfully` };
};

export const checkout: OnedriveEndpoints['itemsCheckout'] = async (
	ctx,
	input,
) => {
	const { drive_id, driveItem_id } = input;

	await makeOnedriveRequest<void>(
		`drives/${drive_id}/items/${driveItem_id}/checkout`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'onedrive.items.checkout',
		{ drive_id, driveItem_id },
		'completed',
	);
	return { message: `Item ${driveItem_id} checked out successfully` };
};

export const discardCheckout: OnedriveEndpoints['itemsDiscardCheckout'] =
	async (ctx, input) => {
		const { drive_id, driveItem_id } = input;

		await makeOnedriveRequest<void>(
			`drives/${drive_id}/items/${driveItem_id}/checkout`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'onedrive.items.discardCheckout',
			{ drive_id, driveItem_id },
			'completed',
		);
		return { message: `Checkout discarded for item ${driveItem_id}` };
	};

export const follow: OnedriveEndpoints['itemsFollow'] = async (ctx, input) => {
	const { drive_id, driveItem_id } = input;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsFollow']
	>(`drives/${drive_id}/items/${driveItem_id}/follow`, ctx.key, {
		method: 'POST',
	});

	if (result.id && ctx.db.driveItems) {
		try {
			// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.driveItems.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save followed drive item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.items.follow',
		{ drive_id, driveItem_id },
		'completed',
	);
	return result;
};

export const unfollow: OnedriveEndpoints['itemsUnfollow'] = async (
	ctx,
	input,
) => {
	const { id } = input;

	await makeOnedriveRequest<void>(`me/drive/items/${id}/unfollow`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'onedrive.items.unfollow',
		{ id },
		'completed',
	);
	return { message: `Item ${id} unfollowed successfully` };
};

export const getFollowed: OnedriveEndpoints['itemsGetFollowed'] = async (
	ctx,
	input,
) => {
	const { drive_id, driveItem_id } = input;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsGetFollowed']
	>(`drives/${drive_id}/items/${driveItem_id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.driveItems) {
		try {
			// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.driveItems.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save followed drive item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.items.getFollowed',
		{ drive_id, driveItem_id },
		'completed',
	);
	return result;
};

export const getVersions: OnedriveEndpoints['itemsGetVersions'] = async (
	ctx,
	input,
) => {
	const { item_id, drive_id, site_id, user_id, group_id } = input;

	const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsGetVersions']
	>(`${url}/versions`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'onedrive.items.getVersions',
		{ item_id },
		'completed',
	);
	return result;
};

export const getThumbnails: OnedriveEndpoints['itemsGetThumbnails'] = async (
	ctx,
	input,
) => {
	const {
		item_id,
		drive_id,
		site_id,
		user_id,
		group_id,
		select,
		original_orientation,
	} = input;

	const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
	const query: Record<string, string | boolean | undefined> = {};
	if (select) query['$select'] = select;
	if (original_orientation !== undefined)
		query.originalOrientation = original_orientation;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsGetThumbnails']
	>(`${url}/thumbnails`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'onedrive.items.getThumbnails',
		{ item_id },
		'completed',
	);
	return result;
};

export const download: OnedriveEndpoints['itemsDownload'] = async (
	ctx,
	input,
) => {
	const { item_id, drive_id, user_id, format, if_none_match } = input;

	const url = buildItemUrl(item_id, drive_id, undefined, user_id);
	const query: Record<string, string | undefined> = {};
	if (format) query.format = format;
	if (if_none_match) query['if-none-match'] = if_none_match;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsDownload']
	>(`${url}/content`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'onedrive.items.download',
		{ item_id },
		'completed',
	);
	return result;
};

export const downloadByPath: OnedriveEndpoints['itemsDownloadByPath'] = async (
	ctx,
	input,
) => {
	const { item_path } = input;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsDownloadByPath']
	>(`me/drive/root:/${item_path}:/content`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'onedrive.items.downloadByPath',
		{ item_path },
		'completed',
	);
	return result;
};

export const downloadAsFormat: OnedriveEndpoints['itemsDownloadAsFormat'] =
	async (ctx, input) => {
		const { path_and_filename, format } = input;

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['itemsDownloadAsFormat']
		>(`me/drive/root:/${path_and_filename}:/content`, ctx.key, {
			method: 'GET',
			query: { format },
		});

		await logEventFromContext(
			ctx,
			'onedrive.items.downloadAsFormat',
			{ path_and_filename, format },
			'completed',
		);
		return result;
	};

export const downloadVersion: OnedriveEndpoints['itemsDownloadVersion'] =
	async (ctx, input) => {
		const { item_id, version_id, drive_id } = input;

		const url = buildItemUrl(item_id, drive_id);
		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['itemsDownloadVersion']
		>(`${url}/versions/${version_id}/content`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'onedrive.items.downloadVersion',
			{ item_id, version_id },
			'completed',
		);
		return result;
	};

export const updateContent: OnedriveEndpoints['itemsUpdateContent'] = async (
	ctx,
	input,
) => {
	const {
		item_id,
		drive_id,
		site_id,
		user_id,
		group_id,
		if_match_etag,
		if_none_match_etag,
		defer_commit,
		file_size,
		description,
		media_source,
		file_system_info,
		conflict_behavior,
		drive_item_source,
	} = input;

	const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
	const body: Record<string, unknown> = {};
	if (description) body.description = description;
	if (defer_commit !== undefined) body.deferCommit = defer_commit;
	if (file_size !== undefined) body.fileSize = file_size;
	if (media_source) body.mediaSource = media_source;
	if (file_system_info) body.fileSystemInfo = file_system_info;
	if (conflict_behavior)
		body['@microsoft.graph.conflictBehavior'] = conflict_behavior;
	if (drive_item_source) body.driveItemSource = drive_item_source;

	const query: Record<string, string | undefined> = {};
	if (if_match_etag) query['if-match'] = if_match_etag;
	if (if_none_match_etag) query['if-none-match'] = if_none_match_etag;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsUpdateContent']
	>(`${url}/content`, ctx.key, { method: 'PUT', body, query });

	await logEventFromContext(
		ctx,
		'onedrive.items.updateContent',
		{ item_id },
		'completed',
	);
	return result;
};

export const preview: OnedriveEndpoints['itemsPreview'] = async (
	ctx,
	input,
) => {
	const { item_id, site_id, user_id, drive_id, group_id, page, zoom } = input;

	const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
	const body: Record<string, unknown> = {};
	if (page !== undefined) body.page = page;
	if (zoom !== undefined) body.zoom = zoom;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsPreview']
	>(`${url}/preview`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'onedrive.items.preview',
		{ item_id },
		'completed',
	);
	return result;
};

export const getDriveItemBySharingUrl: OnedriveEndpoints['itemsGetDriveItemBySharingUrl'] =
	async (ctx, input) => {
		const {
			sharing_url,
			share_id_or_encoded_url,
			prefer_redeem,
			select_fields,
			expand_children,
		} = input;

		const rawUrl = sharing_url || share_id_or_encoded_url || '';
		// Encode the sharing URL per Microsoft Graph specification
		const encodedUrl = rawUrl.startsWith('u!')
			? rawUrl
			: `u!${Buffer.from(rawUrl).toString('base64').replace(/=/g, '').replace(/\//g, '_').replace(/\+/g, '-')}`;

		const query: Record<string, string | undefined> = {};
		if (select_fields?.length) query['$select'] = select_fields.join(',');
		if (expand_children) query['$expand'] = 'children';
		if (prefer_redeem) query.prefer = prefer_redeem;

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['itemsGetDriveItemBySharingUrl']
		>(`shares/${encodedUrl}/driveItem`, ctx.key, { method: 'GET', query });

		if (result.id && ctx.db.driveItems) {
			try {
				// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
				await ctx.db.driveItems.upsertByEntityId(result.id, {
					...result,
				} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
			} catch (error) {
				console.warn('Failed to save shared drive item to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'onedrive.items.getDriveItemBySharingUrl',
			{},
			'completed',
		);
		return result;
	};

export const listFolderChildren: OnedriveEndpoints['itemsListFolderChildren'] =
	async (ctx, input) => {
		const { top, expand, select, orderby, site_id, drive_id, folder_item_id } =
			input;

		const query: Record<string, string | number | undefined> = {};
		if (top !== undefined) query['$top'] = top;
		if (expand?.length) query['$expand'] = expand.join(',');
		if (select?.length) query['$select'] = select.join(',');
		if (orderby) query['$orderby'] = orderby;

		let url: string;
		if (folder_item_id) {
			if (drive_id) {
				url = `drives/${drive_id}/items/${folder_item_id}/children`;
			} else if (site_id) {
				url = `sites/${site_id}/drive/items/${folder_item_id}/children`;
			} else {
				url = `me/drive/items/${folder_item_id}/children`;
			}
		} else {
			if (drive_id) {
				url = `drives/${drive_id}/root/children`;
			} else if (site_id) {
				url = `sites/${site_id}/drive/root/children`;
			} else {
				url = 'me/drive/root/children';
			}
		}

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['itemsListFolderChildren']
		>(url, ctx.key, { method: 'GET', query });

		if (result.value?.length && ctx.db.driveItems) {
			try {
				for (const item of result.value) {
					// any/unknown for item since folder children are untyped array elements
					const driveItem = item as Record<string, unknown>;
					if (driveItem.id && typeof driveItem.id === 'string') {
						// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
						await ctx.db.driveItems.upsertByEntityId(driveItem.id, {
							...driveItem,
						} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
					}
				}
			} catch (error) {
				console.warn('Failed to save folder children to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'onedrive.items.listFolderChildren',
			{},
			'completed',
		);
		return result;
	};

export const listActivities: OnedriveEndpoints['itemsListActivities'] = async (
	ctx,
	input,
) => {
	const { item_id, drive_id, top, skip, expand, filter, select, orderby } =
		input;

	const query: Record<string, string | number | undefined> = {};
	if (top !== undefined) query['$top'] = top;
	if (skip) query['$skip'] = skip;
	if (expand?.length) query['$expand'] = expand.join(',');
	if (filter) query['$filter'] = filter;
	if (select?.length) query['$select'] = select.join(',');
	if (orderby) query['$orderby'] = orderby;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['itemsListActivities']
	>(`drives/${drive_id}/items/${item_id}/activities`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'onedrive.items.listActivities',
		{ item_id, drive_id },
		'completed',
	);
	return result;
};
