import { logEventFromContext } from 'corsair/core';
import type { CustomGPTContext, CustomGPTEndpoints } from '..';
import { makeCustomGPTRequest } from '../client';
import { cacheEntity, omit } from './shared';
import type { CustomGPTEndpointOutputs } from './types';

/** Mirrors an indexed document into the `pages` entity cache. */
async function cachePage(
	ctx: CustomGPTContext,
	page: { id?: number } & Record<string, unknown>,
): Promise<void> {
	if (page?.id === undefined || !ctx.db.pages) return;
	await cacheEntity('page', () =>
		ctx.db.pages.upsertByEntityId(String(page.id), {
			...page,
			id: page.id as number,
			syncedAt: new Date(),
		}),
	);
}

export const listPages: CustomGPTEndpoints['listPages'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['listPages']
	>(`projects/${input.projectId}/pages`, ctx.key, {
		method: 'GET',
		query: omit(input, ['projectId']),
	});

	for (const page of response.data?.pages?.data ?? []) {
		await cachePage(ctx, page);
	}

	await logEventFromContext(
		ctx,
		'customgpt.pages.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const deletePage: CustomGPTEndpoints['deletePage'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['deletePage']
	>(`projects/${input.projectId}/pages/${input.pageId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'customgpt.pages.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const reindexPage: CustomGPTEndpoints['reindexPage'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['reindexPage']
	>(`projects/${input.projectId}/pages/${input.pageId}/reindex`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'customgpt.pages.reindex',
		{ ...input },
		'completed',
	);
	return response;
};

export const getPageMetadata: CustomGPTEndpoints['getPageMetadata'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getPageMetadata']
	>(`projects/${input.projectId}/pages/${input.pageId}/metadata`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'customgpt.pages.metadata.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const updatePageMetadata: CustomGPTEndpoints['updatePageMetadata'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['updatePageMetadata']
		>(`projects/${input.projectId}/pages/${input.pageId}/metadata`, ctx.key, {
			method: 'PUT',
			body: omit(input, ['projectId', 'pageId']),
		});

		await logEventFromContext(
			ctx,
			'customgpt.pages.metadata.update',
			{ projectId: input.projectId, pageId: input.pageId },
			'completed',
		);
		return response;
	};
