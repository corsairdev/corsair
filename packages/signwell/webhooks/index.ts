import * as Events from './events';

export const DocumentWebhooks = {
	created: Events.documentCreated,
	sent: Events.documentSent,
	viewed: Events.documentViewed,
	inProgress: Events.documentInProgress,
	recipientsUpdated: Events.documentRecipientsUpdated,
	signed: Events.documentSigned,
	completed: Events.documentCompleted,
	expired: Events.documentExpired,
	declined: Events.documentDeclined,
	canceled: Events.documentCanceled,
};

export * from './events';
export * from './secret';
