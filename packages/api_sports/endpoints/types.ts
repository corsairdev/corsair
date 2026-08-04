import { z } from 'zod';

/** Query params vary per sport API; callers pass documented filter fields. */
export const ApiSportsQueryInputSchema = z
	.record(
		z.string(),
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.array(z.union([z.string(), z.number()])),
		]),
	)
	.optional();

export type ApiSportsQueryInput = z.infer<typeof ApiSportsQueryInputSchema>;

export const ApiSportsResponseSchema = z
	.object({
		get: z.string().optional(),
		parameters: z
			.union([z.record(z.string(), z.unknown()), z.array(z.unknown())])
			.optional(),
		// Live API returns [] on success and `{ token|endpoint: string }` on failure.
		errors: z
			.union([z.array(z.unknown()), z.record(z.string(), z.unknown())])
			.optional(),
		results: z.number().optional(),
		paging: z
			.object({
				current: z.number().optional(),
				total: z.number().optional(),
			})
			.optional(),
		response: z.unknown(),
	})
	.loose();

export type ApiSportsResponse = z.infer<typeof ApiSportsResponseSchema>;

export type ApiSportsEndpointInputs = {
	getCountries: ApiSportsQueryInput;
	getTimezone: ApiSportsQueryInput;
	getLeagues: ApiSportsQueryInput;
	getLeagueSeasons: ApiSportsQueryInput;
	getTeams: ApiSportsQueryInput;
	getTeamSeasons: ApiSportsQueryInput;
	getTeamStatistics: ApiSportsQueryInput;
	getVenues: ApiSportsQueryInput;
	getCoaches: ApiSportsQueryInput;
	getInjuries: ApiSportsQueryInput;
	getSidelined: ApiSportsQueryInput;
	getTransfers: ApiSportsQueryInput;
	getTrophies: ApiSportsQueryInput;
	getPredictions: ApiSportsQueryInput;
	getFixtures: ApiSportsQueryInput;
	getFixturesRounds: ApiSportsQueryInput;
	getHeadToHeadFixtures: ApiSportsQueryInput;
	getFixtureLineups: ApiSportsQueryInput;
	getFixtureStatistics: ApiSportsQueryInput;
	getFixturesEvents: ApiSportsQueryInput;
	getFixturesPlayers: ApiSportsQueryInput;
	getStandingsStages: ApiSportsQueryInput;
	getStandingsGroups: ApiSportsQueryInput;
	getStandingsDivisions: ApiSportsQueryInput;
	getNflStandingsConferences: ApiSportsQueryInput;
	getPlayers: ApiSportsQueryInput;
	getPlayersProfiles: ApiSportsQueryInput;
	getPlayersSeasons: ApiSportsQueryInput;
	getPlayersSquads: ApiSportsQueryInput;
	getPlayersTeams: ApiSportsQueryInput;
	getPlayersTopScorers: ApiSportsQueryInput;
	getPlayersTopAssists: ApiSportsQueryInput;
	getPlayersTopYellowCards: ApiSportsQueryInput;
	getPlayersTopRedCards: ApiSportsQueryInput;
	getOdds: ApiSportsQueryInput;
	getOddsBets: ApiSportsQueryInput;
	getOddsBookmakers: ApiSportsQueryInput;
	getOddsMapping: ApiSportsQueryInput;
	getInPlayOdds: ApiSportsQueryInput;
	getLiveOddsBets: ApiSportsQueryInput;
	getBasketballStatistics: ApiSportsQueryInput;
	getBasketballBets: ApiSportsQueryInput;
	getBasketballBookmakers: ApiSportsQueryInput;
	getNbaGameStatistics: ApiSportsQueryInput;
	getPlayerStatistics: ApiSportsQueryInput;
	getGameStatisticsByTeams: ApiSportsQueryInput;
	getGamesEvents: ApiSportsQueryInput;
	getAflSeasons: ApiSportsQueryInput;
	getAflGames: ApiSportsQueryInput;
	getAflGamesQuarters: ApiSportsQueryInput;
	getAflGamePlayerStatistics: ApiSportsQueryInput;
	getAflStandings: ApiSportsQueryInput;
	getBaseballGamesHeadToHead: ApiSportsQueryInput;
	getFormula1Circuits: ApiSportsQueryInput;
	getFormula1Competitions: ApiSportsQueryInput;
	getFormula1Races: ApiSportsQueryInput;
	getFormula1DriverRankings: ApiSportsQueryInput;
	getFormula1TeamRankings: ApiSportsQueryInput;
	getFormula1StartingGrid: ApiSportsQueryInput;
	getFastestLapsRankings: ApiSportsQueryInput;
	getRaceRankings: ApiSportsQueryInput;
	getMmaCategories: ApiSportsQueryInput;
	getMmaFighters: ApiSportsQueryInput;
	getMmaFights: ApiSportsQueryInput;
	getMmaFightResults: ApiSportsQueryInput;
	getMmaFighterStatistics: ApiSportsQueryInput;
	getFightersRecords: ApiSportsQueryInput;
};

export type ApiSportsEndpointOutputs = {
	getCountries: ApiSportsResponse;
	getTimezone: ApiSportsResponse;
	getLeagues: ApiSportsResponse;
	getLeagueSeasons: ApiSportsResponse;
	getTeams: ApiSportsResponse;
	getTeamSeasons: ApiSportsResponse;
	getTeamStatistics: ApiSportsResponse;
	getVenues: ApiSportsResponse;
	getCoaches: ApiSportsResponse;
	getInjuries: ApiSportsResponse;
	getSidelined: ApiSportsResponse;
	getTransfers: ApiSportsResponse;
	getTrophies: ApiSportsResponse;
	getPredictions: ApiSportsResponse;
	getFixtures: ApiSportsResponse;
	getFixturesRounds: ApiSportsResponse;
	getHeadToHeadFixtures: ApiSportsResponse;
	getFixtureLineups: ApiSportsResponse;
	getFixtureStatistics: ApiSportsResponse;
	getFixturesEvents: ApiSportsResponse;
	getFixturesPlayers: ApiSportsResponse;
	getStandingsStages: ApiSportsResponse;
	getStandingsGroups: ApiSportsResponse;
	getStandingsDivisions: ApiSportsResponse;
	getNflStandingsConferences: ApiSportsResponse;
	getPlayers: ApiSportsResponse;
	getPlayersProfiles: ApiSportsResponse;
	getPlayersSeasons: ApiSportsResponse;
	getPlayersSquads: ApiSportsResponse;
	getPlayersTeams: ApiSportsResponse;
	getPlayersTopScorers: ApiSportsResponse;
	getPlayersTopAssists: ApiSportsResponse;
	getPlayersTopYellowCards: ApiSportsResponse;
	getPlayersTopRedCards: ApiSportsResponse;
	getOdds: ApiSportsResponse;
	getOddsBets: ApiSportsResponse;
	getOddsBookmakers: ApiSportsResponse;
	getOddsMapping: ApiSportsResponse;
	getInPlayOdds: ApiSportsResponse;
	getLiveOddsBets: ApiSportsResponse;
	getBasketballStatistics: ApiSportsResponse;
	getBasketballBets: ApiSportsResponse;
	getBasketballBookmakers: ApiSportsResponse;
	getNbaGameStatistics: ApiSportsResponse;
	getPlayerStatistics: ApiSportsResponse;
	getGameStatisticsByTeams: ApiSportsResponse;
	getGamesEvents: ApiSportsResponse;
	getAflSeasons: ApiSportsResponse;
	getAflGames: ApiSportsResponse;
	getAflGamesQuarters: ApiSportsResponse;
	getAflGamePlayerStatistics: ApiSportsResponse;
	getAflStandings: ApiSportsResponse;
	getBaseballGamesHeadToHead: ApiSportsResponse;
	getFormula1Circuits: ApiSportsResponse;
	getFormula1Competitions: ApiSportsResponse;
	getFormula1Races: ApiSportsResponse;
	getFormula1DriverRankings: ApiSportsResponse;
	getFormula1TeamRankings: ApiSportsResponse;
	getFormula1StartingGrid: ApiSportsResponse;
	getFastestLapsRankings: ApiSportsResponse;
	getRaceRankings: ApiSportsResponse;
	getMmaCategories: ApiSportsResponse;
	getMmaFighters: ApiSportsResponse;
	getMmaFights: ApiSportsResponse;
	getMmaFightResults: ApiSportsResponse;
	getMmaFighterStatistics: ApiSportsResponse;
	getFightersRecords: ApiSportsResponse;
};

export const ApiSportsEndpointInputSchemas = {
	getCountries: ApiSportsQueryInputSchema,
	getTimezone: ApiSportsQueryInputSchema,
	getLeagues: ApiSportsQueryInputSchema,
	getLeagueSeasons: ApiSportsQueryInputSchema,
	getTeams: ApiSportsQueryInputSchema,
	getTeamSeasons: ApiSportsQueryInputSchema,
	getTeamStatistics: ApiSportsQueryInputSchema,
	getVenues: ApiSportsQueryInputSchema,
	getCoaches: ApiSportsQueryInputSchema,
	getInjuries: ApiSportsQueryInputSchema,
	getSidelined: ApiSportsQueryInputSchema,
	getTransfers: ApiSportsQueryInputSchema,
	getTrophies: ApiSportsQueryInputSchema,
	getPredictions: ApiSportsQueryInputSchema,
	getFixtures: ApiSportsQueryInputSchema,
	getFixturesRounds: ApiSportsQueryInputSchema,
	getHeadToHeadFixtures: ApiSportsQueryInputSchema,
	getFixtureLineups: ApiSportsQueryInputSchema,
	getFixtureStatistics: ApiSportsQueryInputSchema,
	getFixturesEvents: ApiSportsQueryInputSchema,
	getFixturesPlayers: ApiSportsQueryInputSchema,
	getStandingsStages: ApiSportsQueryInputSchema,
	getStandingsGroups: ApiSportsQueryInputSchema,
	getStandingsDivisions: ApiSportsQueryInputSchema,
	getNflStandingsConferences: ApiSportsQueryInputSchema,
	getPlayers: ApiSportsQueryInputSchema,
	getPlayersProfiles: ApiSportsQueryInputSchema,
	getPlayersSeasons: ApiSportsQueryInputSchema,
	getPlayersSquads: ApiSportsQueryInputSchema,
	getPlayersTeams: ApiSportsQueryInputSchema,
	getPlayersTopScorers: ApiSportsQueryInputSchema,
	getPlayersTopAssists: ApiSportsQueryInputSchema,
	getPlayersTopYellowCards: ApiSportsQueryInputSchema,
	getPlayersTopRedCards: ApiSportsQueryInputSchema,
	getOdds: ApiSportsQueryInputSchema,
	getOddsBets: ApiSportsQueryInputSchema,
	getOddsBookmakers: ApiSportsQueryInputSchema,
	getOddsMapping: ApiSportsQueryInputSchema,
	getInPlayOdds: ApiSportsQueryInputSchema,
	getLiveOddsBets: ApiSportsQueryInputSchema,
	getBasketballStatistics: ApiSportsQueryInputSchema,
	getBasketballBets: ApiSportsQueryInputSchema,
	getBasketballBookmakers: ApiSportsQueryInputSchema,
	getNbaGameStatistics: ApiSportsQueryInputSchema,
	getPlayerStatistics: ApiSportsQueryInputSchema,
	getGameStatisticsByTeams: ApiSportsQueryInputSchema,
	getGamesEvents: ApiSportsQueryInputSchema,
	getAflSeasons: ApiSportsQueryInputSchema,
	getAflGames: ApiSportsQueryInputSchema,
	getAflGamesQuarters: ApiSportsQueryInputSchema,
	getAflGamePlayerStatistics: ApiSportsQueryInputSchema,
	getAflStandings: ApiSportsQueryInputSchema,
	getBaseballGamesHeadToHead: ApiSportsQueryInputSchema,
	getFormula1Circuits: ApiSportsQueryInputSchema,
	getFormula1Competitions: ApiSportsQueryInputSchema,
	getFormula1Races: ApiSportsQueryInputSchema,
	getFormula1DriverRankings: ApiSportsQueryInputSchema,
	getFormula1TeamRankings: ApiSportsQueryInputSchema,
	getFormula1StartingGrid: ApiSportsQueryInputSchema,
	getFastestLapsRankings: ApiSportsQueryInputSchema,
	getRaceRankings: ApiSportsQueryInputSchema,
	getMmaCategories: ApiSportsQueryInputSchema,
	getMmaFighters: ApiSportsQueryInputSchema,
	getMmaFights: ApiSportsQueryInputSchema,
	getMmaFightResults: ApiSportsQueryInputSchema,
	getMmaFighterStatistics: ApiSportsQueryInputSchema,
	getFightersRecords: ApiSportsQueryInputSchema,
} as const;

export const ApiSportsEndpointOutputSchemas = {
	getCountries: ApiSportsResponseSchema,
	getTimezone: ApiSportsResponseSchema,
	getLeagues: ApiSportsResponseSchema,
	getLeagueSeasons: ApiSportsResponseSchema,
	getTeams: ApiSportsResponseSchema,
	getTeamSeasons: ApiSportsResponseSchema,
	getTeamStatistics: ApiSportsResponseSchema,
	getVenues: ApiSportsResponseSchema,
	getCoaches: ApiSportsResponseSchema,
	getInjuries: ApiSportsResponseSchema,
	getSidelined: ApiSportsResponseSchema,
	getTransfers: ApiSportsResponseSchema,
	getTrophies: ApiSportsResponseSchema,
	getPredictions: ApiSportsResponseSchema,
	getFixtures: ApiSportsResponseSchema,
	getFixturesRounds: ApiSportsResponseSchema,
	getHeadToHeadFixtures: ApiSportsResponseSchema,
	getFixtureLineups: ApiSportsResponseSchema,
	getFixtureStatistics: ApiSportsResponseSchema,
	getFixturesEvents: ApiSportsResponseSchema,
	getFixturesPlayers: ApiSportsResponseSchema,
	getStandingsStages: ApiSportsResponseSchema,
	getStandingsGroups: ApiSportsResponseSchema,
	getStandingsDivisions: ApiSportsResponseSchema,
	getNflStandingsConferences: ApiSportsResponseSchema,
	getPlayers: ApiSportsResponseSchema,
	getPlayersProfiles: ApiSportsResponseSchema,
	getPlayersSeasons: ApiSportsResponseSchema,
	getPlayersSquads: ApiSportsResponseSchema,
	getPlayersTeams: ApiSportsResponseSchema,
	getPlayersTopScorers: ApiSportsResponseSchema,
	getPlayersTopAssists: ApiSportsResponseSchema,
	getPlayersTopYellowCards: ApiSportsResponseSchema,
	getPlayersTopRedCards: ApiSportsResponseSchema,
	getOdds: ApiSportsResponseSchema,
	getOddsBets: ApiSportsResponseSchema,
	getOddsBookmakers: ApiSportsResponseSchema,
	getOddsMapping: ApiSportsResponseSchema,
	getInPlayOdds: ApiSportsResponseSchema,
	getLiveOddsBets: ApiSportsResponseSchema,
	getBasketballStatistics: ApiSportsResponseSchema,
	getBasketballBets: ApiSportsResponseSchema,
	getBasketballBookmakers: ApiSportsResponseSchema,
	getNbaGameStatistics: ApiSportsResponseSchema,
	getPlayerStatistics: ApiSportsResponseSchema,
	getGameStatisticsByTeams: ApiSportsResponseSchema,
	getGamesEvents: ApiSportsResponseSchema,
	getAflSeasons: ApiSportsResponseSchema,
	getAflGames: ApiSportsResponseSchema,
	getAflGamesQuarters: ApiSportsResponseSchema,
	getAflGamePlayerStatistics: ApiSportsResponseSchema,
	getAflStandings: ApiSportsResponseSchema,
	getBaseballGamesHeadToHead: ApiSportsResponseSchema,
	getFormula1Circuits: ApiSportsResponseSchema,
	getFormula1Competitions: ApiSportsResponseSchema,
	getFormula1Races: ApiSportsResponseSchema,
	getFormula1DriverRankings: ApiSportsResponseSchema,
	getFormula1TeamRankings: ApiSportsResponseSchema,
	getFormula1StartingGrid: ApiSportsResponseSchema,
	getFastestLapsRankings: ApiSportsResponseSchema,
	getRaceRankings: ApiSportsResponseSchema,
	getMmaCategories: ApiSportsResponseSchema,
	getMmaFighters: ApiSportsResponseSchema,
	getMmaFights: ApiSportsResponseSchema,
	getMmaFightResults: ApiSportsResponseSchema,
	getMmaFighterStatistics: ApiSportsResponseSchema,
	getFightersRecords: ApiSportsResponseSchema,
} as const;
