import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeContext } from '../index';
import {
	getForecastByLatLng,
	getHistoryByLatLng,
	getHistoryByPostalCode,
	getLatestByCity,
	getLatestByCountryCode,
	getLatestByLatLng,
	getLatestByPostalCode,
} from './air-quality';

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

const STATIONS_RESPONSE = {
	message: 'success',
	stations: [
		{
			CO: 0.83,
			NO2: 12.75,
			OZONE: 24.75,
			PM10: 30.5,
			PM25: 12.5,
			SO2: 3.5,
			AQI: 51,
			aqiInfo: {
				pollutant: 'PM2.5',
				concentration: 12.5,
				category: 'Moderate',
			},
			city: 'Bengaluru',
			countryCode: 'IN',
			state: 'Karnataka',
			placeName: 'Vasanth Nagar',
			postalCode: '560020',
			lat: 12.9889055,
			lng: 77.574044,
			updatedAt: '2026-08-06T09:00:00.000Z',
		},
	],
};

const SERIES_RESPONSE = {
	message: 'success',
	lat: 12.9889055,
	lng: 77.574044,
	data: [
		{ PM25: 11.2, PM10: 28.4, AQI: 47, time: 1594642800 },
		{ PM25: 13.9, PM10: 31.1, AQI: 55, time: 1594646400 },
	],
};

const upsertByEntityId = jest.fn().mockResolvedValue(undefined);

function makeCtx(withDb = true): AmbeeContext {
	return {
		key: 'test-key',
		options: {},
		db: withDb ? { airQualityReadings: { upsertByEntityId } } : {},
	} as unknown as AmbeeContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
	upsertByEntityId.mockClear();
});

describe('airQuality.getLatestByLatLng', () => {
	it('calls latest/by-lat-lng with the coordinates and returns the parsed body', async () => {
		mockRequest.mockResolvedValue(STATIONS_RESPONSE);

		const result = await getLatestByLatLng(makeCtx(), {
			lat: 12.9889055,
			lng: 77.574044,
		});

		expect(mockRequest).toHaveBeenCalledWith('latest/by-lat-lng', 'test-key', {
			query: { lat: 12.9889055, lng: 77.574044 },
		});
		expect(result.stations?.[0]?.AQI).toBe(51);
		expect(result.stations?.[0]?.aqiInfo?.category).toBe('Moderate');
	});

	it('persists each station and logs a completed event', async () => {
		mockRequest.mockResolvedValue(STATIONS_RESPONSE);

		await getLatestByLatLng(makeCtx(), { lat: 12.9889055, lng: 77.574044 });

		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		const [entityId, row] = upsertByEntityId.mock.calls[0];
		expect(entityId).toBe('12.9889,77.5740');
		expect(row).toMatchObject({
			city: 'Bengaluru',
			aqi: 51,
			aqiCategory: 'Moderate',
			dominantPollutant: 'PM2.5',
			pm25: 12.5,
			postalCode: '560020',
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.airQuality.getLatestByLatLng',
			{ lat: 12.9889055, lng: 77.574044 },
			'completed',
		);
	});

	it('skips persistence when the host app has no database configured', async () => {
		mockRequest.mockResolvedValue(STATIONS_RESPONSE);

		await getLatestByLatLng(makeCtx(false), {
			lat: 12.9889055,
			lng: 77.574044,
		});

		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('rejects a response that does not match the documented shape', async () => {
		mockRequest.mockResolvedValue({ stations: [] });

		await expect(
			getLatestByLatLng(makeCtx(), { lat: 1, lng: 1 }),
		).rejects.toThrow();
	});
});

describe('airQuality.getLatestByCity', () => {
	it('passes the city and optional limit through', async () => {
		mockRequest.mockResolvedValue(STATIONS_RESPONSE);

		await getLatestByCity(makeCtx(), { city: 'Bengaluru', limit: 5 });

		expect(mockRequest).toHaveBeenCalledWith('latest/by-city', 'test-key', {
			query: { city: 'Bengaluru', limit: 5 },
		});
	});

	it('omits the limit when it is not supplied', async () => {
		mockRequest.mockResolvedValue(STATIONS_RESPONSE);

		await getLatestByCity(makeCtx(), { city: 'Bengaluru' });

		expect(mockRequest).toHaveBeenCalledWith('latest/by-city', 'test-key', {
			query: { city: 'Bengaluru', limit: undefined },
		});
	});
});

describe('airQuality.getLatestByPostalCode', () => {
	it('calls latest/by-postal-code with the postal and country codes', async () => {
		mockRequest.mockResolvedValue(STATIONS_RESPONSE);

		await getLatestByPostalCode(makeCtx(), {
			postalCode: '560020',
			countryCode: 'IND',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'latest/by-postal-code',
			'test-key',
			{ query: { postalCode: '560020', countryCode: 'IND' } },
		);
	});
});

describe('airQuality.getLatestByCountryCode', () => {
	it('calls latest/by-country-code and persists the returned stations', async () => {
		mockRequest.mockResolvedValue(STATIONS_RESPONSE);

		await getLatestByCountryCode(makeCtx(), { countryCode: 'IND' });

		expect(mockRequest).toHaveBeenCalledWith(
			'latest/by-country-code',
			'test-key',
			{ query: { countryCode: 'IND', limit: undefined } },
		);
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.airQuality.getLatestByCountryCode',
			{ countryCode: 'IND', limit: undefined },
			'completed',
		);
	});

	it('forwards an optional limit to makeAmbeeRequest', async () => {
		mockRequest.mockResolvedValue(STATIONS_RESPONSE);

		await getLatestByCountryCode(makeCtx(), { countryCode: 'IND', limit: 5 });

		expect(mockRequest).toHaveBeenCalledWith(
			'latest/by-country-code',
			'test-key',
			{ query: { countryCode: 'IND', limit: 5 } },
		);
	});
});

describe('airQuality.getHistoryByLatLng', () => {
	it('normalises ISO timestamps to Ambee’s expected format', async () => {
		mockRequest.mockResolvedValue(SERIES_RESPONSE);

		const result = await getHistoryByLatLng(makeCtx(), {
			lat: 12.9889055,
			lng: 77.574044,
			from: '2026-07-13T12:16:44.000Z',
			to: '2026-07-14T12:16:44.000Z',
		});

		expect(mockRequest).toHaveBeenCalledWith('history/by-lat-lng', 'test-key', {
			query: {
				lat: 12.9889055,
				lng: 77.574044,
				from: '2026-07-13 12:16:44',
				to: '2026-07-14 12:16:44',
			},
		});
		expect(result.data).toHaveLength(2);
	});
});

describe('airQuality.getHistoryByPostalCode', () => {
	it('calls history/by-postal-code with the normalised range', async () => {
		mockRequest.mockResolvedValue(SERIES_RESPONSE);

		await getHistoryByPostalCode(makeCtx(), {
			postalCode: '560020',
			countryCode: 'IND',
			from: '2026-07-13 12:16:44',
			to: '2026-07-14 12:16:44',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'history/by-postal-code',
			'test-key',
			{
				query: {
					postalCode: '560020',
					countryCode: 'IND',
					from: '2026-07-13 12:16:44',
					to: '2026-07-14 12:16:44',
				},
			},
		);
	});
});

describe('airQuality.getForecastByLatLng', () => {
	it('calls forecast/aq/by-lat-lng and logs the event', async () => {
		mockRequest.mockResolvedValue(SERIES_RESPONSE);

		await getForecastByLatLng(makeCtx(), { lat: 38, lng: -97 });

		expect(mockRequest).toHaveBeenCalledWith(
			'forecast/aq/by-lat-lng',
			'test-key',
			{ query: { lat: 38, lng: -97 } },
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.airQuality.getForecastByLatLng',
			{ lat: 38, lng: -97 },
			'completed',
		);
	});
});
