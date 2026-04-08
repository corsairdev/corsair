import 'dotenv/config';
import { makeNotionRequest } from './client';
import type { NotionEndpointOutputs } from './endpoints/types';

const TEST_API_KEY = process.env.NOTION_API_KEY!;

// Helper function to fetch a database ID
async function fetchDatabaseId(): Promise<string> {
	// Try searching for pages first, they might be in databases
	const pagesResponse = await makeNotionRequest<
		NotionEndpointOutputs['pagesSearchPage']
	>('v1/search', TEST_API_KEY, {
		method: 'POST',
		body: {
			filter: {
				value: 'page',
				property: 'object',
			},
			page_size: 10,
		},
	});
	const pages = pagesResponse;
	if (pages?.results) {
		for (let i = 0; i < pages.results.length; i++) {
			const page = pages.results[i];
			if (page?.parent?.type === 'database_id' && page.parent.database_id) {
				return page.parent.database_id;
			}
		}
	}

	// If still no database, try direct search
	const databasesResponse = await makeNotionRequest<
		NotionEndpointOutputs['databasesGetManyDatabases']
	>('v1/search', TEST_API_KEY, {
		method: 'POST',
		body: {
			filter: {
				value: 'database',
				property: 'object',
			},
			page_size: 10,
		},
	});
	const databases = databasesResponse;
	if (
		databases?.results &&
		databases.results.length > 0 &&
		databases.results[0]?.id
	) {
		return databases.results[0].id;
	}
	throw new Error('No databases found');
}

describe('Notion API Type Tests', () => {
	let testDatabaseId: string | undefined;
	let testPageId: string | undefined;
	let testBlockId: string | undefined;
	let testUserId: string | undefined;

	beforeAll(async () => {
		// Try to get a page first (more common than databases)
		const pagesSearchResponse = await makeNotionRequest<
			NotionEndpointOutputs['pagesSearchPage']
		>('v1/search', TEST_API_KEY, {
			method: 'POST',
			body: {
				filter: {
					value: 'page',
					property: 'object',
				},
				page_size: 10,
			},
		});
		const pagesSearch = pagesSearchResponse;
		if (pagesSearch?.results && pagesSearch.results.length > 0) {
			testPageId = pagesSearch.results[0]?.id;
			// If the page is in a database, get the database ID
			if (
				pagesSearch.results[0]?.parent?.type === 'database_id' &&
				pagesSearch.results[0]?.parent?.database_id
			) {
				testDatabaseId = pagesSearch.results[0].parent.database_id;
			}
		}

		// If we don't have a database yet, try to search for one
		if (!testDatabaseId) {
			const databasesResponse = await makeNotionRequest<
				NotionEndpointOutputs['databasesGetManyDatabases']
			>('v1/search', TEST_API_KEY, {
				method: 'POST',
				body: {
					filter: {
						value: 'database',
						property: 'object',
					},
					page_size: 10,
				},
			});
			const databases = databasesResponse;
			if (databases?.results) {
				for (let i = 0; i < databases.results.length; i++) {
					const db = databases.results[i];
				}
			}
			if (databases?.results && databases.results.length > 0) {
				testDatabaseId = databases.results[0]?.id;
			}
		}

		// If we have a database but no page, try to get a page from the database
		if (testDatabaseId && !testPageId) {
			const pagesResponse = await makeNotionRequest<
				NotionEndpointOutputs['databasePagesGetManyDatabasePages']
			>(`v1/databases/${testDatabaseId}/query`, TEST_API_KEY, {
				method: 'POST',
				body: {
					page_size: 1,
				},
			});
			const pages = pagesResponse;
			if (pages?.results && pages.results.length > 0) {
				testPageId = pages.results[0]?.id;
			}
		}

		// If we have a page, try to get a block
		if (testPageId) {
			const blocksResponse = await makeNotionRequest<
				NotionEndpointOutputs['blocksGetManyChildBlocks']
			>(`v1/blocks/${testPageId}/children`, TEST_API_KEY, {
				method: 'GET',
				query: {
					page_size: 1,
				},
			});
			const blocks = blocksResponse;
			if (blocks?.results && blocks.results.length > 0) {
				testBlockId = blocks.results[0]?.id;
			}
		}

		const usersResponse = await makeNotionRequest<
			NotionEndpointOutputs['usersGetManyUsers']
		>('v1/users', TEST_API_KEY, {
			method: 'GET',
			query: {
				page_size: 1,
			},
		});
		const users = usersResponse;
		if (users?.results && users.results.length > 0) {
			testUserId = users.results[0]?.id;
		}
	});
	describe('blocks', () => {
		it('blocksGetManyChildBlocks returns response', async () => {
			let blockId = testBlockId || testPageId;
			if (!blockId) {
				const databaseId = testDatabaseId || (await fetchDatabaseId());
				const pagesResponse = await makeNotionRequest<
					NotionEndpointOutputs['databasePagesGetManyDatabasePages']
				>(`v1/databases/${databaseId}/query`, TEST_API_KEY, {
					method: 'POST',
					body: {
						page_size: 1,
					},
				});
				const pages = pagesResponse;
				if (!pages?.results || pages.results.length === 0) {
					throw new Error(
						'No pages found in database - cannot test blocksGetManyChildBlocks',
					);
				}
				blockId = pages.results[0]?.id;
				if (!blockId) {
					throw new Error(
						'Page ID is missing - cannot test blocksGetManyChildBlocks',
					);
				}
			}
			const response = await makeNotionRequest<
				NotionEndpointOutputs['blocksGetManyChildBlocks']
			>(`v1/blocks/${blockId}/children`, TEST_API_KEY, {
				method: 'GET',
				query: {
					page_size: 10,
				},
			});
			expect(response).toBeDefined();
		});

		it('blocksAppendBlock returns response', async () => {
			// Always use a page ID for appending blocks, as pages support children
			let pageId = testPageId;
			if (!pageId) {
				const databaseId = testDatabaseId || (await fetchDatabaseId());
				const pagesResponse = await makeNotionRequest<
					NotionEndpointOutputs['databasePagesGetManyDatabasePages']
				>(`v1/databases/${databaseId}/query`, TEST_API_KEY, {
					method: 'POST',
					body: {
						page_size: 1,
					},
				});
				const pages = pagesResponse;
				if (!pages?.results || pages.results.length === 0) {
					throw new Error(
						'No pages found in database - cannot test blocksAppendBlock',
					);
				}
				pageId = pages.results[0]?.id;
				if (!pageId) {
					throw new Error('Page ID is missing - cannot test blocksAppendBlock');
				}
			}
			const response = await makeNotionRequest<
				NotionEndpointOutputs['blocksAppendBlock']
			>(`v1/blocks/${pageId}/children`, TEST_API_KEY, {
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
			});
			expect(response).toBeDefined();
		});
	});

	describe('databases', () => {
		it('databasesGetManyDatabases returns response', async () => {
			const response = await makeNotionRequest<
				NotionEndpointOutputs['databasesGetManyDatabases']
			>('v1/search', TEST_API_KEY, {
				method: 'POST',
				body: {
					filter: {
						value: 'database',
						property: 'object',
					},
					page_size: 10,
				},
			});
			expect(response).toBeDefined();
		});

		it('databasesGetDatabase returns response', async () => {
			const databaseId = testDatabaseId || (await fetchDatabaseId());
			const response = await makeNotionRequest<
				NotionEndpointOutputs['databasesGetDatabase']
			>(`v1/databases/${databaseId}`, TEST_API_KEY, {
				method: 'GET',
			});
			expect(response).toBeDefined();
		});

		it('databasesSearchDatabase returns response', async () => {
			const response = await makeNotionRequest<
				NotionEndpointOutputs['databasesSearchDatabase']
			>('v1/search', TEST_API_KEY, {
				method: 'POST',
				body: {
					filter: {
						value: 'database',
						property: 'object',
					},
					page_size: 10,
				},
			});
			expect(response).toBeDefined();
		});
	});

	describe('databasePages', () => {
		it('databasePagesGetManyDatabasePages returns response', async () => {
			const databaseId = testDatabaseId || (await fetchDatabaseId());
			const response = await makeNotionRequest<
				NotionEndpointOutputs['databasePagesGetManyDatabasePages']
			>(`v1/databases/${databaseId}/query`, TEST_API_KEY, {
				method: 'POST',
				body: {
					page_size: 10,
				},
			});
			expect(response).toBeDefined();
		});

		it('databasePagesCreateDatabasePage returns response', async () => {
			const databaseId = testDatabaseId || (await fetchDatabaseId());
			const response = await makeNotionRequest<
				NotionEndpointOutputs['databasePagesCreateDatabasePage']
			>('v1/pages', TEST_API_KEY, {
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
			});
			expect(response).toBeDefined();
			const page = response;
			if (page.id) {
				testPageId = page.id;
			}
		});

		it('databasePagesGetDatabasePage returns response', async () => {
			let pageId = testPageId;
			if (!pageId) {
				const databaseId = testDatabaseId || (await fetchDatabaseId());
				const pagesResponse = await makeNotionRequest<
					NotionEndpointOutputs['databasePagesGetManyDatabasePages']
				>(`v1/databases/${databaseId}/query`, TEST_API_KEY, {
					method: 'POST',
					body: {
						page_size: 1,
					},
				});
				const pages = pagesResponse;
				if (!pages?.results || pages.results.length === 0) {
					throw new Error(
						'No pages found in database - cannot test databasePagesGetDatabasePage',
					);
				}
				pageId = pages.results[0]?.id;
				if (!pageId) {
					throw new Error(
						'Page ID is missing - cannot test databasePagesGetDatabasePage',
					);
				}
			}
			const response = await makeNotionRequest<
				NotionEndpointOutputs['databasePagesGetDatabasePage']
			>(`v1/pages/${pageId}`, TEST_API_KEY, {
				method: 'GET',
			});
			expect(response).toBeDefined();
		});

		it('databasePagesUpdateDatabasePage returns response', async () => {
			let pageId = testPageId;
			if (!pageId) {
				const databaseId = testDatabaseId || (await fetchDatabaseId());
				const pagesResponse = await makeNotionRequest<
					NotionEndpointOutputs['databasePagesGetManyDatabasePages']
				>(`v1/databases/${databaseId}/query`, TEST_API_KEY, {
					method: 'POST',
					body: {
						page_size: 1,
					},
				});
				const pages = pagesResponse;
				if (!pages?.results || pages.results.length === 0) {
					throw new Error(
						'No pages found in database - cannot test databasePagesUpdateDatabasePage',
					);
				}
				pageId = pages.results[0]?.id;
				if (!pageId) {
					throw new Error(
						'Page ID is missing - cannot test databasePagesUpdateDatabasePage',
					);
				}
			}
			const response = await makeNotionRequest<
				NotionEndpointOutputs['databasePagesUpdateDatabasePage']
			>(`v1/pages/${pageId}`, TEST_API_KEY, {
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
			});
			expect(response).toBeDefined();
		});
	});

	describe('pages', () => {
		it('pagesSearchPage returns response', async () => {
			const response = await makeNotionRequest<
				NotionEndpointOutputs['pagesSearchPage']
			>('v1/search', TEST_API_KEY, {
				method: 'POST',
				body: {
					filter: {
						value: 'page',
						property: 'object',
					},
					page_size: 10,
				},
			});
			expect(response).toBeDefined();
		});

		it('pagesCreatePage returns response', async () => {
			const databaseId = testDatabaseId || (await fetchDatabaseId());
			const response = await makeNotionRequest<
				NotionEndpointOutputs['pagesCreatePage']
			>('v1/pages', TEST_API_KEY, {
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
			});
			expect(response).toBeDefined();
		});

		it('pagesArchivePage returns response', async () => {
			let pageId = testPageId;
			if (!pageId) {
				const databaseId = testDatabaseId || (await fetchDatabaseId());
				const pagesResponse = await makeNotionRequest<
					NotionEndpointOutputs['databasePagesGetManyDatabasePages']
				>(`v1/databases/${databaseId}/query`, TEST_API_KEY, {
					method: 'POST',
					body: {
						page_size: 1,
					},
				});
				const pages = pagesResponse;
				if (!pages?.results || pages.results.length === 0) {
					throw new Error(
						'No pages found in database - cannot test pagesArchivePage',
					);
				}
				pageId = pages.results[0]?.id;
				if (!pageId) {
					throw new Error('Page ID is missing - cannot test pagesArchivePage');
				}
			}
			const response = await makeNotionRequest<
				NotionEndpointOutputs['pagesArchivePage']
			>(`v1/pages/${pageId}`, TEST_API_KEY, {
				method: 'PATCH',
				body: {
					archived: true,
				},
			});
			expect(response).toBeDefined();
		});
	});

	describe('users', () => {
		it('usersGetManyUsers returns response', async () => {
			const response = await makeNotionRequest<
				NotionEndpointOutputs['usersGetManyUsers']
			>('v1/users', TEST_API_KEY, {
				method: 'GET',
				query: {
					page_size: 10,
				},
			});
			expect(response).toBeDefined();
		});

		it('usersGetUser returns response', async () => {
			if (!testUserId) {
				throw new Error('Missing testUserId - cannot test usersGetUser');
			}
			const response = await makeNotionRequest<
				NotionEndpointOutputs['usersGetUser']
			>(`v1/users/${testUserId}`, TEST_API_KEY, {
				method: 'GET',
			});
			expect(response).toBeDefined();
		});
	});
});
