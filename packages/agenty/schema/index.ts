import { AgentyAgent, AgentyJob, AgentyList } from './database';

export const AgentySchema = {
	version: '1.0.0',
	entities: {
		agents: AgentyAgent,
		jobs: AgentyJob,
		lists: AgentyList,
	},
} as const;
