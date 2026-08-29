import { z } from 'zod';
import { B, N, NumId, S, StrArray } from './primitives';

/**
 * Field names match official JSON keys.
 * https://api.collegefootballdata.com/api-docs.json (OpenAPI 3.0.0, v5.24.0)
 * Live extras confirmed 2026-08-18 against GET /teams, /conferences, /venues, /coaches.
 *
 * Only slow-changing reference data is mirrored: teams, conferences, venues,
 * coaches. Games, stats, ratings, recruiting, and similar history queries
 * are not persisted.
 */

const venueFields = {
	name: S,
	city: S,
	state: S,
	zip: S,
	countryCode: S,
	timezone: S,
	latitude: N,
	longitude: N,
	elevation: S,
	capacity: N,
	constructionYear: N,
	grass: B,
	dome: B,
};

/**
 * Team.location — OpenAPI `Venue` nested on `Team`.
 * Spec marks `id` nullable here; persisted venues below still require it.
 */
export const CollegeFootballDataTeamLocation = z
	.object({
		id: N,
		...venueFields,
	})
	.loose();
export type CollegeFootballDataTeamLocation = z.infer<
	typeof CollegeFootballDataTeamLocation
>;

/** GET /venues — OpenAPI `Venue`. */
export const CollegeFootballDataVenueEntity = z
	.object({
		id: NumId,
		...venueFields,
	})
	.loose();
export type CollegeFootballDataVenueEntity = z.infer<
	typeof CollegeFootballDataVenueEntity
>;

/** GET /teams — OpenAPI `Team`. */
export const CollegeFootballDataTeamEntity = z
	.object({
		id: NumId,
		school: z.string(),
		mascot: S,
		abbreviation: S,
		alternateNames: StrArray,
		conference: S,
		division: S,
		classification: S,
		color: S,
		alternateColor: S,
		logos: StrArray,
		twitter: S,
		location: CollegeFootballDataTeamLocation.nullable().optional(),
	})
	.loose();
export type CollegeFootballDataTeamEntity = z.infer<
	typeof CollegeFootballDataTeamEntity
>;

/** GET /conferences — OpenAPI `Conference`. */
export const CollegeFootballDataConferenceEntity = z
	.object({
		id: NumId,
		name: z.string(),
		shortName: S,
		abbreviation: S,
		classification: S,
		memberCount: N,
	})
	.loose();
export type CollegeFootballDataConferenceEntity = z.infer<
	typeof CollegeFootballDataConferenceEntity
>;

/** Coach.seasons[] — OpenAPI `CoachSeason`. */
export const CollegeFootballDataCoachSeason = z
	.object({
		teamId: N,
		school: S,
		conference: S,
		year: N,
		games: N,
		wins: N,
		losses: N,
		ties: N,
		winPercentage: N,
		preseasonRank: N,
		postseasonRank: N,
		srs: N,
		spOverall: N,
		spOffense: N,
		spDefense: N,
	})
	.loose();
export type CollegeFootballDataCoachSeason = z.infer<
	typeof CollegeFootballDataCoachSeason
>;

/** GET /coaches — OpenAPI `Coach`. hireDate is deprecated on the spec. */
export const CollegeFootballDataCoachEntity = z
	.object({
		id: NumId,
		firstName: S,
		lastName: S,
		hireDate: S,
		seasons: z.array(CollegeFootballDataCoachSeason).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataCoachEntity = z.infer<
	typeof CollegeFootballDataCoachEntity
>;
