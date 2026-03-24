import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const get: FigmaEndpoints['componentsGet'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['componentsGet']>(
		`v1/components/${input.key}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.meta?.component?.key && ctx.db.components) {
		try {
			const component = result.meta.component;
			await ctx.db.components.upsertByEntityId(component.key, {
				key: component.key,
				file_key: component.file_key,
				node_id: component.node_id,
				name: component.name,
				description: component.description,
				thumbnail_url: component.thumbnail_url,
				created_at: component.created_at,
				updated_at: component.updated_at,
			});
		} catch (error) {
			console.warn('Failed to save component to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.components.get', { ...input }, 'completed');
	return result;
};

export const getComponentSet: FigmaEndpoints['componentSetsGet'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['componentSetsGet']>(
		`v1/component_sets/${input.key}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'figma.components.getComponentSet', { ...input }, 'completed');
	return result;
};

export const getForFile: FigmaEndpoints['componentsGetForFile'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['componentsGetForFile']>(
		`v1/files/${input.file_key}/components`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.meta?.components && ctx.db.components) {
		try {
			for (const component of result.meta.components) {
				if (component.key) {
					await ctx.db.components.upsertByEntityId(component.key, {
						key: component.key,
						file_key: component.file_key,
						node_id: component.node_id,
						name: component.name,
						description: component.description,
						thumbnail_url: component.thumbnail_url,
						created_at: component.created_at,
						updated_at: component.updated_at,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save components to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.components.getForFile', { ...input }, 'completed');
	return result;
};

export const getComponentSetsForFile: FigmaEndpoints['componentSetsGetForFile'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['componentSetsGetForFile']>(
		`v1/files/${input.file_key}/component_sets`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'figma.components.getComponentSetsForFile',
		{ ...input },
		'completed',
	);
	return result;
};

export const getForTeam: FigmaEndpoints['componentsGetForTeam'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['componentsGetForTeam']>(
		`v1/teams/${input.team_id}/components`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page_size: input.page_size,
				after: input.after,
				before: input.before,
			},
		},
	);

	if (result.meta?.components && ctx.db.components) {
		try {
			for (const component of result.meta.components) {
				if (component.key) {
					await ctx.db.components.upsertByEntityId(component.key, {
						key: component.key,
						file_key: component.file_key,
						node_id: component.node_id,
						name: component.name,
						description: component.description,
						thumbnail_url: component.thumbnail_url,
						created_at: component.created_at,
						updated_at: component.updated_at,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save team components to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.components.getForTeam', { ...input }, 'completed');
	return result;
};

export const getComponentSetsForTeam: FigmaEndpoints['componentSetsGetForTeam'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['componentSetsGetForTeam']>(
		`v1/teams/${input.team_id}/component_sets`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page_size: input.page_size,
				after: input.after,
				before: input.before,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'figma.components.getComponentSetsForTeam',
		{ ...input },
		'completed',
	);
	return result;
};
