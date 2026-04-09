import { logEventFromContext } from 'corsair/core';
import type { BoxBoundEndpoints, BoxEndpoints } from '..';
import { makeBoxRequest } from '../client';
import type { BoxEndpointOutputs } from './types';

export const get: BoxEndpoints['foldersGet'] = async (ctx, input) => {
	const { folder_id, ...query } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersGet']>(
		`folders/${folder_id}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save folder to database:', error);
		}
	}

	await logEventFromContext(ctx, 'box.folders.get', { ...input }, 'completed');
	return result;
};

export const create: BoxEndpoints['foldersCreate'] = async (ctx, input) => {
	const { name, parent_id, ...rest } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersCreate']>(
		'folders',
		ctx.key,
		{
			method: 'POST',
			body: {
				name,
				parent: { id: parent_id },
				...rest,
			},
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save created folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteFolder: BoxEndpoints['foldersDelete'] = async (
	ctx,
	input,
) => {
	const { folder_id, recursive } = input;
	await makeBoxRequest<void>(`folders/${folder_id}`, ctx.key, {
		method: 'DELETE',
		query: { recursive },
	});

	if (ctx.db.folders) {
		try {
			await ctx.db.folders.deleteByEntityId(folder_id);
		} catch (error) {
			console.warn('Failed to delete folder from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const search: BoxEndpoints['foldersSearch'] = async (ctx, input) => {
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersSearch']>(
		'search',
		ctx.key,
		{
			method: 'GET',
			query: {
				...input,
				type: 'folder',
			},
		},
	);

	if (result.entries && ctx.db.folders) {
		try {
			for (const entry of result.entries) {
				if (entry.id) {
					// any: ctx.endpoints is typed as the generic plugin context; cast needed to access Box-specific bound methods
					const endpoints = ctx.endpoints as BoxBoundEndpoints;
					await endpoints.folders.get({ folder_id: entry.id });
				}
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.search',
		{ ...input },
		'completed',
	);
	return result;
};

export const share: BoxEndpoints['foldersShare'] = async (ctx, input) => {
	const { folder_id, shared_link } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersShare']>(
		`folders/${folder_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: { shared_link },
			query: { fields: 'shared_link' },
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save shared folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.share',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: BoxEndpoints['foldersUpdate'] = async (ctx, input) => {
	const { folder_id, fields, ...body } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['foldersUpdate']>(
		`folders/${folder_id}`,
		ctx.key,
		{
			method: 'PUT',
			// any: body is the rest of the typed input object; TS can't widen the intersection to Record<string, unknown> without a cast
			body: body as Record<string, unknown>,
			query: fields ? { fields } : undefined,
		},
	);

	if (result.id && ctx.db.folders) {
		try {
			await ctx.db.folders.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save updated folder to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.folders.update',
		{ ...input },
		'completed',
	);
	return result;
};
