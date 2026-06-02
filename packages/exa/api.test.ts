import 'dotenv/config';
import { makeExaRequest } from './client';
import type {
	EventsListResponse,
	FindSimilarResponse,
	GetAnswerResponse,
	GetContentsResponse,
	ImportsDeleteResponse,
	ImportsListResponse,
	SearchResponse,
	WebhooksApiListResponse,
	Webset,
	WebsetEvent,
	WebsetImport,
	WebsetMonitor,
	WebsetsDeleteResponse,
} from './endpoints/types';
import { ExaEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.EXA_API_KEY!;

describe('Exa API Type Tests', () => {
	describe('search', () => {
		it('searchSearch returns correct type', async () => {
			const response = await makeExaRequest<SearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'latest AI research papers',
						numResults: 5,
						type: 'neural',
					},
				},
			);

			ExaEndpointOutputSchemas.searchSearch.parse(response);
		});

		it('searchSearch with contents returns correct type', async () => {
			const response = await makeExaRequest<SearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'open source LLM models 2024',
						numResults: 3,
						type: 'auto',
						contents: {
							text: { maxCharacters: 500 },
							highlights: { numSentences: 2, highlightsPerUrl: 2 },
						},
					},
				},
			);

			ExaEndpointOutputSchemas.searchSearch.parse(response);
		});

		it('searchSearch with domain filters returns correct type', async () => {
			const response = await makeExaRequest<SearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'machine learning tutorials',
						numResults: 5,
						includeDomains: ['arxiv.org', 'github.com'],
						useAutoprompt: true,
					},
				},
			);

			ExaEndpointOutputSchemas.searchSearch.parse(response);
		});

		it('searchFindSimilar returns correct type', async () => {
			const response = await makeExaRequest<FindSimilarResponse>(
				'findSimilar',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://arxiv.org/abs/2303.08774',
						numResults: 5,
					},
				},
			);

			ExaEndpointOutputSchemas.searchFindSimilar.parse(response);
		});

		it('searchFindSimilar with excludeSourceDomain returns correct type', async () => {
			const response = await makeExaRequest<FindSimilarResponse>(
				'findSimilar',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						url: 'https://openai.com/research/gpt-4',
						numResults: 5,
						excludeSourceDomain: true,
					},
				},
			);

			ExaEndpointOutputSchemas.searchFindSimilar.parse(response);
		});
	});

	describe('contents', () => {
		it('contentsGet returns correct type', async () => {
			const searchResponse = await makeExaRequest<SearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'TypeScript best practices',
						numResults: 2,
					},
				},
			);
			const ids = searchResponse.results.map((r) => r.id);

			if (ids.length === 0) {
				throw new Error('No search results found for contents test');
			}

			const response = await makeExaRequest<GetContentsResponse>(
				'contents',
				TEST_API_KEY,
				{
					method: 'POST',
					body: { ids },
				},
			);

			ExaEndpointOutputSchemas.contentsGet.parse(response);
		});

		it('contentsGet with text and summary options returns correct type', async () => {
			const searchResponse = await makeExaRequest<SearchResponse>(
				'search',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'React hooks tutorial',
						numResults: 2,
					},
				},
			);
			const ids = searchResponse.results.map((r) => r.id);

			if (ids.length === 0) {
				throw new Error('No search results found for contents test');
			}

			const response = await makeExaRequest<GetContentsResponse>(
				'contents',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						ids,
						text: { maxCharacters: 1000 },
						highlights: { numSentences: 3, highlightsPerUrl: 3 },
						summary: { query: 'React hooks' },
					},
				},
			);

			ExaEndpointOutputSchemas.contentsGet.parse(response);
		});
	});

	describe('answer', () => {
		it('answerGet returns correct type', async () => {
			const response = await makeExaRequest<GetAnswerResponse>(
				'answer',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'What is the difference between neural and keyword search?',
					},
				},
			);

			ExaEndpointOutputSchemas.answerGet.parse(response);
		});

		it('answerGet with text citations returns correct type', async () => {
			const response = await makeExaRequest<GetAnswerResponse>(
				'answer',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: 'How does retrieval augmented generation work?',
						text: true,
					},
				},
			);

			ExaEndpointOutputSchemas.answerGet.parse(response);
		});
	});

	describe('websets', () => {
		let createdWebsetId: string;

		it('websetsCreate returns correct type', async () => {
			const response = await makeExaRequest<Webset>(
				'websets/v0/websets',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						searches: [
							{
								query: 'top AI startups 2024',
								count: 5,
								entity: { type: 'company' },
							},
						],
					},
				},
			);

			ExaEndpointOutputSchemas.websetsCreate.parse(response);
			createdWebsetId = response.id;
		});

		it('websetsGet returns correct type', async () => {
			if (!createdWebsetId) {
				return;
			}

			const response = await makeExaRequest<Webset>(
				`websets/v0/websets/${createdWebsetId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			ExaEndpointOutputSchemas.websetsGet.parse(response);
		});

		it('websetsDelete returns correct type', async () => {
			if (!createdWebsetId) {
				return;
			}

			const response = await makeExaRequest<WebsetsDeleteResponse>(
				`websets/v0/websets/${createdWebsetId}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			ExaEndpointOutputSchemas.websetsDelete.parse(response);
		});
	});

	describe('imports', () => {
		let testWebsetId: string;
		let createdImportId: string;

		beforeAll(async () => {
			const webset = await makeExaRequest<Webset>(
				'websets/v0/websets',
				TEST_API_KEY,
				{
					method: 'POST',
					body: { searches: [{ query: 'import test webset', count: 3 }] },
				},
			);
			testWebsetId = webset.id;
		});

		afterAll(async () => {
			if (testWebsetId) {
				await makeExaRequest(
					`websets/v0/websets/${testWebsetId}`,
					TEST_API_KEY,
					{
						method: 'DELETE',
					},
				);
			}
		});

		it('importsCreate returns correct type', async () => {
			if (!testWebsetId) {
				return;
			}

			const response = await makeExaRequest<WebsetImport>(
				`websets/v0/websets/${testWebsetId}/imports`,
				TEST_API_KEY,
				{
					method: 'POST',
					body: { urls: ['https://arxiv.org/abs/2303.08774'] },
				},
			);

			ExaEndpointOutputSchemas.importsCreate.parse(response);
			createdImportId = response.id;
		});

		it('importsList returns correct type', async () => {
			if (!testWebsetId) {
				return;
			}

			const response = await makeExaRequest<ImportsListResponse>(
				`websets/v0/websets/${testWebsetId}/imports`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			ExaEndpointOutputSchemas.importsList.parse(response);
		});

		it('importsDelete returns correct type', async () => {
			if (!testWebsetId || !createdImportId) {
				return;
			}

			const response = await makeExaRequest<ImportsDeleteResponse>(
				`websets/v0/websets/${testWebsetId}/imports/${createdImportId}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			ExaEndpointOutputSchemas.importsDelete.parse(response);
		});
	});

	describe('monitors', () => {
		let testWebsetId: string;

		beforeAll(async () => {
			const webset = await makeExaRequest<Webset>(
				'websets/v0/websets',
				TEST_API_KEY,
				{
					method: 'POST',
					body: { searches: [{ query: 'monitor test webset', count: 3 }] },
				},
			);
			testWebsetId = webset.id;
		});

		afterAll(async () => {
			if (testWebsetId) {
				await makeExaRequest(
					`websets/v0/websets/${testWebsetId}`,
					TEST_API_KEY,
					{
						method: 'DELETE',
					},
				);
			}
		});

		it('monitorsCreate returns correct type', async () => {
			if (!testWebsetId) {
				return;
			}

			const response = await makeExaRequest<WebsetMonitor>(
				`websets/v0/websets/${testWebsetId}/monitors`,
				TEST_API_KEY,
				{
					method: 'POST',
					body: { cadence: { type: 'daily' } },
				},
			);

			ExaEndpointOutputSchemas.monitorsCreate.parse(response);
		});
	});

	describe('events', () => {
		let testWebsetId: string;

		beforeAll(async () => {
			const webset = await makeExaRequest<Webset>(
				'websets/v0/websets',
				TEST_API_KEY,
				{
					method: 'POST',
					body: { searches: [{ query: 'events test webset', count: 3 }] },
				},
			);
			testWebsetId = webset.id;
		});

		afterAll(async () => {
			if (testWebsetId) {
				await makeExaRequest(
					`websets/v0/websets/${testWebsetId}`,
					TEST_API_KEY,
					{
						method: 'DELETE',
					},
				);
			}
		});

		it('eventsList returns correct type', async () => {
			if (!testWebsetId) {
				return;
			}

			const response = await makeExaRequest<EventsListResponse>(
				`websets/v0/websets/${testWebsetId}/events`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			ExaEndpointOutputSchemas.eventsList.parse(response);
		});

		it('eventsGet returns correct type', async () => {
			if (!testWebsetId) {
				return;
			}

			const eventsResponse = await makeExaRequest<EventsListResponse>(
				`websets/v0/websets/${testWebsetId}/events`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			const firstEvent = eventsResponse.data[0];
			if (!firstEvent) {
				return;
			}

			const response = await makeExaRequest<WebsetEvent>(
				`websets/v0/websets/${testWebsetId}/events/${firstEvent.id}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			ExaEndpointOutputSchemas.eventsGet.parse(response);
		});
	});

	describe('webhooksApi', () => {
		it('webhooksApiList returns correct type', async () => {
			const response = await makeExaRequest<WebhooksApiListResponse>(
				'websets/v0/webhooks',
				TEST_API_KEY,
				{ method: 'GET' },
			);

			ExaEndpointOutputSchemas.webhooksApiList.parse(response);
		});
	});
});
