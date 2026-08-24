import {
	CollegeFootballDataCoachEntity,
	CollegeFootballDataConferenceEntity,
	CollegeFootballDataTeamEntity,
	CollegeFootballDataVenueEntity,
} from './database';

export const CollegeFootballDataSchema = {
	version: '1.0.0',
	entities: {
		teams: CollegeFootballDataTeamEntity,
		conferences: CollegeFootballDataConferenceEntity,
		venues: CollegeFootballDataVenueEntity,
		coaches: CollegeFootballDataCoachEntity,
	},
} as const;

export * from './database';
export * from './primitives';
