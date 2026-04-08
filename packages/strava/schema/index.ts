import {
	StravaActivity,
	StravaAthlete,
	StravaClub,
	StravaGear,
	StravaLap,
	StravaRoute,
	StravaSegment,
	StravaSegmentEffort,
	StravaUpload,
} from './database';

export const StravaSchema = {
	version: '1.0.0',
	entities: {
		activities: StravaActivity,
		athletes: StravaAthlete,
		segments: StravaSegment,
		segmentEfforts: StravaSegmentEffort,
		routes: StravaRoute,
		clubs: StravaClub,
		laps: StravaLap,
		gears: StravaGear,
		uploads: StravaUpload,
	},
} as const;
