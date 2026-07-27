import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs } from './types';

async function upsertAssetFromJob(
	ctx: CanvaContext,
	job: CanvaEndpointOutputs['assetUploadsGet']['job'],
) {
	if (!job.asset || !ctx.db.assets) return;
	try {
		await ctx.db.assets.upsertByEntityId(job.asset.id, {
			id: job.asset.id,
			type: job.asset.type,
			name: job.asset.name,
			tags: job.asset.tags,
			created_at: job.asset.created_at
				? new Date(job.asset.created_at * 1000)
				: null,
			updated_at: job.asset.updated_at
				? new Date(job.asset.updated_at * 1000)
				: null,
		});
	} catch (error) {
		console.warn('Failed to save uploaded asset to database:', error);
	}
}

export const create: CanvaEndpoints['assetUploadsCreate'] = async (
	ctx,
	input,
) => {
	// Blob keeps raw bytes intact through corsair/http (string bodies are UTF-8
	// encoded by fetch and would corrupt binary uploads).
	const binaryBody = new Blob([Buffer.from(input.contentBase64, 'base64')], {
		type: 'application/octet-stream',
	});

	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['assetUploadsCreate']
	>('v1/asset-uploads', ctx.key, {
		method: 'POST',
		body: binaryBody,
		extraHeaders: {
			'Asset-Upload-Metadata': JSON.stringify({
				name_base64: Buffer.from(input.name).toString('base64'),
			}),
		},
	});

	await upsertAssetFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.assetUploads.create',
		{ name: input.name },
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
