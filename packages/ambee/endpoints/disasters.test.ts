import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeContext } from '../index';
import {
	getHistoryByContinent,
	getHistoryByCountryCode,
	getHistoryByDateRange,
	getHistoryByLatLng,
	getLatestByContinent,
	getLatestByCountryCode,
	getLatestByLatLng,
} from './disasters';

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

const DISASTER_RESPONSE = {
	message: 'success',
	result: [
		{
			event_id: 'EQ-2026-0042',
			event_type: 'EQ',
			event_name: 'Earthquake',
			lat: -15.76166996,
			lng: -72.48771045,
			country_code: 'PER',
			continent: 'SAR',
			date: '2026-08-01T04:12:00.000Z',
			severity: 5.4,
		},
	],
	page: 1,
	limit: 1,
};

function makeCtx(): AmbeeContext {
	return { key: 'test-key', options: {}, db: {} } as unknown as AmbeeContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('disasters.getLatestByLatLng', () => {
	it('calls disasters/latest/by-lat-lng and returns the events', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		const result = await getLatestByLatLng(makeCtx(), {
			lat: -15.76166996,
			lng: -72.48771045,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'disasters/latest/by-lat-lng',
			'test-key',
			{
				query: {
					lat: -15.76166996,
					lng: -72.48771045,
					eventType: undefined,
					limit: undefined,
					page: undefined,
				},
			},
		);
		expect(result.result?.[0]?.event_type).toBe('EQ');
	});

	it('forwards pagination and the event-type filter', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		await getLatestByLatLng(makeCtx(), {
			lat: 0,
			lng: 0,
			eventType: 'FL',
			limit: 25,
			page: 3,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'disasters/latest/by-lat-lng',
			'test-key',
			{ query: { lat: 0, lng: 0, eventType: 'FL', limit: 25, page: 3 } },
		);
	});
});

describe('disasters.getLatestByCountryCode', () => {
	it('calls disasters/latest/by-country-code with the ISO code', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		await getLatestByCountryCode(makeCtx(), { countryCode: 'IND', limit: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			'disasters/latest/by-country-code',
			'test-key',
			{
				query: {
					countryCode: 'IND',
					eventType: undefined,
					limit: 10,
					page: undefined,
				},
			},
		);
	});
});

describe('disasters.getLatestByContinent', () => {
	it('calls disasters/latest/by-continent with the continent code', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		await getLatestByContinent(makeCtx(), { continent: 'NAR' });

		expect(mockRequest).toHaveBeenCalledWith(
			'disasters/latest/by-continent',
			'test-key',
			{
				query: {
					continent: 'NAR',
					eventType: undefined,
					limit: undefined,
					page: undefined,
				},
			},
		);
	});
});

describe('disasters.getHistoryByLatLng', () => {
	it('normalises the date range', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		await getHistoryByLatLng(makeCtx(), {
			lat: 40.4549,
			lng: 36.3025,
			from: '2026-05-31T12:00:00.000Z',
			to: '2026-07-31T08:00:00.000Z',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'disasters/history/by-lat-lng',
			'test-key',
			{
				query: {
					lat: 40.4549,
					lng: 36.3025,
					from: '2026-05-31 12:00:00',
					to: '2026-07-31 08:00:00',
					eventType: undefined,
					limit: undefined,
					page: undefined,
				},
			},
		);
	});
});

describe('disasters.getHistoryByCountryCode', () => {
	it('calls disasters/history/by-country-code with the normalised range', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		await getHistoryByCountryCode(makeCtx(), {
			countryCode: 'IND',
			from: '2026-07-01 12:00:00',
			to: '2026-07-31 08:00:00',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'disasters/history/by-country-code',
			'test-key',
			{
				query: {
					countryCode: 'IND',
					from: '2026-07-01 12:00:00',
					to: '2026-07-31 08:00:00',
					eventType: undefined,
					limit: undefined,
					page: undefined,
				},
			},
		);
	});
});

describe('disasters.getHistoryByContinent', () => {
	it('calls disasters/history/by-continent with the normalised range', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		await getHistoryByContinent(makeCtx(), {
			continent: 'ANT',
			from: '2026-07-01 12:00:00',
			to: '2026-07-31 08:00:00',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'disasters/history/by-continent',
			'test-key',
			{
				query: {
					continent: 'ANT',
					from: '2026-07-01 12:00:00',
					to: '2026-07-31 08:00:00',
					eventType: undefined,
					limit: undefined,
					page: undefined,
				},
			},
		);
	});
});

describe('disasters.getHistoryByDateRange', () => {
	it('omits `to` when the caller does not supply one', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		await getHistoryByDateRange(makeCtx(), {
			from: '2026-07-01 15:00:00',
			limit: 3,
			page: 1,
		});

		expect(mockRequest).toHaveBeenCalledWith('disasters/history', 'test-key', {
			query: {
				from: '2026-07-01 15:00:00',
				to: undefined,
				eventType: undefined,
				limit: 3,
				page: 1,
			},
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.disasters.getHistoryByDateRange',
			{ from: '2026-07-01 15:00:00', to: undefined, page: 1 },
			'completed',
		);
	});

	it('normalises `to` when one is supplied', async () => {
		mockRequest.mockResolvedValue(DISASTER_RESPONSE);

		await getHistoryByDateRange(makeCtx(), {
			from: '2026-07-01T15:00:00.000Z',
			to: '2026-07-05T15:00:00.000Z',
		});

		expect(mockRequest).toHaveBeenCalledWith('disasters/history', 'test-key', {
			query: {
				from: '2026-07-01 15:00:00',
				to: '2026-07-05 15:00:00',
				eventType: undefined,
				limit: undefined,
				page: undefined,
			},
		});
	});
});
