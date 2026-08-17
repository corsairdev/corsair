import { z } from 'zod';

/**
 * Locally persisted College Football Data entities.
 *
 * Only slow-changing structural reference data is mirrored: teams,
 * conferences, venues and coaches. Everything else this API returns -
 * games, drives, plays, stats, ratings, rankings, recruiting, betting
 * lines, draft picks, PPA/metrics - is either high-volume, transactional
 * (tied to a specific game/week), or only meaningful scoped to a season, so
 * per the playbook it is deliberately NOT stored; it is always wanted as a
 * live view. This provider is a stats API, so almost its entire surface is
 * a query against history rather than a record with a stable identity
 * worth caching - the opposite shape from a typical CRUD SaaS integration.
 *
 * Field lists come from live responses captured 2026-08-17 against a real
 * account (see `endpoints/types.ts` for per-field provenance).
 */

const S = z.string().nullable().optional();
const B = z.boolean().nullable().optional();
const N = z.number().nullable().optional();

const CfbdLocationEntity = z
	.object({
		id: N,
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
	})
	.loose();

export const CollegeFootballDataTeamEntity = z
	.object({
		id: z.number(),
		school: z.string(),
		mascot: S,
		abbreviation: S,
		alternateNames: z.array(z.string()).nullable().optional(),
		conference: S,
		division: S,
		classification: S,
		color: S,
		alternateColor: S,
		logos: z.array(z.string()).nullable().optional(),
		twitter: S,
		location: CfbdLocationEntity.nullable().optional(),
	})
	.loose();
export type CollegeFootballDataTeamEntity = z.infer<
	typeof CollegeFootballDataTeamEntity
>;

export const CollegeFootballDataConferenceEntity = z
	.object({
		id: z.number(),
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

export const CollegeFootballDataVenueEntity = z
	.object({
		id: z.number(),
		name: z.string(),
		capacity: N,
		grass: B,
		dome: B,
		city: S,
		state: S,
		zip: S,
		countryCode: S,
		timezone: S,
		latitude: N,
		longitude: N,
		elevation: S,
		constructionYear: N,
	})
	.loose();
export type CollegeFootballDataVenueEntity = z.infer<
	typeof CollegeFootballDataVenueEntity
>;

/** `id` is present, unique and stable per record, so it is used as the entity key. */
export const CollegeFootballDataCoachEntity = z
	.object({
		id: z.number(),
		firstName: S,
		lastName: S,
		hireDate: S,
	})
	.loose();
export type CollegeFootballDataCoachEntity = z.infer<
	typeof CollegeFootballDataCoachEntity
>;
