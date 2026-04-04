import { transcriptionComplete, transcriptProcessing } from './transcription';
import { newMeeting, inMeeting, meetingDeleted } from './meetings';

export const TranscriptionWebhooks = { transcriptionComplete, transcriptProcessing };
export const MeetingWebhooks = { newMeeting, inMeeting, meetingDeleted };

export * from './types';
