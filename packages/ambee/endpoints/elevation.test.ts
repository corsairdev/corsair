import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeContext } from '../index';
import { getByLatLng, getByPlace } from './elevation';
import { getForecastByLatLng as iliGetForecastByLatLng } from './ili';

jest.mock('../client', () => ({ makeAmbeeRequest: jest.fn() }));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeAmbeeRequest as jest.MockedFunction<
	typeof makeAmbeeRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ELEVATION_RESPONSE = {
	message: 'success',
	data: [
		{
			lat: 37.77355324503912,
			lng: -122.39428048824142,
			elevation: 12,
			minElevation: 10,
			maxElevation: 15,
			meanElevation: 12.4,
		},
	],
};

const ILI_RESPONSE = {
	message: 'success',
	lat: 37.7749,
	lng: -122.4194,
	data: [{ date: '2026-08-11', risk: 'Low' }],
};

function makeCtx(): AmbeeContext {
	return { key: 'test-key', options: {}, db: {} } as unknown as AmbeeContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('elevation.getByLatLng', () => {
	it('calls elevation/latest/by-lat-lng and returns the reading', async () => {
		mockRequest.mockResolvedValue(ELEVATION_RESPONSE);

		const result = await getByLatLng(makeCtx(), {
			lat: 37.77355324503912,
			lng: -122.39428048824142,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'elevation/latest/by-lat-lng',
			'test-key',
			{ query: { lat: 37.77355324503912, lng: -122.39428048824142 } },
		);
		expect(result.data?.[0]?.elevation).toBe(12);
		expect(result.data?.[0]?.meanElevation).toBe(12.4);
	});
});

describe('elevation.getByPlace', () => {
	it('calls elevation/latest/by-place and logs the event', async () => {
		mockRequest.mockResolvedValue(ELEVATION_RESPONSE);

		await getByPlace(makeCtx(), { place: 'San Francisco, USA' });

		expect(mockRequest).toHaveBeenCalledWith(
			'elevation/latest/by-place',
			'test-key',
			{ query: { place: 'San Francisco, USA' } },
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.elevation.getByPlace',
			{ place: 'San Francisco, USA' },
			'completed',
		);
	});
});

describe('ili.getForecastByLatLng', () => {
	it('always sends `details`, defaulting it to false', async () => {
		mockRequest.mockResolvedValue(ILI_RESPONSE);

		await iliGetForecastByLatLng(makeCtx(), {
			lat: 37.7749,
			lng: -122.4194,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'ili/forecast/by-lat-lng',
			'test-key',
			{ query: { lat: 37.7749, lng: -122.4194, details: false } },
		);
	});

	it('forwards details=true and returns the risk forecast', async () => {
		mockRequest.mockResolvedValue(ILI_RESPONSE);

		const result = await iliGetForecastByLatLng(makeCtx(), {
			lat: 37.7749,
			lng: -122.4194,
			details: true,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'ili/forecast/by-lat-lng',
			'test-key',
			{ query: { lat: 37.7749, lng: -122.4194, details: true } },
		);
		expect(result.data?.[0]?.risk).toBe('Low');
	});
});
