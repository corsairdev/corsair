import {
	HabiticaChallengeEntity,
	HabiticaGroupEntity,
	HabiticaTagEntity,
	HabiticaTaskEntity,
	HabiticaWebhookEntity,
} from './database';

export const HabiticaSchema = {
	version: '1.0.0',
	entities: {
		tasks: HabiticaTaskEntity,
		tags: HabiticaTagEntity,
		challenges: HabiticaChallengeEntity,
		groups: HabiticaGroupEntity,
		webhooks: HabiticaWebhookEntity,
	},
} as const;

export * from './database';
