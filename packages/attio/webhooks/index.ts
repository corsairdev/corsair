import {
	created as recordCreated,
	deleted as recordDeleted,
	updated as recordUpdated,
} from './records';

export const RecordWebhooks = {
	recordCreated,
	recordUpdated,
	recordDeleted,
};

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';
