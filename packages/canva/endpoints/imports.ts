import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaContext, CanvaEndpoints } from '../index';
import type { CanvaEndpointOutputs } from './types';

async function upsertDesignsFromJob(
	ctx: CanvaContext,
	job: CanvaEndpointOutputs['importsGet']['job'],
) {
	if (!job.result?.designs?.length || !ctx.db.designs) return;
	try {
		for (const design of job.result.designs) {
			await ctx.db.designs.upsertByEntityId(design.id, {
				id: design.id,
				title: design.title,
				url: design.url,
			});
		}
	} catch (error) {
		console.warn('Failed to save imported designs to database:', error);
	}
}

export const create: CanvaEndpoints['importsCreate'] = async (ctx, input) => {
	// Blob keeps raw bytes intact through corsair/http (string bodies are UTF-8
	// encoded by fetch and would corrupt binary imports).
	const binaryBody = new Blob([Buffer.from(input.contentBase64, 'base64')], {
		type: 'application/octet-stream',
	});

	const result = await makeCanvaRequest<CanvaEndpointOutputs['importsCreate']>(
		'v1/imports',
		ctx.key,
		{
			method: 'POST',
			body: binaryBody,
			extraHeaders: {
				'Import-Metadata': JSON.stringify({
					title_base64: Buffer.from(input.title).toString('base64'),
					...(input.mime_type !== undefined && {
						mime_type: input.mime_type,
					}),
				}),
			},
		},
	);

	await upsertDesignsFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.imports.create',
		{ title: input.title },
		'completed',
	);
	return result;
};

export const get: CanvaEndpoints['importsGet'] = async (ctx, input) => {
	const result = await makeCanvaRequest<CanvaEndpointOutputs['importsGet']>(
		`v1/imports/${input.jobId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await upsertDesignsFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.imports.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const createFromUrl: CanvaEndpoints['importsCreateFromUrl'] = async (
	ctx,
	input,
) => {
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['importsCreateFromUrl']
	>('v1/url-imports', ctx.key, {
		method: 'POST',
		body: { title: input.title, url: input.url },
	});

	await upsertDesignsFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.imports.createFromUrl',
		{ ...input },
		'completed',
	);
	return result;
};

export const getFromUrl: CanvaEndpoints['importsGetFromUrl'] = async (
	ctx,
	input,
) => {
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['importsGetFromUrl']
	>(`v1/url-imports/${input.jobId}`, ctx.key, { method: 'GET' });

	await upsertDesignsFromJob(ctx, result.job);

	await logEventFromContext(
		ctx,
		'canva.imports.getFromUrl',
		{ ...input },
		'completed',
	);
	return result;
};
