import { logEventFromContext } from '../../utils/events';
import type { NotionEndpoints } from '..';
import { makeNotionRequest } from '../client';
import type { NotionEndpointOutputs } from './types';

export const getDatabase: NotionEndpoints['databasesGetDatabase'] = async (
	ctx,
	input,
) => {
	const result = await makeNotionRequest<
		NotionEndpointOutputs['databasesGetDatabase']
	>(`v1/databases/${input.database_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'notion.databases.getDatabase',
		{ ...input },
		'completed',
	);
	return result;
};

export const getManyDatabases: NotionEndpoints['databasesGetManyDatabases'] =
	async (ctx, input) => {
		const result = await makeNotionRequest<
			NotionEndpointOutputs['databasesGetManyDatabases']
		>('v1/search', ctx.key, {
			method: 'POST',
		body: {
			filter: {
				value: 'database',
				property: 'object',
			},
			start_cursor: input.start_cursor,
			page_size: input.page_size,
		},
		});

		await logEventFromContext(
			ctx,
			'notion.databases.getManyDatabases',
			{ ...input },
			'completed',
		);
		return result;
	};

export const searchDatabase: NotionEndpoints['databasesSearchDatabase'] =
	async (ctx, input) => {
		const result = await makeNotionRequest<
			NotionEndpointOutputs['databasesSearchDatabase']
		>('v1/search', ctx.key, {
			method: 'POST',
			body: {
				query: input.query,
				sort: input.sort,
				filter: input.filter,
				start_cursor: input.start_cursor,
				page_size: input.page_size,
			},
		});

		await logEventFromContext(
			ctx,
			'notion.databases.searchDatabase',
			{ ...input },
			'completed',
		);
		return result;
	};
