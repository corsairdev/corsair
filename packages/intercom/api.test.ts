import 'dotenv/config';
import { makeIntercomRequest } from './client';
import type {
	AdminsGetResponse,
	AdminsIdentifyResponse,
	AdminsListActivityLogsResponse,
	AdminsListResponse,
	ArticlesCreateResponse,
	ArticlesDeleteResponse,
	ArticlesGetResponse,
	ArticlesListResponse,
	ArticlesSearchResponse,
	ArticlesUpdateResponse,
	CollectionsCreateResponse,
	CollectionsDeleteResponse,
	CollectionsGetResponse,
	CollectionsListResponse,
	CollectionsUpdateResponse,
	CompaniesCreateOrUpdateResponse,
	CompaniesDeleteResponse,
	CompaniesGetResponse,
	CompaniesListResponse,
	ContactsAddTagResponse,
	ContactsCreateNoteResponse,
	ContactsGetResponse,
	ContactsListAttachedCompaniesResponse,
	ContactsListAttachedSegmentsResponse,
	ContactsListNotesResponse,
	ContactsListResponse,
	ContactsListSubscriptionsResponse,
	ContactsListTagsResponse,
	ContactsUpdateResponse,
	ConversationsGetResponse,
	ConversationsListResponse,
	ConversationsSearchResponse,
	HelpCentersGetResponse,
	HelpCentersListResponse,
} from './endpoints/types';
import { IntercomEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.INTERCOM_ACCESS_TOKEN!;

// Shared IDs fetched dynamically in the top-level beforeAll
let sharedContactId: string;
let sharedCompanyId: string;
let sharedAdminId: string;
let sharedArticleAuthorId: number;

describe('Intercom API Type Tests', () => {
	beforeAll(async () => {
		// Fetch admin ID (also used as article author ID — admin numeric ID)
		const adminsResult = await makeIntercomRequest<AdminsListResponse>(
			'admins',
			TEST_TOKEN,
		);
		const firstAdmin = adminsResult.admins?.[0];
		if (!firstAdmin) throw new Error('No admins found — cannot run tests');
		sharedAdminId = firstAdmin.id;
		sharedArticleAuthorId = parseInt(firstAdmin.id, 10);

		// Fetch a contact ID
		const contactsResult = await makeIntercomRequest<ContactsListResponse>(
			'contacts',
			TEST_TOKEN,
			{
				query: { per_page: 1 },
			},
		);
		const contactId = contactsResult.data?.[0]?.id;
		if (!contactId) throw new Error('No contacts found — cannot run tests');
		sharedContactId = contactId;

		// Fetch or create a company ID
		const companiesResult = await makeIntercomRequest<CompaniesListResponse>(
			'companies',
			TEST_TOKEN,
			{
				query: { per_page: 1 },
			},
		);
		const companyId = companiesResult.data?.[0]?.id;
		if (companyId) {
			sharedCompanyId = companyId;
		} else {
			const created =
				await makeIntercomRequest<CompaniesCreateOrUpdateResponse>(
					'companies',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							name: `Test Company ${Date.now()}`,
							company_id: `test-${Date.now()}`,
						},
					},
				);
			sharedCompanyId = created.id;
		}
	});

	describe('admins', () => {
		it('adminsIdentify returns correct type', async () => {
			const result = await makeIntercomRequest<AdminsIdentifyResponse>(
				'me',
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.adminsIdentify.parse(result);
		});

		it('adminsList returns correct type', async () => {
			const result = await makeIntercomRequest<AdminsListResponse>(
				'admins',
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.adminsList.parse(result);
		});

		it('adminsGet returns correct type', async () => {
			const result = await makeIntercomRequest<AdminsGetResponse>(
				`admins/${sharedAdminId}`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.adminsGet.parse(result);
		});

		it('adminsListActivityLogs returns correct type', async () => {
			const createdAtAfter = String(Math.floor(Date.now() / 1000) - 86400 * 30);
			const result = await makeIntercomRequest<AdminsListActivityLogsResponse>(
				'admins/activity_log',
				TEST_TOKEN,
				{ query: { created_at_after: createdAtAfter } },
			);
			IntercomEndpointOutputSchemas.adminsListActivityLogs.parse(result);
		});
	});

	describe('contacts', () => {
		let testContactId: string;

		beforeAll(() => {
			testContactId = sharedContactId;
		});

		it('contactsList returns correct type', async () => {
			const result = await makeIntercomRequest<ContactsListResponse>(
				'contacts',
				TEST_TOKEN,
				{
					query: { per_page: 10 },
				},
			);
			IntercomEndpointOutputSchemas.contactsList.parse(result);
		});

		it('contactsGet returns correct type', async () => {
			const result = await makeIntercomRequest<ContactsGetResponse>(
				`contacts/${testContactId}`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.contactsGet.parse(result);
		});

		it('contactsUpdate returns correct type', async () => {
			const result = await makeIntercomRequest<ContactsUpdateResponse>(
				`contacts/${testContactId}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { name: `Test Contact ${Date.now()}` },
				},
			);
			IntercomEndpointOutputSchemas.contactsUpdate.parse(result);
		});

		it('contactsListTags returns correct type', async () => {
			const result = await makeIntercomRequest<ContactsListTagsResponse>(
				`contacts/${testContactId}/tags`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.contactsListTags.parse(result);
		});

		it('contactsListSubscriptions returns correct type', async () => {
			const result =
				await makeIntercomRequest<ContactsListSubscriptionsResponse>(
					`contacts/${testContactId}/subscriptions`,
					TEST_TOKEN,
				);
			IntercomEndpointOutputSchemas.contactsListSubscriptions.parse(result);
		});

		it('contactsListAttachedCompanies returns correct type', async () => {
			const result =
				await makeIntercomRequest<ContactsListAttachedCompaniesResponse>(
					`contacts/${testContactId}/companies`,
					TEST_TOKEN,
				);
			IntercomEndpointOutputSchemas.contactsListAttachedCompanies.parse(result);
		});

		it('contactsListAttachedSegments returns correct type', async () => {
			const result =
				await makeIntercomRequest<ContactsListAttachedSegmentsResponse>(
					`contacts/${testContactId}/segments`,
					TEST_TOKEN,
				);
			IntercomEndpointOutputSchemas.contactsListAttachedSegments.parse(result);
		});

		it('contactsCreateNote returns correct type', async () => {
			const result = await makeIntercomRequest<ContactsCreateNoteResponse>(
				`contacts/${testContactId}/notes`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						body: 'Test note from API test',
						admin_id: sharedAdminId,
					},
				},
			);
			IntercomEndpointOutputSchemas.contactsCreateNote.parse(result);
		});

		it('contactsListNotes returns correct type', async () => {
			const result = await makeIntercomRequest<ContactsListNotesResponse>(
				`contacts/${testContactId}/notes`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.contactsListNotes.parse(result);
		});

		it('contactsAddTag and removeTag return correct types', async () => {
			const tagsResult = await makeIntercomRequest<ContactsListTagsResponse>(
				`contacts/${testContactId}/tags`,
				TEST_TOKEN,
			);
			const tagId = tagsResult.data?.[0]?.id;
			if (!tagId) {
				console.warn('No tags available for add/remove test, skipping');
				return;
			}

			const addResult = await makeIntercomRequest<ContactsAddTagResponse>(
				`contacts/${testContactId}/tags`,
				TEST_TOKEN,
				{ method: 'POST', body: { id: tagId } },
			);
			IntercomEndpointOutputSchemas.contactsAddTag.parse(addResult);
		});
	});

	describe('companies', () => {
		let testCompanyId: string;

		beforeAll(() => {
			testCompanyId = sharedCompanyId;
		});

		it('companiesList returns correct type', async () => {
			const result = await makeIntercomRequest<CompaniesListResponse>(
				'companies',
				TEST_TOKEN,
				{
					query: { per_page: 10 },
				},
			);
			IntercomEndpointOutputSchemas.companiesList.parse(result);
		});

		it('companiesGet returns correct type', async () => {
			const result = await makeIntercomRequest<CompaniesGetResponse>(
				`companies/${testCompanyId}`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.companiesGet.parse(result);
		});

		it('companiesCreateOrUpdate returns correct type', async () => {
			const result = await makeIntercomRequest<CompaniesCreateOrUpdateResponse>(
				'companies',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						company_id: `test-api-${Date.now()}`,
						name: `API Test Company ${Date.now()}`,
					},
				},
			);
			IntercomEndpointOutputSchemas.companiesCreateOrUpdate.parse(result);
		});

		it('companiesDelete returns correct type', async () => {
			const created =
				await makeIntercomRequest<CompaniesCreateOrUpdateResponse>(
					'companies',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							company_id: `delete-test-${Date.now()}`,
							name: `Delete Test Company ${Date.now()}`,
						},
					},
				);

			const result = await makeIntercomRequest<CompaniesDeleteResponse>(
				`companies/${created.id}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			IntercomEndpointOutputSchemas.companiesDelete.parse(result);
		});
	});

	describe('conversations', () => {
		let testConversationId: string;

		beforeAll(async () => {
			const listResult = await makeIntercomRequest<ConversationsListResponse>(
				'conversations',
				TEST_TOKEN,
				{
					query: { per_page: 1 },
				},
			);
			const conversationId = listResult.conversations?.[0]?.id;
			if (!conversationId) throw new Error('No conversations found');
			testConversationId = conversationId;
		});

		it('conversationsList returns correct type', async () => {
			const result = await makeIntercomRequest<ConversationsListResponse>(
				'conversations',
				TEST_TOKEN,
				{
					query: { per_page: 10 },
				},
			);
			IntercomEndpointOutputSchemas.conversationsList.parse(result);
		});

		it('conversationsGet returns correct type', async () => {
			const result = await makeIntercomRequest<ConversationsGetResponse>(
				`conversations/${testConversationId}`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.conversationsGet.parse(result);
		});

		it('conversationsSearch returns correct type', async () => {
			const result = await makeIntercomRequest<ConversationsSearchResponse>(
				'conversations/search',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						query: {
							field: 'state',
							operator: '=',
							value: 'open',
						},
					},
				},
			);
			IntercomEndpointOutputSchemas.conversationsSearch.parse(result);
		});
	});

	describe('articles', () => {
		let testArticleId: string;

		beforeAll(async () => {
			const listResult = await makeIntercomRequest<ArticlesListResponse>(
				'articles',
				TEST_TOKEN,
				{
					query: { per_page: 1 },
				},
			);
			const articleId = listResult.data?.[0]?.id;
			if (articleId) {
				testArticleId = articleId;
			}
		});

		it('articlesList returns correct type', async () => {
			const result = await makeIntercomRequest<ArticlesListResponse>(
				'articles',
				TEST_TOKEN,
				{
					query: { per_page: 10 },
				},
			);
			IntercomEndpointOutputSchemas.articlesList.parse(result);
		});

		it('articlesCreate returns correct type', async () => {
			const result = await makeIntercomRequest<ArticlesCreateResponse>(
				'articles',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						title: `Test Article ${Date.now()}`,
						author_id: sharedArticleAuthorId,
						state: 'draft',
						body: '<p>Test article body from API test</p>',
					},
				},
			);
			testArticleId = result.id;
			IntercomEndpointOutputSchemas.articlesCreate.parse(result);
		});

		it('articlesGet returns correct type', async () => {
			if (!testArticleId) {
				console.warn('No article ID available, skipping articlesGet test');
				return;
			}
			const result = await makeIntercomRequest<ArticlesGetResponse>(
				`articles/${testArticleId}`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.articlesGet.parse(result);
		});

		it('articlesUpdate returns correct type', async () => {
			if (!testArticleId) {
				console.warn('No article ID available, skipping articlesUpdate test');
				return;
			}
			const result = await makeIntercomRequest<ArticlesUpdateResponse>(
				`articles/${testArticleId}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { title: `Updated Article ${Date.now()}` },
				},
			);
			IntercomEndpointOutputSchemas.articlesUpdate.parse(result);
		});

		it('articlesSearch returns correct type', async () => {
			const result = await makeIntercomRequest<ArticlesSearchResponse>(
				'articles/search',
				TEST_TOKEN,
				{ query: { phrase: 'test' } },
			);
			IntercomEndpointOutputSchemas.articlesSearch.parse(result);
		});

		it('articlesDelete returns correct type', async () => {
			const created = await makeIntercomRequest<ArticlesCreateResponse>(
				'articles',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						title: `Delete Test Article ${Date.now()}`,
						author_id: sharedArticleAuthorId,
						state: 'draft',
					},
				},
			);
			const result = await makeIntercomRequest<ArticlesDeleteResponse>(
				`articles/${created.id}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			IntercomEndpointOutputSchemas.articlesDelete.parse(result);
		});
	});

	describe('collections', () => {
		let testCollectionId: string;

		it('collectionsList returns correct type', async () => {
			const result = await makeIntercomRequest<CollectionsListResponse>(
				'help_center/collections',
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.collectionsList.parse(result);
			if (result.data?.[0]?.id) {
				testCollectionId = result.data[0].id;
			}
		});

		it('collectionsCreate returns correct type', async () => {
			const result = await makeIntercomRequest<CollectionsCreateResponse>(
				'help_center/collections',
				TEST_TOKEN,
				{
					method: 'POST',
					body: { name: `Test Collection ${Date.now()}` },
				},
			);
			testCollectionId = result.id;
			IntercomEndpointOutputSchemas.collectionsCreate.parse(result);
		});

		it('collectionsGet returns correct type', async () => {
			if (!testCollectionId) {
				console.warn(
					'No collection ID available, skipping collectionsGet test',
				);
				return;
			}
			const result = await makeIntercomRequest<CollectionsGetResponse>(
				`help_center/collections/${testCollectionId}`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.collectionsGet.parse(result);
		});

		it('collectionsUpdate returns correct type', async () => {
			if (!testCollectionId) {
				console.warn(
					'No collection ID available, skipping collectionsUpdate test',
				);
				return;
			}
			const result = await makeIntercomRequest<CollectionsUpdateResponse>(
				`help_center/collections/${testCollectionId}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: { name: `Updated Collection ${Date.now()}` },
				},
			);
			IntercomEndpointOutputSchemas.collectionsUpdate.parse(result);
		});

		it('collectionsDelete returns correct type', async () => {
			const created = await makeIntercomRequest<CollectionsCreateResponse>(
				'help_center/collections',
				TEST_TOKEN,
				{
					method: 'POST',
					body: { name: `Delete Collection ${Date.now()}` },
				},
			);
			const result = await makeIntercomRequest<CollectionsDeleteResponse>(
				`help_center/collections/${created.id}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
			IntercomEndpointOutputSchemas.collectionsDelete.parse(result);
		});
	});

	describe('helpCenters', () => {
		it('helpCentersList returns correct type', async () => {
			const result = await makeIntercomRequest<HelpCentersListResponse>(
				'help_center/help_centers',
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.helpCentersList.parse(result);
		});

		it('helpCentersGet returns correct type', async () => {
			const listResult = await makeIntercomRequest<HelpCentersListResponse>(
				'help_center/help_centers',
				TEST_TOKEN,
			);
			const helpCenterId = listResult.data?.[0]?.id;
			if (!helpCenterId) {
				console.warn('No help centers found, skipping helpCentersGet test');
				return;
			}
			const result = await makeIntercomRequest<HelpCentersGetResponse>(
				`help_center/help_centers/${helpCenterId}`,
				TEST_TOKEN,
			);
			IntercomEndpointOutputSchemas.helpCentersGet.parse(result);
		});
	});
});
