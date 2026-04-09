import { logEventFromContext } from 'corsair/core';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const getJSON: FigmaEndpoints['filesGetJSON'] = async (ctx, input) => {
	const { file_key, ...queryParams } = input;
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetJSON']>(
		`v1/files/${file_key}`,
		ctx.key,
		{ method: 'GET', query: { ...queryParams } },
	);

	if (ctx.db.fileMetadata) {
		try {
			await ctx.db.fileMetadata.upsertByEntityId(file_key, {
				id: file_key,
				name: result.name,
				role: result.role,
				last_modified: result.lastModified,
				editorType: result.editorType,
				thumbnail_url: result.thumbnailUrl,
				version: result.version,
			});
		} catch (error) {
			console.warn('Failed to save file metadata to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.files.getJSON',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMetadata: FigmaEndpoints['filesGetMetadata'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['filesGetMetadata']
	>(`v1/files/${input.file_key}`, ctx.key, { method: 'GET' });

	if (ctx.db.fileMetadata) {
		try {
			await ctx.db.fileMetadata.upsertByEntityId(input.file_key, {
				...result,
				id: input.file_key,
			});
		} catch (error) {
			console.warn('Failed to save file metadata to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.files.getMetadata',
		{ ...input },
		'completed',
	);
	return result;
};

export const getNodes: FigmaEndpoints['filesGetNodes'] = async (ctx, input) => {
	const { file_key, ...queryParams } = input;
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetNodes']>(
		`v1/files/${file_key}/nodes`,
		ctx.key,
		{ method: 'GET', query: { ...queryParams } },
	);

	await logEventFromContext(
		ctx,
		'figma.files.getNodes',
		{ ...input },
		'completed',
	);
	return result;
};

export const getStyles: FigmaEndpoints['filesGetStyles'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetStyles']>(
		`v1/files/${input.file_key}/styles`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'figma.files.getStyles',
		{ ...input },
		'completed',
	);
	return result;
};

export const getImageFills: FigmaEndpoints['filesGetImageFills'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['filesGetImageFills']
	>(`v1/files/${input.file_key}/images`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'figma.files.getImageFills',
		{ ...input },
		'completed',
	);
	return result;
};

export const getVersions: FigmaEndpoints['filesGetVersions'] = async (
	ctx,
	input,
) => {
	const { file_key, ...queryParams } = input;
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['filesGetVersions']
	>(`v1/files/${file_key}/versions`, ctx.key, {
		method: 'GET',
		query: { ...queryParams },
	});

	if (result.versions && ctx.db.versions) {
		try {
			for (const version of result.versions) {
				if (version.id) {
					const { user, ...versionData } = version;
					await ctx.db.versions.upsertByEntityId(version.id, {
						...versionData,
						file_key,
						user_id: user?.id,
						user_handle: user?.handle,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save file versions to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.files.getVersions',
		{ ...input },
		'completed',
	);
	return result;
};

export const renderImages: FigmaEndpoints['filesRenderImages'] = async (
	ctx,
	input,
) => {
	const { file_key, ...queryParams } = input;
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['filesRenderImages']
	>(`v1/images/${file_key}`, ctx.key, {
		method: 'GET',
		query: { ...queryParams },
	});

	await logEventFromContext(
		ctx,
		'figma.files.renderImages',
		{ ...input },
		'completed',
	);
	return result;
};

export const getProjectFiles: FigmaEndpoints['filesGetProjectFiles'] = async (
	ctx,
	input,
) => {
	const { project_id, ...queryParams } = input;
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['filesGetProjectFiles']
	>(`v1/projects/${project_id}/files`, ctx.key, {
		method: 'GET',
		query: { ...queryParams },
	});

	if (result.files && ctx.db.fileMetadata) {
		try {
			for (const file of result.files) {
				if (file.key) {
					await ctx.db.fileMetadata.upsertByEntityId(file.key, {
						...file,
						id: file.key,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save project file metadata to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.files.getProjectFiles',
		{ ...input },
		'completed',
	);
	return result;
};
