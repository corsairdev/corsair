import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	DocsContentInput,
	DocsContentResponse,
	DocsCreateInput,
	DocsCreatePageInput,
	DocsCreatePageResponse,
	DocsCreateResponse,
	DocsPageContentInput,
	DocsPageContentResponse,
	DocsPageListingInput,
	DocsPageListingResponse,
	DocsPagesInput,
	DocsPagesResponse,
	DocsSearchInput,
	DocsSearchResponse,
	DocsUpdatePageInput,
	DocsUpdatePageResponse,
} from './types';

const V3 = { version: 'v3' } as const;

export async function search(
	ctx: ClickupRequestContext,
	input: DocsSearchInput,
): Promise<DocsSearchResponse> {
	const { workspace_id, ...query } = input;
	const response = await makeClickupRequest<DocsSearchResponse>(
		`workspaces/${workspace_id}/docs`,
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.docs.search',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: DocsCreateInput,
): Promise<DocsCreateResponse> {
	const { workspace_id, ...body } = input;
	const response = await makeClickupRequest<DocsCreateResponse>(
		`workspaces/${workspace_id}/docs`,
		ctx.key,
		{ method: 'POST', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.docs.create',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function content(
	ctx: ClickupRequestContext,
	input: DocsContentInput,
): Promise<DocsContentResponse> {
	const response = await makeClickupRequest<DocsContentResponse>(
		`workspaces/${input.workspace_id}/docs/${input.doc_id}`,
		ctx.key,
		{ method: 'GET', ...V3 },
	);

	await logEventFromContext(
		ctx,
		'clickup.docs.content',
		{ workspace_id: input.workspace_id },
		'completed',
	);
	return response;
}

export async function pages(
	ctx: ClickupRequestContext,
	input: DocsPagesInput,
): Promise<DocsPagesResponse> {
	const { workspace_id, doc_id, ...query } = input;
	const response = await makeClickupRequest<DocsPagesResponse>(
		`workspaces/${workspace_id}/docs/${doc_id}/pages`,
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.docs.pages',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function pageListing(
	ctx: ClickupRequestContext,
	input: DocsPageListingInput,
): Promise<DocsPageListingResponse> {
	const { workspace_id, doc_id, ...query } = input;
	const response = await makeClickupRequest<DocsPageListingResponse>(
		`workspaces/${workspace_id}/docs/${doc_id}/page_listing`,
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.docs.pageListing',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function pageContent(
	ctx: ClickupRequestContext,
	input: DocsPageContentInput,
): Promise<DocsPageContentResponse> {
	const { workspace_id, doc_id, page_id, ...query } = input;
	const response = await makeClickupRequest<DocsPageContentResponse>(
		`workspaces/${workspace_id}/docs/${doc_id}/pages/${page_id}`,
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.docs.pageContent',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function createPage(
	ctx: ClickupRequestContext,
	input: DocsCreatePageInput,
): Promise<DocsCreatePageResponse> {
	const { workspace_id, doc_id, ...body } = input;
	const response = await makeClickupRequest<DocsCreatePageResponse>(
		`workspaces/${workspace_id}/docs/${doc_id}/pages`,
		ctx.key,
		{ method: 'POST', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.docs.createPage',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function updatePage(
	ctx: ClickupRequestContext,
	input: DocsUpdatePageInput,
): Promise<DocsUpdatePageResponse> {
	const { workspace_id, doc_id, page_id, ...body } = input;
	const response = await makeClickupRequest<DocsUpdatePageResponse>(
		`workspaces/${workspace_id}/docs/${doc_id}/pages/${page_id}`,
		ctx.key,
		{ method: 'PUT', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.docs.updatePage',
		{ workspace_id },
		'completed',
	);
	return response;
}
