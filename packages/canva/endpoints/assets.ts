import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import type { Asset, CanvaEndpointOutputs } from './types';

function toAssetEntity(asset: Asset) {
	return {
		id: asset.id,
		type: asset.type,
		name: asset.name,
		tags: asset.tags,
		created_at: asset.created_at ? new Date(asset.created_at * 1000) : null,
		updated_at: asset.updated_at ? new Date(asset.updated_at * 1000) : null,
	};
}

export const get: CanvaEndpoints['assetsGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['assetsGet']>(
		`v1/assets/${input.assetId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (ctx.db.assets) {
		try {
			await ctx.db.assets.upsertByEntityId(
				result.asset.id,
				toAssetEntity(result.asset),
			);
		} catch (error) {
			console.warn('Failed to save asset to database:', error);
		}
	}

	await logEventFromContext(ctx, 'canva.assets.get', { ...input }, 'completed');
	return result;
};

export const update: CanvaEndpoints['assetsUpdate'] = async (ctx, input) => {
	const { assetId, name, tags } = input;
	const result = await makeCanvaRequest<CanvaEndpointOutputs['assetsUpdate']>(
		`v1/assets/${assetId}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				...(name !== undefined && { name }),
				...(tags !== undefined && { tags }),
			},
		},
	);

	if (ctx.db.assets) {
		try {
			await ctx.db.assets.upsertByEntityId(
				result.asset.id,
				toAssetEntity(result.asset),
			);
		} catch (error) {
			console.warn('Failed to update asset in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canva.assets.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteAsset: CanvaEndpoints['assetsDelete'] = async (
	ctx,
	input,
) => {
	await makeCanvaRequest<void>(`v1/assets/${input.assetId}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.assets) {
		try {
			await ctx.db.assets.deleteByEntityId(input.assetId);
		} catch (error) {
			console.warn('Failed to delete asset from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canva.assets.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};
