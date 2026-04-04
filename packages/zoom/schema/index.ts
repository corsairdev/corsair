import {
	ZoomMeeting,
	ZoomParticipant,
	ZoomRecording,
	ZoomWebinar,
	ZoomDevice,
	ZoomArchiveFile,
} from './database';

export const ZoomSchema = {
	version: '1.0.0',
	entities: {
		meetings: ZoomMeeting,
		recordings: ZoomRecording,
		webinars: ZoomWebinar,
		participants: ZoomParticipant,
		devices: ZoomDevice,
		archiveFiles: ZoomArchiveFile,
	},
} as const;
