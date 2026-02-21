import { Memory } from 'mem0ai/oss';

export const memory = new Memory({
	version: 'v1.1',
	embedder: {
		provider: 'openai',
		config: {
			apiKey: process.env.OPENAI_API_KEY || '',
			model: 'text-embedding-3-small',
		},
	},
	vectorStore: {
		provider: 'pgvector',
		config: {
			collectionName: 'memories',
			dimension: 1536,
			dbname: process.env.PGVECTOR_DB || 'vectordb',
			user: process.env.PGVECTOR_USER || 'postgres',
			password: process.env.PGVECTOR_PASSWORD || 'postgres',
			host: process.env.PGVECTOR_HOST || 'localhost',
			port: parseInt(process.env.PGVECTOR_PORT || '5432'),
			embeddingModelDims: 1536,
			hnsw: true,
		},
	},
	llm: {
		provider: 'openai',
		config: {
			apiKey: process.env.OPENAI_API_KEY || '',
			model: 'gpt-4-turbo-preview',
		},
	},
	historyDbPath: 'memory.db',
});
