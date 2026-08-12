import {
	ApifyMcpActor,
	ApifyMcpActorOutput,
	ApifyMcpActorRun,
} from './database';

export const ApifyMcpSchema = {
	version: '1.0.0',
	entities: {
		actors: ApifyMcpActor,
		actorRuns: ApifyMcpActorRun,
		actorOutputs: ApifyMcpActorOutput,
	},
} as const;
