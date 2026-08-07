import {
	ApifyActor,
	ApifyActorBuild,
	ApifyActorRun,
	ApifyActorTask,
	ApifyDataset,
	ApifyKeyValueStore,
	ApifyRequestQueue,
	ApifySchedule,
	ApifyUser,
	ApifyWebhook,
} from './database';

export const ApifySchema = {
	version: '2.0.0',
	entities: {
		actors: ApifyActor,
		actorBuilds: ApifyActorBuild,
		actorRuns: ApifyActorRun,
		actorTasks: ApifyActorTask,
		datasets: ApifyDataset,
		keyValueStores: ApifyKeyValueStore,
		requestQueues: ApifyRequestQueue,
		schedules: ApifySchedule,
		webhooks: ApifyWebhook,
		users: ApifyUser,
	},
} as const;
