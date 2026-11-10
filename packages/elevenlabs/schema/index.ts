import { elevenLabsEntities } from './database';

export const ElevenLabsSchema = {
	version: '1.0.0',
	entities: elevenLabsEntities,
} as const;
