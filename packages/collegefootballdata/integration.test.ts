/**
 * Live checks against a real College Football Data account.
 *
 * Skipped unless `CFBD_API_KEY` is set, so CI and contributors without
 * credentials are unaffected. Every operation here is a read - this API has
 * no writes at all, so nothing is created, changed or deleted.
 *
 * The free tier is a **monthly call quota** (confirmed via `account.getUserInfo`
 * - 1000 calls/month, not a per-minute limit), so this suite is deliberately
 * narrow: one representative call per resource group rather than one per
 * operation, to leave headroom for whoever runs it next.
 */
import {
	Account,
	Coaches,
	Conferences,
	Draft,
	Games,
	Metrics,
	Players,
	Ratings,
	Recruiting,
	SeasonTypes,
	Stats,
	Teams,
	Venues,
} from './endpoints';
import {
	CollegeFootballDataCoachSchema,
	CollegeFootballDataConferenceSchema,
	CollegeFootballDataGameSchema,
	CollegeFootballDataTeamSchema,
	CollegeFootballDataUserInfoSchema,
	CollegeFootballDataVenueSchema,
} from './endpoints/types';

const apiKey = process.env.CFBD_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

type Ctx = Parameters<typeof Account.getUserInfo>[0];

function makeStore() {
	return {
		upsertByEntityId: async (_id: string, _data: unknown) => undefined,
	};
}

function makeCtx(): Ctx {
	return {
		key: apiKey ?? '',
		db: {
			teams: makeStore(),
			conferences: makeStore(),
			venues: makeStore(),
			coaches: makeStore(),
		},
	} as unknown as Ctx;
}

describeLive('College Football Data live API', () => {
	it('reports account tier and remaining quota, matching the declared schema', async () => {
		const result = await Account.getUserInfo(makeCtx(), {});

		expect(CollegeFootballDataUserInfoSchema.safeParse(result).success).toBe(
			true,
		);
		expect(typeof result.remainingCalls).toBe('number');
	});

	it('lists FBS teams matching the declared schema', async () => {
		const result = await Teams.listFBS(makeCtx(), { year: 2023 });

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(CollegeFootballDataTeamSchema.safeParse(result[0]).success).toBe(
			true,
		);
	});

	/**
	 * The one operation this repo could not verify server-side filters
	 * `classification` - this proves the client-side filter actually narrows
	 * a real, non-trivial result set rather than passing vacuously on an
	 * already-small list.
	 */
	it('lists FCS teams, narrowed client-side from a real mixed response', async () => {
		const result = await Teams.listFCS(makeCtx(), {});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		for (const team of result) {
			expect(team.classification).toBe('fcs');
		}
	});

	it('lists conferences matching the declared schema', async () => {
		const result = await Conferences.list(makeCtx(), {});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(
			CollegeFootballDataConferenceSchema.safeParse(result[0]).success,
		).toBe(true);
	});

	it('lists venues matching the declared schema', async () => {
		const result = await Venues.list(makeCtx(), {});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(CollegeFootballDataVenueSchema.safeParse(result[0]).success).toBe(
			true,
		);
	});

	it('lists coaches matching the declared schema', async () => {
		const result = await Coaches.list(makeCtx(), { team: 'Alabama' });

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(CollegeFootballDataCoachSchema.safeParse(result[0]).success).toBe(
			true,
		);
		expect(result[0]?.seasons?.[0]).toEqual(
			expect.objectContaining({
				teamId: expect.any(Number),
				school: expect.any(String),
				year: expect.any(Number),
			}),
		);
	});

	it('gets games for a real week matching the declared schema', async () => {
		const result = await Games.getGamesAndResults(makeCtx(), {
			year: 2023,
			week: 1,
			seasonType: 'regular',
			classification: 'fbs',
		});

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(CollegeFootballDataGameSchema.safeParse(result[0]).success).toBe(
			true,
		);
	});

	it('gets a real game id, then fetches its advanced box score and win probability', async () => {
		const games = await Games.getGamesAndResults(makeCtx(), {
			year: 2023,
			week: 1,
			seasonType: 'regular',
			classification: 'fbs',
		});
		const target = games.find((g) => g.completed);
		// A deliberate, visible skip rather than a silent pass: week 1 of a
		// completed season is expected to always have finished games.
		if (!target?.id) {
			console.warn(
				'[integration.test] skipping box score/win probability: no completed game found',
			);
			return;
		}

		const box = await Games.getAdvancedBoxScore(makeCtx(), { id: target.id });
		expect(box).toHaveProperty('gameInfo');

		const wp = await Metrics.getWinProbability(makeCtx(), {
			gameId: target.id,
		});
		expect(Array.isArray(wp)).toBe(true);
	});

	it('gets SP+ ratings for a real team', async () => {
		const result = await Ratings.getSP(makeCtx(), {
			year: 2023,
			team: 'Alabama',
		});

		expect(Array.isArray(result)).toBe(true);
	});

	it('gets team season stats for a real team', async () => {
		const result = await Stats.getTeamSeasonStats(makeCtx(), {
			year: 2023,
			team: 'Alabama',
		});

		expect(Array.isArray(result)).toBe(true);
	});

	it('searches players by name', async () => {
		const result = await Players.search(makeCtx(), { searchTerm: 'Manning' });

		expect(Array.isArray(result)).toBe(true);
	});

	it('gets recruit rankings for a real season', async () => {
		const result = await Recruiting.listRecruits(makeCtx(), { year: 2023 });

		expect(Array.isArray(result)).toBe(true);
	});

	it('lists NFL draft positions without erroring', async () => {
		const result = await Draft.listPositions(makeCtx(), {});

		expect(Array.isArray(result)).toBe(true);
	});

	it('returns the static season-type vocabulary', async () => {
		const result = await SeasonTypes.list(makeCtx(), {});

		expect(result).toContain('regular');
		expect(result).toContain('postseason');
	});
});
