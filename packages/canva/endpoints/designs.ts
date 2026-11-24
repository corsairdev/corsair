import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import { loggable, toDesignEntity } from './mappers';
import { callCanva, defined, seg } from './shared';
import type { CanvaEndpointOutputs } from './types';
import { CanvaEndpointInputSchemas } from './types';

export const list: CanvaEndpoints['designsList'] = async (ctx, input) => {
	const { query, continuation, ownership, sort_by, limit } = input;
	const result = await makeCanvaRequest<CanvaEndpointOutputs['designsList']>(
		'v1/designs',
		ctx.key,
		{
			method: 'GET',
			query: {
				...(query !== undefined && { query }),
				...(continuation !== undefined && { continuation }),
				...(ownership !== undefined && { ownership }),
				...(sort_by !== undefined && { sort_by }),
				...(limit !== undefined && { limit }),
			},
		},
	);

	if (result.items.length > 0 && ctx.db.designs) {
		try {
			for (const design of result.items) {
				await ctx.db.designs.upsertByEntityId(
					design.id,
					toDesignEntity(design),
				);
			}
		} catch (error) {
			console.warn('Failed to save designs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canva.designs.list',
		loggable(input),
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['designsGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['designsGet']>(
		`v1/designs/${seg(input.designId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (ctx.db.designs) {
		try {
			await ctx.db.designs.upsertByEntityId(
				result.design.id,
				toDesignEntity(result.design),
			);
		} catch (error) {
			console.warn('Failed to save design to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canva.designs.get',
		loggable(input),
		'completed',
	);
	return result;
};

export const create: CanvaEndpoints['designsCreate'] = async (ctx, input) => {
	const parsed = CanvaEndpointInputSchemas.designsCreate.parse(input);
	const type = parsed.type ?? 'type_and_asset';
	const body =
		type === 'design'
			? defined({
					type,
					design_id: parsed.design_id,
					page_numbers: parsed.page_numbers,
				})
			: type === 'brand_template'
				? defined({
						type,
						brand_template_id: parsed.brand_template_id,
						page_numbers: parsed.page_numbers,
					})
				: defined({
						type,
						design_type: parsed.design_type,
						asset_id: parsed.asset_id,
						title: parsed.title,
					});
	const result = await makeCanvaRequest<CanvaEndpointOutputs['designsCreate']>(
		'v1/designs',
		ctx.key,
		{ method: 'POST', body },
	);

	if (ctx.db.designs) {
		try {
			await ctx.db.designs.upsertByEntityId(
				result.design.id,
				toDesignEntity(result.design),
			);
		} catch (error) {
			console.warn('Failed to save design to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canva.designs.create',
		loggable(input),
		'completed',
	);
	return result;
};

export const getPages: CanvaEndpoints['designsGetPages'] = async (
	ctx,
	input,
) => {
	const { designId, offset, limit } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['designsGetPages']
	>(`v1/designs/${seg(designId)}/pages`, ctx.key, {
		method: 'GET',
		query: {
			...(offset !== undefined && { offset }),
			...(limit !== undefined && { limit }),
		},
	});

	await logEventFromContext(
		ctx,
		'canva.designs.getPages',
		loggable(input),
		'completed',
	);
	return result;
};

export const getExportFormats: CanvaEndpoints['designsGetExportFormats'] =
	async (ctx, input) => {
		const result = await makeCanvaRequest<
			CanvaEndpointOutputs['designsGetExportFormats']
		>(`v1/designs/${seg(input.designId)}/export-formats`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'canva.designs.getExportFormats',
			loggable(input),
			'completed',
		);
		return result;
	};

export const getDataset: CanvaEndpoints['designsGetDataset'] = async (
	ctx,
	input,
) =>
	callCanva<CanvaEndpointOutputs['designsGetDataset']>(
		ctx,
		'designs.getDataset',
		loggable(input),
		`v1/designs/${seg(input.designId)}/dataset`,
	);
