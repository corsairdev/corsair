import {
	ApifyActorBuild,
	ApifyActorTask,
	ApifyDataset,
	ApifyKeyValueStore,
	ApifyMcpActor,
	ApifyMcpActorOutput,
	ApifyMcpActorRun,
	ApifyRequestQueue,
	ApifySchedule,
	ApifyUser,
	ApifyWebhook,
} from './database';

export const ApifyMcpSchema = {
	version: '1.0.0',
	entities: {
		actors: ApifyMcpActor,
		actorRuns: ApifyMcpActorRun,
		actorOutputs: ApifyMcpActorOutput,
		actorBuilds: ApifyActorBuild,
		actorTasks: ApifyActorTask,
		datasets: ApifyDataset,
		keyValueStores: ApifyKeyValueStore,
		requestQueues: ApifyRequestQueue,
		schedules: ApifySchedule,
		webhooks: ApifyWebhook,
		users: ApifyUser,
	},
} as const;
