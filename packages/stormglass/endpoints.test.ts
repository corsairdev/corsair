import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { StormglassContext } from './context';
import {
	getAstronomy,
	getBio,
	getElevation,
	getExtremes,
	getHistoricalWeather,
	getSeaLevel,
	getSolar,
	getWeather,
	listStations,
	listStationsInArea,
} from './endpoints/read';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key?: string,
	db?: StormglassContext['db'],
): StormglassContext {
	// A real database is present whenever tables are passed in.
	return {
		key,
		db,
		database: db ? {} : undefined,
	} as unknown as StormglassContext;
}

describe('stormglass', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores stations and sends the key without a Bearer prefix', async () => {
		mockRequest.mockResolvedValue({
			data: [{ name: 'boulogne', lat: 50.728, lng: 1.577, source: 'sg' }],
		});
		const result = await listStations(context('sekrit'), {});
		expect(result.stations[0]).toEqual({
			id: 'sg:boulogne',
			name: 'boulogne',
			lat: 50.728,
			lng: 1.577,
			source: 'sg',
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
			Authorization: 'sekrit',
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
	});

	it('omits Authorization when no key is connected', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await listStations(context(''), {});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
		});
	});

	it('sends a two-point box and omits it from the event', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await listStationsInArea(context(), { box: '58.0,17.0:59.0,18.0' });
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/v2/tide/stations/area',
			query: { box: '58.0,17.0:59.0,18.0' },
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 0 });
	});

	it('rejects a box that is not two coordinates', async () => {
		await expect(
			listStationsInArea(context(), { box: '0,0,1,1' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('stores elevation and leaves the coordinate out of the event', async () => {
		mockRequest.mockResolvedValue({
			data: { elevation: 5.23 },
			meta: { dailyQuota: 10, requestCount: 1, lat: 58.8, lng: 17.6 },
		});
		const result = await getElevation(context(), { lat: 58.8, lng: 17.6 });
		expect(result.point).toEqual({ id: '58.8,17.6', elevation: 5.23 });
		expect(result.quota).toEqual({
			id: 'elevation',
			dailyQuota: 10,
			requestCount: 1,
		});
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('58.8');
	});

	it('returns the sg weather value and keeps every source', async () => {
		mockRequest.mockResolvedValue({
			hours: [
				{
					time: '2024-01-01T00:00:00+00:00',
					airTemperature: { sg: 15.23, noaa: 14.8 },
				},
			],
			meta: { dailyQuota: 10, requestCount: 2 },
		});
		const result = await getWeather(context(), {
			lat: 58.8,
			lng: 17.6,
			params: 'airTemperature',
		});
		expect(result.hours[0]).toEqual({
			time: '2024-01-01T00:00:00+00:00',
			values: { airTemperature: 15.23 },
			sources: { airTemperature: { sg: 15.23, noaa: 14.8 } },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual({
			method: 'GET',
			url: '/v2/weather/point',
			query: {
				lat: 58.8,
				lng: 17.6,
				params: 'airTemperature',
				start: undefined,
				end: undefined,
				source: undefined,
			},
		});
		expect(mockLog.mock.calls[0]?.[1]).toBe('stormglass.weather.get');
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
	});

	it('sends start, end and source, and fills values from the first source', async () => {
		mockRequest.mockResolvedValue({
			hours: [
				{
					time: '2024-01-01T00:00:00+00:00',
					waveHeight: { noaa: 1.2, dwd: 1.4 },
					windSpeed: { dwd: 5 },
				},
			],
			meta: { dailyQuota: 10, requestCount: 3 },
		});
		const result = await getWeather(context(), {
			lat: 58.8,
			lng: 17.6,
			params: 'waveHeight, windSpeed',
			start: 1704067200,
			end: '2024-01-02',
			source: 'noaa,dwd',
		});
		expect(mockRequest.mock.calls[0]?.[1]?.query).toEqual({
			lat: 58.8,
			lng: 17.6,
			params: 'waveHeight,windSpeed',
			start: 1704067200,
			end: '2024-01-02',
			source: 'noaa,dwd',
		});
		expect(result.hours[0]?.values).toEqual({ waveHeight: 1.2, windSpeed: 5 });
	});

	it('reads solar values', async () => {
		mockRequest.mockResolvedValue({
			hours: [{ time: '2024-01-01T12:00:00+00:00', uvIndex: { sg: 2.1 } }],
			meta: { dailyQuota: 10, requestCount: 4 },
		});
		const result = await getSolar(context(), {
			lat: 58.8,
			lng: 17.6,
			params: 'uvIndex',
		});
		expect(mockRequest.mock.calls[0]?.[1]?.url).toBe('/v2/solar/point');
		expect(result.hours[0]?.values).toEqual({ uvIndex: 2.1 });
		expect(result.quota.id).toBe('solar');
		expect(mockLog.mock.calls[0]?.[1]).toBe('stormglass.solar.get');
	});

	it('reads bio values', async () => {
		mockRequest.mockResolvedValue({
			hours: [
				{ time: '2024-01-01T00:00:00+00:00', salinity: { meto: 7.1, sg: 7.2 } },
			],
			meta: { dailyQuota: 10, requestCount: 5 },
		});
		const result = await getBio(context(), {
			lat: 58.8,
			lng: 17.6,
			params: 'salinity',
		});
		expect(mockRequest.mock.calls[0]?.[1]?.url).toBe('/v2/bio/point');
		expect(result.hours[0]?.values).toEqual({ salinity: 7.2 });
		expect(result.quota.id).toBe('bio');
		expect(mockLog.mock.calls[0]?.[1]).toBe('stormglass.bio.get');
	});

	it('reads historical weather with a start', async () => {
		mockRequest.mockResolvedValue({
			hours: [
				{ time: '2020-01-01T00:00:00+00:00', airTemperature: { sg: -1.5 } },
			],
			meta: { dailyQuota: 10, requestCount: 6 },
		});
		const result = await getHistoricalWeather(context(), {
			lat: 58.8,
			lng: 17.6,
			params: 'airTemperature',
			start: '2020-01-01',
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/v2/historical/point',
			query: { start: '2020-01-01', params: 'airTemperature' },
		});
		expect(result.hours[0]?.values).toEqual({ airTemperature: -1.5 });
		expect(mockLog.mock.calls[0]?.[1]).toBe('stormglass.weather.historical');
	});

	it('rejects historical weather without start or end', async () => {
		await expect(
			getHistoricalWeather(context(), {
				lat: 58.8,
				lng: 17.6,
				params: 'airTemperature',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('stores tide extremes under the station that answered', async () => {
		const save = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			data: [
				{ height: 0.3, time: '2024-01-01T04:12:00+00:00', type: 'high' },
				{ height: -0.2, time: '2024-01-01T10:30:00+00:00', type: 'low' },
			],
			meta: {
				dailyQuota: 10,
				requestCount: 7,
				datum: 'MLLW',
				station: {
					name: 'bergen',
					source: 'ticon',
					distance: 12.4,
					lat: 60.398,
					lng: 5.32,
				},
			},
		});
		const result = await getExtremes(
			context(undefined, {
				extremes: { upsertByEntityId: save },
			} as unknown as StormglassContext['db']),
			{ lat: 60.9, lng: 5.1, start: '2024-01-01', datum: 'MLLW' },
		);
		expect(mockRequest.mock.calls[0]?.[1]).toEqual({
			method: 'GET',
			url: '/v2/tide/extremes/point',
			query: {
				lat: 60.9,
				lng: 5.1,
				start: '2024-01-01',
				end: undefined,
				datum: 'MLLW',
			},
		});
		expect(result.extremes[0]).toEqual({
			id: 'ticon:bergen:MLLW:2024-01-01T04:12:00+00:00:high',
			time: '2024-01-01T04:12:00+00:00',
			type: 'high',
			height: 0.3,
		});
		expect(result.station).toEqual({
			name: 'bergen',
			source: 'ticon',
			distance: 12.4,
			lat: 60.398,
			lng: 5.32,
		});
		expect(save).toHaveBeenCalledTimes(2);
		expect(mockLog.mock.calls[0]?.[1]).toBe('stormglass.tides.extremes');
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 2 });
	});

	it('skips saves when core has no database', async () => {
		const upsert = jest
			.fn()
			.mockRejectedValue(new Error('Database not configured'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		mockRequest.mockResolvedValue({
			data: [{ name: 'boulogne', lat: 50.7, lng: 1.5, source: 'sg' }],
		});
		const ctx = {
			db: { stations: { upsertByEntityId: upsert } },
			database: undefined,
		} as unknown as StormglassContext;
		await listStations(ctx, {});
		expect(upsert).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it('rejects an unknown datum', async () => {
		await expect(
			getExtremes(context(), {
				lat: 60.9,
				lng: 5.1,
				datum: 'XYZ' as 'MSL',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reads hourly sea levels', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{ sg: 0.41, time: '2024-01-01T00:00:00+00:00' },
				{ sg: 0.37, time: '2024-01-01T01:00:00+00:00' },
			],
			meta: {
				dailyQuota: 10,
				requestCount: 8,
				station: { name: 'lerwick', source: 'ticon', distance: 50 },
			},
		});
		const result = await getSeaLevel(context(), { lat: 60.9, lng: -3 });
		expect(mockRequest.mock.calls[0]?.[1]?.url).toBe(
			'/v2/tide/sea-level/point',
		);
		expect(result.levels).toEqual([
			{
				time: '2024-01-01T00:00:00+00:00',
				height: 0.41,
				sources: { sg: 0.41 },
			},
			{
				time: '2024-01-01T01:00:00+00:00',
				height: 0.37,
				sources: { sg: 0.37 },
			},
		]);
		expect(result.station?.name).toBe('lerwick');
		expect(mockLog.mock.calls[0]?.[1]).toBe('stormglass.tides.seaLevel');
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('60.9');
	});

	it('reads astronomy days with null events', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{
					time: '2024-06-21T00:00:00+00:00',
					sunrise: '2024-06-21T01:02:00+00:00',
					sunset: '2024-06-21T20:10:00+00:00',
					moonrise: null,
					moonset: '2024-06-21T03:00:00+00:00',
					moonFraction: 0.98,
					moonPhase: {
						current: {
							text: 'Waxing gibbous',
							time: '2024-06-21T00:00:00+00:00',
							value: 0.47,
						},
						closest: {
							text: 'Full moon',
							time: '2024-06-22T01:07:00+00:00',
							value: 0.5,
						},
					},
					astronomicalDawn: null,
					astronomicalDusk: null,
				},
			],
			meta: { dailyQuota: 10, requestCount: 9 },
		});
		const result = await getAstronomy(context(), {
			lat: 58.8,
			lng: 17.6,
			start: '2024-06-21',
			end: '2024-06-22',
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual({
			method: 'GET',
			url: '/v2/astronomy/point',
			query: { lat: 58.8, lng: 17.6, start: '2024-06-21', end: '2024-06-22' },
		});
		expect(result.days).toHaveLength(1);
		expect(result.days[0]?.moonrise).toBeNull();
		expect(result.days[0]?.moonPhase?.closest?.text).toBe('Full moon');
		expect(result.quota).toEqual({
			id: 'astronomy',
			dailyQuota: 10,
			requestCount: 9,
		});
		expect(mockLog.mock.calls[0]?.[1]).toBe('stormglass.astronomy.get');
	});

	it('lets an HTTP 403 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v2/tide/stations' },
			{
				url: 'https://api.stormglass.io/v2/tide/stations',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { errors: { key: 'API key is invalid' } },
			},
			'Forbidden',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listStations(context(), {})).rejects.toBe(error);
	});
});
