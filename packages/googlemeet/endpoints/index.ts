import { create, get as spacesGet, patch, endActiveConference } from './spaces';
import { get as conferenceRecordsGet, list as conferenceRecordsList } from './conferenceRecords';
import { get as participantsGet, list as participantsList, getParticipantSession, listParticipantSessions } from './participants';
import { get as recordingsGet, list as recordingsList } from './recordings';
import { get as transcriptsGet, list as transcriptsList, getEntry, listEntries } from './transcripts';
import { get as smartNotesGet, list as smartNotesList } from './smartNotes';

export const SpacesEndpoints = {
	create,
	get: spacesGet,
	patch,
	endActiveConference,
};

export const ConferenceRecordsEndpoints = {
	get: conferenceRecordsGet,
	list: conferenceRecordsList,
};

export const ParticipantsEndpoints = {
	get: participantsGet,
	list: participantsList,
};

export const ParticipantSessionsEndpoints = {
	get: getParticipantSession,
	list: listParticipantSessions,
};

export const RecordingsEndpoints = {
	get: recordingsGet,
	list: recordingsList,
};

export const TranscriptsEndpoints = {
	get: transcriptsGet,
	list: transcriptsList,
};

export const TranscriptEntriesEndpoints = {
	get: getEntry,
	list: listEntries,
};

export const SmartNotesEndpoints = {
	get: smartNotesGet,
	list: smartNotesList,
};

export * from './types';
