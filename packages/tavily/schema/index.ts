import { TavilyRun } from './database';

export const TavilySchema = {
	version: '1.0.0',
	entities: {
		runs: TavilyRun,
	},
} as const;

export type { TavilyRun } from './database';
export { TAVILY_RUN_ENDPOINTS } from './database';
