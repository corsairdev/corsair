import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeContext } from '../index';
import { getForecast, getHistory, getLatest } from './pollen';

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

const POLLEN_RESPONSE = {
	message: 'success',
	lat: 41.3874,
	lng: 2.1686,
	data: [
		{
			time: 1657000000,
			Count: { grass_pollen: 0, tree_pollen: 4, weed_pollen: 1 },
			Risk: {
				grass_pollen: 'Low',
				tree_pollen: 'Low',
				weed_pollen: 'Low',
			},
			updatedAt: '2026-08-06T09:00:00.000Z',
		},
	],
};

function makeCtx(): AmbeeContext {
	return { key: 'test-key', options: {}, db: {} } as unknown as AmbeeContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('pollen.getLatest', () => {
	it('sends coordinates for a geospatial lookup', async () => {
		mockRequest.mockResolvedValue(POLLEN_RESPONSE);

		const result = await getLatest(makeCtx(), { lat: 41.3874, lng: 2.1686 });

		expect(mockRequest).toHaveBeenCalledWith('v3/pollen/latest', 'test-key', {
			query: { lat: 41.3874, lng: 2.1686 },
		});
		expect(result.data?.[0]?.Risk?.tree_pollen).toBe('Low');
	});

	it('sends a place name for a placewise lookup', async () => {
		mockRequest.mockResolvedValue(POLLEN_RESPONSE);

		await getLatest(makeCtx(), { place: 'Barcelona' });

		expect(mockRequest).toHaveBeenCalledWith('v3/pollen/latest', 'test-key', {
			query: { place: 'Barcelona' },
		});
	});

	it('only sends speciesRisk when it is explicitly set', async () => {
		mockRequest.mockResolvedValue(POLLEN_RESPONSE);

		await getLatest(makeCtx(), { place: 'Barcelona', speciesRisk: true });

		expect(mockRequest).toHaveBeenCalledWith('v3/pollen/latest', 'test-key', {
			query: { place: 'Barcelona', speciesRisk: true },
		});
	});

	it('rejects an ambiguous location that supplies both place and coordinates', async () => {
		await expect(
			getLatest(makeCtx(), {
				lat: 41.3874,
				lng: 2.1686,
				place: 'Barcelona',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('pollen.getHistory', () => {
	it('normalises the time range for a placewise history lookup', async () => {
		mockRequest.mockResolvedValue(POLLEN_RESPONSE);

		await getHistory(makeCtx(), {
			place: 'Barcelona',
			from: '2026-07-14T14:00:15.000Z',
			to: '2026-07-16T14:00:21.000Z',
		});

		expect(mockRequest).toHaveBeenCalledWith('v3/pollen/history', 'test-key', {
			query: {
				place: 'Barcelona',
				from: '2026-07-14 14:00:15',
				to: '2026-07-16 14:00:21',
			},
		});
	});
});

describe('pollen.getForecast', () => {
	it('defaults to the 48-hour forecast path', async () => {
		mockRequest.mockResolvedValue(POLLEN_RESPONSE);

		await getForecast(makeCtx(), { lat: 38, lng: -97 });

		expect(mockRequest).toHaveBeenCalledWith(
			'v3/pollen/forecast/48hrs',
			'test-key',
			{ query: { lat: 38, lng: -97 } },
		);
	});

	it('uses the 120-hour path when that horizon is requested', async () => {
		mockRequest.mockResolvedValue(POLLEN_RESPONSE);

		await getForecast(makeCtx(), { place: 'california', hours: 120 });

		expect(mockRequest).toHaveBeenCalledWith(
			'v3/pollen/forecast/120hrs',
			'test-key',
			{ query: { place: 'california' } },
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'ambee.pollen.getForecast',
			{ place: 'california', hours: 120, speciesRisk: undefined },
			'completed',
		);
	});
});
