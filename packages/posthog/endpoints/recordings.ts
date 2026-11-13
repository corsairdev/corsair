import { defineApiEndpoint, ENVIRONMENT, PROJECT, pathId } from './api';

// Recordings live under the environment path; for most teams the environment
// id is the project id.

export const sessionRecordingsList = defineApiEndpoint<'sessionRecordingsList'>(
	'sessionRecordingsList',
	'posthog.sessionRecordings.list',
	(input) => ({
		path: `${ENVIRONMENT}/session_recordings/`,
		query: input,
		log: input,
	}),
);

export const sessionRecordingsGet = defineApiEndpoint<'sessionRecordingsGet'>(
	'sessionRecordingsGet',
	'posthog.sessionRecordings.get',
	(input) => ({
		path: `${ENVIRONMENT}/session_recordings/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

export const sessionRecordingPlaylistsList =
	defineApiEndpoint<'sessionRecordingPlaylistsList'>(
		'sessionRecordingPlaylistsList',
		'posthog.sessionRecordingPlaylists.list',
		(input) => ({
			path: `${PROJECT}/session_recording_playlists/`,
			query: input,
			log: input,
		}),
	);
