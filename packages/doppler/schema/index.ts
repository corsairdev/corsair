import {
	DopplerConfigEntity,
	DopplerEnvironmentEntity,
	DopplerProjectEntity,
	DopplerWebhookEntity,
	DopplerWorkplaceEntity,
} from './database';

export const DopplerSchema = {
	version: '1.0.0',
	entities: {
		projects: DopplerProjectEntity,
		environments: DopplerEnvironmentEntity,
		configs: DopplerConfigEntity,
		webhooks: DopplerWebhookEntity,
		workplace: DopplerWorkplaceEntity,
	},
} as const;

export * from './database';
export * from './primitives';
