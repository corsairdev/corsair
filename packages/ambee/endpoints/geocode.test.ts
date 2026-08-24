import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeContext } from '../index';
import { byPlace, reverseByLatLng } from './geocode';

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

const GEOCODE_RESPONSE = {
	message: 'success',
	data: [
		{
			lat: '40.7127281',
			lng: '-74.0060152',
			city: 'New York',
			state: 'New York',
			countryCode: 'US',
			formattedAddress: 'New York, NY, USA',
		},
	],
};

const upsertByEntityId = jest.fn().mockResolvedValue(undefined);

function makeCtx(): AmbeeContext {
	return {
		key: 'test-key',
		options: {},
		db: { geocodedPlaces: { upsertByEntityId } },
	} as unknown as AmbeeContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
	upsertByEntityId.mockClear();
});

describe('geocode.byPlace', () => {
	it('calls geocode/by-place and returns the matches', async () => {
		mockRequest.mockResolvedValue(GEOCODE_RESPONSE);

		const result = await byPlace(makeCtx(), { place: 'new york' });

		expect(mockRequest).toHaveBeenCalledWith('geocode/by-place', 'test-key', {
			query: { place: 'new york' },
		});
		expect(result.data?.[0]?.city).toBe('New York');
	});

	it('persists each match under the originating query and coerces string coordinates', async () => {
		mockRequest.mockResolvedValue(GEOCODE_RESPONSE);

		await byPlace(makeCtx(), { place: 'new york' });

		const [entityId, row] = upsertByEntityId.mock.calls[0];
		expect(entityId).toBe('new york#0');
		expect(row).toMatchObject({
			query: 'new york',
			lat: 40.7127281,
			lng: -74.0060152,
			city: 'New York',
		});
	});

	it('preserves zero-valued coordinates when persisting', async () => {
		mockRequest.mockResolvedValue({
			message: 'success',
			data: [{ lat: '0', lng: '0', city: 'Null Island' }],
		});

		await byPlace(makeCtx(), { place: 'null island' });

		expect(upsertByEntityId.mock.calls[0][1]).toMatchObject({
			lat: 0,
			lng: 0,
			city: 'Null Island',
		});
	});
});

describe('geocode.reverseByLatLng', () => {
	it('calls geocode/reverse/by-lat-lng and keys stored results by coordinates', async () => {
		mockRequest.mockResolvedValue(GEOCODE_RESPONSE);

		await reverseByLatLng(makeCtx(), {
			lat: 42.66548262280807,
			lng: -73.79192663186527,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'geocode/reverse/by-lat-lng',
			'test-key',
			{ query: { lat: 42.66548262280807, lng: -73.79192663186527 } },
		);
		expect(upsertByEntityId.mock.calls[0][0]).toBe(
			'42.66548262280807,-73.79192663186527#0',
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.geocode.reverseByLatLng',
			{ lat: 42.66548262280807, lng: -73.79192663186527 },
			'completed',
		);
	});
});
