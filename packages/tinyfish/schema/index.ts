import { TinyFishAgentRun } from './database';

export const TinyFishSchema = {
	version: '1.0.0',
	entities: {
		agentRuns: TinyFishAgentRun,
	},
	// Const assertion keeps the schema map literal. A wider index signature
	// would not be stricter.
} as const;
