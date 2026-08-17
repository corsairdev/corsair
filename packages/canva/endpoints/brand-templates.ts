import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import { toBrandTemplateEntity } from './mappers';
import type { CanvaEndpointOutputs } from './types';

export const list: CanvaEndpoints['brandTemplatesList'] = async (
	ctx,
	input,
) => {
	const { query, continuation, limit, ownership, sort_by, dataset } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['brandTemplatesList']
	>('v1/brand-templates', ctx.key, {
		method: 'GET',
		query: {
			...(query !== undefined && { query }),
			...(continuation !== undefined && { continuation }),
			...(limit !== undefined && { limit }),
			...(ownership !== undefined && { ownership }),
			...(sort_by !== undefined && { sort_by }),
			...(dataset !== undefined && { dataset }),
		},
	});

	if (result.items.length > 0 && ctx.db.brandTemplates) {
		try {
			for (const brandTemplate of result.items) {
				await ctx.db.brandTemplates.upsertByEntityId(
					brandTemplate.id,
					toBrandTemplateEntity(brandTemplate),
				);
			}
		} catch (error) {
			console.warn('Failed to save brand templates to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canva.brandTemplates.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['brandTemplatesGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['brandTemplatesGet']
	>(`v1/brand-templates/${input.brandTemplateId}`, ctx.key, {
		method: 'GET',
	});

	if (ctx.db.brandTemplates) {
		try {
			await ctx.db.brandTemplates.upsertByEntityId(
				result.brand_template.id,
				toBrandTemplateEntity(result.brand_template),
			);
		} catch (error) {
			console.warn('Failed to save brand template to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canva.brandTemplates.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getDataset: CanvaEndpoints['brandTemplatesGetDataset'] = async (
	ctx,
	input,
) => {
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['brandTemplatesGetDataset']
	>(`v1/brand-templates/${input.brandTemplateId}/dataset`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'canva.brandTemplates.getDataset',
		{ ...input },
		'completed',
	);
	return result;
};
