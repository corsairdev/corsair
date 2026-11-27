import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { polymarketEndpointMeta } from './endpoints/catalog';
import { polymarketOperations } from './endpoints/manifest';
import { polymarket } from './index';

/**
 * Live run of every public read against Polymarket's production APIs (no
 * key, no wallet, nothing written):
 *
 *   POLYMARKET_LIVE=1 POLYMARKET_LIVE_REPORT=/tmp/report.json npx jest api.test.ts
 *
 * It first reads a liquid open market, its event, a trader, a tag, a series,
 * a sport, a team and a Perps instrument, then calls each public read with
 * those ids. Operations that need a credential or a wallet signature
 * (orders, API keys, Perps account and trading, RFQ, Relayer submissions,
 * Bridge deposit and withdraw addresses) are not run; endpoints.test.ts
 * covers them against a mocked fetch. Skipped unless POLYMARKET_LIVE is set
 * (CI never runs files named api.test.ts).
 */
const live = Boolean(process.env.POLYMARKET_LIVE);
if (!live) console.warn('Skipping Polymarket live run: set POLYMARKET_LIVE=1.');
const describeIf = live ? describe : describe.skip;

type Result = { ok: boolean; expected?: string; error?: string };
// `any` because the live run walks responses of many operations by field name.
type Json = any;

const risk = (id: string) =>
	polymarketEndpointMeta[id as keyof typeof polymarketEndpointMeta].riskLevel;

describeIf('polymarket live', () => {
	jest.setTimeout(900_000);
	const results: Record<string, Result> = {};

	afterAll(() => {
		const ran = Object.keys(results);
		const report = {
			operations: polymarketOperations.length,
			ran: ran.length,
			ok: Object.values(results).filter((v) => v.ok && !v.expected).length,
			expected: Object.values(results).filter((v) => v.expected).length,
			failed: Object.values(results).filter((v) => !v.ok).length,
			notRun: polymarketOperations
				.map((o) => o.id)
				.filter((id) => !ran.includes(id)),
			results,
		};
		if (process.env.POLYMARKET_LIVE_REPORT) {
			writeFileSync(
				process.env.POLYMARKET_LIVE_REPORT,
				JSON.stringify(report, null, 2),
			);
		}
		console.log(
			`Polymarket live: ${report.ran} ran, ${report.ok} ok, ${report.expected} expected errors, ${report.failed} failed`,
		);
	});

	it('runs every public read', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'polymarket', 'default');
		const corsair = createCorsair({
			plugins: [polymarket()],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		const api = corsair.polymarket.api as Json;
		// Gamma types some ids as integers and others as strings: send each
		// scalar as the operation's schema declares it.
		const typed = (id: string, input: object): object => {
			const operation = polymarketOperations.find((o) => o.id === id);
			// `unknown` because input schemas are provider JSON Schema.
			const props = (operation?.input.properties ?? {}) as Record<
				string,
				{ type?: unknown }
			>;
			return Object.fromEntries(
				Object.entries(input).map(([name, value]) => {
					const type = props[name]?.type;
					const types = Array.isArray(type) ? type : [type];
					if (typeof value === 'number' && types.includes('string'))
						return [name, String(value)];
					if (
						typeof value === 'string' &&
						/^\d+$/.test(value) &&
						!types.includes('string') &&
						(types.includes('integer') || types.includes('number'))
					)
						return [name, Number(value)];
					return [name, value];
				}),
			);
		};
		const r = async (id: string, input: object = {}, expected?: RegExp) => {
			input = typed(id, input);
			let node = api;
			for (const part of id.split('.')) node = node?.[part];
			try {
				const out = await node(input);
				results[id] = { ok: true };
				return out;
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				results[id] = expected?.test(message)
					? { ok: true, expected: message.slice(0, 160) }
					: { ok: false, error: message.slice(0, 300) };
				return undefined;
			}
		};

		// Ids to read with.
		const markets: Json[] =
			(await r('gamma.markets.list', {
				closed: 'false',
				limit: 5,
				order: 'volume24hr',
				ascending: false,
			})) ?? [];
		const market = markets.find((m) => m.clobTokenIds) ?? markets[0] ?? {};
		const tokens: string[] = JSON.parse(market.clobTokenIds ?? '[]');
		const token = tokens[0] ?? '0';
		const condition: string = market.conditionId ?? '0x';
		const event: Json = market.events?.[0] ?? {};
		const eventId = Number(event.id ?? 1);
		const eventSlug = String(event.slug ?? 'missing');
		const trades: Json[] = (await r('data.trades', { limit: 5 })) ?? [];
		const user: string =
			trades[0]?.proxyWallet ?? '0x56687bf447db6ffa42ffe2204a05edaa20f55839';
		const tags: Json[] = (await r('gamma.tags.list', { limit: 5 })) ?? [];
		const tag = tags[0] ?? {};
		const series: Json[] = (await r('gamma.series.list', { limit: '1' })) ?? [];
		const sports: Json[] = (await r('gamma.sports.list')) ?? [];
		const sport = sports[0] ?? {};
		const teams: Json[] = (await r('gamma.teams.list', { limit: 1 })) ?? [];
		const tournaments: Json[] =
			(await r('gamma.tournaments.list', { limit: 1 })) ?? [];
		const partners: Json[] = (await r('gamma.partners.list')) ?? [];
		const facets: Json = await r('gamma.facets.list');
		const feeTypes: Json = await r('gamma.feeTypes.list');
		const creators: Json = await r('gamma.events.creators.list');
		const comments: Json =
			(await r('gamma.comments.list', {
				parent_entity_type: 'Event',
				parent_entity_id: eventId,
				limit: 5,
			})) ?? [];
		const instruments: Json = await r('perps.instruments');
		const instrumentList: Json[] = Array.isArray(instruments)
			? instruments
			: (instruments?.instruments ?? instruments?.data ?? []);
		const instrument = instrumentList[0] ?? {};
		const instrumentId =
			instrument.instrument_id ?? instrument.id ?? instrument.symbol ?? 1;
		const competitions: Json = await r('perps.competitions.list');
		const competitionList: Json[] = Array.isArray(competitions)
			? competitions
			: (competitions?.competitions ?? competitions?.data ?? []);
		const competitionId =
			competitionList[0]?.competition_id ?? competitionList[0]?.id ?? 1;
		const teamPartners: Json[] =
			(await r('gamma.teams.externalPartners.list', {
				id: teams[0]?.id ?? 1,
			})) ?? [];
		const teamPartner = teamPartners[0] ?? {};
		const board: Json = await r('perps.leaderboard', { limit: 1 });
		const trader = board?.entries?.[0] ?? {};
		const now = Math.floor(Date.now() / 1000);
		const firstOf = (value: Json): Json =>
			Array.isArray(value) ? value[0] : (value?.data?.[0] ?? value?.[0]);

		const inputs: Record<string, object> = {
			'gamma.comments.get': { id: Number(firstOf(comments)?.id ?? 1) },
			'gamma.comments.listKeyset': {
				parent_entity_type: 'Event',
				parent_entity_id: eventId,
				limit: 5,
			},
			'gamma.comments.listByUser': {
				user_address: firstOf(comments)?.userAddress ?? user,
				limit: 5,
			},
			'gamma.events.list': { limit: 2, closed: 'false' },
			'gamma.events.listKeyset': { limit: 2 },
			'gamma.events.listPaginated': { limit: 2 },
			'gamma.events.get': { id: eventId },
			'gamma.events.getBySlug': { slug: eventSlug },
			'gamma.events.commentCount': { id: eventId },
			'gamma.events.externalPartners.list': { id: eventId },
			'gamma.events.insights': { id: eventId },
			'gamma.events.tags': { id: eventId },
			'gamma.events.tweetCount': { id: eventId },
			'gamma.events.premadeCombos': { slug: eventSlug },
			'gamma.events.reference': { slug: eventSlug },
			'gamma.events.similar': { id: eventId, limit: 3 },
			'gamma.events.creators.get': {
				id: Number(firstOf(creators)?.id ?? 1),
			},
			'gamma.events.sportResults': {},
			'gamma.facets.get': { slug: firstOf(facets)?.slug ?? 'politics' },
			'gamma.feeTypes.events': {
				feeType: String(
					firstOf(feeTypes)?.name ?? firstOf(feeTypes)?.id ?? 'standard',
				),
			},
			'gamma.markets.get': { id: Number(market.id) },
			'gamma.markets.getBySlug': { slug: market.slug },
			'gamma.markets.description': { id: Number(market.id) },
			'gamma.markets.related': { id: Number(market.id) },
			'gamma.markets.tags': { id: Number(market.id) },
			'gamma.markets.listKeyset': { limit: 2 },
			'gamma.markets.listAbridged': { limit: 2 },
			'gamma.markets.listAbridgedKeyset': { limit: 2 },
			'gamma.markets.information': { limit: 2 },
			'gamma.marketEstimateHistory.list': {
				event_id: String(eventId),
				interval: '1d',
			},
			'gamma.partners.get': { id: Number(firstOf(partners)?.id ?? 1) },
			'gamma.profiles.get': { address: user },
			'gamma.profiles.list': { address: [user] },
			'gamma.profiles.getByAddress': { user_address: user },
			'gamma.search': { q: 'bitcoin', limit_per_type: '2' },
			'gamma.searchV2': { q: 'bitcoin', limit_per_type: '2' },
			'gamma.series.get': { id: Number(series[0]?.id ?? 1) },
			'gamma.series.listKeyset': { limit: '1' },
			'gamma.series.summary': { id: Number(series[0]?.id ?? 1) },
			'gamma.series.summaryBySlug': { slug: series[0]?.slug ?? 'missing' },
			'gamma.series.commentCount': { id: Number(series[0]?.id ?? 1) },
			'gamma.sports.get': { id: Number(sport.id ?? 1) },
			'gamma.sports.externalPartners.list': { id: Number(sport.id ?? 1) },
			'gamma.sports.premadeCombos': { slug: String(sport.sport ?? 'nba') },
			'gamma.tags.get': { id: Number(tag.id ?? 1) },
			'gamma.tags.getBySlug': { slug: tag.slug ?? 'politics' },
			'gamma.tags.related': { id: Number(tag.id ?? 1) },
			'gamma.tags.relations': { id: Number(tag.id ?? 1) },
			'gamma.tags.relatedBySlug': { slug: tag.slug ?? 'politics' },
			'gamma.tags.relationsBySlug': { slug: tag.slug ?? 'politics' },
			'gamma.teams.get': { id: Number(teams[0]?.id ?? 1) },
			'gamma.tournaments.get': { id: Number(tournaments[0]?.id ?? 1) },
			'gamma.makerTiers.get': { addresses: [user] },
			'gamma.takerTiers.get': { addresses: [user] },
			'gamma.walletType': { address: user, signer: user },
			'data.activity.list': { user, limit: 5 },
			'data.activity.combos': { user, limit: 5 },
			'data.approvals': { user },
			'data.holders': { condition, limit: 5 },
			'data.leaderboard': { limit: 5 },
			'data.liveVolume': { event_id: String(eventId) },
			'data.openInterest': { condition },
			'data.positions.list': { user, limit: 5 },
			'data.positions.combos': { user, limit: 5 },
			'data.positions.snapshot': {
				user,
				date: new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10),
				limit: 5,
			},
			'data.pricesHistory': { token_id: token, interval: '1d', limit: 5 },
			'data.resolutions': { condition },
			'data.tokens': { token_id: token },
			'data.users.pnl': { user },
			'data.users.stats': { user },
			'data.users.volume': { user },
			'data.value': { user },
			'clob.books.get': { token_id: token },
			'clob.books.list': { token_ids: token },
			'clob.books.listByBody': { body: [{ token_id: token }] },
			'clob.feeRate.get': { token_id: token },
			'clob.feeRate.getByToken': { token_id: token },
			'clob.lastTradePrices.get': { token_id: token },
			'clob.lastTradePrices.list': { token_ids: token },
			'clob.lastTradePrices.listByBody': { body: [{ token_id: token }] },
			'clob.markets.get': { condition_id: condition },
			'clob.markets.getByToken': { token_id: token },
			'clob.markets.liveActivity': { body: [condition] },
			'clob.markets.liveActivityByCondition': { condition_id: condition },
			'clob.midpoints.get': { token_id: token },
			'clob.midpoints.list': { token_ids: token },
			'clob.midpoints.listByBody': { body: [{ token_id: token }] },
			'clob.negRisk.get': { token_id: token },
			'clob.negRisk.getByToken': { token_id: token },
			'clob.prices.get': { token_id: token, side: 'BUY' },
			'clob.prices.list': { token_ids: token, sides: 'BUY' },
			'clob.prices.listByBody': { body: [{ token_id: token, side: 'BUY' }] },
			'clob.pricesHistory.get': { market: token, interval: '1d' },
			'clob.pricesHistory.batch': { markets: [token], interval: '1d' },
			'clob.rewards.market': { condition_id: condition },
			'clob.spreads.get': { token_id: token },
			'clob.spreads.list': { body: [{ token_id: token }] },
			'clob.tickSize.get': { token_id: token },
			'clob.tickSize.getByToken': { token_id: token },
			'clob.rebates.current': {
				date: new Date().toISOString().slice(0, 10),
				maker_address: user,
			},
			'bridge.status': { address: user },
			'bridge.quote': {
				fromAmountBaseUnit: '10000000',
				fromChainId: '137',
				fromTokenAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
				recipientAddress: user,
				toChainId: '137',
				toTokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
			},
			'relayer.deployed': { address: user },
			'relayer.nonce': { address: user, type: 'SAFE' },
			'relayer.relayPayload': { address: user, type: 'SAFE' },
			'perps.bbo': { instrument_id: instrumentId },
			'perps.book': { instrument_id: instrumentId },
			'perps.tickers': { instrument_id: instrumentId },
			'perps.statistics': { instrument_id: instrumentId },
			'perps.trades': { instrument_id: instrumentId },
			'perps.fundingHistory': { instrument_id: instrumentId },
			'perps.klines': {
				instrument_id: instrumentId,
				interval: '1h',
				start_timestamp: (now - 86_400) * 1000,
			},
			'perps.markHistory': {
				instrument_id: instrumentId,
				interval: '1h',
				start_timestamp: (now - 86_400) * 1000,
			},
			'perps.exchangeStatistics': {
				start_timestamp: (now - 86_400) * 1000,
				end_timestamp: now * 1000,
			},
			'perps.index': {
				asset: instrument.base_asset ?? instrument.asset ?? 'BTC',
			},
			'gamma.teams.externalPartners.get': {
				id: teams[0]?.id ?? 1,
				partnerRef: teamPartner.partner?.slug ?? 'ufc',
			},
			'gamma.teams.getByPartner': {
				partner: teamPartner.partner?.slug ?? 'ufc',
				external_id: teamPartner.externalId ?? '1',
			},
			'gamma.games.get': { sport: 'nba' },
			'perps.public.portfolio': { address: trader.account ?? user },
			'perps.public.fills': { address: trader.account ?? user },
			'perps.public.positionFills': {
				address: trader.account ?? user,
				instrument_id: trader.top_instrument_ids?.[0] ?? instrumentId,
			},
			'perps.registered': { address: trader.account ?? user },
			'perps.builder': { address: trader.account ?? user },
			'perps.competitions.list': { address: trader.account ?? user },
			'perps.competitions.account': {
				competition_id: competitionId,
				address: trader.account ?? user,
			},
			'perps.competitions.get': { competition_id: competitionId },
			'perps.competitions.leaderboard': { competition_id: competitionId },
		};
		// Lookups that may well find nothing for the ids at hand: a 4xx naming
		// the missing thing counts as Polymarket answering as documented.
		const mayBeMissing: Record<string, RegExp> = {
			'gamma.events.externalPartners.get': /4\d\d/,
			'gamma.sports.externalPartners.get': /4\d\d/,
			'gamma.teams.externalPartners.get': /4\d\d/,
			'gamma.events.getByPartner': /4\d\d/,
			'gamma.sports.getByPartner': /4\d\d/,
			'gamma.teams.getByPartner': /4\d\d/,
			'gamma.games.get': /4\d\d/,
			'gamma.events.premadeCombos': /4\d\d/,
			'gamma.sports.premadeCombos': /4\d\d/,
			'gamma.events.reference': /4\d\d/,
			'clob.trades.listBuilder': /4\d\d/,
			'clob.rebates.current': /4\d\d/,
			'clob.rewards.market': /4\d\d/,
			'perps.inviteCode': /4\d\d/,
			'perps.builder': /4\d\d/,
			'perps.registered': /4\d\d/,
			'perps.public.portfolio': /4\d\d/,
			'perps.public.fills': /4\d\d/,
			'perps.public.positionFills': /4\d\d/,
			'perps.competitions.account': /4\d\d/,
			'perps.competitions.get': /4\d\d/,
			'perps.competitions.leaderboard': /4\d\d/,
			'relayer.transactions.get': /4\d\d/,
			'gamma.comments.get': /4\d\d/,
			// Polymarket routes /events/count to /events/{id} ("id is invalid").
			'gamma.events.count': /422/,
			// The readiness probe is closed to the public.
			'gamma.readyz': /403/,
			// An address with no bridge history.
			'bridge.status': /Polymarket (4\d\d|500)/,
			'gamma.series.summaryBySlug': /404/,
			// The CLOB's GET list variants answer "Invalid payload" even for live
			// tokens; the POST variants (listByBody) work.
			'clob.books.list': /400: Invalid payload/,
			'clob.midpoints.list': /400: Invalid payload/,
			'clob.lastTradePrices.list': /400: Invalid payload/,
			'clob.prices.list': /400: Invalid payload/,
		};

		// `unknown` because example args are free-form YAML values.
		const docs = require('./plugin-docs.yaml') as {
			apiExamples: Record<string, { args: Record<string, unknown> }>;
		};
		for (const operation of polymarketOperations) {
			const { id } = operation;
			if (operation.auth !== 'none' || risk(id) !== 'read') continue;
			if (results[id]) continue;
			await r(
				id,
				inputs[id] ?? docs.apiExamples[id]?.args ?? {},
				mayBeMissing[id],
			);
		}
		await testDb.cleanup?.();
	});

	it('records every result', () => {
		const failed = Object.entries(results).filter(([, v]) => !v.ok);
		expect(failed.map(([id, v]) => `${id}: ${v.error}`)).toEqual([]);
	});
});
