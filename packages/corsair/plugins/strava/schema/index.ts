import {
	StravaActivity,
	StravaAthlete,
	StravaClub,
	StravaLap,
	StravaRoute,
	StravaSegment,
	StravaSegmentEffort,
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
	},
} as const;
