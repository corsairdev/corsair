import { VestaboardMessage, VestaboardSubscription } from './database';

export const VestaboardSchema = {
	version: '1.0.0',
	entities: {
		subscriptions: VestaboardSubscription,
		messages: VestaboardMessage,
	},
} as const;

export {
	VestaboardCharacters,
	VestaboardMessage,
	VestaboardSubscription,
} from './database';
