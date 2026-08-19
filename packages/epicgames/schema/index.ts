import { EpicGamesIsland } from './database';

export const EpicGamesSchema = {
	version: '1.0.0',
	entities: {
		islands: EpicGamesIsland,
	},
} as const;

export * from './database';
