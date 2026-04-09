import { inMeeting, meetingDeleted, newMeeting } from './meetings';
import { transcriptionComplete, transcriptProcessing } from './transcription';

export const TranscriptionWebhooks = {
	transcriptionComplete,
	transcriptProcessing,
};
export const MeetingWebhooks = { newMeeting, inMeeting, meetingDeleted };

export * from './types';
