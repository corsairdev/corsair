import * as triggers from './triggers';

export const TriggerWebhooks = {
	triggerMessage: triggers.triggerMessage,
	projectEvent: triggers.projectEvent,
};

export * from './types';
