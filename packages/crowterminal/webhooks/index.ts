import {
	dataIngested,
	postingCompleted,
	postingFailed,
	skillUpdated,
	skillVersionCreated,
	validationBlocked,
} from './events';

export const CrowterminalWebhooks = {
	skillUpdated,
	skillVersionCreated,
	dataIngested,
	validationBlocked,
	postingCompleted,
	postingFailed,
};

export * from './types';
