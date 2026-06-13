import {
	GoogleMeetSpace,
	GoogleMeetConferenceRecord,
	GoogleMeetParticipant,
	GoogleMeetRecording,
	GoogleMeetTranscript,
	GoogleMeetSmartNote,
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
