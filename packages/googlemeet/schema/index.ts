import {
	GoogleMeetConferenceRecord,
	GoogleMeetParticipant,
	GoogleMeetRecording,
	GoogleMeetSmartNote,
	GoogleMeetSpace,
	GoogleMeetTranscript,
} from './database';

export const GoogleMeetSchema = {
	version: '1.0.0',
	entities: {
		spaces: GoogleMeetSpace,
		conferenceRecords: GoogleMeetConferenceRecord,
		participants: GoogleMeetParticipant,
		recordings: GoogleMeetRecording,
		transcripts: GoogleMeetTranscript,
		smartNotes: GoogleMeetSmartNote,
	},
} as const;
