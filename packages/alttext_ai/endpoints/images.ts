import { logEventFromContext } from 'corsair/core';
import { makeAltTextAiRequest } from '../client';
import type { AltTextAiEndpoints } from '../index';
import { cacheImageRecord } from './shared';
import type { AltTextAiEndpointOutputs } from './types';

export const list: AltTextAiEndpoints['list'] = async (ctx, input) => {
	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['list']
	>('/images', {
		apiKey: ctx.key,
		query: {
			page: input.page,
			limit: input.limit,
			url: input.url,
		},
	});

	await logEventFromContext(ctx, 'alttext_ai.images.list', { ...input }, 'completed');
	return response;
};

export const create: AltTextAiEndpoints['create'] = async (ctx, input) => {
	// CreateImageInput includes optional fields beyond Record<string, unknown>.
	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['create']
	>('/images', {
		apiKey: ctx.key,
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	await cacheImageRecord(ctx, response);

	await logEventFromContext(ctx, 'alttext_ai.images.create', { ...input }, 'completed');
	return response;
};

export const get: AltTextAiEndpoints['get'] = async (ctx, input) => {
	const response = await makeAltTextAiRequest<AltTextAiEndpointOutputs['get']>(
		`/images/${encodeURIComponent(input.assetId)}`,
		{ apiKey: ctx.key },
	);

	await cacheImageRecord(ctx, response);

	await logEventFromContext(
		ctx,
		'alttext_ai.images.get',
		{ assetId: input.assetId },
		'completed',
	);
	return response;
};

export const update: AltTextAiEndpoints['update'] = async (ctx, input) => {
	const { assetId, lang, overwrite, image } = input;

	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['update']
	>(`/images/${encodeURIComponent(assetId)}`, {
		apiKey: ctx.key,
		method: 'PUT',
		query: { lang, overwrite },
		body: { image },
	});

	await cacheImageRecord(ctx, response);

	await logEventFromContext(
		ctx,
		'alttext_ai.images.update',
		{ assetId: input.assetId },
		'completed',
	);
	return response;
};

export const deleteImage: AltTextAiEndpoints['delete'] = async (ctx, input) => {
	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['delete']
	>(`/images/${encodeURIComponent(input.assetId)}`, {
		apiKey: ctx.key,
		method: 'DELETE',
	});

	if (ctx.db.images?.deleteByEntityId) {
		try {
			await ctx.db.images.deleteByEntityId(input.assetId);
		} catch (error) {
			console.warn('[alttext_ai] Failed to delete image from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'alttext_ai.images.delete',
		{ assetId: input.assetId },
		'completed',
	);
	return response;
};

export const search: AltTextAiEndpoints['search'] = async (ctx, input) => {
	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['search']
	>('/images/search', {
		apiKey: ctx.key,
		query: {
			q: input.q,
			page: input.page,
			limit: input.limit,
		},
	});

	await logEventFromContext(ctx, 'alttext_ai.images.search', { ...input }, 'completed');
	return response;
};

export const bulkCreate: AltTextAiEndpoints['bulkCreate'] = async (ctx, input) => {
	const formData: Record<string, unknown> = {
		file: input.file,
	};
	if (input.email !== undefined) {
		formData.email = input.email;
	}

	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['bulkCreate']
	>('/images/bulk_create', {
		apiKey: ctx.key,
		method: 'POST',
		formData,
	});

	await logEventFromContext(
		ctx,
		'alttext_ai.images.bulkCreate',
		{ email: input.email },
		'completed',
	);
	return response;
};

export const pageScrape: AltTextAiEndpoints['pageScrape'] = async (ctx, input) => {
	// PageScrapeInput uses .loose() Zod schema; cast satisfies JSON body typing.
	const response = await makeAltTextAiRequest<
		AltTextAiEndpointOutputs['pageScrape']
	>('/images/page_scrape', {
		apiKey: ctx.key,
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'alttext_ai.images.pageScrape',
		{ ...input },
		'completed',
	);
	return response;
};
