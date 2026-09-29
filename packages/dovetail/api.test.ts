import { makeDovetailRequest } from './client';
import type { DovetailEndpointOutputs } from './endpoints/types';
import {
	ContactsListResponseSchema,
	DataListResponseSchema,
	DocsListResponseSchema,
	FoldersListResponseSchema,
	HighlightsListResponseSchema,
	InsightsListResponseSchema,
	MagicSearchResponseSchema,
	NotesListResponseSchema,
	ProjectsListResponseSchema,
	TagsListResponseSchema,
	TokenInfoResponseSchema,
} from './endpoints/types';

// Live API tests for the Dovetail plugin.
//
// Contract:
// - Set DOVETAIL_API_KEY to a personal API key (Dovetail Settings → Account
//   → Personal API keys) before running. Every test below is read-only
//   (GET list/info or POST search) so it never creates, updates, or deletes
//   workspace data.
// - When DOVETAIL_API_KEY is absent (e.g. CI), the whole suite is skipped so
//   the default test run stays green. Neither CI nor review bots can call the
//   real third-party API; the demo video on the PR is that verification.
const TEST_KEY: string = process.env.DOVETAIL_API_KEY ?? '';
const describeLive = TEST_KEY === '' ? describe.skip : describe;

describeLive('Dovetail live API (requires DOVETAIL_API_KEY)', () => {
	it('token.getInfo returns the workspace token info', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['tokenGetInfo']
		>('/v1/token/info', TEST_KEY, { method: 'GET' });

		const parsed = TokenInfoResponseSchema.parse(result);
		expect(parsed.data.id).toBeDefined();
		expect(parsed.data.subdomain).toBeDefined();
	});

	it('projects.list returns a paginated project list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['projectsList']
		>('/v1/projects', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = ProjectsListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('tags.list returns a paginated tag list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['tagsList']
		>('/v1/tags', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = TagsListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('folders.list returns a paginated folder list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['foldersList']
		>('/v1/folders', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = FoldersListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('highlights.list returns a paginated highlight list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['highlightsList']
		>('/v1/highlights', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = HighlightsListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('contacts.list returns a paginated contact list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['contactsList']
		>('/v1/contacts', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = ContactsListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('data.list returns a paginated data list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['dataList']
		>('/v1/data', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = DataListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('docs.list returns a paginated doc list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['docsList']
		>('/v1/docs', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = DocsListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('notes.list returns a paginated note list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['notesList']
		>('/v1/notes', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = NotesListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('insights.list returns a paginated insight list', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['insightsList']
		>('/v1/insights', TEST_KEY, {
			method: 'GET',
			query: { 'page[limit]': 1 },
		});

		const parsed = InsightsListResponseSchema.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('search.magicSearch returns grouped search results', async () => {
		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['searchMagicSearch']
		>('/v1/search', TEST_KEY, {
			method: 'POST',
			body: { query: 'test', limit: 5 },
		});

		const parsed = MagicSearchResponseSchema.parse(result);
		expect(parsed).toBeDefined();
	});
});
