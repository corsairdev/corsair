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
		response: { name: 'docs-index', deletion_protection: 'enabled' },
	},
	{
		name: 'indexes.delete',
		method: 'DELETE',
		path: '/indexes/docs-index',
		input: { indexName: 'docs-index' },
		response: {},
	},
	{
		name: 'backups.create',
		method: 'POST',
		path: '/indexes/docs-index/backups',
		input: { indexName: 'docs-index', name: 'nightly' },
		response: { backup_id: 'backup-1', name: 'nightly' },
	},
	{
		name: 'backups.listForIndex',
		method: 'GET',
		path: '/indexes/docs-index/backups?include_deleted=true&limit=10',
		input: { indexName: 'docs-index', includeDeleted: true, limit: 10 },
		response: { backups: [] },
	},
	{
		name: 'backups.listForProject',
		method: 'GET',
		path: '/backups?limit=10',
		input: { limit: 10 },
		response: { backups: [] },
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
		response: { restore_job_id: 'restore-1' },
	},
	{
		name: 'restoreJobs.list',
		method: 'GET',
		path: '/restore-jobs?limit=10',
		input: { limit: 10 },
		response: { restore_jobs: [] },
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
		response: { model: 'llama-text-embed-v2', data: [] },
	},
	{
		name: 'inference.rerank',
		method: 'POST',
		path: '/rerank',
		input: {
			model: 'bge-reranker-v2-m3',
			query: 'vector databases',
			documents: ['Pinecone stores vectors'],
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
] as const;

describe.each(cases)('$name', ({ name, method, path, input, response }) => {
	it('matches the official 2026-04 request contract', async () => {
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
			expect(request.url).toBe(`https://api.pinecone.io${path}`);
			expect(request.headers['api-key']).toBe('pcsk_test');
			expect(request.headers['x-pinecone-api-version']).toBe('2026-04');
			expect(result).toEqual(response);
		} finally {
			harness.restore();
		}
	});
});
