import {
	activityCreate,
	activityDelete,
	activityUpdate,
} from './activity';
import { athleteUpdate } from './athlete';

export const StravaWebhooks = {
	activityCreate,
	activityUpdate,
	activityDelete,
	athleteUpdate,
};

export * from './types';
