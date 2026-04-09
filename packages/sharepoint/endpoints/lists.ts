import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const listAll: SharepointEndpoints['listsListAll'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['listsListAll']
	>(`/sites/${siteId}/lists`, ctx.key, {
		method: 'GET',
		query: {
			$select:
				'id,displayName,description,createdDateTime,lastModifiedDateTime,list,webUrl',
		},
	});

	if (result.value && ctx.db.lists) {
		try {
			for (const list of result.value) {
				if (list.id) {
					await ctx.db.lists.upsertByEntityId(list.id, {
						id: list.id,
						title: list.displayName,
						description: list.description,
						hidden: list.list?.hidden,
						created: list.createdDateTime,
						lastItemModifiedDate: list.lastModifiedDateTime,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save lists to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.lists.listAll',
		{ ...input },
		'completed',
	);
	return result;
};

export const getByTitle: SharepointEndpoints['listsGetByTitle'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['listsGetByTitle']
	>(`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}`, ctx.key, {
		method: 'GET',
	});

	if (result.id && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(result.id, {
				id: result.id,
				title: result.displayName,
				description: result.description,
				hidden: result.list?.hidden,
				created: result.createdDateTime,
				lastItemModifiedDate: result.lastModifiedDateTime,
			});
		} catch (error) {
			console.warn('Failed to save list to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.lists.getByTitle',
		{ ...input },
		'completed',
	);
	return result;
};

export const getByGuid: SharepointEndpoints['listsGetByGuid'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['listsGetByGuid']
	>(`/sites/${siteId}/lists/${input.list_guid}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(result.id, {
				id: result.id,
				title: result.displayName,
				description: result.description,
				hidden: result.list?.hidden,
				created: result.createdDateTime,
				lastItemModifiedDate: result.lastModifiedDateTime,
			});
		} catch (error) {
			console.warn('Failed to save list to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.lists.getByGuid',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: SharepointEndpoints['listsCreate'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const body: Record<string, unknown> = {
		displayName: input.title,
		list: { template: 'genericList' },
		...(input.description !== undefined && { description: input.description }),
	};

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['listsCreate']
	>(`/sites/${siteId}/lists`, ctx.key, { method: 'POST', body });

	if (result.id && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(result.id, {
				id: result.id,
				title: result.displayName,
				description: result.description,
				hidden: result.list?.hidden,
				created: result.createdDateTime,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save created list to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.lists.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: SharepointEndpoints['listsUpdate'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

	const body: Record<string, unknown> = {
		...(input.title !== undefined && { displayName: input.title }),
		...(input.description !== undefined && { description: input.description }),
	};

	// Look up list by title to get ID for the PATCH
	const list = await makeGraphRequest<{ id?: string }>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}`,
		ctx.key,
		{ method: 'GET', query: { $select: 'id' } },
	);

	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/lists/${list.id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);

	if (ctx.db.lists && list.id) {
		try {
			const existing = await ctx.db.lists.findByEntityId(list.id);
			await ctx.db.lists.upsertByEntityId(list.id, {
				...(existing?.data ?? {}),
				id: list.id,
				title: input.title ?? existing?.data?.title,
				description: input.description ?? existing?.data?.description,
				modifiedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to update list in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.lists.update',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const deleteList: SharepointEndpoints['listsDelete'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/lists/${input.list_guid}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.lists) {
		try {
			await ctx.db.lists.deleteByEntityId(input.list_guid);
		} catch (error) {
			console.warn('Failed to delete list from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.lists.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const deleteByTitle: SharepointEndpoints['listsDeleteByTitle'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

	// Resolve list GUID before deletion so we can remove the DB record by entity ID
	const list = await makeGraphRequest<{ id?: string }>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}`,
		ctx.key,
		{ method: 'GET', query: { $select: 'id' } },
	);

	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.lists && list.id) {
		try {
			await ctx.db.lists.deleteByEntityId(list.id);
		} catch (error) {
			console.warn('Failed to delete list from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.lists.deleteByTitle',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const listColumns: SharepointEndpoints['listsListColumns'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['listsListColumns']
	>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/columns`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.lists.listColumns',
		{ ...input },
		'completed',
	);
	return result;
};

export const getChanges: SharepointEndpoints['listsGetChanges'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

	// Use Graph delta API as the equivalent of SharePoint change log
	const query: Record<string, string | number | boolean | undefined> = {
		$expand: 'fields',
	};
	if (input.change_token) {
		// change_token is used as a delta token in Graph API
		query.$deltatoken = input.change_token;
	}

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['listsGetChanges']
	>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items/delta`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.lists.getChanges',
		{ ...input },
		'completed',
	);
	return result;
};

export const renderDataAsStream: SharepointEndpoints['listsRenderDataAsStream'] =
	async (ctx, input) => {
		const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
		const query: Record<string, string | number | boolean | undefined> = {
			$expand: 'fields',
		};
		if (input.row_limit) query.$top = input.row_limit;

		const result = await makeGraphRequest<
			SharepointEndpointOutputs['listsRenderDataAsStream']
		>(
			`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items`,
			ctx.key,
			{ method: 'GET', query },
		);

		await logEventFromContext(
			ctx,
			'sharepoint.lists.renderDataAsStream',
			{ ...input },
			'completed',
		);
		// Graph API items response is compatible but TypeScript cannot infer the exact shape; cast to expected output
		return result as SharepointEndpointOutputs['listsRenderDataAsStream'];
	};
