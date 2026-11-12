import * as Events from './events';

/** HappyScribe meeting webhook handlers, one per event type. */
export const MeetingWebhooks = {
	recordingStarted: Events.recordingStarted,
	recordingCompleted: Events.recordingCompleted,
	transcriptReady: Events.transcriptReady,
	summaryReady: Events.summaryReady,
	failed: Events.failed,
	cancelled: Events.cancelled,
};

/** Deliveries whose event type this plugin has no dedicated handler for. */
export const OtherWebhooks = {
	other: Events.otherEvent,
};

export * from './secret';
export * from './tenant-matcher';
export * from './types';
