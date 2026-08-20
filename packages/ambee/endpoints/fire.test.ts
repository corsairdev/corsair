import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeContext } from '../index';
import {
	getLatestByLatLng,
	getLatestByPlace,
	getRiskByLatLng,
	getRiskByPlace,
} from './fire';

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

const FIRE_RESPONSE = {
	message: 'success',
	data: [
		{
			lat: 36.27347,
			lng: -106.70503,
			detectedAt: '2026-08-05T18:24:00.000Z',
			confidence: 84,
			frp: 12.4,
			satellite: 'Suomi-NPP',
			fireType: 'detected',
		},
	],
};

const RISK_RESPONSE = {
	message: 'success',
	data: [
		{ date: '2026-08-11', risk: 'High' },
		{ date: '2026-08-12', risk: 'Moderate' },
	],
};

function makeCtx(): AmbeeContext {
	return { key: 'test-key', options: {}, db: {} } as unknown as AmbeeContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('fire.getLatestByLatLng', () => {
	it('calls fire/latest/by-lat-lng and returns the detected fires', async () => {
		mockRequest.mockResolvedValue(FIRE_RESPONSE);

		const result = await getLatestByLatLng(makeCtx(), {
			lat: 36.27347,
			lng: -106.70503,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'fire/latest/by-lat-lng',
			'test-key',
			{ query: { lat: 36.27347, lng: -106.70503, type: undefined } },
		);
		expect(result.data?.[0]?.frp).toBe(12.4);
	});

	it('forwards the reported/detected filter', async () => {
		mockRequest.mockResolvedValue(FIRE_RESPONSE);

		await getLatestByLatLng(makeCtx(), {
			lat: 36.27347,
			lng: -106.70503,
			type: 'reported',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'fire/latest/by-lat-lng',
			'test-key',
			{ query: { lat: 36.27347, lng: -106.70503, type: 'reported' } },
		);
	});
});

describe('fire.getLatestByPlace', () => {
	it('calls fire/latest/by-place with the place name', async () => {
		mockRequest.mockResolvedValue(FIRE_RESPONSE);

		await getLatestByPlace(makeCtx(), { place: 'Virgin, UT' });

		expect(mockRequest).toHaveBeenCalledWith(
			'fire/latest/by-place',
			'test-key',
			{ query: { place: 'Virgin, UT', type: undefined } },
		);
	});
});

describe('fire.getRiskByLatLng', () => {
	it('calls fire/risk/by-lat-lng and returns the risk forecast', async () => {
		mockRequest.mockResolvedValue(RISK_RESPONSE);

		const result = await getRiskByLatLng(makeCtx(), {
			lat: 22.948819,
			lng: -101.495951,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'fire/risk/by-lat-lng',
			'test-key',
			{ query: { lat: 22.948819, lng: -101.495951 } },
		);
		expect(result.data).toHaveLength(2);
	});
});

describe('fire.getRiskByPlace', () => {
	it('calls fire/risk/by-place and logs the event', async () => {
		mockRequest.mockResolvedValue(RISK_RESPONSE);

		await getRiskByPlace(makeCtx(), { place: 'Leon, Mexico' });

		expect(mockRequest).toHaveBeenCalledWith('fire/risk/by-place', 'test-key', {
			query: { place: 'Leon, Mexico' },
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.fire.getRiskByPlace',
			{ place: 'Leon, Mexico' },
			'completed',
		);
	});
});
