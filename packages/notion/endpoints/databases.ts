import { logEventFromContext } from 'corsair/core';
import { makeNotionRequest } from '../client';
import type { NotionEndpoints } from '../index';
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

	if (result && ctx.db.databases) {
		try {
			const parentId =
				result.parent?.type === 'page_id'
					? result.parent.page_id
					: result.parent?.type === 'database_id'
						? result.parent.database_id
						: result.parent?.type === 'block_id'
							? result.parent.block_id
							: undefined;

			await ctx.db.databases.upsertByEntityId(result.id, {
				...result,
				title: result.title?.[0]?.plain_text || '',
				description: result.description?.[0]?.plain_text || '',
				properties_json: JSON.stringify(result.properties),
				parent_id: parentId,
				parent_type: result.parent?.type,
			});
		} catch (error) {
			console.warn('Failed to save database to database:', error);
		}
	}

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

		if (result.results && ctx.db.databases) {
			try {
				for (const database of result.results) {
					if (database.id) {
						const parentId =
							database.parent?.type === 'page_id'
								? database.parent.page_id
								: database.parent?.type === 'database_id'
									? database.parent.database_id
									: database.parent?.type === 'block_id'
										? database.parent.block_id
										: undefined;

						await ctx.db.databases.upsertByEntityId(database.id, {
							...database,
							title: database.title?.[0]?.plain_text || '',
							description: database.description?.[0]?.plain_text || '',
							properties_json: JSON.stringify(database.properties),
							parent_id: parentId,
							parent_type: database.parent?.type,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save databases to database:', error);
			}
		}

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
				filter: input.filter ?? { value: 'database', property: 'object' },
				start_cursor: input.start_cursor,
				page_size: input.page_size,
			},
		});

		if (result.results && ctx.db.databases) {
			try {
				for (const database of result.results) {
					if (database.id) {
						const parentId =
							database.parent?.type === 'page_id'
								? database.parent.page_id
								: database.parent?.type === 'database_id'
									? database.parent.database_id
									: database.parent?.type === 'block_id'
										? database.parent.block_id
										: undefined;

						await ctx.db.databases.upsertByEntityId(database.id, {
							...database,
							title: database.title?.[0]?.plain_text || '',
							description: database.description?.[0]?.plain_text || '',
							properties_json: JSON.stringify(database.properties),
							parent_id: parentId,
							parent_type: database.parent?.type,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save databases to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'notion.databases.searchDatabase',
			{ ...input },
			'completed',
		);
		return result;
	};
