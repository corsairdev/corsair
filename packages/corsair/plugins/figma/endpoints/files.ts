import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const getJSON: FigmaEndpoints['filesGetJSON'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetJSON']>(
		`v1/files/${input.file_key}`,
		ctx.key,
		{
			method: 'GET',
			query: {
				version: input.version,
				ids: input.ids,
				depth: input.depth,
				geometry: input.geometry,
				plugin_data: input.plugin_data,
				branch_data: input.branch_data,
				simplify: input.simplify,
				include_raw: input.include_raw,
			},
		},
	);

	if (ctx.db.fileMetadata) {
		try {
			await ctx.db.fileMetadata.upsertByEntityId(input.file_key, {
				id: input.file_key,
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

	await logEventFromContext(ctx, 'figma.files.getJSON', { ...input }, 'completed');
	return result;
};

export const getMetadata: FigmaEndpoints['filesGetMetadata'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetMetadata']>(
		`v1/files/${input.file_key}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (ctx.db.fileMetadata) {
		try {
			await ctx.db.fileMetadata.upsertByEntityId(input.file_key, {
				id: input.file_key,
				name: result.name,
				role: result.role,
				last_modified: result.last_modified,
				editorType: result.editorType,
				thumbnail_url: result.thumbnail_url,
				version: result.version,
			});
		} catch (error) {
			console.warn('Failed to save file metadata to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.files.getMetadata', { ...input }, 'completed');
	return result;
};

export const getNodes: FigmaEndpoints['filesGetNodes'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetNodes']>(
		`v1/files/${input.file_key}/nodes`,
		ctx.key,
		{
			method: 'GET',
			query: {
				ids: input.ids,
				version: input.version,
				depth: input.depth,
				geometry: input.geometry,
				plugin_data: input.plugin_data,
			},
		},
	);

	await logEventFromContext(ctx, 'figma.files.getNodes', { ...input }, 'completed');
	return result;
};

export const getStyles: FigmaEndpoints['filesGetStyles'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetStyles']>(
		`v1/files/${input.file_key}/styles`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'figma.files.getStyles', { ...input }, 'completed');
	return result;
};

export const getImageFills: FigmaEndpoints['filesGetImageFills'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetImageFills']>(
		`v1/files/${input.file_key}/images`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'figma.files.getImageFills', { ...input }, 'completed');
	return result;
};

export const getVersions: FigmaEndpoints['filesGetVersions'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetVersions']>(
		`v1/files/${input.file_key}/versions`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page_size: input.page_size,
				before: input.before,
				after: input.after,
			},
		},
	);

	if (result.versions && ctx.db.versions) {
		try {
			for (const version of result.versions) {
				if (version.id) {
					await ctx.db.versions.upsertByEntityId(version.id, {
						id: version.id,
						file_key: input.file_key,
						label: version.label,
						description: version.description,
						created_at: version.created_at,
						user_id: version.user?.id,
						user_handle: version.user?.handle,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save file versions to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.files.getVersions', { ...input }, 'completed');
	return result;
};

export const renderImages: FigmaEndpoints['filesRenderImages'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesRenderImages']>(
		`v1/images/${input.file_key}`,
		ctx.key,
		{
			method: 'GET',
			query: {
				ids: input.ids,
				scale: input.scale,
				format: input.format,
				version: input.version,
				contents_only: input.contents_only,
				svg_include_id: input.svg_include_id,
				svg_outline_text: input.svg_outline_text,
				svg_include_node_id: input.svg_include_node_id,
				svg_simplify_stroke: input.svg_simplify_stroke,
				use_absolute_bounds: input.use_absolute_bounds,
			},
		},
	);

	await logEventFromContext(ctx, 'figma.files.renderImages', { ...input }, 'completed');
	return result;
};

export const getProjectFiles: FigmaEndpoints['filesGetProjectFiles'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['filesGetProjectFiles']>(
		`v1/projects/${input.project_id}/files`,
		ctx.key,
		{
			method: 'GET',
			query: { branch_data: input.branch_data },
		},
	);

	await logEventFromContext(ctx, 'figma.files.getProjectFiles', { ...input }, 'completed');
	return result;
};
