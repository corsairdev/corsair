import 'dotenv/config';
import { makeBenzingaRequest } from './client';
import type { GetNewsResponse, ListIposRawResponse } from './endpoints/types';
import {
	BenzingaEndpointOutputSchemas,
	ListIposRawResponseSchema,
} from './endpoints/types';

const API_KEY = process.env.BENZINGA_API_KEY ?? '';
const describeLive = API_KEY ? describe : describe.skip;

describeLive('Benzinga live API', () => {
	it('news.get returns articles matching the output schema', async () => {
		const response = await makeBenzingaRequest<GetNewsResponse>(
			'/api/v2/news',
			API_KEY,
			{
				query: { pageSize: 2, displayOutput: 'headline' },
			},
		);
		const parsed = BenzingaEndpointOutputSchemas.getNews.parse(response);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toBeGreaterThan(0);
		expect(parsed[0]?.id).toEqual(expect.any(Number));
		expect(parsed[0]?.title).toEqual(expect.any(String));
		expect(parsed[0]?.url).toEqual(expect.any(String));
	});

	it('news.listChannels returns channel entries', async () => {
		const response = await makeBenzingaRequest<unknown>(
			'/api/v2.1/news/channels',
			API_KEY,
		);
		const parsed =
			BenzingaEndpointOutputSchemas.listNewsChannels.parse(response);
		expect(parsed.ok).toBe(true);
		expect(Array.isArray(parsed.data)).toBe(true);
		expect(parsed.data.length).toBeGreaterThan(0);
		expect(parsed.data[0]?.channel).toEqual(expect.any(String));
	});

	it('calendar.listEarnings returns earnings records', async () => {
		const response = await makeBenzingaRequest<unknown>(
			'/api/v2.1/calendar/earnings',
			API_KEY,
			{ query: { pagesize: 2 } },
		);
		const parsed = BenzingaEndpointOutputSchemas.listEarnings.parse(response);
		expect(parsed.earnings).toBeDefined();
		expect(Array.isArray(parsed.earnings)).toBe(true);
		expect(parsed.earnings.length).toBeGreaterThan(0);
		expect(parsed.earnings[0]?.ticker).toEqual(expect.any(String));
	});

	it('calendar.listDividends returns dividend records', async () => {
		const response = await makeBenzingaRequest<unknown>(
			'/api/v2.2/calendar/dividends',
			API_KEY,
			{ query: { pagesize: 2 } },
		);
		const parsed = BenzingaEndpointOutputSchemas.listDividends.parse(response);
		expect(parsed.dividends).toBeDefined();
		expect(Array.isArray(parsed.dividends)).toBe(true);
		expect(parsed.dividends.length).toBeGreaterThan(0);
		expect(parsed.dividends[0]?.ticker).toEqual(expect.any(String));
	});

	it('calendar.listRatings returns rating records', async () => {
		const response = await makeBenzingaRequest<unknown>(
			'/api/v2.1/calendar/ratings',
			API_KEY,
			{ query: { pagesize: 2 } },
		);
		const parsed = BenzingaEndpointOutputSchemas.listRatings.parse(response);
		expect(parsed.ratings).toBeDefined();
		expect(Array.isArray(parsed.ratings)).toBe(true);
		expect(parsed.ratings.length).toBeGreaterThan(0);
		expect(parsed.ratings[0]?.ticker).toEqual(expect.any(String));
	});

	it('calendar.listGuidance returns guidance records', async () => {
		const response = await makeBenzingaRequest<unknown>(
			'/api/v2.1/calendar/guidance',
			API_KEY,
			{ query: { pagesize: 2 } },
		);
		const parsed = BenzingaEndpointOutputSchemas.listGuidance.parse(response);
		expect(parsed.guidance).toBeDefined();
		expect(Array.isArray(parsed.guidance)).toBe(true);
		expect(parsed.guidance.length).toBeGreaterThan(0);
		expect(parsed.guidance[0]?.ticker).toEqual(expect.any(String));
	});

	it('calendar.listIpos returns IPO records', async () => {
		const response = await makeBenzingaRequest<ListIposRawResponse>(
			'/api/v2.1/calendar/ipos',
			API_KEY,
			{ query: { pagesize: 2 } },
		);
		const parsed = ListIposRawResponseSchema.parse(response);
		const ipos = Array.isArray(parsed) ? parsed : parsed.ipos;
		expect(Array.isArray(ipos)).toBe(true);
		// Trial keys may return no IPO rows; only assert item shape when present.
		if (ipos.length > 0) {
			expect(ipos[0]?.ticker).toEqual(expect.any(String));
			expect(ipos[0]?.id).toEqual(expect.any(String));
		} else {
			expect(ipos).toHaveLength(0);
		}
	});

	it('calendar.listSplits returns split records', async () => {
		const response = await makeBenzingaRequest<unknown>(
			'/api/v2.1/calendar/splits',
			API_KEY,
			{ query: { pagesize: 2 } },
		);
		const parsed = BenzingaEndpointOutputSchemas.listSplits.parse(response);
		expect(parsed.splits).toBeDefined();
		expect(Array.isArray(parsed.splits)).toBe(true);
		expect(parsed.splits.length).toBeGreaterThan(0);
		expect(parsed.splits[0]?.ticker).toEqual(expect.any(String));
	});

	it('calendar.listEconomics returns economic records', async () => {
		const response = await makeBenzingaRequest<unknown>(
			'/api/v2.1/calendar/economics',
			API_KEY,
			{ query: { pagesize: 2 } },
		);
		const parsed = BenzingaEndpointOutputSchemas.listEconomics.parse(response);
		expect(parsed.economics).toBeDefined();
		expect(Array.isArray(parsed.economics)).toBe(true);
		expect(parsed.economics.length).toBeGreaterThan(0);
		expect(parsed.economics[0]?.event_name).toEqual(expect.any(String));
	});
});
