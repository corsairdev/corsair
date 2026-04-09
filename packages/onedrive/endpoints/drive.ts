import { logEventFromContext } from 'corsair/core';
import type { OnedriveEndpoints } from '..';
import { makeOnedriveRequest } from '../client';
import type { OnedriveEndpointOutputs } from './types';

export const get: OnedriveEndpoints['driveGet'] = async (ctx, input) => {
	const { drive_id, select_fields, expand_fields } = input;

	const query: Record<string, string | undefined> = {};
	if (select_fields?.length) query['$select'] = select_fields.join(',');
	if (expand_fields?.length) query['$expand'] = expand_fields.join(',');

	const result = await makeOnedriveRequest<OnedriveEndpointOutputs['driveGet']>(
		`drives/${drive_id}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.id && ctx.db.drives) {
		try {
			// DB schema requires several fields (name, driveType, etc.) that are optional in the API response; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.drives.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.drives.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save drive to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.drive.get',
		{ drive_id },
		'completed',
	);
	return result;
};

export const getGroup: OnedriveEndpoints['driveGetGroup'] = async (
	ctx,
	input,
) => {
	const { group_id, select_fields } = input;

	const query: Record<string, string | undefined> = {};
	if (select_fields?.length) query['$select'] = select_fields.join(',');

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveGetGroup']
	>(`groups/${group_id}/drive`, ctx.key, { method: 'GET', query });

	if (result.id && ctx.db.drives) {
		try {
			// DB schema requires several fields (name, driveType, etc.) that are optional in the API response; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.drives.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.drives.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save group drive to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.drive.getGroup',
		{ group_id },
		'completed',
	);
	return result;
};

export const list: OnedriveEndpoints['driveList'] = async (ctx, input) => {
	const {
		top,
		expand,
		select,
		orderby,
		site_id,
		user_id,
		group_id,
		skip_token,
	} = input;

	const query: Record<string, string | number | undefined> = {};
	if (top !== undefined) query['$top'] = top;
	if (expand) query['$expand'] = expand;
	if (select) query['$select'] = select;
	if (orderby) query['$orderby'] = orderby;
	if (skip_token) query['$skiptoken'] = skip_token;

	let url: string;
	if (site_id) {
		url = `sites/${site_id}/drives`;
	} else if (group_id) {
		url = `groups/${group_id}/drives`;
	} else if (user_id) {
		url = `users/${user_id}/drives`;
	} else {
		url = 'me/drives';
	}

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveList']
	>(url, ctx.key, { method: 'GET', query });

	if (result.value?.length && ctx.db.drives) {
		try {
			for (const drive of result.value) {
				// any/unknown for drive since drive list items are untyped array elements
				const driveObj = drive as Record<string, unknown>;
				if (driveObj.id && typeof driveObj.id === 'string') {
					// DB schema requires several fields that are optional in the API response; cast after spread to satisfy types while capturing passthrough fields
					await ctx.db.drives.upsertByEntityId(driveObj.id, {
						...driveObj,
					} as Parameters<typeof ctx.db.drives.upsertByEntityId>[1]);
				}
			}
		} catch (error) {
			console.warn('Failed to save drives to database:', error);
		}
	}

	await logEventFromContext(ctx, 'onedrive.drive.list', {}, 'completed');
	return result;
};

export const getRoot: OnedriveEndpoints['driveGetRoot'] = async (
	ctx,
	input,
) => {
	const { select_fields } = input;

	const query: Record<string, string | undefined> = {};
	if (select_fields?.length) query['$select'] = select_fields.join(',');

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveGetRoot']
	>('me/drive/root', ctx.key, { method: 'GET', query });

	if (result.id && ctx.db.driveItems) {
		try {
			// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.driveItems.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save drive root to database:', error);
		}
	}

	await logEventFromContext(ctx, 'onedrive.drive.getRoot', {}, 'completed');
	return result;
};

export const getSpecialFolder: OnedriveEndpoints['driveGetSpecialFolder'] =
	async (ctx, input) => {
		const { special_folder_name, select_fields, expand_relations } = input;

		const query: Record<string, string | undefined> = {};
		if (select_fields?.length) query['$select'] = select_fields.join(',');
		if (expand_relations?.length) query['$expand'] = expand_relations.join(',');

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['driveGetSpecialFolder']
		>(`me/drive/special/${special_folder_name}`, ctx.key, {
			method: 'GET',
			query,
		});

		if (result.id && ctx.db.driveItems) {
			try {
				// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
				await ctx.db.driveItems.upsertByEntityId(result.id, {
					...result,
				} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
			} catch (error) {
				console.warn('Failed to save special folder to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'onedrive.drive.getSpecialFolder',
			{ special_folder_name },
			'completed',
		);
		return result;
	};

export const getQuota: OnedriveEndpoints['driveGetQuota'] = async (
	ctx,
	input,
) => {
	const { select_fields } = input;

	const query: Record<string, string | undefined> = {};
	if (select_fields?.length) query['$select'] = select_fields.join(',');

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveGetQuota']
	>('me/drive', ctx.key, { method: 'GET', query });

	if (result.id && ctx.db.drives) {
		try {
			// DB schema requires several fields (name, driveType, etc.) that are optional in the API response; cast after spread to satisfy types while capturing passthrough fields
			await ctx.db.drives.upsertByEntityId(result.id, {
				...result,
			} as Parameters<typeof ctx.db.drives.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save drive quota to database:', error);
		}
	}

	await logEventFromContext(ctx, 'onedrive.drive.getQuota', {}, 'completed');
	return result;
};

export const getRecentItems: OnedriveEndpoints['driveGetRecentItems'] = async (
	ctx,
	input,
) => {
	const { top, select } = input;

	const query: Record<string, string | number | undefined> = {};
	if (top !== undefined) query['$top'] = top;
	if (select) query['$select'] = select;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveGetRecentItems']
	>('me/drive/recent', ctx.key, { method: 'GET', query });

	if (result.value?.length && ctx.db.driveItems) {
		try {
			for (const item of result.value) {
				// any/unknown for item since recent items are untyped array elements
				const driveItem = item as Record<string, unknown>;
				if (driveItem.id && typeof driveItem.id === 'string') {
					// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
					await ctx.db.driveItems.upsertByEntityId(driveItem.id, {
						...driveItem,
					} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
				}
			}
		} catch (error) {
			console.warn('Failed to save recent items to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.drive.getRecentItems',
		{},
		'completed',
	);
	return result;
};

export const getSharedItems: OnedriveEndpoints['driveGetSharedItems'] = async (
	ctx,
	input,
) => {
	const { allow_external } = input;

	const query: Record<string, boolean | undefined> = {};
	if (allow_external !== undefined) query.allowExternal = allow_external;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveGetSharedItems']
	>('me/drive/sharedWithMe', ctx.key, { method: 'GET', query });

	if (result.value?.length && ctx.db.driveItems) {
		try {
			for (const item of result.value) {
				// any/unknown for item since shared items are untyped array elements
				const driveItem = item as Record<string, unknown>;
				if (driveItem.id && typeof driveItem.id === 'string') {
					// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
					await ctx.db.driveItems.upsertByEntityId(driveItem.id, {
						...driveItem,
					} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
				}
			}
		} catch (error) {
			console.warn('Failed to save shared items to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.drive.getSharedItems',
		{},
		'completed',
	);
	return result;
};

export const listActivities: OnedriveEndpoints['driveListActivities'] = async (
	ctx,
	input,
) => {
	const { top } = input;

	const query: Record<string, number | undefined> = {};
	if (top !== undefined) query['$top'] = top;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveListActivities']
	>('me/drive/activities', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'onedrive.drive.listActivities',
		{},
		'completed',
	);
	return result;
};

export const listChanges: OnedriveEndpoints['driveListChanges'] = async (
	ctx,
	input,
) => {
	const { top, token, expand, select } = input;

	const query: Record<string, string | number | undefined> = {};
	if (top !== undefined) query['$top'] = top;
	if (token) query.token = token;
	if (expand) query['$expand'] = expand;
	if (select) query['$select'] = select;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveListChanges']
	>('me/drive/root/delta', ctx.key, { method: 'GET', query });

	if (result.value?.length && ctx.db.driveItems) {
		try {
			for (const item of result.value) {
				// any/unknown for item since delta items are untyped array elements
				const driveItem = item as Record<string, unknown>;
				if (
					driveItem.id &&
					typeof driveItem.id === 'string' &&
					!driveItem.deleted
				) {
					// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
					await ctx.db.driveItems.upsertByEntityId(driveItem.id, {
						...driveItem,
					} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
				}
			}
		} catch (error) {
			console.warn('Failed to save drive changes to database:', error);
		}
	}

	await logEventFromContext(ctx, 'onedrive.drive.listChanges', {}, 'completed');
	return result;
};

export const listBundles: OnedriveEndpoints['driveListBundles'] = async (
	ctx,
	input,
) => {
	const { drive_id, top, expand, filter, select, orderby, skip_token } = input;

	const query: Record<string, string | number | undefined> = {};
	if (top !== undefined) query['$top'] = top;
	if (expand) query['$expand'] = expand;
	if (filter) query['$filter'] = filter;
	if (select) query['$select'] = select;
	if (orderby) query['$orderby'] = orderby;
	if (skip_token) query['$skiptoken'] = skip_token;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['driveListBundles']
	>(`drives/${drive_id}/bundles`, ctx.key, { method: 'GET', query });

	if (result.value?.length && ctx.db.driveItems) {
		try {
			for (const item of result.value) {
				// any/unknown for item since bundle items are untyped array elements
				const driveItem = item as Record<string, unknown>;
				if (driveItem.id && typeof driveItem.id === 'string') {
					// DB schema requires name:string but API returns name as optional; cast after spread to satisfy types while capturing passthrough fields
					await ctx.db.driveItems.upsertByEntityId(driveItem.id, {
						...driveItem,
					} as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
				}
			}
		} catch (error) {
			console.warn('Failed to save bundles to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'onedrive.drive.listBundles',
		{ drive_id },
		'completed',
	);
	return result;
};
