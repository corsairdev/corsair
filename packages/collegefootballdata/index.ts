import type {
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Account,
	Betting,
	Coaches,
	Conferences,
	Draft,
	Drives,
	Games,
	Metrics,
	Players,
	Plays,
	Ppa,
	Rankings,
	Ratings,
	Recruiting,
	SeasonTypes,
	Stats,
	Teams,
	Venues,
} from './endpoints';
import type {
	CollegeFootballDataEndpointInputs,
	CollegeFootballDataEndpointOutputs,
} from './endpoints/types';
import {
	CollegeFootballDataEndpointInputSchemas,
	CollegeFootballDataEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CollegeFootballDataSchema } from './schema';
import { resolveCollegeFootballDataOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCollegeFootballDataTenantWebhook } from './webhooks/tenant-matcher';

export type CollegeFootballDataPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCollegeFootballDataPlugin['hooks'];
	webhookHooks?: InternalCollegeFootballDataPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof collegeFootballDataEndpointsNested
	>;
};

/**
 * No second credential: confirmed from the provider's OpenAPI document,
 * this API has no account/organization id concept at all, unlike this
 * repo's Harvest/Botpress/Mailtrap integrations.
 */
export const collegeFootballDataAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type CollegeFootballDataContext = CorsairPluginContext<
	typeof CollegeFootballDataSchema,
	CollegeFootballDataPluginOptions,
	undefined,
	typeof collegeFootballDataAuthConfig
>;

export type CollegeFootballDataKeyBuilderContext =
	KeyBuilderContext<CollegeFootballDataPluginOptions>;

export type CollegeFootballDataBoundEndpoints = BindEndpoints<
	typeof collegeFootballDataEndpointsNested
>;

type CollegeFootballDataEndpoint<
	K extends keyof CollegeFootballDataEndpointOutputs,
> = CorsairEndpoint<
	CollegeFootballDataContext,
	CollegeFootballDataEndpointInputs[K],
	CollegeFootballDataEndpointOutputs[K]
>;

export type CollegeFootballDataEndpoints = {
	gamesGetGamesAndResults: CollegeFootballDataEndpoint<'gamesGetGamesAndResults'>;
	gamesGetMedia: CollegeFootballDataEndpoint<'gamesGetMedia'>;
	gamesGetTeamStats: CollegeFootballDataEndpoint<'gamesGetTeamStats'>;
	gamesGetPlayerStats: CollegeFootballDataEndpoint<'gamesGetPlayerStats'>;
	gamesGetAdvancedBoxScore: CollegeFootballDataEndpoint<'gamesGetAdvancedBoxScore'>;
	drivesList: CollegeFootballDataEndpoint<'drivesList'>;
	playsList: CollegeFootballDataEndpoint<'playsList'>;
	playsListStats: CollegeFootballDataEndpoint<'playsListStats'>;
	playsListStatTypes: CollegeFootballDataEndpoint<'playsListStatTypes'>;
	playsListTypes: CollegeFootballDataEndpoint<'playsListTypes'>;
	metricsGetFieldGoalExpectedPoints: CollegeFootballDataEndpoint<'metricsGetFieldGoalExpectedPoints'>;
	metricsGetWinProbability: CollegeFootballDataEndpoint<'metricsGetWinProbability'>;
	metricsGetPregameWinProbabilities: CollegeFootballDataEndpoint<'metricsGetPregameWinProbabilities'>;
	ppaGetByTeamSeason: CollegeFootballDataEndpoint<'ppaGetByTeamSeason'>;
	ppaGetByTeamGame: CollegeFootballDataEndpoint<'ppaGetByTeamGame'>;
	ppaGetByPlayerSeason: CollegeFootballDataEndpoint<'ppaGetByPlayerSeason'>;
	ppaGetByPlayerGame: CollegeFootballDataEndpoint<'ppaGetByPlayerGame'>;
	ppaGetPredictedPoints: CollegeFootballDataEndpoint<'ppaGetPredictedPoints'>;
	ratingsGetElo: CollegeFootballDataEndpoint<'ratingsGetElo'>;
	ratingsGetFPI: CollegeFootballDataEndpoint<'ratingsGetFPI'>;
	ratingsGetSP: CollegeFootballDataEndpoint<'ratingsGetSP'>;
	ratingsGetConferenceSP: CollegeFootballDataEndpoint<'ratingsGetConferenceSP'>;
	ratingsGetSRS: CollegeFootballDataEndpoint<'ratingsGetSRS'>;
	statsListCategories: CollegeFootballDataEndpoint<'statsListCategories'>;
	statsGetAdvancedGameStats: CollegeFootballDataEndpoint<'statsGetAdvancedGameStats'>;
	statsGetGameHavocStats: CollegeFootballDataEndpoint<'statsGetGameHavocStats'>;
	statsGetPlayerSeasonStats: CollegeFootballDataEndpoint<'statsGetPlayerSeasonStats'>;
	statsGetTeamSeasonStats: CollegeFootballDataEndpoint<'statsGetTeamSeasonStats'>;
	statsGetAdvancedSeasonStats: CollegeFootballDataEndpoint<'statsGetAdvancedSeasonStats'>;
	playersSearch: CollegeFootballDataEndpoint<'playersSearch'>;
	playersGetUsage: CollegeFootballDataEndpoint<'playersGetUsage'>;
	playersGetReturningProduction: CollegeFootballDataEndpoint<'playersGetReturningProduction'>;
	playersListTransferPortal: CollegeFootballDataEndpoint<'playersListTransferPortal'>;
	teamsList: CollegeFootballDataEndpoint<'teamsList'>;
	teamsListFBS: CollegeFootballDataEndpoint<'teamsListFBS'>;
	teamsListFCS: CollegeFootballDataEndpoint<'teamsListFCS'>;
	teamsGetATSRecords: CollegeFootballDataEndpoint<'teamsGetATSRecords'>;
	teamsGetMatchup: CollegeFootballDataEndpoint<'teamsGetMatchup'>;
	teamsGetRecords: CollegeFootballDataEndpoint<'teamsGetRecords'>;
	teamsGetRoster: CollegeFootballDataEndpoint<'teamsGetRoster'>;
	conferencesList: CollegeFootballDataEndpoint<'conferencesList'>;
	conferencesListMemberships: CollegeFootballDataEndpoint<'conferencesListMemberships'>;
	conferencesListDivisions: CollegeFootballDataEndpoint<'conferencesListDivisions'>;
	coachesList: CollegeFootballDataEndpoint<'coachesList'>;
	venuesList: CollegeFootballDataEndpoint<'venuesList'>;
	recruitingListRecruits: CollegeFootballDataEndpoint<'recruitingListRecruits'>;
	recruitingGetTeamRankings: CollegeFootballDataEndpoint<'recruitingGetTeamRankings'>;
	recruitingGetGroupRatings: CollegeFootballDataEndpoint<'recruitingGetGroupRatings'>;
	recruitingGetTeamTalent: CollegeFootballDataEndpoint<'recruitingGetTeamTalent'>;
	rankingsList: CollegeFootballDataEndpoint<'rankingsList'>;
	bettingGetLines: CollegeFootballDataEndpoint<'bettingGetLines'>;
	draftListPicks: CollegeFootballDataEndpoint<'draftListPicks'>;
	draftListPositions: CollegeFootballDataEndpoint<'draftListPositions'>;
	draftListTeams: CollegeFootballDataEndpoint<'draftListTeams'>;
	seasonTypesList: CollegeFootballDataEndpoint<'seasonTypesList'>;
	accountGetUserInfo: CollegeFootballDataEndpoint<'accountGetUserInfo'>;
};

export type CollegeFootballDataWebhooks = Record<string, never>;

export type CollegeFootballDataBoundWebhooks =
	BindWebhooks<CollegeFootballDataWebhooks>;

const collegeFootballDataEndpointsNested = {
	games: {
		getGamesAndResults: Games.getGamesAndResults,
		getMedia: Games.getMedia,
		getTeamStats: Games.getTeamStats,
		getPlayerStats: Games.getPlayerStats,
		getAdvancedBoxScore: Games.getAdvancedBoxScore,
	},
	drives: {
		list: Drives.list,
	},
	plays: {
		list: Plays.list,
		listStats: Plays.listStats,
		listStatTypes: Plays.listStatTypes,
		listTypes: Plays.listTypes,
	},
	metrics: {
		getFieldGoalExpectedPoints: Metrics.getFieldGoalExpectedPoints,
		getWinProbability: Metrics.getWinProbability,
		getPregameWinProbabilities: Metrics.getPregameWinProbabilities,
	},
	ppa: {
		getByTeamSeason: Ppa.getByTeamSeason,
		getByTeamGame: Ppa.getByTeamGame,
		getByPlayerSeason: Ppa.getByPlayerSeason,
		getByPlayerGame: Ppa.getByPlayerGame,
		getPredictedPoints: Ppa.getPredictedPoints,
	},
	ratings: {
		getElo: Ratings.getElo,
		getFPI: Ratings.getFPI,
		getSP: Ratings.getSP,
		getConferenceSP: Ratings.getConferenceSP,
		getSRS: Ratings.getSRS,
	},
	stats: {
		listCategories: Stats.listCategories,
		getAdvancedGameStats: Stats.getAdvancedGameStats,
		getGameHavocStats: Stats.getGameHavocStats,
		getPlayerSeasonStats: Stats.getPlayerSeasonStats,
		getTeamSeasonStats: Stats.getTeamSeasonStats,
		getAdvancedSeasonStats: Stats.getAdvancedSeasonStats,
	},
	players: {
		search: Players.search,
		getUsage: Players.getUsage,
		getReturningProduction: Players.getReturningProduction,
		listTransferPortal: Players.listTransferPortal,
	},
	teams: {
		list: Teams.list,
		listFBS: Teams.listFBS,
		listFCS: Teams.listFCS,
		getATSRecords: Teams.getATSRecords,
		getMatchup: Teams.getMatchup,
		getRecords: Teams.getRecords,
		getRoster: Teams.getRoster,
	},
	conferences: {
		list: Conferences.list,
		listMemberships: Conferences.listMemberships,
		listDivisions: Conferences.listDivisions,
	},
	coaches: {
		list: Coaches.list,
	},
	venues: {
		list: Venues.list,
	},
	recruiting: {
		listRecruits: Recruiting.listRecruits,
		getTeamRankings: Recruiting.getTeamRankings,
		getGroupRatings: Recruiting.getGroupRatings,
		getTeamTalent: Recruiting.getTeamTalent,
	},
	rankings: {
		list: Rankings.list,
	},
	betting: {
		getLines: Betting.getLines,
	},
	draft: {
		listPicks: Draft.listPicks,
		listPositions: Draft.listPositions,
		listTeams: Draft.listTeams,
	},
	seasonTypes: {
		list: SeasonTypes.list,
	},
	account: {
		getUserInfo: Account.getUserInfo,
	},
} as const;

/**
 * The OSS catalog for this integration lists zero triggers, and the
 * provider's API has no webhook capability at all - confirmed from the
 * OpenAPI document, which declares no webhook path or tag among its 74
 * operations.
 */
const collegeFootballDataWebhooksNested = {} as const;

export const collegeFootballDataEndpointSchemas = {
	'games.getGamesAndResults': {
		input: CollegeFootballDataEndpointInputSchemas.gamesGetGamesAndResults,
		output: CollegeFootballDataEndpointOutputSchemas.gamesGetGamesAndResults,
	},
	'games.getMedia': {
		input: CollegeFootballDataEndpointInputSchemas.gamesGetMedia,
		output: CollegeFootballDataEndpointOutputSchemas.gamesGetMedia,
	},
	'games.getTeamStats': {
		input: CollegeFootballDataEndpointInputSchemas.gamesGetTeamStats,
		output: CollegeFootballDataEndpointOutputSchemas.gamesGetTeamStats,
	},
	'games.getPlayerStats': {
		input: CollegeFootballDataEndpointInputSchemas.gamesGetPlayerStats,
		output: CollegeFootballDataEndpointOutputSchemas.gamesGetPlayerStats,
	},
	'games.getAdvancedBoxScore': {
		input: CollegeFootballDataEndpointInputSchemas.gamesGetAdvancedBoxScore,
		output: CollegeFootballDataEndpointOutputSchemas.gamesGetAdvancedBoxScore,
	},
	'drives.list': {
		input: CollegeFootballDataEndpointInputSchemas.drivesList,
		output: CollegeFootballDataEndpointOutputSchemas.drivesList,
	},
	'plays.list': {
		input: CollegeFootballDataEndpointInputSchemas.playsList,
		output: CollegeFootballDataEndpointOutputSchemas.playsList,
	},
	'plays.listStats': {
		input: CollegeFootballDataEndpointInputSchemas.playsListStats,
		output: CollegeFootballDataEndpointOutputSchemas.playsListStats,
	},
	'plays.listStatTypes': {
		input: CollegeFootballDataEndpointInputSchemas.playsListStatTypes,
		output: CollegeFootballDataEndpointOutputSchemas.playsListStatTypes,
	},
	'plays.listTypes': {
		input: CollegeFootballDataEndpointInputSchemas.playsListTypes,
		output: CollegeFootballDataEndpointOutputSchemas.playsListTypes,
	},
	'metrics.getFieldGoalExpectedPoints': {
		input:
			CollegeFootballDataEndpointInputSchemas.metricsGetFieldGoalExpectedPoints,
		output:
			CollegeFootballDataEndpointOutputSchemas.metricsGetFieldGoalExpectedPoints,
	},
	'metrics.getWinProbability': {
		input: CollegeFootballDataEndpointInputSchemas.metricsGetWinProbability,
		output: CollegeFootballDataEndpointOutputSchemas.metricsGetWinProbability,
	},
	'metrics.getPregameWinProbabilities': {
		input:
			CollegeFootballDataEndpointInputSchemas.metricsGetPregameWinProbabilities,
		output:
			CollegeFootballDataEndpointOutputSchemas.metricsGetPregameWinProbabilities,
	},
	'ppa.getByTeamSeason': {
		input: CollegeFootballDataEndpointInputSchemas.ppaGetByTeamSeason,
		output: CollegeFootballDataEndpointOutputSchemas.ppaGetByTeamSeason,
	},
	'ppa.getByTeamGame': {
		input: CollegeFootballDataEndpointInputSchemas.ppaGetByTeamGame,
		output: CollegeFootballDataEndpointOutputSchemas.ppaGetByTeamGame,
	},
	'ppa.getByPlayerSeason': {
		input: CollegeFootballDataEndpointInputSchemas.ppaGetByPlayerSeason,
		output: CollegeFootballDataEndpointOutputSchemas.ppaGetByPlayerSeason,
	},
	'ppa.getByPlayerGame': {
		input: CollegeFootballDataEndpointInputSchemas.ppaGetByPlayerGame,
		output: CollegeFootballDataEndpointOutputSchemas.ppaGetByPlayerGame,
	},
	'ppa.getPredictedPoints': {
		input: CollegeFootballDataEndpointInputSchemas.ppaGetPredictedPoints,
		output: CollegeFootballDataEndpointOutputSchemas.ppaGetPredictedPoints,
	},
	'ratings.getElo': {
		input: CollegeFootballDataEndpointInputSchemas.ratingsGetElo,
		output: CollegeFootballDataEndpointOutputSchemas.ratingsGetElo,
	},
	'ratings.getFPI': {
		input: CollegeFootballDataEndpointInputSchemas.ratingsGetFPI,
		output: CollegeFootballDataEndpointOutputSchemas.ratingsGetFPI,
	},
	'ratings.getSP': {
		input: CollegeFootballDataEndpointInputSchemas.ratingsGetSP,
		output: CollegeFootballDataEndpointOutputSchemas.ratingsGetSP,
	},
	'ratings.getConferenceSP': {
		input: CollegeFootballDataEndpointInputSchemas.ratingsGetConferenceSP,
		output: CollegeFootballDataEndpointOutputSchemas.ratingsGetConferenceSP,
	},
	'ratings.getSRS': {
		input: CollegeFootballDataEndpointInputSchemas.ratingsGetSRS,
		output: CollegeFootballDataEndpointOutputSchemas.ratingsGetSRS,
	},
	'stats.listCategories': {
		input: CollegeFootballDataEndpointInputSchemas.statsListCategories,
		output: CollegeFootballDataEndpointOutputSchemas.statsListCategories,
	},
	'stats.getAdvancedGameStats': {
		input: CollegeFootballDataEndpointInputSchemas.statsGetAdvancedGameStats,
		output: CollegeFootballDataEndpointOutputSchemas.statsGetAdvancedGameStats,
	},
	'stats.getGameHavocStats': {
		input: CollegeFootballDataEndpointInputSchemas.statsGetGameHavocStats,
		output: CollegeFootballDataEndpointOutputSchemas.statsGetGameHavocStats,
	},
	'stats.getPlayerSeasonStats': {
		input: CollegeFootballDataEndpointInputSchemas.statsGetPlayerSeasonStats,
		output: CollegeFootballDataEndpointOutputSchemas.statsGetPlayerSeasonStats,
	},
	'stats.getTeamSeasonStats': {
		input: CollegeFootballDataEndpointInputSchemas.statsGetTeamSeasonStats,
		output: CollegeFootballDataEndpointOutputSchemas.statsGetTeamSeasonStats,
	},
	'stats.getAdvancedSeasonStats': {
		input: CollegeFootballDataEndpointInputSchemas.statsGetAdvancedSeasonStats,
		output:
			CollegeFootballDataEndpointOutputSchemas.statsGetAdvancedSeasonStats,
	},
	'players.search': {
		input: CollegeFootballDataEndpointInputSchemas.playersSearch,
		output: CollegeFootballDataEndpointOutputSchemas.playersSearch,
	},
	'players.getUsage': {
		input: CollegeFootballDataEndpointInputSchemas.playersGetUsage,
		output: CollegeFootballDataEndpointOutputSchemas.playersGetUsage,
	},
	'players.getReturningProduction': {
		input:
			CollegeFootballDataEndpointInputSchemas.playersGetReturningProduction,
		output:
			CollegeFootballDataEndpointOutputSchemas.playersGetReturningProduction,
	},
	'players.listTransferPortal': {
		input: CollegeFootballDataEndpointInputSchemas.playersListTransferPortal,
		output: CollegeFootballDataEndpointOutputSchemas.playersListTransferPortal,
	},
	'teams.list': {
		input: CollegeFootballDataEndpointInputSchemas.teamsList,
		output: CollegeFootballDataEndpointOutputSchemas.teamsList,
	},
	'teams.listFBS': {
		input: CollegeFootballDataEndpointInputSchemas.teamsListFBS,
		output: CollegeFootballDataEndpointOutputSchemas.teamsListFBS,
	},
	'teams.listFCS': {
		input: CollegeFootballDataEndpointInputSchemas.teamsListFCS,
		output: CollegeFootballDataEndpointOutputSchemas.teamsListFCS,
	},
	'teams.getATSRecords': {
		input: CollegeFootballDataEndpointInputSchemas.teamsGetATSRecords,
		output: CollegeFootballDataEndpointOutputSchemas.teamsGetATSRecords,
	},
	'teams.getMatchup': {
		input: CollegeFootballDataEndpointInputSchemas.teamsGetMatchup,
		output: CollegeFootballDataEndpointOutputSchemas.teamsGetMatchup,
	},
	'teams.getRecords': {
		input: CollegeFootballDataEndpointInputSchemas.teamsGetRecords,
		output: CollegeFootballDataEndpointOutputSchemas.teamsGetRecords,
	},
	'teams.getRoster': {
		input: CollegeFootballDataEndpointInputSchemas.teamsGetRoster,
		output: CollegeFootballDataEndpointOutputSchemas.teamsGetRoster,
	},
	'conferences.list': {
		input: CollegeFootballDataEndpointInputSchemas.conferencesList,
		output: CollegeFootballDataEndpointOutputSchemas.conferencesList,
	},
	'conferences.listMemberships': {
		input: CollegeFootballDataEndpointInputSchemas.conferencesListMemberships,
		output: CollegeFootballDataEndpointOutputSchemas.conferencesListMemberships,
	},
	'conferences.listDivisions': {
		input: CollegeFootballDataEndpointInputSchemas.conferencesListDivisions,
		output: CollegeFootballDataEndpointOutputSchemas.conferencesListDivisions,
	},
	'coaches.list': {
		input: CollegeFootballDataEndpointInputSchemas.coachesList,
		output: CollegeFootballDataEndpointOutputSchemas.coachesList,
	},
	'venues.list': {
		input: CollegeFootballDataEndpointInputSchemas.venuesList,
		output: CollegeFootballDataEndpointOutputSchemas.venuesList,
	},
	'recruiting.listRecruits': {
		input: CollegeFootballDataEndpointInputSchemas.recruitingListRecruits,
		output: CollegeFootballDataEndpointOutputSchemas.recruitingListRecruits,
	},
	'recruiting.getTeamRankings': {
		input: CollegeFootballDataEndpointInputSchemas.recruitingGetTeamRankings,
		output: CollegeFootballDataEndpointOutputSchemas.recruitingGetTeamRankings,
	},
	'recruiting.getGroupRatings': {
		input: CollegeFootballDataEndpointInputSchemas.recruitingGetGroupRatings,
		output: CollegeFootballDataEndpointOutputSchemas.recruitingGetGroupRatings,
	},
	'recruiting.getTeamTalent': {
		input: CollegeFootballDataEndpointInputSchemas.recruitingGetTeamTalent,
		output: CollegeFootballDataEndpointOutputSchemas.recruitingGetTeamTalent,
	},
	'rankings.list': {
		input: CollegeFootballDataEndpointInputSchemas.rankingsList,
		output: CollegeFootballDataEndpointOutputSchemas.rankingsList,
	},
	'betting.getLines': {
		input: CollegeFootballDataEndpointInputSchemas.bettingGetLines,
		output: CollegeFootballDataEndpointOutputSchemas.bettingGetLines,
	},
	'draft.listPicks': {
		input: CollegeFootballDataEndpointInputSchemas.draftListPicks,
		output: CollegeFootballDataEndpointOutputSchemas.draftListPicks,
	},
	'draft.listPositions': {
		input: CollegeFootballDataEndpointInputSchemas.draftListPositions,
		output: CollegeFootballDataEndpointOutputSchemas.draftListPositions,
	},
	'draft.listTeams': {
		input: CollegeFootballDataEndpointInputSchemas.draftListTeams,
		output: CollegeFootballDataEndpointOutputSchemas.draftListTeams,
	},
	'seasonTypes.list': {
		input: CollegeFootballDataEndpointInputSchemas.seasonTypesList,
		output: CollegeFootballDataEndpointOutputSchemas.seasonTypesList,
	},
	'account.getUserInfo': {
		input: CollegeFootballDataEndpointInputSchemas.accountGetUserInfo,
		output: CollegeFootballDataEndpointOutputSchemas.accountGetUserInfo,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof collegeFootballDataEndpointsNested
>;

const collegeFootballDataWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof collegeFootballDataWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

/** Every operation in this catalog is a read - this API has no writes at all. */
const collegeFootballDataEndpointMeta = {
	'games.getGamesAndResults': {
		riskLevel: 'read',
		description: 'Get game schedules and results, filtered by season/week/team',
	},
	'games.getMedia': {
		riskLevel: 'read',
		description: 'Get broadcast/media information for games',
	},
	'games.getTeamStats': {
		riskLevel: 'read',
		description: 'Get team-level box score stats for games',
	},
	'games.getPlayerStats': {
		riskLevel: 'read',
		description: 'Get player-level stats for games',
	},
	'games.getAdvancedBoxScore': {
		riskLevel: 'read',
		description: 'Get advanced analytics for a single game',
	},
	'drives.list': {
		riskLevel: 'read',
		description: 'Get drive-level data for games',
	},
	'plays.list': {
		riskLevel: 'read',
		description: 'Get play-by-play data for games',
	},
	'plays.listStats': {
		riskLevel: 'read',
		description: 'Get player-level statistics tied to individual plays',
	},
	'plays.listStatTypes': {
		riskLevel: 'read',
		description: 'List play-level stat type definitions',
	},
	'plays.listTypes': {
		riskLevel: 'read',
		description: 'List available play types',
	},
	'metrics.getFieldGoalExpectedPoints': {
		riskLevel: 'read',
		description: 'Get field goal expected-points model data by distance',
	},
	'metrics.getWinProbability': {
		riskLevel: 'read',
		description: 'Get play-by-play win probabilities for a game',
	},
	'metrics.getPregameWinProbabilities': {
		riskLevel: 'read',
		description: 'Get pregame win probabilities for games',
	},
	'ppa.getByTeamSeason': {
		riskLevel: 'read',
		description: 'Get team PPA (Predicted Points Added) by season',
	},
	'ppa.getByTeamGame': {
		riskLevel: 'read',
		description: 'Get team PPA by game',
	},
	'ppa.getByPlayerSeason': {
		riskLevel: 'read',
		description: 'Get player PPA aggregated by season',
	},
	'ppa.getByPlayerGame': {
		riskLevel: 'read',
		description: 'Get player PPA by game',
	},
	'ppa.getPredictedPoints': {
		riskLevel: 'read',
		description:
			'Get expected points for a down/distance across field positions',
	},
	'ratings.getElo': {
		riskLevel: 'read',
		description: 'Get Elo ratings by season or team',
	},
	'ratings.getFPI': {
		riskLevel: 'read',
		description: 'Get ESPN FPI (Football Power Index) ratings',
	},
	'ratings.getSP': {
		riskLevel: 'read',
		description: 'Get SP+ team ratings',
	},
	'ratings.getConferenceSP': {
		riskLevel: 'read',
		description: 'Get SP+ ratings aggregated by conference',
	},
	'ratings.getSRS': {
		riskLevel: 'read',
		description: 'Get SRS (Simple Rating System) ratings',
	},
	'stats.listCategories': {
		riskLevel: 'read',
		description: 'List valid team statistical category names',
	},
	'stats.getAdvancedGameStats': {
		riskLevel: 'read',
		description: 'Get advanced team metrics at the game level',
	},
	'stats.getGameHavocStats': {
		riskLevel: 'read',
		description: 'Get havoc statistics aggregated by game',
	},
	'stats.getPlayerSeasonStats': {
		riskLevel: 'read',
		description: 'Get aggregated season statistics for players',
	},
	'stats.getTeamSeasonStats': {
		riskLevel: 'read',
		description: 'Get basic season stats aggregated by team',
	},
	'stats.getAdvancedSeasonStats': {
		riskLevel: 'read',
		description: 'Get advanced season-level team statistics',
	},
	'players.search': {
		riskLevel: 'read',
		description: 'Search for players by name',
	},
	'players.getUsage': {
		riskLevel: 'read',
		description: 'Get player usage rates for a season',
	},
	'players.getReturningProduction': {
		riskLevel: 'read',
		description: 'Get returning production splits by team',
	},
	'players.listTransferPortal': {
		riskLevel: 'read',
		description: 'Get transfer portal entries for a season',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams, optionally filtered by conference/season',
	},
	'teams.listFBS': {
		riskLevel: 'read',
		description: 'List FBS teams for a season',
	},
	'teams.listFCS': {
		riskLevel: 'read',
		description: 'List FCS teams for a season/conference',
	},
	'teams.getATSRecords': {
		riskLevel: 'read',
		description: 'Get against-the-spread (ATS) summary by team',
	},
	'teams.getMatchup': {
		riskLevel: 'read',
		description: 'Get head-to-head matchup history between two teams',
	},
	'teams.getRecords': {
		riskLevel: 'read',
		description: 'Get team win-loss records for a season',
	},
	'teams.getRoster': {
		riskLevel: 'read',
		description: "Get a team's roster for a season",
	},
	'conferences.list': {
		riskLevel: 'read',
		description: 'List all conferences across every NCAA division',
	},
	'conferences.listMemberships': {
		riskLevel: 'read',
		description: 'Get current/historical conference memberships for teams',
	},
	'conferences.listDivisions': {
		riskLevel: 'read',
		description: 'List conference divisions with active years and metadata',
	},
	'coaches.list': {
		riskLevel: 'read',
		description: 'Get coaching records and history',
	},
	'venues.list': {
		riskLevel: 'read',
		description: 'List venues with metadata',
	},
	'recruiting.listRecruits': {
		riskLevel: 'read',
		description: 'Get recruit rankings',
	},
	'recruiting.getTeamRankings': {
		riskLevel: 'read',
		description: 'Get team recruiting class rankings',
	},
	'recruiting.getGroupRatings': {
		riskLevel: 'read',
		description: 'Get recruiting data grouped by position',
	},
	'recruiting.getTeamTalent': {
		riskLevel: 'read',
		description: 'Get composite team talent rankings for a season',
	},
	'rankings.list': {
		riskLevel: 'read',
		description: 'Get poll rankings by season',
	},
	'betting.getLines': {
		riskLevel: 'read',
		description: 'Get betting lines and totals by game and provider',
	},
	'draft.listPicks': {
		riskLevel: 'read',
		description: 'List NFL draft picks',
	},
	'draft.listPositions': {
		riskLevel: 'read',
		description: 'Get the standardized list of NFL draft positions',
	},
	'draft.listTeams': {
		riskLevel: 'read',
		description: 'List NFL teams used in draft endpoints',
	},
	'seasonTypes.list': {
		riskLevel: 'read',
		description: 'Get the valid season-type vocabulary',
	},
	'account.getUserInfo': {
		riskLevel: 'read',
		description:
			"Get the authenticated user's subscription tier and remaining API calls",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof collegeFootballDataEndpointsNested
>;

export type BaseCollegeFootballDataPlugin<
	T extends CollegeFootballDataPluginOptions,
> = CorsairPlugin<
	'collegefootballdata',
	typeof CollegeFootballDataSchema,
	typeof collegeFootballDataEndpointsNested,
	typeof collegeFootballDataWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCollegeFootballDataPlugin =
	BaseCollegeFootballDataPlugin<CollegeFootballDataPluginOptions>;

export type ExternalCollegeFootballDataPlugin<
	T extends CollegeFootballDataPluginOptions,
> = BaseCollegeFootballDataPlugin<T>;

/**
 * Builds the College Football Data plugin.
 *
 * The provider authenticates with a single API key and has no OAuth flow -
 * confirmed from the OpenAPI document's `securitySchemes`, which declares
 * only `{ type: "http", scheme: "bearer" }` - so only `api_key` auth is
 * offered.
 */
export function collegefootballdata<
	const T extends CollegeFootballDataPluginOptions,
>(
	incomingOptions: CollegeFootballDataPluginOptions &
		T = {} as CollegeFootballDataPluginOptions & T,
): ExternalCollegeFootballDataPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'collegefootballdata',
		authConfig: collegeFootballDataAuthConfig,
		schema: CollegeFootballDataSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: collegeFootballDataEndpointsNested,
		webhooks: collegeFootballDataWebhooksNested,
		endpointMeta: collegeFootballDataEndpointMeta,
		endpointSchemas: collegeFootballDataEndpointSchemas,
		webhookSchemas: collegeFootballDataWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchCollegeFootballDataTenantWebhook,
		oauthWebhookTenantLinkResolver:
			resolveCollegeFootballDataOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CollegeFootballDataKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCollegeFootballDataPlugin;
}

export type {
	CollegeFootballDataAdvancedBoxScore,
	CollegeFootballDataAdvancedStats,
	CollegeFootballDataBettingLineGame,
	CollegeFootballDataCoach,
	CollegeFootballDataConference,
	CollegeFootballDataConferenceSPRating,
	CollegeFootballDataDraftPick,
	CollegeFootballDataDraftPosition,
	CollegeFootballDataDraftTeam,
	CollegeFootballDataDrive,
	CollegeFootballDataEloRating,
	CollegeFootballDataEndpointInputs,
	CollegeFootballDataEndpointOutputs,
	CollegeFootballDataFieldGoalEP,
	CollegeFootballDataFPIRating,
	CollegeFootballDataGame,
	CollegeFootballDataGameHavocStats,
	CollegeFootballDataGameMedia,
	CollegeFootballDataGameTeamStats,
	CollegeFootballDataPlay,
	CollegeFootballDataPlayerGamePPA,
	CollegeFootballDataPlayerSearchResult,
	CollegeFootballDataPlayerSeasonPPA,
	CollegeFootballDataPlayerSeasonStat,
	CollegeFootballDataPlayerUsage,
	CollegeFootballDataPlayStat,
	CollegeFootballDataPlayType,
	CollegeFootballDataPredictedPoints,
	CollegeFootballDataPregameWinProbability,
	CollegeFootballDataRankingWeek,
	CollegeFootballDataRecruit,
	CollegeFootballDataRecruitingGroup,
	CollegeFootballDataReturningProduction,
	CollegeFootballDataRosterPlayer,
	CollegeFootballDataSeasonType,
	CollegeFootballDataSPRating,
	CollegeFootballDataSRSRating,
	CollegeFootballDataTeam,
	CollegeFootballDataTeamATSRecord,
	CollegeFootballDataTeamConferenceAffiliation,
	CollegeFootballDataTeamGamePPA,
	CollegeFootballDataTeamMatchup,
	CollegeFootballDataTeamPPA,
	CollegeFootballDataTeamRecord,
	CollegeFootballDataTeamRecruitingRanking,
	CollegeFootballDataTeamSeasonStat,
	CollegeFootballDataTeamTalent,
	CollegeFootballDataTransferPortalEntry,
	CollegeFootballDataUserInfo,
	CollegeFootballDataVenue,
	CollegeFootballDataWinProbability,
} from './endpoints/types';
export type { CollegeFootballDataWebhookOutputs } from './webhooks/types';
