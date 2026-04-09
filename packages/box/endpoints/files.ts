import { logEventFromContext } from 'corsair/core';
import type { BoxBoundEndpoints, BoxEndpoints } from '..';
import { makeBoxRequest, makeBoxUploadRequest } from '../client';
import type { BoxEndpointOutputs } from './types';

export const get: BoxEndpoints['filesGet'] = async (ctx, input) => {
	const { file_id, ...query } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['filesGet']>(
		`files/${file_id}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (result.id && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(ctx, 'box.files.get', { ...input }, 'completed');
	return result;
};

export const copy: BoxEndpoints['filesCopy'] = async (ctx, input) => {
	const { file_id, ...body } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['filesCopy']>(
		`files/${file_id}/copy`,
		ctx.key,
		{
			method: 'POST',
			body: body,
		},
	);

	if (result.id && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save copied file to database:', error);
		}
	}

	await logEventFromContext(ctx, 'box.files.copy', { ...input }, 'completed');
	return result;
};

export const deleteFile: BoxEndpoints['filesDelete'] = async (ctx, input) => {
	const { file_id, if_match } = input;
	await makeBoxRequest<void>(`files/${file_id}`, ctx.key, {
		method: 'DELETE',
		headers: if_match ? { 'If-Match': if_match } : undefined,
	});

	if (ctx.db.files) {
		try {
			await ctx.db.files.deleteByEntityId(file_id);
		} catch (error) {
			console.warn('Failed to delete file from database:', error);
		}
	}

	await logEventFromContext(ctx, 'box.files.delete', { ...input }, 'completed');
	return { success: true };
};

export const download: BoxEndpoints['filesDownload'] = async (ctx, input) => {
	const { file_id, ...query } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['filesDownload']>(
		`files/${file_id}/content`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'box.files.download',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: BoxEndpoints['filesSearch'] = async (ctx, input) => {
	const result = await makeBoxRequest<BoxEndpointOutputs['filesSearch']>(
		'search',
		ctx.key,
		{
			method: 'GET',
			query: {
				...input,
				type: 'file',
			},
		},
	);

	if (result.entries && ctx.db.files) {
		try {
			for (const entry of result.entries) {
				if (entry.id) {
					// any: ctx.endpoints is typed as the generic plugin context; cast needed to access Box-specific bound methods
					const endpoints = ctx.endpoints as BoxBoundEndpoints;
					await endpoints.files.get({ file_id: entry.id });
				}
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(ctx, 'box.files.search', { ...input }, 'completed');
	return result;
};

export const share: BoxEndpoints['filesShare'] = async (ctx, input) => {
	const { file_id, shared_link } = input;
	const result = await makeBoxRequest<BoxEndpointOutputs['filesShare']>(
		`files/${file_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: { shared_link },
			query: { fields: 'shared_link' },
		},
	);

	if (result.id && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save shared file to database:', error);
		}
	}

	await logEventFromContext(ctx, 'box.files.share', { ...input }, 'completed');
	return result;
};

export const upload: BoxEndpoints['filesUpload'] = async (ctx, input) => {
	const { name, parent_id, content, ...rest } = input;
	const result = await makeBoxUploadRequest<BoxEndpointOutputs['filesUpload']>(
		'files/content',
		ctx.key,
		{
			attributes: { name, parent: { id: parent_id }, ...rest },
			content: content ?? '',
			fileName: name,
		},
	);

	if (result.entries && ctx.db.files) {
		try {
			for (const file of result.entries) {
				if (file.id) {
					// any: ctx.endpoints is typed as the generic plugin context; cast needed to access Box-specific bound methods
					const endpoints = ctx.endpoints as BoxBoundEndpoints;
					await endpoints.files.get({ file_id: file.id });
				}
			}
		} catch (error) {
			console.warn('Failed to save uploaded file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'box.files.upload',
		{ name, parent_id },
		'completed',
	);
	return result;
};
