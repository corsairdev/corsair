import {
	created as meetingCreated,
	cancelled as meetingCancelled,
	started as meetingStarted,
	ended as meetingEnded,
	participantJoined,
	participantLeft,
} from './meetings';
import { completed as recordingCompleted } from './recordings';
import { started as webinarStarted } from './webinars';

export const MeetingWebhooks = {
	created: meetingCreated,
	cancelled: meetingCancelled,
	started: meetingStarted,
	ended: meetingEnded,
	participantJoined,
	participantLeft,
};

export const RecordingWebhooks = {
	completed: recordingCompleted,
};

export const WebinarWebhooks = {
	started: webinarStarted,
};

export * from './types';
