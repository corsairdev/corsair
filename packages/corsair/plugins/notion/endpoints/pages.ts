import { logEventFromContext } from '../../utils/events';
import type { NotionEndpoints } from '..';
import { makeNotionRequest } from '../client';
import type { NotionEndpointOutputs } from './types';

export const archivePage: NotionEndpoints['pagesArchivePage'] = async (
	ctx,
	input,
) => {
	const result = await makeNotionRequest<
		NotionEndpointOutputs['pagesArchivePage']
	>(`v1/pages/${input.page_id}`, ctx.key, {
		method: 'PATCH',
		body: {
			archived: true,
		},
	});

	await logEventFromContext(
		ctx,
		'notion.pages.archivePage',
		{ ...input },
		'completed',
	);
	return result;
};

export const createPage: NotionEndpoints['pagesCreatePage'] = async (
	ctx,
	input,
) => {
	const result = await makeNotionRequest<NotionEndpointOutputs['pagesCreatePage']>(
		'v1/pages',
		ctx.key,
		{
			method: 'POST',
			body: {
				parent: input.parent,
				properties: input.properties,
				children: input.children,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'notion.pages.createPage',
		{ ...input },
		'completed',
	);
	return result;
};

export const searchPage: NotionEndpoints['pagesSearchPage'] = async (
	ctx,
	input,
) => {
	const result = await makeNotionRequest<NotionEndpointOutputs['pagesSearchPage']>(
		'v1/search',
		ctx.key,
		{
			method: 'POST',
			body: {
				query: input.query,
				sort: input.sort,
				filter: input.filter,
				start_cursor: input.start_cursor,
				page_size: input.page_size,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'notion.pages.searchPage',
		{ ...input },
		'completed',
	);
	return result;
};
