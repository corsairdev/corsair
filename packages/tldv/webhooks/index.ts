import * as Handlers from './handlers';

export const MeetingsWebhooks = {
	meetingReady: Handlers.meetingReady,
};

export const TranscriptsWebhooks = {
	transcriptReady: Handlers.transcriptReady,
};

export * from './types';
