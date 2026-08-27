import {
	VestaboardMessageEntity,
	VestaboardSubscriptionEntity,
	VestaboardViewerEntity,
} from './database';

export const VestaboardSchema = {
	version: '1.0.0',
	entities: {
		messages: VestaboardMessageEntity,
		subscriptions: VestaboardSubscriptionEntity,
		viewer: VestaboardViewerEntity,
	},
} as const;

export * from './database';
