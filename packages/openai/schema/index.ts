import { OpenaiAssistant, OpenaiThread, OpenaiVectorStore } from './database';

export const OpenaiSchema = {
	version: '1.0.0',
	entities: {
		assistants: OpenaiAssistant,
		threads: OpenaiThread,
		vectorStores: OpenaiVectorStore,
	},
} as const;
