import { logEventFromContext } from '../../utils/events';
import type { NotionEndpoints } from '..';
import { makeNotionRequest } from '../client';
import type { NotionEndpointOutputs } from './types';

export const createDatabasePage: NotionEndpoints['databasePagesCreateDatabasePage'] =
	async (ctx, input) => {
		const result = await makeNotionRequest<
			NotionEndpointOutputs['databasePagesCreateDatabasePage']
		>('v1/pages', ctx.key, {
			method: 'POST',
			body: {
				parent: {
					database_id: input.database_id,
				},
				properties: input.properties,
			},
		});

		await logEventFromContext(
			ctx,
			'notion.databasePages.createDatabasePage',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getDatabasePage: NotionEndpoints['databasePagesGetDatabasePage'] =
	async (ctx, input) => {
		const result = await makeNotionRequest<
			NotionEndpointOutputs['databasePagesGetDatabasePage']
		>(`v1/pages/${input.page_id}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'notion.databasePages.getDatabasePage',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getManyDatabasePages: NotionEndpoints['databasePagesGetManyDatabasePages'] =
	async (ctx, input) => {
		const result = await makeNotionRequest<
			NotionEndpointOutputs['databasePagesGetManyDatabasePages']
		>(`v1/databases/${input.database_id}/query`, ctx.key, {
			method: 'POST',
			body: {
				filter: input.filter,
				sorts: input.sorts,
				start_cursor: input.start_cursor,
				page_size: input.page_size,
			},
		});

		await logEventFromContext(
			ctx,
			'notion.databasePages.getManyDatabasePages',
			{ ...input },
			'completed',
		);
		return result;
	};

export const updateDatabasePage: NotionEndpoints['databasePagesUpdateDatabasePage'] =
	async (ctx, input) => {
		const result = await makeNotionRequest<
			NotionEndpointOutputs['databasePagesUpdateDatabasePage']
		>(`v1/pages/${input.page_id}`, ctx.key, {
			method: 'PATCH',
			body: {
				properties: input.properties,
				archived: input.archived,
			},
		});

		await logEventFromContext(
			ctx,
			'notion.databasePages.updateDatabasePage',
			{ ...input },
			'completed',
		);
		return result;
	};
