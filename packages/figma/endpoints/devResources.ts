import { logEventFromContext } from 'corsair/core';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const create: FigmaEndpoints['devResourcesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['devResourcesCreate']
	>(`v1/dev_resources`, ctx.key, { method: 'POST', body: { ...input } });

	if (result.links_created && ctx.db.fileMetadata) {
		try {
			const seenFileKeys = new Set<string>();
			for (const link of result.links_created) {
				if (link.file_key && !seenFileKeys.has(link.file_key)) {
					seenFileKeys.add(link.file_key);
					await ctx.db.fileMetadata.upsertByEntityId(link.file_key, {
						id: link.file_key,
					});
				}
			}
		} catch (error) {
			console.warn(
				'Failed to save dev resource file metadata to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.devResources.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteDevResource: FigmaEndpoints['devResourcesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['devResourcesDelete']
	>(
		`v1/files/${input.file_key}/dev_resources/${input.dev_resource_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.fileMetadata) {
		try {
			await ctx.db.fileMetadata.upsertByEntityId(input.file_key, {
				id: input.file_key,
			});
		} catch (error) {
			console.warn(
				'Failed to update file metadata after dev resource deletion:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.devResources.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: FigmaEndpoints['devResourcesGet'] = async (ctx, input) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['devResourcesGet']
	>(`v1/files/${input.file_key}/dev_resources`, ctx.key, {
		method: 'GET',
		query: { node_ids: input.node_ids },
	});

	if (ctx.db.fileMetadata) {
		try {
			await ctx.db.fileMetadata.upsertByEntityId(input.file_key, {
				id: input.file_key,
			});
		} catch (error) {
			console.warn('Failed to save file metadata to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.devResources.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: FigmaEndpoints['devResourcesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['devResourcesUpdate']
	>(`v1/dev_resources`, ctx.key, { method: 'PUT', body: { ...input } });

	await logEventFromContext(
		ctx,
		'figma.devResources.update',
		{ ...input },
		'completed',
	);
	return result;
};
