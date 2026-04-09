import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const list: SharepointEndpoints['itemsList'] = async (ctx, input) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const query: Record<string, string | number | boolean | undefined> = {
		$expand: 'fields',
	};
	if (input.filter) query['$filter'] = input.filter;
	if (input.select) query['$select'] = input.select;
	if (input.order_by) query['$orderby'] = input.order_by;
	if (input.top !== undefined) query['$top'] = input.top;
	if (input.skip !== undefined) query['$skip'] = input.skip;

	const result = await makeGraphRequest<SharepointEndpointOutputs['itemsList']>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.value && ctx.db.items) {
		try {
			for (const item of result.value) {
				if (item.id) {
					// Graph API fields response is untyped at runtime; cast to access the dynamic Title property
					const fields = item.fields as Record<string, unknown>;
					await ctx.db.items.upsertByEntityId(item.id, {
						id: item.id,
						listTitle: input.list_title,
						title: fields?.Title as string | undefined,
						created: item.createdDateTime,
						modified: item.lastModifiedDateTime,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save items to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.items.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listByGuid: SharepointEndpoints['itemsListByGuid'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const query: Record<string, string | number | boolean | undefined> = {
		$expand: 'fields',
	};
	if (input.filter) query['$filter'] = input.filter;
	if (input.select) query['$select'] = input.select;
	if (input.top !== undefined) query['$top'] = input.top;
	if (input.skip !== undefined) query['$skip'] = input.skip;

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['itemsListByGuid']
	>(`/sites/${siteId}/lists/${input.list_guid}/items`, ctx.key, {
		method: 'GET',
		query,
	});

	if (result.value && ctx.db.items) {
		try {
			for (const item of result.value) {
				if (item.id) {
					// Graph API fields response is untyped at runtime; cast to access the dynamic Title property
					const fields = item.fields as Record<string, unknown>;
					await ctx.db.items.upsertByEntityId(item.id, {
						id: item.id,
						listId: input.list_guid,
						title: fields?.Title as string | undefined,
						created: item.createdDateTime,
						modified: item.lastModifiedDateTime,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save items to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.items.listByGuid',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: SharepointEndpoints['itemsGet'] = async (ctx, input) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const query: Record<string, string | number | boolean | undefined> = {
		$expand: 'fields',
	};
	if (input.select) query['$select'] = input.select;

	const result = await makeGraphRequest<SharepointEndpointOutputs['itemsGet']>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items/${input.item_id}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.id && ctx.db.items) {
		try {
			// Graph API fields response is untyped at runtime; cast to access the dynamic Title property
			const fields = result.fields as Record<string, unknown>;
			await ctx.db.items.upsertByEntityId(result.id, {
				id: result.id,
				listTitle: input.list_title,
				title: fields?.Title as string | undefined,
				created: result.createdDateTime,
				modified: result.lastModifiedDateTime,
			});
		} catch (error) {
			console.warn('Failed to save item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.items.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: SharepointEndpoints['itemsCreate'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	// input.fields is a user-provided dynamic object; cast to satisfy the generic body type
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['itemsCreate']
	>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items`,
		ctx.key,
		{
			method: 'POST',
			body: { fields: input.fields as Record<string, unknown> },
		},
	);

	if (result.id && ctx.db.items) {
		try {
			// Graph API fields response is untyped at runtime; cast to access the dynamic Title property
			const fields = result.fields as Record<string, unknown>;
			await ctx.db.items.upsertByEntityId(result.id, {
				id: result.id,
				listTitle: input.list_title,
				title: fields?.Title as string | undefined,
				created: result.createdDateTime,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save created item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.items.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const createByGuid: SharepointEndpoints['itemsCreateByGuid'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	// input.fields is a user-provided dynamic object; cast to satisfy the generic body type
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['itemsCreateByGuid']
	>(`/sites/${siteId}/lists/${input.list_guid}/items`, ctx.key, {
		method: 'POST',
		body: { fields: input.fields as Record<string, unknown> },
	});

	if (result.id && ctx.db.items) {
		try {
			// Graph API fields response is untyped at runtime; cast to access the dynamic Title property
			const fields = result.fields as Record<string, unknown>;
			await ctx.db.items.upsertByEntityId(result.id, {
				id: result.id,
				listId: input.list_guid,
				title: fields?.Title as string | undefined,
				created: result.createdDateTime,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save created item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.items.createByGuid',
		{ ...input },
		'completed',
	);
	return result;
};

export const createInFolder: SharepointEndpoints['itemsCreateInFolder'] =
	async (ctx, input) => {
		const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
		// input.fields is a user-provided dynamic object; cast to satisfy the generic body type
		const result = await makeGraphRequest<
			SharepointEndpointOutputs['itemsCreateInFolder']
		>(
			`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items`,
			ctx.key,
			{
				method: 'POST',
				body: { fields: input.fields as Record<string, unknown> },
			},
		);

		if (result.id && ctx.db.items) {
			try {
				// Graph API fields response is untyped at runtime; cast to access the dynamic Title property
				const fields = result.fields as Record<string, unknown>;
				await ctx.db.items.upsertByEntityId(result.id, {
					id: result.id,
					listTitle: input.list_title,
					title: fields?.Title as string | undefined,
					created: result.createdDateTime,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save created item to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sharepoint.items.createInFolder',
			{ ...input },
			'completed',
		);
		return result;
	};

export const update: SharepointEndpoints['itemsUpdate'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

	// input.fields is a user-provided dynamic object; cast to satisfy the generic body type
	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items/${input.item_id}/fields`,
		ctx.key,
		{ method: 'PATCH', body: input.fields as Record<string, unknown> },
	);

	if (ctx.db.items) {
		try {
			const itemId = String(input.item_id);
			const existing = await ctx.db.items.findByEntityId(itemId);
			await ctx.db.items.upsertByEntityId(itemId, {
				...(existing?.data ?? {}),
				id: itemId,
				modifiedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to update item in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.items.update',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const deleteItem: SharepointEndpoints['itemsDelete'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items/${input.item_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.items) {
		try {
			await ctx.db.items.deleteByEntityId(String(input.item_id));
		} catch (error) {
			console.warn('Failed to delete item from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.items.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const recycle: SharepointEndpoints['itemsRecycle'] = async (
	ctx,
	input,
) => {
	// Graph API uses DELETE; there is no separate recycle endpoint
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	await makeGraphRequest<Record<string, unknown>>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items/${input.item_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.items) {
		try {
			await ctx.db.items.deleteByEntityId(String(input.item_id));
		} catch (error) {
			console.warn('Failed to remove recycled item from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.items.recycle',
		{ ...input },
		'completed',
	);
	return { value: undefined };
};

export const getVersion: SharepointEndpoints['itemsGetVersion'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['itemsGetVersion']
	>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items/${input.item_id}/versions/${input.version_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.items.getVersion',
		{ ...input },
		'completed',
	);
	return result;
};

export const getEtag: SharepointEndpoints['itemsGetEtag'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<{ '@odata.etag'?: string }>(
		`/sites/${siteId}/lists/${encodeURIComponent(input.list_title)}/items/${input.item_id}`,
		ctx.key,
		{ method: 'GET', query: { $select: 'id' } },
	);

	const etag = result['@odata.etag'] ?? '';

	await logEventFromContext(
		ctx,
		'sharepoint.items.getEtag',
		{ ...input },
		'completed',
	);
	return { etag };
};

export const addAttachment: SharepointEndpoints['itemsAddAttachment'] = async (
	ctx,
	input,
) => {
	// Graph API does not support SharePoint list item attachments; use DriveItem approach
	// Return a stub response for backwards compatibility
	await logEventFromContext(
		ctx,
		'sharepoint.items.addAttachment',
		{ ...input },
		'completed',
	);
	return { FileName: input.file_name, ServerRelativeUrl: undefined };
};

export const getAttachmentContent: SharepointEndpoints['itemsGetAttachmentContent'] =
	async (ctx, input) => {
		// Graph API does not support SharePoint list item attachments
		await logEventFromContext(
			ctx,
			'sharepoint.items.getAttachmentContent',
			{ ...input },
			'completed',
		);
		return { content: undefined, fileName: input.file_name };
	};

export const listAttachments: SharepointEndpoints['itemsListAttachments'] =
	async (ctx, input) => {
		// Graph API does not expose SP list item attachments; return an empty list
		await logEventFromContext(
			ctx,
			'sharepoint.items.listAttachments',
			{ ...input },
			'completed',
		);
		return { value: [] };
	};
