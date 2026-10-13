import { logEventFromContext } from 'corsair/core';
import { makeBenzingaRequest } from './client';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
	getConsensusRatings,
	getEarningsStream,
	getNews,
	getNewsStream,
	listConferenceCalls,
	listDividends,
	listEarnings,
	listEconomics,
	listGuidance,
	listIpos,
	listNewsChannels,
	listRatings,
	listRemovedCalendarEvents,
	listRemovedNews,
	listSplits,
} from './endpoints';
import type { BenzingaContext } from './index';

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeBenzingaRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeBenzingaRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

const entityTables = [
	'newsArticles',
	'newsChannels',
	'earnings',
	'dividends',
	'ratings',
	'guidance',
	'ipos',
	'splits',
	'economics',
	'conferenceCalls',
	'consensusRatings',
	'removedCalendarEvents',
	'removedNewsItems',
] as const;

type EntityTable = (typeof entityTables)[number];
const upserts = {
	newsArticles: jest.fn().mockResolvedValue(undefined),
	newsChannels: jest.fn().mockResolvedValue(undefined),
	earnings: jest.fn().mockResolvedValue(undefined),
	dividends: jest.fn().mockResolvedValue(undefined),
	ratings: jest.fn().mockResolvedValue(undefined),
	guidance: jest.fn().mockResolvedValue(undefined),
	ipos: jest.fn().mockResolvedValue(undefined),
	splits: jest.fn().mockResolvedValue(undefined),
	economics: jest.fn().mockResolvedValue(undefined),
	conferenceCalls: jest.fn().mockResolvedValue(undefined),
	consensusRatings: jest.fn().mockResolvedValue(undefined),
	removedCalendarEvents: jest.fn().mockResolvedValue(undefined),
	removedNewsItems: jest.fn().mockResolvedValue(undefined),
} satisfies Record<EntityTable, jest.Mock>;
const table = (fn: jest.Mock) => ({
	upsertByEntityId: (id: string, data: object) => fn(id, data),
});
const db = {
	newsArticles: table(upserts.newsArticles),
	newsChannels: table(upserts.newsChannels),
	earnings: table(upserts.earnings),
	dividends: table(upserts.dividends),
	ratings: table(upserts.ratings),
	guidance: table(upserts.guidance),
	ipos: table(upserts.ipos),
	splits: table(upserts.splits),
	economics: table(upserts.economics),
	conferenceCalls: table(upserts.conferenceCalls),
	consensusRatings: table(upserts.consensusRatings),
	removedCalendarEvents: table(upserts.removedCalendarEvents),
	removedNewsItems: table(upserts.removedNewsItems),
};

// Safe: handlers under test only read ctx.key and ctx.db tables, and request execution and event logging are both mocked above.
// A narrower type is not practical because BenzingaContext also requires keys and hook wiring that only a live corsair instance builds.
const testCtx = () => ({ key: 'test-key', db }) as BenzingaContext;

describe('Benzinga endpoint schemas', () => {
	it('accepts a fully populated news query', () => {
		const parsed = BenzingaEndpointInputSchemas.getNews.parse({
			page: 0,
			pageSize: 15,
			displayOutput: 'headline',
			date: '2024-01-09',
			dateFrom: '2024-01-01',
			dateTo: '2024-01-31',
			updatedSince: 1704819600,
			publishedSince: 1704819600,
			sort: 'created:desc',
			tickers: 'AAPL,MSFT',
			channels: 'Technology',
			topics: 'earnings',
			topic_group_by: 'or',
			authors: 'Benzinga Newsdesk',
			content_types: 'news',
			format: 'text',
			importance: 'high',
			importanceRank: 3,
			region: 'us',
		});
		expect(parsed.page).toBe(0);
		expect(parsed.pageSize).toBe(15);
		expect(parsed.sort).toBe('created:desc');
		expect(parsed.tickers).toBe('AAPL,MSFT');
		expect(parsed.importanceRank).toBe(3);
	});

	it('rejects invalid news query values', () => {
		expect(() =>
			BenzingaEndpointInputSchemas.getNews.parse({ pageSize: 101 }),
		).toThrow();
		expect(() =>
			BenzingaEndpointInputSchemas.getNews.parse({ date: 'not-a-date' }),
		).toThrow();
		expect(() =>
			BenzingaEndpointInputSchemas.getNews.parse({ sort: 'nope' }),
		).toThrow();
		expect(() =>
			BenzingaEndpointInputSchemas.getNews.parse({ importanceRank: 9 }),
		).toThrow();
		expect(
			BenzingaEndpointInputSchemas.getNews.parse({}).pageSize,
		).toBeUndefined();
	});

	it('rejects impossible calendar dates while allowing leap days', () => {
		expect(() =>
			BenzingaEndpointInputSchemas.getNews.parse({ date: '2026-02-30' }),
		).toThrow();
		expect(() =>
			BenzingaEndpointInputSchemas.listEarnings.parse({ date: '2024-13-01' }),
		).toThrow();
		expect(() =>
			BenzingaEndpointInputSchemas.listEarnings.parse({ date: '2023-02-29' }),
		).toThrow();
		const leapDay = BenzingaEndpointInputSchemas.listEarnings.parse({
			date: '2024-02-29',
		});
		expect(leapDay.date).toBe('2024-02-29');
		const monthEnd = BenzingaEndpointInputSchemas.getNews.parse({
			date: '2024-01-31',
		});
		expect(monthEnd.date).toBe('2024-01-31');
	});

	it('validates calendar pagination and shared filters', () => {
		const parsed = BenzingaEndpointInputSchemas.listEarnings.parse({
			page: 2,
			pagesize: 100,
			date: '2024-01-09',
			tickers: 'AAPL',
			importance: 3,
			updated: 1704819600,
			dateSort: 'date',
		});
		expect(parsed.page).toBe(2);
		expect(parsed.pagesize).toBe(100);
		expect(parsed.importance).toBe(3);
		expect(parsed.dateSort).toBe('date');
		expect(() =>
			BenzingaEndpointInputSchemas.listEarnings.parse({ pagesize: 1001 }),
		).toThrow();
		expect(() =>
			BenzingaEndpointInputSchemas.listEarnings.parse({ importance: 9 }),
		).toThrow();
	});

	it('validates ratings, guidance, dividends and splits filters', () => {
		const ratings = BenzingaEndpointInputSchemas.listRatings.parse({
			action: 'Upgrades',
			simplify: true,
		});
		expect(ratings.action).toBe('Upgrades');
		expect(ratings.simplify).toBe(true);
		expect(() =>
			BenzingaEndpointInputSchemas.listRatings.parse({ action: 'Bogus' }),
		).toThrow();

		const guidance = BenzingaEndpointInputSchemas.listGuidance.parse({
			is_primary: 'Y',
		});
		expect(guidance.is_primary).toBe('Y');

		const dividends = BenzingaEndpointInputSchemas.listDividends.parse({
			dateSort: 'ex',
			dividend_yield: 0.5,
			dividend_yield_operation: 'gte',
		});
		expect(dividends.dateSort).toBe('ex');
		expect(dividends.dividend_yield_operation).toBe('gte');

		const splits = BenzingaEndpointInputSchemas.listSplits.parse({
			date_search_field: 'ex',
		});
		expect(splits.date_search_field).toBe('ex');
	});

	it('validates ipos and economics inputs', () => {
		const ipos = BenzingaEndpointInputSchemas.listIpos.parse({
			ipo_date: '2024-01-09',
			date_from: '2024-01-01',
			date_to: '2024-01-31',
		});
		expect(ipos.ipo_date).toBe('2024-01-09');
		expect(() =>
			BenzingaEndpointInputSchemas.listIpos.parse({ ipo_date: 'bad' }),
		).toThrow();

		const economics = BenzingaEndpointInputSchemas.listEconomics.parse({
			importance: 3,
			country: 'USA',
			event_name: 'CPI',
			event_category: 'Employment',
		});
		expect(economics.importance).toBe(3);
		expect(economics.country).toBe('USA');
		expect(economics.event_name).toBe('CPI');
		expect(() =>
			BenzingaEndpointInputSchemas.listEconomics.parse({ importance: 0 }),
		).toThrow();
		expect(() =>
			BenzingaEndpointInputSchemas.listEconomics.parse({ importance: 4 }),
		).toThrow();
	});

	it('parses representative news, earnings and ratings payloads', () => {
		const news = BenzingaEndpointOutputSchemas.getNews.parse([
			{
				id: 123456,
				author: 'Benzinga Newsdesk',
				created: 'Wed, 17 May 2017 14:20:15 -0400',
				updated: 'Wed, 17 May 2017 14:20:15 -0400',
				title: 'Apple Announces New iPhone',
				teaser: 'teaser',
				body: 'body',
				url: 'https://www.benzinga.com/news/123456',
				channels: [{ name: 'Technology' }],
				stocks: [{ name: 'AAPL', exchange: 'NASDAQ' }],
				tags: [{ name: 'tech' }],
			},
		]);
		expect(news).toHaveLength(1);
		expect(news[0]?.stocks?.[0]?.name).toBe('AAPL');

		const earnings = BenzingaEndpointOutputSchemas.listEarnings.parse({
			earnings: [
				{
					id: '69030cfb619d3a00015b72a3',
					date: '2026-10-29',
					ticker: 'AAPL',
					name: 'Apple',
					eps_est: '1.990',
				},
			],
		});
		expect(earnings.earnings).toHaveLength(1);
		expect(earnings.earnings[0]?.eps_est).toBe('1.990');

		const ratings = BenzingaEndpointOutputSchemas.listRatings.parse({
			ratings: [
				{
					id: '695c16678f047b0001fee512',
					date: '2026-01-05',
					ticker: 'MNDY',
					name: 'Monday.Com',
					rating_current: 'Buy',
					action_company: 'Maintains',
				},
			],
		});
		expect(ratings.ratings).toHaveLength(1);
		expect(ratings.ratings[0]?.rating_current).toBe('Buy');
	});
});

describe('new endpoint schemas', () => {
	it('requires a ticker for consensus ratings and restricts aggregateType', () => {
		expect(() =>
			BenzingaEndpointInputSchemas.getConsensusRatings.parse({}),
		).toThrow();
		expect(() =>
			BenzingaEndpointInputSchemas.getConsensusRatings.parse({
				ticker: 'AAPL',
				aggregateType: 'mean',
			}),
		).toThrow();
		expect(
			BenzingaEndpointInputSchemas.getConsensusRatings.parse({
				ticker: 'AAPL',
				aggregateType: 'percentage',
			}),
		).toEqual({ ticker: 'AAPL', aggregateType: 'percentage' });
	});

	it('restricts removed calendar event types to the documented enum', () => {
		expect(
			BenzingaEndpointInputSchemas.listRemovedCalendarEvents.parse({
				type: 'conference calls',
			}),
		).toEqual({ type: 'conference calls' });
		expect(() =>
			BenzingaEndpointInputSchemas.listRemovedCalendarEvents.parse({
				type: 'news',
			}),
		).toThrow();
	});

	it('parses removed news keyed by an arbitrary top-level key', () => {
		expect(
			BenzingaEndpointOutputSchemas.listRemovedNews.parse({
				data: [{ id: 123456, updated: 'Wed, 17 May 2017 14:20:15 -0400' }],
			}),
		).toEqual({
			data: [{ id: 123456, updated: 'Wed, 17 May 2017 14:20:15 -0400' }],
		});
	});
});

beforeEach(() => {
	jest.clearAllMocks();
});

function expectRequest(
	path: string,
	query?: Record<string, string | number | boolean>,
) {
	expect(mockRequest).toHaveBeenCalledTimes(1);
	if (query === undefined) {
		expect(mockRequest).toHaveBeenCalledWith(path, 'test-key');
	} else {
		expect(mockRequest).toHaveBeenCalledWith(path, 'test-key', query);
	}
}

describe('news endpoints', () => {
	it('news.get maps every filter onto the query string', async () => {
		const ctx = testCtx();
		const article = {
			id: 123456,
			author: 'Benzinga Newsdesk',
			created: 'Wed, 17 May 2017 14:20:15 -0400',
			updated: 'Wed, 17 May 2017 14:20:15 -0400',
			title: 'Apple Announces New iPhone',
			teaser: 'teaser',
			body: 'body',
			url: 'https://www.benzinga.com/news/123456',
		};
		mockRequest.mockResolvedValue([article]);

		const result = await getNews(ctx, {
			pageSize: 5,
			tickers: 'AAPL',
			displayOutput: 'headline',
			sort: 'created:desc',
		});

		expectRequest('/api/v2/news', {
			pageSize: 5,
			tickers: 'AAPL',
			displayOutput: 'headline',
			sort: 'created:desc',
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.news.get',
			{
				pageSize: 5,
				tickers: 'AAPL',
				displayOutput: 'headline',
				sort: 'created:desc',
			},
			'completed',
		);
		expect(result).toEqual([article]);
	});

	it('news.listChannels calls the channels endpoint without a query', async () => {
		const ctx = testCtx();
		const payload = {
			ok: true,
			data: [{ id: 1, parent: 0, channel: 'Technology', weight: 0 }],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listNewsChannels(ctx, {});

		expectRequest('/api/v2.1/news/channels');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.news.listChannels',
			{},
			'completed',
		);
		expect(result).toEqual(payload);
	});

	it('news.listRemoved pages removed article ids', async () => {
		const ctx = testCtx();
		const payload = {
			data: [{ id: 123456, updated: 'Wed, 17 May 2017 14:20:15 -0400' }],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listRemovedNews(ctx, {
			page: 1,
			pageSize: 50,
			updatedSince: 1704819600,
		});

		expectRequest('/api/v2/news-removed', {
			page: 1,
			pageSize: 50,
			updatedSince: 1704819600,
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.news.listRemoved',
			{ page: 1, pageSize: 50, updatedSince: 1704819600 },
			'completed',
		);
		expect(result).toEqual({
			data: [{ id: 123456, updated: 'Wed, 17 May 2017 14:20:15 -0400' }],
		});
	});

	it('news.getStream returns the WebSocket URL without the API key', async () => {
		const ctx = testCtx();

		const result = await getNewsStream(ctx, {
			tickers: 'AAPL,MSFT',
			channels: 'Earnings',
		});

		expect(mockRequest).not.toHaveBeenCalled();
		expect(result).toEqual({
			url: 'wss://api.benzinga.com/api/v1/news/stream?tickers=AAPL%2CMSFT&channels=Earnings',
			authQueryParam: 'token',
			commands: ['ping', 'replay'],
		});
		expect(result.url).not.toContain('test-key');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.news.getStream',
			{ tickers: 'AAPL,MSFT', channels: 'Earnings' },
			'completed',
		);
	});
});

describe('calendar endpoints', () => {
	it('calendar.listEarnings maps filters to parameters[] keys', async () => {
		const ctx = testCtx();
		const payload = {
			earnings: [
				{
					id: '69030cfb619d3a00015b72a3',
					date: '2026-10-29',
					ticker: 'AAPL',
					name: 'Apple',
				},
			],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listEarnings(ctx, {
			page: 1,
			pagesize: 50,
			date: '2024-01-09',
			tickers: 'AAPL',
			importance: 3,
			dateSort: 'date',
		});

		expectRequest('/api/v2.1/calendar/earnings', {
			page: 1,
			pagesize: 50,
			'parameters[date]': '2024-01-09',
			'parameters[tickers]': 'AAPL',
			'parameters[importance]': 3,
			'parameters[date_sort]': 'date',
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.calendar.listEarnings',
			{
				page: 1,
				pagesize: 50,
				date: '2024-01-09',
				tickers: 'AAPL',
				importance: 3,
				dateSort: 'date',
			},
			'completed',
		);
		expect(result).toEqual(payload);
	});

	it('calendar.listDividends maps yield filters', async () => {
		const ctx = testCtx();
		const payload = {
			dividends: [
				{
					id: '6958d4d893cde40001ee2606',
					date: '2026-12-31',
					ticker: 'XIMR',
					name: 'First Trust ETF',
				},
			],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listDividends(ctx, {
			dateSort: 'ex',
			dividend_yield: 0.5,
			dividend_yield_operation: 'gte',
			tickers: 'XIMR',
		});

		expectRequest('/api/v2.2/calendar/dividends', {
			'parameters[date_sort]': 'ex',
			'parameters[dividend_yield]': 0.5,
			'parameters[dividend_yield_operation]': 'gte',
			'parameters[tickers]': 'XIMR',
		});
		expect(result).toEqual(payload);
	});

	it('calendar.listRatings maps fields, action and analyst filters', async () => {
		const ctx = testCtx();
		const payload = {
			ratings: [
				{
					id: '695c16678f047b0001fee512',
					date: '2026-01-05',
					ticker: 'MNDY',
					name: 'Monday.Com',
				},
			],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listRatings(ctx, {
			fields: 'id,date,ticker',
			action: 'Upgrades',
			analyst: 'analyst-1',
			firm: 'firm-1',
			simplify: true,
		});

		expectRequest('/api/v2.1/calendar/ratings', {
			fields: 'id,date,ticker',
			'parameters[action]': 'Upgrades',
			analyst: 'analyst-1',
			firm: 'firm-1',
			simplify: true,
		});
		expect(result).toEqual(payload);
	});

	it('calendar.listGuidance maps is_primary', async () => {
		const ctx = testCtx();
		const payload = {
			guidance: [
				{
					id: '695bcc0c83cac20001becbd4',
					date: '2026-01-05',
					ticker: 'RCT',
					name: 'RedCloud Holdings',
				},
			],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listGuidance(ctx, { is_primary: 'Y', tickers: 'RCT' });

		expectRequest('/api/v2.1/calendar/guidance', {
			'parameters[is_primary]': 'Y',
			'parameters[tickers]': 'RCT',
		});
		expect(result).toEqual(payload);
	});

	it('calendar.listIpos maps ipo_date and normalizes a bare array', async () => {
		const ctx = testCtx();
		const ipo = {
			id: '604b6d8a36622a000186b793',
			date: '2024-01-09',
			ticker: 'ABNB',
			name: 'Airbnb Inc.',
		};
		mockRequest.mockResolvedValue([ipo]);

		const result = await listIpos(ctx, {
			ipo_date: '2024-01-09',
			tickers: 'ABNB',
		});

		expectRequest('/api/v2.1/calendar/ipos', {
			ipo_date: '2024-01-09',
			'parameters[tickers]': 'ABNB',
		});
		expect(result).toEqual({ ipos: [ipo] });
	});

	it('calendar.listIpos passes a documented { ipos } response through', async () => {
		const ipo = {
			id: '604b6d8a36622a000186b793',
			date: '2024-01-09',
			ticker: 'ABNB',
			name: 'Airbnb Inc.',
		};
		mockRequest.mockResolvedValue({ ipos: [ipo] });

		expect(await listIpos(testCtx(), {})).toEqual({ ipos: [ipo] });
	});

	it('calendar.listSplits maps date_search_field', async () => {
		const ctx = testCtx();
		const payload = {
			splits: [
				{
					id: '677675329a903000017cb6f1',
					ticker: 'TCBP',
					name: 'TC BioPharm (Holdings)',
				},
			],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listSplits(ctx, {
			date_search_field: 'ex',
			tickers: 'TCBP',
		});

		expectRequest('/api/v2.1/calendar/splits', {
			'parameters[date_search_field]': 'ex',
			'parameters[tickers]': 'TCBP',
		});
		expect(result).toEqual(payload);
	});

	it('calendar.listEconomics maps country and event filters', async () => {
		const ctx = testCtx();
		const payload = {
			economics: [
				{
					id: '6745790147f2830001365a27',
					date: '2026-03-08',
					event_name: 'Challenger Job Cuts (YoY)',
					event_category: 'Employment',
				},
			],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listEconomics(ctx, {
			country: 'USA',
			event_name: 'CPI',
			event_category: 'Employment',
		});

		expectRequest('/api/v2.1/calendar/economics', {
			country: 'USA',
			event_name: 'CPI',
			event_category: 'Employment',
		});
		expect(result).toEqual(payload);
	});

	it('calendar.listConferenceCalls maps filters and reads the conference key', async () => {
		const ctx = testCtx();
		const call = {
			id: '5f1b2c3d4e5f6a7b8c9d0e1f',
			date: '2026-01-29',
			ticker: 'AAPL',
			name: 'Apple',
			webcast_url: 'https://investor.apple.com/webcast',
		};
		mockRequest.mockResolvedValue({ conference: [call] });

		const result = await listConferenceCalls(ctx, {
			pagesize: 10,
			dateFrom: '2026-01-01',
			dateTo: '2026-01-31',
			tickers: 'AAPL',
		});

		expectRequest('/api/v2.1/calendar/conference-calls', {
			pagesize: 10,
			'parameters[date_from]': '2026-01-01',
			'parameters[date_to]': '2026-01-31',
			'parameters[tickers]': 'AAPL',
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.calendar.listConferenceCalls',
			{
				pagesize: 10,
				dateFrom: '2026-01-01',
				dateTo: '2026-01-31',
				tickers: 'AAPL',
			},
			'completed',
		);
		expect(result).toEqual({ conference: [call] });
	});

	it('calendar.listConferenceCalls normalizes the OpenAPI conference-calls key', async () => {
		const call = {
			id: '5f1b2c3d4e5f6a7b8c9d0e1f',
			date: '2026-01-29',
			ticker: 'AAPL',
			name: 'Apple',
		};
		mockRequest.mockResolvedValue({ 'conference-calls': [call] });

		expect(await listConferenceCalls(testCtx(), {})).toEqual({
			conference: [call],
		});
	});

	it('calendar.listConferenceCalls returns an empty list for an empty body', async () => {
		mockRequest.mockResolvedValue({});

		expect(await listConferenceCalls(testCtx(), {})).toEqual({
			conference: [],
		});
	});

	it('calendar.getConsensusRatings sends the single ticker as parameters[tickers]', async () => {
		const ctx = testCtx();
		const payload = {
			aggregate_ratings: {
				strong_buy: 7,
				buy: 12,
				hold: 5,
				sell: 2,
				strong_sell: 0,
			},
			aggregate_type: 'number',
			consensus_price_target: 293.69,
			consensus_rating: 'BUY',
			total_analyst_count: 50,
		};
		mockRequest.mockResolvedValue(payload);

		const result = await getConsensusRatings(ctx, {
			ticker: 'AAPL',
			dateFrom: '2025-01-01',
			simplify: true,
			aggregateType: 'percentage',
		});

		expectRequest('/api/v1/consensus-ratings', {
			'parameters[tickers]': 'AAPL',
			'parameters[date_from]': '2025-01-01',
			simplify: true,
			aggregate_type: 'percentage',
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.calendar.getConsensusRatings',
			{
				ticker: 'AAPL',
				dateFrom: '2025-01-01',
				simplify: true,
				aggregateType: 'percentage',
			},
			'completed',
		);
		expect(result).toEqual(payload);
	});

	it('calendar.listRemoved filters removed events by type', async () => {
		const ctx = testCtx();
		const payload = {
			removed: [
				{ id: '5b5d22b5be523300016fd411', type: 'dividends', updated: 0 },
			],
		};
		mockRequest.mockResolvedValue(payload);

		const result = await listRemovedCalendarEvents(ctx, {
			pageSize: 25,
			type: 'dividends',
			updated: 1704819600,
		});

		expectRequest('/api/v2.1/calendar-removed/', {
			pageSize: 25,
			type: 'dividends',
			updated: 1704819600,
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.calendar.listRemoved',
			{ pageSize: 25, type: 'dividends', updated: 1704819600 },
			'completed',
		);
		expect(result).toEqual(payload);
	});

	it('calendar.getEarningsStream returns the WebSocket URL without the API key', async () => {
		const ctx = testCtx();

		const result = await getEarningsStream(ctx, { isins: 'US0378331005' });

		expect(mockRequest).not.toHaveBeenCalled();
		expect(result).toEqual({
			url: 'wss://api.benzinga.com/api/v2.1/calendar/earnings/stream?isins=US0378331005',
			authQueryParam: 'token',
			commands: ['ping', 'replay'],
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'benzinga.calendar.getEarningsStream',
			{ isins: 'US0378331005' },
			'completed',
		);
	});
});

describe('entity persistence', () => {
	const calls = (table: EntityTable) => upserts[table].mock.calls;

	it('news.get upserts each article by stringified id', async () => {
		const article = { id: 123456, title: 'Apple Announces New iPhone' };
		mockRequest.mockResolvedValue([article]);
		await getNews(testCtx(), {});
		expect(calls('newsArticles')).toEqual([['123456', article]]);
	});

	it('news.get does not overwrite stored articles with headline or abstract output', async () => {
		mockRequest.mockResolvedValue([{ id: 1, title: 'Only a headline' }]);
		await getNews(testCtx(), { displayOutput: 'headline' });
		await getNews(testCtx(), { displayOutput: 'abstract' });
		expect(calls('newsArticles')).toEqual([]);
	});

	it('news.listChannels upserts each channel', async () => {
		const channel = { id: 26, parent: 0, channel: 'After-Hours Center' };
		mockRequest.mockResolvedValue({ ok: true, data: [channel] });
		await listNewsChannels(testCtx(), {});
		expect(calls('newsChannels')).toEqual([['26', channel]]);
	});

	it.each([
		['earnings', 'earnings', listEarnings],
		['dividends', 'dividends', listDividends],
		['ratings', 'ratings', listRatings],
		['guidance', 'guidance', listGuidance],
		['ipos', 'ipos', listIpos],
		['splits', 'splits', listSplits],
		['economics', 'economics', listEconomics],
		['conferenceCalls', 'conference', listConferenceCalls],
	] as const)(
		'calendar %s upserts each record by id',
		async (table, key, fn) => {
			const record = { id: 'abc123', updated: 1704819600 };
			mockRequest.mockResolvedValue({ [key]: [record] });
			await fn(testCtx(), {});
			expect(calls(table)).toEqual([['abc123', record]]);
		},
	);

	it('calendar.getConsensusRatings upserts under the requested ticker', async () => {
		const payload = { consensus_rating: 'BUY', total_analyst_count: 50 };
		mockRequest.mockResolvedValue(payload);
		await getConsensusRatings(testCtx(), { ticker: 'aapl' });
		expect(calls('consensusRatings')).toEqual([
			['AAPL', { ...payload, ticker: 'AAPL' }],
		]);
	});

	it('calendar.listRemoved upserts each removed event', async () => {
		const removed = {
			id: '5b5d22b5be523300016fd411',
			type: 'dividends',
			updated: 0,
		};
		mockRequest.mockResolvedValue({ removed: [removed] });
		await listRemovedCalendarEvents(testCtx(), {});
		expect(calls('removedCalendarEvents')).toEqual([[removed.id, removed]]);
	});

	it('news.listRemoved upserts items from every response key', async () => {
		const item = { id: 123456, updated: 'Wed, 17 May 2017 14:20:15 -0400' };
		mockRequest.mockResolvedValue({ data: [item] });
		await listRemovedNews(testCtx(), {});
		expect(calls('removedNewsItems')).toEqual([['123456', item]]);
	});

	it('still returns the API response when the database write fails', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		upserts.earnings.mockRejectedValueOnce(new Error('db down'));
		const payload = { earnings: [{ id: 'abc123' }] };
		mockRequest.mockResolvedValue(payload);
		await expect(listEarnings(testCtx(), {})).resolves.toEqual(payload);
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

describe('schema enforcement', () => {
	it('rejects invalid input before any request is made', async () => {
		await expect(getNews(testCtx(), { pageSize: 500 })).rejects.toThrow();
		await expect(
			listEarnings(testCtx(), { date: '2026-02-30' }),
		).rejects.toThrow();
		await expect(
			getConsensusRatings(testCtx(), { ticker: '' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a response that does not match the output schema', async () => {
		mockRequest.mockResolvedValue({ earnings: [{ date: '2026-01-01' }] });
		await expect(listEarnings(testCtx(), {})).rejects.toThrow();
		expect(upserts.earnings).not.toHaveBeenCalled();
	});
});
