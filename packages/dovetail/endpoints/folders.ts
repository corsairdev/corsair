import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const get: DovetailEndpoints['foldersGet'] = async (ctx, input) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['foldersGet']
	>(`/v1/folders/${encodeURIComponent(input.folder_id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'dovetail.folders.get',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const list: DovetailEndpoints['foldersList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page?.limit !== undefined) query['page[limit]'] = input.page.limit;
	if (input.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = input.page.start_cursor;
	if (input.filter?.parent_folder_id !== undefined) {
		query['filter[parent_folder_id]'] =
			input.filter.parent_folder_id === null
				? 'null'
				: input.filter.parent_folder_id;
	}
	if (input.filter?.title !== undefined)
		query['filter[title]'] = input.filter.title;
	if (input.sort !== undefined) query.sort = input.sort;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['foldersList']
	>('/v1/folders', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'dovetail.folders.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};
