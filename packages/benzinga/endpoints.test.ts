import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './endpoints/types';

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
			country: 'USA',
			event_name: 'CPI',
			event_category: 'Employment',
		});
		expect(economics.country).toBe('USA');
		expect(economics.event_name).toBe('CPI');
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
