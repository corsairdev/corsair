import dotenv from 'dotenv';
import { makeNotionRequest } from './client';
import type { NotionEndpointOutputs } from './endpoints/types';

dotenv.config();

const TEST_API_KEY = process.env.NOTION_API_KEY!;

// Helper function to fetch a database ID
async function fetchDatabaseId(): Promise<string> {
	console.log('[fetchDatabaseId] Starting database search...');
	
	// Try searching for pages first, they might be in databases
	console.log('[fetchDatabaseId] Searching for pages...');
	const pagesResponse = await makeNotionRequest<NotionEndpointOutputs['pagesSearchPage']>(
		'v1/search',
		TEST_API_KEY,
		{
			method: 'POST',
			body: {
				filter: {
					value: 'page',
					property: 'object',
				},
				page_size: 10,
			},
		},
	);
	console.log('[fetchDatabaseId] Pages response:', JSON.stringify(pagesResponse, null, 2));
	const pages = pagesResponse as { results?: Array<{ id?: string; parent?: { type?: string; database_id?: string } }> };
	console.log('[fetchDatabaseId] Pages found:', pages?.results?.length || 0);
	if (pages?.results) {
		for (let i = 0; i < pages.results.length; i++) {
			const page = pages.results[i];
			console.log(`[fetchDatabaseId] Page ${i}:`, {
				id: page?.id,
				parentType: page?.parent?.type,
				databaseId: page?.parent?.database_id,
			});
			if (page?.parent?.type === 'database_id' && page.parent.database_id) {
				console.log('[fetchDatabaseId] Found database ID from page:', page.parent.database_id);
				return page.parent.database_id;
			}
		}
	}
	
	// If still no database, try direct search
	console.log('[fetchDatabaseId] No database found from pages, searching directly for databases...');
	const databasesResponse = await makeNotionRequest<NotionEndpointOutputs['databasesGetManyDatabases']>(
		'v1/search',
		TEST_API_KEY,
		{
			method: 'POST',
			body: {
				filter: {
					value: 'database',
					property: 'object',
				},
				page_size: 10,
			},
		},
	);
	console.log('[fetchDatabaseId] Databases response:', JSON.stringify(databasesResponse, null, 2));
	const databases = databasesResponse as { results?: Array<{ id?: string; object?: string; title?: any }> };
	console.log('[fetchDatabaseId] Databases found:', databases?.results?.length || 0);
	if (databases?.results) {
		for (let i = 0; i < databases.results.length; i++) {
			const db = databases.results[i];
			console.log(`[fetchDatabaseId] Database ${i}:`, {
				id: db?.id,
				object: db?.object,
				title: db?.title,
			});
		}
	}
	if (databases?.results && databases.results.length > 0 && databases.results[0]?.id) {
		console.log('[fetchDatabaseId] Found database ID:', databases.results[0].id);
		return databases.results[0].id;
	}
	console.error('[fetchDatabaseId] No databases found in response');
	throw new Error('No databases found');
}

describe('Notion API Type Tests', () => {
	let testDatabaseId: string | undefined;
	let testPageId: string | undefined;
	let testBlockId: string | undefined;
	let testUserId: string | undefined;

	beforeAll(async () => {
		console.log('[beforeAll] Starting setup...');
		
		// Try to get a page first (more common than databases)
		console.log('[beforeAll] Searching for pages...');
		const pagesSearchResponse = await makeNotionRequest<NotionEndpointOutputs['pagesSearchPage']>(
			'v1/search',
			TEST_API_KEY,
			{
				method: 'POST',
				body: {
					filter: {
						value: 'page',
						property: 'object',
					},
					page_size: 10,
				},
			},
		);
		console.log('[beforeAll] Pages search response:', JSON.stringify(pagesSearchResponse, null, 2));
		const pagesSearch = pagesSearchResponse as { results?: Array<{ id?: string; parent?: { type?: string; database_id?: string } }> };
		console.log('[beforeAll] Pages found:', pagesSearch?.results?.length || 0);
		if (pagesSearch?.results && pagesSearch.results.length > 0) {
			testPageId = pagesSearch.results[0]?.id;
			console.log('[beforeAll] First page ID:', testPageId);
			console.log('[beforeAll] First page parent:', pagesSearch.results[0]?.parent);
			// If the page is in a database, get the database ID
			if (pagesSearch.results[0]?.parent?.type === 'database_id' && pagesSearch.results[0]?.parent?.database_id) {
				testDatabaseId = pagesSearch.results[0].parent.database_id;
				console.log('[beforeAll] Found database ID from page:', testDatabaseId);
			}
		}

		// If we don't have a database yet, try to search for one
		if (!testDatabaseId) {
			console.log('[beforeAll] No database from pages, searching directly for databases...');
			const databasesResponse = await makeNotionRequest<NotionEndpointOutputs['databasesGetManyDatabases']>(
				'v1/search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						filter: {
							value: 'database',
							property: 'object',
						},
						page_size: 10,
					},
				},
			);
			console.log('[beforeAll] Databases search response:', JSON.stringify(databasesResponse, null, 2));
			const databases = databasesResponse as { results?: Array<{ id?: string; object?: string; title?: any }> };
			console.log('[beforeAll] Databases found:', databases?.results?.length || 0);
			if (databases?.results) {
				for (let i = 0; i < databases.results.length; i++) {
					const db = databases.results[i];
					console.log(`[beforeAll] Database ${i}:`, {
						id: db?.id,
						object: db?.object,
						title: db?.title,
					});
				}
			}
			if (databases?.results && databases.results.length > 0) {
				testDatabaseId = databases.results[0]?.id;
				console.log('[beforeAll] Found database ID:', testDatabaseId);
			}
		}
		
		console.log('[beforeAll] Final values:', {
			testDatabaseId,
			testPageId,
			testBlockId,
			testUserId,
		});

		// If we have a database but no page, try to get a page from the database
		if (testDatabaseId && !testPageId) {
			const pagesResponse = await makeNotionRequest<NotionEndpointOutputs['databasePagesGetManyDatabasePages']>(
				`v1/databases/${testDatabaseId}/query`,
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						page_size: 1,
					},
				},
			);
			const pages = pagesResponse as { results?: Array<{ id?: string }> };
			if (pages?.results && pages.results.length > 0) {
				testPageId = pages.results[0]?.id;
			}
		}

		// If we have a page, try to get a block
		if (testPageId) {
			const blocksResponse = await makeNotionRequest<NotionEndpointOutputs['blocksGetManyChildBlocks']>(
				`v1/blocks/${testPageId}/children`,
				TEST_API_KEY,
				{
					method: 'GET',
					query: {
						page_size: 1,
					},
				},
			);
			const blocks = blocksResponse as { results?: Array<{ id?: string }> };
			if (blocks?.results && blocks.results.length > 0) {
				testBlockId = blocks.results[0]?.id;
			}
		}

		const usersResponse = await makeNotionRequest<NotionEndpointOutputs['usersGetManyUsers']>(
			'v1/users',
			TEST_API_KEY,
			{
				method: 'GET',
				query: {
					page_size: 1,
				},
			},
		);
		const users = usersResponse as { results?: Array<{ id?: string }> };
		if (users?.results && users.results.length > 0) {
			testUserId = users.results[0]?.id;
		}
	});
	describe('blocks', () => {
		it('blocksGetManyChildBlocks returns response', async () => {
			let blockId = testBlockId || testPageId;
			if (!blockId) {
				const databaseId = testDatabaseId || await fetchDatabaseId();
				const pagesResponse = await makeNotionRequest<NotionEndpointOutputs['databasePagesGetManyDatabasePages']>(
					`v1/databases/${databaseId}/query`,
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							page_size: 1,
						},
					},
				);
				const pages = pagesResponse as { results?: Array<{ id?: string }> };
				if (!pages?.results || pages.results.length === 0) {
					throw new Error('No pages found in database - cannot test blocksGetManyChildBlocks');
				}
				blockId = pages.results[0]?.id;
				if (!blockId) {
					throw new Error('Page ID is missing - cannot test blocksGetManyChildBlocks');
				}
			}
			const response = await makeNotionRequest<NotionEndpointOutputs['blocksGetManyChildBlocks']>(
				`v1/blocks/${blockId}/children`,
				TEST_API_KEY,
				{
					method: 'GET',
					query: {
						page_size: 10,
					},
				},
			);
			expect(response).toBeDefined();
		});

		it('blocksAppendBlock returns response', async () => {
			// Always use a page ID for appending blocks, as pages support children
			let pageId = testPageId;
			if (!pageId) {
				const databaseId = testDatabaseId || await fetchDatabaseId();
				const pagesResponse = await makeNotionRequest<NotionEndpointOutputs['databasePagesGetManyDatabasePages']>(
					`v1/databases/${databaseId}/query`,
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							page_size: 1,
						},
					},
				);
				const pages = pagesResponse as { results?: Array<{ id?: string }> };
				if (!pages?.results || pages.results.length === 0) {
					throw new Error('No pages found in database - cannot test blocksAppendBlock');
				}
				pageId = pages.results[0]?.id;
				if (!pageId) {
					throw new Error('Page ID is missing - cannot test blocksAppendBlock');
				}
			}
			const response = await makeNotionRequest<NotionEndpointOutputs['blocksAppendBlock']>(
				`v1/blocks/${pageId}/children`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					body: {
						children: [
							{
								object: 'block',
								type: 'paragraph',
								paragraph: {
									rich_text: [
										{
											type: 'text',
											text: {
												content: `Test block from API test ${Date.now()}`,
											},
										},
									],
								},
							},
						],
					},
				},
			);
			expect(response).toBeDefined();
		});
	});

	describe('databases', () => {
		it('databasesGetManyDatabases returns response', async () => {
			const response = await makeNotionRequest<NotionEndpointOutputs['databasesGetManyDatabases']>(
				'v1/search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						filter: {
							value: 'database',
							property: 'object',
						},
						page_size: 10,
					},
				},
			);
			expect(response).toBeDefined();
		});

		it('databasesGetDatabase returns response', async () => {
			const databaseId = testDatabaseId || await fetchDatabaseId();
			const response = await makeNotionRequest<NotionEndpointOutputs['databasesGetDatabase']>(
				`v1/databases/${databaseId}`,
				TEST_API_KEY,
				{
					method: 'GET',
				},
			);
			expect(response).toBeDefined();
		});

		it('databasesSearchDatabase returns response', async () => {
			const response = await makeNotionRequest<NotionEndpointOutputs['databasesSearchDatabase']>(
				'v1/search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						filter: {
							value: 'database',
							property: 'object',
						},
						page_size: 10,
					},
				},
			);
			expect(response).toBeDefined();
		});
	});

	describe('databasePages', () => {

		it('databasePagesGetManyDatabasePages returns response', async () => {
			const databaseId = testDatabaseId || await fetchDatabaseId();
			const response = await makeNotionRequest<NotionEndpointOutputs['databasePagesGetManyDatabasePages']>(
				`v1/databases/${databaseId}/query`,
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						page_size: 10,
					},
				},
			);
			expect(response).toBeDefined();
		});

		it('databasePagesCreateDatabasePage returns response', async () => {
			const databaseId = testDatabaseId || await fetchDatabaseId();
			const response = await makeNotionRequest<NotionEndpointOutputs['databasePagesCreateDatabasePage']>(
				'v1/pages',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						parent: {
							database_id: databaseId,
						},
						properties: {
							title: {
								title: [
									{
										text: {
											content: `Test Page ${Date.now()}`,
										},
									},
								],
							},
						},
					},
				},
			);
			expect(response).toBeDefined();
			const page = response as { id?: string };
			if (page.id) {
				testPageId = page.id;
			}
		});

		it('databasePagesGetDatabasePage returns response', async () => {
			let pageId = testPageId;
			if (!pageId) {
				const databaseId = testDatabaseId || await fetchDatabaseId();
				const pagesResponse = await makeNotionRequest<NotionEndpointOutputs['databasePagesGetManyDatabasePages']>(
					`v1/databases/${databaseId}/query`,
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							page_size: 1,
						},
					},
				);
				const pages = pagesResponse as { results?: Array<{ id?: string }> };
				if (!pages?.results || pages.results.length === 0) {
					throw new Error('No pages found in database - cannot test databasePagesGetDatabasePage');
				}
				pageId = pages.results[0]?.id;
				if (!pageId) {
					throw new Error('Page ID is missing - cannot test databasePagesGetDatabasePage');
				}
			}
			const response = await makeNotionRequest<NotionEndpointOutputs['databasePagesGetDatabasePage']>(
				`v1/pages/${pageId}`,
				TEST_API_KEY,
				{
					method: 'GET',
				},
			);
			expect(response).toBeDefined();
		});

		it('databasePagesUpdateDatabasePage returns response', async () => {
			let pageId = testPageId;
			if (!pageId) {
				const databaseId = testDatabaseId || await fetchDatabaseId();
				const pagesResponse = await makeNotionRequest<NotionEndpointOutputs['databasePagesGetManyDatabasePages']>(
					`v1/databases/${databaseId}/query`,
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							page_size: 1,
						},
					},
				);
				const pages = pagesResponse as { results?: Array<{ id?: string }> };
				if (!pages?.results || pages.results.length === 0) {
					throw new Error('No pages found in database - cannot test databasePagesUpdateDatabasePage');
				}
				pageId = pages.results[0]?.id;
				if (!pageId) {
					throw new Error('Page ID is missing - cannot test databasePagesUpdateDatabasePage');
				}
			}
			const response = await makeNotionRequest<NotionEndpointOutputs['databasePagesUpdateDatabasePage']>(
				`v1/pages/${pageId}`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					body: {
						properties: {
							title: {
								title: [
									{
										text: {
											content: `Updated Test Page ${Date.now()}`,
										},
									},
								],
							},
						},
					},
				},
			);
			expect(response).toBeDefined();
		});
	});

	describe('pages', () => {

		it('pagesSearchPage returns response', async () => {
			const response = await makeNotionRequest<NotionEndpointOutputs['pagesSearchPage']>(
				'v1/search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						filter: {
							value: 'page',
							property: 'object',
						},
						page_size: 10,
					},
				},
			);
			expect(response).toBeDefined();
		});

		it('pagesCreatePage returns response', async () => {
			const databaseId = testDatabaseId || await fetchDatabaseId();
			const response = await makeNotionRequest<NotionEndpointOutputs['pagesCreatePage']>(
				'v1/pages',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						parent: {
							database_id: databaseId,
						},
						properties: {
							title: {
								title: [
									{
										text: {
											content: `Test Page ${Date.now()}`,
										},
									},
								],
							},
						},
					},
				},
			);
			expect(response).toBeDefined();
		});

		it('pagesArchivePage returns response', async () => {
			let pageId = testPageId;
			if (!pageId) {
				const databaseId = testDatabaseId || await fetchDatabaseId();
				const pagesResponse = await makeNotionRequest<NotionEndpointOutputs['databasePagesGetManyDatabasePages']>(
					`v1/databases/${databaseId}/query`,
					TEST_API_KEY,
					{
						method: 'POST',
						body: {
							page_size: 1,
						},
					},
				);
				const pages = pagesResponse as { results?: Array<{ id?: string }> };
				if (!pages?.results || pages.results.length === 0) {
					throw new Error('No pages found in database - cannot test pagesArchivePage');
				}
				pageId = pages.results[0]?.id;
				if (!pageId) {
					throw new Error('Page ID is missing - cannot test pagesArchivePage');
				}
			}
			const response = await makeNotionRequest<NotionEndpointOutputs['pagesArchivePage']>(
				`v1/pages/${pageId}`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					body: {
						archived: true,
					},
				},
			);
			expect(response).toBeDefined();
		});
	});

	describe('users', () => {
		it('usersGetManyUsers returns response', async () => {
			const response = await makeNotionRequest<NotionEndpointOutputs['usersGetManyUsers']>(
				'v1/users',
				TEST_API_KEY,
				{
					method: 'GET',
					query: {
						page_size: 10,
					},
				},
			);
			expect(response).toBeDefined();
		});

		it('usersGetUser returns response', async () => {
			if (!testUserId) {
				throw new Error('Missing testUserId - cannot test usersGetUser');
			}
			const response = await makeNotionRequest<NotionEndpointOutputs['usersGetUser']>(
				`v1/users/${testUserId}`,
				TEST_API_KEY,
				{
					method: 'GET',
				},
			);
			expect(response).toBeDefined();
		});
	});
});
