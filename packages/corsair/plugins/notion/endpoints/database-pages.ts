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

		if (result && ctx.db.pages) {
			try {
				await ctx.db.pages.upsertByEntityId(result.id, {
					...result,
					database_id: input.database_id,
					parent_id: input.database_id,
					parent_type: 'database_id',
					properties_json: JSON.stringify(result.properties),
				});
			} catch (error) {
				console.warn('Failed to save page to database:', error);
			}
		}

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

		if (result && ctx.db.pages) {
			try {
				const parentId =
					result.parent?.type === 'page_id'
						? result.parent.page_id
						: result.parent?.type === 'database_id'
							? result.parent.database_id
							: result.parent?.type === 'block_id'
								? result.parent.block_id
								: undefined;

				const databaseId =
					result.parent?.type === 'database_id'
						? result.parent.database_id
						: undefined;

				await ctx.db.pages.upsertByEntityId(result.id, {
					...result,
					database_id: databaseId,
					parent_id: parentId,
					parent_type: result.parent?.type,
					properties_json: JSON.stringify(result.properties),
				});
			} catch (error) {
				console.warn('Failed to save page to database:', error);
			}
		}

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

		if (result.results && ctx.db.pages) {
			try {
				for (const page of result.results) {
					if (page.id) {
						const parentId =
							page.parent?.type === 'page_id'
								? page.parent.page_id
								: page.parent?.type === 'database_id'
									? page.parent.database_id
									: page.parent?.type === 'block_id'
										? page.parent.block_id
										: undefined;

						const databaseId =
							page.parent?.type === 'database_id'
								? page.parent.database_id
								: undefined;

						await ctx.db.pages.upsertByEntityId(page.id, {
							...page,
							database_id: databaseId,
							parent_id: parentId,
							parent_type: page.parent?.type,
							properties_json: JSON.stringify(page.properties),
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save pages to database:', error);
			}
		}

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
				...(input.properties && { properties: input.properties }),
				...(input.archived !== undefined && { archived: input.archived }),
			},
		});

		if (result && ctx.db.pages) {
			try {
				const parentId =
					result.parent?.type === 'page_id'
						? result.parent.page_id
						: result.parent?.type === 'database_id'
							? result.parent.database_id
							: result.parent?.type === 'block_id'
								? result.parent.block_id
								: undefined;

				const databaseId =
					result.parent?.type === 'database_id'
						? result.parent.database_id
						: undefined;

				await ctx.db.pages.upsertByEntityId(result.id, {
					...result,
					database_id: databaseId,
					parent_id: parentId,
					parent_type: result.parent?.type,
					properties_json: JSON.stringify(result.properties),
				});
			} catch (error) {
				console.warn('Failed to save page to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'notion.databasePages.updateDatabasePage',
			{ ...input },
			'completed',
		);
		return result;
	};
