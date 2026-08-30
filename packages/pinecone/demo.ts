import { ApiError } from 'corsair/http';
import type { PineconeContext, PineconeEndpointOutputs } from './index';
import { pinecone } from './index';

const EMBEDDING_MODEL = 'llama-text-embed-v2';
const RERANK_MODEL = 'bge-reranker-v2-m3';
const NAMESPACE = 'hackblox-demo';

const documents = [
	{
		id: 'corsair-auth',
		text: 'Corsair integrations keep provider credentials out of application code and expose typed endpoints.',
	},
	{
		id: 'pinecone-search',
		text: 'Pinecone stores vector embeddings and retrieves semantically related records with low latency.',
	},
	{
		id: 'safe-hosts',
		text: 'The Corsair Pinecone plugin validates dynamic data-plane hosts before forwarding an API key.',
	},
];

const queryText =
	'How does this integration protect credentials when it calls a Pinecone index?';

/** Pauses polling without blocking the process event loop. */
const sleep = (milliseconds: number) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

/** Extracts and validates dense vectors returned by the inference endpoint. */
function denseVectors(data: Array<Record<string, unknown>>): number[][] {
	return data.map((entry, index) => {
		const values = entry.values;
		if (
			!Array.isArray(values) ||
			values.length === 0 ||
			!values.every((value) => typeof value === 'number')
		) {
			throw new Error(`Embedding ${index} did not contain a dense vector`);
		}
		return values;
	});
}

/** Runs a disposable end-to-end Pinecone integration demonstration. */
async function main() {
	const apiKey = process.env.PINECONE_API_KEY?.trim();
	if (!apiKey) {
		throw new Error(
			'Set PINECONE_API_KEY in the environment before running the live demo.',
		);
	}

	const plugin = pinecone({ key: apiKey });
	const endpoints = plugin.endpoints;
	if (!endpoints) throw new Error('Pinecone endpoints were not registered');
	const ctx = {
		key: apiKey,
		$getAccountId: async () => 'pinecone-live-demo',
		database: undefined,
	} as PineconeContext;
	const indexName = `corsair-demo-${Date.now().toString(36)}`;
	let indexCreationAttempted = false;

	try {
		console.log('1/6 Generating passage embeddings through Corsair...');
		const passageResponse = await endpoints.inference.embed(ctx, {
			model: EMBEDDING_MODEL,
			inputs: documents.map(({ text }) => ({ text })),
			parameters: { input_type: 'passage', truncate: 'END' },
		});
		const passageVectors = denseVectors(passageResponse.data);
		const dimension = passageVectors[0]?.length;
		if (!dimension || passageVectors.length !== documents.length) {
			throw new Error('Pinecone returned an unexpected embedding batch');
		}

		console.log(`2/6 Creating disposable ${dimension}-dimension index...`);
		// The provider may create the index even if the response is lost, so any
		// attempted create must be paired with a best-effort delete.
		indexCreationAttempted = true;
		await endpoints.indexes.create(ctx, {
			name: indexName,
			dimension,
			metric: 'cosine',
			vector_type: 'dense',
			spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
			deletion_protection: 'disabled',
			tags: { purpose: 'corsair-hackblox-live-demo' },
		});
		let host: string | undefined;
		for (let attempt = 1; attempt <= 24; attempt += 1) {
			const index = await endpoints.indexes.describe(ctx, { indexName });
			host = index.host;
			if (index.status?.ready && host) break;
			if (attempt === 24) {
				throw new Error(
					'Disposable index did not become ready within two minutes',
				);
			}
			await sleep(5_000);
		}
		if (!host) throw new Error('Pinecone did not return the index host');

		console.log('3/6 Upserting vectors and metadata through Corsair...');
		const upsert = await endpoints.vectors.upsert(ctx, {
			host,
			namespace: NAMESPACE,
			vectors: documents.map((document, index) => ({
				id: document.id,
				values: passageVectors[index],
				metadata: { text: document.text },
			})),
		});

		console.log('4/6 Generating a query embedding...');
		const queryResponse = await endpoints.inference.embed(ctx, {
			model: EMBEDDING_MODEL,
			inputs: [{ text: queryText }],
			parameters: { input_type: 'query', truncate: 'END' },
		});
		const queryVector = denseVectors(queryResponse.data)[0];
		if (!queryVector) throw new Error('Pinecone did not return a query vector');

		console.log(
			'5/6 Querying the index and waiting for eventual consistency...',
		);
		let matches: PineconeEndpointOutputs['queryVectors']['matches'] = [];
		for (let attempt = 1; attempt <= 12; attempt += 1) {
			const result = await endpoints.vectors.query(ctx, {
				host,
				namespace: NAMESPACE,
				topK: 3,
				vector: queryVector,
				includeMetadata: true,
			});
			matches = result.matches;
			if (matches.length > 0) break;
			if (attempt < 12) await sleep(5_000);
		}
		if (matches.length === 0) {
			throw new Error('Upserted vectors were not queryable within one minute');
		}

		console.log('6/6 Reranking retrieved documents through Corsair...');
		const reranked = await endpoints.inference.rerank(ctx, {
			model: RERANK_MODEL,
			query: queryText,
			documents: matches.map((match) => ({
				id: match.id,
				text:
					typeof match.metadata?.text === 'string'
						? match.metadata.text
						: match.id,
			})),
			top_n: matches.length,
			return_documents: true,
			parameters: { truncate: 'END' },
		});

		console.log('\nLIVE DEMO PASSED');
		console.log(
			JSON.stringify(
				{
					index: indexName,
					dimension,
					upsertedCount: upsert.upsertedCount,
					queryMatches: matches.map(({ id, score }) => ({ id, score })),
					reranked: reranked.data.map(({ score, document }) => ({
						score,
						document,
					})),
				},
				null,
				2,
			),
		);
	} finally {
		if (indexCreationAttempted) {
			console.log(`Cleaning up disposable index ${indexName}...`);
			try {
				await endpoints.indexes.delete(ctx, { indexName });
				console.log('Cleanup requested successfully.');
			} catch (error) {
				if (error instanceof ApiError && error.status === 404) {
					console.log('Cleanup confirmed: disposable index does not exist.');
				} else {
					console.error(
						'Cleanup failed; delete the disposable index manually.',
						error instanceof Error ? error.message : 'Unknown cleanup error',
					);
					process.exitCode = 1;
				}
			}
		}
	}
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
