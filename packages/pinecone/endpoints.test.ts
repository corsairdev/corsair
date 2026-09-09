import type { PineconeContext } from './index';
import { pinecone } from './index';
import { installFetchHarness } from './test-harness';

type RawEndpoint = (
	ctx: PineconeContext,
	input: Record<string, unknown>,
) => Promise<unknown>;

const plugin = pinecone();

function endpoint(group: string, name: string): RawEndpoint {
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, RawEndpoint>
	>;
	const operation = groups[group]?.[name];
	if (!operation) throw new Error(`Missing endpoint ${group}.${name}`);
	return operation;
}

const cases = [
	{
		name: 'indexes.create',
		method: 'POST',
		path: '/indexes',
		input: {
			name: 'docs-index',
			dimension: 8,
			metric: 'cosine',
			spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
		},
		expectedBody: {
			name: 'docs-index',
			dimension: 8,
			metric: 'cosine',
			spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
		},
		response: { name: 'docs-index', host: 'docs-index.svc.pinecone.io' },
	},
	{
		name: 'indexes.createForModel',
		method: 'POST',
		path: '/indexes/create-for-model',
		input: {
			name: 'integrated-index',
			cloud: 'aws',
			region: 'us-east-1',
			embed: {
				model: 'llama-text-embed-v2',
				field_map: { text: 'chunk_text' },
			},
		},
		expectedBody: {
			name: 'integrated-index',
			cloud: 'aws',
			region: 'us-east-1',
			embed: {
				model: 'llama-text-embed-v2',
				field_map: { text: 'chunk_text' },
			},
		},
		response: { name: 'integrated-index' },
	},
	{
		name: 'indexes.list',
		method: 'GET',
		path: '/indexes',
		input: {},
		response: { indexes: [] },
	},
	{
		name: 'indexes.describe',
		method: 'GET',
		path: '/indexes/docs%20index',
		input: { indexName: 'docs index' },
		response: { name: 'docs-index', host: 'docs-index.svc.pinecone.io' },
	},
	{
		name: 'indexes.configure',
		method: 'PATCH',
		path: '/indexes/docs-index',
		input: { indexName: 'docs-index', deletion_protection: 'enabled' },
		expectedBody: { deletion_protection: 'enabled' },
		response: { name: 'docs-index', deletion_protection: 'enabled' },
	},
	{
		name: 'indexes.delete',
		method: 'DELETE',
		path: '/indexes/docs-index',
		input: { indexName: 'docs-index' },
		response: '',
		expectedResult: undefined,
	},
	{
		name: 'backups.create',
		method: 'POST',
		path: '/indexes/docs-index/backups',
		input: { indexName: 'docs-index', name: 'nightly' },
		expectedBody: { name: 'nightly' },
		response: { backup_id: 'backup-1', name: 'nightly' },
	},
	{
		name: 'backups.listForIndex',
		method: 'GET',
		path: '/indexes/docs-index/backups?include_deleted=true&limit=10',
		input: { indexName: 'docs-index', includeDeleted: true, limit: 10 },
		response: { data: [], pagination: null },
	},
	{
		name: 'backups.listForProject',
		method: 'GET',
		path: '/backups?limit=10',
		input: { limit: 10 },
		response: { data: [], pagination: null },
	},
	{
		name: 'backups.describe',
		method: 'GET',
		path: '/backups/backup-1',
		input: { backupId: 'backup-1' },
		response: { backup_id: 'backup-1', status: 'Ready' },
	},
	{
		name: 'backups.delete',
		method: 'DELETE',
		path: '/backups/backup-1',
		input: { backupId: 'backup-1' },
		response: {},
	},
	{
		name: 'backups.createIndex',
		method: 'POST',
		path: '/backups/backup-1/create-index',
		input: { backupId: 'backup-1', name: 'restored-index' },
		expectedBody: { name: 'restored-index' },
		response: { restore_job_id: 'restore-1' },
	},
	{
		name: 'restoreJobs.list',
		method: 'GET',
		path: '/restore-jobs?limit=10',
		input: { limit: 10 },
		response: { data: [], pagination: null },
	},
	{
		name: 'restoreJobs.describe',
		method: 'GET',
		path: '/restore-jobs/restore-1',
		input: { restoreJobId: 'restore-1' },
		response: { restore_job_id: 'restore-1', status: 'Completed' },
	},
	{
		name: 'collections.list',
		method: 'GET',
		path: '/collections',
		input: {},
		response: { collections: [] },
	},
	{
		name: 'inference.embed',
		method: 'POST',
		path: '/embed',
		input: { model: 'llama-text-embed-v2', inputs: [{ text: 'Corsair' }] },
		expectedBody: {
			model: 'llama-text-embed-v2',
			inputs: [{ text: 'Corsair' }],
		},
		response: { model: 'llama-text-embed-v2', data: [] },
	},
	{
		name: 'inference.rerank',
		method: 'POST',
		path: '/rerank',
		input: {
			model: 'bge-reranker-v2-m3',
			query: 'vector databases',
			documents: [{ text: 'Pinecone stores vectors' }],
		},
		expectedBody: {
			model: 'bge-reranker-v2-m3',
			query: 'vector databases',
			documents: [{ text: 'Pinecone stores vectors' }],
		},
		response: { model: 'bge-reranker-v2-m3', data: [] },
	},
	{
		name: 'inference.listModels',
		method: 'GET',
		path: '/models?type=embed&vector_type=dense',
		input: { type: 'embed', vectorType: 'dense' },
		response: { models: [] },
	},
	{
		name: 'inference.getModel',
		method: 'GET',
		path: '/models/llama-text-embed-v2',
		input: { modelName: 'llama-text-embed-v2' },
		response: { model: 'llama-text-embed-v2', type: 'embed' },
	},
	{
		name: 'vectors.upsert',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/vectors/upsert',
		input: {
			host: 'docs-index.svc.pinecone.io',
			vectors: [{ id: 'v1', values: [0.1, 0.2] }],
		},
		expectedBody: { vectors: [{ id: 'v1', values: [0.1, 0.2] }] },
		response: { upsertedCount: 1 },
	},
	{
		name: 'vectors.query',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/query',
		input: {
			host: 'docs-index.svc.pinecone.io',
			vector: [0.1, 0.2],
			topK: 3,
			includeMetadata: true,
		},
		expectedBody: {
			vector: [0.1, 0.2],
			topK: 3,
			includeMetadata: true,
		},
		response: { matches: [] },
	},
	{
		name: 'vectors.fetch',
		method: 'GET',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/vectors/fetch?ids=v1&ids=v2&namespace=docs',
		input: {
			host: 'docs-index.svc.pinecone.io',
			ids: ['v1', 'v2'],
			namespace: 'docs',
		},
		response: { vectors: {}, namespace: 'docs' },
	},
	{
		name: 'vectors.update',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/vectors/update',
		input: {
			host: 'docs-index.svc.pinecone.io',
			id: 'v1',
			setMetadata: { topic: 'oss' },
		},
		expectedBody: { id: 'v1', setMetadata: { topic: 'oss' } },
		response: {},
	},
	{
		name: 'vectors.delete',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/vectors/delete',
		input: { host: 'docs-index.svc.pinecone.io', ids: ['v1'] },
		expectedBody: { ids: ['v1'] },
		response: {},
	},
	{
		name: 'vectors.list',
		method: 'GET',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/vectors/list?prefix=doc&limit=10&namespace=docs',
		input: {
			host: 'docs-index.svc.pinecone.io',
			prefix: 'doc',
			limit: 10,
			namespace: 'docs',
		},
		response: { vectors: [] },
	},
	{
		name: 'vectors.describeIndexStats',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/describe_index_stats',
		input: { host: 'docs-index.svc.pinecone.io' },
		expectedBody: {},
		response: { totalVectorCount: 10 },
	},
	{
		name: 'namespaces.list',
		method: 'GET',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/namespaces?limit=10&prefix=doc',
		input: { host: 'docs-index.svc.pinecone.io', limit: 10, prefix: 'doc' },
		response: { namespaces: [] },
	},
	{
		name: 'namespaces.create',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/namespaces',
		input: {
			host: 'docs-index.svc.pinecone.io',
			namespace: 'docs',
			schema: { fields: { genre: { filterable: true } } },
		},
		expectedBody: {
			name: 'docs',
			schema: { fields: { genre: { filterable: true } } },
		},
		response: { name: 'docs', record_count: 0 },
	},
	{
		name: 'namespaces.describe',
		method: 'GET',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/namespaces/docs%20space',
		input: { host: 'docs-index.svc.pinecone.io', namespace: 'docs space' },
		response: { name: 'docs space', record_count: 3 },
	},
	{
		name: 'namespaces.delete',
		method: 'DELETE',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/namespaces/docs',
		input: { host: 'docs-index.svc.pinecone.io', namespace: 'docs' },
		response: {},
	},
	{
		name: 'bulkImports.list',
		method: 'GET',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/bulk/imports?limit=10',
		input: { host: 'docs-index.svc.pinecone.io', limit: 10 },
		response: { data: [] },
	},
	{
		name: 'bulkImports.start',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/bulk/imports',
		input: { host: 'docs-index.svc.pinecone.io', uri: 's3://bucket/vectors/' },
		expectedBody: { uri: 's3://bucket/vectors/' },
		response: { id: 'import-1' },
	},
	{
		name: 'bulkImports.describe',
		method: 'GET',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/bulk/imports/import-1',
		input: { host: 'docs-index.svc.pinecone.io', importId: 'import-1' },
		response: { id: 'import-1', status: 'InProgress' },
	},
	{
		name: 'bulkImports.cancel',
		method: 'DELETE',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/bulk/imports/import-1',
		input: { host: 'docs-index.svc.pinecone.io', importId: 'import-1' },
		response: {},
	},
	{
		name: 'records.upsert',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/records/namespaces/docs/upsert',
		input: {
			host: 'docs-index.svc.pinecone.io',
			namespace: 'docs',
			records: [{ _id: 'doc-1', chunk_text: 'Corsair OSS' }],
		},
		expectedBody: '{"_id":"doc-1","chunk_text":"Corsair OSS"}\n',
		response: {},
	},
	{
		name: 'records.search',
		method: 'POST',
		base: 'https://docs-index.svc.pinecone.io',
		path: '/records/namespaces/docs/search',
		input: {
			host: 'docs-index.svc.pinecone.io',
			namespace: 'docs',
			query: { top_k: 3, inputs: { text: 'open source' } },
		},
		expectedBody: {
			query: { top_k: 3, inputs: { text: 'open source' } },
		},
		response: { result: { hits: [] } },
	},
	{
		name: 'assistants.list',
		method: 'GET',
		base: 'https://api.pinecone.io/assistant',
		path: '/assistants?limit=10',
		input: { limit: 10 },
		response: { assistants: [] },
	},
	{
		name: 'assistants.create',
		method: 'POST',
		base: 'https://api.pinecone.io/assistant',
		path: '/assistants',
		input: { name: 'docs-assistant', region: 'us' },
		expectedBody: { name: 'docs-assistant', region: 'us' },
		response: { name: 'docs-assistant', status: 'Initializing' },
	},
	{
		name: 'assistants.get',
		method: 'GET',
		base: 'https://api.pinecone.io/assistant',
		path: '/assistants/docs-assistant',
		input: { assistantName: 'docs-assistant' },
		response: {
			name: 'docs-assistant',
			status: 'Ready',
			host: 'assistant-data.pinecone.io',
		},
	},
	{
		name: 'assistants.update',
		method: 'PATCH',
		base: 'https://api.pinecone.io/assistant',
		path: '/assistants/docs-assistant',
		input: { assistantName: 'docs-assistant', instructions: 'Cite sources.' },
		expectedBody: { instructions: 'Cite sources.' },
		response: { name: 'docs-assistant', status: 'Ready' },
	},
	{
		name: 'assistants.delete',
		method: 'DELETE',
		base: 'https://api.pinecone.io/assistant',
		path: '/assistants/docs-assistant',
		input: { assistantName: 'docs-assistant' },
		response: {},
	},
	{
		name: 'assistantFiles.list',
		method: 'GET',
		base: 'https://assistant-data.pinecone.io',
		path: '/files/docs-assistant?limit=10',
		input: {
			host: 'assistant-data.pinecone.io',
			assistantName: 'docs-assistant',
			limit: 10,
		},
		response: { files: [] },
	},
	{
		name: 'assistantFiles.upload',
		method: 'POST',
		base: 'https://assistant-data.pinecone.io',
		path: '/files/docs-assistant?multimodal=false',
		input: {
			host: 'assistant-data.pinecone.io',
			assistantName: 'docs-assistant',
			fileName: 'notes.txt',
			fileBase64: 'SGVsbG8=',
			contentType: 'text/plain',
			multimodal: false,
		},
		expectedFile: { name: 'notes.txt', type: 'text/plain', text: 'Hello' },
		response: {
			id: 'op-1',
			operation_type: 'upload_file',
			status: 'Processing',
			created_on: '2026-08-27T12:00:00Z',
		},
	},
	{
		name: 'assistantFiles.describe',
		method: 'GET',
		base: 'https://assistant-data.pinecone.io',
		path: '/files/docs-assistant/file-1?include_url=true',
		input: {
			host: 'assistant-data.pinecone.io',
			assistantName: 'docs-assistant',
			fileId: 'file-1',
			includeUrl: true,
		},
		response: { id: 'file-1', name: 'notes.txt', status: 'Available' },
	},
	{
		name: 'assistantFiles.delete',
		method: 'DELETE',
		base: 'https://assistant-data.pinecone.io',
		path: '/files/docs-assistant/file-1',
		input: {
			host: 'assistant-data.pinecone.io',
			assistantName: 'docs-assistant',
			fileId: 'file-1',
		},
		response: {
			id: 'op-2',
			operation_type: 'delete_file',
			status: 'Processing',
			created_on: '2026-08-27T12:00:00Z',
		},
	},
	{
		name: 'assistantChat.chat',
		method: 'POST',
		base: 'https://assistant-data.pinecone.io',
		path: '/chat/docs-assistant',
		input: {
			host: 'assistant-data.pinecone.io',
			assistantName: 'docs-assistant',
			messages: [{ role: 'user', content: 'Summarize.' }],
		},
		expectedBody: {
			messages: [{ role: 'user', content: 'Summarize.' }],
			stream: false,
		},
		response: {
			id: 'chat-1',
			message: { role: 'assistant', content: 'Summary' },
		},
	},
	{
		name: 'assistantChat.completion',
		method: 'POST',
		base: 'https://assistant-data.pinecone.io',
		path: '/chat/docs-assistant/chat/completions',
		input: {
			host: 'assistant-data.pinecone.io',
			assistantName: 'docs-assistant',
			messages: [{ role: 'user', content: 'Summarize.' }],
		},
		expectedBody: {
			messages: [{ role: 'user', content: 'Summarize.' }],
			stream: false,
		},
		response: { id: 'chat-2', choices: [] },
	},
	{
		name: 'assistantChat.context',
		method: 'POST',
		base: 'https://assistant-data.pinecone.io',
		path: '/chat/docs-assistant/context',
		input: {
			host: 'assistant-data.pinecone.io',
			assistantName: 'docs-assistant',
			query: 'open source',
			top_k: 3,
		},
		expectedBody: { query: 'open source', top_k: 3 },
		response: { snippets: [], usage: {} },
	},
] as const;

describe.each(cases)('$name', (testCase) => {
	it('matches the official 2026-04 request contract', async () => {
		const { name, method, path, input, response } = testCase;
		const base = 'base' in testCase ? testCase.base : 'https://api.pinecone.io';
		const harness = installFetchHarness();
		harness.queue({ body: response });
		const [group, operationName] = name.split('.');

		try {
			const result = await endpoint(group ?? '', operationName ?? '')(
				{
					key: 'pcsk_test',
					$getAccountId: async () => 'account_test',
					database: undefined,
				} as PineconeContext,
				input,
			);
			const request = harness.requestAt(0);

			expect(request.method).toBe(method);
			expect(request.url).toBe(`${base}${path}`);
			expect(request.headers['api-key']).toBe('pcsk_test');
			expect(request.headers['x-pinecone-api-version']).toBe('2026-04');
			if ('expectedBody' in testCase) {
				expect(request.body).toEqual(testCase.expectedBody);
			}
			if ('expectedFile' in testCase) {
				expect(request.body).toBeInstanceOf(FormData);
				const file = (request.body as FormData).get('file');
				expect(file).toBeInstanceOf(File);
				expect((file as File).name).toBe(testCase.expectedFile.name);
				expect((file as File).type).toBe(testCase.expectedFile.type);
				expect(await (file as File).text()).toBe(testCase.expectedFile.text);
			}
			expect(result).toEqual(
				'expectedResult' in testCase ? testCase.expectedResult : response,
			);
		} finally {
			harness.restore();
		}
	});
});

describe('shared endpoint execution', () => {
	it('rejects invalid input before making a network request', async () => {
		const harness = installFetchHarness();

		try {
			await expect(
				endpoint('indexes', 'describe')(
					{
						key: 'pcsk_test',
						$getAccountId: async () => 'account_test',
						database: undefined,
					} as PineconeContext,
					{ indexName: '   ' },
				),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		} finally {
			harness.restore();
		}
	});

	it('stores only a non-sensitive completion event payload', async () => {
		const harness = installFetchHarness();
		harness.queue({ body: { indexes: [] } });
		let storedValues: Record<string, unknown> | undefined;
		const database = {
			db: {
				insertInto: () => ({
					values: (values: Record<string, unknown>) => {
						storedValues = values;
						return { execute: async () => undefined };
					},
				}),
			},
		};

		try {
			await endpoint('indexes', 'list')(
				{
					key: 'pcsk_test',
					$getAccountId: async () => 'account_test',
					database,
				} as unknown as PineconeContext,
				{},
			);
			expect(storedValues?.payload).toEqual({});
			expect(storedValues?.event_type).toBe('pinecone.listIndexes');
		} finally {
			harness.restore();
		}
	});

	it('rejects query vectors that omit both id and vector', async () => {
		const harness = installFetchHarness();

		try {
			await expect(
				endpoint('vectors', 'query')(
					{
						key: 'pcsk_test',
						$getAccountId: async () => 'account_test',
						database: undefined,
					} as PineconeContext,
					{ host: 'docs-index.svc.pinecone.io', topK: 3 },
				),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		} finally {
			harness.restore();
		}
	});

	it('rejects sparse vectors with mismatched array lengths', async () => {
		const harness = installFetchHarness();

		try {
			await expect(
				endpoint('vectors', 'query')(
					{
						key: 'pcsk_test',
						$getAccountId: async () => 'account_test',
						database: undefined,
					} as PineconeContext,
					{
						host: 'docs-index.svc.pinecone.io',
						topK: 3,
						vector: [0.1],
						sparseVector: { indices: [1, 2], values: [0.1] },
					},
				),
			).rejects.toThrow();
			expect(harness.requests).toHaveLength(0);
		} finally {
			harness.restore();
		}
	});

	it('rejects unexpected data in an empty provider response', async () => {
		const harness = installFetchHarness();
		harness.queue({ body: { unexpected: true } });

		try {
			await expect(
				endpoint('indexes', 'delete')(
					{
						key: 'pcsk_test',
						$getAccountId: async () => 'account_test',
						database: undefined,
					} as PineconeContext,
					{ indexName: 'docs-index' },
				),
			).rejects.toThrow('did not match the documented schema');
		} finally {
			harness.restore();
		}
	});
});
