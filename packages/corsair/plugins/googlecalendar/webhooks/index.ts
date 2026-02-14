import {
	onEventCreated,
	onEventDeleted,
	onEventEnded,
	onEventStarted,
	onEventUpdated,
} from './events';

export const EventWebhooks = {
	onEventCreated,
	onEventUpdated,
	onEventDeleted,
	onEventStarted,
	onEventEnded,
};

export * from './types';
