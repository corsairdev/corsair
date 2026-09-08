import { ApiError } from 'corsair/http';
import type { PineconeContext } from './index';
import { pinecone } from './index';

const LIVE_KEY = process.env.PINECONE_API_KEY?.trim();
const describeIfKey = LIVE_KEY ? describe : describe.skip;

function ctx(key: string): PineconeContext {
	return {
		key,
		$getAccountId: async () => 'pinecone-live',
		database: undefined,
	} as PineconeContext;
}

describe('Pinecone live auth', () => {
	it('rejects an invalid API key on GET /indexes', async () => {
		const plugin = pinecone({ key: 'pcsk_invalid' });
		const error = await plugin.endpoints?.indexes
			.list(ctx('pcsk_invalid'), {})
			.catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
	});
});

describeIfKey('Pinecone live 2026-04 API', () => {
	const plugin = pinecone({ key: LIVE_KEY });
	const endpoints = plugin.endpoints;
	const live = ctx(LIVE_KEY as string);

	it('lists indexes, collections, backups, restore jobs, models, and assistants', async () => {
		if (!endpoints) throw new Error('endpoints missing');
		const indexes = await endpoints.indexes.list(live, {});
		expect(Array.isArray(indexes.indexes)).toBe(true);

		const collections = await endpoints.collections.list(live, {});
		expect(Array.isArray(collections.collections)).toBe(true);

		const backups = await endpoints.backups.listForProject(live, { limit: 10 });
		expect(Array.isArray(backups.data)).toBe(true);

		const restoreJobs = await endpoints.restoreJobs.list(live, { limit: 10 });
		expect(Array.isArray(restoreJobs.data)).toBe(true);

		const models = await endpoints.inference.listModels(live, {
			type: 'embed',
		});
		expect(models.models.length).toBeGreaterThan(0);

		const model = await endpoints.inference.getModel(live, {
			modelName: 'llama-text-embed-v2',
		});
		expect(model.model).toBe('llama-text-embed-v2');

		const assistants = await endpoints.assistants.list(live, {});
		expect(Array.isArray(assistants.assistants)).toBe(true);
	});

	it('embeds and reranks through the official inference surface', async () => {
		if (!endpoints) throw new Error('endpoints missing');
		const embeddings = await endpoints.inference.embed(live, {
			model: 'llama-text-embed-v2',
			inputs: [{ text: 'corsair pinecone live check' }],
			parameters: { input_type: 'query', truncate: 'END' },
		});
		expect(embeddings.data.length).toBe(1);

		const reranked = await endpoints.inference.rerank(live, {
			model: 'bge-reranker-v2-m3',
			query: 'The tech company Apple is known for its innovative products.',
			documents: [
				{ id: 'vec1', text: 'Apple is a popular fruit.' },
				{
					id: 'vec2',
					text: 'Apple Inc. has revolutionized the tech industry.',
				},
			],
			top_n: 2,
			return_documents: true,
			parameters: { truncate: 'END' },
		});
		expect(reranked.data.length).toBeGreaterThan(0);
	});

	it('creates a disposable index, upserts, queries, and deletes', async () => {
		if (!endpoints) throw new Error('endpoints missing');
		const embeddings = await endpoints.inference.embed(live, {
			model: 'llama-text-embed-v2',
			inputs: [{ text: 'Pinecone stores vector embeddings.' }],
			parameters: { input_type: 'passage', truncate: 'END' },
		});
		const values = (embeddings.data[0] as { values?: number[] }).values;
		if (!values?.length) throw new Error('embed returned no values');

		const leftover = await endpoints.indexes.list(live, {});
		for (const index of leftover.indexes ?? []) {
			if (index.name.startsWith('corsair-live-')) {
				await endpoints.indexes.delete(live, { indexName: index.name });
			}
		}

		const indexName = `corsair-live-${Date.now().toString(36)}`;
		let created = true;
		try {
			await endpoints.indexes.create(live, {
				name: indexName,
				dimension: values.length,
				metric: 'cosine',
				spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
				deletion_protection: 'disabled',
			});
			created = true;

			let host: string | undefined;
			for (let attempt = 0; attempt < 24; attempt += 1) {
				const index = await endpoints.indexes.describe(live, { indexName });
				if (index.status?.ready && index.host) {
					host = index.host;
					break;
				}
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
			if (!host) throw new Error('index did not become ready');

			const upsert = await endpoints.vectors.upsert(live, {
				host,
				namespace: 'live',
				vectors: [{ id: 'doc-1', values, metadata: { text: 'embeddings' } }],
			});
			expect(upsert.upsertedCount).toBe(1);

			const stats = await endpoints.vectors.describeIndexStats(live, {
				host,
			});
			expect(stats.dimension).toBe(values.length);

			let fetchedId: string | undefined;
			for (let attempt = 0; attempt < 12; attempt += 1) {
				const fetched = await endpoints.vectors.fetch(live, {
					host,
					ids: ['doc-1'],
					namespace: 'live',
				});
				fetchedId = fetched.vectors['doc-1']?.id;
				if (fetchedId) break;
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}
			expect(fetchedId).toBe('doc-1');
		} finally {
			if (created) {
				try {
					await endpoints.indexes.delete(live, { indexName });
				} catch (error) {
					if (!(error instanceof ApiError && error.status === 404)) {
						throw error;
					}
				}
			}
		}
	}, 180_000);
});
