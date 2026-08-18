import type {
	CollegeFootballDataCoachEntity,
	CollegeFootballDataConferenceEntity,
	CollegeFootballDataTeamEntity,
	CollegeFootballDataVenueEntity,
} from '../schema/database';
import type {
	CollegeFootballDataCoach,
	CollegeFootballDataConference,
	CollegeFootballDataTeam,
	CollegeFootballDataVenue,
} from './types';

/**
 * Minimal structural view of a Corsair entity store. Only the operation the
 * College Football Data endpoints need (this API has no deletes at all) is
 * declared, so the helpers below stay usable whatever else the concrete
 * store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/**
 * Caching is best-effort: a plugin call must not fail because the local
 * mirror could not be written. Failures are warned about and swallowed.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[COLLEGEFOOTBALLDATA] failed to cache ${what}:`, error);
	}
}

/** Mirrors a team into the local cache. */
export async function cacheTeam(
	store: EntityStore<CollegeFootballDataTeamEntity> | undefined,
	team: CollegeFootballDataTeam | undefined | null,
) {
	if (!store || team?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(team.id), {
				id: team.id,
				school: team.school,
				mascot: team.mascot,
				abbreviation: team.abbreviation,
				alternateNames: team.alternateNames,
				conference: team.conference,
				division: team.division,
				classification: team.classification,
				color: team.color,
				alternateColor: team.alternateColor,
				logos: team.logos,
				twitter: team.twitter,
				location: team.location,
			}),
		`team ${team.id}`,
	);
}

/** Mirrors a conference into the local cache. */
export async function cacheConference(
	store: EntityStore<CollegeFootballDataConferenceEntity> | undefined,
	conference: CollegeFootballDataConference | undefined | null,
) {
	if (!store || conference?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(conference.id), {
				id: conference.id,
				name: conference.name,
				shortName: conference.shortName,
				abbreviation: conference.abbreviation,
				classification: conference.classification,
				memberCount: conference.memberCount,
			}),
		`conference ${conference.id}`,
	);
}

/** Mirrors a venue into the local cache. */
export async function cacheVenue(
	store: EntityStore<CollegeFootballDataVenueEntity> | undefined,
	venue: CollegeFootballDataVenue | undefined | null,
) {
	if (!store || venue?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(venue.id), {
				id: venue.id,
				name: venue.name,
				capacity: venue.capacity,
				grass: venue.grass,
				dome: venue.dome,
				city: venue.city,
				state: venue.state,
				zip: venue.zip,
				countryCode: venue.countryCode,
				timezone: venue.timezone,
				latitude: venue.latitude,
				longitude: venue.longitude,
				elevation: venue.elevation,
				constructionYear: venue.constructionYear,
			}),
		`venue ${venue.id}`,
	);
}

/** Mirrors a coach into the local cache. */
export async function cacheCoach(
	store: EntityStore<CollegeFootballDataCoachEntity> | undefined,
	coach: CollegeFootballDataCoach | undefined | null,
) {
	if (!store || coach?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(coach.id), {
				id: coach.id,
				firstName: coach.firstName,
				lastName: coach.lastName,
				hireDate: coach.hireDate,
				seasons: coach.seasons,
			}),
		`coach ${coach.id}`,
	);
}
