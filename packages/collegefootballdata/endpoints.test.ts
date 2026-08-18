/**
 * Exercises all 56 endpoint wrappers: the HTTP method and path each one
 * builds, the cache writes they perform, and what reaches the event log.
 * Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
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
import { collegeFootballDataEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock };

function makeStore(): Store {
	return { upsertByEntityId: jest.fn(async () => undefined) };
}

type Ctx = Parameters<typeof Account.getUserInfo>[0];

function makeCtx() {
	const db = {
		teams: makeStore(),
		conferences: makeStore(),
		venues: makeStore(),
		coaches: makeStore(),
	};
	// Cast, not a claim that this satisfies the real Ctx shape: only the
	// fields every endpoint under test actually reads (`key`, `db`) are built.
	const ctx = {
		key: 'test-cfbd-key',
		db,
	} as unknown as Ctx;
	return { ctx, db };
}

let lastUrl = '';
let lastMethod = '';

/**
 * A single fixture serves every operation below. Most of this catalog
 * returns a bare top-level array; three operations
 * (`games.getAdvancedBoxScore`, `teams.getMatchup`,
 * `account.getUserInfo`) return a single object instead. Since a JS array
 * is also an object, it can carry named properties alongside its indexed
 * elements - so the fixture is built as "an array with extra properties",
 * satisfying both access patterns without a fixture per operation.
 */
const listItem = {
	id: 1,
	school: 'Listed',
	name: 'Listed',
	firstName: 'Listed',
	lastName: 'Coach',
	hireDate: '2020-01-01',
	mascot: 'Tigers',
	abbreviation: 'LST',
	conference: 'SEC',
	classification: 'fbs',
	capacity: 100000,
	team: 'Listed',
};

const RESPONSE_BODY = Object.assign([listItem], {
	gameInfo: { id: 1 },
	teams: { home: {}, away: {} },
	players: {},
	team1: 'TeamA',
	team2: 'TeamB',
	team1Wins: 1,
	team2Wins: 0,
	ties: 0,
	games: [],
	patronLevel: 0,
	tierName: 'Free',
	monthlyLimit: 1000,
	remainingCalls: 999,
	usedCalls: 1,
	resetAt: '2026-09-01T00:00:00.000Z',
});

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	// `url` is `unknown` rather than `RequestInfo | URL`; see client.test.ts.
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

/** [registry path, invocation, expected method, expected path] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	[
		'games.getGamesAndResults',
		(c) => Games.getGamesAndResults(c, { year: 2023 }),
		'GET',
		'/games',
	],
	[
		'games.getMedia',
		(c) => Games.getMedia(c, { year: 2023 }),
		'GET',
		'/games/media',
	],
	[
		'games.getTeamStats',
		(c) => Games.getTeamStats(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/games/teams',
	],
	[
		'games.getPlayerStats',
		(c) => Games.getPlayerStats(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/games/players',
	],
	[
		'games.getAdvancedBoxScore',
		(c) => Games.getAdvancedBoxScore(c, { id: 401525434 }),
		'GET',
		'/game/box/advanced',
	],
	['drives.list', (c) => Drives.list(c, { year: 2023 }), 'GET', '/drives'],
	[
		'plays.list',
		(c) => Plays.list(c, { year: 2023, week: 1 }),
		'GET',
		'/plays',
	],
	[
		'plays.listStats',
		(c) => Plays.listStats(c, { year: 2023 }),
		'GET',
		'/plays/stats',
	],
	[
		'plays.listStatTypes',
		(c) => Plays.listStatTypes(c, {}),
		'GET',
		'/plays/stats/types',
	],
	['plays.listTypes', (c) => Plays.listTypes(c, {}), 'GET', '/plays/types'],
	[
		'metrics.getFieldGoalExpectedPoints',
		(c) => Metrics.getFieldGoalExpectedPoints(c, {}),
		'GET',
		'/metrics/fg/ep',
	],
	[
		'metrics.getWinProbability',
		(c) => Metrics.getWinProbability(c, { gameId: 401525434 }),
		'GET',
		'/metrics/wp',
	],
	[
		'metrics.getPregameWinProbabilities',
		(c) => Metrics.getPregameWinProbabilities(c, { year: 2023 }),
		'GET',
		'/metrics/wp/pregame',
	],
	[
		'ppa.getByTeamSeason',
		(c) => Ppa.getByTeamSeason(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/ppa/teams',
	],
	[
		'ppa.getByTeamGame',
		(c) => Ppa.getByTeamGame(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/ppa/games',
	],
	[
		'ppa.getByPlayerSeason',
		(c) => Ppa.getByPlayerSeason(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/ppa/players/season',
	],
	[
		'ppa.getByPlayerGame',
		(c) => Ppa.getByPlayerGame(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/ppa/players/games',
	],
	[
		'ppa.getPredictedPoints',
		(c) => Ppa.getPredictedPoints(c, { down: 3, distance: 5 }),
		'GET',
		'/ppa/predicted',
	],
	[
		'ratings.getElo',
		(c) => Ratings.getElo(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/ratings/elo',
	],
	[
		'ratings.getFPI',
		(c) => Ratings.getFPI(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/ratings/fpi',
	],
	[
		'ratings.getSP',
		(c) => Ratings.getSP(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/ratings/sp',
	],
	[
		'ratings.getConferenceSP',
		(c) => Ratings.getConferenceSP(c, { year: 2023 }),
		'GET',
		'/ratings/sp/conferences',
	],
	[
		'ratings.getSRS',
		(c) => Ratings.getSRS(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/ratings/srs',
	],
	[
		'stats.listCategories',
		(c) => Stats.listCategories(c, {}),
		'GET',
		'/stats/categories',
	],
	[
		'stats.getAdvancedGameStats',
		(c) => Stats.getAdvancedGameStats(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/stats/game/advanced',
	],
	[
		'stats.getGameHavocStats',
		(c) => Stats.getGameHavocStats(c, { year: 2023 }),
		'GET',
		'/stats/game/havoc',
	],
	[
		'stats.getPlayerSeasonStats',
		(c) => Stats.getPlayerSeasonStats(c, { year: 2023 }),
		'GET',
		'/stats/player/season',
	],
	[
		'stats.getTeamSeasonStats',
		(c) => Stats.getTeamSeasonStats(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/stats/season',
	],
	[
		'stats.getAdvancedSeasonStats',
		(c) => Stats.getAdvancedSeasonStats(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/stats/season/advanced',
	],
	[
		'players.search',
		(c) => Players.search(c, { searchTerm: 'Manning' }),
		'GET',
		'/player/search',
	],
	[
		'players.getUsage',
		(c) => Players.getUsage(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/player/usage',
	],
	[
		'players.getReturningProduction',
		(c) => Players.getReturningProduction(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/player/returning',
	],
	[
		'players.listTransferPortal',
		(c) => Players.listTransferPortal(c, { year: 2023 }),
		'GET',
		'/player/portal',
	],
	['teams.list', (c) => Teams.list(c, {}), 'GET', '/teams'],
	[
		'teams.listFBS',
		(c) => Teams.listFBS(c, { year: 2023 }),
		'GET',
		'/teams/fbs',
	],
	['teams.listFCS', (c) => Teams.listFCS(c, {}), 'GET', '/teams'],
	[
		'teams.getATSRecords',
		(c) => Teams.getATSRecords(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/teams/ats',
	],
	[
		'teams.getMatchup',
		(c) => Teams.getMatchup(c, { team1: 'Alabama', team2: 'Auburn' }),
		'GET',
		'/teams/matchup',
	],
	[
		'teams.getRecords',
		(c) => Teams.getRecords(c, { year: 2023, team: 'Alabama' }),
		'GET',
		'/records',
	],
	[
		'teams.getRoster',
		(c) => Teams.getRoster(c, { team: 'Alabama', year: 2023 }),
		'GET',
		'/roster',
	],
	['conferences.list', (c) => Conferences.list(c, {}), 'GET', '/conferences'],
	[
		'conferences.listMemberships',
		(c) => Conferences.listMemberships(c, { year: 2023 }),
		'GET',
		'/conferences/affiliations',
	],
	[
		'conferences.listDivisions',
		(c) => Conferences.listDivisions(c, { year: 2023 }),
		'GET',
		'/conferences/affiliations',
	],
	[
		'coaches.list',
		(c) => Coaches.list(c, { team: 'Alabama' }),
		'GET',
		'/coaches',
	],
	['venues.list', (c) => Venues.list(c, {}), 'GET', '/venues'],
	[
		'recruiting.listRecruits',
		(c) => Recruiting.listRecruits(c, { year: 2023 }),
		'GET',
		'/recruiting/players',
	],
	[
		'recruiting.getTeamRankings',
		(c) => Recruiting.getTeamRankings(c, { year: 2023 }),
		'GET',
		'/recruiting/teams',
	],
	[
		'recruiting.getGroupRatings',
		(c) => Recruiting.getGroupRatings(c, { team: 'Alabama' }),
		'GET',
		'/recruiting/groups',
	],
	[
		'recruiting.getTeamTalent',
		(c) => Recruiting.getTeamTalent(c, { year: 2023 }),
		'GET',
		'/talent',
	],
	[
		'rankings.list',
		(c) => Rankings.list(c, { year: 2023 }),
		'GET',
		'/rankings',
	],
	[
		'betting.getLines',
		(c) => Betting.getLines(c, { year: 2023 }),
		'GET',
		'/lines',
	],
	[
		'draft.listPicks',
		(c) => Draft.listPicks(c, { year: 2023 }),
		'GET',
		'/draft/picks',
	],
	[
		'draft.listPositions',
		(c) => Draft.listPositions(c, {}),
		'GET',
		'/draft/positions',
	],
	['draft.listTeams', (c) => Draft.listTeams(c, {}), 'GET', '/draft/teams'],
	['account.getUserInfo', (c) => Account.getUserInfo(c, {}), 'GET', '/info'],
];

describe('operation routing', () => {
	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath}`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			expect(new URL(lastUrl).pathname).toBe(expectedPath);
		});
	}
});

describe('seasonTypes.list', () => {
	/**
	 * The only operation in this catalog with no backing endpoint at all -
	 * confirmed no route exists anywhere in the OpenAPI document. Asserted
	 * separately from the routing table above since there is no method/path
	 * to check.
	 */
	it('returns the static season-type vocabulary without calling fetch', async () => {
		const { ctx } = makeCtx();
		const fetchSpy = jest.fn();
		global.fetch = fetchSpy as unknown as typeof global.fetch;

		const result = await SeasonTypes.list(ctx, {});

		expect(result).toEqual([
			'regular',
			'postseason',
			'both',
			'allstar',
			'spring_regular',
			'spring_postseason',
		]);
		expect(fetchSpy).not.toHaveBeenCalled();
	});
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = Object.keys(collegeFootballDataEndpointSchemas).sort();
		const exercised = [
			...OPERATIONS.map(([path]) => path),
			'seasonTypes.list',
		].sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(56);
	});
});

describe('teams.listFCS', () => {
	/**
	 * There is no `/teams/fcs` route. OpenAPI 5.24.0 `GET /teams` only
	 * documents `conference` and `year`; a live `classification=fcs` query
	 * is ignored. This asserts the endpoint filters client-side instead.
	 */
	it('filters to fcs client-side rather than trusting the server', async () => {
		const { ctx } = makeCtx();
		const mixed = [
			{ id: 1, school: 'FBS School', classification: 'fbs' },
			{ id: 2, school: 'FCS School', classification: 'fcs' },
			{ id: 3, school: 'D2 School', classification: 'ii' },
		];
		global.fetch = (async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			url: 'https://api.collegefootballdata.com/teams',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => mixed,
			text: async () => JSON.stringify(mixed),
		})) as unknown as typeof global.fetch;

		const result = await Teams.listFCS(ctx, {});

		expect(result).toHaveLength(1);
		expect(result[0]?.school).toBe('FCS School');
	});

	it('never sends a classification query param the server ignores', async () => {
		const { ctx } = makeCtx();
		await Teams.listFCS(ctx, { conference: 'Ivy' });

		expect(lastUrl).not.toContain('classification');
		expect(lastUrl).toContain('conference=Ivy');
	});
});

describe('caching', () => {
	// Teams.listFCS's caching (or lack of it, when the fixture's
	// classification doesn't match 'fcs') is covered by the dedicated
	// `teams.listFCS` describe block above.
	it('mirrors a team on list and listFBS', async () => {
		const { ctx, db } = makeCtx();

		await Teams.list(ctx, {});
		await Teams.listFBS(ctx, { year: 2023 });

		expect(db.teams.upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	it('mirrors a conference on list', async () => {
		const { ctx, db } = makeCtx();

		await Conferences.list(ctx, {});

		expect(db.conferences.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('mirrors a venue on list', async () => {
		const { ctx, db } = makeCtx();

		await Venues.list(ctx, {});

		expect(db.venues.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('mirrors a coach on list', async () => {
		const { ctx, db } = makeCtx();

		await Coaches.list(ctx, {});

		expect(db.coaches.upsertByEntityId).toHaveBeenCalledTimes(1);
	});
});

describe('event log', () => {
	it('logs exactly once per call and keeps free text out of the payload', async () => {
		const { ctx } = makeCtx();
		await Players.search(ctx, { searchTerm: 'a very specific player name' });

		expect(mockLogEvent).toHaveBeenCalledTimes(1);
		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).not.toHaveProperty('searchTerm');
		expect(JSON.stringify(payload)).not.toContain(
			'a very specific player name',
		);
	});

	it('logs the query identifiers for a filtered read', async () => {
		const { ctx } = makeCtx();
		await Games.getGamesAndResults(ctx, {
			year: 2023,
			week: 5,
			team: 'Alabama',
		});

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({
			year: 2023,
			week: 5,
			team: 'Alabama',
			fields: ['year', 'week', 'team'],
		});
	});
});

describe('query parameters', () => {
	it('sends the id (not gameId) param for games.getAdvancedBoxScore', async () => {
		const { ctx } = makeCtx();
		await Games.getAdvancedBoxScore(ctx, { id: 401525434 });

		expect(lastUrl).toContain('id=401525434');
		expect(lastUrl).not.toContain('gameId');
	});

	it('sends the gameId (not id) param for metrics.getWinProbability', async () => {
		const { ctx } = makeCtx();
		await Metrics.getWinProbability(ctx, { gameId: 401525434 });

		expect(lastUrl).toContain('gameId=401525434');
		expect(new URL(lastUrl).searchParams.get('id')).toBeNull();
	});

	it('omits fields the caller did not supply', async () => {
		const { ctx } = makeCtx();
		await Ratings.getElo(ctx, { year: 2023 });

		expect(lastUrl).toContain('year=2023');
		expect(lastUrl).not.toContain('team=');
		expect(lastUrl).not.toContain('conference=');
	});

	/**
	 * Confirmed live: `playType` 200s on `/plays/stats` but is silently
	 * ignored (identical, unfiltered results), while `gameId` genuinely
	 * narrows the response. `playType` is not a documented parameter for
	 * this route at all.
	 */
	it('sends gameId/statTypeId (not playType) for plays.listStats', async () => {
		const { ctx } = makeCtx();
		await Plays.listStats(ctx, {
			year: 2023,
			gameId: 401525434,
			statTypeId: 4,
		});

		expect(lastUrl).toContain('gameId=401525434');
		expect(lastUrl).toContain('statTypeId=4');
		expect(lastUrl).not.toContain('playType');
	});

	it('sends opponent/seasonType, not conference, for stats.getGameHavocStats', async () => {
		const { ctx } = makeCtx();
		await Stats.getGameHavocStats(ctx, {
			year: 2023,
			team: 'Alabama',
			opponent: 'Texas',
			seasonType: 'regular',
		});

		expect(lastUrl).toContain('opponent=Texas');
		expect(lastUrl).toContain('seasonType=regular');
		expect(lastUrl).not.toContain('conference=');
	});
});

describe('conditional input requirements', () => {
	/**
	 * Each of these is a "required unless" or "at least one of" rule
	 * confirmed from the spec's own parameter descriptions (see
	 * `endpoints/types.ts`), not just catalog prose. Enforcing them at the
	 * schema layer surfaces a clear error instead of a provider 400/empty
	 * response.
	 */
	it('rejects games.getTeamStats with neither id nor year', () => {
		const result = collegeFootballDataEndpointSchemas[
			'games.getTeamStats'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects games.getTeamStats with year but none of week/team/conference', () => {
		const result = collegeFootballDataEndpointSchemas[
			'games.getTeamStats'
		].input.safeParse({ year: 2023 });
		expect(result.success).toBe(false);
	});

	it('accepts games.getTeamStats with id alone', () => {
		const result = collegeFootballDataEndpointSchemas[
			'games.getTeamStats'
		].input.safeParse({ id: 401525434 });
		expect(result.success).toBe(true);
	});

	it('rejects ppa.getByPlayerGame with year but neither week nor team', () => {
		const result = collegeFootballDataEndpointSchemas[
			'ppa.getByPlayerGame'
		].input.safeParse({ year: 2023 });
		expect(result.success).toBe(false);
	});

	it('rejects ratings.getSRS with neither year nor team', () => {
		const result = collegeFootballDataEndpointSchemas[
			'ratings.getSRS'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects recruiting.listRecruits with neither year nor team', () => {
		const result = collegeFootballDataEndpointSchemas[
			'recruiting.listRecruits'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects stats.getTeamSeasonStats with neither year nor team', () => {
		const result = collegeFootballDataEndpointSchemas[
			'stats.getTeamSeasonStats'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects stats.getAdvancedGameStats with neither year nor team', () => {
		const result = collegeFootballDataEndpointSchemas[
			'stats.getAdvancedGameStats'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects stats.getAdvancedSeasonStats with neither year nor team', () => {
		const result = collegeFootballDataEndpointSchemas[
			'stats.getAdvancedSeasonStats'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects plays.list without week (both year and week are required)', () => {
		const result = collegeFootballDataEndpointSchemas[
			'plays.list'
		].input.safeParse({ year: 2023 });
		expect(result.success).toBe(false);
	});

	it('rejects ppa.getByTeamGame without year', () => {
		const result = collegeFootballDataEndpointSchemas[
			'ppa.getByTeamGame'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects ppa.getByTeamSeason with neither year nor team', () => {
		const result = collegeFootballDataEndpointSchemas[
			'ppa.getByTeamSeason'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects stats.getGameHavocStats with neither year nor team', () => {
		const result = collegeFootballDataEndpointSchemas[
			'stats.getGameHavocStats'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects recruiting.getTeamTalent without year', () => {
		const result = collegeFootballDataEndpointSchemas[
			'recruiting.getTeamTalent'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects betting.getLines with neither year nor gameId', () => {
		const result = collegeFootballDataEndpointSchemas[
			'betting.getLines'
		].input.safeParse({});
		expect(result.success).toBe(false);
	});
});
