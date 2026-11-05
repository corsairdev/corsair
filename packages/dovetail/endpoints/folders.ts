import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const get: DovetailEndpoints['foldersGet'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.foldersGet.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['foldersGet']
	>(`/v1/folders/${encodeURIComponent(parsed.folder_id)}`, ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.foldersGet.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.folders.get',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const list: DovetailEndpoints['foldersList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.foldersList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.page?.limit !== undefined)
		query['page[limit]'] = parsed.page.limit;
	if (parsed.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = parsed.page.start_cursor;
	if (parsed.filter?.parent_folder_id !== undefined) {
		query['filter[parent_folder_id]'] =
			parsed.filter.parent_folder_id === null
				? 'null'
				: parsed.filter.parent_folder_id;
	}
	if (parsed.filter?.title !== undefined)
		query['filter[title]'] = parsed.filter.title;
	if (parsed.sort !== undefined) query.sort = parsed.sort;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['foldersList']
	>('/v1/folders', ctx.key, {
		method: 'GET',
		query,
	});
	const validated = DovetailEndpointOutputSchemas.foldersList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.folders.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};
