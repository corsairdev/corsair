import {
	GriptapeEndpointInputSchemas,
	GriptapeEndpointOutputSchemas,
} from './endpoints/types';
import { GriptapeSchema } from './schema';

describe('Griptape schema', () => {
	it('declares a semver version', () => {
		expect(GriptapeSchema.version).toBeDefined();
		expect(GriptapeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GriptapeSchema.entities).toBe('object');
		expect(GriptapeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GriptapeSchema.entities))).toBe(true);
		for (const entity of Object.values(GriptapeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers an input and output schema for every endpoint', () => {
		const inputKeys = Object.keys(GriptapeEndpointInputSchemas);
		const outputKeys = Object.keys(GriptapeEndpointOutputSchemas);

		expect(inputKeys.length).toBeGreaterThan(100);
		expect(outputKeys).toEqual(inputKeys);
	});

	it('requires a query for knowledge base query and search', () => {
		expect(
			GriptapeEndpointInputSchemas.knowledgeBaseQuery.safeParse({
				knowledge_base_id: 'kb-1',
				query: 'What is the refund policy?',
			}).success,
		).toBe(true);
		expect(
			GriptapeEndpointInputSchemas.knowledgeBaseQuery.safeParse({
				knowledge_base_id: 'kb-1',
				query: '',
			}).success,
		).toBe(false);
		expect(
			GriptapeEndpointInputSchemas.knowledgeBaseSearch.safeParse({
				knowledge_base_id: 'kb-1',
			}).success,
		).toBe(false);
	});

	it('requires input and output for thread message creation', () => {
		expect(
			GriptapeEndpointInputSchemas.threadMessageCreate.safeParse({
				thread_id: 'thread-1',
				input: 'hello',
				output: 'hi there',
			}).success,
		).toBe(true);
		expect(
			GriptapeEndpointInputSchemas.threadMessageCreate.safeParse({
				thread_id: 'thread-1',
				input: 'hello',
			}).success,
		).toBe(false);
	});

	it('rejects empty resource ids', () => {
		expect(
			GriptapeEndpointInputSchemas.threadGet.safeParse({ thread_id: '' })
				.success,
		).toBe(false);
		expect(
			GriptapeEndpointInputSchemas.rulesetGetByAlias.safeParse({ alias: '' })
				.success,
		).toBe(false);
	});

	it('accepts arbitrary Cloud fields in mutation bodies', () => {
		const parsed = GriptapeEndpointInputSchemas.assistantCreate.safeParse({
			body: { name: 'Support Bot', description: 'l1 support' },
		});

		expect(parsed.success).toBe(true);
	});

	it('accepts empty delete results (204 no content)', () => {
		expect(
			GriptapeEndpointOutputSchemas.assistantDelete.safeParse(undefined)
				.success,
		).toBe(true);
	});

	it('validates list outputs as objects with optional pagination', () => {
		expect(
			GriptapeEndpointOutputSchemas.threadList.safeParse({
				threads: [],
				pagination: {
					page_number: 1,
					page_size: 20,
					total_count: 0,
					total_pages: 0,
				},
			}).success,
		).toBe(true);
		expect(
			GriptapeEndpointOutputSchemas.threadList.safeParse('not-an-object')
				.success,
		).toBe(false);
	});
});
const UUID = '550e8400-e29b-41d4-a716-446655440000';
const UUID2 = '550e8400-e29b-41d4-a716-446655440001';

type OutputKind = 'strict' | 'delete' | 'object';

type Row = [
	key: keyof typeof GriptapeEndpointInputSchemas,
	validInput: Record<string, unknown>,
	invalidInput: unknown,
	outputKind: OutputKind,
];

// One row per endpoint: a minimal valid input, an input that must fail, and
// the output shape category. Fixtures mirror the zod schemas in
// endpoints/types.ts — not the live API — so they stay hermetic.
const ROWS: Row[] = [
	['assistantList', {}, { page: 'two' }, 'strict'],
	['assistantGet', { assistant_id: UUID }, { assistant_id: '' }, 'strict'],
	['assistantCreate', { body: { name: 'x' } }, { body: 'nope' }, 'object'],
	[
		'assistantUpdate',
		{ assistant_id: 'a', body: {} },
		{ assistant_id: '' },
		'object',
	],
	['assistantDelete', { assistant_id: 'a' }, {}, 'delete'],
	['assistantRunCreate', { assistant_id: 'a' }, {}, 'object'],
	[
		'assistantRunList',
		{ assistant_id: 'a', page: 1 },
		{ assistant_id: 'a', page: -2 },
		'object',
	],
	['assistantRunGet', { assistant_run_id: 'r' }, {}, 'object'],
	['assistantRunCancel', { assistant_run_id: 'r' }, {}, 'object'],
	[
		'assistantRunEvents',
		{ assistant_run_id: 'r' },
		{ assistant_run_id: '' },
		'object',
	],
	['threadList', {}, { page: 0 }, 'object'],
	['threadCreate', {}, { body: 'nope' }, 'object'],
	['threadGet', { thread_id: 't' }, {}, 'object'],
	['threadUpdate', { thread_id: 't' }, { thread_id: '' }, 'object'],
	['threadDelete', { thread_id: 't' }, {}, 'delete'],
	['threadMessageList', { thread_id: 't' }, {}, 'object'],
	[
		'threadMessageCreate',
		{ thread_id: 't', input: 'hi', output: 'ho' },
		{ thread_id: 't', input: 'hi' },
		'object',
	],
	['messageGet', { message_id: 'm' }, {}, 'object'],
	['messageUpdate', { message_id: 'm' }, { message_id: '' }, 'object'],
	['messageDelete', { message_id: 'm' }, {}, 'delete'],
	['knowledgeBaseList', {}, { page_size: 0 }, 'object'],
	['knowledgeBaseCreate', {}, { body: 42 }, 'object'],
	['knowledgeBaseGet', { knowledge_base_id: 'k' }, {}, 'object'],
	['knowledgeBaseUpdate', { knowledge_base_id: 'k' }, { body: 'x' }, 'object'],
	['knowledgeBaseDelete', { knowledge_base_id: 'k' }, {}, 'delete'],
	[
		'knowledgeBaseQuery',
		{ knowledge_base_id: 'k', query: 'q' },
		{ knowledge_base_id: 'k', query: '' },
		'object',
	],
	[
		'knowledgeBaseSearch',
		{ knowledge_base_id: 'k', query: 'q' },
		{ knowledge_base_id: 'k' },
		'object',
	],
	['knowledgeBaseListQueries', { knowledge_base_id: 'k' }, {}, 'object'],
	['knowledgeBaseListSearches', { knowledge_base_id: 'k' }, {}, 'object'],
	['knowledgeBaseGetSearch', { knowledge_base_search_id: 's' }, {}, 'object'],
	[
		'knowledgeBaseCreateJob',
		{ knowledge_base_id: 'k' },
		{ knowledge_base_id: '' },
		'object',
	],
	['knowledgeBaseListJobs', { knowledge_base_id: 'k' }, {}, 'object'],
	['knowledgeBaseGetJob', { knowledge_base_job_id: 'j' }, {}, 'object'],
	['dataConnectorList', {}, { page: -1 }, 'object'],
	['dataConnectorCreate', {}, { body: 'x' }, 'object'],
	['dataConnectorGet', { data_connector_id: 'd' }, {}, 'object'],
	['dataConnectorUpdate', { data_connector_id: 'd' }, {}, 'object'],
	['dataConnectorDelete', { data_connector_id: 'd' }, {}, 'delete'],
	['dataConnectorCreateJob', { data_connector_id: 'd' }, {}, 'object'],
	['dataJobGet', { data_job_id: 'j' }, {}, 'object'],
	['dataJobCancel', { data_job_id: 'j' }, {}, 'object'],
	['structureList', {}, { page: 0 }, 'object'],
	['structureCreate', { body: { name: 's' } }, { body: 'x' }, 'object'],
	['structureGet', { structure_id: 's' }, {}, 'object'],
	['structureUpdate', { structure_id: 's' }, { structure_id: '' }, 'object'],
	['structureDelete', { structure_id: 's' }, {}, 'delete'],
	['structureDashboard', {}, { structure_ids: 'nope' }, 'object'],
	['structureListRuns', { structure_id: 's' }, {}, 'object'],
	['structureListDeployments', { structure_id: 's' }, {}, 'object'],
	['structureCreateDeployment', { structure_id: 's' }, {}, 'object'],
	['toolList', {}, { page_size: -1 }, 'object'],
	['toolCreate', {}, { body: [] }, 'object'],
	['toolGet', { tool_id: 't' }, {}, 'object'],
	['toolUpdate', { tool_id: 't' }, { tool_id: '' }, 'object'],
	['toolDelete', { tool_id: 't' }, {}, 'delete'],
	['toolListRuns', { tool_id: 't' }, {}, 'object'],
	['toolListDeployments', { tool_id: 't' }, {}, 'object'],
	['toolCreateDeployment', { tool_id: 't' }, {}, 'object'],
	['toolDeploymentStatus', { deployment_id: 'd' }, {}, 'object'],
	['functionList', {}, { page: 0 }, 'object'],
	['functionCreate', {}, { body: 'x' }, 'object'],
	['functionGet', { function_id: 'f' }, {}, 'object'],
	['functionUpdate', { function_id: 'f' }, {}, 'object'],
	['functionDelete', { function_id: 'f' }, {}, 'delete'],
	['functionListDeployments', { function_id: 'f' }, {}, 'object'],
	['functionCreateDeployment', { function_id: 'f' }, {}, 'object'],
	['ruleList', {}, { page: 0 }, 'object'],
	['ruleCreate', {}, { body: 1 }, 'object'],
	['ruleGet', { rule_id: 'r' }, {}, 'object'],
	['ruleUpdate', { rule_id: 'r' }, { rule_id: '' }, 'object'],
	['ruleDelete', { rule_id: 'r' }, {}, 'delete'],
	['rulesetCreate', {}, { body: 'x' }, 'object'],
	['rulesetGet', { ruleset_id: 'r' }, {}, 'object'],
	['rulesetGetByAlias', { alias: 'abc' }, { alias: '' }, 'object'],
	['rulesetUpdate', { ruleset_id: 'r' }, {}, 'object'],
	['rulesetDelete', { ruleset_id: 'r' }, {}, 'delete'],
	['retrieverList', {}, { page: 0 }, 'object'],
	['retrieverCreate', {}, { body: 'x' }, 'object'],
	['retrieverGet', { retriever_id: 'r' }, {}, 'object'],
	['retrieverUpdate', { retriever_id: 'r' }, {}, 'object'],
	[
		'retrieverQuery',
		{ retriever_id: 'r', query: 'q' },
		{ retriever_id: 'r', query: '' },
		'object',
	],
	['retrieverComponentList', {}, { page_size: 0 }, 'object'],
	['retrieverComponentCreate', {}, { body: 'x' }, 'object'],
	['retrieverComponentGet', { retriever_component_id: 'c' }, {}, 'object'],
	['retrieverComponentUpdate', { retriever_component_id: 'c' }, {}, 'object'],
	['libraryList', {}, { page: 0 }, 'object'],
	['libraryCreate', {}, { body: 'x' }, 'object'],
	['libraryGet', { library_id: 'l' }, {}, 'object'],
	['libraryUpdate', { library_id: 'l' }, {}, 'object'],
	['libraryDelete', { library_id: 'l' }, {}, 'delete'],
	['integrationList', {}, { page: 0 }, 'object'],
	['integrationCreate', {}, { body: 'x' }, 'object'],
	['integrationGet', { integration_id: 'i' }, {}, 'object'],
	['integrationUpdate', { integration_id: 'i' }, {}, 'object'],
	['integrationDelete', { integration_id: 'i' }, {}, 'delete'],
	['bucketList', {}, { page: 0 }, 'object'],
	['bucketCreate', {}, { body: 'x' }, 'object'],
	['bucketGet', { bucket_id: 'b' }, {}, 'object'],
	['bucketUpdate', { bucket_id: 'b' }, {}, 'object'],
	['bucketDelete', { bucket_id: 'b' }, {}, 'delete'],
	['bucketListAssets', { bucket_id: 'b' }, {}, 'object'],
	[
		'bucketGetAsset',
		{ bucket_id: 'b', name: 'f' },
		{ bucket_id: 'b', name: '' },
		'object',
	],
	[
		'bucketCreateAsset',
		{ bucket_id: 'b', name: 'f' },
		{ bucket_id: 'b' },
		'object',
	],
	[
		'bucketDeleteAsset',
		{ bucket_id: 'b', name: 'f' },
		{ bucket_id: 'b', name: '' },
		'delete',
	],
	[
		'bucketAssetUrl',
		{ bucket_id: 'b', name: 'f' },
		{ bucket_id: '', name: 'f' },
		'object',
	],
	['secretList', {}, { page: 0 }, 'object'],
	['secretCreate', {}, { body: 'x' }, 'object'],
	['secretGet', { secret_id: 's' }, {}, 'object'],
	['secretUpdate', { secret_id: 's' }, {}, 'object'],
	['secretDelete', { secret_id: 's' }, {}, 'delete'],
	['modelList', {}, { page: 0 }, 'object'],
	['modelCreate', {}, { body: 'x' }, 'object'],
	['modelGet', { model_config_id: 'm' }, {}, 'object'],
	['modelUpdate', { model_config_id: 'm' }, {}, 'object'],
	['modelDelete', { model_config_id: 'm' }, {}, 'delete'],
	['modelListAuthConfigs', {}, { page_size: 0 }, 'object'],
	['modelCreateAuthConfig', {}, { body: 'x' }, 'object'],
	['modelGetAuthConfig', { auth_config_id: 'a' }, {}, 'object'],
	['modelUpdateAuthConfig', { auth_config_id: 'a' }, {}, 'object'],
	['modelDeleteAuthConfig', { auth_config_id: 'a' }, {}, 'delete'],
	['organizationList', {}, { page: 0 }, 'object'],
	['organizationGet', { organization_id: 'o' }, {}, 'object'],
	['organizationUpdate', { organization_id: 'o' }, {}, 'object'],
	['organizationListApiKeys', { organization_id: 'o' }, {}, 'object'],
	['organizationCreateApiKey', { organization_id: 'o' }, {}, 'object'],
	['userList', {}, { page: 0 }, 'object'],
	['userGet', { user_id: 'u' }, {}, 'object'],
	['userGetApiKey', { api_key_id: 'k' }, {}, 'object'],
	['userDeleteApiKey', { api_key_id: 'k' }, {}, 'delete'],
	['billingManagementUrl', {}, 'nope', 'object'],
	['creditsBalance', {}, 'nope', 'object'],
	['usageGet', {}, 'nope', 'object'],
	['configGet', {}, 'nope', 'object'],
	['connectionList', {}, { page: 0 }, 'object'],
	['exportJobList', {}, { page: 0 }, 'object'],
	['exportJobCreate', {}, { body: 'x' }, 'object'],
	['exportJobGet', { export_job_id: 'e' }, {}, 'object'],
	['importJobList', {}, { page: 0 }, 'object'],
	['importJobCreate', {}, { body: 'x' }, 'object'],
	['importJobGet', { import_job_id: 'i' }, {}, 'object'],
];

const ASSISTANT_DETAIL = {
	assistant_id: UUID,
	created_at: '2026-01-01T00:00:00Z',
	created_by: 'user@example.com',
	description: 'Test assistant',
	knowledge_base_ids: [],
	name: 'Test Assistant',
	organization_id: UUID2,
	retriever_ids: [],
	ruleset_ids: [],
	structure_ids: [],
	tool_ids: [],
	updated_at: '2026-01-01T00:00:00Z',
};

describe('griptape endpoint schema coverage', () => {
	it('covers every registered endpoint exactly once', () => {
		const keys = Object.keys(GriptapeEndpointInputSchemas);

		expect(ROWS).toHaveLength(140);
		expect(new Set(ROWS.map(([key]) => key)).size).toBe(140);
		expect([...ROWS.map(([key]) => key)].sort()).toEqual([...keys].sort());
	});

	for (const [key, validInput, invalidInput, outputKind] of ROWS) {
		it(`${key} validates inputs and outputs`, () => {
			const inputSchema =
				GriptapeEndpointInputSchemas[
					key as keyof typeof GriptapeEndpointInputSchemas
				];
			expect(inputSchema.safeParse(validInput).success).toBe(true);
			expect(inputSchema.safeParse(invalidInput).success).toBe(false);

			const outputSchema =
				GriptapeEndpointOutputSchemas[
					key as keyof typeof GriptapeEndpointOutputSchemas
				];
			if (outputKind === 'delete') {
				// 204 no-content deletes resolve to undefined.
				expect(outputSchema.safeParse(undefined).success).toBe(true);
				return;
			}
			if (outputKind === 'strict') {
				if (key === 'assistantList') {
					expect(
						outputSchema.safeParse({
							assistants: [ASSISTANT_DETAIL],
							pagination: {
								page_number: 1,
								page_size: 10,
								total_count: 1,
								total_pages: 1,
							},
						}).success,
					).toBe(true);
					expect(outputSchema.safeParse({}).success).toBe(false);
					return;
				}
				expect(outputSchema.safeParse(ASSISTANT_DETAIL).success).toBe(true);
				expect(outputSchema.safeParse({}).success).toBe(false);
				return;
			}
			expect(outputSchema.safeParse({ ok: true }).success).toBe(true);
			expect(outputSchema.safeParse('not-an-object').success).toBe(false);
			expect(outputSchema.safeParse(42).success).toBe(false);
		});
	}
});
