import { logEventFromContext } from 'corsair/core';
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
	const result = await makeNotionRequest<
		NotionEndpointOutputs['pagesCreatePage']
	>('v1/pages', ctx.key, {
		method: 'POST',
		body: {
			parent: input.parent,
			...(input.properties && { properties: input.properties }),
			...(input.children && { children: input.children }),
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
	const result = await makeNotionRequest<
		NotionEndpointOutputs['pagesSearchPage']
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

	if (result.results && ctx.db.pages) {
		try {
			for (const item of result.results) {
				// Search can return both pages and databases
				if (item.object === 'page' && item.id) {
					const page = item;
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
				} else if (item.object === 'database' && item.id && ctx.db.databases) {
					const database = item;
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
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'notion.pages.searchPage',
		{ ...input },
		'completed',
	);
	return result;
};
