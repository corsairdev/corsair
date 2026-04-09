import {
	ApifyActor,
	ApifyActorBuild,
	ApifyActorRun,
	ApifyActorTask,
	ApifyActorVersion,
	ApifyDataset,
	ApifyKeyValueStore,
	ApifyRequestQueue,
	ApifySchedule,
	ApifyUser,
	ApifyWebhook,
	ApifyWebhookDispatch,
} from './database';

export const ApifySchema = {
	version: '1.2.0',
	entities: {
		actors: ApifyActor,
		actorBuilds: ApifyActorBuild,
		actorRuns: ApifyActorRun,
		actorTasks: ApifyActorTask,
		actorVersions: ApifyActorVersion,
		datasets: ApifyDataset,
		keyValueStores: ApifyKeyValueStore,
		requestQueues: ApifyRequestQueue,
		schedules: ApifySchedule,
		webhooks: ApifyWebhook,
		webhookDispatches: ApifyWebhookDispatch,
		users: ApifyUser,
	},
} as const;
