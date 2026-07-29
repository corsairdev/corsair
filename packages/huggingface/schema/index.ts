import { HuggingFaceRepoRef } from './database';

export const HuggingFaceSchema = {
	version: '1.0.0',
	entities: { HuggingFaceRepoRef },
} as const;

export { HuggingFaceRepoRef };
