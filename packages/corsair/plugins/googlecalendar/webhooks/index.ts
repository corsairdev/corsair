import {
	onEventCreated,
	onEventUpdated,
	onEventDeleted,
	onEventStarted,
	onEventEnded,
} from './events';

export const EventWebhooks = {
	onEventCreated,
	onEventUpdated,
	onEventDeleted,
	onEventStarted,
	onEventEnded,
};

export * from './types';
