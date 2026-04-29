import 'dotenv/config';
import { makeVapiRequest } from './client';
import type {
	AssistantsListResponse,
	AssistantsCreateResponse,
	AssistantsGetResponse,
	AssistantsUpdateResponse,
	AssistantsDeleteResponse,
	CallsListResponse,
	CallsGetResponse,
	PhoneNumbersListResponse,
	SquadsListResponse,
	SquadsCreateResponse,
	SquadsGetResponse,
	SquadsUpdateResponse,
	SquadsDeleteResponse,
	ToolsListResponse,
	ToolsCreateResponse,
	ToolsGetResponse,
	ToolsUpdateResponse,
	ToolsDeleteResponse,
	FilesListResponse,
	KnowledgeBasesListResponse,
	KnowledgeBasesCreateResponse,
	KnowledgeBasesGetResponse,
	KnowledgeBasesUpdateResponse,
	KnowledgeBasesDeleteResponse,
} from './endpoints/types';
import { VapiEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.VAPI_API_KEY!;

describe('Vapi API Type Tests', () => {
	describe('assistants', () => {
		let testAssistantId: string | undefined;

		it('assistantsList returns correct type', async () => {
			const result = await makeVapiRequest<AssistantsListResponse>(
				'assistant',
				TEST_API_KEY,
				{ method: 'GET', query: { limit: 10 } },
			);

			if (result.length > 0 && result[0]?.id) {
				testAssistantId = result[0].id;
			}

			VapiEndpointOutputSchemas.assistantsList.parse(result);
		});

		it('assistantsCreate returns correct type', async () => {
			const result = await makeVapiRequest<AssistantsCreateResponse>(
				'assistant',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						name: `Test Assistant ${Date.now()}`,
						firstMessage: 'Hello, how can I help you?',
					},
				},
			);

			if (result.id) {
				testAssistantId = result.id;
			}

			VapiEndpointOutputSchemas.assistantsCreate.parse(result);
		});

		it('assistantsGet returns correct type', async () => {
			if (!testAssistantId) {
				const list = await makeVapiRequest<AssistantsListResponse>(
					'assistant',
					TEST_API_KEY,
					{ method: 'GET', query: { limit: 1 } },
				);
				const firstId = list[0]?.id;
				if (!firstId) throw new Error('No assistants found to test assistantsGet');
				testAssistantId = firstId;
			}

			const result = await makeVapiRequest<AssistantsGetResponse>(
				`assistant/${testAssistantId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			VapiEndpointOutputSchemas.assistantsGet.parse(result);
		});

		it('assistantsUpdate returns correct type', async () => {
			if (!testAssistantId) {
				const list = await makeVapiRequest<AssistantsListResponse>(
					'assistant',
					TEST_API_KEY,
					{ method: 'GET', query: { limit: 1 } },
				);
				const firstId = list[0]?.id;
				if (!firstId) throw new Error('No assistants found to test assistantsUpdate');
				testAssistantId = firstId;
			}

			const result = await makeVapiRequest<AssistantsUpdateResponse>(
				`assistant/${testAssistantId}`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					body: { name: `Updated Assistant ${Date.now()}` },
				},
			);

			VapiEndpointOutputSchemas.assistantsUpdate.parse(result);
		});

		it('assistantsDelete returns correct type', async () => {
			// Create a disposable assistant to delete
			const created = await makeVapiRequest<AssistantsCreateResponse>(
				'assistant',
				TEST_API_KEY,
				{
					method: 'POST',
					body: { name: `Delete Test Assistant ${Date.now()}` },
				},
			);

			const result = await makeVapiRequest<AssistantsDeleteResponse>(
				`assistant/${created.id}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			VapiEndpointOutputSchemas.assistantsDelete.parse(result);
		});
	});

	describe('calls', () => {
		it('callsList returns correct type', async () => {
			const result = await makeVapiRequest<CallsListResponse>(
				'call',
				TEST_API_KEY,
				{ method: 'GET', query: { limit: 10 } },
			);

			VapiEndpointOutputSchemas.callsList.parse(result);
		});

		it('callsGet returns correct type', async () => {
			const list = await makeVapiRequest<CallsListResponse>(
				'call',
				TEST_API_KEY,
				{ method: 'GET', query: { limit: 1 } },
			);
			const firstId = list[0]?.id;
			if (!firstId) {
				// No calls on this account yet — skip gracefully
				return;
			}

			const result = await makeVapiRequest<CallsGetResponse>(
				`call/${firstId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			VapiEndpointOutputSchemas.callsGet.parse(result);
		});
	});

	describe('phoneNumbers', () => {
		it('phoneNumbersList returns correct type', async () => {
			const result = await makeVapiRequest<PhoneNumbersListResponse>(
				'phone-number',
				TEST_API_KEY,
				{ method: 'GET', query: { limit: 10 } },
			);

			VapiEndpointOutputSchemas.phoneNumbersList.parse(result);
		});
	});

	describe('squads', () => {
		let testSquadId: string | undefined;

		it('squadsList returns correct type', async () => {
			const result = await makeVapiRequest<SquadsListResponse>(
				'squad',
				TEST_API_KEY,
				{ method: 'GET', query: { limit: 10 } },
			);

			if (result.length > 0 && result[0]?.id) {
				testSquadId = result[0].id;
			}

			VapiEndpointOutputSchemas.squadsList.parse(result);
		});

		it('squadsCreate returns correct type', async () => {
			const result = await makeVapiRequest<SquadsCreateResponse>(
				'squad',
				TEST_API_KEY,
				{
					method: 'POST',
					body: { name: `Test Squad ${Date.now()}`, members: [] },
				},
			);

			if (result.id) {
				testSquadId = result.id;
			}

			VapiEndpointOutputSchemas.squadsCreate.parse(result);
		});

		it('squadsGet returns correct type', async () => {
			if (!testSquadId) {
				const list = await makeVapiRequest<SquadsListResponse>(
					'squad',
					TEST_API_KEY,
					{ method: 'GET', query: { limit: 1 } },
				);
				const firstId = list[0]?.id;
				if (!firstId) throw new Error('No squads found to test squadsGet');
				testSquadId = firstId;
			}

			const result = await makeVapiRequest<SquadsGetResponse>(
				`squad/${testSquadId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			VapiEndpointOutputSchemas.squadsGet.parse(result);
		});

		it('squadsUpdate returns correct type', async () => {
			if (!testSquadId) {
				const list = await makeVapiRequest<SquadsListResponse>(
					'squad',
					TEST_API_KEY,
					{ method: 'GET', query: { limit: 1 } },
				);
				const firstId = list[0]?.id;
				if (!firstId) throw new Error('No squads found to test squadsUpdate');
				testSquadId = firstId;
			}

			const result = await makeVapiRequest<SquadsUpdateResponse>(
				`squad/${testSquadId}`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					// Vapi requires members on every PATCH even if unchanged
					body: { name: `Updated Squad ${Date.now()}`, members: [] },
				},
			);

			VapiEndpointOutputSchemas.squadsUpdate.parse(result);
		});

		it('squadsDelete returns correct type', async () => {
			const created = await makeVapiRequest<SquadsCreateResponse>(
				'squad',
				TEST_API_KEY,
				{
					method: 'POST',
					body: { name: `Delete Test Squad ${Date.now()}`, members: [] },
				},
			);

			const result = await makeVapiRequest<SquadsDeleteResponse>(
				`squad/${created.id}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			VapiEndpointOutputSchemas.squadsDelete.parse(result);
		});
	});

	describe('tools', () => {
		let testToolId: string | undefined;

		it('toolsList returns correct type', async () => {
			const result = await makeVapiRequest<ToolsListResponse>(
				'tool',
				TEST_API_KEY,
				{ method: 'GET', query: { limit: 10 } },
			);

			if (result.length > 0 && result[0]?.id) {
				testToolId = result[0].id;
			}

			VapiEndpointOutputSchemas.toolsList.parse(result);
		});

		it('toolsCreate returns correct type', async () => {
			const result = await makeVapiRequest<ToolsCreateResponse>(
				'tool',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						type: 'function',
						function: {
							name: `testTool${Date.now()}`,
							description: 'A test tool created by API test',
							parameters: {
								type: 'object',
								properties: {},
							},
						},
						server: { url: 'https://example.com/tool' },
					},
				},
			);

			if (result.id) {
				testToolId = result.id;
			}

			VapiEndpointOutputSchemas.toolsCreate.parse(result);
		});

		it('toolsGet returns correct type', async () => {
			if (!testToolId) {
				const list = await makeVapiRequest<ToolsListResponse>(
					'tool',
					TEST_API_KEY,
					{ method: 'GET', query: { limit: 1 } },
				);
				const firstId = list[0]?.id;
				if (!firstId) throw new Error('No tools found to test toolsGet');
				testToolId = firstId;
			}

			const result = await makeVapiRequest<ToolsGetResponse>(
				`tool/${testToolId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			VapiEndpointOutputSchemas.toolsGet.parse(result);
		});

		it('toolsUpdate returns correct type', async () => {
			if (!testToolId) {
				const list = await makeVapiRequest<ToolsListResponse>(
					'tool',
					TEST_API_KEY,
					{ method: 'GET', query: { limit: 1 } },
				);
				const firstId = list[0]?.id;
				if (!firstId) throw new Error('No tools found to test toolsUpdate');
				testToolId = firstId;
			}

			const result = await makeVapiRequest<ToolsUpdateResponse>(
				`tool/${testToolId}`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					body: { async: false },
				},
			);

			VapiEndpointOutputSchemas.toolsUpdate.parse(result);
		});

		it('toolsDelete returns correct type', async () => {
			const created = await makeVapiRequest<ToolsCreateResponse>(
				'tool',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						type: 'function',
						function: {
							name: `deleteTestTool${Date.now()}`,
							description: 'Delete test tool',
							parameters: { type: 'object', properties: {} },
						},
						server: { url: 'https://example.com/tool' },
					},
				},
			);

			const result = await makeVapiRequest<ToolsDeleteResponse>(
				`tool/${created.id}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			VapiEndpointOutputSchemas.toolsDelete.parse(result);
		});
	});

	describe('files', () => {
		it('filesList returns correct type', async () => {
			const result = await makeVapiRequest<FilesListResponse>(
				'file',
				TEST_API_KEY,
				{ method: 'GET', query: { limit: 10 } },
			);

			VapiEndpointOutputSchemas.filesList.parse(result);
		});
	});

	describe('knowledgeBases', () => {
		let testKbId: string | undefined;

		it('knowledgeBasesList returns correct type', async () => {
			const result = await makeVapiRequest<KnowledgeBasesListResponse>(
				'knowledge-base',
				TEST_API_KEY,
				{ method: 'GET', query: { limit: 10 } },
			);

			if (result.length > 0 && result[0]?.id) {
				testKbId = result[0].id;
			}

			VapiEndpointOutputSchemas.knowledgeBasesList.parse(result);
		});

		it('knowledgeBasesCreate returns correct type', async () => {
			const result = await makeVapiRequest<KnowledgeBasesCreateResponse>(
				'knowledge-base',
				TEST_API_KEY,
				{
					method: 'POST',
					// Vapi requires provider discriminator; custom-knowledge-base needs server.url
					body: {
						provider: 'custom-knowledge-base',
						server: { url: 'https://example.com/kb' },
					},
				},
			);

			if (result.id) {
				testKbId = result.id;
			}

			VapiEndpointOutputSchemas.knowledgeBasesCreate.parse(result);
		});

		it('knowledgeBasesGet returns correct type', async () => {
			if (!testKbId) {
				const list = await makeVapiRequest<KnowledgeBasesListResponse>(
					'knowledge-base',
					TEST_API_KEY,
					{ method: 'GET', query: { limit: 1 } },
				);
				const firstId = list[0]?.id;
				if (!firstId) throw new Error('No knowledge bases found to test knowledgeBasesGet');
				testKbId = firstId;
			}

			const result = await makeVapiRequest<KnowledgeBasesGetResponse>(
				`knowledge-base/${testKbId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			VapiEndpointOutputSchemas.knowledgeBasesGet.parse(result);
		});

		it.skip('knowledgeBasesUpdate returns correct type', async () => {
			// Vapi's PATCH /knowledge-base/:id returns "We couldn't find a validator
			// for your input" for all body shapes — endpoint appears broken on their side
		});

		it('knowledgeBasesDelete returns correct type', async () => {
			const created = await makeVapiRequest<KnowledgeBasesCreateResponse>(
				'knowledge-base',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						provider: 'custom-knowledge-base',
						server: { url: 'https://example.com/kb-delete' },
					},
				},
			);

			const result = await makeVapiRequest<KnowledgeBasesDeleteResponse>(
				`knowledge-base/${created.id}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			VapiEndpointOutputSchemas.knowledgeBasesDelete.parse(result);
		});
	});
});
