import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import * as Afl from './endpoints/afl';
import * as Baseball from './endpoints/baseball';
import * as Basketball from './endpoints/basketball';
import * as Core from './endpoints/core';
import * as Fixtures from './endpoints/fixtures';
import * as Formula1 from './endpoints/formula1';
import * as Mma from './endpoints/mma';
import * as Odds from './endpoints/odds';
import * as Players from './endpoints/players';
import * as Standings from './endpoints/standings';
import type {
	ApiSportsEndpointInputs,
	ApiSportsEndpointOutputs,
} from './endpoints/types';
import {
	ApiSportsEndpointInputSchemas,
	ApiSportsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApiSportsSchema } from './schema';

export type ApiSportsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalApiSportsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apiSportsEndpointsNested>;
};

export type ApiSportsContext = CorsairPluginContext<
	typeof ApiSportsSchema,
	ApiSportsPluginOptions
>;

export type ApiSportsKeyBuilderContext =
	KeyBuilderContext<ApiSportsPluginOptions>;

export type ApiSportsBoundEndpoints = BindEndpoints<
	typeof apiSportsEndpointsNested
>;

type ApiSportsEndpoint<K extends keyof ApiSportsEndpointOutputs> =
	CorsairEndpoint<
		ApiSportsContext,
		ApiSportsEndpointInputs[K],
		ApiSportsEndpointOutputs[K]
	>;

export type ApiSportsEndpoints = {
	getCountries: ApiSportsEndpoint<'getCountries'>;
	getTimezone: ApiSportsEndpoint<'getTimezone'>;
	getLeagues: ApiSportsEndpoint<'getLeagues'>;
	getLeagueSeasons: ApiSportsEndpoint<'getLeagueSeasons'>;
	getTeams: ApiSportsEndpoint<'getTeams'>;
	getTeamSeasons: ApiSportsEndpoint<'getTeamSeasons'>;
	getTeamStatistics: ApiSportsEndpoint<'getTeamStatistics'>;
	getVenues: ApiSportsEndpoint<'getVenues'>;
	getCoaches: ApiSportsEndpoint<'getCoaches'>;
	getInjuries: ApiSportsEndpoint<'getInjuries'>;
	getSidelined: ApiSportsEndpoint<'getSidelined'>;
	getTransfers: ApiSportsEndpoint<'getTransfers'>;
	getTrophies: ApiSportsEndpoint<'getTrophies'>;
	getPredictions: ApiSportsEndpoint<'getPredictions'>;
	getFixtures: ApiSportsEndpoint<'getFixtures'>;
	getFixturesRounds: ApiSportsEndpoint<'getFixturesRounds'>;
	getHeadToHeadFixtures: ApiSportsEndpoint<'getHeadToHeadFixtures'>;
	getFixtureLineups: ApiSportsEndpoint<'getFixtureLineups'>;
	getFixtureStatistics: ApiSportsEndpoint<'getFixtureStatistics'>;
	getFixturesEvents: ApiSportsEndpoint<'getFixturesEvents'>;
	getFixturesPlayers: ApiSportsEndpoint<'getFixturesPlayers'>;
	getStandingsStages: ApiSportsEndpoint<'getStandingsStages'>;
	getStandingsGroups: ApiSportsEndpoint<'getStandingsGroups'>;
	getStandingsDivisions: ApiSportsEndpoint<'getStandingsDivisions'>;
	getNflStandingsConferences: ApiSportsEndpoint<'getNflStandingsConferences'>;
	getPlayers: ApiSportsEndpoint<'getPlayers'>;
	getPlayersProfiles: ApiSportsEndpoint<'getPlayersProfiles'>;
	getPlayersSeasons: ApiSportsEndpoint<'getPlayersSeasons'>;
	getPlayersSquads: ApiSportsEndpoint<'getPlayersSquads'>;
	getPlayersTeams: ApiSportsEndpoint<'getPlayersTeams'>;
	getPlayersTopScorers: ApiSportsEndpoint<'getPlayersTopScorers'>;
	getPlayersTopAssists: ApiSportsEndpoint<'getPlayersTopAssists'>;
	getPlayersTopYellowCards: ApiSportsEndpoint<'getPlayersTopYellowCards'>;
	getPlayersTopRedCards: ApiSportsEndpoint<'getPlayersTopRedCards'>;
	getOdds: ApiSportsEndpoint<'getOdds'>;
	getOddsBets: ApiSportsEndpoint<'getOddsBets'>;
	getOddsBookmakers: ApiSportsEndpoint<'getOddsBookmakers'>;
	getOddsMapping: ApiSportsEndpoint<'getOddsMapping'>;
	getInPlayOdds: ApiSportsEndpoint<'getInPlayOdds'>;
	getLiveOddsBets: ApiSportsEndpoint<'getLiveOddsBets'>;
	getBasketballStatistics: ApiSportsEndpoint<'getBasketballStatistics'>;
	getBasketballBets: ApiSportsEndpoint<'getBasketballBets'>;
	getBasketballBookmakers: ApiSportsEndpoint<'getBasketballBookmakers'>;
	getNbaGameStatistics: ApiSportsEndpoint<'getNbaGameStatistics'>;
	getPlayerStatistics: ApiSportsEndpoint<'getPlayerStatistics'>;
	getGameStatisticsByTeams: ApiSportsEndpoint<'getGameStatisticsByTeams'>;
	getGamesEvents: ApiSportsEndpoint<'getGamesEvents'>;
	getAflSeasons: ApiSportsEndpoint<'getAflSeasons'>;
	getAflGames: ApiSportsEndpoint<'getAflGames'>;
	getAflGamesQuarters: ApiSportsEndpoint<'getAflGamesQuarters'>;
	getAflGamePlayerStatistics: ApiSportsEndpoint<'getAflGamePlayerStatistics'>;
	getAflStandings: ApiSportsEndpoint<'getAflStandings'>;
	getBaseballGamesHeadToHead: ApiSportsEndpoint<'getBaseballGamesHeadToHead'>;
	getFormula1Circuits: ApiSportsEndpoint<'getFormula1Circuits'>;
	getFormula1Competitions: ApiSportsEndpoint<'getFormula1Competitions'>;
	getFormula1Races: ApiSportsEndpoint<'getFormula1Races'>;
	getFormula1DriverRankings: ApiSportsEndpoint<'getFormula1DriverRankings'>;
	getFormula1TeamRankings: ApiSportsEndpoint<'getFormula1TeamRankings'>;
	getFormula1StartingGrid: ApiSportsEndpoint<'getFormula1StartingGrid'>;
	getFastestLapsRankings: ApiSportsEndpoint<'getFastestLapsRankings'>;
	getRaceRankings: ApiSportsEndpoint<'getRaceRankings'>;
	getMmaCategories: ApiSportsEndpoint<'getMmaCategories'>;
	getMmaFighters: ApiSportsEndpoint<'getMmaFighters'>;
	getMmaFights: ApiSportsEndpoint<'getMmaFights'>;
	getMmaFightResults: ApiSportsEndpoint<'getMmaFightResults'>;
	getMmaFighterStatistics: ApiSportsEndpoint<'getMmaFighterStatistics'>;
	getFightersRecords: ApiSportsEndpoint<'getFightersRecords'>;
};

const apiSportsEndpointsNested = {
	core: {
		getCountries: Core.getCountries,
		getTimezone: Core.getTimezone,
		getLeagues: Core.getLeagues,
		getLeagueSeasons: Core.getLeagueSeasons,
		getTeams: Core.getTeams,
		getTeamSeasons: Core.getTeamSeasons,
		getTeamStatistics: Core.getTeamStatistics,
		getVenues: Core.getVenues,
		getCoaches: Core.getCoaches,
		getInjuries: Core.getInjuries,
		getSidelined: Core.getSidelined,
		getTransfers: Core.getTransfers,
		getTrophies: Core.getTrophies,
		getPredictions: Core.getPredictions,
	},
	fixtures: {
		getFixtures: Fixtures.getFixtures,
		getFixturesRounds: Fixtures.getFixturesRounds,
		getHeadToHeadFixtures: Fixtures.getHeadToHeadFixtures,
		getFixtureLineups: Fixtures.getFixtureLineups,
		getFixtureStatistics: Fixtures.getFixtureStatistics,
		getFixturesEvents: Fixtures.getFixturesEvents,
		getFixturesPlayers: Fixtures.getFixturesPlayers,
	},
	standings: {
		getStandingsStages: Standings.getStandingsStages,
		getStandingsGroups: Standings.getStandingsGroups,
		getStandingsDivisions: Standings.getStandingsDivisions,
		getNflStandingsConferences: Standings.getNflStandingsConferences,
	},
	players: {
		getPlayers: Players.getPlayers,
		getPlayersProfiles: Players.getPlayersProfiles,
		getPlayersSeasons: Players.getPlayersSeasons,
		getPlayersSquads: Players.getPlayersSquads,
		getPlayersTeams: Players.getPlayersTeams,
		getPlayersTopScorers: Players.getPlayersTopScorers,
		getPlayersTopAssists: Players.getPlayersTopAssists,
		getPlayersTopYellowCards: Players.getPlayersTopYellowCards,
		getPlayersTopRedCards: Players.getPlayersTopRedCards,
	},
	odds: {
		getOdds: Odds.getOdds,
		getOddsBets: Odds.getOddsBets,
		getOddsBookmakers: Odds.getOddsBookmakers,
		getOddsMapping: Odds.getOddsMapping,
		getInPlayOdds: Odds.getInPlayOdds,
		getLiveOddsBets: Odds.getLiveOddsBets,
	},
	basketball: {
		getBasketballStatistics: Basketball.getBasketballStatistics,
		getBasketballBets: Basketball.getBasketballBets,
		getBasketballBookmakers: Basketball.getBasketballBookmakers,
		getNbaGameStatistics: Basketball.getNbaGameStatistics,
		getPlayerStatistics: Basketball.getPlayerStatistics,
		getGameStatisticsByTeams: Basketball.getGameStatisticsByTeams,
		getGamesEvents: Basketball.getGamesEvents,
	},
	afl: {
		getAflSeasons: Afl.getAflSeasons,
		getAflGames: Afl.getAflGames,
		getAflGamesQuarters: Afl.getAflGamesQuarters,
		getAflGamePlayerStatistics: Afl.getAflGamePlayerStatistics,
		getAflStandings: Afl.getAflStandings,
	},
	baseball: {
		getBaseballGamesHeadToHead: Baseball.getBaseballGamesHeadToHead,
	},
	formula1: {
		getFormula1Circuits: Formula1.getFormula1Circuits,
		getFormula1Competitions: Formula1.getFormula1Competitions,
		getFormula1Races: Formula1.getFormula1Races,
		getFormula1DriverRankings: Formula1.getFormula1DriverRankings,
		getFormula1TeamRankings: Formula1.getFormula1TeamRankings,
		getFormula1StartingGrid: Formula1.getFormula1StartingGrid,
		getFastestLapsRankings: Formula1.getFastestLapsRankings,
		getRaceRankings: Formula1.getRaceRankings,
	},
	mma: {
		getMmaCategories: Mma.getMmaCategories,
		getMmaFighters: Mma.getMmaFighters,
		getMmaFights: Mma.getMmaFights,
		getMmaFightResults: Mma.getMmaFightResults,
		getMmaFighterStatistics: Mma.getMmaFighterStatistics,
		getFightersRecords: Mma.getFightersRecords,
	},
} as const;

const apiSportsWebhooksNested = {} as const;

export const apiSportsEndpointSchemas = {
	'core.getCountries': {
		input: ApiSportsEndpointInputSchemas.getCountries,
		output: ApiSportsEndpointOutputSchemas.getCountries,
	},
	'core.getTimezone': {
		input: ApiSportsEndpointInputSchemas.getTimezone,
		output: ApiSportsEndpointOutputSchemas.getTimezone,
	},
	'core.getLeagues': {
		input: ApiSportsEndpointInputSchemas.getLeagues,
		output: ApiSportsEndpointOutputSchemas.getLeagues,
	},
	'core.getLeagueSeasons': {
		input: ApiSportsEndpointInputSchemas.getLeagueSeasons,
		output: ApiSportsEndpointOutputSchemas.getLeagueSeasons,
	},
	'core.getTeams': {
		input: ApiSportsEndpointInputSchemas.getTeams,
		output: ApiSportsEndpointOutputSchemas.getTeams,
	},
	'core.getTeamSeasons': {
		input: ApiSportsEndpointInputSchemas.getTeamSeasons,
		output: ApiSportsEndpointOutputSchemas.getTeamSeasons,
	},
	'core.getTeamStatistics': {
		input: ApiSportsEndpointInputSchemas.getTeamStatistics,
		output: ApiSportsEndpointOutputSchemas.getTeamStatistics,
	},
	'core.getVenues': {
		input: ApiSportsEndpointInputSchemas.getVenues,
		output: ApiSportsEndpointOutputSchemas.getVenues,
	},
	'core.getCoaches': {
		input: ApiSportsEndpointInputSchemas.getCoaches,
		output: ApiSportsEndpointOutputSchemas.getCoaches,
	},
	'core.getInjuries': {
		input: ApiSportsEndpointInputSchemas.getInjuries,
		output: ApiSportsEndpointOutputSchemas.getInjuries,
	},
	'core.getSidelined': {
		input: ApiSportsEndpointInputSchemas.getSidelined,
		output: ApiSportsEndpointOutputSchemas.getSidelined,
	},
	'core.getTransfers': {
		input: ApiSportsEndpointInputSchemas.getTransfers,
		output: ApiSportsEndpointOutputSchemas.getTransfers,
	},
	'core.getTrophies': {
		input: ApiSportsEndpointInputSchemas.getTrophies,
		output: ApiSportsEndpointOutputSchemas.getTrophies,
	},
	'core.getPredictions': {
		input: ApiSportsEndpointInputSchemas.getPredictions,
		output: ApiSportsEndpointOutputSchemas.getPredictions,
	},
	'fixtures.getFixtures': {
		input: ApiSportsEndpointInputSchemas.getFixtures,
		output: ApiSportsEndpointOutputSchemas.getFixtures,
	},
	'fixtures.getFixturesRounds': {
		input: ApiSportsEndpointInputSchemas.getFixturesRounds,
		output: ApiSportsEndpointOutputSchemas.getFixturesRounds,
	},
	'fixtures.getHeadToHeadFixtures': {
		input: ApiSportsEndpointInputSchemas.getHeadToHeadFixtures,
		output: ApiSportsEndpointOutputSchemas.getHeadToHeadFixtures,
	},
	'fixtures.getFixtureLineups': {
		input: ApiSportsEndpointInputSchemas.getFixtureLineups,
		output: ApiSportsEndpointOutputSchemas.getFixtureLineups,
	},
	'fixtures.getFixtureStatistics': {
		input: ApiSportsEndpointInputSchemas.getFixtureStatistics,
		output: ApiSportsEndpointOutputSchemas.getFixtureStatistics,
	},
	'fixtures.getFixturesEvents': {
		input: ApiSportsEndpointInputSchemas.getFixturesEvents,
		output: ApiSportsEndpointOutputSchemas.getFixturesEvents,
	},
	'fixtures.getFixturesPlayers': {
		input: ApiSportsEndpointInputSchemas.getFixturesPlayers,
		output: ApiSportsEndpointOutputSchemas.getFixturesPlayers,
	},
	'standings.getStandingsStages': {
		input: ApiSportsEndpointInputSchemas.getStandingsStages,
		output: ApiSportsEndpointOutputSchemas.getStandingsStages,
	},
	'standings.getStandingsGroups': {
		input: ApiSportsEndpointInputSchemas.getStandingsGroups,
		output: ApiSportsEndpointOutputSchemas.getStandingsGroups,
	},
	'standings.getStandingsDivisions': {
		input: ApiSportsEndpointInputSchemas.getStandingsDivisions,
		output: ApiSportsEndpointOutputSchemas.getStandingsDivisions,
	},
	'standings.getNflStandingsConferences': {
		input: ApiSportsEndpointInputSchemas.getNflStandingsConferences,
		output: ApiSportsEndpointOutputSchemas.getNflStandingsConferences,
	},
	'players.getPlayers': {
		input: ApiSportsEndpointInputSchemas.getPlayers,
		output: ApiSportsEndpointOutputSchemas.getPlayers,
	},
	'players.getPlayersProfiles': {
		input: ApiSportsEndpointInputSchemas.getPlayersProfiles,
		output: ApiSportsEndpointOutputSchemas.getPlayersProfiles,
	},
	'players.getPlayersSeasons': {
		input: ApiSportsEndpointInputSchemas.getPlayersSeasons,
		output: ApiSportsEndpointOutputSchemas.getPlayersSeasons,
	},
	'players.getPlayersSquads': {
		input: ApiSportsEndpointInputSchemas.getPlayersSquads,
		output: ApiSportsEndpointOutputSchemas.getPlayersSquads,
	},
	'players.getPlayersTeams': {
		input: ApiSportsEndpointInputSchemas.getPlayersTeams,
		output: ApiSportsEndpointOutputSchemas.getPlayersTeams,
	},
	'players.getPlayersTopScorers': {
		input: ApiSportsEndpointInputSchemas.getPlayersTopScorers,
		output: ApiSportsEndpointOutputSchemas.getPlayersTopScorers,
	},
	'players.getPlayersTopAssists': {
		input: ApiSportsEndpointInputSchemas.getPlayersTopAssists,
		output: ApiSportsEndpointOutputSchemas.getPlayersTopAssists,
	},
	'players.getPlayersTopYellowCards': {
		input: ApiSportsEndpointInputSchemas.getPlayersTopYellowCards,
		output: ApiSportsEndpointOutputSchemas.getPlayersTopYellowCards,
	},
	'players.getPlayersTopRedCards': {
		input: ApiSportsEndpointInputSchemas.getPlayersTopRedCards,
		output: ApiSportsEndpointOutputSchemas.getPlayersTopRedCards,
	},
	'odds.getOdds': {
		input: ApiSportsEndpointInputSchemas.getOdds,
		output: ApiSportsEndpointOutputSchemas.getOdds,
	},
	'odds.getOddsBets': {
		input: ApiSportsEndpointInputSchemas.getOddsBets,
		output: ApiSportsEndpointOutputSchemas.getOddsBets,
	},
	'odds.getOddsBookmakers': {
		input: ApiSportsEndpointInputSchemas.getOddsBookmakers,
		output: ApiSportsEndpointOutputSchemas.getOddsBookmakers,
	},
	'odds.getOddsMapping': {
		input: ApiSportsEndpointInputSchemas.getOddsMapping,
		output: ApiSportsEndpointOutputSchemas.getOddsMapping,
	},
	'odds.getInPlayOdds': {
		input: ApiSportsEndpointInputSchemas.getInPlayOdds,
		output: ApiSportsEndpointOutputSchemas.getInPlayOdds,
	},
	'odds.getLiveOddsBets': {
		input: ApiSportsEndpointInputSchemas.getLiveOddsBets,
		output: ApiSportsEndpointOutputSchemas.getLiveOddsBets,
	},
	'basketball.getBasketballStatistics': {
		input: ApiSportsEndpointInputSchemas.getBasketballStatistics,
		output: ApiSportsEndpointOutputSchemas.getBasketballStatistics,
	},
	'basketball.getBasketballBets': {
		input: ApiSportsEndpointInputSchemas.getBasketballBets,
		output: ApiSportsEndpointOutputSchemas.getBasketballBets,
	},
	'basketball.getBasketballBookmakers': {
		input: ApiSportsEndpointInputSchemas.getBasketballBookmakers,
		output: ApiSportsEndpointOutputSchemas.getBasketballBookmakers,
	},
	'basketball.getNbaGameStatistics': {
		input: ApiSportsEndpointInputSchemas.getNbaGameStatistics,
		output: ApiSportsEndpointOutputSchemas.getNbaGameStatistics,
	},
	'basketball.getPlayerStatistics': {
		input: ApiSportsEndpointInputSchemas.getPlayerStatistics,
		output: ApiSportsEndpointOutputSchemas.getPlayerStatistics,
	},
	'basketball.getGameStatisticsByTeams': {
		input: ApiSportsEndpointInputSchemas.getGameStatisticsByTeams,
		output: ApiSportsEndpointOutputSchemas.getGameStatisticsByTeams,
	},
	'basketball.getGamesEvents': {
		input: ApiSportsEndpointInputSchemas.getGamesEvents,
		output: ApiSportsEndpointOutputSchemas.getGamesEvents,
	},
	'afl.getAflSeasons': {
		input: ApiSportsEndpointInputSchemas.getAflSeasons,
		output: ApiSportsEndpointOutputSchemas.getAflSeasons,
	},
	'afl.getAflGames': {
		input: ApiSportsEndpointInputSchemas.getAflGames,
		output: ApiSportsEndpointOutputSchemas.getAflGames,
	},
	'afl.getAflGamesQuarters': {
		input: ApiSportsEndpointInputSchemas.getAflGamesQuarters,
		output: ApiSportsEndpointOutputSchemas.getAflGamesQuarters,
	},
	'afl.getAflGamePlayerStatistics': {
		input: ApiSportsEndpointInputSchemas.getAflGamePlayerStatistics,
		output: ApiSportsEndpointOutputSchemas.getAflGamePlayerStatistics,
	},
	'afl.getAflStandings': {
		input: ApiSportsEndpointInputSchemas.getAflStandings,
		output: ApiSportsEndpointOutputSchemas.getAflStandings,
	},
	'baseball.getBaseballGamesHeadToHead': {
		input: ApiSportsEndpointInputSchemas.getBaseballGamesHeadToHead,
		output: ApiSportsEndpointOutputSchemas.getBaseballGamesHeadToHead,
	},
	'formula1.getFormula1Circuits': {
		input: ApiSportsEndpointInputSchemas.getFormula1Circuits,
		output: ApiSportsEndpointOutputSchemas.getFormula1Circuits,
	},
	'formula1.getFormula1Competitions': {
		input: ApiSportsEndpointInputSchemas.getFormula1Competitions,
		output: ApiSportsEndpointOutputSchemas.getFormula1Competitions,
	},
	'formula1.getFormula1Races': {
		input: ApiSportsEndpointInputSchemas.getFormula1Races,
		output: ApiSportsEndpointOutputSchemas.getFormula1Races,
	},
	'formula1.getFormula1DriverRankings': {
		input: ApiSportsEndpointInputSchemas.getFormula1DriverRankings,
		output: ApiSportsEndpointOutputSchemas.getFormula1DriverRankings,
	},
	'formula1.getFormula1TeamRankings': {
		input: ApiSportsEndpointInputSchemas.getFormula1TeamRankings,
		output: ApiSportsEndpointOutputSchemas.getFormula1TeamRankings,
	},
	'formula1.getFormula1StartingGrid': {
		input: ApiSportsEndpointInputSchemas.getFormula1StartingGrid,
		output: ApiSportsEndpointOutputSchemas.getFormula1StartingGrid,
	},
	'formula1.getFastestLapsRankings': {
		input: ApiSportsEndpointInputSchemas.getFastestLapsRankings,
		output: ApiSportsEndpointOutputSchemas.getFastestLapsRankings,
	},
	'formula1.getRaceRankings': {
		input: ApiSportsEndpointInputSchemas.getRaceRankings,
		output: ApiSportsEndpointOutputSchemas.getRaceRankings,
	},
	'mma.getMmaCategories': {
		input: ApiSportsEndpointInputSchemas.getMmaCategories,
		output: ApiSportsEndpointOutputSchemas.getMmaCategories,
	},
	'mma.getMmaFighters': {
		input: ApiSportsEndpointInputSchemas.getMmaFighters,
		output: ApiSportsEndpointOutputSchemas.getMmaFighters,
	},
	'mma.getMmaFights': {
		input: ApiSportsEndpointInputSchemas.getMmaFights,
		output: ApiSportsEndpointOutputSchemas.getMmaFights,
	},
	'mma.getMmaFightResults': {
		input: ApiSportsEndpointInputSchemas.getMmaFightResults,
		output: ApiSportsEndpointOutputSchemas.getMmaFightResults,
	},
	'mma.getMmaFighterStatistics': {
		input: ApiSportsEndpointInputSchemas.getMmaFighterStatistics,
		output: ApiSportsEndpointOutputSchemas.getMmaFighterStatistics,
	},
	'mma.getFightersRecords': {
		input: ApiSportsEndpointInputSchemas.getFightersRecords,
		output: ApiSportsEndpointOutputSchemas.getFightersRecords,
	},
} satisfies RequiredPluginEndpointSchemas<typeof apiSportsEndpointsNested>;

const apiSportsEndpointMeta = {
	'core.getCountries': {
		riskLevel: 'read',
		description: 'Get Countries',
	},
	'core.getTimezone': {
		riskLevel: 'read',
		description: 'Get Timezone',
	},
	'core.getLeagues': {
		riskLevel: 'read',
		description: 'Get Leagues',
	},
	'core.getLeagueSeasons': {
		riskLevel: 'read',
		description: 'Get League Seasons',
	},
	'core.getTeams': {
		riskLevel: 'read',
		description: 'Get Teams',
	},
	'core.getTeamSeasons': {
		riskLevel: 'read',
		description: 'Get Team Seasons',
	},
	'core.getTeamStatistics': {
		riskLevel: 'read',
		description: 'Get Team Statistics',
	},
	'core.getVenues': {
		riskLevel: 'read',
		description: 'Get Venues',
	},
	'core.getCoaches': {
		riskLevel: 'read',
		description: 'Get Coaches',
	},
	'core.getInjuries': {
		riskLevel: 'read',
		description: 'Get Injuries',
	},
	'core.getSidelined': {
		riskLevel: 'read',
		description: 'Get Sidelined',
	},
	'core.getTransfers': {
		riskLevel: 'read',
		description: 'Get Transfers',
	},
	'core.getTrophies': {
		riskLevel: 'read',
		description: 'Get Trophies',
	},
	'core.getPredictions': {
		riskLevel: 'read',
		description: 'Get Predictions',
	},
	'fixtures.getFixtures': {
		riskLevel: 'read',
		description: 'Get Fixtures',
	},
	'fixtures.getFixturesRounds': {
		riskLevel: 'read',
		description: 'Get Fixtures Rounds',
	},
	'fixtures.getHeadToHeadFixtures': {
		riskLevel: 'read',
		description: 'Get Head-to-Head Fixtures',
	},
	'fixtures.getFixtureLineups': {
		riskLevel: 'read',
		description: 'Get Fixture Lineups',
	},
	'fixtures.getFixtureStatistics': {
		riskLevel: 'read',
		description: 'Get Fixture Statistics',
	},
	'fixtures.getFixturesEvents': {
		riskLevel: 'read',
		description: 'Get Fixtures Events',
	},
	'fixtures.getFixturesPlayers': {
		riskLevel: 'read',
		description: 'Get Fixtures Players',
	},
	'standings.getStandingsStages': {
		riskLevel: 'read',
		description: 'Get Standings Stages',
	},
	'standings.getStandingsGroups': {
		riskLevel: 'read',
		description: 'Get Standings Groups',
	},
	'standings.getStandingsDivisions': {
		riskLevel: 'read',
		description: 'Get Standings Divisions',
	},
	'standings.getNflStandingsConferences': {
		riskLevel: 'read',
		description: 'Get NFL Standings Conferences',
	},
	'players.getPlayers': {
		riskLevel: 'read',
		description: 'Get Players',
	},
	'players.getPlayersProfiles': {
		riskLevel: 'read',
		description: 'Get Players Profiles',
	},
	'players.getPlayersSeasons': {
		riskLevel: 'read',
		description: 'Get Players Seasons',
	},
	'players.getPlayersSquads': {
		riskLevel: 'read',
		description: 'Get Players Squads',
	},
	'players.getPlayersTeams': {
		riskLevel: 'read',
		description: 'Get Players Teams',
	},
	'players.getPlayersTopScorers': {
		riskLevel: 'read',
		description: 'Get Players Top Scorers',
	},
	'players.getPlayersTopAssists': {
		riskLevel: 'read',
		description: 'Get Players Top Assists',
	},
	'players.getPlayersTopYellowCards': {
		riskLevel: 'read',
		description: 'Get Players Top Yellow Cards',
	},
	'players.getPlayersTopRedCards': {
		riskLevel: 'read',
		description: 'Get Players Top Red Cards',
	},
	'odds.getOdds': {
		riskLevel: 'read',
		description: 'Get Odds',
	},
	'odds.getOddsBets': {
		riskLevel: 'read',
		description: 'Get Odds Bets',
	},
	'odds.getOddsBookmakers': {
		riskLevel: 'read',
		description: 'Get Odds Bookmakers',
	},
	'odds.getOddsMapping': {
		riskLevel: 'read',
		description: 'Get Odds Mapping',
	},
	'odds.getInPlayOdds': {
		riskLevel: 'read',
		description: 'Get In-Play Odds',
	},
	'odds.getLiveOddsBets': {
		riskLevel: 'read',
		description: 'Get Live Odds Bets',
	},
	'basketball.getBasketballStatistics': {
		riskLevel: 'read',
		description: 'Get Basketball Statistics',
	},
	'basketball.getBasketballBets': {
		riskLevel: 'read',
		description: 'Get Basketball Bets',
	},
	'basketball.getBasketballBookmakers': {
		riskLevel: 'read',
		description: 'Get Basketball Bookmakers',
	},
	'basketball.getNbaGameStatistics': {
		riskLevel: 'read',
		description: 'Get NBA Game Statistics',
	},
	'basketball.getPlayerStatistics': {
		riskLevel: 'read',
		description: 'Get Player Statistics',
	},
	'basketball.getGameStatisticsByTeams': {
		riskLevel: 'read',
		description: 'Get Game Statistics by Teams',
	},
	'basketball.getGamesEvents': {
		riskLevel: 'read',
		description: 'Get Games Events',
	},
	'afl.getAflSeasons': {
		riskLevel: 'read',
		description: 'Get AFL Seasons',
	},
	'afl.getAflGames': {
		riskLevel: 'read',
		description: 'Get AFL Games',
	},
	'afl.getAflGamesQuarters': {
		riskLevel: 'read',
		description: 'Get AFL Games Quarters',
	},
	'afl.getAflGamePlayerStatistics': {
		riskLevel: 'read',
		description: 'Get AFL Game Player Statistics',
	},
	'afl.getAflStandings': {
		riskLevel: 'read',
		description: 'Get AFL Standings',
	},
	'baseball.getBaseballGamesHeadToHead': {
		riskLevel: 'read',
		description: 'Get Baseball Games Head-to-Head',
	},
	'formula1.getFormula1Circuits': {
		riskLevel: 'read',
		description: 'Get Formula 1 Circuits',
	},
	'formula1.getFormula1Competitions': {
		riskLevel: 'read',
		description: 'Get Formula 1 Competitions',
	},
	'formula1.getFormula1Races': {
		riskLevel: 'read',
		description: 'Get Formula 1 Races',
	},
	'formula1.getFormula1DriverRankings': {
		riskLevel: 'read',
		description: 'Get Formula 1 Driver Rankings',
	},
	'formula1.getFormula1TeamRankings': {
		riskLevel: 'read',
		description: 'Get Formula 1 Team Rankings',
	},
	'formula1.getFormula1StartingGrid': {
		riskLevel: 'read',
		description: 'Get Formula 1 Starting Grid',
	},
	'formula1.getFastestLapsRankings': {
		riskLevel: 'read',
		description: 'Get Fastest Laps Rankings',
	},
	'formula1.getRaceRankings': {
		riskLevel: 'read',
		description: 'Get Race Rankings',
	},
	'mma.getMmaCategories': {
		riskLevel: 'read',
		description: 'Get MMA Categories',
	},
	'mma.getMmaFighters': {
		riskLevel: 'read',
		description: 'Get MMA Fighters',
	},
	'mma.getMmaFights': {
		riskLevel: 'read',
		description: 'Get MMA Fights',
	},
	'mma.getMmaFightResults': {
		riskLevel: 'read',
		description: 'Get MMA Fight Results',
	},
	'mma.getMmaFighterStatistics': {
		riskLevel: 'read',
		description: 'Get MMA Fighter Statistics',
	},
	'mma.getFightersRecords': {
		riskLevel: 'read',
		description: 'Get Fighters Records',
	},
} satisfies RequiredPluginEndpointMeta<typeof apiSportsEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const apiSportsAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseApiSportsPlugin<T extends ApiSportsPluginOptions> =
	CorsairPlugin<
		'apisports',
		typeof ApiSportsSchema,
		typeof apiSportsEndpointsNested,
		typeof apiSportsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalApiSportsPlugin =
	BaseApiSportsPlugin<ApiSportsPluginOptions>;

export type ExternalApiSportsPlugin<T extends ApiSportsPluginOptions> =
	BaseApiSportsPlugin<T>;

export function apisports<const T extends ApiSportsPluginOptions>(
	incomingOptions: ApiSportsPluginOptions & T = {} as ApiSportsPluginOptions &
		T,
): ExternalApiSportsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'apisports',
		authConfig: apiSportsAuthConfig,
		schema: ApiSportsSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: apiSportsEndpointsNested,
		webhooks: apiSportsWebhooksNested,
		endpointMeta: apiSportsEndpointMeta,
		endpointSchemas: apiSportsEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ApiSportsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('apisports', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('apisports', 'api_key');
		},
	} satisfies InternalApiSportsPlugin;
}

export type {
	ApiSportsEndpointInputs,
	ApiSportsEndpointOutputs,
	ApiSportsQueryInput,
	ApiSportsResponse,
} from './endpoints/types';

export {
	ApiSportsEndpointInputSchemas,
	ApiSportsEndpointOutputSchemas,
	ApiSportsQueryInputSchema,
	ApiSportsResponseSchema,
} from './endpoints/types';
