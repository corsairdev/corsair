import {
	OpenRouterGenerationEntity,
	OpenRouterModelEntity,
	OpenRouterProviderEntity,
} from './database';

export const OpenrouterSchema = {
	version: '1.0.0',
	entities: {
		models: OpenRouterModelEntity,
		providers: OpenRouterProviderEntity,
		generations: OpenRouterGenerationEntity,
	},
} as const;

export * from './database';
