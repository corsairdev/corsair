import { z } from 'zod';
import {
	CollegeFootballDataCoachEntity,
	CollegeFootballDataConferenceEntity,
	CollegeFootballDataTeamEntity,
	CollegeFootballDataVenueEntity,
} from '../schema/database';
import { B, N, S } from '../schema/primitives';

/**
 * Shared entity and operation shapes for the College Football Data games/
 * drives/plays/metrics/PPA/ratings/stats/players/teams/conferences/coaches/
 * venues/recruiting/rankings/betting/draft surface.
 *
 * Ground truth for every route (method, path, query fields) comes from the
 * provider's official OpenAPI 3.0.0 document
 * (`https://api.collegefootballdata.com/api-docs.json`, version 5.24.0).
 * Every operation is a GET; this API has no writes at all.
 *
 * Field names are camelCase throughout, matching the provider's own wire
 * format exactly - no translation layer needed.
 *
 * @see https://api.collegefootballdata.com
 */

export const CollegeFootballDataTeamSchema = CollegeFootballDataTeamEntity;
export type CollegeFootballDataTeam = CollegeFootballDataTeamEntity;

export const CollegeFootballDataConferenceSchema =
	CollegeFootballDataConferenceEntity;
export type CollegeFootballDataConference = CollegeFootballDataConferenceEntity;

export const CollegeFootballDataVenueSchema = CollegeFootballDataVenueEntity;
export type CollegeFootballDataVenue = CollegeFootballDataVenueEntity;

export const CollegeFootballDataCoachSchema = CollegeFootballDataCoachEntity;
export type CollegeFootballDataCoach = CollegeFootballDataCoachEntity;

/* -------------------------------------------------------------------------- */
/* entities (not persisted - live views)                                      */
/* -------------------------------------------------------------------------- */

/** Live-captured 2026-08-17 from `GET /games`. */
export const CollegeFootballDataGameSchema = z
	.object({
		id: z.number(),
		season: N,
		week: N,
		seasonType: S,
		startDate: S,
		startTimeTBD: B,
		completed: B,
		neutralSite: B,
		conferenceGame: B,
		attendance: N,
		venueId: N,
		venue: S,
		homeId: N,
		homeTeam: S,
		homeClassification: S,
		homeConference: S,
		homePoints: N,
		homeLineScores: z.array(z.number()).nullable().optional(),
		homePostgameWinProbability: N,
		homePregameElo: N,
		homePostgameElo: N,
		awayId: N,
		awayTeam: S,
		awayClassification: S,
		awayConference: S,
		awayPoints: N,
		awayLineScores: z.array(z.number()).nullable().optional(),
		awayPostgameWinProbability: N,
		awayPregameElo: N,
		awayPostgameElo: N,
		excitementIndex: N,
		highlights: S,
		notes: S,
		playoff: z
			.object({
				competition: S,
				format: S,
				round: S,
				roundName: S,
				bracketSlot: S,
				homeSeed: N,
				awaySeed: N,
				bowlName: S,
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();
export type CollegeFootballDataGame = z.infer<
	typeof CollegeFootballDataGameSchema
>;

/** Live-captured 2026-08-17 from `GET /games/media`. */
export const CollegeFootballDataGameMediaSchema = z
	.object({
		id: z.number(),
		season: N,
		week: N,
		seasonType: S,
		startTime: S,
		isStartTimeTBD: B,
		homeTeam: S,
		homeConference: S,
		awayTeam: S,
		awayConference: S,
		mediaType: S,
		outlet: S,
	})
	.loose();
export type CollegeFootballDataGameMedia = z.infer<
	typeof CollegeFootballDataGameMediaSchema
>;

/**
 * `GET /games/teams` and `GET /games/players` share this outer shape - a
 * game id plus a per-team breakdown. The nested `categories`/`stats` bodies
 * are provider-defined and deeply variable (different stat names per sport
 * situation), so they are kept as opaque records rather than typed field by
 * field, same rationale as Botpress's bot/integration manifests.
 */
export const CollegeFootballDataGameTeamStatsSchema = z
	.object({
		id: z.number(),
		teams: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataGameTeamStats = z.infer<
	typeof CollegeFootballDataGameTeamStatsSchema
>;

/** Live-captured 2026-08-17 from `GET /game/box/advanced`. */
export const CollegeFootballDataAdvancedBoxScoreSchema = z
	.object({
		gameInfo: z.record(z.string(), z.unknown()).nullable().optional(),
		teams: z.record(z.string(), z.unknown()).nullable().optional(),
		players: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataAdvancedBoxScore = z.infer<
	typeof CollegeFootballDataAdvancedBoxScoreSchema
>;

/** Live-captured 2026-08-17 from `GET /drives`. */
export const CollegeFootballDataDriveSchema = z
	.object({
		id: S,
		gameId: N,
		offense: S,
		offenseConference: S,
		defense: S,
		defenseConference: S,
		driveNumber: N,
		scoring: B,
		startPeriod: N,
		startYardline: N,
		startYardsToGoal: N,
		startTime: z.record(z.string(), z.unknown()).nullable().optional(),
		endPeriod: N,
		endYardline: N,
		endYardsToGoal: N,
		endTime: z.record(z.string(), z.unknown()).nullable().optional(),
		elapsed: z.record(z.string(), z.unknown()).nullable().optional(),
		plays: N,
		yards: N,
		driveResult: S,
		isHomeOffense: B,
		startOffenseScore: N,
		startDefenseScore: N,
		endOffenseScore: N,
		endDefenseScore: N,
	})
	.loose();
export type CollegeFootballDataDrive = z.infer<
	typeof CollegeFootballDataDriveSchema
>;

/** Live-captured 2026-08-17 from `GET /plays`. */
export const CollegeFootballDataPlaySchema = z
	.object({
		gameId: N,
		driveId: S,
		id: S,
		driveNumber: N,
		playNumber: N,
		offense: S,
		offenseConference: S,
		offenseScore: N,
		defense: S,
		defenseConference: S,
		defenseScore: N,
		home: S,
		away: S,
		period: N,
		clock: z.record(z.string(), z.unknown()).nullable().optional(),
		offenseTimeouts: N,
		defenseTimeouts: N,
		yardline: N,
		yardsToGoal: N,
		down: N,
		distance: N,
		yardsGained: N,
		scoring: B,
		playType: S,
		playText: S,
		ppa: N,
		wallclock: S,
	})
	.loose();
export type CollegeFootballDataPlay = z.infer<
	typeof CollegeFootballDataPlaySchema
>;

/** Live-captured 2026-08-17 from `GET /plays/stats`. Note: `stat` is a string. */
export const CollegeFootballDataPlayStatSchema = z
	.object({
		gameId: N,
		season: N,
		week: N,
		team: S,
		conference: S,
		opponent: S,
		teamScore: N,
		opponentScore: N,
		driveId: S,
		playId: S,
		period: N,
		clock: z.record(z.string(), z.unknown()).nullable().optional(),
		yardsToGoal: N,
		down: N,
		distance: N,
		athleteId: S,
		athleteName: S,
		statType: S,
		stat: S,
	})
	.loose();
export type CollegeFootballDataPlayStat = z.infer<
	typeof CollegeFootballDataPlayStatSchema
>;

/** Live-captured 2026-08-17 from `GET /plays/stats/types` and `GET /plays/types`. */
export const CollegeFootballDataPlayTypeSchema = z
	.object({
		id: z.number(),
		name: S,
		text: S,
		abbreviation: S,
	})
	.loose();
export type CollegeFootballDataPlayType = z.infer<
	typeof CollegeFootballDataPlayTypeSchema
>;

/** Live-captured 2026-08-17 from `GET /metrics/fg/ep`. Static model data. */
export const CollegeFootballDataFieldGoalEPSchema = z
	.object({
		yardsToGoal: N,
		distance: N,
		expectedPoints: N,
	})
	.loose();
export type CollegeFootballDataFieldGoalEP = z.infer<
	typeof CollegeFootballDataFieldGoalEPSchema
>;

/** Live-captured 2026-08-17 from `GET /metrics/wp`. */
export const CollegeFootballDataWinProbabilitySchema = z
	.object({
		gameId: N,
		homeId: N,
		home: S,
		awayId: N,
		away: S,
		playId: S,
		playText: S,
		homeScore: N,
		awayScore: N,
		down: N,
		distance: N,
		homeWinProbability: N,
		spread: N,
		yardLine: N,
		homeBall: B,
		playNumber: N,
	})
	.loose();
export type CollegeFootballDataWinProbability = z.infer<
	typeof CollegeFootballDataWinProbabilitySchema
>;

/** Live-captured 2026-08-17 from `GET /metrics/wp/pregame`. */
export const CollegeFootballDataPregameWinProbabilitySchema = z
	.object({
		season: N,
		week: N,
		seasonType: S,
		gameId: N,
		homeTeam: S,
		awayTeam: S,
		spread: N,
		homeWinProbability: N,
	})
	.loose();
export type CollegeFootballDataPregameWinProbability = z.infer<
	typeof CollegeFootballDataPregameWinProbabilitySchema
>;

const CfbdPpaBreakdownSchema = z
	.object({
		overall: N,
		passing: N,
		rushing: N,
		firstDown: N,
		secondDown: N,
		thirdDown: N,
	})
	.loose();

/** Live-captured 2026-08-17 from `GET /ppa/teams`. */
export const CollegeFootballDataTeamPPASchema = z
	.object({
		season: N,
		conference: S,
		team: S,
		offense: CfbdPpaBreakdownSchema.nullable().optional(),
		defense: CfbdPpaBreakdownSchema.nullable().optional(),
	})
	.loose();
export type CollegeFootballDataTeamPPA = z.infer<
	typeof CollegeFootballDataTeamPPASchema
>;

/** Live-captured 2026-08-17 from `GET /ppa/games`. */
export const CollegeFootballDataTeamGamePPASchema = z
	.object({
		gameId: N,
		season: N,
		week: N,
		seasonType: S,
		team: S,
		conference: S,
		opponent: S,
		offense: CfbdPpaBreakdownSchema.nullable().optional(),
		defense: CfbdPpaBreakdownSchema.nullable().optional(),
	})
	.loose();
export type CollegeFootballDataTeamGamePPA = z.infer<
	typeof CollegeFootballDataTeamGamePPASchema
>;

/** Live-captured 2026-08-17 from `GET /ppa/players/season`. */
export const CollegeFootballDataPlayerSeasonPPASchema = z
	.object({
		season: N,
		id: S,
		name: S,
		position: S,
		team: S,
		conference: S,
		averagePPA: z.record(z.string(), z.unknown()).nullable().optional(),
		totalPPA: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataPlayerSeasonPPA = z.infer<
	typeof CollegeFootballDataPlayerSeasonPPASchema
>;

/** Live-captured 2026-08-17 from `GET /ppa/players/games`. */
export const CollegeFootballDataPlayerGamePPASchema = z
	.object({
		season: N,
		week: N,
		seasonType: S,
		id: S,
		name: S,
		position: S,
		team: S,
		opponent: S,
		averagePPA: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataPlayerGamePPA = z.infer<
	typeof CollegeFootballDataPlayerGamePPASchema
>;

/** Live-captured 2026-08-17 from `GET /ppa/predicted`. Static model data. */
export const CollegeFootballDataPredictedPointsSchema = z
	.object({
		yardLine: N,
		predictedPoints: N,
	})
	.loose();
export type CollegeFootballDataPredictedPoints = z.infer<
	typeof CollegeFootballDataPredictedPointsSchema
>;

/** Live-captured 2026-08-17 from `GET /ratings/elo`. */
export const CollegeFootballDataEloRatingSchema = z
	.object({
		year: N,
		team: S,
		conference: S,
		elo: N,
	})
	.loose();
export type CollegeFootballDataEloRating = z.infer<
	typeof CollegeFootballDataEloRatingSchema
>;

/** Live-captured 2026-08-17 from `GET /ratings/fpi`. */
export const CollegeFootballDataFPIRatingSchema = z
	.object({
		year: N,
		team: S,
		conference: S,
		fpi: N,
		resumeRanks: z.record(z.string(), z.unknown()).nullable().optional(),
		efficiencies: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataFPIRating = z.infer<
	typeof CollegeFootballDataFPIRatingSchema
>;

const CfbdSPComponentSchema = z
	.object({
		ranking: N,
		rating: N,
		success: N,
		explosiveness: N,
		rushing: N,
		passing: N,
		standardDowns: N,
		passingDowns: N,
		runRate: N,
		pace: N,
	})
	.loose();

/** Live-captured 2026-08-17 from `GET /ratings/sp`. */
export const CollegeFootballDataSPRatingSchema = z
	.object({
		year: N,
		team: S,
		conference: S,
		rating: N,
		ranking: N,
		secondOrderWins: N,
		sos: N,
		offense: CfbdSPComponentSchema.nullable().optional(),
		defense: CfbdSPComponentSchema.nullable().optional(),
		specialTeams: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataSPRating = z.infer<
	typeof CollegeFootballDataSPRatingSchema
>;

/** Live-captured 2026-08-17 from `GET /ratings/sp/conferences`. */
export const CollegeFootballDataConferenceSPRatingSchema = z
	.object({
		year: N,
		conference: S,
		rating: N,
		secondOrderWins: N,
		sos: N,
		offense: CfbdSPComponentSchema.nullable().optional(),
		defense: CfbdSPComponentSchema.nullable().optional(),
		specialTeams: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataConferenceSPRating = z.infer<
	typeof CollegeFootballDataConferenceSPRatingSchema
>;

/** Live-captured 2026-08-17 from `GET /ratings/srs`. */
export const CollegeFootballDataSRSRatingSchema = z
	.object({
		year: N,
		team: S,
		conference: S,
		division: S,
		ranking: N,
		rating: N,
	})
	.loose();
export type CollegeFootballDataSRSRating = z.infer<
	typeof CollegeFootballDataSRSRatingSchema
>;

const CfbdRecordSplitSchema = z
	.object({ games: N, wins: N, losses: N, ties: N })
	.loose();

/** Live-captured 2026-08-17 from `GET /records`. */
export const CollegeFootballDataTeamRecordSchema = z
	.object({
		year: N,
		teamId: N,
		team: S,
		classification: S,
		conference: S,
		division: S,
		expectedWins: N,
		total: CfbdRecordSplitSchema.nullable().optional(),
		conferenceGames: CfbdRecordSplitSchema.nullable().optional(),
		homeGames: CfbdRecordSplitSchema.nullable().optional(),
		awayGames: CfbdRecordSplitSchema.nullable().optional(),
		neutralSiteGames: CfbdRecordSplitSchema.nullable().optional(),
		regularSeason: CfbdRecordSplitSchema.nullable().optional(),
		postseason: CfbdRecordSplitSchema.nullable().optional(),
	})
	.loose();
export type CollegeFootballDataTeamRecord = z.infer<
	typeof CollegeFootballDataTeamRecordSchema
>;

/** Live-captured 2026-08-17 from `GET /recruiting/groups`. */
export const CollegeFootballDataRecruitingGroupSchema = z
	.object({
		team: S,
		conference: S,
		positionGroup: S,
		averageRating: N,
		totalRating: N,
		commits: N,
		averageStars: N,
	})
	.loose();
export type CollegeFootballDataRecruitingGroup = z.infer<
	typeof CollegeFootballDataRecruitingGroupSchema
>;

const CfbdHometownInfoSchema = z
	.object({
		city: S,
		state: S,
		country: S,
		latitude: N,
		longitude: N,
		countyFips: S,
	})
	.loose();

/** Live-captured 2026-08-17 from `GET /recruiting/players`. */
export const CollegeFootballDataRecruitSchema = z
	.object({
		id: z.number(),
		athleteId: S,
		recruitType: S,
		year: N,
		ranking: N,
		name: S,
		school: S,
		committedTo: S,
		position: S,
		height: N,
		weight: N,
		stars: N,
		rating: N,
		city: S,
		stateProvince: S,
		country: S,
		hometownInfo: CfbdHometownInfoSchema.nullable().optional(),
	})
	.loose();
export type CollegeFootballDataRecruit = z.infer<
	typeof CollegeFootballDataRecruitSchema
>;

/** Live-captured 2026-08-17 from `GET /recruiting/teams`. */
export const CollegeFootballDataTeamRecruitingRankingSchema = z
	.object({
		year: N,
		team: S,
		rank: N,
		points: N,
	})
	.loose();
export type CollegeFootballDataTeamRecruitingRanking = z.infer<
	typeof CollegeFootballDataTeamRecruitingRankingSchema
>;

/** Live-captured 2026-08-17 from `GET /talent`. 247Sports composite team talent. */
export const CollegeFootballDataTeamTalentSchema = z
	.object({
		year: N,
		team: S,
		talent: N,
	})
	.loose();
export type CollegeFootballDataTeamTalent = z.infer<
	typeof CollegeFootballDataTeamTalentSchema
>;

const CfbdRankSchema = z
	.object({
		rank: N,
		teamId: N,
		school: S,
		conference: S,
		firstPlaceVotes: N,
		points: N,
	})
	.loose();

const CfbdPollSchema = z
	.object({
		poll: S,
		isFinal: B,
		ranks: z.array(CfbdRankSchema).nullable().optional(),
	})
	.loose();

/** Live-captured 2026-08-17 from `GET /rankings`. */
export const CollegeFootballDataRankingWeekSchema = z
	.object({
		season: N,
		seasonType: S,
		week: N,
		polls: z.array(CfbdPollSchema).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataRankingWeek = z.infer<
	typeof CollegeFootballDataRankingWeekSchema
>;

/** Live-captured 2026-08-17 from `GET /lines`. */
export const CollegeFootballDataBettingLineGameSchema = z
	.object({
		id: z.number(),
		season: N,
		seasonType: S,
		week: N,
		startDate: S,
		homeTeamId: N,
		homeTeam: S,
		homeConference: S,
		homeClassification: S,
		homeScore: N,
		awayTeamId: N,
		awayTeam: S,
		awayConference: S,
		awayClassification: S,
		awayScore: N,
		lines: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataBettingLineGame = z.infer<
	typeof CollegeFootballDataBettingLineGameSchema
>;

const CfbdHometownDraftSchema = z
	.object({ city: S, state: S, country: S })
	.loose();

/** Live-captured 2026-08-17 from `GET /draft/picks`. */
export const CollegeFootballDataDraftPickSchema = z
	.object({
		collegeAthleteId: S,
		nflAthleteId: S,
		collegeId: N,
		collegeTeam: S,
		collegeConference: S,
		nflTeamId: N,
		nflTeam: S,
		year: N,
		overall: N,
		round: N,
		pick: N,
		name: S,
		position: S,
		height: N,
		weight: N,
		preDraftRanking: N,
		preDraftPositionRanking: N,
		preDraftGrade: N,
		hometownInfo: CfbdHometownDraftSchema.nullable().optional(),
	})
	.loose();
export type CollegeFootballDataDraftPick = z.infer<
	typeof CollegeFootballDataDraftPickSchema
>;

/** Live-captured 2026-08-17 from `GET /draft/positions`. */
export const CollegeFootballDataDraftPositionSchema = z
	.object({
		name: S,
		abbreviation: S,
	})
	.loose();
export type CollegeFootballDataDraftPosition = z.infer<
	typeof CollegeFootballDataDraftPositionSchema
>;

/** Live-captured 2026-08-17 from `GET /draft/teams`. */
export const CollegeFootballDataDraftTeamSchema = z
	.object({
		location: S,
		nickname: S,
		displayName: S,
		logo: S,
	})
	.loose();
export type CollegeFootballDataDraftTeam = z.infer<
	typeof CollegeFootballDataDraftTeamSchema
>;

/** Live-captured 2026-08-17 from `GET /player/search`. */
export const CollegeFootballDataPlayerSearchResultSchema = z
	.object({
		id: S,
		team: S,
		name: S,
		firstName: S,
		lastName: S,
		weight: N,
		height: N,
		jersey: N,
		position: S,
		hometown: S,
		teamColor: S,
		teamColorSecondary: S,
		activeStartYear: N,
		activeEndYear: N,
		teamStints: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
	})
	.loose();
export type CollegeFootballDataPlayerSearchResult = z.infer<
	typeof CollegeFootballDataPlayerSearchResultSchema
>;

/** Live-captured 2026-08-17 from `GET /player/usage`. */
export const CollegeFootballDataPlayerUsageSchema = z
	.object({
		season: N,
		id: S,
		name: S,
		position: S,
		team: S,
		conference: S,
		usage: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataPlayerUsage = z.infer<
	typeof CollegeFootballDataPlayerUsageSchema
>;

/** Live-captured 2026-08-17 from `GET /player/returning`. */
export const CollegeFootballDataReturningProductionSchema = z
	.object({
		season: N,
		team: S,
		conference: S,
		totalPPA: N,
		totalPassingPPA: N,
		totalReceivingPPA: N,
		totalRushingPPA: N,
		percentPPA: N,
		percentPassingPPA: N,
		percentReceivingPPA: N,
		percentRushingPPA: N,
		usage: N,
		passingUsage: N,
		receivingUsage: N,
		rushingUsage: N,
	})
	.loose();
export type CollegeFootballDataReturningProduction = z.infer<
	typeof CollegeFootballDataReturningProductionSchema
>;

/** Live-captured 2026-08-17 from `GET /player/portal`. */
export const CollegeFootballDataTransferPortalEntrySchema = z
	.object({
		season: N,
		firstName: S,
		lastName: S,
		position: S,
		origin: S,
		destination: S,
		transferDate: S,
		rating: N,
		stars: N,
		eligibility: S,
	})
	.loose();
export type CollegeFootballDataTransferPortalEntry = z.infer<
	typeof CollegeFootballDataTransferPortalEntrySchema
>;

/** Live-captured 2026-08-17 from `GET /teams/ats`. */
export const CollegeFootballDataTeamATSRecordSchema = z
	.object({
		year: N,
		teamId: N,
		team: S,
		conference: S,
		games: N,
		atsWins: N,
		atsLosses: N,
		atsPushes: N,
		avgCoverMargin: N,
	})
	.loose();
export type CollegeFootballDataTeamATSRecord = z.infer<
	typeof CollegeFootballDataTeamATSRecordSchema
>;

/** Live-captured 2026-08-17 from `GET /teams/matchup`. */
export const CollegeFootballDataTeamMatchupSchema = z
	.object({
		team1: S,
		team2: S,
		team1Wins: N,
		team2Wins: N,
		ties: N,
		games: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataTeamMatchup = z.infer<
	typeof CollegeFootballDataTeamMatchupSchema
>;

/** Live-captured 2026-08-17 from `GET /stats/categories`. A plain string array. */
export const CollegeFootballDataStatCategorySchema = z.string();
export type CollegeFootballDataStatCategory = string;

/** Live-captured 2026-08-17 from `GET /stats/game/advanced` and `/stats/season/advanced`. */
export const CollegeFootballDataAdvancedStatsSchema = z
	.object({
		gameId: N,
		season: N,
		seasonType: S,
		week: N,
		team: S,
		opponent: S,
		offense: z.record(z.string(), z.unknown()).nullable().optional(),
		defense: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataAdvancedStats = z.infer<
	typeof CollegeFootballDataAdvancedStatsSchema
>;

/** Live-captured 2026-08-17 from `GET /stats/game/havoc`. */
export const CollegeFootballDataGameHavocStatsSchema = z
	.object({
		gameId: N,
		season: N,
		seasonType: S,
		week: N,
		team: S,
		conference: S,
		opponent: S,
		opponentConference: S,
		offense: z.record(z.string(), z.unknown()).nullable().optional(),
		defense: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataGameHavocStats = z.infer<
	typeof CollegeFootballDataGameHavocStatsSchema
>;

/** Live-captured 2026-08-17 from `GET /stats/player/season`. Note: `stat` is a string. */
export const CollegeFootballDataPlayerSeasonStatSchema = z
	.object({
		season: N,
		playerId: S,
		player: S,
		position: S,
		team: S,
		conference: S,
		category: S,
		statType: S,
		stat: S,
	})
	.loose();
export type CollegeFootballDataPlayerSeasonStat = z.infer<
	typeof CollegeFootballDataPlayerSeasonStatSchema
>;

/** Live-captured 2026-08-17 from `GET /stats/season`. Note: `statValue` is a real number here. */
export const CollegeFootballDataTeamSeasonStatSchema = z
	.object({
		season: N,
		team: S,
		conference: S,
		statName: S,
		statValue: N,
	})
	.loose();
export type CollegeFootballDataTeamSeasonStat = z.infer<
	typeof CollegeFootballDataTeamSeasonStatSchema
>;

/** Live-captured 2026-08-17 from `GET /info`. */
export const CollegeFootballDataUserInfoSchema = z
	.object({
		patronLevel: N,
		tierName: S,
		monthlyLimit: N,
		remainingCalls: N,
		usedCalls: N,
		resetAt: S,
		sharedPool: B,
		products: z.array(z.string()).nullable().optional(),
		features: z.record(z.string(), z.boolean()).nullable().optional(),
	})
	.loose();
export type CollegeFootballDataUserInfo = z.infer<
	typeof CollegeFootballDataUserInfoSchema
>;

/**
 * Static, provider-documented vocabulary - confirmed no backing endpoint
 * exists anywhere in the OpenAPI document. Values match the `SeasonType`
 * spec enum exactly.
 */
export const CollegeFootballDataSeasonTypeSchema = z.enum([
	'regular',
	'postseason',
	'both',
	'allstar',
	'spring_regular',
	'spring_postseason',
]);
export type CollegeFootballDataSeasonType = z.infer<
	typeof CollegeFootballDataSeasonTypeSchema
>;
const SEASON_TYPES = CollegeFootballDataSeasonTypeSchema.options;

/**
 * Live-captured 2026-08-17 from `GET /conferences/affiliations`. Backs both
 * `CONFERENCE_MEMBERSHIPS_HISTORY` and `DIVISIONS_BY_CONFERENCE` - see the
 * shared input schema comment below.
 */
export const CollegeFootballDataTeamConferenceAffiliationSchema = z
	.object({
		teamId: N,
		team: S,
		conferenceId: N,
		conference: S,
		conferenceAbbreviation: S,
		classification: S,
		conferenceDivision: S,
		startYear: N,
		endYear: N,
	})
	.loose();
export type CollegeFootballDataTeamConferenceAffiliation = z.infer<
	typeof CollegeFootballDataTeamConferenceAffiliationSchema
>;

/** Live-captured 2026-08-17 from `GET /roster`. */
export const CollegeFootballDataRosterPlayerSchema = z
	.object({
		id: S,
		firstName: S,
		lastName: S,
		team: S,
		weight: N,
		height: N,
		jersey: N,
		year: N,
		position: S,
		homeCity: S,
		homeState: S,
		homeCountry: S,
		homeLatitude: N,
		homeLongitude: N,
		homeCountyFIPS: S,
		recruitIds: z
			.array(z.union([z.string(), z.number()]))
			.nullable()
			.optional(),
	})
	.loose();
export type CollegeFootballDataRosterPlayer = z.infer<
	typeof CollegeFootballDataRosterPlayerSchema
>;

/* -------------------------------------------------------------------------- */
/* shared input fragments                                                     */
/* -------------------------------------------------------------------------- */

const SeasonTypeInputSchema = CollegeFootballDataSeasonTypeSchema.optional();
const ClassificationInputSchema = z
	.enum(['fbs', 'fcs', 'ii', 'iii'])
	.optional();

/* -------------------------------------------------------------------------- */
/* games                                                                       */
/* -------------------------------------------------------------------------- */

/** `year` is required unless `id` is specified (confirmed from the spec's own parameter description). */
const GamesGetGamesAndResultsInputSchema = z
	.object({
		year: z.number().optional(),
		week: z.number().optional(),
		seasonType: SeasonTypeInputSchema,
		classification: ClassificationInputSchema,
		team: z.string().optional(),
		home: z.string().optional(),
		away: z.string().optional(),
		conference: z.string().optional(),
		id: z.number().optional(),
	})
	.refine((value) => value.id !== undefined || value.year !== undefined, {
		message: 'Either id or year is required',
	});
export type GamesGetGamesAndResultsInput = z.infer<
	typeof GamesGetGamesAndResultsInputSchema
>;

const GamesGetMediaInputSchema = z.object({
	year: z.number(),
	week: z.number().optional(),
	seasonType: SeasonTypeInputSchema,
	team: z.string().optional(),
	conference: z.string().optional(),
	classification: ClassificationInputSchema,
	mediaType: z.string().optional(),
});
export type GamesGetMediaInput = z.infer<typeof GamesGetMediaInputSchema>;

/** `year` required unless `id`; one of `week`/`team`/`conference` required when filtering by year (confirmed from the spec's own parameter descriptions). */
const GamesGetTeamStatsInputSchema = z
	.object({
		year: z.number().optional(),
		week: z.number().optional(),
		team: z.string().optional(),
		conference: z.string().optional(),
		classification: ClassificationInputSchema,
		seasonType: SeasonTypeInputSchema,
		id: z.number().optional(),
	})
	.refine((value) => value.id !== undefined || value.year !== undefined, {
		message: 'Either id or year is required',
	})
	.refine(
		(value) =>
			value.id !== undefined ||
			value.week !== undefined ||
			value.team !== undefined ||
			value.conference !== undefined,
		{
			message:
				'When filtering by year, one of week, team, or conference is required',
		},
	);
export type GamesGetTeamStatsInput = z.infer<
	typeof GamesGetTeamStatsInputSchema
>;

/** `year` required unless `id`; one of `week`/`team`/`conference` required when filtering by year (confirmed from the spec's own parameter descriptions). */
const GamesGetPlayerStatsInputSchema = z
	.object({
		year: z.number().optional(),
		week: z.number().optional(),
		team: z.string().optional(),
		conference: z.string().optional(),
		classification: ClassificationInputSchema,
		seasonType: SeasonTypeInputSchema,
		category: z.string().optional(),
		id: z.number().optional(),
	})
	.refine((value) => value.id !== undefined || value.year !== undefined, {
		message: 'Either id or year is required',
	})
	.refine(
		(value) =>
			value.id !== undefined ||
			value.week !== undefined ||
			value.team !== undefined ||
			value.conference !== undefined,
		{
			message:
				'When filtering by year, one of week, team, or conference is required',
		},
	);
export type GamesGetPlayerStatsInput = z.infer<
	typeof GamesGetPlayerStatsInputSchema
>;

/** `id` (not `gameId`) - confirmed live; the two "get by game id" operations use different param names. */
const GamesGetAdvancedBoxScoreInputSchema = z.object({
	id: z.number(),
});
export type GamesGetAdvancedBoxScoreInput = z.infer<
	typeof GamesGetAdvancedBoxScoreInputSchema
>;

/* -------------------------------------------------------------------------- */
/* drives                                                                      */
/* -------------------------------------------------------------------------- */

const DrivesListInputSchema = z.object({
	year: z.number(),
	week: z.number().optional(),
	seasonType: SeasonTypeInputSchema,
	team: z.string().optional(),
	offense: z.string().optional(),
	defense: z.string().optional(),
	conference: z.string().optional(),
	offenseConference: z.string().optional(),
	defenseConference: z.string().optional(),
	classification: ClassificationInputSchema,
});
export type DrivesListInput = z.infer<typeof DrivesListInputSchema>;

/* -------------------------------------------------------------------------- */
/* plays                                                                       */
/* -------------------------------------------------------------------------- */

/** `year` and `week` are both required (confirmed from the spec's own parameter descriptions). */
const PlaysListInputSchema = z.object({
	year: z.number(),
	week: z.number(),
	seasonType: SeasonTypeInputSchema,
	team: z.string().optional(),
	offense: z.string().optional(),
	defense: z.string().optional(),
	conference: z.string().optional(),
	offenseConference: z.string().optional(),
	defenseConference: z.string().optional(),
	playType: z.string().optional(),
	classification: ClassificationInputSchema,
});
export type PlaysListInput = z.infer<typeof PlaysListInputSchema>;

/**
 * `gameId`/`statTypeId`, not `playType` - confirmed live: `playType` is
 * silently ignored on this route (200, unfiltered results identical to
 * omitting it), while `gameId` genuinely narrows the response. `playType`
 * is not a documented parameter for this route at all.
 */
const PlaysListStatsInputSchema = z.object({
	year: z.number().optional(),
	week: z.number().optional(),
	team: z.string().optional(),
	conference: z.string().optional(),
	seasonType: SeasonTypeInputSchema,
	gameId: z.number().optional(),
	statTypeId: z.number().optional(),
	athleteId: z.string().optional(),
});
export type PlaysListStatsInput = z.infer<typeof PlaysListStatsInputSchema>;

const PlaysListStatTypesInputSchema = z.object({});
export type PlaysListStatTypesInput = z.infer<
	typeof PlaysListStatTypesInputSchema
>;

const PlaysListTypesInputSchema = z.object({});
export type PlaysListTypesInput = z.infer<typeof PlaysListTypesInputSchema>;

/* -------------------------------------------------------------------------- */
/* metrics                                                                     */
/* -------------------------------------------------------------------------- */

const MetricsGetFieldGoalExpectedPointsInputSchema = z.object({});
export type MetricsGetFieldGoalExpectedPointsInput = z.infer<
	typeof MetricsGetFieldGoalExpectedPointsInputSchema
>;

const MetricsGetWinProbabilityInputSchema = z.object({
	gameId: z.number(),
});
export type MetricsGetWinProbabilityInput = z.infer<
	typeof MetricsGetWinProbabilityInputSchema
>;

const MetricsGetPregameWinProbabilitiesInputSchema = z.object({
	year: z.number().optional(),
	week: z.number().optional(),
	team: z.string().optional(),
	seasonType: SeasonTypeInputSchema,
});
export type MetricsGetPregameWinProbabilitiesInput = z.infer<
	typeof MetricsGetPregameWinProbabilitiesInputSchema
>;

/* -------------------------------------------------------------------------- */
/* ppa                                                                         */
/* -------------------------------------------------------------------------- */

/** Either `year` or `team` is required (confirmed from the spec's own parameter descriptions). */
const PpaGetByTeamSeasonInputSchema = z
	.object({
		year: z.number().optional(),
		team: z.string().optional(),
		conference: z.string().optional(),
		excludeGarbageTime: z.boolean().optional(),
	})
	.refine((value) => value.year !== undefined || value.team !== undefined, {
		message: 'Either year or team is required',
	});
export type PpaGetByTeamSeasonInput = z.infer<
	typeof PpaGetByTeamSeasonInputSchema
>;

/** `year` is required (confirmed from the spec's own parameter description). */
const PpaGetByTeamGameInputSchema = z.object({
	year: z.number(),
	week: z.number().optional(),
	team: z.string().optional(),
	conference: z.string().optional(),
	seasonType: SeasonTypeInputSchema,
	excludeGarbageTime: z.boolean().optional(),
	classification: ClassificationInputSchema,
});
export type PpaGetByTeamGameInput = z.infer<typeof PpaGetByTeamGameInputSchema>;

/** `year` required unless `playerId` is specified. */
const PpaGetByPlayerSeasonInputSchema = z
	.object({
		year: z.number().optional(),
		conference: z.string().optional(),
		team: z.string().optional(),
		position: z.string().optional(),
		playerId: z.string().optional(),
		threshold: z.number().optional(),
		excludeGarbageTime: z.boolean().optional(),
	})
	.refine((value) => value.year !== undefined || value.playerId !== undefined, {
		message: 'Either year or playerId is required',
	});
export type PpaGetByPlayerSeasonInput = z.infer<
	typeof PpaGetByPlayerSeasonInputSchema
>;

/** `year` required; one of `week`/`team` required (per spec description). */
const PpaGetByPlayerGameInputSchema = z
	.object({
		year: z.number(),
		week: z.number().optional(),
		seasonType: SeasonTypeInputSchema,
		team: z.string().optional(),
		position: z.string().optional(),
		playerId: z.string().optional(),
		threshold: z.number().optional(),
		excludeGarbageTime: z.boolean().optional(),
	})
	.refine((value) => value.week !== undefined || value.team !== undefined, {
		message: 'Either week or team is required',
	});
export type PpaGetByPlayerGameInput = z.infer<
	typeof PpaGetByPlayerGameInputSchema
>;

const PpaGetPredictedPointsInputSchema = z.object({
	down: z.number(),
	distance: z.number(),
});
export type PpaGetPredictedPointsInput = z.infer<
	typeof PpaGetPredictedPointsInputSchema
>;

/* -------------------------------------------------------------------------- */
/* ratings                                                                     */
/* -------------------------------------------------------------------------- */

const RatingsGetEloInputSchema = z.object({
	year: z.number().optional(),
	team: z.string().optional(),
	conference: z.string().optional(),
});
export type RatingsGetEloInput = z.infer<typeof RatingsGetEloInputSchema>;

const RatingsGetFPIInputSchema = z.object({
	year: z.number().optional(),
	team: z.string().optional(),
	conference: z.string().optional(),
});
export type RatingsGetFPIInput = z.infer<typeof RatingsGetFPIInputSchema>;

const RatingsGetSPInputSchema = z.object({
	year: z.number().optional(),
	team: z.string().optional(),
});
export type RatingsGetSPInput = z.infer<typeof RatingsGetSPInputSchema>;

const RatingsGetConferenceSPInputSchema = z.object({
	year: z.number().optional(),
	conference: z.string().optional(),
});
export type RatingsGetConferenceSPInput = z.infer<
	typeof RatingsGetConferenceSPInputSchema
>;

/** Either `year` or `team` is required (confirmed from the spec's own parameter descriptions). */
const RatingsGetSRSInputSchema = z
	.object({
		year: z.number().optional(),
		team: z.string().optional(),
		conference: z.string().optional(),
	})
	.refine((value) => value.year !== undefined || value.team !== undefined, {
		message: 'Either year or team is required',
	});
export type RatingsGetSRSInput = z.infer<typeof RatingsGetSRSInputSchema>;

/* -------------------------------------------------------------------------- */
/* stats                                                                       */
/* -------------------------------------------------------------------------- */

const StatsListCategoriesInputSchema = z.object({});
export type StatsListCategoriesInput = z.infer<
	typeof StatsListCategoriesInputSchema
>;

/** Either `year` or `team` is required (confirmed from the spec's own parameter descriptions). */
const StatsGetAdvancedGameStatsInputSchema = z
	.object({
		year: z.number().optional(),
		week: z.number().optional(),
		team: z.string().optional(),
		opponent: z.string().optional(),
		seasonType: SeasonTypeInputSchema,
		excludeGarbageTime: z.boolean().optional(),
	})
	.refine((value) => value.year !== undefined || value.team !== undefined, {
		message: 'Either year or team is required',
	});
export type StatsGetAdvancedGameStatsInput = z.infer<
	typeof StatsGetAdvancedGameStatsInputSchema
>;

/** Either `year` or `team` is required. Spec query is year/team/week/opponent/seasonType — not conference. */
const StatsGetGameHavocStatsInputSchema = z
	.object({
		year: z.number().optional(),
		week: z.number().optional(),
		team: z.string().optional(),
		opponent: z.string().optional(),
		seasonType: SeasonTypeInputSchema,
	})
	.refine((value) => value.year !== undefined || value.team !== undefined, {
		message: 'Either year or team is required',
	});
export type StatsGetGameHavocStatsInput = z.infer<
	typeof StatsGetGameHavocStatsInputSchema
>;

const StatsGetPlayerSeasonStatsInputSchema = z.object({
	year: z.number(),
	conference: z.string().optional(),
	team: z.string().optional(),
	category: z.string().optional(),
	seasonType: SeasonTypeInputSchema,
});
export type StatsGetPlayerSeasonStatsInput = z.infer<
	typeof StatsGetPlayerSeasonStatsInputSchema
>;

/** Either `year` or `team` is required (confirmed from the spec's own parameter descriptions). */
const StatsGetTeamSeasonStatsInputSchema = z
	.object({
		year: z.number().optional(),
		team: z.string().optional(),
		conference: z.string().optional(),
		startWeek: z.number().optional(),
		endWeek: z.number().optional(),
	})
	.refine((value) => value.year !== undefined || value.team !== undefined, {
		message: 'Either year or team is required',
	});
export type StatsGetTeamSeasonStatsInput = z.infer<
	typeof StatsGetTeamSeasonStatsInputSchema
>;

/** Either `year` or `team` is required (confirmed from the spec's own parameter descriptions). */
const StatsGetAdvancedSeasonStatsInputSchema = z
	.object({
		year: z.number().optional(),
		team: z.string().optional(),
		excludeGarbageTime: z.boolean().optional(),
		startWeek: z.number().optional(),
		endWeek: z.number().optional(),
	})
	.refine((value) => value.year !== undefined || value.team !== undefined, {
		message: 'Either year or team is required',
	});
export type StatsGetAdvancedSeasonStatsInput = z.infer<
	typeof StatsGetAdvancedSeasonStatsInputSchema
>;

/* -------------------------------------------------------------------------- */
/* players                                                                     */
/* -------------------------------------------------------------------------- */

const PlayersSearchInputSchema = z.object({
	searchTerm: z.string().min(1),
	position: z.string().optional(),
	team: z.string().optional(),
	year: z.number().optional(),
});
export type PlayersSearchInput = z.infer<typeof PlayersSearchInputSchema>;

const PlayersGetUsageInputSchema = z.object({
	year: z.number(),
	conference: z.string().optional(),
	position: z.string().optional(),
	team: z.string().optional(),
	playerId: z.string().optional(),
	excludeGarbageTime: z.boolean().optional(),
});
export type PlayersGetUsageInput = z.infer<typeof PlayersGetUsageInputSchema>;

/** Either `year` or `team` is required (confirmed from the spec's own parameter descriptions). */
const PlayersGetReturningProductionInputSchema = z
	.object({
		year: z.number().optional(),
		team: z.string().optional(),
		conference: z.string().optional(),
	})
	.refine((value) => value.year !== undefined || value.team !== undefined, {
		message: 'Either year or team is required',
	});
export type PlayersGetReturningProductionInput = z.infer<
	typeof PlayersGetReturningProductionInputSchema
>;

const PlayersListTransferPortalInputSchema = z.object({
	year: z.number(),
});
export type PlayersListTransferPortalInput = z.infer<
	typeof PlayersListTransferPortalInputSchema
>;

/* -------------------------------------------------------------------------- */
/* teams                                                                       */
/* -------------------------------------------------------------------------- */

const TeamsListInputSchema = z.object({
	conference: z.string().optional(),
	year: z.number().optional(),
});
export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

const TeamsListFBSInputSchema = z.object({
	year: z.number().optional(),
});
export type TeamsListFBSInput = z.infer<typeof TeamsListFBSInputSchema>;

/**
 * There is no `/teams/fcs` route. OpenAPI 5.24.0 `GET /teams` only documents
 * `conference` and `year`; a live `classification=fcs` query is ignored
 * (same 672-row mixed list as the unfiltered call). Filter client-side.
 */
const TeamsListFCSInputSchema = z.object({
	conference: z.string().optional(),
	year: z.number().optional(),
});
export type TeamsListFCSInput = z.infer<typeof TeamsListFCSInputSchema>;

const TeamsGetATSRecordsInputSchema = z.object({
	year: z.number().optional(),
	team: z.string().optional(),
	conference: z.string().optional(),
});
export type TeamsGetATSRecordsInput = z.infer<
	typeof TeamsGetATSRecordsInputSchema
>;

const TeamsGetMatchupInputSchema = z.object({
	team1: z.string().min(1),
	team2: z.string().min(1),
	minYear: z.number().optional(),
	maxYear: z.number().optional(),
});
export type TeamsGetMatchupInput = z.infer<typeof TeamsGetMatchupInputSchema>;

const TeamsGetRecordsInputSchema = z.object({
	year: z.number(),
	team: z.string().optional(),
	conference: z.string().optional(),
});
export type TeamsGetRecordsInput = z.infer<typeof TeamsGetRecordsInputSchema>;

const TeamsGetRosterInputSchema = z.object({
	team: z.string().optional(),
	year: z.number().optional(),
	classification: z.enum(['fbs', 'fcs']).optional(),
});
export type TeamsGetRosterInput = z.infer<typeof TeamsGetRosterInputSchema>;

/* -------------------------------------------------------------------------- */
/* conferences                                                                 */
/* -------------------------------------------------------------------------- */

const ConferencesListInputSchema = z.object({});
export type ConferencesListInput = z.infer<typeof ConferencesListInputSchema>;

/**
 * Shared by `CONFERENCE_MEMBERSHIPS_HISTORY` and `DIVISIONS_BY_CONFERENCE` -
 * both catalog operations read `GET /conferences/affiliations`, whose
 * response (`TeamConferenceAffiliation`) carries both the team's conference
 * membership *and* its division, each with `startYear`/`endYear`. Confirmed
 * from the response schema, not guessed.
 */
const ConferencesListAffiliationsInputSchema = z.object({
	team: z.string().optional(),
	conference: z.string().optional(),
	year: z.number().optional(),
	minYear: z.number().optional(),
	maxYear: z.number().optional(),
	classification: ClassificationInputSchema,
});
export type ConferencesListAffiliationsInput = z.infer<
	typeof ConferencesListAffiliationsInputSchema
>;

/* -------------------------------------------------------------------------- */
/* coaches                                                                     */
/* -------------------------------------------------------------------------- */

const CoachesListInputSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	team: z.string().optional(),
	year: z.number().optional(),
	minYear: z.number().optional(),
	maxYear: z.number().optional(),
});
export type CoachesListInput = z.infer<typeof CoachesListInputSchema>;

/* -------------------------------------------------------------------------- */
/* venues                                                                      */
/* -------------------------------------------------------------------------- */

const VenuesListInputSchema = z.object({});
export type VenuesListInput = z.infer<typeof VenuesListInputSchema>;

/* -------------------------------------------------------------------------- */
/* recruiting                                                                  */
/* -------------------------------------------------------------------------- */

/** Either `year` or `team` is required (confirmed from the spec's own parameter descriptions). */
const RecruitingListRecruitsInputSchema = z
	.object({
		year: z.number().optional(),
		team: z.string().optional(),
		classification: z.string().optional(),
		position: z.string().optional(),
		state: z.string().optional(),
	})
	.refine((value) => value.year !== undefined || value.team !== undefined, {
		message: 'Either year or team is required',
	});
export type RecruitingListRecruitsInput = z.infer<
	typeof RecruitingListRecruitsInputSchema
>;

const RecruitingGetTeamRankingsInputSchema = z.object({
	year: z.number().optional(),
	team: z.string().optional(),
});
export type RecruitingGetTeamRankingsInput = z.infer<
	typeof RecruitingGetTeamRankingsInputSchema
>;

const RecruitingGetGroupRatingsInputSchema = z.object({
	team: z.string().optional(),
	conference: z.string().optional(),
	recruitType: z.string().optional(),
	startYear: z.number().optional(),
	endYear: z.number().optional(),
});
export type RecruitingGetGroupRatingsInput = z.infer<
	typeof RecruitingGetGroupRatingsInputSchema
>;

const RecruitingGetTeamTalentInputSchema = z.object({
	year: z.number(),
});
export type RecruitingGetTeamTalentInput = z.infer<
	typeof RecruitingGetTeamTalentInputSchema
>;

/* -------------------------------------------------------------------------- */
/* rankings                                                                    */
/* -------------------------------------------------------------------------- */

const RankingsListInputSchema = z.object({
	year: z.number(),
	seasonType: SeasonTypeInputSchema,
	week: z.number().optional(),
});
export type RankingsListInput = z.infer<typeof RankingsListInputSchema>;

/* -------------------------------------------------------------------------- */
/* betting                                                                     */
/* -------------------------------------------------------------------------- */

/** `year` is required unless `gameId` is specified (confirmed from the spec's own parameter description). */
const BettingGetLinesInputSchema = z
	.object({
		gameId: z.number().optional(),
		year: z.number().optional(),
		seasonType: SeasonTypeInputSchema,
		week: z.number().optional(),
		team: z.string().optional(),
		home: z.string().optional(),
		away: z.string().optional(),
		conference: z.string().optional(),
		classification: ClassificationInputSchema,
		provider: z.string().optional(),
	})
	.refine((value) => value.gameId !== undefined || value.year !== undefined, {
		message: 'Either gameId or year is required',
	});
export type BettingGetLinesInput = z.infer<typeof BettingGetLinesInputSchema>;

/* -------------------------------------------------------------------------- */
/* draft                                                                       */
/* -------------------------------------------------------------------------- */

const DraftListPicksInputSchema = z.object({
	year: z.number().optional(),
	team: z.string().optional(),
	school: z.string().optional(),
	conference: z.string().optional(),
	position: z.string().optional(),
});
export type DraftListPicksInput = z.infer<typeof DraftListPicksInputSchema>;

const DraftListPositionsInputSchema = z.object({});
export type DraftListPositionsInput = z.infer<
	typeof DraftListPositionsInputSchema
>;

const DraftListTeamsInputSchema = z.object({});
export type DraftListTeamsInput = z.infer<typeof DraftListTeamsInputSchema>;

/* -------------------------------------------------------------------------- */
/* seasonTypes (static, no request)                                          */
/* -------------------------------------------------------------------------- */

const SeasonTypesListInputSchema = z.object({
	year: z.number().optional(),
});
export type SeasonTypesListInput = z.infer<typeof SeasonTypesListInputSchema>;

/* -------------------------------------------------------------------------- */
/* account                                                                     */
/* -------------------------------------------------------------------------- */

const AccountGetUserInfoInputSchema = z.object({});
export type AccountGetUserInfoInput = z.infer<
	typeof AccountGetUserInfoInputSchema
>;

/* -------------------------------------------------------------------------- */
/* input/output maps                                                          */
/* -------------------------------------------------------------------------- */

export type CollegeFootballDataEndpointInputs = {
	gamesGetGamesAndResults: GamesGetGamesAndResultsInput;
	gamesGetMedia: GamesGetMediaInput;
	gamesGetTeamStats: GamesGetTeamStatsInput;
	gamesGetPlayerStats: GamesGetPlayerStatsInput;
	gamesGetAdvancedBoxScore: GamesGetAdvancedBoxScoreInput;
	drivesList: DrivesListInput;
	playsList: PlaysListInput;
	playsListStats: PlaysListStatsInput;
	playsListStatTypes: PlaysListStatTypesInput;
	playsListTypes: PlaysListTypesInput;
	metricsGetFieldGoalExpectedPoints: MetricsGetFieldGoalExpectedPointsInput;
	metricsGetWinProbability: MetricsGetWinProbabilityInput;
	metricsGetPregameWinProbabilities: MetricsGetPregameWinProbabilitiesInput;
	ppaGetByTeamSeason: PpaGetByTeamSeasonInput;
	ppaGetByTeamGame: PpaGetByTeamGameInput;
	ppaGetByPlayerSeason: PpaGetByPlayerSeasonInput;
	ppaGetByPlayerGame: PpaGetByPlayerGameInput;
	ppaGetPredictedPoints: PpaGetPredictedPointsInput;
	ratingsGetElo: RatingsGetEloInput;
	ratingsGetFPI: RatingsGetFPIInput;
	ratingsGetSP: RatingsGetSPInput;
	ratingsGetConferenceSP: RatingsGetConferenceSPInput;
	ratingsGetSRS: RatingsGetSRSInput;
	statsListCategories: StatsListCategoriesInput;
	statsGetAdvancedGameStats: StatsGetAdvancedGameStatsInput;
	statsGetGameHavocStats: StatsGetGameHavocStatsInput;
	statsGetPlayerSeasonStats: StatsGetPlayerSeasonStatsInput;
	statsGetTeamSeasonStats: StatsGetTeamSeasonStatsInput;
	statsGetAdvancedSeasonStats: StatsGetAdvancedSeasonStatsInput;
	playersSearch: PlayersSearchInput;
	playersGetUsage: PlayersGetUsageInput;
	playersGetReturningProduction: PlayersGetReturningProductionInput;
	playersListTransferPortal: PlayersListTransferPortalInput;
	teamsList: TeamsListInput;
	teamsListFBS: TeamsListFBSInput;
	teamsListFCS: TeamsListFCSInput;
	teamsGetATSRecords: TeamsGetATSRecordsInput;
	teamsGetMatchup: TeamsGetMatchupInput;
	teamsGetRecords: TeamsGetRecordsInput;
	teamsGetRoster: TeamsGetRosterInput;
	conferencesList: ConferencesListInput;
	conferencesListMemberships: ConferencesListAffiliationsInput;
	conferencesListDivisions: ConferencesListAffiliationsInput;
	coachesList: CoachesListInput;
	venuesList: VenuesListInput;
	recruitingListRecruits: RecruitingListRecruitsInput;
	recruitingGetTeamRankings: RecruitingGetTeamRankingsInput;
	recruitingGetGroupRatings: RecruitingGetGroupRatingsInput;
	recruitingGetTeamTalent: RecruitingGetTeamTalentInput;
	rankingsList: RankingsListInput;
	bettingGetLines: BettingGetLinesInput;
	draftListPicks: DraftListPicksInput;
	draftListPositions: DraftListPositionsInput;
	draftListTeams: DraftListTeamsInput;
	seasonTypesList: SeasonTypesListInput;
	accountGetUserInfo: AccountGetUserInfoInput;
};

export type CollegeFootballDataEndpointOutputs = {
	gamesGetGamesAndResults: CollegeFootballDataGame[];
	gamesGetMedia: CollegeFootballDataGameMedia[];
	gamesGetTeamStats: CollegeFootballDataGameTeamStats[];
	gamesGetPlayerStats: CollegeFootballDataGameTeamStats[];
	gamesGetAdvancedBoxScore: CollegeFootballDataAdvancedBoxScore;
	drivesList: CollegeFootballDataDrive[];
	playsList: CollegeFootballDataPlay[];
	playsListStats: CollegeFootballDataPlayStat[];
	playsListStatTypes: CollegeFootballDataPlayType[];
	playsListTypes: CollegeFootballDataPlayType[];
	metricsGetFieldGoalExpectedPoints: CollegeFootballDataFieldGoalEP[];
	metricsGetWinProbability: CollegeFootballDataWinProbability[];
	metricsGetPregameWinProbabilities: CollegeFootballDataPregameWinProbability[];
	ppaGetByTeamSeason: CollegeFootballDataTeamPPA[];
	ppaGetByTeamGame: CollegeFootballDataTeamGamePPA[];
	ppaGetByPlayerSeason: CollegeFootballDataPlayerSeasonPPA[];
	ppaGetByPlayerGame: CollegeFootballDataPlayerGamePPA[];
	ppaGetPredictedPoints: CollegeFootballDataPredictedPoints[];
	ratingsGetElo: CollegeFootballDataEloRating[];
	ratingsGetFPI: CollegeFootballDataFPIRating[];
	ratingsGetSP: CollegeFootballDataSPRating[];
	ratingsGetConferenceSP: CollegeFootballDataConferenceSPRating[];
	ratingsGetSRS: CollegeFootballDataSRSRating[];
	statsListCategories: string[];
	statsGetAdvancedGameStats: CollegeFootballDataAdvancedStats[];
	statsGetGameHavocStats: CollegeFootballDataGameHavocStats[];
	statsGetPlayerSeasonStats: CollegeFootballDataPlayerSeasonStat[];
	statsGetTeamSeasonStats: CollegeFootballDataTeamSeasonStat[];
	statsGetAdvancedSeasonStats: CollegeFootballDataAdvancedStats[];
	playersSearch: CollegeFootballDataPlayerSearchResult[];
	playersGetUsage: CollegeFootballDataPlayerUsage[];
	playersGetReturningProduction: CollegeFootballDataReturningProduction[];
	playersListTransferPortal: CollegeFootballDataTransferPortalEntry[];
	teamsList: CollegeFootballDataTeam[];
	teamsListFBS: CollegeFootballDataTeam[];
	teamsListFCS: CollegeFootballDataTeam[];
	teamsGetATSRecords: CollegeFootballDataTeamATSRecord[];
	teamsGetMatchup: CollegeFootballDataTeamMatchup;
	teamsGetRecords: CollegeFootballDataTeamRecord[];
	teamsGetRoster: CollegeFootballDataRosterPlayer[];
	conferencesList: CollegeFootballDataConference[];
	conferencesListMemberships: CollegeFootballDataTeamConferenceAffiliation[];
	conferencesListDivisions: CollegeFootballDataTeamConferenceAffiliation[];
	coachesList: CollegeFootballDataCoach[];
	venuesList: CollegeFootballDataVenue[];
	recruitingListRecruits: CollegeFootballDataRecruit[];
	recruitingGetTeamRankings: CollegeFootballDataTeamRecruitingRanking[];
	recruitingGetGroupRatings: CollegeFootballDataRecruitingGroup[];
	recruitingGetTeamTalent: CollegeFootballDataTeamTalent[];
	rankingsList: CollegeFootballDataRankingWeek[];
	bettingGetLines: CollegeFootballDataBettingLineGame[];
	draftListPicks: CollegeFootballDataDraftPick[];
	draftListPositions: CollegeFootballDataDraftPosition[];
	draftListTeams: CollegeFootballDataDraftTeam[];
	seasonTypesList: CollegeFootballDataSeasonType[];
	accountGetUserInfo: CollegeFootballDataUserInfo;
};

export const CollegeFootballDataEndpointInputSchemas = {
	gamesGetGamesAndResults: GamesGetGamesAndResultsInputSchema,
	gamesGetMedia: GamesGetMediaInputSchema,
	gamesGetTeamStats: GamesGetTeamStatsInputSchema,
	gamesGetPlayerStats: GamesGetPlayerStatsInputSchema,
	gamesGetAdvancedBoxScore: GamesGetAdvancedBoxScoreInputSchema,
	drivesList: DrivesListInputSchema,
	playsList: PlaysListInputSchema,
	playsListStats: PlaysListStatsInputSchema,
	playsListStatTypes: PlaysListStatTypesInputSchema,
	playsListTypes: PlaysListTypesInputSchema,
	metricsGetFieldGoalExpectedPoints:
		MetricsGetFieldGoalExpectedPointsInputSchema,
	metricsGetWinProbability: MetricsGetWinProbabilityInputSchema,
	metricsGetPregameWinProbabilities:
		MetricsGetPregameWinProbabilitiesInputSchema,
	ppaGetByTeamSeason: PpaGetByTeamSeasonInputSchema,
	ppaGetByTeamGame: PpaGetByTeamGameInputSchema,
	ppaGetByPlayerSeason: PpaGetByPlayerSeasonInputSchema,
	ppaGetByPlayerGame: PpaGetByPlayerGameInputSchema,
	ppaGetPredictedPoints: PpaGetPredictedPointsInputSchema,
	ratingsGetElo: RatingsGetEloInputSchema,
	ratingsGetFPI: RatingsGetFPIInputSchema,
	ratingsGetSP: RatingsGetSPInputSchema,
	ratingsGetConferenceSP: RatingsGetConferenceSPInputSchema,
	ratingsGetSRS: RatingsGetSRSInputSchema,
	statsListCategories: StatsListCategoriesInputSchema,
	statsGetAdvancedGameStats: StatsGetAdvancedGameStatsInputSchema,
	statsGetGameHavocStats: StatsGetGameHavocStatsInputSchema,
	statsGetPlayerSeasonStats: StatsGetPlayerSeasonStatsInputSchema,
	statsGetTeamSeasonStats: StatsGetTeamSeasonStatsInputSchema,
	statsGetAdvancedSeasonStats: StatsGetAdvancedSeasonStatsInputSchema,
	playersSearch: PlayersSearchInputSchema,
	playersGetUsage: PlayersGetUsageInputSchema,
	playersGetReturningProduction: PlayersGetReturningProductionInputSchema,
	playersListTransferPortal: PlayersListTransferPortalInputSchema,
	teamsList: TeamsListInputSchema,
	teamsListFBS: TeamsListFBSInputSchema,
	teamsListFCS: TeamsListFCSInputSchema,
	teamsGetATSRecords: TeamsGetATSRecordsInputSchema,
	teamsGetMatchup: TeamsGetMatchupInputSchema,
	teamsGetRecords: TeamsGetRecordsInputSchema,
	teamsGetRoster: TeamsGetRosterInputSchema,
	conferencesList: ConferencesListInputSchema,
	conferencesListMemberships: ConferencesListAffiliationsInputSchema,
	conferencesListDivisions: ConferencesListAffiliationsInputSchema,
	coachesList: CoachesListInputSchema,
	venuesList: VenuesListInputSchema,
	recruitingListRecruits: RecruitingListRecruitsInputSchema,
	recruitingGetTeamRankings: RecruitingGetTeamRankingsInputSchema,
	recruitingGetGroupRatings: RecruitingGetGroupRatingsInputSchema,
	recruitingGetTeamTalent: RecruitingGetTeamTalentInputSchema,
	rankingsList: RankingsListInputSchema,
	bettingGetLines: BettingGetLinesInputSchema,
	draftListPicks: DraftListPicksInputSchema,
	draftListPositions: DraftListPositionsInputSchema,
	draftListTeams: DraftListTeamsInputSchema,
	seasonTypesList: SeasonTypesListInputSchema,
	accountGetUserInfo: AccountGetUserInfoInputSchema,
} as const;

export const CollegeFootballDataEndpointOutputSchemas = {
	gamesGetGamesAndResults: z.array(CollegeFootballDataGameSchema),
	gamesGetMedia: z.array(CollegeFootballDataGameMediaSchema),
	gamesGetTeamStats: z.array(CollegeFootballDataGameTeamStatsSchema),
	gamesGetPlayerStats: z.array(CollegeFootballDataGameTeamStatsSchema),
	gamesGetAdvancedBoxScore: CollegeFootballDataAdvancedBoxScoreSchema,
	drivesList: z.array(CollegeFootballDataDriveSchema),
	playsList: z.array(CollegeFootballDataPlaySchema),
	playsListStats: z.array(CollegeFootballDataPlayStatSchema),
	playsListStatTypes: z.array(CollegeFootballDataPlayTypeSchema),
	playsListTypes: z.array(CollegeFootballDataPlayTypeSchema),
	metricsGetFieldGoalExpectedPoints: z.array(
		CollegeFootballDataFieldGoalEPSchema,
	),
	metricsGetWinProbability: z.array(CollegeFootballDataWinProbabilitySchema),
	metricsGetPregameWinProbabilities: z.array(
		CollegeFootballDataPregameWinProbabilitySchema,
	),
	ppaGetByTeamSeason: z.array(CollegeFootballDataTeamPPASchema),
	ppaGetByTeamGame: z.array(CollegeFootballDataTeamGamePPASchema),
	ppaGetByPlayerSeason: z.array(CollegeFootballDataPlayerSeasonPPASchema),
	ppaGetByPlayerGame: z.array(CollegeFootballDataPlayerGamePPASchema),
	ppaGetPredictedPoints: z.array(CollegeFootballDataPredictedPointsSchema),
	ratingsGetElo: z.array(CollegeFootballDataEloRatingSchema),
	ratingsGetFPI: z.array(CollegeFootballDataFPIRatingSchema),
	ratingsGetSP: z.array(CollegeFootballDataSPRatingSchema),
	ratingsGetConferenceSP: z.array(CollegeFootballDataConferenceSPRatingSchema),
	ratingsGetSRS: z.array(CollegeFootballDataSRSRatingSchema),
	statsListCategories: z.array(CollegeFootballDataStatCategorySchema),
	statsGetAdvancedGameStats: z.array(CollegeFootballDataAdvancedStatsSchema),
	statsGetGameHavocStats: z.array(CollegeFootballDataGameHavocStatsSchema),
	statsGetPlayerSeasonStats: z.array(CollegeFootballDataPlayerSeasonStatSchema),
	statsGetTeamSeasonStats: z.array(CollegeFootballDataTeamSeasonStatSchema),
	statsGetAdvancedSeasonStats: z.array(CollegeFootballDataAdvancedStatsSchema),
	playersSearch: z.array(CollegeFootballDataPlayerSearchResultSchema),
	playersGetUsage: z.array(CollegeFootballDataPlayerUsageSchema),
	playersGetReturningProduction: z.array(
		CollegeFootballDataReturningProductionSchema,
	),
	playersListTransferPortal: z.array(
		CollegeFootballDataTransferPortalEntrySchema,
	),
	teamsList: z.array(CollegeFootballDataTeamSchema),
	teamsListFBS: z.array(CollegeFootballDataTeamSchema),
	teamsListFCS: z.array(CollegeFootballDataTeamSchema),
	teamsGetATSRecords: z.array(CollegeFootballDataTeamATSRecordSchema),
	teamsGetMatchup: CollegeFootballDataTeamMatchupSchema,
	teamsGetRecords: z.array(CollegeFootballDataTeamRecordSchema),
	teamsGetRoster: z.array(CollegeFootballDataRosterPlayerSchema),
	conferencesList: z.array(CollegeFootballDataConferenceSchema),
	conferencesListMemberships: z.array(
		CollegeFootballDataTeamConferenceAffiliationSchema,
	),
	conferencesListDivisions: z.array(
		CollegeFootballDataTeamConferenceAffiliationSchema,
	),
	coachesList: z.array(CollegeFootballDataCoachSchema),
	venuesList: z.array(CollegeFootballDataVenueSchema),
	recruitingListRecruits: z.array(CollegeFootballDataRecruitSchema),
	recruitingGetTeamRankings: z.array(
		CollegeFootballDataTeamRecruitingRankingSchema,
	),
	recruitingGetGroupRatings: z.array(CollegeFootballDataRecruitingGroupSchema),
	recruitingGetTeamTalent: z.array(CollegeFootballDataTeamTalentSchema),
	rankingsList: z.array(CollegeFootballDataRankingWeekSchema),
	bettingGetLines: z.array(CollegeFootballDataBettingLineGameSchema),
	draftListPicks: z.array(CollegeFootballDataDraftPickSchema),
	draftListPositions: z.array(CollegeFootballDataDraftPositionSchema),
	draftListTeams: z.array(CollegeFootballDataDraftTeamSchema),
	seasonTypesList: z.array(CollegeFootballDataSeasonTypeSchema),
	accountGetUserInfo: CollegeFootballDataUserInfoSchema,
} as const;

export { SEASON_TYPES };
