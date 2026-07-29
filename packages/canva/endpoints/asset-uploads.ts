import { logEventFromContext } from 'corsair/core';
import { decodeBase64ToBytes, encodeUtf8ToBase64 } from '../base64';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import { toAssetEntity, withoutBase64 } from './mappers';
import type { CanvaEndpointOutputs } from './types';

async function upsertAssetFromJob(
	ctx: CanvaContext,
	job: CanvaEndpointOutputs['assetUploadsGet']['job'],
) {
	if (!job.asset || !ctx.db.assets) return;
	try {
		await ctx.db.assets.upsertByEntityId(
			job.asset.id,
			toAssetEntity(job.asset),
		);
	} catch (error) {
		console.warn('Failed to save uploaded asset to database:', error);
	}
}

export const create: CanvaEndpoints['assetUploadsCreate'] = async (
	ctx,
	input,
) => {
	const binaryBody = new Blob([decodeBase64ToBytes(input.contentBase64)], {
		type: 'application/octet-stream',
	});

	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['assetUploadsCreate']
	>('v1/asset-uploads', ctx.key, {
		method: 'POST',
		body: binaryBody,
		extraHeaders: {
			'Asset-Upload-Metadata': JSON.stringify({
				name_base64: encodeUtf8ToBase64(input.name),
			}),
		},
	});

	await upsertAssetFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.assetUploads.create',
		withoutBase64(input),
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['assetUploadsGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['assetUploadsGet']
	>(`v1/asset-uploads/${input.jobId}`, ctx.key, { method: 'GET' });

	await upsertAssetFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.assetUploads.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const createFromUrl: CanvaEndpoints['assetUploadsCreateFromUrl'] =
	async (ctx, input) => {
		const result = await makeCanvaRequest<
			CanvaEndpointOutputs['assetUploadsCreateFromUrl']
		>('v1/url-asset-uploads', ctx.key, {
			method: 'POST',
			body: { name: input.name, url: input.url },
		});

		await upsertAssetFromJob(ctx, result.job);

		await logEventFromContext(
			ctx,
			'canva.assetUploads.createFromUrl',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getFromUrl: CanvaEndpoints['assetUploadsGetFromUrl'] = async (
	ctx,
	input,
) => {
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['assetUploadsGetFromUrl']
	>(`v1/url-asset-uploads/${input.jobId}`, ctx.key, { method: 'GET' });

	await upsertAssetFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.assetUploads.getFromUrl',
		{ ...input },
		'completed',
	);
	return result;
};
