import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeContext } from '../index';
import { getForecast, getHistory, getLatest } from './weather';

jest.mock('../client', () => ({
	makeAmbeeRequest: jest.fn(),
	toAmbeeTimestamp: jest.requireActual('../client').toAmbeeTimestamp,
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeAmbeeRequest as jest.MockedFunction<
	typeof makeAmbeeRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const LATEST_RESPONSE = {
	message: 'success',
	lat: 40,
	lng: -77,
	timezone: 'America/New_York',
	data: {
		time: 1657000000,
		summary: 'Cloudy',
		icon: 'cloudy',
		temperature: 70,
		apparentTemperature: 70,
		dewPoint: 69.2,
		humidity: 95,
		pressure: 1011,
		windSpeed: 0.2,
		windGust: 6.06,
		windBearing: 258,
		cloudCover: 1,
		visibility: 6,
		ozone: 316.52,
		uvIndex: 0,
		precipIntensity: 0,
		precipProbability: 58,
	},
};

const SERIES_RESPONSE = {
	message: 'success',
	lat: 40,
	lng: -77,
	data: [
		{ time: 1657000000, temperature: 70, humidity: 95 },
		{ time: 1657003600, temperature: 71, humidity: 93 },
	],
};

const upsertByEntityId = jest.fn().mockResolvedValue(undefined);

function makeCtx(): AmbeeContext {
	return {
		key: 'test-key',
		options: {},
		db: { weatherObservations: { upsertByEntityId } },
	} as unknown as AmbeeContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
	upsertByEntityId.mockClear();
});

describe('weather.getLatest', () => {
	it('calls weather/latest/by-lat-lng and returns the single observation', async () => {
		mockRequest.mockResolvedValue(LATEST_RESPONSE);

		const result = await getLatest(makeCtx(), { lat: 40, lng: -77 });

		expect(mockRequest).toHaveBeenCalledWith(
			'weather/latest/by-lat-lng',
			'test-key',
			{ query: { lat: 40, lng: -77, units: undefined } },
		);
		expect(result.data?.temperature).toBe(70);
		expect(result.timezone).toBe('America/New_York');
	});

	it('forwards the si units flag when requested', async () => {
		mockRequest.mockResolvedValue(LATEST_RESPONSE);

		await getLatest(makeCtx(), { lat: 40, lng: -77, units: 'si' });

		expect(mockRequest).toHaveBeenCalledWith(
			'weather/latest/by-lat-lng',
			'test-key',
			{ query: { lat: 40, lng: -77, units: 'si' } },
		);
	});

	it('persists the observation keyed by rounded coordinates', async () => {
		mockRequest.mockResolvedValue(LATEST_RESPONSE);

		await getLatest(makeCtx(), { lat: 40, lng: -77 });

		const [entityId, row] = upsertByEntityId.mock.calls[0];
		expect(entityId).toBe('40.0000,-77.0000');
		expect(row).toMatchObject({
			timezone: 'America/New_York',
			temperature: 70,
			windGust: 6.06,
			observedAt: 1657000000,
		});
	});

	it('does not fail the call when persistence throws', async () => {
		mockRequest.mockResolvedValue(LATEST_RESPONSE);
		upsertByEntityId.mockRejectedValueOnce(new Error('db unavailable'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await getLatest(makeCtx(), { lat: 40, lng: -77 });

		expect(result.message).toBe('success');
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

describe('weather.getHistory', () => {
	it('normalises the time range and returns the hourly series', async () => {
		mockRequest.mockResolvedValue(SERIES_RESPONSE);

		const result = await getHistory(makeCtx(), {
			lat: 40,
			lng: -77,
			from: '2026-07-13T12:16:44.000Z',
			to: '2026-07-14T12:16:44.000Z',
			units: 'si',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'weather/history/by-lat-lng',
			'test-key',
			{
				query: {
					lat: 40,
					lng: -77,
					from: '2026-07-13 12:16:44',
					to: '2026-07-14 12:16:44',
					units: 'si',
				},
			},
		);
		expect(result.data).toHaveLength(2);
	});
});

describe('weather.getForecast', () => {
	it('calls weather/forecast/by-lat-lng and logs the event', async () => {
		mockRequest.mockResolvedValue(SERIES_RESPONSE);

		await getForecast(makeCtx(), { lat: 40, lng: -77 });

		expect(mockRequest).toHaveBeenCalledWith(
			'weather/forecast/by-lat-lng',
			'test-key',
			{ query: { lat: 40, lng: -77, units: undefined } },
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.weather.getForecast',
			{ lat: 40, lng: -77, units: undefined },
			'completed',
		);
	});
});
