import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { StormglassContext } from './context';
import {
	getElevation,
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
	return { key, db } as unknown as StormglassContext;
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

	it('returns the sg weather value and drops other sources', async () => {
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
		});
		expect(JSON.stringify(result.hours)).not.toContain('noaa');
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
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
