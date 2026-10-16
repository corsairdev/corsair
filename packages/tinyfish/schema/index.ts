import { TinyFishAgentRun } from './database';

export const TinyFishSchema = {
	version: '1.0.0',
	entities: {
		agentRuns: TinyFishAgentRun,
	},
} as const;
