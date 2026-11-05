import type { ApiSport } from '../client';

export type ApiSportsRoute = {
	sport: ApiSport;
	path: string;
	description: string;
};

export const API_SPORTS_ROUTES = {
	getCountries: {
		sport: 'football',
		path: '/countries',
		description: 'Get Countries',
	},
	getTimezone: {
		sport: 'football',
		path: '/timezone',
		description: 'Get Timezone',
	},
	getLeagues: {
		sport: 'football',
		path: '/leagues',
		description: 'Get Leagues',
	},
	getLeagueSeasons: {
		sport: 'football',
		path: '/leagues/seasons',
		description: 'Get League Seasons',
	},
	getTeams: { sport: 'football', path: '/teams', description: 'Get Teams' },
	getTeamSeasons: {
		sport: 'football',
		path: '/teams/seasons',
		description: 'Get Team Seasons',
	},
	getTeamStatistics: {
		sport: 'football',
		path: '/teams/statistics',
		description: 'Get Team Statistics',
	},
	getVenues: { sport: 'football', path: '/venues', description: 'Get Venues' },
	getCoaches: {
		sport: 'football',
		path: '/coachs',
		description: 'Get Coaches',
	},
	getInjuries: {
		sport: 'football',
		path: '/injuries',
		description: 'Get Injuries',
	},
	getSidelined: {
		sport: 'football',
		path: '/sidelined',
		description: 'Get Sidelined',
	},
	getTransfers: {
		sport: 'football',
		path: '/transfers',
		description: 'Get Transfers',
	},
	getTrophies: {
		sport: 'football',
		path: '/trophies',
		description: 'Get Trophies',
	},
	getPredictions: {
		sport: 'football',
		path: '/predictions',
		description: 'Get Predictions',
	},
	getFixtures: {
		sport: 'football',
		path: '/fixtures',
		description: 'Get Fixtures',
	},
	getFixturesRounds: {
		sport: 'football',
		path: '/fixtures/rounds',
		description: 'Get Fixtures Rounds',
	},
	getHeadToHeadFixtures: {
		sport: 'football',
		path: '/fixtures/headtohead',
		description: 'Get Head-to-Head Fixtures',
	},
	getFixtureLineups: {
		sport: 'football',
		path: '/fixtures/lineups',
		description: 'Get Fixture Lineups',
	},
	getFixtureStatistics: {
		sport: 'football',
		path: '/fixtures/statistics',
		description: 'Get Fixture Statistics',
	},
	getFixturesEvents: {
		sport: 'football',
		path: '/fixtures/events',
		description: 'Get Fixtures Events',
	},
	getFixturesPlayers: {
		sport: 'football',
		path: '/fixtures/players',
		description: 'Get Fixtures Players',
	},
	// Football API documents /standings/stages + /standings/groups; NFL host rejects both.
	getStandingsStages: {
		sport: 'football',
		path: '/standings/stages',
		description: 'Get Standings Stages',
	},
	getStandingsGroups: {
		sport: 'football',
		path: '/standings/groups',
		description: 'Get Standings Groups',
	},
	getStandingsDivisions: {
		sport: 'nfl',
		path: '/standings/divisions',
		description: 'Get Standings Divisions',
	},
	getNflStandingsConferences: {
		sport: 'nfl',
		path: '/standings/conferences',
		description: 'Get NFL Standings Conferences',
	},
	getPlayers: {
		sport: 'football',
		path: '/players',
		description: 'Get Players',
	},
	getPlayersProfiles: {
		sport: 'football',
		path: '/players/profiles',
		description: 'Get Players Profiles',
	},
	getPlayersSeasons: {
		sport: 'football',
		path: '/players/seasons',
		description: 'Get Players Seasons',
	},
	getPlayersSquads: {
		sport: 'football',
		path: '/players/squads',
		description: 'Get Players Squads',
	},
	getPlayersTeams: {
		sport: 'football',
		path: '/players/teams',
		description: 'Get Players Teams',
	},
	getPlayersTopScorers: {
		sport: 'football',
		path: '/players/topscorers',
		description: 'Get Players Top Scorers',
	},
	getPlayersTopAssists: {
		sport: 'football',
		path: '/players/topassists',
		description: 'Get Players Top Assists',
	},
	getPlayersTopYellowCards: {
		sport: 'football',
		path: '/players/topyellowcards',
		description: 'Get Players Top Yellow Cards',
	},
	getPlayersTopRedCards: {
		sport: 'football',
		path: '/players/topredcards',
		description: 'Get Players Top Red Cards',
	},
	getOdds: { sport: 'football', path: '/odds', description: 'Get Odds' },
	getOddsBets: {
		sport: 'football',
		path: '/odds/bets',
		description: 'Get Odds Bets',
	},
	getOddsBookmakers: {
		sport: 'football',
		path: '/odds/bookmakers',
		description: 'Get Odds Bookmakers',
	},
	getOddsMapping: {
		sport: 'football',
		path: '/odds/mapping',
		description: 'Get Odds Mapping',
	},
	getInPlayOdds: {
		sport: 'football',
		path: '/odds/live',
		description: 'Get In-Play Odds',
	},
	getLiveOddsBets: {
		sport: 'football',
		path: '/odds/live/bets',
		description: 'Get Live Odds Bets',
	},
	getBasketballStatistics: {
		sport: 'basketball',
		path: '/statistics',
		description: 'Get Basketball Statistics',
	},
	getBasketballBets: {
		sport: 'basketball',
		path: '/bets',
		description: 'Get Basketball Bets',
	},
	getBasketballBookmakers: {
		sport: 'basketball',
		path: '/bookmakers',
		description: 'Get Basketball Bookmakers',
	},
	getNbaGameStatistics: {
		sport: 'nba',
		path: '/games/statistics',
		description: 'Get NBA Game Statistics',
	},
	getPlayerStatistics: {
		sport: 'nba',
		path: '/players/statistics',
		description: 'Get Player Statistics',
	},
	getGameStatisticsByTeams: {
		sport: 'basketball',
		path: '/games/statistics/teams',
		description: 'Get Game Statistics by Teams',
	},
	// NBA has no /games/events; American football (nfl) does.
	getGamesEvents: {
		sport: 'nfl',
		path: '/games/events',
		description: 'Get Games Events',
	},
	getAflSeasons: {
		sport: 'afl',
		path: '/seasons',
		description: 'Get AFL Seasons',
	},
	getAflGames: { sport: 'afl', path: '/games', description: 'Get AFL Games' },
	getAflGamesQuarters: {
		sport: 'afl',
		path: '/games/quarters',
		description: 'Get AFL Games Quarters',
	},
	getAflGamePlayerStatistics: {
		sport: 'afl',
		path: '/games/statistics/players',
		description: 'Get AFL Game Player Statistics',
	},
	getAflStandings: {
		sport: 'afl',
		path: '/standings',
		description: 'Get AFL Standings',
	},
	getBaseballGamesHeadToHead: {
		sport: 'baseball',
		path: '/games/h2h',
		description: 'Get Baseball Games Head-to-Head',
	},
	getFormula1Circuits: {
		sport: 'formula1',
		path: '/circuits',
		description: 'Get Formula 1 Circuits',
	},
	getFormula1Competitions: {
		sport: 'formula1',
		path: '/competitions',
		description: 'Get Formula 1 Competitions',
	},
	getFormula1Races: {
		sport: 'formula1',
		path: '/races',
		description: 'Get Formula 1 Races',
	},
	getFormula1DriverRankings: {
		sport: 'formula1',
		path: '/rankings/drivers',
		description: 'Get Formula 1 Driver Rankings',
	},
	getFormula1TeamRankings: {
		sport: 'formula1',
		path: '/rankings/teams',
		description: 'Get Formula 1 Team Rankings',
	},
	getFormula1StartingGrid: {
		sport: 'formula1',
		path: '/rankings/startinggrid',
		description: 'Get Formula 1 Starting Grid',
	},
	getFastestLapsRankings: {
		sport: 'formula1',
		path: '/rankings/fastestlaps',
		description: 'Get Fastest Laps Rankings',
	},
	getRaceRankings: {
		sport: 'formula1',
		path: '/rankings/races',
		description: 'Get Race Rankings',
	},
	getMmaCategories: {
		sport: 'mma',
		path: '/categories',
		description: 'Get MMA Categories',
	},
	getMmaFighters: {
		sport: 'mma',
		path: '/fighters',
		description: 'Get MMA Fighters',
	},
	getMmaFights: {
		sport: 'mma',
		path: '/fights',
		description: 'Get MMA Fights',
	},
	getMmaFightResults: {
		sport: 'mma',
		path: '/fights/results',
		description: 'Get MMA Fight Results',
	},
	getMmaFighterStatistics: {
		sport: 'mma',
		path: '/fights/statistics/fighters',
		description: 'Get MMA Fighter Statistics',
	},
	getFightersRecords: {
		sport: 'mma',
		path: '/fighters/records',
		description: 'Get Fighters Records',
	},
} as const satisfies Record<string, ApiSportsRoute>;

export type ApiSportsRouteKey = keyof typeof API_SPORTS_ROUTES;
