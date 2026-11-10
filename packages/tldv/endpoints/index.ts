import * as Folders from './folders';
import * as Meetings from './meetings';

export const MeetingsEndpoints = {
	list: Meetings.list,
	get: Meetings.get,
	transcript: Meetings.transcript,
	notes: Meetings.notes,
	import: Meetings.importMeeting,
};

export const FoldersEndpoints = {
	list: Folders.list,
};

export * from './types';
